<template>
  <div class="space-y-8">
    <section
      class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8 text-white shadow-xl"
    >
      <div
        class="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-10 right-32 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl"
      ></div>
      <div
        class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="max-w-2xl">
          <span
            class="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
            AI Preventive Health Screening
          </span>
          <h2 class="mt-4 text-3xl font-bold leading-snug sm:text-4xl">
            Know your health<br class="hidden sm:block" />
            for the next 5 years
          </h2>
          <p class="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
            Upload your blood, DNA, or scan reports. Medivoy extracts markers,
            calculates your risk score, bio age, family risk, nutrition gaps,
            and longevity guidance — powered by AI.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink
              to="/reports/upload"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900! transition hover:bg-slate-100"
              >Upload report</NuxtLink
            >
            <NuxtLink
              to="/reports"
              class="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >View all reports</NuxtLink
            >
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 min-w-[260px]">
          <div
            class="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
          >
            <p class="text-xs text-slate-400">AI Reports</p>
            <p class="mt-2 text-2xl font-bold text-cyan-400">OCR + AI</p>
          </div>
          <div
            class="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
          >
            <p class="text-xs text-slate-400">DNA Analysis</p>
            <p class="mt-2 text-2xl font-bold text-violet-400">Genetic</p>
          </div>
          <div
            class="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
          >
            <p class="text-xs text-slate-400">Bio Age</p>
            <p class="mt-2 text-2xl font-bold text-amber-400">Longevity</p>
          </div>
          <div
            class="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
          >
            <p class="text-xs text-slate-400">Family Risk</p>
            <p class="mt-2 text-2xl font-bold text-emerald-400">Hereditary</p>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500">{{ stat.label }}</p>
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl"
            :class="stat.iconBg"
          >
            <span>{{ stat.icon }}</span>
          </div>
        </div>
        <p
          class="mt-3 text-3xl font-bold text-slate-900"
          :class="stat.valueColor"
        >
          {{ stat.value }}
        </p>
        <p class="mt-1 text-xs" :class="stat.changeColor">{{ stat.change }}</p>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      <div
        class="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
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
            class="text-xs font-semibold text-blue-600 hover:underline"
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
        <div v-else-if="reports.length" class="space-y-3">
          <NuxtLink
            v-for="report in reports.slice(0, 4)"
            :key="report.id"
            :to="`/reports/${report.id}`"
            class="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:bg-slate-50"
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
              <p class="text-xs text-slate-400">Risk</p>
              <p class="text-lg font-bold" :class="riskClass(report.riskScore)">
                {{ report.riskScore ?? "-" }}
              </p>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="rounded-2xl bg-slate-50 p-8 text-center">
          <p class="text-slate-500 text-sm">No reports uploaded yet.</p>
          <NuxtLink
            to="/reports/upload"
            class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
            >Upload your first report →</NuxtLink
          >
        </div>
      </div>
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 class="font-bold text-slate-900 mb-1">Quick Actions</h4>
        <p class="text-xs text-slate-500 mb-5">Start your health journey</p>
        <div class="space-y-3">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.label"
            :to="action.to"
            class="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 hover:bg-slate-50"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
              :class="action.iconBg"
            >
              {{ action.icon }}
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
const api = useMedivoyApi();
const reports = ref<any[]>([]);
const loadingReports = ref(true);
const auth = useAuthStore();

const stats = computed(() => [
  {
    label: "Health score",
    value: auth.user?.healthScore ?? "87",
    icon: "❤️",
    iconBg: "bg-rose-50",
    valueColor: "text-slate-900",
    change: auth.user?.healthChange ?? "+2 from last month",
    changeColor: "text-emerald-600",
  },
  {
    label: "Risk score",
    value: auth.user?.riskScore ? `${auth.user.riskScore}%` : "24%",
    icon: "⚠️",
    iconBg: "bg-amber-50",
    valueColor: "text-amber-600",
    change: "Moderate risk zone",
    changeColor: "text-amber-500",
  },
  {
    label: "Bio age",
    value: auth.user?.bioAge ?? "35",
    icon: "🧬",
    iconBg: "bg-violet-50",
    valueColor: "text-violet-600",
    change: "2 yrs below calendar age",
    changeColor: "text-emerald-600",
  },
  {
    label: "Reports",
    value: String(reports.value.length),
    icon: "📋",
    iconBg: "bg-blue-50",
    valueColor: "text-blue-600",
    change: reports.value.length
      ? "Latest reports loaded"
      : "Upload to get started",
    changeColor: "text-slate-400",
  },
]);

const quickActions = [
  {
    label: "Upload report",
    desc: "Blood, DNA, scan or PDF",
    icon: "📤",
    iconBg: "bg-blue-50",
    to: "/reports/upload",
  },
  {
    label: "View reports",
    desc: "All uploaded reports",
    icon: "📋",
    iconBg: "bg-slate-100",
    to: "/reports",
  },
  {
    label: "Family risk",
    desc: "Hereditary health history",
    icon: "👨‍👩‍👧",
    iconBg: "bg-rose-50",
    to: "/family",
  },
  {
    label: "Nutrition",
    desc: "Vitamin & diet guidance",
    icon: "🥦",
    iconBg: "bg-emerald-50",
    to: "/nutrition",
  },
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

onMounted(async () => {
  try {
    reports.value = await api.getReports();
  } catch {
    reports.value = [];
  } finally {
    loadingReports.value = false;
  }
});
</script>
