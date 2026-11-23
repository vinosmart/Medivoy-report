<template>
  <div class="upload-page">
    <header class="upload-header">
      <div class="upload-heading-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M7 3h7l4 4v14H7V3Zm7 0v5h4M10 13h5M10 17h5" />
        </svg>
      </div>
      <div class="upload-heading-copy">
        <p class="upload-eyebrow"><span></span>Secure document intake</p>
        <h1><span>Upload</span> <span class="upload-title-accent">report</span></h1>
        <p>
          Add a lab report or scan. Medivoy will organize its markers and link it
          to the right person.
        </p>
      </div>
      <button
        type="submit"
        form="report-upload-form"
        :disabled="loading"
        class="submit-button header-submit"
      >
        <svg v-if="!loading" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4" />
        </svg>
        {{ loading ? "Uploading..." : "Upload report" }}
      </button>
    </header>

    <form id="report-upload-form" class="upload-form" @submit.prevent="submit">
      <div class="form-details-grid">
        <section class="form-section member-section">
          <div class="form-section-heading member-section-heading">
            <span class="section-index">01</span>
            <div>
              <h2>Assign to a person</h2>
              <p>Choose who this health report belongs to.</p>
            </div>
            <button
              type="button"
              @click="forMember = ''"
              :class="pillClass(forMember === '')"
              :aria-pressed="forMember === ''"
            >
              <span class="member-avatar">ME</span>
              <span>Myself</span>
            </button>
          </div>

          <div v-if="familyMembers.length" class="member-options">
            <button
              type="button"
              v-for="m in familyMembers"
              :key="m.id"
              @click="forMember = m.name"
              :class="pillClass(forMember === m.name)"
              :aria-pressed="forMember === m.name"
            >
              <span class="member-avatar">{{ String(m.name || "M").slice(0, 1).toUpperCase() }}</span>
              <span>{{ m.name }}<small>{{ m.relation }}</small></span>
            </button>
          </div>

          <div v-if="!familyMembers.length" class="family-empty">
            <div class="family-empty-message">
              <span class="family-empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 8v6m-3-3h6" />
                </svg>
              </span>
              <span>No family members added</span>
            </div>
            <NuxtLink to="/family" class="family-add-button">
              Add family member
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </NuxtLink>
          </div>
          <p class="form-helper">
            This keeps report insights and personalized guidance connected to the
            right person.
          </p>
        </section>

        <section class="form-section details-section">
          <div class="form-section-heading">
            <span class="section-index">02</span>
            <div>
              <h2>Report details</h2>
              <p>Add a title and select the report category.</p>
            </div>
          </div>

          <div class="field-grid">
            <div class="form-field">
              <label for="report-title">Report title</label>
              <input
                id="report-title"
                v-model="title"
                placeholder="e.g. Annual blood test"
              />
            </div>
            <div class="form-field">
              <label for="report-type">Report type</label>
              <select id="report-type" v-model="type">
                <option value="blood">Blood</option>
                <option value="dna">DNA</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <section class="form-section file-section">
        <div class="form-section-heading">
          <span class="section-index">03</span>
          <div>
            <h2>Choose a file</h2>
            <p>Upload a clear PDF or image of your report.</p>
          </div>
        </div>

        <label class="file-dropzone">
          <span class="file-drop-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4" />
            </svg>
          </span>
          <span class="file-drop-title">
            {{ fileName || "Choose a report to upload" }}
          </span>
          <span class="file-drop-subtitle">PDF, JPG, JPEG, or PNG</span>
          <input
            ref="fileInput"
            type="file"
            name="file"
            class="file-input"
            accept=".pdf,.jpg,.jpeg,.png,image/png,image/jpeg,application/pdf"
            @change="onFile"
          />
        </label>
      </section>

      <div v-if="previewUrl && isImage" class="file-preview">
        <img :src="previewUrl" alt="Selected image preview" />
      </div>
      <div v-else-if="previewUrl && isPdf" class="pdf-preview">
        <span class="pdf-preview-icon" aria-hidden="true">PDF</span>
        <span>{{ fileName }}</span>
      </div>

      <p
        v-if="message"
        class="form-message"
        :class="hasError ? 'message-error' : 'message-success'"
        role="status"
      >
        {{ message }}
      </p>

    </form>

    <ReportCard
      v-if="report"
      :report="report"
      :loading="false"
      :report-error="''"
    />
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const route = useRoute();

