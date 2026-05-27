<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-medivoy-900">My Reports</h2>
      <NuxtLink to="/reports/upload" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-medivoy-accent text-white text-sm font-medium hover:bg-medivoy-accent-dark">Upload Report</NuxtLink>
    </div>
    <div v-if="loading" class="text-center py-12"><p class="text-sm text-medivoy-500">Loading...</p></div>
    <div v-else-if="error" class="text-center py-12">
      <p class="text-sm text-rose-500">{{ error }}</p>
      <button @click="loadReports" class="text-sm text-medivoy-accent mt-2">Retry</button>
    </div>
    <div v-else-if="reports.length === 0" class="text-center py-12"><p class="text-sm text-medivoy-500">No reports yet.</p></div>
    <div v-else class="bg-white rounded-2xl border border-medivoy-200 overflow-hidden">
      <table class="w-full text-sm text-left">
        <thead class="bg-medivoy-50 text-xs text-medivoy-600 uppercase"><tr><th class="px-6 py-3">Report</th><th class="px-6 py-3">Type</th><th class="px-6 py-3">Date</th><th class="px-6 py-3">Risk</th></tr></thead>
        <tbody class="divide-y divide-medivoy-100">
          <tr v-for="r in reports" :key="r.id" class="hover:bg-medivoy-50 cursor-pointer" @click="goToReport(r.id)">
            <td class="px-6 py-4 font-medium text-medivoy-900">{{ r.title }}</td>
            <td class="px-6 py-4 capitalize text-medivoy-600">{{ r.type }}</td>
            <td class="px-6 py-4 text-medivoy-500">{{ formatDate(r.createdAt) }}</td>
            <td class="px-6 py-4"><span :class="['text-sm font-semibold', (r.riskScore||0)>40?'text-rose-600':(r.riskScore||0)>25?'text-amber-600':'text-emerald-600']">{{ r.riskScore ?? '-' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const api = useApi();
const auth = useAuthStore();
const reports = ref([]);
const loading = ref(true);
const error = ref("");

async function loadReports() {
  loading.value = true;
  error.value = "";
  try {
    if (!auth.token) {
      error.value = "Not authenticated. Please log in again.";
      return;
    }
    reports.value = await api.getReports();
  } catch (err) {
    error.value = err?.data?.message || "Failed to load reports";
    if (err?.statusCode === 401) error.value = "Session expired. Please log in again.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadReports();
});

function goToReport(id) { router.push(`/reports/${id}`); }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'}) : '-'; }
</script>
