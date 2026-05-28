<template>
  <div
    class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5"
  >
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h4 class="text-xl font-bold">AI Health Analysis</h4>
        <p class="text-sm text-slate-500">
          Personalized preventive health insights
        </p>
      </div>

      <span
        v-if="status === 'processing'"
        class="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
      >
        <svg class="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        Analysing...
      </span>

      <span
        v-else-if="status === 'done' || status === 'completed'"
        class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
      >
        Completed
      </span>

      <span
        v-else
        class="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
      >
        Error
      </span>
    </div>

    <!-- Skeleton -->
    <div
      v-if="status === 'processing' || loading"
      class="space-y-3 animate-pulse"
    >
      <div class="h-28 rounded-2xl bg-slate-100"></div>
      <div class="h-40 rounded-2xl bg-slate-100"></div>
      <div class="h-32 rounded-2xl bg-slate-100"></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="reportError"
      class="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700"
    >
      {{ reportError }}
    </div>

    <!-- Content -->
    <div v-else-if="current" class="space-y-5">
      <!-- Score + Summary -->
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl bg-slate-50 p-5">
          <p class="text-xs text-slate-500">Health Score</p>
          <p class="mt-2 text-4xl font-bold" :class="riskColor">
            {{ current.overallHealthScore ?? current.riskScore ?? "-" }}
          </p>
          <p class="mt-1 text-xs text-slate-400">AI wellness score</p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
          <p class="text-xs text-slate-500">AI Summary</p>
          <p class="mt-2 text-sm leading-6 text-slate-700">
            {{ current.summary || "No summary available yet." }}
          </p>
        </div>
      </div>

      <!-- Confidence -->
      <div v-if="confidenceRows.length" class="rounded-2xl bg-slate-50 p-5">
        <p class="mb-4 text-sm font-semibold text-slate-700">Confidence</p>
        <div class="grid gap-3 sm:grid-cols-3">
          <div
            v-for="row in confidenceRows"
            :key="row.label"
            class="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p class="text-xs text-slate-500">{{ row.label }}</p>
            <p class="mt-2 text-2xl font-bold">{{ row.value }}</p>
          </div>
        </div>
      </div>

      <!-- Risk Categories -->
      <div v-if="riskCategories.length" class="rounded-2xl bg-slate-50 p-5">
        <p class="mb-4 text-sm font-semibold text-slate-700">
          Health Categories
        </p>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(item, i) in riskCategories"
            :key="`${item.label}-${i}`"
            class="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p class="text-xs text-slate-500">{{ item.label }}</p>
            <p class="mt-2 text-2xl font-bold">{{ item.value }}</p>
          </div>
        </div>
      </div>

      <!-- 5 Year Answers -->
      <div
        v-if="fiveYearAnswers.length"
        class="rounded-2xl border border-indigo-100 bg-indigo-50 p-5"
      >
        <div class="mb-5 flex items-center gap-2">
          <span class="text-2xl">🔭</span>
          <div>
            <p class="text-sm font-bold text-indigo-800">
              Find answers for the next 5 years on your health profile
            </p>
            <p class="text-xs text-indigo-500">
              Personalised year-by-year roadmap based on your report
            </p>
          </div>
        </div>

        <div class="relative">
          <div
            class="absolute bottom-0 left-5 top-0 hidden w-0.5 bg-indigo-200 sm:block"
          ></div>

          <div class="space-y-4">
            <div
              v-for="(item, i) in fiveYearAnswers"
              :key="i"
              class="relative sm:pl-14"
            >
              <div
                class="absolute left-0 top-0 z-10 hidden h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold sm:flex"
                :class="outlookBubble(item.outlook)"
              >
                Y{{ item.year }}
              </div>

              <div
                class="rounded-xl border bg-white p-4 shadow-sm"
                :class="outlookBorder(item.outlook)"
              >
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="flex items-center gap-2 sm:hidden">
                    <span
                      class="rounded-full border px-2 py-0.5 text-xs font-bold"
                      :class="outlookBubble(item.outlook)"
                    >
                      Year {{ item.year }}
                    </span>
                  </div>

                  <p class="flex-1 text-sm font-semibold text-slate-800">
                    {{ item.question }}
                  </p>

                  <span
                    class="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                    :class="
                      item.outlook === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : item.outlook === 'moderate'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                    "
                  >
                    {{ item.outlook }}
                  </span>
                </div>

                <p class="mt-2 text-sm leading-relaxed text-slate-600">
                  {{ item.answer }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Findings -->
      <div v-if="findings.length" class="rounded-2xl bg-slate-50 p-5">
        <p class="mb-4 text-sm font-semibold text-slate-700">Key Findings</p>
        <div class="space-y-3">
          <div
            v-for="(f, i) in findings"
            :key="i"
            class="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-semibold text-slate-800">{{ f.label }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ f.value }}</p>
              </div>

              <span
                :class="statusClass(f.status)"
                class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize"
              >
                {{ prettyStatus(f.status) }}
              </span>
            </div>

            <div
              v-if="f.whyItMatters"
              class="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700"
            >
              {{ f.whyItMatters }}
            </div>

            <div
              v-if="
                Array.isArray(f.recommendedActions) &&
                f.recommendedActions.length
              "
              class="mt-4"
            >
              <p
                class="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Suggested Actions
              </p>
              <ul class="mt-2 space-y-1 text-sm text-slate-700">
                <li v-for="(a, ai) in f.recommendedActions" :key="ai">
                  • {{ a }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Pattern Insights -->
      <div v-if="patterns.length" class="rounded-2xl bg-slate-50 p-5">
        <p class="mb-4 text-sm font-semibold text-slate-700">
          AI Pattern Insights
        </p>
        <div class="space-y-3">
          <div
            v-for="(p, i) in patterns"
            :key="i"
            class="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p class="font-semibold text-slate-800">{{ p.title }}</p>
            <p class="mt-2 text-sm text-slate-600">{{ p.insight }}</p>
          </div>
        </div>
      </div>

      <!-- Positive Findings -->
      <div v-if="positiveFindings.length" class="rounded-2xl bg-emerald-50 p-5">
        <p class="mb-3 text-sm font-semibold text-emerald-700">
          Positive Findings
        </p>
        <ul class="space-y-2 text-sm text-emerald-800">
          <li v-for="(p, i) in positiveFindings" :key="i">• {{ p }}</li>
        </ul>
      </div>

      <!-- Long Term Insights -->
      <div v-if="longTermInsights.length" class="rounded-2xl bg-slate-50 p-5">
        <p class="mb-4 text-sm font-semibold text-slate-700">5-Year Outlook</p>
        <div class="space-y-3">
          <div
            v-for="(item, i) in longTermInsights"
            :key="i"
            class="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div class="flex items-center justify-between gap-4">
              <p class="font-semibold text-slate-800">{{ item.title }}</p>
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="
                  item.outlook === 'high'
                    ? 'bg-rose-100 text-rose-700'
                    : item.outlook === 'moderate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                "
              >
                {{ item.outlook }}
              </span>
            </div>

            <p class="mt-2 text-sm text-slate-600">{{ item.insight }}</p>
            <p class="mt-1 text-xs text-slate-400">
              Horizon: {{ item.horizonYears }} years
            </p>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div
        v-if="recommendationEntries.length"
        class="rounded-2xl bg-slate-50 p-5"
      >
        <p class="mb-4 text-sm font-semibold text-slate-700">Recommendations</p>
        <div class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="([key, group], index) in recommendationEntries"
            :key="`${key}-${index}`"
            class="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p class="font-semibold capitalize text-slate-700">{{ key }}</p>
            <ul class="mt-3 space-y-2 text-sm text-slate-600">
              <li v-for="(item, i) in group" :key="i">• {{ item }}</li>
            </ul>
          </div>
        </div>
      </div>

      <p class="text-right text-xs text-slate-400">
        AI-generated insights are educational and not medical diagnosis.
      </p>
    </div>

    <div v-else class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
      No report data available.
    </div>
  </div>
</template>

<script setup lang="ts">
type ReportFinding = {
  label?: string;
  value?: string;
  status?: string;
  whyItMatters?: string;
  recommendedActions?: string[];
};

type PatternInsight = {
  title?: string;
  insight?: string;
};

type LongTermInsight = {
  title?: string;
  insight?: string;
  outlook?: string;
  horizonYears?: number | string;
};

type FiveYearAnswer = {
  year?: number | string;
  question?: string;
  answer?: string;
  outlook?: string;
};

type GenericReport = {
  id?: string;
  status?: string;
  overallHealthScore?: number | string | null;
  riskScore?: number | string | null;
  summary?: string | null;
  findings?: ReportFinding[] | null;
  patternAnalysis?: PatternInsight[] | null;
  positiveFindings?: string[] | null;
  longTermInsights?: LongTermInsight[] | null;
  fiveYearAnswers?: FiveYearAnswer[] | null;
  confidenceScore?: number | null;
  markerConfidence?: number | null;
  aiConfidence?: number | null;
  riskCategories?: Record<string, string | number> | null;
  recommendations?: Record<string, string[] | string | null> | null;
};

const props = defineProps<{
  report: GenericReport | null;
  loading: boolean;
  reportError?: string;
}>();

const api = useMedivoyApi();
const current = ref<GenericReport | null>(props.report);

watch(
  () => props.report,
  (val) => {
    current.value = val ?? null;
  },
  { immediate: true },
);

const status = computed(() => current.value?.status || "processing");

const findings = computed<ReportFinding[]>(() =>
  Array.isArray(current.value?.findings) ? current.value!.findings! : [],
);

const patterns = computed<PatternInsight[]>(() =>
  Array.isArray(current.value?.patternAnalysis)
    ? current.value!.patternAnalysis!
    : [],
);

const positiveFindings = computed<string[]>(() =>
  Array.isArray(current.value?.positiveFindings)
    ? current.value!.positiveFindings!
    : [],
);

const longTermInsights = computed<LongTermInsight[]>(() =>
  Array.isArray(current.value?.longTermInsights)
    ? current.value!.longTermInsights!
    : [],
);

const fiveYearAnswers = computed<FiveYearAnswer[]>(() =>
  Array.isArray(current.value?.fiveYearAnswers)
    ? current.value!.fiveYearAnswers!
    : [],
);

const recommendationGroups = computed<Record<string, string[]>>(() => {
  const raw = current.value?.recommendations;
  if (!raw || typeof raw !== "object") return {};

  return Object.fromEntries(
    Object.entries(raw).filter(
      ([, value]) => Array.isArray(value) && value.length > 0,
    ),
  ) as Record<string, string[]>;
});

const recommendationEntries = computed(() =>
  Object.entries(recommendationGroups.value),
);

const riskCategories = computed(() => {
  const categories = current.value?.riskCategories;
  if (!categories || typeof categories !== "object") return [];

  return Object.entries(categories).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
    value,
  }));
});

