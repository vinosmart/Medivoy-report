<template>
  <div class="dashboard-page">
    <section class="page-heading">
      <div>
        <p class="breadcrumb">Workspace <span>/</span> Dashboard</p>
        <h1>
          <span class="heading-health">Health</span>
          <span
            :class="['dashboard-title-typewriter', { 'dashboard-title-typewriter-active': animateDashboardTitle }]"
            aria-label="Dashboard"
          ><span class="heading-dashboard">Dashboard</span></span>
        </h1>
        <p>{{ currentDate }} · Account overview</p>
      </div>
      <NuxtLink to="/reports/upload" class="primary-action">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        Upload report
      </NuxtLink>
    </section>

    <section class="summary-grid" aria-label="Health summary">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        :class="['summary-card', `metric-card-${metric.icon}`]"
      >
        <div class="summary-label">
          <span>{{ metric.label }}</span>
          <span class="summary-icon" :class="metric.tone">
            <svg v-if="metric.icon === 'health'" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12h4.2l2.2-5.5 4.3 11 2.2-5.5H21" />
            </svg>
            <svg v-else-if="metric.icon === 'risk'" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 19 6v5c0 4.4-2.8 7.8-7 10-4.2-2.2-7-5.6-7-10V6l7-3Z" />
              <path d="M12 8.5v4M12 16h.01" />
            </svg>
            <svg v-else-if="metric.icon === 'bio'" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l3 1.8M9 2h6M12 2v3" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 4.5h6a2 2 0 0 1 2 2V20H7V6.5a2 2 0 0 1 2-2ZM9 4.5V3h6v1.5M10 11h4M10 14.5h4M10 18h2" />
            </svg>
          </span>
        </div>
        <strong class="summary-value">{{ metricDisplayValue(metric) }}</strong>
        <p :class="metric.noteTone">{{ metric.note }}</p>
      </article>
    </section>

    <section class="workspace-grid">
      <article class="workspace-card reports-card">
        <header class="card-header">
          <div>
            <h2>Recent reports</h2>
            <p>Latest files uploaded to your account</p>
          </div>
          <NuxtLink to="/reports" class="text-link text-link-outline">View all reports <span aria-hidden="true">→</span></NuxtLink>
        </header>

        <div v-if="loadingReports" class="loading-list" aria-label="Loading reports">
          <div v-for="n in 4" :key="n"></div>
        </div>

        <div v-else-if="reports.length" class="table-list">
          <NuxtLink v-for="report in reports.slice(0, 5)" :key="report.id" :to="`/reports/${report.id}`" class="report-row">
            <span class="file-type" :class="fileTone(report.type)">
              {{ report.type ? String(report.type).slice(0, 3).toUpperCase() : "RPT" }}
            </span>
            <div class="report-info">
              <strong>{{ report.title }}</strong>
              <span>{{ formatDate(report.createdAt) }}</span>
            </div>
            <span class="status" :class="statusClass(report.status)">{{ statusLabel(report.status) }}</span>
            <div class="risk">
              <span>Risk</span>
              <strong :class="riskClass(report.riskScore)">{{ report.riskScore ?? "—" }}</strong>
            </div>
            <svg class="row-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </NuxtLink>
        </div>

        <div v-else class="empty-state">
          <div class="empty-art" aria-hidden="true">
            <span class="empty-art-orbit"></span>
            <span class="empty-icon">
              <svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7V3ZM14 3v5h4M10 13h5M10 17h5" /></svg>
            </span>
            <span class="empty-plus">+</span>
          </div>
          <div class="empty-copy">
            <span class="empty-kicker">GET STARTED</span>
            <h3>Start with your first report</h3>
            <p>Upload a lab result to see your health information organized in one place.</p>
            <div class="empty-actions">
              <NuxtLink to="/reports/upload" class="empty-action">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 16v4h14v-4" /></svg>
                Upload your first report
              </NuxtLink>
              <span class="empty-formats">PDF, JPG or PNG</span>
            </div>
          </div>
        </div>
      </article>

      <aside class="workspace-card actions-card">
        <header class="card-header">
          <div>
            <h2>Quick actions</h2>
            <p>Frequently used features</p>
          </div>
        </header>

        <nav class="quick-list" aria-label="Quick actions">
          <NuxtLink v-for="action in quickActions" :key="action.label" :to="action.to" class="quick-row">
            <span class="quick-icon" :class="action.tone">
              <svg v-if="action.icon === 'upload'" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 16v4h14v-4" /></svg>
              <svg v-else-if="action.icon === 'reports'" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v18H7V3ZM10 8h4M10 12h4M10 16h4" /></svg>
              <svg v-else-if="action.icon === 'family'" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2M5 11v4M19 11v4" /></svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c5-3 7-7 7-11A7 7 0 1 0 5 10c0 4 2 8 7 11ZM8.5 12h7M12 8.5v7" /></svg>
            </span>
            <span class="quick-copy"><strong>{{ action.label }}</strong><small>{{ action.desc }}</small></span>
            <svg class="row-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </NuxtLink>
        </nav>
      </aside>

      <article class="workspace-card compliance-card">
        <div class="compliance-mark" aria-hidden="true">
          <div class="compliance-icon">
            <svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3ZM9 12l2 2 4-4" /></svg>
          </div>
        </div>
        <div class="compliance-copy">
          <div class="compliance-overline">
            <span>Privacy &amp; security</span>
            <span class="compliance-status"><i></i>Protected</span>
          </div>
          <h2>Health account status</h2>
          <p>Your profile and report information remain private and secure.</p>
        </div>
        <NuxtLink to="/family" class="text-link text-link-primary">Review health profile <span aria-hidden="true">→</span></NuxtLink>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const auth = useAuthStore();
