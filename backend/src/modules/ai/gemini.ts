const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash';

interface GeminiOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } };

const TRANSCRIBE_PROMPT = `Transcribe all text in this medical document exactly as written.
Keep every test name, result value, unit and reference range on the same line, in the order they appear.
Preserve section headings. Do not summarise, interpret or add anything. Output plain text only.`;

// Calls Gemini and returns the raw response text.
// Retries on 429/503 with backoff since Gemini returns these during demand spikes.
async function geminiGenerate(
  apiKey: string,
  systemPrompt: string | null,
  parts: GeminiPart[],
  json: boolean,
  options: GeminiOptions = {},
): Promise<string> {
  const model = options.model || DEFAULT_GEMINI_MODEL;
  const body = JSON.stringify({
    ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
    contents: [{ role: 'user', parts }],
    generationConfig: {
      ...(json ? { responseMimeType: 'application/json' } : {}),
      ...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
      ...(options.maxOutputTokens ? { maxOutputTokens: options.maxOutputTokens } : {}),
    },
  });

  const retryDelaysMs = [2000, 5000, 10000];

  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt++) {
    const response = await fetch(`${GEMINI_BASE_URL}/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body,
    });

    if (response.ok) {
      const data = await response.json();
      const resParts = data?.candidates?.[0]?.content?.parts || [];
      return resParts.map((p: any) => p.text || '').join('').trim();
    }

    const errText = await response.text();
    if (attempt < retryDelaysMs.length && (response.status === 429 || response.status === 503)) {
      await new Promise((r) => setTimeout(r, retryDelaysMs[attempt]));
      continue;
    }
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  throw new Error('Gemini API error: no response');
}

// Calls Gemini in JSON mode and returns the raw JSON text.
export function geminiGenerateJson(
  apiKey: string,
  systemPrompt: string | null,
  userText: string,
  options: GeminiOptions = {},
): Promise<string> {
  return geminiGenerate(apiKey, systemPrompt, [{ text: userText }], true, options);
}

// Reads an image or PDF and returns its text, as a replacement for OCR.
export function geminiTranscribe(
  apiKey: string,
  mimeType: string,
  base64Data: string,
  options: GeminiOptions = {},
): Promise<string> {
  return geminiGenerate(
    apiKey,
    null,
    [{ inlineData: { mimeType, data: base64Data } }, { text: TRANSCRIBE_PROMPT }],
    false,
    { temperature: 0, ...options },
  );
}
