<template>
  <section
    class="fade-up space-y-6 rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm sm:p-6"
    aria-labelledby="report-analysis-heading"
  >
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex min-w-0 items-center gap-3">
        <span
          class="grid size-11 shrink-0 place-items-center rounded-2xl bg-cyan-50 text-cyan-800 ring-1 ring-inset ring-cyan-100"
        >
          <IconSparkles :size="20" :stroke-width="1.8" aria-hidden="true" />
        </span>
        <div class="min-w-0">
          <h2
            id="report-analysis-heading"
            class="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl"
          >
            AI health analysis
          </h2>
          <p class="text-sm text-slate-600">
            A summary of this report to support your review.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:justify-end">
        <span
          class="inline-flex min-h-8 items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
          :class="analysisStatusClass"
          role="status"
          aria-live="polite"
        >
          <IconLoader2
            v-if="isProcessing"
            :size="14"
            class="motion-safe:animate-spin"
            aria-hidden="true"
          />
          {{ analysisStatusLabel }}
        </span>
        <button
          v-if="current && !isProcessing && status !== 'error' && status !== 'failed'"
          type="button"
          :disabled="isDownloading"
          class="inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border border-cyan-800 bg-cyan-800 px-3 text-sm font-semibold text-white transition hover:border-cyan-900 hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          @click="downloadPdf"
        >
          <IconLoader2
            v-if="isDownloading"
            :size="16"
            class="motion-safe:animate-spin"
            aria-hidden="true"
          />
          <IconDownload v-else :size="16" aria-hidden="true" />
          {{ isDownloading ? "Preparing PDF..." : "Download PDF" }}
        </button>
        <NuxtLink
          v-if="current?.id"
          :to="`/reports/${current.id}`"
          class="inline-flex min-h-9 items-center gap-1 rounded-xl px-3 text-sm font-semibold text-cyan-800 underline underline-offset-4 transition hover:bg-cyan-50 hover:text-cyan-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
        >
          View full report
          <IconChevronRight :size="16" aria-hidden="true" />
        </NuxtLink>
      </div>
    </header>

    <div
      class="rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-sm leading-6 text-cyan-950"
      role="note"
    >
      <span class="font-semibold">For review, not diagnosis.</span>
      AI-generated insights can be incomplete. Compare them with the original
      report and discuss questions with a qualified clinician.
    </div>

    <section
      v-if="isProcessing"
      class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
      aria-label="Report analysis progress"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-slate-900">
            Generating your report
          </p>
          <p class="mt-1 text-sm text-slate-600" aria-live="polite">
            {{ analysisStage }}
          </p>
        </div>
        <span class="shrink-0 text-lg font-bold tabular-nums text-cyan-900">
          {{ analysisProgress }}%
        </span>
      </div>
      <div
        class="mt-4 h-2 overflow-hidden rounded-full bg-cyan-100"
        role="progressbar"
        aria-label="Report analysis progress"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="analysisProgress"
        :aria-valuetext="`${analysisProgress}% complete. ${analysisStage}.`"
      >
        <div
          class="report-analysis-progress__fill h-full rounded-full bg-cyan-700"
          :style="{ width: `${analysisProgress}%` }"
        ></div>
      </div>
      <p class="mt-2 text-xs text-slate-500">
        Progress reflects completed analysis steps. Timing varies by report.
      </p>
    </section>

    <p
      v-if="downloadError"
      class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
      role="alert"
    >
      {{ downloadError }}
    </p>

    <div v-if="loading || isProcessing" class="space-y-3 motion-safe:animate-pulse">
      <div class="h-28 rounded-2xl bg-slate-100"></div>
      <div class="h-40 rounded-2xl bg-slate-100"></div>
      <div class="h-32 rounded-2xl bg-slate-100"></div>
    </div>

    <div
      v-else-if="reportError"
      class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900"
      role="alert"
    >
      {{ reportError }}
    </div>

    <div v-else-if="current" class="space-y-6">
      <div class="grid gap-4 lg:grid-cols-[minmax(13rem,0.7fr)_minmax(0,1.8fr)]">
        <section
          class="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-5 sm:p-6"
          aria-label="AI wellness score"
        >
          <p class="text-sm font-medium text-slate-700">AI wellness score</p>
          <p v-if="healthScore != null" class="mt-2 flex items-baseline gap-1.5">
            <span class="text-4xl font-bold tracking-tight text-cyan-900">
              {{ healthScore }}
            </span>
            <span class="text-sm font-medium text-slate-500">/ 100</span>
          </p>
          <p v-else class="mt-2 text-lg font-semibold text-slate-500">
            Not available
          </p>
          <p class="mt-2 text-xs leading-5 text-slate-600">
            AI-generated indicator. It is not a clinical measurement.
          </p>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
          <h3 class="text-sm font-semibold text-slate-800">Plain-language summary</h3>
          <p class="mt-2 text-sm leading-7 text-slate-700">
            {{ current.summary || "A summary is not available for this report yet." }}
          </p>
        </section>
      </div>

      <details
        v-if="confidenceRows.length || riskCategories.length"
        class="analysis-disclosure h-fit rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
        open
      >
        <summary
          class="flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700"
        >
          <span>
            <span class="block text-sm font-semibold text-slate-900">
              Analysis details
            </span>
            <span class="mt-1 block text-xs leading-5 text-slate-600">
              Confidence and AI category estimates
            </span>
          </span>
          <IconChevronDown
            :size="19"
            class="analysis-disclosure__chevron mt-0.5 shrink-0 text-slate-500"
            aria-hidden="true"
          />
        </summary>

        <div
          class="mt-5 grid items-start gap-5"
          :class="{
            'xl:grid-cols-2': confidenceRows.length > 0 && riskCategories.length > 0,
          }"
        >
          <section v-if="confidenceRows.length" aria-labelledby="analysis-confidence-heading">
            <div>
              <h3 id="analysis-confidence-heading" class="text-sm font-semibold text-slate-900">
                Analysis confidence
              </h3>
              <p class="mt-1 text-xs leading-5 text-slate-600">
                These percentages describe model processing confidence, not
                diagnostic accuracy or clinical significance.
              </p>
            </div>
            <dl
              class="mt-3 grid gap-3"
              :class="confidenceRows.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'"
            >
              <div
                v-for="row in confidenceRows"
                :key="row.label"
                class="rounded-xl border border-slate-200 bg-white p-4"
              >
                <dt class="text-xs font-medium text-slate-600">{{ row.label }}</dt>
                <dd class="mt-2 text-2xl font-semibold tabular-nums text-cyan-900">
                  {{ row.value }}
                </dd>
              </div>
            </dl>
          </section>

          <section v-if="riskCategories.length" aria-labelledby="analysis-categories-heading">
            <div>
              <h3 id="analysis-categories-heading" class="text-sm font-semibold text-slate-900">
                AI category estimates
              </h3>
              <p class="mt-1 text-xs leading-5 text-slate-600">
                These generated values have no units or reference ranges here.
                Use the original report for clinical measurements.
              </p>
            </div>
            <dl
              class="mt-3 grid gap-3"
              :class="riskCategories.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'"
            >
              <div
                v-for="(item, i) in riskCategories"
                :key="`${item.label}-${i}`"
                class="rounded-xl border border-slate-200 bg-white p-4"
              >
                <dt class="text-xs font-medium text-slate-600">{{ item.label }}</dt>
                <dd class="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
                  {{ item.value }}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </details>

      <section v-if="findings.length" aria-labelledby="analysis-findings-heading">
        <div class="mb-3">
          <h3 id="analysis-findings-heading" class="text-base font-semibold text-slate-950">
            Key findings
          </h3>
          <p class="mt-1 text-sm text-slate-600">
            Open a finding to read its explanation and suggested actions.
          </p>
        </div>
        <div class="space-y-3">
          <details
            v-for="(f, i) in findings"
            :key="i"
            class="finding-disclosure rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-cyan-200"
            open
          >
            <summary
              class="flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700"
            >
              <span class="min-w-0">
                <span class="block font-semibold text-slate-900">
                  {{ f.label || "Report finding" }}
                </span>
                <span v-if="f.value" class="mt-1 block text-sm text-slate-600">
                  {{ f.value }}
                </span>
              </span>
              <span class="flex shrink-0 items-center gap-2">
                <span
                  v-if="f.status"
                  :class="statusClass(f.status)"
                  class="rounded-full border px-2.5 py-1 text-xs font-semibold capitalize"
                >
                  {{ prettyStatus(f.status) }}
                </span>
                <span
                  v-else
                  class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  Status not provided
                </span>
                <IconChevronDown
                  :size="17"
                  class="finding-disclosure__chevron text-slate-500"
                  aria-hidden="true"
                />
              </span>
            </summary>

            <div class="mt-4 border-t border-slate-100 pt-4">
              <p v-if="f.whyItMatters" class="text-sm leading-6 text-slate-700">
                {{ f.whyItMatters }}
              </p>
              <div
                v-if="Array.isArray(f.recommendedActions) && f.recommendedActions.length"
                :class="{ 'mt-4': f.whyItMatters }"
              >
                <p class="text-sm font-semibold text-slate-800">Suggested actions</p>
                <ul class="mt-2 list-inside list-disc space-y-2 text-sm leading-6 text-slate-700">
                  <li v-for="(action, ai) in f.recommendedActions" :key="ai">
                    {{ action }}
                  </li>
                </ul>
              </div>
              <p
                v-if="!f.whyItMatters && !f.recommendedActions?.length"
                class="text-sm text-slate-600"
              >
                No additional explanation was provided for this finding.
              </p>
            </div>
          </details>
        </div>
      </section>

      <details
        v-if="patterns.length"
        class="analysis-disclosure rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
      >
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700">
          <span class="text-sm font-semibold text-slate-900">Possible patterns</span>
          <IconChevronDown
            :size="19"
            class="analysis-disclosure__chevron shrink-0 text-slate-500"
            aria-hidden="true"
          />
        </summary>
        <div class="mt-4 space-y-3">
          <article
            v-for="(p, i) in patterns"
            :key="i"
            class="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h4 class="font-semibold text-slate-900">{{ p.title }}</h4>
              <span
                v-if="p.severity"
                :class="statusClass(p.severity)"
                class="rounded-full border px-2.5 py-1 text-xs font-semibold capitalize"
              >
                {{ prettyStatus(p.severity) }} signal
              </span>
            </div>
            <p class="mt-2 text-sm leading-6 text-slate-700">{{ p.insight }}</p>
          </article>
        </div>
      </details>

      <section
        v-if="positiveFindings.length"
        class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5"
        aria-labelledby="positive-findings-heading"
      >
        <h3 id="positive-findings-heading" class="text-sm font-semibold text-emerald-950">
          Positive findings
        </h3>
        <ul class="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-emerald-900">
          <li v-for="(finding, i) in positiveFindings" :key="i">
            {{ finding }}
          </li>
        </ul>
      </section>

      <details
        v-if="longTermInsights.length"
        class="analysis-disclosure rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
      >
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700">
          <span>
            <span class="block text-sm font-semibold text-slate-900">
              Longer-term outlook
            </span>
            <span class="mt-1 block text-xs text-slate-600">
              AI-generated insights, not predictions
            </span>
          </span>
          <IconChevronDown
            :size="19"
            class="analysis-disclosure__chevron shrink-0 text-slate-500"
            aria-hidden="true"
          />
        </summary>
        <div class="mt-4 space-y-3">
          <article
            v-for="(item, i) in longTermInsights"
            :key="i"
            class="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div class="flex flex-wrap items-start justify-between gap-2">
              <h4 class="font-semibold text-slate-900">{{ item.title }}</h4>
              <span
                v-if="item.outlook"
                class="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-semibold capitalize text-cyan-900"
              >
                {{ prettyStatus(item.outlook) }} outlook
              </span>
            </div>
            <p class="mt-2 text-sm leading-6 text-slate-700">{{ item.insight }}</p>
            <p v-if="item.horizonYears != null" class="mt-2 text-xs text-slate-600">
              Time horizon: {{ item.horizonYears }} years
            </p>
          </article>
        </div>
      </details>

      <details
        v-if="fiveYearAnswers.length"
        class="analysis-disclosure rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 sm:p-5"
      >
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700">
          <span class="flex items-center gap-3">
            <IconCalendarStats :size="20" class="shrink-0 text-cyan-800" aria-hidden="true" />
            <span>
              <span class="block text-sm font-semibold text-cyan-950">
                Questions for the years ahead
              </span>
              <span class="mt-1 block text-xs text-cyan-900">
                AI-generated scenarios based on this report
              </span>
            </span>
          </span>
          <IconChevronDown
            :size="19"
            class="analysis-disclosure__chevron shrink-0 text-cyan-800"
            aria-hidden="true"
          />
        </summary>

        <div class="mt-4 space-y-3">
          <article
            v-for="(item, i) in fiveYearAnswers"
            :key="i"
            class="rounded-xl border border-cyan-100 bg-white p-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h4 class="font-semibold text-slate-900">
                {{ item.question || `Year ${item.year ?? i + 1}` }}
              </h4>
              <span class="flex flex-wrap items-center gap-2">
                <span
                  v-if="item.year != null"
                  class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  Year {{ item.year }}
                </span>
                <span
                  v-if="item.outlook"
                  class="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-semibold capitalize text-cyan-900"
                >
                  {{ prettyStatus(item.outlook) }} outlook
                </span>
              </span>
            </div>
            <p v-if="item.answer" class="mt-2 text-sm leading-6 text-slate-700">
              {{ item.answer }}
            </p>
          </article>
        </div>
      </details>

      <details
        v-if="recommendationEntries.length"
        class="analysis-disclosure rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
      >
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700">
          <span>
            <span class="block text-sm font-semibold text-slate-900">
              Suggested next steps
            </span>
            <span class="mt-1 block text-xs text-slate-600">
              Review AI suggestions with your clinician
            </span>
          </span>
          <IconChevronDown
            :size="19"
            class="analysis-disclosure__chevron shrink-0 text-slate-500"
            aria-hidden="true"
          />
        </summary>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <section
            v-for="([key, group], index) in recommendationEntries"
            :key="`${key}-${index}`"
            class="rounded-xl border border-slate-200 bg-white p-4"
          >
            <h4 class="font-semibold capitalize text-slate-900">{{ key }}</h4>
            <ul class="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-slate-700">
              <li v-for="(item, i) in group" :key="i">{{ item }}</li>
            </ul>
          </section>
        </div>
      </details>

      <p class="border-t border-slate-100 pt-4 text-xs leading-5 text-slate-600">
        AI-generated information is educational. It does not replace medical
        advice, diagnosis, or review of your original lab results.
      </p>
    </div>

    <div
      v-else
      class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
      role="status"
    >
      No analysis data is available for this report yet.
    </div>
  </section>
