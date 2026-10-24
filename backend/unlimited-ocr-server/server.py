import os
import io
import re
import base64
import asyncio
import functools
import tempfile
import logging
from contextlib import asynccontextmanager
from typing import Optional

os.environ.setdefault("HF_HOME", os.path.join(os.environ.get("TEMP", os.path.expanduser("~")), "hf-cache"))
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")

import transformers.utils.import_utils
if not hasattr(transformers.utils.import_utils, 'is_torch_fx_available'):
    def _is_torch_fx_available():
        try:
            import torch.fx  # noqa: F401
            return True
        except ImportError:
            return False
    transformers.utils.import_utils.is_torch_fx_available = _is_torch_fx_available

import torch
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("unlimited-ocr")

MODEL_NAME = os.getenv("UNLIMITED_OCR_MODEL", "baidu/Unlimited-OCR")
DEVICE = os.getenv("UNLIMITED_OCR_DEVICE", "cuda" if torch.cuda.is_available() else "cpu")
# The model's remote code hardcodes image tensors to .to(torch.bfloat16)
# regardless of device, so the model itself must be loaded in bfloat16 too
# (otherwise conv weights end up float32 while inputs are bfloat16).
DTYPE = torch.bfloat16
OCR_TIMEOUT = int(os.getenv("UNLIMITED_OCR_TIMEOUT", "300"))

if DEVICE != "cuda":
    # The model's own remote code (modeling_unlimitedocr.py) hardcodes .cuda()
    # calls throughout infer()/infer_multi(), so it crashes on CPU-only setups.
    # Redirect .cuda() to the actual inference device instead.
    def _cuda_to_device(self, *args, **kwargs):
        return self.to(DEVICE)
    torch.Tensor.cuda = _cuda_to_device

model = None
tokenizer = None


_DET_TAG_RE = re.compile(r"<\|det\|>[^<]*<\|/det\|>")


def clean_ocr_text(raw: str) -> str:
    """Strip the model's layout bounding-box markup and turn <PAGE> markers
    into readable separators, so the response is plain readable text."""
    text = _DET_TAG_RE.sub("", raw)
    pages = [p.strip() for p in text.split("<PAGE>") if p.strip()]
    return "\n\n---\n\n".join(pages) if pages else text.strip()


def pdf_to_images(pdf_bytes: bytes, dpi: int = 300):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    tmp_dir = tempfile.mkdtemp(prefix="unlimited_ocr_pdf_")
    mat = fitz.Matrix(dpi / 72, dpi / 72)
    paths = []
    for i, page in enumerate(doc):
        out = os.path.join(tmp_dir, f"page_{i + 1:04d}.png")
        page.get_pixmap(matrix=mat).save(out)
        paths.append(out)
    doc.close()
    return paths, tmp_dir


def _get_cached_model_path() -> str:
    hf_home = os.environ.get("HF_HOME", "") or os.path.join(os.environ.get("TEMP", ""), "hf-cache")
    base = os.path.join(hf_home, "hub", "models--baidu--Unlimited-OCR")
    snapshots_dir = os.path.join(base, "snapshots")
    if os.path.isdir(snapshots_dir):
        for snap in sorted(os.listdir(snapshots_dir), reverse=True):
            snap_path = os.path.join(snapshots_dir, snap)
            if os.path.isdir(snap_path) and os.path.exists(os.path.join(snap_path, "model-00001-of-000001.safetensors")):
                logger.info(f"Found cached model at: {snap_path}")
                return snap_path
    return MODEL_NAME


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, tokenizer
    logger.info(f"Loading Unlimited-OCR model: {MODEL_NAME} on {DEVICE}")
    from transformers import AutoModel, AutoTokenizer

    model_path = _get_cached_model_path()
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
    model = AutoModel.from_pretrained(
        model_path,
        trust_remote_code=True,
        use_safetensors=True,
        torch_dtype=DTYPE,
    )
    model = model.eval().to(DEVICE)
    logger.info("Model loaded successfully")
    yield
    model = None
    tokenizer = None


