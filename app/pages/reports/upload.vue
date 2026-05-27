<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl border border-medivoy-200 p-8">
      <h2 class="text-lg font-semibold text-medivoy-900 mb-1">Upload Health Report</h2>
      <p class="text-sm text-medivoy-500 mb-6">AI will analyze blood tests, MRIs, prescriptions.</p>
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-medivoy-500 mb-1.5">Title</label>
          <input v-model="title" type="text" class="w-full px-4 py-2.5 rounded-xl border border-medivoy-200 text-sm focus:outline-none focus:ring-2 focus:ring-medivoy-accent" placeholder="e.g. Annual Blood Test 2026" />
        </div>
        <div>
          <label class="block text-xs font-medium text-medivoy-500 mb-1.5">Type</label>
          <select v-model="type" class="w-full px-4 py-2.5 rounded-xl border border-medivoy-200 text-sm">
            <option value="blood">Blood Test</option>
            <option value="mri">MRI / CT Scan</option>
            <option value="prescription">Prescription</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-medivoy-500 mb-1.5">File</label>
          <input type="file" @change="onFileChange" accept=".pdf,.png,.jpg,.jpeg" class="w-full px-4 py-2.5 rounded-xl border border-medivoy-200 text-sm" />
        </div>
        <button @click="handleUpload" :disabled="!file || uploading" class="w-full py-2.5 rounded-xl bg-medivoy-accent hover:bg-medivoy-accent-dark text-white font-semibold text-sm transition-colors disabled:opacity-50">
          {{ uploading ? 'Analyzing...' : 'Upload & Analyze' }}
        </button>
        <p v-if="uploadError" class="text-xs text-rose-600 text-center bg-rose-50 p-2 rounded-lg">{{ uploadError }}</p>
      </div>
    </div>
    <div v-if="result" class="bg-white rounded-2xl border border-medivoy-200 p-8">
      <h3 class="text-lg font-semibold text-medivoy-900">Analysis Complete</h3>
      <p class="text-sm text-medivoy-700 mt-2">{{ result.aiSummary }}</p>
    </div>
  </div>
</template>

<script setup>
const api = useApi();
const router = useRouter();
const title = ref("");
const type = ref("blood");
const file = ref(null);
const uploading = ref(false);
const uploadError = ref("");
const result = ref(null);

function onFileChange(e) {
  file.value = e.target.files?.[0] || null;
}

async function handleUpload() {
  if (!file.value) {
    uploadError.value = "Please select a file";
    return;
  }
  uploading.value = true;
  uploadError.value = "";
  result.value = null;
  try {
    result.value = await api.uploadReport(title.value || file.value.name, type.value, file.value);
    if (result.value?.id) {
      setTimeout(() => router.push(`/reports/${result.value.id}`), 1000);
    }
  } catch (err) {
    console.error("Upload error:", err);
    uploadError.value = err?.data?.message || err?.message || "Upload failed. Are you logged in?";
  } finally {
    uploading.value = false;
  }
}
</script>