</template>

<script setup lang="ts">
import IconCalendarStats from "@tabler/icons-vue/icons/IconCalendarStats";
import IconChevronDown from "@tabler/icons-vue/icons/IconChevronDown";
import IconChevronRight from "@tabler/icons-vue/icons/IconChevronRight";
import IconDownload from "@tabler/icons-vue/icons/IconDownload";
import IconLoader2 from "@tabler/icons-vue/icons/IconLoader2";
import IconSparkles from "@tabler/icons-vue/icons/IconSparkles";
import { readHealthScore } from "~/utils/reportMetrics";

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
  severity?: string;
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
  title?: string | null;
  createdAt?: string | null;
  uploadedAt?: string | null;
  status?: string;
  progress?: number | null;
  processingStage?: string | null;
  overallHealthScore?: number | string | null;
  riskScore?: number | string | null;
  summary?: string | null;
  findings?: ReportFinding[] | null;
  patternAnalysis?: PatternInsight[] | null;
  positiveFindings?: string[] | null;
  longTermInsights?: LongTermInsight[] | null;
  fiveYearAnswers?: FiveYearAnswer[] | null;
  confidenceScore?: number | string | null;
  markerConfidence?: number | string | null;
  aiConfidence?: number | string | null;
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
const isDownloading = ref(false);
const downloadError = ref("");

