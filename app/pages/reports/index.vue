<template>
  <div class="space-y-6">
    <PageHeading
      :icon="IconFiles"
      title="Your health reports"
      description="Search your uploaded records, review their analysis, and manage the files in your health history."
      eyebrow="Reports"
    >
      <template #actions>
          <NuxtLink
            to="/reports/upload"
            class="medivoy-primary-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900 active:scale-[0.98]"
          >
            <IconUpload :size="18" aria-hidden="true" />
            Upload report
          </NuxtLink>
          <button
            @click="loadReports"
            :disabled="loading"
            class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IconRefresh
              :size="18"
              :class="{ 'motion-safe:animate-spin': loading }"
              aria-hidden="true"
            />
            {{ loading ? "Refreshing..." : "Refresh" }}
          </button>
      </template>
    </PageHeading>

    <section
      class="rounded-3xl border border-cyan-100/80 bg-white p-4 shadow-[0_14px_38px_-30px_rgba(14,116,144,0.42)] sm:p-6"
    >
      <div
        class="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="relative w-full lg:max-w-lg">
          <IconSearch
            :size="18"
            :stroke-width="1.8"
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            v-model="search"
            type="text"
            :placeholder="animatedSearchPlaceholder"
            aria-label="Search reports"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 hover:border-cyan-300 focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />
          <button
            v-if="search"
            type="button"
            class="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Clear search"
            @click="search = ''"
          >
            <IconX :size="16" :stroke-width="1.8" aria-hidden="true" />
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div
            class="rounded-xl border border-cyan-100 bg-cyan-50 px-3.5 py-2.5 text-sm font-semibold text-cyan-900"
          >
            {{ reportCountLabel }}
          </div>

          <ProfessionalCheckbox
            v-model="selectAll"
            :disabled="loading || !!loadError || filteredReports.length === 0"
            aria-label="Select all reports"
            class="rounded-xl border border-slate-200 bg-white px-3.5"
          >
            Select all
          </ProfessionalCheckbox>

          <button
            @click="bulkDeleteSelected"
            :disabled="!!loadError || selectedIds.length === 0 || deletingBulk"
            :class="
              selectedIds.length
                ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100'
                : 'border border-slate-200 bg-slate-100 text-slate-500'
            "
            class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <IconTrash :size="16" aria-hidden="true" />
            {{
              deletingBulk
                ? "Deleting..."
                : `Delete selected (${selectedIds.length})`
            }}
          </button>
        </div>
      </div>

      <div
        v-if="actionError"
        role="alert"
        class="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
      >
        {{ actionError }}
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

      <div
        v-else-if="loadError"
        class="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"
      >
        <p role="alert" class="text-sm font-medium text-rose-800">
          {{ loadError }}
        </p>
        <button
          type="button"
          class="medivoy-primary-button mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-cyan-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-900"
          @click="loadReports"
        >
          Try again
        </button>
      </div>

      <div v-else-if="filteredReports.length" class="space-y-3">
        <article
          v-for="report in filteredReports"
          :key="report.id"
          class="group rounded-2xl border p-4 transition duration-200 motion-reduce:transition-none"
          :class="
            selectedIds.includes(report.id)
              ? 'border-cyan-300 bg-cyan-50/50 shadow-sm'
              : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50/20 hover:shadow-[0_12px_28px_-20px_rgba(14,116,144,0.5)]'
          "
        >
          <div
            class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
          >
            <div class="flex min-w-0 flex-1 items-start gap-3">
              <ProfessionalCheckbox
                :model-value="selectedIds.includes(report.id)"
                :aria-label="`Select ${report.title}`"
                class="mt-0.5"
                @update:model-value="toggleReportSelection(report.id, $event)"
              />
              <span
                class="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-800 ring-1 ring-inset ring-cyan-100 transition group-hover:bg-white"
                aria-hidden="true"
              >
                <IconFileText :size="19" :stroke-width="1.8" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="truncate text-base font-semibold text-slate-950">
                    {{ report.title }}
                  </h4>
                  <span
                    class="rounded-full border px-2.5 py-1 text-xs font-semibold"
                    :class="statusClass(report.status)"
                    >{{ statusLabel(report.status) }}</span
                  >
                  <span
                    class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600"
                    >{{ report.type?.toUpperCase() }}</span
                  >
                </div>
                <p class="mt-2 text-xs font-medium text-slate-500">
                  {{ formatDate(report.createdAt) }}
                </p>
                <p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                  {{ report.aiSummary || report.summary || "No summary is available for this report yet." }}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <div
                class="min-w-[4.25rem] rounded-2xl border px-3 py-2.5 text-center transition-colors"
                :class="healthScoreSurfaceClass(reportScore(report))"
              >
                <p class="text-xs font-medium">Health score</p>
                <p
                  class="mt-0.5 text-lg font-bold tabular-nums"
                  :class="healthScoreClass(reportScore(report))"
                >
                  {{ reportScore(report) ?? "-" }}
                </p>
              </div>

              <div class="flex gap-2">
                <NuxtLink
                  :to="`/reports/${report.id}`"
                  class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-900 transition hover:border-cyan-400 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  <IconEye :size="16" aria-hidden="true" />
                  View
                </NuxtLink>
                <button
                  @click="deleteReport(report.id)"
                  :disabled="deletingId === report.id"
                  :aria-label="`Delete ${report.title}`"
                  class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                >
                  <IconLoader2
                    v-if="deletingId === report.id"
                    :size="16"
                    class="motion-safe:animate-spin"
                    aria-hidden="true"
                  />
                  <IconTrash v-else :size="16" aria-hidden="true" />
                  {{ deletingId === report.id ? "Deleting..." : "Delete" }}
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="rounded-2xl border border-slate-200 bg-slate-50/80 p-10 text-center">
        <p class="text-sm font-medium text-slate-700">
          {{ search ? "No matching reports found." : "No reports yet." }}
        </p>
        <p class="mt-2 text-sm text-slate-500">
          Upload a report to see it appear here with AI summary and risk score.
        </p>
        <NuxtLink
          to="/reports/upload"
          class="medivoy-primary-button mt-4 inline-flex items-center justify-center rounded-xl bg-cyan-800 px-4 py-3 text-sm font-semibold text-white! shadow-lg shadow-cyan-900/15 transition hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 active:scale-[0.98]"
          >Upload report</NuxtLink
        >
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import IconEye from "@tabler/icons-vue/icons/IconEye";
import IconFileText from "@tabler/icons-vue/icons/IconFileText";
import IconFiles from "@tabler/icons-vue/icons/IconFiles";
import IconLoader2 from "@tabler/icons-vue/icons/IconLoader2";
import IconRefresh from "@tabler/icons-vue/icons/IconRefresh";
import IconSearch from "@tabler/icons-vue/icons/IconSearch";
import IconTrash from "@tabler/icons-vue/icons/IconTrash";
import IconUpload from "@tabler/icons-vue/icons/IconUpload";
import IconX from "@tabler/icons-vue/icons/IconX";
import { getApiErrorMessage } from "~/utils/apiError";
import { getDeduplicatedReports } from "~/utils/getDeduplicatedReports";