const reports = ref<any[]>([]);
const loadingReports = ref(true);
const animateDashboardTitle = ref(false);
const animatedMetricValues = reactive<Record<string, number>>({});
const metricAnimationFrames = new Map<string, number>();
let dashboardIsActive = false;

const currentDate = computed(() =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date()),
);

const metrics = computed(() => [
  { key: "health", label: "Health score", value: auth.user?.healthScore ?? "87", icon: "health", tone: "tone-health", note: auth.user?.healthChange ?? "+2 from last month", noteTone: "note-positive" },
  { key: "risk", label: "Risk score", value: auth.user?.riskScore ? `${auth.user.riskScore}%` : "24%", icon: "risk", tone: "tone-risk", note: "Moderate risk zone", noteTone: "note-warning" },
  { key: "bio", label: "Bio age", value: auth.user?.bioAge ?? "35", icon: "bio", tone: "tone-bio", note: "2 years below calendar age", noteTone: "note-positive" },
  { key: "reports", label: "Reports", value: String(reports.value.length), icon: "reports", tone: "tone-reports", note: reports.value.length ? "Latest reports loaded" : "Upload to get started", noteTone: "note-muted" },
]);

const quickActions = [
  { label: "Upload report", desc: "Blood, DNA, scan or PDF", icon: "upload", tone: "tone-reports", to: "/reports/upload" },
  { label: "View reports", desc: "Manage uploaded reports", icon: "reports", tone: "tone-reports", to: "/reports" },
  { label: "Family health", desc: "Hereditary health history", icon: "family", tone: "tone-health", to: "/family" },
  { label: "Nutrition guidance", desc: "Diet and vitamin support", icon: "nutrition", tone: "tone-nutrition", to: "/nutrition" },
];

const formatDate = (date: string) => date
  ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date))
  : "Date unavailable";

const fileTone = (type?: string) => type === "dna" ? "type-dna" : type === "blood" ? "type-blood" : "type-general";
const riskClass = (score?: number) => !score ? "risk-low" : score >= 60 ? "risk-high" : score >= 30 ? "risk-medium" : "risk-low";
const statusClass = (status?: string) => status === "completed" ? "status-completed" : status === "failed" ? "status-failed" : "status-processing";
const statusLabel = (status?: string) => {
  if (!status) return "Processing";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const metricNumber = (value: string | number) => {
  const match = String(value).match(/^(-?[\d,.]+)/);
  if (!match) return null;

  const number = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(number) ? number : null;
};

const metricDisplayValue = (metric: (typeof metrics.value)[number]) => {
  const currentValue = animatedMetricValues[metric.key];
  if (currentValue === undefined) return String(metric.value);

  const rawValue = String(metric.value);
  const match = rawValue.match(/^(-?[\d,.]+)(.*)$/);
  if (!match) return rawValue;

  const decimalPlaces = match[1].split(".")[1]?.length ?? 0;
  const scale = 10 ** decimalPlaces;
  const roundedValue = Math.round(currentValue * scale) / scale;
  const formattedValue = decimalPlaces
    ? roundedValue.toFixed(decimalPlaces)
    : String(Math.round(roundedValue));

  return `${formattedValue}${match[2]}`;
};

const animateMetricCount = (metric: (typeof metrics.value)[number]) => {
  const target = metricNumber(metric.value);
  if (target === null) return;

  const previousFrame = metricAnimationFrames.get(metric.key);
  if (previousFrame !== undefined) cancelAnimationFrame(previousFrame);

  const startValue = animatedMetricValues[metric.key] ?? 0;
  if (startValue === target) {
    animatedMetricValues[metric.key] = target;
    return;
  }

  const startTime = performance.now();
  const duration = 900;
  animatedMetricValues[metric.key] = startValue;

  const updateCount = (now: number) => {
    if (!dashboardIsActive) return;

    const progress = Math.min((now - startTime) / duration, 1);
    const easedProgress = 1 - (1 - progress) ** 3;
    animatedMetricValues[metric.key] =
      startValue + (target - startValue) * easedProgress;

    if (progress < 1) {
      metricAnimationFrames.set(
        metric.key,
        requestAnimationFrame(updateCount),
      );
    } else {
      animatedMetricValues[metric.key] = target;
      metricAnimationFrames.delete(metric.key);
    }
  };

  metricAnimationFrames.set(metric.key, requestAnimationFrame(updateCount));
};

onMounted(async () => {
  dashboardIsActive = true;
  animateDashboardTitle.value = true;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!reduceMotion) {
    metrics.value
      .filter((metric) => metric.key !== "reports")
      .forEach(animateMetricCount);
  }

  try {
    reports.value = await api.getReports();
  } catch {
    reports.value = [];
  } finally {
    loadingReports.value = false;
    if (!reduceMotion && dashboardIsActive) {
      const reportsMetric = metrics.value.find(
        (metric) => metric.key === "reports",
      );
      if (reportsMetric) animateMetricCount(reportsMetric);
    }
  }
});