const riskColor = computed(() => {
  const raw =
    current.value?.overallHealthScore ?? current.value?.riskScore ?? 0;
  const score = Number(raw);

  if (Number.isNaN(score)) return "text-slate-700";
  if (score <= 35) return "text-rose-600";
  if (score <= 65) return "text-amber-600";
  return "text-emerald-600";
});

const confidenceRows = computed(
  () =>
    [
      current.value?.confidenceScore != null
        ? {
            label: "OCR Confidence",
            value: `${current.value.confidenceScore}%`,
          }
        : null,
      current.value?.markerConfidence != null
        ? {
            label: "Marker Confidence",
            value: `${current.value.markerConfidence}%`,
          }
        : null,
      current.value?.aiConfidence != null
        ? { label: "AI Confidence", value: `${current.value.aiConfidence}%` }
        : null,
    ].filter(Boolean) as { label: string; value: string }[],
);

const prettyStatus = (status?: string) =>
  (status || "normal").replaceAll("_", " ");

const statusClass = (status?: string) => {
  switch (status) {
    case "critical_high":
    case "critical_low":
    case "criticallow":
    case "criticalhigh":
      return "bg-rose-100 text-rose-700";
    case "moderate_high":
    case "mild_high":
    case "moderatehigh":
    case "mildhigh":
      return "bg-orange-100 text-orange-700";
    case "mild_low":
    case "mildlow":
      return "bg-blue-100 text-blue-700";
    case "borderline":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-emerald-100 text-emerald-700";
  }
};

const outlookBubble = (outlook?: string) => {
  if (outlook === "high") return "border-rose-300 bg-rose-50 text-rose-700";
  if (outlook === "moderate")
    return "border-amber-300 bg-amber-50 text-amber-700";
  return "border-emerald-300 bg-emerald-50 text-emerald-700";
};

const outlookBorder = (outlook?: string) => {
  if (outlook === "high") return "border-rose-200";
  if (outlook === "moderate") return "border-amber-200";
  return "border-emerald-200";
};

let pollTimer: ReturnType<typeof setInterval> | null = null;

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

const startPolling = () => {
  if (pollTimer) return;

  pollTimer = setInterval(async () => {
    if (!current.value?.id) return;

    try {
      const fresh = await api.getReport(current.value.id);
      current.value = fresh;

      if (
        !fresh ||
        (fresh.status !== "processing" && fresh.status !== "queued")
      ) {
        stopPolling();
      }
    } catch {
      stopPolling();
    }
  }, 3000);
};

watch(
  () => current.value?.status,
  (val) => {
    if (val === "processing" || val === "queued") startPolling();
    else stopPolling();
  },
  { immediate: true },
);

onUnmounted(() => {
  stopPolling();
});
</script>