watch(
  () => props.report,
  (val) => {
    current.value = val ?? null;
  },
  { immediate: true },
);

const status = computed(() =>
  String(current.value?.status || "").toLowerCase(),
);

const isProcessing = computed(
  () => status.value === "processing" || status.value === "queued",
);

const analysisProgress = computed(() => {
  const progress = Number(current.value?.progress ?? 0);
  return Number.isFinite(progress)
    ? Math.max(0, Math.min(99, Math.round(progress)))
    : 0;
});

const analysisStage = computed(
  () => current.value?.processingStage || "Preparing your report",
);

const analysisStatusLabel = computed(() => {
  if (isProcessing.value) return "Analysis in progress";
  if (status.value === "done" || status.value === "completed") {
    return "Analysis complete";
  }
  if (status.value === "error" || status.value === "failed") {
    return "Analysis failed";
  }
  return "Status unavailable";
});

const analysisStatusClass = computed(() => {
  if (isProcessing.value) {
    return "border-cyan-200 bg-cyan-50 text-cyan-900";
  }
  if (status.value === "done" || status.value === "completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }
  if (status.value === "error" || status.value === "failed") {
    return "border-rose-200 bg-rose-50 text-rose-900";
  }
  return "border-slate-200 bg-slate-50 text-slate-700";
});

const healthScore = computed(() =>
  readHealthScore(
    current.value?.overallHealthScore ?? current.value?.riskScore,
  ),
);

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
    label: key
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .replace(/^./, (s) => s.toUpperCase()),
    value,
  }));
});