onBeforeUnmount(() => {
  dashboardIsActive = false;
  metricAnimationFrames.forEach((frame) => cancelAnimationFrame(frame));
  metricAnimationFrames.clear();
});
</script>

<style scoped>
.dashboard-page { display: grid; gap: 22px; }
.page-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
.breadcrumb { margin: 0 0 8px; color: #8a94a4; font-size: 11px; font-weight: 700; }
.breadcrumb span { margin: 0 5px; color: #bbc2cd; }
.page-heading h1 { margin: 0; color: #172033; font-size: 30px; line-height: 1.15; letter-spacing: -.025em; }
.page-heading > div > p:last-child { margin: 7px 0 0; color: #7f8997; font-size: 12px; }
.primary-action { height: 44px; display: inline-flex; align-items: center; gap: 8px; border: 1px solid #17233f; border-radius: 8px; background: #17233f; padding: 0 15px; color: #fff; font-size: 12px; font-weight: 750; box-shadow: 0 5px 12px rgba(23,35,63,.10); }
.primary-action:hover { background: #24334f; }
.primary-action svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }

.summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
.summary-card { min-width: 0; border: 1px solid #e3e7ed; border-radius: 12px; background: #fff; padding: 17px 18px; box-shadow: 0 2px 8px rgba(21,32,52,.025); }
.summary-label { display: flex; align-items: center; justify-content: space-between; color: #758195; font-size: 11px; font-weight: 650; }
.summary-icon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 8px; }
.summary-icon svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.tone-health { background:#fdf1f3; color:#bd6270; } .tone-risk { background:#fff4e5; color:#b88132; } .tone-bio { background:#f1eef9; color:#7765aa; } .tone-reports { background:#edf3f8; color:#58799a; } .tone-nutrition { background:#edf7f1; color:#4b9170; }
.summary-value { display:block; margin-top:13px; color:#172033; font-size:29px; line-height:1; letter-spacing:-.03em; }
.summary-card p { margin:9px 0 0; font-size:9px; font-weight:700; }
.note-positive { color:#4d9270; } .note-warning { color:#b88132; } .note-muted { color:#9aa3b0; }

.workspace-grid { display:grid; grid-template-columns:minmax(0,1.7fr) minmax(280px,.7fr); gap:12px; }
.workspace-card { border:1px solid #e3e7ed; border-radius:12px; background:#fff; box-shadow:0 2px 8px rgba(21,32,52,.025); }
.reports-card, .actions-card { padding:18px; }
.card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.card-header h2 { margin:0; color:#20283a; font-size:15px; }
.card-header p { margin:4px 0 0; color:#969fad; font-size:10px; }
.text-link { color:#58779a; font-size:10px; font-weight:800; }
.text-link:hover { text-decoration:underline; }
.text-link span { margin-left:4px; }
.table-list { display:grid; gap:6px; }
.report-row { min-height:62px; display:grid; grid-template-columns:42px minmax(120px,1fr) auto 55px 15px; align-items:center; gap:10px; border:1px solid #edf0f3; border-radius:9px; padding:7px 9px; }
.report-row:hover { border-color:#dce3ea; background:#fbfcfd; }
.file-type { width:40px; height:40px; display:grid; place-items:center; border-radius:7px; font-size:8px; font-weight:850; }
.type-blood { background:#edf3f8; color:#58799a; } .type-dna { background:#f1eef9; color:#7765aa; } .type-general { background:#f3f4f6; color:#70798a; }
.report-info { min-width:0; } .report-info strong,.report-info span { display:block; } .report-info strong { overflow:hidden; color:#283145; font-size:11px; text-overflow:ellipsis; white-space:nowrap; } .report-info span { margin-top:4px; color:#9aa2af; font-size:9px; }
.status { border-radius:999px; padding:5px 7px; font-size:8px; font-weight:800; }
.status-completed { background:#edf7f1; color:#4b936d; } .status-failed { background:#fdf1f3; color:#b95d69; } .status-processing { background:#fff5e7; color:#b88132; }
.risk { text-align:right; } .risk span,.risk strong { display:block; } .risk span { color:#9fa6b2; font-size:8px; } .risk strong { margin-top:3px; font-size:13px; } .risk-low { color:#4b936d; } .risk-medium { color:#b88132; } .risk-high { color:#b95d69; }
.row-arrow { width:14px;height:14px;fill:none;stroke:#9ba4b1;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round; }
.loading-list { display:grid;gap:6px; } .loading-list div { height:62px;border-radius:9px;background:linear-gradient(90deg,#f1f3f6 25%,#fafbfc 50%,#f1f3f6 75%);background-size:200% 100%;animation:shimmer 1.4s infinite; } @keyframes shimmer{to{background-position:-200% 0}}
.empty-state { min-height:240px; display:flex; flex-direction:column; align-items:center; justify-content:center; border:1px dashed #dde3ea; border-radius:9px; text-align:center; }
.empty-icon { width:40px;height:40px;display:grid;place-items:center;border-radius:8px;background:#eef3f7;color:#58799a; } .empty-icon svg { width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round; }
.empty-state h3 { margin:10px 0 3px;color:#283145;font-size:13px; } .empty-state p { margin:0 0 10px;color:#969fad;font-size:10px; } .empty-action { color:#58779a;font-size:10px;font-weight:800; }
.quick-list { display:grid;gap:6px; } .quick-row { min-height:66px;display:grid;grid-template-columns:40px 1fr 15px;align-items:center;gap:10px;border:1px solid #edf0f3;border-radius:9px;padding:7px 9px; } .quick-row:hover { border-color:#dce3ea;background:#fbfcfd; }
.quick-icon { width:38px;height:38px;display:grid;place-items:center;border-radius:7px; } .quick-icon svg { width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round; }
.quick-copy strong,.quick-copy small { display:block; } .quick-copy strong { color:#283145;font-size:11px; } .quick-copy small { margin-top:4px;color:#969fad;font-size:9px; }
.compliance-card { grid-column:1/-1; display:flex;align-items:center;justify-content:space-between;padding:14px 18px; } .compliance-copy { display:flex;align-items:center;gap:11px; } .compliance-icon { width:38px;height:38px;display:grid;place-items:center;border-radius:8px;background:#edf7f1;color:#4b9170; } .compliance-icon svg { width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round; } .compliance-copy h2 { margin:0;color:#283145;font-size:12px; } .compliance-copy p { margin:3px 0 0;color:#969fad;font-size:9px; }

@media(max-width:1180px){.summary-grid{grid-template-columns:1fr 1fr}.workspace-grid{grid-template-columns:1fr}.compliance-card{grid-column:auto}}
@media(max-width:640px){.page-heading{align-items:flex-start}.page-heading h1{font-size:26px}.primary-action{width:44px;flex:0 0 44px;justify-content:center;padding:0;font-size:0}.summary-grid{grid-template-columns:1fr 1fr;gap:8px}.summary-card{padding:14px}.summary-value{font-size:25px}.report-row{grid-template-columns:42px 1fr auto 15px}.risk{display:none}.compliance-card{align-items:flex-start}.compliance-card>.text-link{display:none}}
@media(max-width:420px){.summary-grid{grid-template-columns:1fr 1fr}.status{max-width:68px;overflow:hidden;text-overflow:ellipsis}.breadcrumb{font-size:9px}}

.page-heading h1 { color:#1d3554; }
.primary-action { border-color:#3478cc; background:#3478cc; box-shadow:0 8px 18px rgba(52,120,204,.18); }
.primary-action:hover { background:#2867b4; }
.summary-card,.workspace-card { border-color:#dfe9f6; border-radius:16px; box-shadow:0 8px 26px rgba(33,75,126,.055); }
.summary-card { padding:18px 19px; }
.summary-label { color:#7187a2; }
.summary-value { color:#1d3554; }
.tone-reports { background:#eaf3ff; color:#3478cc; }
.text-link { color:#3478cc; }
.report-row,.quick-row { border-color:#e8eff8; border-radius:11px; }
.report-row:hover,.quick-row:hover { border-color:#d0e2f7; background:#f7faff; }
.file-type.type-blood { background:#eaf3ff; color:#3478cc; }
.compliance-icon { background:#eaf3ff; color:#3478cc; }
.empty-icon { background:#eaf3ff; color:#3478cc; }

.dashboard-page { gap:24px; font-family:Poppins,system-ui,sans-serif; }
.page-heading { align-items:center; padding:4px 2px; }
.breadcrumb { color:#6f91b8; font-size:11px; letter-spacing:.07em; text-transform:uppercase; }
.page-heading h1 { font-size:clamp(28px,3vw,34px); font-weight:650; letter-spacing:-.04em; }
.page-heading > div > p:last-child { color:#7e93ad; font-size:13px; }
.primary-action { height:48px; border-radius:12px; padding:0 18px; background:linear-gradient(135deg,#438cdf,#286bc0); font-size:13px; }
.primary-action:hover { background:linear-gradient(135deg,#347bc9,#245fa8); }
.summary-grid { gap:14px; }
.summary-card { position:relative; min-height:138px; overflow:hidden; border-radius:18px; padding:19px 20px; transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
.summary-card::after { position:absolute; right:-28px; bottom:-42px; width:112px; height:112px; border-radius:50%; background:rgba(234,243,255,.72); content:""; pointer-events:none; }
.summary-card > * { position:relative; z-index:1; }
.summary-card:hover { transform:translateY(-2px); border-color:#cfe0f5; box-shadow:0 14px 30px rgba(37,87,145,.09); }
.summary-label { color:#7187a2; font-size:13px; }
.summary-icon { width:38px; height:38px; border-radius:12px; }
.summary-icon svg { width:18px; height:18px; }
.summary-value { margin-top:16px; font-size:34px; }
.summary-card p { margin-top:10px; font-size:11px; }
.workspace-grid { gap:16px; }
.workspace-card { border-radius:18px; }
.reports-card,.actions-card { padding:22px; }
.card-header { margin-bottom:18px; }
.card-header h2 { color:#203b5e; font-size:17px; font-weight:650; letter-spacing:-.02em; }
.card-header p { color:#8196b0; font-size:12px; }
.text-link { font-size:12px; }
.table-list,.quick-list { gap:8px; }
.report-row { min-height:68px; border-radius:12px; padding:9px 11px; }
.report-row:hover,.quick-row:hover { box-shadow:0 5px 16px rgba(37,87,145,.05); }
.report-info strong,.quick-copy strong { color:#2b4566; font-size:13px; }
.report-info span,.quick-copy small { color:#8196b0; font-size:11px; }
.status { padding:6px 9px; font-size:10px; }
.empty-state { min-height:250px; border:1px solid #e4edf8; border-radius:14px; background:linear-gradient(180deg,#fbfdff,#f6f9ff); }
.empty-icon { width:46px; height:46px; border-radius:14px; }
.empty-icon svg { width:21px; height:21px; }
.empty-state h3 { margin-top:13px; color:#2b4566; font-size:15px; }
.empty-state p { margin-bottom:14px; color:#8196b0; font-size:12px; }
.empty-action { display:inline-flex; align-items:center; justify-content:center; min-height:38px; border-radius:10px; background:#3478cc; padding:0 15px; color:#fff; font-size:11px; transition:background .18s ease; }
.empty-action:hover { background:#2867b4; text-decoration:none; }
.quick-row { min-height:72px; border-radius:12px; padding:9px 11px; }
.quick-icon { width:42px; height:42px; border-radius:12px; }
.compliance-card { border-radius:16px; padding:16px 20px; }
.compliance-copy h2 { color:#2b4566; font-size:14px; }
.compliance-copy p { color:#8196b0; font-size:11px; }
.reports-card { display:flex; flex-direction:column; }
.reports-card .empty-state,.reports-card .table-list,.reports-card .loading-list { flex:1; }
.reports-card .table-list { align-content:start; }
.actions-card { background:#fff; }
.quick-row { background:#fff; transition:transform .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease; }
.quick-row:hover { transform:translateX(3px); border-color:#bcd7f5; background:#f2f8ff; box-shadow:0 8px 20px rgba(48,102,165,.09); }
.quick-icon { box-shadow:inset 0 0 0 1px rgba(52,120,204,.05); }
.quick-icon { border:1px solid #dce9f7; background:#fff; color:#3478cc; }
.quick-row:hover .quick-icon { border-color:#a9cff8; background:#fff; color:#286bc0; }
.quick-row .row-arrow { color:#93a9c2; transition:transform .18s ease, color .18s ease; }
.quick-row:hover .row-arrow { transform:translateX(2px); color:#3478cc; }
.empty-state { display:grid; grid-template-columns:128px minmax(0,1fr); align-items:center; gap:28px; padding:32px clamp(22px,5vw,64px); border:1px solid #e1ebf8; border-radius:18px; background:#fff; text-align:left; }
.empty-art { position:relative; width:112px; height:112px; display:grid; place-items:center; border:1px solid #d7e8fb; border-radius:32px; background:#fff; box-shadow:0 10px 24px rgba(52,120,204,.08); }
.empty-art-orbit { position:absolute; inset:-10px; border:1px solid rgba(125,174,226,.3); border-radius:38px; }
.empty-art .empty-icon { width:64px; height:64px; border:1px solid #0b1c39; border-radius:21px; background:#0b1c39; color:#fff; box-shadow:0 8px 18px rgba(11,28,57,.16); }
.empty-art .empty-icon svg { width:28px; height:28px; fill:none; stroke:currentColor; stroke-width:1.55; stroke-linecap:round; stroke-linejoin:round; }
.empty-plus { position:absolute; top:7px; right:7px; width:28px; height:28px; display:grid; place-items:center; border:3px solid #f5f9ff; border-radius:10px; background:#3478cc; color:#fff; font-size:19px; line-height:1; }
.empty-copy { max-width:540px; }
.empty-kicker { color:#4381c2; font-size:10px; font-weight:700; letter-spacing:.14em; }
.empty-state h3 { margin:8px 0 6px; color:#203b5e; font-size:20px; font-weight:650; letter-spacing:-.03em; }
.empty-state p { max-width:460px; margin:0; color:#7188a5; font-size:13px; line-height:1.7; }
.empty-actions { display:flex; flex-wrap:wrap; align-items:center; gap:14px; margin-top:19px; }
.empty-action { min-height:42px; gap:8px; border-radius:11px; background:linear-gradient(135deg,#438cdf,#286bc0); padding:0 17px; font-size:12px; font-weight:650; box-shadow:0 8px 18px rgba(52,120,204,.18); }
.empty-action:hover { background:linear-gradient(135deg,#347bc9,#245fa8); box-shadow:0 10px 22px rgba(40,103,180,.23); }
.empty-action svg { width:15px; height:15px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
.empty-formats { color:#8ca0b8; font-size:11px; }
.compliance-card { border-color:#dce9f7; background:#fff; box-shadow:0 10px 26px rgba(37,87,145,.06); }
.compliance-icon { width:42px; height:42px; border:1px solid #dce9f7; border-radius:13px; background:#fff; color:#3478cc; box-shadow:0 4px 12px rgba(52,120,204,.08); }
.compliance-copy h2 { color:#203b5e; font-size:15px; }
.compliance-copy p { color:#7188a5; font-size:12px; }
.summary-card { border-top:3px solid #3478cc; padding-top:17px; background:#fff; }
.metric-card-health,.metric-card-risk,.metric-card-bio,.metric-card-reports { --metric-accent:#3478cc; --metric-hover:#f2f8ff; }
.summary-card::after { background:var(--metric-hover); opacity:0; transition:transform .25s ease, opacity .25s ease; }
.summary-card:hover { transform:translateY(-4px); border-color:#3478cc; background:#f7faff; box-shadow:0 16px 32px rgba(48,102,165,.13); }
.summary-card:hover::after { transform:scale(1.25); opacity:.55; }
.summary-card:hover .summary-label { color:var(--metric-accent); }
.summary-card:hover .summary-value { color:var(--metric-accent); }
.summary-card:hover .summary-icon { background:var(--metric-accent); color:#fff; transform:translateY(-1px); }
.summary-icon { border:1px solid #dce9f7; background:#fff; color:#3478cc; transition:background .2s ease, color .2s ease, transform .2s ease; }
@media(max-width:640px) {
  .dashboard-page { gap:18px; }
  .page-heading { align-items:flex-start; }
  .page-heading h1 { font-size:26px; }
  .summary-grid { gap:9px; }
  .summary-card { min-height:126px; padding:14px; }
  .summary-label { font-size:12px; }
  .summary-value { margin-top:12px; font-size:29px; }
  .summary-card p { font-size:10px; }
  .report-info strong,.quick-copy strong { font-size:12px; }
  .report-info span,.quick-copy small { font-size:10px; }
  .reports-card,.actions-card { padding:16px; }
  .empty-state { grid-template-columns:1fr; justify-items:center; gap:20px; min-height:300px; padding:24px 18px; text-align:center; }
  .empty-copy { display:flex; flex-direction:column; align-items:center; }
  .empty-state p { max-width:360px; }
  .empty-actions { justify-content:center; }
  .compliance-card > .text-link { display:none; }
}
.summary-grid { gap:18px; }
.summary-card {
  min-height:148px;
  border:1px solid #e4ebf5;
  border-top:2px solid var(--metric-accent);
  border-radius:19px;
  background:#fff;
  padding:17px 19px;
  box-shadow:0 8px 22px rgba(37,87,145,.055);
}
.metric-card-health { --metric-accent:#e96d86; --metric-soft:#fff1f4; --metric-hover:#fff9fa; }
.metric-card-risk { --metric-accent:#e5a02c; --metric-soft:#fff4e5; --metric-hover:#fffaf2; }
.metric-card-bio { --metric-accent:#8c75cb; --metric-soft:#f2eefb; --metric-hover:#fbf9ff; }
.metric-card-reports { --metric-accent:#438be0; --metric-soft:#eaf3ff; --metric-hover:#f7faff; }
.summary-card::after {
  display:block;
  right:-31px;
  bottom:-42px;
  width:112px;
  height:112px;
  background:var(--metric-soft);
  opacity:.75;
  transition:transform .25s ease, opacity .25s ease;
}
.summary-card:hover {
  transform:translateY(-3px);
  border-color:var(--metric-accent);
  border-top-color:var(--metric-accent);
  background:var(--metric-hover);
  box-shadow:0 14px 28px rgba(37,87,145,.11);
}
.summary-card:hover::after { transform:scale(1.15); opacity:1; }
.summary-card:hover .summary-label,.summary-card:hover .summary-value { color:#1d3554; }
.summary-label { color:#7187a2; font-size:13px; font-weight:700; }
.summary-icon {
  width:38px;
  height:38px;
  border:1px solid var(--metric-soft);
  border-radius:12px;
  background:var(--metric-soft);
  color:var(--metric-accent);
}
.summary-icon svg { width:18px; height:18px; }
.summary-card:hover .summary-icon { border-color:var(--metric-accent); background:var(--metric-accent); color:#fff; }
.summary-value { margin-top:13px; font-size:34px; line-height:1.05; }
.summary-card p { margin-top:9px; font-size:11px; }
@media(max-width:640px) {
  .summary-grid { gap:9px; }
  .summary-card { min-height:142px; padding:13px; border-radius:16px; }
  .summary-label { font-size:11px; }
  .summary-icon { width:34px; height:34px; border-radius:10px; }
  .summary-icon svg { width:16px; height:16px; }
  .summary-value { margin-top:12px; font-size:29px; }
  .summary-card p { margin-top:8px; font-size:9px; }
}
.text-link-outline,.text-link-primary {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  border-radius:11px;
  padding:10px 13px;
  font-size:12px;
  font-weight:700;
  line-height:1;
  text-decoration:none;
  white-space:nowrap;
  transition:background .18s ease, border-color .18s ease, box-shadow .18s ease, color .18s ease, transform .18s ease;
}
.text-link-outline {
  border:1px solid #d6e5f6;
  background:#fff;
  color:#3478cc;
  box-shadow:0 2px 6px rgba(37,87,145,.035);
}
.text-link-outline:hover {
  border-color:#a9cff8;
  background:#f3f8ff;
  color:#286bc0;
  text-decoration:none;
}
.text-link-primary {
  border:1px solid #3478cc;
  background:linear-gradient(135deg,#438cdf,#286bc0);
  color:#fff;
  box-shadow:0 6px 14px rgba(52,120,204,.18);
}
.text-link-primary:hover {
  transform:translateY(-1px);
  border-color:#2867b4;
  background:linear-gradient(135deg,#347bc9,#245fa8);
  color:#fff;
  box-shadow:0 9px 18px rgba(40,103,180,.23);
  text-decoration:none;
}
.text-link-outline span,.text-link-primary span {
  margin-left:0;
  transition:transform .18s ease;
}
.text-link-outline:hover span,.text-link-primary:hover span { transform:translateX(2px); }
.text-link-outline:focus-visible,.text-link-primary:focus-visible {
  outline:3px solid rgba(67,140,223,.3);
  outline-offset:3px;
}
@media(max-width:640px) {
  .compliance-card { flex-wrap:wrap; gap:14px; }
  .compliance-card > .text-link-primary { display:inline-flex; width:100%; }
}
.page-heading {
  position:relative;
  isolation:isolate;
  min-height:172px;
  align-items:center;
  overflow:hidden;
  border:1px solid #e2ebf6;
  border-radius:20px;
  background:#fff;
  padding:24px 28px;
  box-shadow:0 12px 30px rgba(37,87,145,.055);
}
.page-heading::before {
  position:absolute;
  z-index:-1;
  inset:0 0 auto;
  height:3px;
  background:linear-gradient(90deg,#3478cc 0%,#8bb8eb 38%,#e8f1fb 100%);
  content:"";
}
.page-heading::after {
  position:absolute;
  z-index:-1;
  top:-130px;
  right:-80px;
  width:280px;
  height:280px;
  border:1px solid #edf3fa;
  border-radius:50%;
  box-shadow:0 0 0 22px #fff,0 0 0 23px #f3f7fc;
  content:"";
  pointer-events:none;
}
.page-heading > div,.page-heading > .primary-action {
  position:relative;
  z-index:1;
}
.breadcrumb {
  display:inline-flex;
  align-items:center;
  gap:8px;
  margin-bottom:13px;
  padding:0;
  color:#7187a2;
  font-size:10px;
  font-weight:750;
  letter-spacing:.12em;
}
.breadcrumb::before {
  width:6px;
  height:6px;
  border-radius:50%;
  background:#438cdf;
  box-shadow:0 0 0 3px #edf5ff;
  content:"";
}
.breadcrumb span { margin:0; color:#a5b8cf; }
.page-heading h1 {
  color:#1d3554;
  font-size:clamp(30px,3vw,36px);
  font-weight:700;
  line-height:1.15;
  letter-spacing:-.04em;
}
.heading-health { color:#172033; }
.heading-dashboard { color:#438cdf; }
.page-heading > div > p:last-child {
  display:flex;
  align-items:center;
  gap:9px;
  margin-top:10px;
  color:#7187a2;
  font-size:13px;
}
.page-heading > div > p:last-child::before {
  width:6px;
  height:6px;
  flex:0 0 6px;
  border-radius:50%;
  background:#7eaddf;
  content:"";
}
@media(max-width:640px) {
  .page-heading { min-height:0; align-items:flex-start; flex-direction:column; gap:18px; padding:22px 19px; border-radius:17px; }
  .page-heading::after { top:-150px; right:-150px; }
  .page-heading h1 { font-size:28px; }
  .page-heading > div > p:last-child { font-size:11px; }
  .page-heading .primary-action { width:100%; height:44px; flex:none; justify-content:center; padding:0 14px; font-size:12px; }
}
.compliance-card {
  position:relative;
  isolation:isolate;
  display:grid;
  grid-template-columns:52px minmax(0,1fr) auto;
  align-items:center;
  gap:18px;
  overflow:hidden;
  border:1px solid #e1eaf5;
  border-radius:19px;
  background:#fff;
  padding:21px 24px;
  box-shadow:0 10px 26px rgba(37,87,145,.05);
}
.compliance-card::before {
  position:absolute;
  z-index:-1;
  inset:18px auto 18px 0;
  width:3px;
  border-radius:0 4px 4px 0;
  background:linear-gradient(180deg,#438cdf,#a9cff8);
  content:"";
}
.compliance-mark { display:grid; place-items:center; }
.compliance-icon {
  width:50px;
  height:50px;
  display:grid;
  place-items:center;
  border:1px solid #dce9f7;
  border-radius:15px;
  background:#f7faff;
  color:#3478cc;
  box-shadow:none;
}
.compliance-icon svg { width:21px; height:21px; fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
.compliance-copy { display:block; min-width:0; }
.compliance-overline { display:flex; align-items:center; gap:10px; margin-bottom:5px; color:#8095af; font-size:9px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
.compliance-status { display:inline-flex; align-items:center; gap:5px; border:1px solid #dceee4; border-radius:999px; background:#f5faf7; padding:3px 7px; color:#50836a; font-size:8px; letter-spacing:.04em; }
.compliance-status i { width:5px; height:5px; border-radius:50%; background:#55a477; }
.compliance-copy h2 { margin:0; color:#203b5e; font-size:16px; font-weight:650; letter-spacing:-.02em; }
.compliance-copy p { margin:4px 0 0; color:#7188a5; font-size:12px; line-height:1.5; }
@media(max-width:640px) {
  .compliance-card { grid-template-columns:40px minmax(0,1fr); gap:12px; padding:17px; border-radius:16px; }
  .compliance-icon { width:40px; height:40px; border-radius:12px; }
  .compliance-icon svg { width:18px; height:18px; }
  .compliance-card > .text-link-primary { grid-column:1/-1; width:100%; }
  .compliance-copy h2 { font-size:14px; }
  .compliance-copy p { font-size:11px; }
}
@keyframes dashboard-reveal {
  from { opacity:0; translate:0 10px; }
  to { opacity:1; translate:0 0; }
}
.dashboard-title-typewriter {
  display:inline-block;
  max-width:none;
  margin-left:.18em;
  overflow:hidden;
  vertical-align:bottom;
  white-space:nowrap;
}
.dashboard-title-typewriter-active {
  max-width:0;
  animation:dashboard-typewriter 850ms steps(9,end) 120ms forwards;
}
@keyframes dashboard-typewriter { to { max-width:100%; } }
.dashboard-page > .page-heading,
.summary-card,
.workspace-card,
.empty-state,
.report-row,
.quick-row {
  animation:dashboard-reveal 520ms cubic-bezier(.22,.68,0,1) both;
}
.summary-card:nth-child(1) { animation-delay:70ms; }
.summary-card:nth-child(2) { animation-delay:120ms; }
.summary-card:nth-child(3) { animation-delay:170ms; }
.summary-card:nth-child(4) { animation-delay:220ms; }
.reports-card { animation-delay:180ms; }
.actions-card { animation-delay:240ms; }
.compliance-card { animation-delay:300ms; }
.empty-state { animation-delay:260ms; }
.report-row:nth-child(1),.quick-row:nth-child(1) { animation-delay:280ms; }
.report-row:nth-child(2),.quick-row:nth-child(2) { animation-delay:330ms; }
.report-row:nth-child(3),.quick-row:nth-child(3) { animation-delay:380ms; }
.report-row:nth-child(4),.quick-row:nth-child(4) { animation-delay:430ms; }
.report-row:nth-child(5) { animation-delay:480ms; }
.primary-action,.report-row {
  transition:transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
}
.primary-action:hover { transform:translateY(-1px); }
.report-row .row-arrow { transition:transform 180ms ease, color 180ms ease; }
.report-row:hover .row-arrow { transform:translateX(2px); color:#3478cc; }
@media(prefers-reduced-motion:reduce) {
  .dashboard-page > .page-heading,
  .summary-card,
  .workspace-card,
  .empty-state,
  .report-row,
  .quick-row,
  .loading-list div,
  .dashboard-title-typewriter,
  .primary-action,
  .summary-icon,
  .summary-card::after,
  .report-row .row-arrow,
  .quick-row .row-arrow {
    animation:none;
    translate:none;
    transition:none;
  }
  .summary-card:hover,.quick-row:hover,.primary-action:hover,.report-row:hover,
  .summary-card:hover .summary-icon,.quick-row:hover .row-arrow,.report-row:hover .row-arrow {
    transform:none;
  }
  .dashboard-title-typewriter-active { max-width:none; animation:none; }
}
</style>