const title = ref("");
const type = ref("blood");
const file = ref<File | null>(null);
const fileName = ref("");
const previewUrl = ref("");
const forMember = ref<string>((route.query.for as string) || "");
const message = ref("");
const hasError = ref(false);
const loading = ref(false);
const report = ref<any | null>(null);
const familyMembers = ref<any[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const isImage = computed(
  () => !!file.value && file.value.type.startsWith("image/"),
);
const isPdf = computed(
  () => !!file.value && file.value.type === "application/pdf",
);

const pillClass = (active: boolean) => [
  "member-chip",
  active && "member-chip-active",
];

onMounted(async () => {
  try {
    familyMembers.value = await api.getFamilyMembers();
  } catch {
    familyMembers.value = [];
  }
});

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});

const onFile = (e: Event) => {
  hasError.value = false;
  message.value = "";

  const selected = (e.target as HTMLInputElement).files?.[0] || null;
  if (!selected) {
    file.value = null;
    fileName.value = "";
    previewUrl.value = "";
    return;
  }

  const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg"];
  const validByMime = allowedMimeTypes.includes(selected.type);
  const validByName = /\.(pdf|png|jpe?g)$/i.test(selected.name);

  if (!validByMime && !validByName) {
    hasError.value = true;
    message.value = "Only PDF, JPG, JPEG, and PNG files are allowed.";
    file.value = null;
    fileName.value = "";
    previewUrl.value = "";
    if (fileInput.value) fileInput.value.value = "";
    return;
  }

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);

  file.value = selected;
  fileName.value = selected.name;

  if (selected.type.startsWith("image/")) {
    previewUrl.value = URL.createObjectURL(selected);
  } else {
    previewUrl.value = "pdf";
  }
};

