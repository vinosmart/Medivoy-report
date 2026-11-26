<template>
  <div class="space-y-8">
    <PageHeading
      :icon="IconActivityHeartbeat"
      title="Your health, clearly in view."
      description="Bring reports, family history, and wellness guidance together in one place."
      eyebrow="Health overview"
    >
      <template #actions>
        <NuxtLink
          to="/reports/upload"
          class="medivoy-primary-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-800 bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white! shadow-[0_8px_18px_-12px_rgba(14,116,144,0.55)] transition hover:border-cyan-900 hover:bg-cyan-900 active:scale-[0.98]"
        >
          <IconUpload :size="18" aria-hidden="true" />
          Upload a report
        </NuxtLink>
        <NuxtLink
          to="/reports"
          class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_6px_16px_-14px_rgba(15,23,42,0.35)] transition hover:border-cyan-200 hover:bg-cyan-50 active:scale-[0.98]"
        >
          <IconFiles :size="18" aria-hidden="true" />
          Browse reports
        </NuxtLink>
      </template>
    </PageHeading>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1fr_1fr]">
      <div
        v-for="(stat, index) in stats"
        :key="stat.label"
        class="lift fade-up flex flex-col rounded-2xl border p-5 shadow-sm"
        :class="[
          stat.highlight
            ? 'border-cyan-200 bg-[linear-gradient(145deg,#ffffff_0%,#ecfeff_100%)] shadow-[0_12px_30px_-24px_rgba(14,116,144,0.5)]'
            : 'border-slate-200 bg-white',
          delayClass(index),
        ]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500">{{ stat.label }}</p>
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl"
            :class="[stat.iconBg, stat.iconColor]"
          >
            <component :is="stat.icon" :size="19" :stroke-width="1.8" aria-hidden="true" />
          </div>
        </div>
        <p
          v-if="stat.highlight && healthScore !== null && !loadingReports && !reportsError"
          class="mt-3 flex items-baseline gap-1.5 font-bold tracking-tight text-cyan-950"
        >
          <span class="text-5xl leading-none">{{ healthScore }}</span>
          <span class="text-sm font-semibold text-slate-500">/ 100</span>
        </p>
        <p
          v-else
          class="mt-3 text-3xl font-bold tracking-tight text-slate-900"
          :class="stat.valueColor"
        >
          {{ stat.value }}
        </p>
        <div
          v-if="stat.highlight && healthScore !== null && !loadingReports && !reportsError"
          class="mt-3"
        >
          <div
            class="health-score-track"
            role="meter"
            :aria-label="isScoreFromReport ? 'AI wellness score' : 'Health score'"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="healthScore"
          >
            <div
              class="health-score-fill"
              :style="{ width: `${healthScore}%` }"
            ></div>
          </div>
          <p class="mt-2 text-xs font-medium leading-5 text-cyan-900">
            {{ isScoreFromReport
              ? "AI-generated estimate, not a clinical measurement."
              : "From your saved profile, not a clinical measurement." }}
          </p>
        </div>
        <p class="mt-auto pt-2 text-xs font-medium leading-5" :class="stat.changeColor">
          {{ stat.change }}
        </p>
      </div>
    </section>

    <section
      class="dashboard-activity lift fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby="report-activity-title"
    >
      <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 id="report-activity-title" class="font-bold text-slate-900">
          Report activity
          <span class="mt-0.5 block text-xs font-normal text-slate-500">
            Monthly uploads over the last six months
          </span>
        </h2>
        <span
          v-if="reportActivity.hasData"
          class="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-900"
        >
          {{ reportActivity.totalUploads }}
          {{ reportActivity.totalUploads === 1 ? "upload" : "uploads" }}
        </span>
      </div>

      <div
        v-if="loadingReports"
        class="grid h-32 grid-cols-6 items-end gap-3"
        role="status"
        aria-label="Loading report activity"
      >
        <div
          v-for="month in 6"
          :key="month"
          class="h-16 animate-pulse rounded-t-lg bg-cyan-50"
        ></div>
      </div>
      <p v-else-if="reportsError" role="status" class="text-sm text-slate-500">
        Report activity is unavailable right now.
      </p>
      <div
        v-else-if="reportActivity.hasData"
        class="grid grid-cols-6 gap-3"
        role="img"
        :aria-label="`Report uploads by month: ${reportActivity.description}`"
      >
        <div
          v-for="(month, index) in reportActivity.buckets"
          :key="`${month.year}-${month.monthIndex}`"
          class="flex min-w-0 flex-col items-center gap-2"
        >
          <div class="report-activity-track w-full">
            <div
              v-if="month.count"
              class="report-activity-bar"
              :style="{
                height: `${month.height}%`,
                animationDelay: `${index * 35}ms`,
              }"
              :title="`${month.count} ${month.count === 1 ? 'report' : 'reports'} in ${month.label}`"
            ></div>
          </div>
          <span class="text-[11px] font-medium text-slate-500">
            {{ month.label }}
          </span>
          <span class="text-xs font-semibold text-slate-700">
            {{ month.count }}
          </span>
        </div>
      </div>
      <div v-else class="dashboard-activity-empty flex flex-col items-center gap-3 rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/50 px-4 py-6 text-center sm:flex-row sm:text-left">
        <span class="dashboard-activity-empty__icon grid size-11 shrink-0 place-items-center rounded-xl bg-white text-cyan-700 ring-1 ring-cyan-100">
          <IconFiles :size="21" stroke-width="1.8" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-slate-800">
            No recent uploads
          </p>
          <p class="mt-0.5 text-xs text-slate-500">
            Your report history will appear here after you upload a report.
          </p>
        </div>
        <NuxtLink
          to="/reports/upload"
          class="inline-flex min-h-10 items-center justify-center rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm font-semibold text-cyan-800 transition hover:border-cyan-300 hover:bg-cyan-100"
        >
          Upload report
        </NuxtLink>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      <div
        class="lift fade-up d5 lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div class="flex items-center justify-between mb-5">
          <div>
            <h4 class="font-bold text-slate-900">Recent Reports</h4>
            <p class="text-xs text-slate-500 mt-0.5">
              Your latest uploaded reports
            </p>
          </div>
          <NuxtLink
            to="/reports"
            class="text-xs font-semibold text-cyan-700 hover:text-cyan-900 hover:underline"
            >View all</NuxtLink
          >
        </div>
        <div v-if="loadingReports" class="space-y-3">
          <div
            v-for="n in 3"
            :key="n"
            class="animate-pulse rounded-2xl border border-slate-100 p-4"
          >
            <div class="h-4 w-1/3 rounded bg-slate-200"></div>
            <div class="mt-2 h-3 w-1/4 rounded bg-slate-100"></div>
          </div>
        </div>
        <div
          v-else-if="reportsError"
          class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center"
        >
          <p role="alert" class="text-sm text-rose-800">{{ reportsError }}</p>
          <button
            type="button"
            class="mt-3 font-semibold text-cyan-900 underline underline-offset-2"
            @click="loadReports"
          >
            Try again
          </button>
        </div>
        <div v-else-if="reports.length" class="space-y-3">
          <NuxtLink
            v-for="(report, index) in reports.slice(0, 4)"
            :key="report.id"
            :to="`/reports/${report.id}`"
            class="fade-up flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:border-cyan-100 hover:bg-cyan-50/40"
            :class="delayClass(index)"
          >
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <p class="truncate text-sm font-semibold text-slate-900">
                  {{ report.title }}
                </p>
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-semibold shrink-0"
                  :class="statusClass(report.status)"
                  >{{ report.status }}</span
                >
              </div>
              <p class="mt-1 text-xs text-slate-500">
                {{ report.type?.toUpperCase() }} ·
                {{ formatDate(report.createdAt) }}
              </p>
            </div>
            <div class="ml-4 shrink-0 text-right">
              <p class="text-xs text-slate-400">Health</p>
              <p class="text-lg font-bold text-slate-900">
                {{ scoreFromReport(report) ?? "Not reported" }}
              </p>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
          <IconFiles :size="24" stroke-width="1.5" class="mx-auto mb-2 text-slate-300" aria-hidden="true" />
          <p class="text-slate-500 text-sm">No reports uploaded yet.</p>
          <NuxtLink
            to="/reports/upload"
            class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:underline"
            >Upload your first report →</NuxtLink
          >
        </div>
      </div>
      <div class="lift fade-up d6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 class="font-bold text-slate-900 mb-1">Quick Actions</h4>
        <p class="text-xs text-slate-500 mb-5">Start your health journey</p>
        <div class="space-y-3">
          <NuxtLink
            v-for="(action, index) in quickActions"
            :key="action.label"
            :to="action.to"
            class="fade-up flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-cyan-100 hover:bg-cyan-50/40"
            :class="delayClass(index)"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
              :class="[action.iconBg, action.iconColor]"
            >
              <component :is="action.icon" :size="20" :stroke-width="1.8" aria-hidden="true" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900">
                {{ action.label }}
              </p>
              <p class="text-xs text-slate-500">{{ action.desc }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import IconActivityHeartbeat from "@tabler/icons-vue/icons/IconActivityHeartbeat";
import IconAlertTriangle from "@tabler/icons-vue/icons/IconAlertTriangle";
import IconDna from "@tabler/icons-vue/icons/IconDna";
import IconFiles from "@tabler/icons-vue/icons/IconFiles";
import IconFileUpload from "@tabler/icons-vue/icons/IconFileUpload";
import IconHeartRateMonitor from "@tabler/icons-vue/icons/IconHeartRateMonitor";
import IconSalad from "@tabler/icons-vue/icons/IconSalad";
import IconUpload from "@tabler/icons-vue/icons/IconUpload";
import { getApiErrorMessage } from "~/utils/apiError";
import {
  countFlaggedFindings,
  getLatestAnalyzedReport,
  readHealthScore,
} from "~/utils/reportMetrics";

const api = useMedivoyApi();
const reports = ref<any[]>([]);
const loadingReports = ref(true);
const reportsError = ref("");
const auth = useAuthStore();

// staggered entrance delay for grid/list items — pairs with the
// .fade-up / .d1-.d6 utilities defined in assets/css/main.css
const delayClass = (index: number) => `d${Math.min(index + 1, 6)}`;

const latestAnalyzedReport = computed(() =>
  getLatestAnalyzedReport(reports.value),
);
const scoreFromReport = (report: any) =>
  readHealthScore(report?.overallHealthScore ?? report?.riskScore);
const healthScore = computed(
  () =>
    scoreFromReport(latestAnalyzedReport.value) ??
    readHealthScore(auth.user?.healthScore),
);
const isScoreFromReport = computed(
  () => scoreFromReport(latestAnalyzedReport.value) !== null,
);
const flaggedFindings = computed(() =>
  countFlaggedFindings(latestAnalyzedReport.value),
);
const bioAge = computed(() => {
  const age = Number(auth.user?.bioAge);
  return Number.isFinite(age) && age > 0 ? age : null;
});
const hasPendingReports = computed(() =>
  reports.value.some((report) =>
    ["queued", "processing"].includes(
      String(report.status || "").toLowerCase(),
    ),
  ),
);
const reportMetricValue = (value: number | null) => {
  if (loadingReports.value) return "Loading";
  if (reportsError.value) return "Unavailable";
  if (value !== null) return String(value);
  return hasPendingReports.value ? "Processing" : "No report";
};

const stats = computed(() => [
  {
    label: "Health score",
    highlight: true,
    value:
      loadingReports.value
        ? "Loading"
        : reportsError.value
          ? "Unavailable"
          : healthScore.value === null
            ? hasPendingReports.value
              ? "Processing"
              : "No report"
            : `${healthScore.value}/100`,
    icon: IconHeartRateMonitor,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-800",
    valueColor: "text-cyan-950",
    change: reportsError.value
      ? "Sign in to load report data"
      : healthScore.value !== null
        ? `From ${latestAnalyzedReport.value?.title || "your health profile"}`
        : "Upload a report for analysis",
    changeColor: "text-slate-500",
  },
  {
    label: "Flagged findings",
    highlight: false,
    value: reportMetricValue(flaggedFindings.value),
    icon: IconAlertTriangle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    valueColor: "text-slate-900",
    change: reportsError.value
      ? "Sign in to load report data"
      : flaggedFindings.value !== null
        ? "From your latest analyzed report"
        : "Available after report analysis",
    changeColor: reportsError.value ? "text-rose-600" : "text-slate-500",
  },
  {
    label: "Bio age",
    highlight: false,
    value: bioAge.value === null ? "Not reported" : `${bioAge.value} years`,
    icon: IconDna,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    valueColor: "text-slate-900",
    change: bioAge.value === null
      ? "Not included in your saved health profile"
      : "From your health profile",
    changeColor: "text-slate-500",
  },
  {
    label: "Reports",
    highlight: false,
    value: reportsError.value ? "Unavailable" : String(reports.value.length),
    icon: IconFiles,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-700",
    valueColor: reportsError.value ? "text-rose-700" : "text-cyan-700",
    change: reportsError.value
      ? "Could not load reports"
      : reports.value.length
      ? "Latest reports loaded"
      : "Upload to get started",
    changeColor: reportsError.value ? "text-rose-600" : "text-slate-400",
  },
]);

const reportActivity = computed(() => {
  const now = new Date();
  const buckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() + index - 5, 1);
    return {
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
      label: date.toLocaleDateString("en-US", { month: "short" }),
      count: 0,
    };
  });

  for (const report of reports.value) {
    if (!report.createdAt) continue;
    const createdAt = new Date(report.createdAt);
    if (!Number.isFinite(createdAt.getTime())) continue;

    const bucket = buckets.find(
      (month) =>
        month.year === createdAt.getFullYear() &&
        month.monthIndex === createdAt.getMonth(),
    );
    if (bucket) bucket.count += 1;
  }

  const maxCount = Math.max(0, ...buckets.map((month) => month.count));
  const totalUploads = buckets.reduce((total, month) => total + month.count, 0);

  return {
    buckets: buckets.map((month) => ({
      ...month,
      height: maxCount ? Math.round((month.count / maxCount) * 100) : 0,
    })),
    hasData: maxCount > 0,
    totalUploads,
    description: buckets
      .map((month) => `${month.label}: ${month.count}`)
      .join(", "),
  };
});

