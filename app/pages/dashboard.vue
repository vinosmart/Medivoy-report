<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-medivoy-200 p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-medivoy-500 uppercase tracking-wide">Health Score</p>
            <p class="text-2xl font-bold text-medivoy-900 mt-1">{{ stats.healthScore }}</p>
          </div>
          <span :class="['text-xs font-semibold px-2 py-1 rounded-lg', stats.healthScore >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700']">{{ stats.healthScore >= 80 ? 'Excellent' : 'Good' }}</span>
        </div>
        <div class="mt-3 h-1.5 bg-medivoy-100 rounded-full overflow-hidden"><div class="h-full rounded-full bg-medivoy-accent" :style="{ width: stats.healthScore + '%' }"></div></div>
      </div>
      <div class="bg-white rounded-2xl border border-medivoy-200 p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-medivoy-500 uppercase tracking-wide">Risk Score</p>
            <p class="text-2xl font-bold text-medivoy-900 mt-1">{{ stats.riskScore }}</p>
          </div>
          <span :class="['text-xs font-semibold px-2 py-1 rounded-lg', stats.riskScore > 40 ? 'bg-rose-50 text-rose-700' : stats.riskScore > 25 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700']">{{ stats.riskScore > 40 ? 'High' : stats.riskScore > 25 ? 'Moderate' : 'Low' }}</span>
        </div>
        <div class="mt-3 h-1.5 bg-medivoy-100 rounded-full overflow-hidden"><div class="h-full rounded-full bg-medivoy-warning" :style="{ width: stats.riskScore + '%' }"></div></div>
      </div>
      <div class="bg-white rounded-2xl border border-medivoy-200 p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-medivoy-500 uppercase tracking-wide">Biological Age</p>
            <p class="text-2xl font-bold text-medivoy-900 mt-1">{{ stats.bioAge }} <span class="text-sm font-normal text-medivoy-500">yrs</span></p>
          </div>
          <span class="text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700">-{{ stats.bioAgeDiff }} yrs</span>
        </div>
        <p class="text-xs text-medivoy-500 mt-3">Chronological: {{ stats.chronologicalAge }} yrs</p>
      </div>
      <div class="bg-white rounded-2xl border border-medivoy-200 p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-medivoy-500 uppercase tracking-wide">Reports</p>
            <p class="text-2xl font-bold text-medivoy-900 mt-1">{{ stats.reportCount }}</p>
          </div>
          <NuxtLink to="/reports/upload" class="text-xs font-semibold text-medivoy-accent hover:text-medivoy-accent-dark">+ Upload</NuxtLink>
        </div>
        <p class="text-xs text-medivoy-500 mt-3">Last: {{ stats.lastUpload || "—" }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl border border-medivoy-200 p-6"><h3 class="text-sm font-semibold text-medivoy-900 mb-4">Health Score Trend</h3></div>
      <div class="bg-white rounded-2xl border border-medivoy-200 p-6"><h3 class="text-sm font-semibold text-medivoy-900 mb-4">Biological Age Trend</h3></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-2xl border border-medivoy-200 p-6">
        <div class="flex items-center justify-between mb-4"><h3 class="text-sm font-semibold text-medivoy-900">Recent Reports</h3><NuxtLink to="/reports" class="text-xs font-medium text-medivoy-accent hover:text-medivoy-accent-dark">View All</NuxtLink></div>
        <div v-if="recentReports.length === 0" class="text-center py-8"><p class="text-sm text-medivoy-500">No reports yet. <NuxtLink to="/reports/upload" class="text-medivoy-accent">Upload one</NuxtLink></p></div>
        <div v-else class="space-y-3">
          <div v-for="report in recentReports" :key="report.id" class="flex items-center justify-between p-4 rounded-xl border border-medivoy-100 hover:border-medivoy-300 transition-colors cursor-pointer" @click="goToReport(report.id)">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-medivoy-100 flex items-center justify-center"><svg class="w-5 h-5 text-medivoy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></div>
              <div><p class="text-sm font-medium text-medivoy-900">{{ report.title }}</p><p class="text-xs text-medivoy-500">{{ formatDate(report.createdAt) }} · {{ report.type?.toUpperCase() }}</p></div>
            </div>
            <span :class="['text-xs font-semibold px-2.5 py-1 rounded-lg', (report.riskScore || 0) > 40 ? 'bg-rose-50 text-rose-700' : (report.riskScore || 0) > 25 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700']">Risk {{ report.riskScore ?? '-' }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-medivoy-200 p-6">
        <h3 class="text-sm font-semibold text-medivoy-900 mb-4">Abnormal Markers</h3>
        <div class="space-y-3">
          <div v-for="marker in abnormalMarkers" :key="marker.name" class="p-3 rounded-xl border border-amber-100 bg-amber-50">
            <div class="flex items-center justify-between"><p class="text-sm font-medium text-amber-900">{{ marker.name }}</p><span class="text-xs font-semibold text-amber-700">{{ marker.value }} {{ marker.unit }}</span></div>
            <p class="text-xs mt-1 text-amber-600">Ref: {{ marker.referenceRange }}</p>
          </div>
          <p v-if="abnormalMarkers.length === 0" class="text-sm text-medivoy-500 text-center py-4">All markers within normal range.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const api = useApi();
const stats = ref({ healthScore: 87, riskScore: 24, bioAge: 35, bioAgeDiff: 3, chronologicalAge: 38, reportCount: 0, lastUpload: null });
const recentReports = ref([]);
const abnormalMarkers = ref([]);

onMounted(async () => {
  try {
    const reports = await api.getReports();
    stats.value.reportCount = reports.length;
    recentReports.value = reports.slice(0, 3);
    if (reports.length > 0) {
      stats.value.lastUpload = formatDate(reports[0].createdAt);
      const avgRisk = reports.reduce((sum, r) => sum + (r.riskScore || 0), 0) / reports.length;
      stats.value.riskScore = Math.round(avgRisk) || 24;
      stats.value.healthScore = Math.max(50, 100 - stats.value.riskScore);
    }
  } catch (err) { console.error('Dashboard load error:', err); }
});

function goToReport(id) { router.push(`/reports/${id}`); }
function formatDate(date) { if (!date) return '—'; return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
</script>