const formatConfidence = (
  value: number | string | null | undefined,
): string | null => {
  if (value == null || value === "") return null;

  const score = Number(value);
  if (!Number.isFinite(score) || score < 0 || score > 100) return null;

  return `${Math.round(score <= 1 ? score * 100 : score)}%`;
};

const confidenceRows = computed(() =>
  [
    {
      label: "Analysis confidence",
      value: formatConfidence(current.value?.confidenceScore),
    },
    {
      label: "Marker extraction",
      value: formatConfidence(current.value?.markerConfidence),
    },
    {
      label: "AI model confidence",
      value: formatConfidence(current.value?.aiConfidence),
    },
  ].filter(
    (row): row is { label: string; value: string } => row.value !== null,
  ),
);

const downloadPdf = async () => {
  if (!current.value) return;

  isDownloading.value = true;
  downloadError.value = "";

  try {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (height: number) => {
      if (y + height > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
    };

    const addText = (
      value: string | number | null | undefined,
      options: {
        size?: number;
        color?: [number, number, number];
        bold?: boolean;
        gap?: number;
      } = {},
    ) => {
      const text = String(value ?? "").replace(/\s+/g, " ").trim();
      if (!text) return;

      const size = options.size ?? 10;
      const lineHeight = size * 1.45;
      pdf.setFont("helvetica", options.bold ? "bold" : "normal");
      pdf.setFontSize(size);
      const color = options.color ?? [51, 65, 85];
      pdf.setTextColor(color[0], color[1], color[2]);
      const lines = pdf.splitTextToSize(text, contentWidth) as string[];
      let lineOffset = 0;

      while (lineOffset < lines.length) {
        const availableLines = Math.floor((pageHeight - margin - y) / lineHeight);
        if (availableLines <= 0) {
          pdf.addPage();
          y = margin;
          continue;
        }

        const chunk = lines.slice(lineOffset, lineOffset + availableLines);
        pdf.text(chunk, margin, y);
        y += chunk.length * lineHeight;
        lineOffset += chunk.length;
        if (lineOffset < lines.length) {
          pdf.addPage();
          y = margin;
        }
      }

      y += options.gap ?? 6;
    };

    const addSection = (heading: string) => {
      ensureSpace(34);
      y += 8;
      addText(heading, { size: 13, bold: true, color: [15, 58, 76], gap: 7 });
    };

    const reportTitle = current.value.title?.trim() || "Health report analysis";
    const reportDate = current.value.createdAt || current.value.uploadedAt;
    const parsedDate = reportDate ? new Date(reportDate) : null;
    const formattedDate =
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString()
        : "";

    addText("MEDIVOY  |  HEALTH REPORT", {
      size: 9,
      bold: true,
      color: [8, 102, 120],
      gap: 10,
    });
    addText(reportTitle, { size: 20, bold: true, color: [15, 23, 42], gap: 5 });
    addText("AI-generated health analysis", {
      size: 11,
      color: [71, 85, 105],
      gap: 4,
    });
    if (formattedDate) addText(`Report date: ${formattedDate}`, { size: 9, gap: 12 });

    pdf.setDrawColor(203, 213, 225);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 18;

    addText(
      "For review, not diagnosis. AI-generated insights can be incomplete. Compare them with the original report and discuss questions with a qualified clinician.",
      { size: 9, color: [8, 78, 98], gap: 8 },
    );

    addSection("Plain-language summary");
    addText(current.value.summary || "A summary is not available for this report yet.");

    addSection("AI wellness score");
    addText(
      healthScore.value == null
        ? "Not available. This is an AI-generated indicator, not a clinical measurement."
        : `${healthScore.value} / 100. AI-generated indicator, not a clinical measurement.`,
    );

    if (confidenceRows.value.length) {
      addSection("Analysis confidence");
      addText(
        "These percentages describe model processing confidence, not diagnostic accuracy or clinical significance.",
        { size: 9 },
      );
      confidenceRows.value.forEach((row) => addText(`${row.label}: ${row.value}`));
    }

    if (riskCategories.value.length) {
      addSection("AI category estimates");
      addText(
        "Generated values have no units or reference ranges here. Use the original report for clinical measurements.",
        { size: 9 },
      );
      riskCategories.value.forEach((item) =>
        addText(`${item.label}: ${item.value}`),
      );
    }

    if (findings.value.length) {
      addSection("Key findings");
      findings.value.forEach((finding) => {
        addText(finding.label || "Report finding", { bold: true, gap: 3 });
        if (finding.value) addText(`Value: ${finding.value}`, { gap: 3 });
        if (finding.status) {
          addText(`Status: ${prettyStatus(finding.status)}`, { gap: 3 });
        }
        if (finding.whyItMatters) {
          addText(`Why it matters: ${finding.whyItMatters}`, { gap: 3 });
        }
        finding.recommendedActions?.forEach((action) =>
          addText(`Suggested action: ${action}`, { gap: 3 }),
        );
        y += 5;
      });
    }

    if (patterns.value.length) {
      addSection("Possible patterns");
      patterns.value.forEach((pattern) => {
        if (pattern.title) addText(pattern.title, { bold: true, gap: 3 });
        if (pattern.severity) {
          addText(`Signal: ${prettyStatus(pattern.severity)}`, { gap: 3 });
        }
        addText(pattern.insight);
      });
    }

    if (positiveFindings.value.length) {
      addSection("Positive findings");
      positiveFindings.value.forEach((finding) => addText(`- ${finding}`));
    }

    if (longTermInsights.value.length) {
      addSection("Longer-term outlook");
      longTermInsights.value.forEach((item) => {
        if (item.title) addText(item.title, { bold: true, gap: 3 });
        if (item.outlook) {
          addText(`Outlook: ${prettyStatus(item.outlook)}`, { gap: 3 });
        }
        addText(item.insight);
        if (item.horizonYears != null) {
          addText(`Time horizon: ${item.horizonYears} years`);
        }
      });
    }

    if (fiveYearAnswers.value.length) {
      addSection("Questions for the years ahead");
      fiveYearAnswers.value.forEach((item, index) => {
        addText(
          item.question || `Year ${item.year ?? index + 1}`,
          { bold: true, gap: 3 },
        );
        if (item.year != null) addText(`Year: ${item.year}`, { gap: 3 });
        if (item.outlook) {
          addText(`Outlook: ${prettyStatus(item.outlook)}`, { gap: 3 });
        }
        addText(item.answer);
      });
    }

    if (recommendationEntries.value.length) {
      addSection("Suggested next steps");
      addText("Review AI suggestions with your clinician.", { size: 9 });
      recommendationEntries.value.forEach(([group, actions]) => {
        addText(group, { bold: true, gap: 3 });
        actions.forEach((action) => addText(`- ${action}`));
      });
    }

    addText(
      "AI-generated information is educational. It does not replace medical advice, diagnosis, or review of your original lab results.",
      { size: 9, color: [71, 85, 105], gap: 0 },
    );

    const pageCount = pdf.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      pdf.setPage(page);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 22, {
        align: "right",
      });
    }

    const filename =
      reportTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "health-report";
    pdf.save(`${filename}-analysis.pdf`);
  } catch (error) {
    console.error("Could not generate the report PDF.", error);
    downloadError.value = "Could not create the PDF. Please try again.";
  } finally {
    isDownloading.value = false;
  }
};