const resetFormFile = () => {
  file.value = null;
  fileName.value = "";
  if (previewUrl.value && previewUrl.value !== "pdf") {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

const submit = async () => {
  hasError.value = false;
  message.value = "";

  if (!file.value) {
    hasError.value = true;
    message.value = "Please select a file.";
    return;
  }

  loading.value = true;
  report.value = null;

  try {
    const fd = new FormData();
    fd.append("file", file.value);
    fd.append("title", title.value || file.value.name);
    fd.append("type", type.value);
    fd.append("forMember", forMember.value);

    const res = await api.uploadReport(fd);
    report.value = res;
    message.value = `Uploaded successfully for ${forMember.value || "Myself"}.`;
    resetFormFile();
  } catch (e: any) {
    hasError.value = true;
    message.value = e?.data?.message || e?.message || "Upload failed.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.upload-page {
  display:grid;
  gap:20px;
  width:min(100%,1080px);
  margin:0 auto;
  padding-bottom:32px;
  color:#253d5b;
  font-family:Poppins,system-ui,sans-serif;
}
.upload-header {
  position:relative;
  display:grid;
  grid-template-columns:auto minmax(0,1fr) auto;
  align-items:center;
  gap:18px;
  overflow:hidden;
  border:1px solid #e0eaf6;
  border-radius:18px;
  background:#fff;
  padding:22px 26px;
  box-shadow:0 10px 26px rgba(37,87,145,.045);
}
.upload-header::before {
  position:absolute;
  inset:0 0 auto;
  height:3px;
  background:linear-gradient(90deg,#3478cc,#9fc5ef 46%,#edf4fc);
  content:"";
}
.upload-heading-mark {
  width:54px;
  height:54px;
  display:grid;
  flex:0 0 auto;
  place-items:center;
  border:1px solid #0b1c39;
  border-radius:15px;
  background:#0b1c39;
  color:#fff;
}
.upload-heading-mark svg { width:23px; height:23px; fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }
.upload-heading-copy { min-width:0; }
.upload-eyebrow { display:flex; align-items:center; gap:8px; margin:0 0 6px; color:#6f88a6; font-size:10px; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
.upload-eyebrow span { width:6px; height:6px; border-radius:50%; background:#438cdf; box-shadow:0 0 0 3px #edf5ff; }
.upload-heading-copy h1 { margin:0; color:#1d3554; font-size:clamp(28px,3.2vw,36px); font-weight:700; line-height:1.2; letter-spacing:-.04em; }
.upload-title-accent { color:#438cdf; }
.upload-heading-copy p:last-child { max-width:670px; margin:7px 0 0; color:#7187a2; font-size:14px; line-height:1.6; }
.upload-form {
  display:grid;
  gap:14px;
}
.form-details-grid {
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  align-items:stretch;
  gap:14px;
}
.form-section {
  border:1px solid #e1eaf5;
  border-radius:16px;
  background:#fff;
  padding:22px 24px;
  box-shadow:0 8px 22px rgba(37,87,145,.04);
}
.form-section-heading { display:flex; align-items:center; gap:12px; margin-bottom:17px; }
.member-section-heading > div { min-width:0; flex:1; }
.member-section-heading > .member-chip { flex:0 0 auto; margin-left:auto; }
.section-index { width:31px; height:31px; display:grid; flex:0 0 auto; place-items:center; border:1px solid #dce8f6; border-radius:10px; background:#f7faff; color:#4381c2; font-size:11px; font-weight:800; }
.form-section-heading h2 { margin:0; color:#263f5e; font-size:16px; font-weight:700; letter-spacing:-.01em; }
.form-section-heading p { margin:3px 0 0; color:#8294aa; font-size:12px; line-height:1.5; }
.member-options { display:flex; flex-wrap:wrap; gap:9px; }
.member-chip {
  min-height:42px;
  display:inline-flex;
  align-items:center;
  gap:9px;
  border:1px solid #e0e8f2;
  border-radius:11px;
  background:#fff;
  padding:5px 13px 5px 6px;
  color:#526b89;
  font:600 13px Poppins,system-ui,sans-serif;
  cursor:pointer;
  transition:border-color .18s ease,background .18s ease,color .18s ease,transform .18s ease,box-shadow .18s ease;
}
.member-chip:hover { transform:translateY(-1px); border-color:#bfd5ef; background:#fbfdff; box-shadow:0 4px 10px rgba(37,87,145,.06); }
.member-chip-active { border-color:#8fb7e3; background:#f4f8ff; color:#2c6097; box-shadow:inset 0 0 0 1px rgba(67,140,223,.08); }
.member-avatar { width:28px; height:28px; display:grid; place-items:center; border-radius:8px; background:#f1f5fa; color:#7188a5; font-size:9px; font-weight:800; }
.member-chip-active .member-avatar { background:#e4effd; color:#3478cc; }
.member-chip small { display:block; margin-top:1px; color:#8b9bb0; font-size:10px; font-weight:500; text-align:left; }
.family-empty { min-height:58px; display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:12px; border:1px solid #e1eaf5; border-radius:12px; background:#fff; padding:8px 10px; color:#647d9a; font-size:12px; }
.family-empty-message { min-width:0; display:flex; align-items:center; gap:9px; font-weight:600; }
.family-empty-icon { width:34px; height:34px; display:grid; flex:0 0 auto; place-items:center; border:1px solid #0b1c39; border-radius:10px; background:#0b1c39; color:#fff; }
.family-empty-icon svg { width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }
.family-add-button { min-height:36px; display:inline-flex; flex:0 0 auto; align-items:center; justify-content:center; gap:6px; border:1px solid #d5e4f5; border-radius:9px; background:#fff; padding:0 10px; color:#3478cc; font-size:10px; font-weight:700; text-decoration:none; white-space:nowrap; transition:background .18s ease,border-color .18s ease,color .18s ease,transform .18s ease; }
.family-add-button:hover { border-color:#b6d2f0; background:#f5f9ff; color:#2867b4; }
.family-add-button svg { width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; transition:transform .18s ease; }
.family-add-button:hover { transform:translateY(-1px); }
.family-add-button:hover svg { transform:translateX(2px); }
.form-helper { margin:10px 0 0; color:#8798ad; font-size:12px; line-height:1.6; }
.field-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
.form-field { display:grid; gap:7px; min-width:0; }
.form-field label { color:#607894; font-size:10px; font-weight:800; letter-spacing:.09em; text-transform:uppercase; }
.form-field input,.form-field select {
  width:100%;
  min-width:0;
  height:44px;
  border:1px solid #dce6f1;
  border-radius:10px;
  outline:0;
  background:#fff;
  padding:0 12px;
  color:#2b4564;
  font:500 14px Poppins,system-ui,sans-serif;
  transition:border-color .18s ease,box-shadow .18s ease;
}
.form-field select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23536d8a' stroke-width='2'%3E%3Cpath d='m7 10 5 5 5-5'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 13px center; background-size:16px; padding-right:40px; cursor:pointer; }
.form-field input::placeholder { color:#9aabc0; opacity:1; }
.form-field input:focus,.form-field select:focus { border-color:#80afe4; box-shadow:0 0 0 2px rgba(67,140,223,.1); }
.app-main .upload-page .form-field input:not([type="checkbox"]):not([type="radio"]):focus,.app-main .upload-page .form-field select:focus { border-color:#80afe4; outline:0; box-shadow:0 0 0 2px rgba(67,140,223,.1); }
.file-dropzone {
  position:relative;
  min-height:150px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:7px;
  overflow:hidden;
  border:1px dashed #b9d1ed;
  border-radius:13px;
  background:#fff;
  padding:20px;
  text-align:center;
  cursor:pointer;
  transition:border-color .2s ease,background .2s ease,box-shadow .2s ease,transform .2s ease;
}
.file-dropzone:hover,.file-dropzone:focus-within { transform:translateY(-1px); border-color:#6fa2dc; background:#fbfdff; box-shadow:0 8px 18px rgba(52,120,204,.07); }
.file-drop-icon { width:38px; height:38px; display:grid; place-items:center; margin-bottom:2px; border:1px solid #0b1c39; border-radius:12px; background:#0b1c39; color:#fff; transition:transform .2s ease,background .2s ease,border-color .2s ease; }
.file-dropzone:hover .file-drop-icon,.file-dropzone:focus-within .file-drop-icon { transform:translateY(-2px); }
.file-drop-icon svg { width:19px; height:19px; fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
.file-drop-title { max-width:100%; overflow:hidden; color:#2d496b; font-size:14px; font-weight:700; text-overflow:ellipsis; white-space:nowrap; }
.file-drop-subtitle { color:#889bb2; font-size:11px; }
.file-input { position:absolute; width:1px; height:1px; overflow:hidden; opacity:0; }
.file-preview,.pdf-preview { overflow:hidden; border:1px solid #e1eaf5; border-radius:12px; background:#fff; }
.file-preview { display:flex; justify-content:center; padding:10px; }
.file-preview img { width:100%; max-height:360px; object-fit:contain; }
.pdf-preview { min-height:58px; display:flex; align-items:center; gap:10px; padding:10px 13px; color:#4f6784; font-size:13px; }
.pdf-preview-icon { width:34px; height:34px; display:grid; place-items:center; border:1px solid #f1dce0; border-radius:9px; background:#fff7f8; color:#b45b69; font-size:9px; font-weight:800; }
.submit-button {
  min-width:174px;
  min-height:48px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  border:1px solid #3478cc;
  border-radius:10px;
  background:linear-gradient(135deg,#438cdf,#286bc0);
  padding:0 17px;
  color:#fff;
  font:700 14px Poppins,system-ui,sans-serif;
  box-shadow:0 6px 14px rgba(52,120,204,.16);
  cursor:pointer;
  transition:background .18s ease,border-color .18s ease,box-shadow .18s ease,transform .18s ease;
}
.header-submit { min-width:168px; }
.submit-button svg { width:15px; height:15px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; transition:transform .2s ease; }
.submit-button:hover:not(:disabled) { transform:translateY(-1px); border-color:#2867b4; background:linear-gradient(135deg,#347bc9,#245fa8); box-shadow:0 9px 18px rgba(40,103,180,.2); }
.submit-button:disabled { opacity:.6; cursor:wait; }
.form-message { margin:0 24px 20px; border:1px solid transparent; border-radius:10px; padding:11px 13px; font-size:13px; font-weight:600; }
.message-error { border-color:#f1d8dd; background:#fff7f8; color:#ae4d5d; }
.message-success { border-color:#d8eadf; background:#f5faf7; color:#4d8465; }
.submit-button:focus-visible,.member-chip:focus-visible,.family-empty a:focus-visible { outline:3px solid rgba(67,140,223,.25); outline-offset:3px; }
.submit-button:hover:not(:disabled) svg { transform:translateY(-2px); }
.submit-button:active:not(:disabled) { transform:translateY(0) scale(.99); }
@keyframes upload-enter {
  from { opacity:0; translate:0 10px; }
  to { opacity:1; translate:0 0; }
}
.upload-header,.member-section,.details-section,.file-section {
  animation:upload-enter 500ms cubic-bezier(.22,.68,0,1) both;
}
.member-section { animation-delay:70ms; }
.details-section { animation-delay:130ms; }
.file-section { animation-delay:200ms; }
.file-preview,.pdf-preview,.form-message {
  animation:upload-enter 320ms cubic-bezier(.22,.68,0,1) both;
}
@media(max-width:860px) {
  .form-details-grid { grid-template-columns:1fr; }
}
@media(max-width:640px) {
  .upload-page { gap:15px; padding-bottom:24px; }
  .upload-header { grid-template-columns:auto minmax(0,1fr); align-items:flex-start; gap:12px; border-radius:15px; padding:18px 16px; }
  .header-submit { grid-column:1 / -1; width:100%; }
  .upload-heading-mark { width:42px; height:42px; border-radius:12px; }
  .upload-heading-mark svg { width:19px; height:19px; }
  .upload-heading-copy h1 { font-size:27px; }
  .upload-heading-copy p:last-child { font-size:12px; }
  .upload-form { gap:12px; }
  .form-details-grid { grid-template-columns:1fr; gap:12px; }
  .form-section { border-radius:14px; padding:18px 16px; }
  .field-grid { grid-template-columns:1fr; gap:12px; }
  .family-empty { align-items:flex-start; flex-direction:column; justify-content:center; }
  .family-empty-message { min-height:34px; }
  .family-add-button { width:100%; }
  .file-dropzone { min-height:138px; }
  .form-message { margin:0 16px 16px; }
}
@media(max-width:480px) {
  .member-section-heading { display:grid; grid-template-columns:31px minmax(0,1fr); }
  .member-section-heading > .member-chip { grid-column:2; margin-left:0; }
}
@media(prefers-reduced-motion:reduce) {
  .upload-header,.member-section,.details-section,.file-section,
  .file-preview,.pdf-preview,.form-message {
    animation:none;
    translate:none;
  }
  .upload-header,.form-section,.member-chip,.family-add-button,
  .family-add-button svg,.file-dropzone,.file-drop-icon,.submit-button,
  .submit-button svg {
    transition:none;
  }
  .member-chip:hover,.family-add-button:hover,.file-dropzone:hover,
  .file-dropzone:focus-within,.submit-button:hover:not(:disabled),
  .submit-button:active:not(:disabled),.file-dropzone:hover .file-drop-icon,
  .file-dropzone:focus-within .file-drop-icon,.family-add-button:hover svg,
  .submit-button:hover:not(:disabled) svg {
    transform:none;
  }
}
</style>
