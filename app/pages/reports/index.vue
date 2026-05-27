<template>
  <div class="space-y-6">
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 class="text-2xl font-bold">Reports</h3>
        <p class="text-sm text-slate-500">
          View, manage, and delete uploaded reports.
        </p>
      </div>
      <NuxtLink
        to="/reports/upload"
        class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
      >
        Upload report
      </NuxtLink>
    </div>

    <div
      class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div
        class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="relative w-full sm:max-w-sm">
          <input
            v-model="search"
            type="text"
            placeholder="Search by title or type"
            class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>
        <button
          @click="loadReports"
          :disabled="loading"
          class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>
      </div>

      <div v-if="loading" class="space-y-3">
        <div
          v-for="n in 3"
          :key="n"
          class="animate-pulse rounded-2xl border border-slate-200 p-4"
        >
          <div class="h-4 w-1/3 rounded bg-slate-200"></div>
          <div class="mt-3 h-3 w-1/4 rounded bg-slate-100"></div>
        </div>
      </div>

      <div v-else-if="filteredReports.length" class="space-y-3">
        <div
          v-for="report in filteredReports"
          :key="report.id"
          class="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <div
            class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <p class="truncate text-base font-semibold text-slate-900">
                  {{ report.title }}
                </p>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="statusClass(report.status)"
                >
                  {{ report.status }}
                </span>
              </div>
              <p class="mt-2 text-xs text-slate-500">
                {{ report.type?.toUpperCase() }} ·
                {{ formatDate(report.createdAt) }}
              </p>
              <p class="mt-3 text-sm text-slate-600 line-clamp-2">
                {{ report.aiSummary || "No summary available yet." }}
              </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div class="rounded-2xl bg-slate-100 px-4 py-3 text-center">
                <p class="text-xs text-slate-500">Risk</p>
                <p
                  class="text-lg font-bold"
                  :class="riskClass(report.riskScore)"
                >
                  {{ report.riskScore ?? "-" }}
                </p>
              </div>

              <div class="flex gap-2">
                <NuxtLink
                  :to="`/reports/${report.id}`"
                  class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                >
                  View
                </NuxtLink>
                <button
                  @click="deleteReport(report.id)"
                  :disabled="deletingId === report.id"
                  class="rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                >
                  {{ deletingId === report.id ? "Deleting..." : "Delete" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-else class="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">
        {{ search ? "No matching reports found." : "No reports yet." }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const reports = ref<any[]>([]);
const loading = ref(true);
const deletingId = ref<string | null>(null);
const search = ref("");

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const filteredReports = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return reports.value;
  return reports.value.filter((report) => {
    return [report.title, report.type, report.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });
});

const riskClass = (score?: number) => {
  if (score == null) return "text-slate-500";
  if (score >= 60) return "text-rose-600";
  if (score >= 30) return "text-amber-600";
  return "text-emerald-600";
};

const statusClass = (status?: string) => {
  if (status === "completed") return "bg-emerald-100 text-emerald-700";
  if (status === "failed") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
};

const loadReports = async () => {
  loading.value = true;
  try {
    reports.value = await api.getReports();
  } catch {
    reports.value = [];
  } finally {
    loading.value = false;
  }
};

const deleteReport = async (id: string) => {
  const confirmed = window.confirm("Delete this report?");
  if (!confirmed) return;
  deletingId.value = id;
  try {
    await api.deleteReport(id);
    reports.value = reports.value.filter((report) => report.id !== id);
  } finally {
    deletingId.value = null;
  }
};

onMounted(loadReports);
</script>