const prettyStatus = (status?: string) =>
  (status || "status not provided").replace(/[_-]+/g, " ");

const statusClass = (status?: string) => {
  switch (status?.toLowerCase().replace(/[\s-]+/g, "_")) {
    case "critical_high":
    case "critical_low":
    case "criticallow":
    case "criticalhigh":
    case "high":
    case "very_high":
      return "border-rose-200 bg-rose-50 text-rose-800";
    case "moderate_high":
    case "mild_high":
    case "moderatehigh":
    case "mildhigh":
    case "moderate":
    case "borderline":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "mild_low":
    case "mildlow":
    case "low":
      return "border-sky-200 bg-sky-50 text-sky-900";
    case "normal":
    case "within_range":
    case "positive":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
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
  }, 2000);
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

<style scoped>
.report-analysis-progress__fill {
  transition: width 420ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .report-analysis-progress__fill {
    transition: none;
  }
}

summary::-webkit-details-marker {
  display: none;
}

.analysis-disclosure__chevron,
.finding-disclosure__chevron {
  transition: transform 180ms ease;
}

.analysis-disclosure[open] > summary .analysis-disclosure__chevron,
.finding-disclosure[open] > summary .finding-disclosure__chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .analysis-disclosure__chevron,
  .finding-disclosure__chevron {
    transition: none;
  }
}
</style>