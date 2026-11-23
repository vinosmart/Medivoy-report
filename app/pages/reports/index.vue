<template>
  <div class="reports-page">
    <header class="reports-header">
      <div class="reports-heading-brand">
        <div class="reports-heading-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M9 4.5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v.5" />
            <rect x="6" y="4.5" width="12" height="17" rx="2" />
            <path d="M9 10h6M9 13.5h6M9 17h4" />
          </svg>
        </div>
        <div class="reports-heading-copy">
          <p class="reports-eyebrow"><span></span>Your health records</p>
          <h1>Reports</h1>
          <p class="reports-intro">
            Review your uploaded reports, AI summaries, and risk insights.
          </p>
        </div>
      </div>
      <div class="reports-header-actions">
        <button
          type="button"
          @click="loadReports"
          :disabled="loading"
          class="refresh-button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 7v5h-5M4.8 9A7.5 7.5 0 0 1 18 6l2 2M4 17v-5h5m10.2 3A7.5 7.5 0 0 1 6 18l-2-2" />
          </svg>
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>
        <NuxtLink to="/reports/upload" class="upload-button">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Upload report
        </NuxtLink>
      </div>
    </header>

    <section class="reports-panel" aria-label="Your reports">
      <div class="reports-toolbar">
        <label class="search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 4 4" />
          </svg>
          <input
            v-model="search"
            type="text"
            aria-label="Search reports"
            :placeholder="searchPlaceholder"
          />
        </label>

        <div class="reports-controls">
          <span class="report-count">
            <strong>{{ filteredReports.length }}</strong>
            <span>report{{ filteredReports.length === 1 ? "" : "s" }}</span>
          </span>
          <label class="select-all-control">
            <input v-model="selectAll" type="checkbox" />
            <span>Select all</span>
          </label>
          <button
            type="button"
            @click="bulkDeleteSelected"
            :disabled="selectedIds.length === 0 || deletingBulk"
            class="bulk-delete-button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 14h11l1-14M9 7V4h6v3" />
            </svg>
            {{
              deletingBulk
                ? "Deleting..."
                : `Delete selected (${selectedIds.length})`
            }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="report-list loading-reports" aria-label="Loading reports">
        <div v-for="n in 3" :key="n" class="report-skeleton">
          <span></span>
          <div><i></i><i></i></div>
          <b></b>
        </div>
      </div>

      <div v-else-if="filteredReports.length" class="report-list">
        <article
          v-for="report in filteredReports"
          :key="report.id"
          class="report-card"
        >
          <div class="report-main">
            <input
              v-model="selectedIds"
              :value="report.id"
              type="checkbox"
              :aria-label="`Select ${report.title}`"
              class="report-checkbox"
            />
            <div class="report-copy">
              <h2>{{ report.title }}</h2>
              <div class="report-meta">
                <span class="report-status" :class="statusClass(report.status)">
                  {{ report.status }}
                </span>
                <span class="report-type">{{ report.type?.toUpperCase() }}</span>
                <span class="report-date">{{ formatDate(report.createdAt) }}</span>
              </div>
              <p class="report-summary">
                {{ report.aiSummary || "No summary available yet." }}
              </p>
            </div>
          </div>

          <div class="report-actions">
            <div class="risk-score">
              <span>Risk score</span>
              <strong :class="riskClass(report.riskScore)">
                {{ report.riskScore ?? "—" }}
              </strong>
            </div>
            <NuxtLink :to="`/reports/${report.id}`" class="view-report-button">
              View report <span aria-hidden="true">→</span>
            </NuxtLink>
            <button
              type="button"
              @click="deleteReport(report.id)"
              :disabled="deletingId === report.id"
              class="delete-report-button"
            >
              {{ deletingId === report.id ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </article>
      </div>

      <div v-else class="empty-reports">
        <div class="empty-reports-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 13h4.5l1.5 2h4l1.5-2H20v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z" />
            <path d="M12 12V3m0 0L8.5 6.5M12 3l3.5 3.5" />
          </svg>
        </div>
        <p class="empty-reports-title">
          {{ search ? "No matching reports found" : "No reports yet" }}
        </p>
        <p class="empty-reports-copy">
          Upload a report to see its AI summary and risk score here.
        </p>
        <NuxtLink to="/reports/upload" class="upload-button empty-upload-button">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Upload report
        </NuxtLink>
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
const searchPlaceholder = ref("");

let searchTypeTimer: ReturnType<typeof setTimeout> | undefined;

const startSearchPlaceholderTypewriter = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    searchPlaceholder.value = "Search by title, type, or status";
    return;
  }

  let characterIndex = 0;
  const phrase = "Search by title, type, or status";

  const tick = () => {
    characterIndex++;
    searchPlaceholder.value = phrase.slice(0, characterIndex);
    if (characterIndex === phrase.length) {
      return;
    }
    searchTypeTimer = setTimeout(tick, 55);
  };

  tick();
};

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
    ? "risk-neutral"
    : score >= 60
      ? "risk-high"
      : score >= 30
        ? "risk-medium"
        : "risk-low";
const statusClass = (status?: string) =>
  status === "completed"
    ? "status-completed"
    : status === "failed"
      ? "status-failed"
      : "status-processing";

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

onMounted(() => {
  loadReports();
  startSearchPlaceholderTypewriter();
});

onBeforeUnmount(() => {
  if (searchTypeTimer) clearTimeout(searchTypeTimer);
});
</script>

<style scoped>
.reports-page {
  display:grid;
  gap:20px;
  min-width:0;
  font-family:Poppins,system-ui,sans-serif;
}
.reports-header {
  position:relative;
  isolation:isolate;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:28px;
  min-height:150px;
  overflow:hidden;
  border:1px solid #dfe9f5;
  border-radius:20px;
  background:#fff;
  padding:24px 28px;
  box-shadow:0 12px 30px rgba(37,87,145,.055);
}
.reports-header::before {
  position:absolute;
  z-index:-1;
  inset:0 0 auto;
  height:3px;
  background:linear-gradient(90deg,#3478cc 0%,#8bb8eb 42%,#edf4fc 100%);
  content:"";
}
.reports-header::after {
  position:absolute;
  z-index:-1;
  top:-145px;
  right:-82px;
  width:300px;
  height:300px;
  border:1px solid #edf3fa;
  border-radius:50%;
  box-shadow:0 0 0 22px #fff,0 0 0 23px #f5f8fc;
  content:"";
  pointer-events:none;
}
.reports-heading-brand,.reports-header-actions { position:relative; z-index:1; }
.reports-heading-brand { display:flex; align-items:center; gap:18px; }
.reports-heading-mark {
  width:58px;
  height:58px;
  display:grid;
  flex:0 0 auto;
  place-items:center;
  border:1px solid #0b1c39;
  border-radius:17px;
  background:#0b1c39;
  color:#fff;
  box-shadow:0 8px 18px rgba(11,28,57,.16);
}
.reports-heading-mark svg { width:24px; height:24px; fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }
.reports-heading-copy { max-width:650px; }
.reports-eyebrow {
  display:flex;
  align-items:center;
  gap:9px;
  margin:0 0 7px;
  color:#6682a3;
  font-size:9px;
  font-weight:800;
  letter-spacing:.13em;
  text-transform:uppercase;
}
.reports-eyebrow span {
  width:7px;
  height:7px;
  border-radius:50%;
  background:#438cdf;
  box-shadow:0 0 0 4px #edf5ff;
}
.reports-header h1 {
  margin:0;
  color:#1d3554;
  font-size:clamp(28px,2.7vw,34px);
  font-weight:700;
  line-height:1.15;
  letter-spacing:-.04em;
}
.reports-intro {
  margin:6px 0 0;
  color:#7187a2;
  font-size:12px;
  line-height:1.65;
}
.reports-header-actions { display:flex; flex:0 0 auto; align-items:center; gap:10px; border-left:1px solid #e8eef6; padding-left:22px; }
.refresh-button,.upload-button {
  min-height:44px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  border-radius:11px;
  padding:0 15px;
  font:700 12px/1 Poppins,system-ui,sans-serif;
  text-decoration:none;
  white-space:nowrap;
  transition:background .18s ease,border-color .18s ease,box-shadow .18s ease,color .18s ease,transform .18s ease;
}
.refresh-button {
  border:1px solid #dce7f4;
  background:#fff;
  color:#54708f;
  cursor:pointer;
}
.refresh-button:hover:not(:disabled) { border-color:#b9d2ef; background:#f7faff; color:#3478cc; }
.refresh-button:disabled { cursor:wait; opacity:.65; }
.refresh-button svg,.upload-button svg { width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
.upload-button {
  border:1px solid #3478cc;
  background:linear-gradient(135deg,#438cdf,#286bc0);
  color:#fff;
  box-shadow:0 7px 16px rgba(52,120,204,.18);
}
.upload-button:hover { transform:translateY(-1px); border-color:#2867b4; background:linear-gradient(135deg,#347bc9,#245fa8); color:#fff; box-shadow:0 10px 20px rgba(40,103,180,.22); }
.reports-panel {
  min-width:0;
  border:1px solid #e2eaf5;
  border-radius:17px;
  background:#fff;
  padding:20px;
  box-shadow:0 8px 24px rgba(37,87,145,.04);
}
.reports-toolbar {
  display:grid;
  grid-template-columns:minmax(260px,1fr) auto;
  align-items:center;
  gap:18px;
  margin-bottom:18px;
  border:1px solid #dfe8f3;
  border-radius:15px;
  background:#fff;
  padding:13px 15px;
  box-shadow:0 5px 16px rgba(37,87,145,.035);
}
.search-field {
  width:100%;
  min-height:48px;
  display:flex;
  align-items:center;
  gap:10px;
  border:1px solid #dce6f1;
  border-radius:11px;
  background:#fff;
  padding:0 13px;
  color:#8ca0b8;
  transition:border-color .18s ease,box-shadow .18s ease;
}
.search-field:focus-within { border-color:#80afe4; box-shadow:none; }
.search-field svg { width:18px; height:18px; flex:0 0 auto; color:#6685a8; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; }
.search-field input { width:100%; min-width:0; height:46px; border:0; outline:0; background:transparent; color:#253d5b; font:500 12px Poppins,system-ui,sans-serif; }
.app-main .reports-page .search-field input:not([type="checkbox"]):not([type="radio"]):focus { border:0; outline:0; background:transparent; box-shadow:none; }
.search-field input::placeholder { color:#9aabc0; opacity:1; }
.reports-controls { display:flex; align-items:center; justify-content:flex-end; gap:9px; border-left:1px solid #e8eef6; padding-left:16px; }
.report-count,.select-all-control {
  min-height:42px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  border:1px solid #e0e9f4;
  border-radius:11px;
  background:#fff;
  padding:0 13px;
  color:#617b9a;
  font-size:11px;
  font-weight:600;
  white-space:nowrap;
}
.report-count { border-color:transparent; background:#f7faff; }
.report-count strong { min-width:23px; height:23px; display:grid; place-items:center; border-radius:7px; background:#0b1c39; color:#fff; font-size:11px; font-weight:800; }
.report-count > span { color:#6f86a3; font-weight:600; }
.select-all-control { cursor:pointer; }
.select-all-control input,.report-checkbox {
  width:15px;
  height:15px;
  margin:0;
  accent-color:#3478cc;
  cursor:pointer;
}
.bulk-delete-button {
  min-height:42px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  border:1px solid #f1d8dd;
  border-radius:11px;
  background:#fff7f8;
  padding:0 14px;
  color:#b85a6a;
  font:700 10px Poppins,system-ui,sans-serif;
  cursor:pointer;
  transition:background .18s ease,border-color .18s ease,color .18s ease;
}
.bulk-delete-button svg { width:15px; height:15px; fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
.bulk-delete-button:hover:not(:disabled) { border-color:#e6b6bf; background:#ffedef; color:#a94758; }
.bulk-delete-button:disabled { border-color:#edf0f4; background:#f7f8fa; color:#aab3bf; cursor:not-allowed; }
.report-list { display:grid; gap:10px; }
.report-card {
  min-width:0;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
  border:1px solid #e7edf5;
  border-radius:13px;
  background:#fff;
  padding:17px 18px;
  transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease;
}
.report-card:hover { transform:translateY(-1px); border-color:#cddff3; box-shadow:0 8px 20px rgba(37,87,145,.06); }
.report-main { min-width:0; display:grid; grid-template-columns:16px minmax(0,1fr); align-items:start; gap:13px; }
.report-checkbox { margin-top:4px; }
.report-copy { min-width:0; }
.report-copy h2 { overflow:hidden; margin:0; color:#243c5b; font-size:14px; font-weight:700; line-height:1.4; text-overflow:ellipsis; }
.report-meta { display:flex; flex-wrap:wrap; align-items:center; gap:7px; margin-top:7px; }
.report-status,.report-type {
  min-height:22px;
  display:inline-flex;
  align-items:center;
  border:1px solid transparent;
  border-radius:999px;
  padding:0 8px;
  font-size:9px;
  font-weight:700;
  text-transform:capitalize;
}
.status-completed { border-color:#d9ece1; background:#f3faf6; color:#4d8a68; }
.status-failed { border-color:#f1dce0; background:#fff6f7; color:#b45b69; }
.status-processing { border-color:#f1e5cc; background:#fffaf0; color:#a97a2d; }
.report-type { border-color:#e2ebf6; background:#f7faff; color:#6682a3; text-transform:uppercase; }
.report-date { color:#8a9bb0; font-size:10px; }
.report-summary { display:-webkit-box; overflow:hidden; margin:10px 0 0; color:#71839a; font-size:11px; line-height:1.6; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.report-actions { display:flex; flex:0 0 auto; align-items:center; gap:9px; }
.risk-score {
  min-width:72px;
  display:grid;
  justify-items:center;
  gap:3px;
  border:1px solid #e2ebf6;
  border-radius:11px;
  background:#f8faff;
  padding:7px 10px;
}
.risk-score span { color:#8a9bb0; font-size:9px; font-weight:600; }
.risk-score strong { font-size:15px; line-height:1.2; }
.risk-neutral { color:#8191a6; }
.risk-low { color:#4c9270; }
.risk-medium { color:#bd8733; }
.risk-high { color:#c45f6f; }
.view-report-button,.delete-report-button {
  min-height:38px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  border-radius:9px;
  padding:0 12px;
  font:700 10px Poppins,system-ui,sans-serif;
  text-decoration:none;
  white-space:nowrap;
  transition:background .18s ease,border-color .18s ease,color .18s ease;
}
.view-report-button { border:1px solid #d8e6f5; background:#fff; color:#3478cc; }
.view-report-button:hover { border-color:#b6d2f0; background:#f5f9ff; color:#2867b4; }
.view-report-button span { font-size:14px; transition:transform .18s ease; }
.view-report-button:hover span { transform:translateX(2px); }
.delete-report-button { border:1px solid transparent; background:transparent; color:#b85a6a; cursor:pointer; }
.delete-report-button:hover:not(:disabled) { border-color:#f1d8dd; background:#fff6f7; color:#a94758; }
.delete-report-button:disabled { color:#adb6c2; cursor:wait; }
.empty-reports {
  position:relative;
  min-height:124px;
  display:grid;
  grid-template-columns:52px minmax(0,1fr) auto;
  grid-template-rows:auto auto;
  align-items:center;
  column-gap:16px;
  border:1px solid #e4ecf6;
  border-radius:13px;
  background:#fff;
  padding:20px 22px;
  text-align:left;
}
.empty-reports::before {
  position:absolute;
  inset:20px auto 20px 0;
  width:3px;
  border-radius:0 4px 4px 0;
  background:#8bb8eb;
  content:"";
}
.empty-reports-icon {
  width:52px;
  height:52px;
  grid-column:1;
  grid-row:1/3;
  display:grid;
  place-items:center;
  border:1px solid #0b1c39;
  border-radius:16px;
  background:#0b1c39;
  color:#fff;
}
.empty-reports-icon svg { width:23px; height:23px; fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }
.empty-reports-title { grid-column:2; grid-row:1; align-self:end; margin:0; color:#253d5b; font-size:14px; font-weight:700; }
.empty-reports-copy { grid-column:2; grid-row:2; align-self:start; margin:4px 0 0; color:#71839a; font-size:11px; line-height:1.6; }
.empty-upload-button { grid-column:3; grid-row:1/3; margin:0 0 0 16px; }
.report-skeleton {
  min-height:92px;
  display:grid;
  grid-template-columns:16px minmax(0,1fr) 100px;
  align-items:center;
  gap:13px;
  border:1px solid #e7edf5;
  border-radius:14px;
  padding:17px 18px;
}
.report-skeleton > span,.report-skeleton i,.report-skeleton b { display:block; border-radius:6px; background:linear-gradient(90deg,#f0f4f8 25%,#f8fafc 50%,#f0f4f8 75%); background-size:200% 100%; animation:report-shimmer 1.4s ease infinite; }
.report-skeleton > span { width:15px; height:15px; }
.report-skeleton div { display:grid; gap:9px; }
.report-skeleton i:first-child { width:34%; height:12px; }
.report-skeleton i:last-child { width:62%; height:9px; }
.report-skeleton b { width:88px; height:34px; }
@keyframes report-shimmer { to { background-position:-200% 0; } }
.refresh-button:focus-visible,.upload-button:focus-visible,.bulk-delete-button:focus-visible,.view-report-button:focus-visible,.delete-report-button:focus-visible {
  outline:3px solid rgba(67,140,223,.28);
  outline-offset:3px;
}
@media(max-width:980px) {
  .reports-toolbar { grid-template-columns:1fr; }
  .search-field { width:100%; }
  .reports-controls { justify-content:flex-start; flex-wrap:wrap; border-left:0; border-top:1px solid #edf2f8; padding:12px 0 0; }
  .report-card { align-items:flex-start; flex-direction:column; }
  .report-actions { width:100%; justify-content:flex-end; }
}
@media(max-width:640px) {
  .reports-page { gap:18px; }
  .reports-header { min-height:0; align-items:flex-start; flex-direction:column; gap:17px; padding:20px 18px; border-radius:17px; }
  .reports-header::after { top:-180px; right:-170px; }
  .reports-heading-brand { align-items:flex-start; gap:12px; }
  .reports-heading-mark { width:42px; height:42px; border-radius:12px; }
  .reports-heading-mark svg { width:19px; height:19px; }
  .reports-header h1 { font-size:27px; }
  .reports-intro { font-size:12px; }
  .reports-header-actions { width:100%; border-left:0; border-top:1px solid #e8eef6; padding:14px 0 0; }
  .reports-header-actions > * { flex:1; }
  .reports-panel { border-radius:15px; padding:14px; }
  .reports-toolbar { gap:12px; margin-bottom:14px; padding-bottom:14px; }
  .reports-controls { display:grid; grid-template-columns:auto 1fr; width:100%; gap:8px; }
  .report-count { justify-self:start; }
  .select-all-control { justify-self:end; }
  .bulk-delete-button { grid-column:1/-1; }
  .report-card { gap:14px; padding:14px; }
  .report-actions { display:grid; grid-template-columns:auto 1fr auto; gap:7px; }
  .risk-score { min-width:60px; padding:6px 8px; }
  .view-report-button,.delete-report-button { padding:0 9px; font-size:9px; }
  .empty-reports { min-height:0; grid-template-columns:1fr; grid-template-rows:auto; justify-items:center; gap:0; padding:22px 16px; text-align:center; }
  .empty-reports::before { inset:12px auto 12px 0; }
  .empty-reports-icon { grid-column:1; grid-row:auto; }
  .empty-reports-title { grid-column:1; grid-row:auto; align-self:auto; margin-top:12px; }
  .empty-reports-copy { grid-column:1; grid-row:auto; align-self:auto; margin-top:5px; }
  .empty-upload-button { grid-column:1; grid-row:auto; margin:14px 0 0; }
}
@keyframes reports-enter {
  from { opacity:0; translate:0 9px; }
  to { opacity:1; translate:0 0; }
}
.reports-header,
.reports-panel,
.reports-toolbar,
.report-card,
.empty-reports,
.report-skeleton {
  animation:reports-enter 500ms cubic-bezier(.22,.68,0,1) both;
}
.reports-panel { animation-delay:90ms; }
.reports-toolbar { animation-delay:170ms; }
.empty-reports,.report-skeleton:nth-child(1),.report-card:nth-child(1) { animation-delay:230ms; }
.report-skeleton:nth-child(2),.report-card:nth-child(2) { animation-delay:290ms; }
.report-skeleton:nth-child(3),.report-card:nth-child(3) { animation-delay:350ms; }
.report-card:nth-child(4) { animation-delay:410ms; }
.report-card:nth-child(5) { animation-delay:470ms; }
.reports-heading-mark,.empty-reports-icon {
  transition:transform 200ms ease,border-color 200ms ease,background-color 200ms ease;
}
.reports-header:hover .reports-heading-mark,
.empty-reports:hover .empty-reports-icon { transform:translateY(-1px); }
@media(prefers-reduced-motion:reduce) {
  .reports-header,
  .reports-panel,
  .reports-toolbar,
  .report-card,
  .empty-reports,
  .report-skeleton,
  .report-skeleton > span,
  .report-skeleton i,
  .report-skeleton b,
  .reports-heading-mark,
  .empty-reports-icon {
    animation:none;
    translate:none;
    transition:none;
  }
  .report-card:hover,
  .upload-button:hover,
  .reports-header:hover .reports-heading-mark,
  .empty-reports:hover .empty-reports-icon,
  .view-report-button:hover span {
    transform:none;
  }
}
</style>
