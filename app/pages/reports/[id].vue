<template>
  <div v-if="loading" class="text-center py-20"><p class="text-sm text-medivoy-500">Loading...</p></div>
  <div v-else-if="report" class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-start justify-between">
      <div><h2 class="text-xl font-bold text-medivoy-900">{{ report.title }}</h2><p class="text-sm text-medivoy-500 mt-1">{{ formatDate(report.createdAt) }} · {{ report.type?.toUpperCase() }}</p></div>
      <span :class="['text-sm font-bold px-3 py-1 rounded-lg', (report.riskScore||0)>40?'bg-rose-50 text-rose-700':(report.riskScore||0)>25?'bg-amber-50 text-amber-700':'bg-emerald-50 text-emerald-700']">Risk {{ report.riskScore ?? '-' }}</span>
    </div>
    <div class="bg-gradient-to-br from-medivoy-900 to-medivoy-800 rounded-2xl p-6 text-white">
      <p class="text-sm text-medivoy-200 uppercase tracking-wide mb-2">AI Summary</p>
      <p class="text-sm leading-relaxed">{{ report.aiSummary || 'No analysis available' }}</p>
    </div>
    <div v-if="report.ocrText" class="bg-white rounded-2xl border border-medivoy-200 p-6">
      <h3 class="text-sm font-semibold text-medivoy-900 mb-3">OCR Text</h3>
      <pre class="text-xs text-medivoy-600 bg-medivoy-50 p-4 rounded-xl overflow-auto max-h-60">{{ report.ocrText }}</pre>
    </div>
    <div v-if="report.recommendations?.length" class="bg-white rounded-2xl border border-medivoy-200 p-6">
      <h3 class="text-sm font-semibold text-medivoy-900 mb-3">Recommendations</h3>
      <ul class="space-y-2"><li v-for="(rec,i) in report.recommendations" :key="i" class="text-sm text-medivoy-700">• {{ rec }}</li></ul>
    </div>
    <div class="rounded-xl border border-amber-200 bg-amber-50 p-4"><p class="text-xs text-amber-800"><strong>Disclaimer:</strong> Medivoy provides preventive insights only. Always consult a healthcare professional.</p></div>
  </div>
  <div v-else class="text-center py-20"><p class="text-medivoy-500">Report not found.</p></div>
</template>

<script setup>
const api = useApi();
const route = useRoute();
const report = ref(null);
const loading = ref(true);
onMounted(async () => {
  try { report.value = await api.getReport(route.params.id); }
  catch (err) { console.error(err); }
  finally { loading.value = false; }
});
function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'}) : '-'; }
</script>