const quickActions = [
  {
    label: "Upload report",
    desc: "Blood, DNA, scan or PDF",
    icon: IconFileUpload,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-700",
    to: "/reports/upload",
  },
  {
    label: "View reports",
    desc: "All uploaded reports",
    icon: IconFiles,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    to: "/reports",
  },
  {
    label: "Family risk",
    desc: "Hereditary health history",
    icon: IconActivityHeartbeat,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    to: "/family",
  },
  {
    label: "Nutrition",
    desc: "Vitamin & diet guidance",
    icon: IconSalad,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    to: "/nutrition",
  },
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const statusClass = (status?: string) =>
  status === "completed" || status === "done"
    ? "bg-emerald-100 text-emerald-700"
    : status === "failed"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";

const loadReports = async () => {
  loadingReports.value = true;
  reportsError.value = "";
  try {
    reports.value = await api.getReports();
  } catch (error) {
    reports.value = [];
    reportsError.value = getApiErrorMessage(
      error,
      "We couldn't load your reports. Please try again.",
    );
  } finally {
    loadingReports.value = false;
  }
};

onMounted(loadReports);
</script>

<style scoped>
.health-score-track {
  height: 0.5rem;
  overflow: hidden;
  border-radius: 9999px;
  background: #d7e8ee;
}

.health-score-fill {
  height: 100%;
  border-radius: inherit;
  background: #0e7490;
  transition: width 560ms cubic-bezier(0.16, 1, 0.3, 1);
}

.report-activity-track {
  position: relative;
  display: flex;
  height: 7rem;
  align-items: flex-end;
  overflow: hidden;
  background-image: linear-gradient(to top, #dbe7ec 1px, transparent 1px);
  background-size: 100% 25%;
}

.report-activity-bar {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 0.5rem;
  border-radius: 0.75rem 0.75rem 0.25rem 0.25rem;
  background: linear-gradient(to top, #0e7490, #46a6b8);
  box-shadow: 0 3px 8px rgb(14 116 144 / 0.18);
  transform-origin: bottom;
}

.dashboard-activity-empty__icon {
  color: #0e7490;
}

@keyframes report-bar-rise {
  from {
    opacity: 0.45;
    transform: scaleY(0.08);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes activity-empty-enter {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .report-activity-bar {
    animation: report-bar-rise 480ms var(--medivoy-ease) backwards;
  }

  .dashboard-activity-empty__icon {
    animation: activity-empty-enter 360ms var(--medivoy-ease) both;
  }
}

@media (prefers-reduced-motion: reduce) {
  .health-score-fill {
    transition: none;
  }

  .report-activity-bar {
    animation: none;
    transform: none;
  }
}
</style>