const api = useMedivoyApi();
const auth = useAuthStore();
const reports = ref<any[]>([]);
const loading = ref(true);
const deletingId = ref<string | null>(null);
const deletingBulk = ref(false);
const search = ref("");
const animatedSearchPlaceholder = useAnimatedPlaceholder([
  "Search by title",
  "Search by report type",
  "Search by status",
]);
const selectedIds = ref<string[]>([]);
const loadError = ref("");
const actionError = ref("");

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

const reportCountLabel = computed(() => {
  if (loading.value) return "Loading reports";
  if (loadError.value) return "Reports unavailable";
  return `${filteredReports.value.length} report${filteredReports.value.length === 1 ? "" : "s"}`;
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

const toggleReportSelection = (id: string, selected: boolean) => {
  if (selected) {
    if (!selectedIds.value.includes(id)) selectedIds.value.push(id);
  } else {
    selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== id);
  }
};

const reportScore = (report: any): number | undefined => {
  const score = report.overallHealthScore ?? report.riskScore;
  if (score == null || score === "") return undefined;

  const numericScore = Number(score);
  return Number.isFinite(numericScore) ? numericScore : undefined;
};

const healthScoreClass = (score?: number) => {
  if (score == null || !Number.isFinite(Number(score))) return "text-slate-500";
  if (score >= 75) return "text-emerald-700";
  if (score >= 50) return "text-amber-700";
  if (score >= 25) return "text-orange-700";
  return "text-rose-700";
};

const healthScoreSurfaceClass = (score?: number) => {
  if (score == null || !Number.isFinite(Number(score))) {
    return "border-slate-200 bg-slate-50 text-slate-600";
  }
  if (score >= 75) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (score >= 50) return "border-amber-200 bg-amber-50 text-amber-800";
  if (score >= 25) return "border-orange-200 bg-orange-50 text-orange-800";
  return "border-rose-200 bg-rose-50 text-rose-800";
};

const statusLabel = (status?: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "done" || normalized === "completed") return "Completed";
  if (normalized === "failed" || normalized === "error") return "Failed";
  if (normalized === "processing") return "Processing";
  if (normalized === "queued") return "Queued";
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
};

const statusClass = (status?: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "done" || normalized === "completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (normalized === "failed" || normalized === "error") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }
  if (normalized === "processing" || normalized === "queued") {
    return "border-cyan-200 bg-cyan-50 text-cyan-900";
  }
  return "border-slate-200 bg-slate-50 text-slate-700";
};

const loadReports = async () => {
  loading.value = true;
  loadError.value = "";
  try {
    reports.value = await getDeduplicatedReports(auth.token, () =>
      api.getReports(),
    );
  } catch (error) {
    reports.value = [];
    loadError.value = getApiErrorMessage(
      error,
      "We couldn't load your reports. Please try again.",
    );
  } finally {
    loading.value = false;
  }
};

const deleteReport = async (id: string) => {
  if (!window.confirm("Delete this report?")) return;
  actionError.value = "";
  deletingId.value = id;
  try {
    await api.deleteReport(id);
    reports.value = reports.value.filter((r) => r.id !== id);
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  } catch (error) {
    actionError.value = getApiErrorMessage(
      error,
      "We couldn't delete this report. Please try again.",
    );
  } finally {
    deletingId.value = null;
  }
};

const bulkDeleteSelected = async () => {
  if (!selectedIds.value.length) return;
  if (!window.confirm(`Delete ${selectedIds.value.length} selected reports?`))
    return;
  actionError.value = "";
  deletingBulk.value = true;
  try {
    for (const id of [...selectedIds.value]) {
      await api.deleteReport(id);
      reports.value = reports.value.filter((r) => r.id !== id);
    }
    selectedIds.value = [];
  } catch (error) {
    actionError.value = getApiErrorMessage(
      error,
      "We couldn't delete all selected reports. Please try again.",
    );
  } finally {
    deletingBulk.value = false;
  }
};

onMounted(loadReports);
</script>