app = FastAPI(title="Unlimited-OCR Server", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class OCRResponse(BaseModel):
    text: str
    pages: int = 1


class HealthResponse(BaseModel):
    status: str
    model: str
    device: str
    loaded: bool


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        model=MODEL_NAME,
        device=DEVICE,
        loaded=model is not None,
    )


@app.post("/ocr/image", response_model=OCRResponse)
async def ocr_image(
    file: UploadFile = File(...),
    prompt: str = Form("document parsing."),
    image_size: int = Form(640),
    base_size: int = Form(1024),
    crop_mode: bool = Form(True),
    max_length: int = Form(32768),
    no_repeat_ngram_size: int = Form(35),
    ngram_window: int = Form(128),
):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    contents = await file.read()
    tmp_path = None
    out_dir = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        full_prompt = f"<image>{prompt}"
        out_dir = tempfile.mkdtemp(prefix="uocr_out_")
        # model.infer() is a long, blocking, synchronous call. Running it
        # directly in this async endpoint would block the whole event loop
        # (including /health) for the entire duration, so offload it to a
        # worker thread instead.
        infer_fn = functools.partial(
            model.infer,
            tokenizer,
            prompt=full_prompt,
            image_file=tmp_path,
            output_path=out_dir,
            base_size=base_size,
            image_size=image_size,
            crop_mode=crop_mode,
            max_length=max_length,
            no_repeat_ngram_size=no_repeat_ngram_size,
            ngram_window=ngram_window,
            save_results=False,
            eval_mode=True,
        )
        result = await asyncio.get_event_loop().run_in_executor(None, infer_fn)
        raw_text = result if isinstance(result, str) else (result.get("text", "") if isinstance(result, dict) else str(result))
        return OCRResponse(text=clean_ocr_text(raw_text), pages=1)
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
        if out_dir and os.path.exists(out_dir):
            import shutil
            shutil.rmtree(out_dir, ignore_errors=True)


@app.post("/ocr/pdf", response_model=OCRResponse)
async def ocr_pdf(
    file: UploadFile = File(...),
    prompt: str = Form("Multi page parsing."),
    image_size: int = Form(1024),
    max_length: int = Form(32768),
    no_repeat_ngram_size: int = Form(35),
    ngram_window: int = Form(1024),
):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    contents = await file.read()
    image_paths = []
    tmp_dir = None
    out_dir = None
    try:
        image_paths, tmp_dir = pdf_to_images(contents, dpi=300)
        if not image_paths:
            raise HTTPException(status_code=400, detail="No pages extracted from PDF")

        full_prompt = f"<image>{prompt}"
        out_dir = tempfile.mkdtemp(prefix="uocr_out_")
        # Offload the blocking inference call to a worker thread so it
        # doesn't stall the event loop (see comment in ocr_image above).
        infer_fn = functools.partial(
            model.infer_multi,
            tokenizer,
            prompt=full_prompt,
            image_files=image_paths,
            output_path=out_dir,
            image_size=image_size,
            max_length=max_length,
            no_repeat_ngram_size=no_repeat_ngram_size,
            ngram_window=ngram_window,
            save_results=False,
        )
        result = await asyncio.get_event_loop().run_in_executor(None, infer_fn)
        if isinstance(result, tuple):
            raw_text = result[0]
        elif isinstance(result, dict):
            raw_text = result.get("text", "")
        else:
            raw_text = str(result)
        return OCRResponse(text=clean_ocr_text(raw_text), pages=len(image_paths))
    finally:
        if out_dir and os.path.exists(out_dir):
            import shutil
            shutil.rmtree(out_dir, ignore_errors=True)
        for p in image_paths:
            try:
                if os.path.exists(p):
                    os.unlink(p)
            except OSError:
                pass
        if tmp_dir and os.path.exists(tmp_dir):
            try:
                os.rmdir(tmp_dir)
            except OSError:
                pass


if __name__ == "__main__":
    port = int(os.getenv("UNLIMITED_OCR_PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
