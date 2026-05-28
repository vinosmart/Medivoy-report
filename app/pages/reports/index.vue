<template>
  <div class="space-y-6">
    <section
      class="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-700 p-6 text-white shadow-xl sm:p-8"
    >
      <div
        class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div class="max-w-2xl">
          <span
            class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200 ring-1 ring-inset ring-white/10"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Reports center
          </span>
          <h3 class="mt-4 text-3xl font-bold sm:text-4xl">
            View, manage, and delete uploaded reports.
          </h3>
          <p class="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Search your reports, open the full analysis, and remove items you no
            longer need. This view is connected to live user data from your API.
          </p>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            to="/reports/upload"
            class="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm hover:bg-slate-100"
            >Upload report</NuxtLink
          >
          <button
            @click="loadReports"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10 disabled:opacity-60"
          >
            {{ loading ? "Refreshing..." : "Refresh" }}
          </button>
        </div>
      </div>
    </section>

    <section
      class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div
        class="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="relative w-full lg:max-w-md">
          <input
            v-model="search"
            type="text"
            placeholder="Search by title, type or status"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div
            class="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200"
          >
            {{ filteredReports.length }} report{{
              filteredReports.length === 1 ? "" : "s"
            }}
          </div>

          <label
            class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
          >
            <input
              v-model="selectAll"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Select all
          </label>

          <button
            @click="bulkDeleteSelected"
            :disabled="selectedIds.length === 0 || deletingBulk"
            class="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {{
              deletingBulk
                ? "Deleting..."
                : `Delete selected (${selectedIds.length})`
            }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="space-y-3">
        <div
          v-for="n in 3"
          :key="n"
          class="animate-pulse rounded-2xl border border-slate-200 p-4"
        >
          <div class="h-5 w-1/3 rounded bg-slate-200"></div>
          <div class="mt-3 h-3 w-1/4 rounded bg-slate-100"></div>
          <div class="mt-4 h-10 rounded-xl bg-slate-100"></div>
        </div>
      </div>

      <div v-else-if="filteredReports.length" class="space-y-3">
        <article
          v-for="report in filteredReports"
          :key="report.id"
          class="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
        >
          <div
            class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
          >
            <div class="flex min-w-0 flex-1 items-start gap-3">
              <input
                v-model="selectedIds"
                :value="report.id"
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="truncate text-base font-semibold text-slate-950">
                    {{ report.title }}
                  </h4>
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="statusClass(report.status)"
                    >{{ report.status }}</span
                  >
                  <span
                    class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                    >{{ report.type?.toUpperCase() }}</span
                  >
                </div>
                <p class="mt-2 text-xs text-slate-500">
                  {{ formatDate(report.createdAt) }}
                </p>
                <p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                  {{ report.aiSummary || "No summary available yet." }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div
                class="rounded-2xl bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-200"
              >
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
                  class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >View</NuxtLink
                >
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
        </article>
      </div>

      <div v-else class="rounded-2xl bg-slate-50 p-10 text-center">
        <p class="text-sm font-medium text-slate-700">
          {{ search ? "No matching reports found." : "No reports yet." }}
        </p>
        <p class="mt-2 text-sm text-slate-500">
          Upload a report to see it appear here with AI summary and risk score.
        </p>
        <NuxtLink
          to="/reports/upload"
          class="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >Upload report</NuxtLink
        >
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const reports = ref<any[]>([]);
const loading = ref(true);
const deletingId = ref<string | null>(null);
const deletingBulk = ref(false);
const search = ref("");
const selectedIds = ref<string[]>([]);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const filteredReports = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return reports.value;
  return reports.value.filter((report) =>
    [report.title, report.type, report.status]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q)),
  );
});

const selectAll = computed({
  get: () =>
    filteredReports.value.length > 0 &&
    filteredReports.value.every((r) => selectedIds.value.includes(r.id)),
  set: (value: boolean) => {
    selectedIds.value = value ? filteredReports.value.map((r) => r.id) : [];
  },
});

watch(filteredReports, (items) => {
  const ids = new Set(items.map((r) => r.id));
  selectedIds.value = selectedIds.value.filter((id) => ids.has(id));
});

const riskClass = (score?: number) =>
  !score
    ? "text-slate-500"
    : score >= 60
      ? "text-rose-600"
      : score >= 30
        ? "text-amber-600"
        : "text-emerald-600";
const statusClass = (status?: string) =>
  status === "completed"
    ? "bg-emerald-100 text-emerald-700"
    : status === "failed"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";

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
  if (!window.confirm("Delete this report?")) return;
  deletingId.value = id;
  try {
    await api.deleteReport(id);
    reports.value = reports.value.filter((r) => r.id !== id);
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  } finally {
    deletingId.value = null;
  }
};

const bulkDeleteSelected = async () => {
  if (!selectedIds.value.length) return;
  if (!window.confirm(`Delete ${selectedIds.value.length} selected reports?`))
    return;
  deletingBulk.value = true;
  try {
    for (const id of [...selectedIds.value]) {
      await api.deleteReport(id);
      reports.value = reports.value.filter((r) => r.id !== id);
    }
    selectedIds.value = [];
  } finally {
    deletingBulk.value = false;
  }
};

onMounted(loadReports);
</script>
