<template>
  <div class="clinical-report">
    <div v-if="loading" class="report-loader">
      <div class="loader-hero"></div>
      <div class="loader-grid"><span></span><span></span><span></span></div>
    </div>

    <main v-else-if="report" class="report-canvas">
      <header class="report-topbar">
        <NuxtLink to="/reports" class="back-control">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          Reports
        </NuxtLink>
        <div class="topbar-actions">
          <button type="button" :disabled="downloading" @click="downloadFile">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" /></svg>
            {{ downloading ? "Preparing..." : "Download" }}
          </button>
          <button type="button" class="open-control" @click="viewFile">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>
            Open original
          </button>
        </div>
      </header>

      <p v-if="downloadError" class="download-error" role="alert">{{ downloadError }}</p>

      <section class="report-identity">
        <div class="identity-copy">
          <div class="identity-kicker">
            <span>{{ reportType }}</span>
            <i></i>
            <span>{{ capitalize(report.status) }}</span>
          </div>
          <h1>{{ report.title }}</h1>
          <div class="identity-meta">
            <span><small>Issued</small>{{ formatDate(report.createdAt) }}</span>
            <span v-if="report.forMember"><small>Patient</small>{{ report.forMember }}</span>
            <span v-if="confidencePercent != null"><small>Confidence</small>{{ confidencePercent }}%</span>
          </div>
        </div>
        <div v-if="healthScore != null" class="identity-score">
          <span>Health index</span>
          <strong>{{ healthScore }}</strong>
          <div class="score-dots" aria-hidden="true">
            <i v-for="n in 10" :key="n" :class="{ on: n <= Math.ceil(healthScore / 10) }"></i>
          </div>
        </div>
      </section>

      <section class="summary-band">
        <span class="band-number">01</span>
        <div>
          <p>Executive summary</p>
          <h2>What we found</h2>
          <blockquote>{{ report.summary || "No summary is available for this report." }}</blockquote>
        </div>
      </section>

      <section v-if="report.criticalFindings?.length" class="alert-band critical-band">
        <span>Priority</span>
        <ul><li v-for="item in report.criticalFindings" :key="item">{{ item }}</li></ul>
      </section>

      <section v-if="report.warnings?.length" class="alert-band warning-band">
        <span>Review</span>
        <ul><li v-for="item in report.warnings" :key="item">{{ item }}</li></ul>
      </section>

      <div v-if="riskCategoryList.length || report.missingImportantMarkers?.length" class="bento-row">
        <section v-if="riskCategoryList.length" class="panel risk-panel">
          <header><span>02</span><div><p>Risk assessment</p><h2>Health risk profile</h2></div></header>
          <div class="risk-list">
            <article v-for="risk in riskCategoryList" :key="risk.key">
              <div><span>{{ risk.label }}</span><strong>{{ risk.value }}%</strong></div>
              <div class="risk-line"><i :style="{ width: `${risk.value}%`, background: riskColor(risk.value) }"></i></div>
            </article>
          </div>
        </section>

        <section v-if="report.missingImportantMarkers?.length" class="panel test-panel">
          <header><span>03</span><div><p>Next investigations</p><h2>Suggested tests</h2></div></header>
          <ol>
            <li v-for="(test, index) in report.missingImportantMarkers" :key="test">
              <span>{{ String(index + 1).padStart(2, "0") }}</span>
              <p>{{ test }}</p>
            </li>
          </ol>
          <small>Discuss these tests with a qualified healthcare professional.</small>
        </section>
      </div>

      <section v-if="hasRecommendations" class="panel recommendation-panel">
        <header><span>04</span><div><p>Personal action plan</p><h2>Recommendations</h2></div></header>
        <div class="recommendation-grid">
          <article v-for="section in recommendationSections" v-show="section.items.length" :key="section.key">
            <span class="recommendation-letter">{{ section.letter }}</span>
            <div><h3>{{ section.title }}</h3><ul><li v-for="item in section.items" :key="item">{{ item }}</li></ul></div>
          </article>
        </div>
      </section>

      <section v-if="report.findings?.length" class="panel findings-panel">
          <header><span>05</span><div><p>Detailed interpretation</p><h2>Clinical findings</h2></div></header>
          <div class="findings-list">
            <article v-for="finding in report.findings" :key="finding.label">
              <div class="finding-head">
                <div><h3>{{ finding.label }}</h3><strong v-if="finding.value">{{ finding.value }}</strong></div>
                <span :class="`finding-status ${normalizeStatus(finding.status)}`">{{ statusLabel(normalizeStatus(finding.status)) }}</span>
              </div>
              <p v-if="finding.whyItMatters" class="finding-body">{{ finding.whyItMatters }}</p>
              <div v-if="finding.possibleCauses?.length" class="finding-detail"><span>Possible causes</span><p>{{ finding.possibleCauses.join(" · ") }}</p></div>
              <div v-if="finding.recommendedActions?.length" class="finding-detail"><span>Recommended action</span><p>{{ finding.recommendedActions.join(" · ") }}</p></div>
            </article>
          </div>
      </section>

      <div v-if="report.keyInsights?.length || report.positiveFindings?.length" class="bento-row">
        <section v-if="report.keyInsights?.length" class="panel">
          <header><span>06</span><div><p>At a glance</p><h2>Key insights</h2></div></header>
          <ul class="editorial-list"><li v-for="item in report.keyInsights" :key="item">{{ item }}</li></ul>
        </section>
        <section v-if="report.positiveFindings?.length" class="panel positive-panel">
          <header><span>07</span><div><p>Healthy indicators</p><h2>Positive findings</h2></div></header>
          <ul class="editorial-list"><li v-for="item in report.positiveFindings" :key="item">{{ item }}</li></ul>
        </section>
      </div>

      <section v-if="report.markers?.length" class="panel markers-panel">
        <header><span>08</span><div><p>Laboratory values</p><h2>Markers</h2></div></header>
        <div class="marker-scroll">
          <table>
            <thead><tr><th>Marker</th><th>Result</th><th>Reference</th></tr></thead>
            <tbody>
              <tr v-for="marker in report.markers" :key="marker.name">
                <td>{{ marker.name }}</td>
                <td><strong>{{ marker.value }}</strong> <span>{{ marker.unit }}</span></td>
                <td>{{ marker.referenceRange || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="report.patternAnalysis?.length" class="panel">
        <header><span>09</span><div><p>Interconnected results</p><h2>Pattern analysis</h2></div></header>
        <div class="card-grid">
          <article v-for="pattern in report.patternAnalysis" :key="pattern.title">
            <div><h3>{{ pattern.title }}</h3><span>{{ capitalize(pattern.severity) }}</span></div>
            <p>{{ pattern.insight }}</p>
          </article>
        </div>
      </section>

      <div v-if="report.longTermInsights?.length || report.fiveYearAnswers?.length" class="bento-row">
        <section v-if="report.longTermInsights?.length" class="panel">
          <header><span>10</span><div><p>Future outlook</p><h2>Long-term insights</h2></div></header>
          <div class="timeline">
            <article v-for="item in report.longTermInsights" :key="item.title">
              <span>{{ item.horizonYears }} year horizon</span><h3>{{ item.title }}</h3><p>{{ item.insight }}</p>
            </article>
          </div>
        </section>
        <section v-if="report.fiveYearAnswers?.length" class="panel">
          <header><span>11</span><div><p>Forward plan</p><h2>Five-year roadmap</h2></div></header>
          <div class="timeline">
            <article v-for="item in report.fiveYearAnswers" :key="item.year">
              <span>Year {{ item.year }}</span><h3>{{ item.question }}</h3><p>{{ item.answer }}</p>
            </article>
          </div>
        </section>
      </div>

      <section v-if="report.dnaTraits?.length" class="panel">
        <header><span>12</span><div><p>Genetic profile</p><h2>DNA traits</h2></div></header>
        <div class="card-grid">
          <article v-for="trait in report.dnaTraits" :key="trait.trait">
            <div><h3>{{ trait.trait }}</h3><span>{{ trait.result }}</span></div><p>{{ trait.insight }}</p>
          </article>
        </div>
      </section>

      <section v-if="displayedMedicineSuggestions.length" class="panel medicine-panel">
        <header><span>13</span><div><p>Treatment considerations</p><h2>Medicines & supplements</h2></div></header>
        <div class="medical-disclaimer">
          <strong>Professional guidance required</strong>
          <p>These AI-generated suggestions are not a prescription. Consult a qualified healthcare professional before starting any medicine or supplement.</p>
        </div>
        <div class="medicine-grid">
          <article v-for="(medicine, index) in displayedMedicineSuggestions" :key="index">
            <div><span>{{ capitalize(medicine.type) }}</span><span v-if="medicine.live?.isPrescriptionRequired ?? medicine.isPrescriptionRequired" class="rx">Prescription</span></div>
            <h3>{{ medicine.live?.brandName || medicine.name }}</h3>
            <p v-if="medicine.live?.genericName">{{ medicine.live.genericName }}</p>
            <p>{{ medicine.reason }}</p>
            <small v-if="medicine.evidence">{{ medicine.evidence }}</small>
          </article>
        </div>
      </section>

      <details v-if="report.extractedText" class="source-panel">
        <summary><span><strong>Source document</strong><small>View extracted text</small></span><svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></summary>
        <pre>{{ report.extractedText }}</pre>
      </details>

      <footer class="report-footer"><span>Medivoy</span><p>Support document only. It does not replace professional medical diagnosis or care.</p></footer>
    </main>

    <main v-else class="empty-report">
      <div>Report unavailable</div>
      <h1>We could not find this report</h1>
      <p>It may have been removed or is not available to your account.</p>
      <NuxtLink to="/reports">Back to reports</NuxtLink>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const api = useMedivoyApi();
const report = ref<any>(null);
const loading = ref(true);
const pharmacySuggestions = ref<any>(null);
const downloading = ref(false);
const downloadError = ref("");

const API_BASE = String(useRuntimeConfig().public.apiBase || "https://api-geno.medivoy.ae/api").replace(/\/api\/?$/, "");

const reportType = computed(() => String(report.value?.reportType || report.value?.type || "Clinical report").replace(/[_-]/g, " "));
const healthScore = computed(() => {
  const value = report.value?.overallHealthScore ?? report.value?.riskScore;
  return value == null ? null : Math.min(100, Math.max(0, Math.round(Number(value))));
});
const confidencePercent = computed(() => {
  const value = Number(report.value?.confidenceScore);
  return value ? Math.round(value <= 1 ? value * 100 : value) : null;
});
const riskCategoryList = computed(() => {
  const entries = Object.entries(report.value?.riskCategories || {}).filter(([, value]) => typeof value === "number");
  const scale = entries.every(([, value]) => (value as number) <= 10) ? 10 : 1;
  return entries.map(([key, value]) => ({ key, label: humanize(key.replace(/Risk$/, "")), value: Math.min(100, Math.round((value as number) * scale)) }));
});
const displayedMedicineSuggestions = computed(() => pharmacySuggestions.value?.medicineSuggestions?.length ? pharmacySuggestions.value.medicineSuggestions : report.value?.medicineSuggestions || []);
const resolvedFileUrl = computed(() => {
  const raw = report.value?.fileUrl || "";
  if (!raw) return "";
  return raw.startsWith("http") ? raw : `${API_BASE}${raw.startsWith("/") ? raw : `/${raw}`}`;
});
const hasRecommendations = computed(() => !!report.value?.recommendations && ["diet", "exercise", "sleep", "supplements", "followUp"].some((key) => report.value.recommendations[key]?.length));
const recommendationSections = computed(() => [
  { key: "diet", letter: "A", title: "Nutrition", items: report.value?.recommendations?.diet || [] },
  { key: "exercise", letter: "B", title: "Movement", items: report.value?.recommendations?.exercise || [] },
  { key: "sleep", letter: "C", title: "Sleep", items: report.value?.recommendations?.sleep || [] },
  { key: "supplements", letter: "D", title: "Supplements", items: report.value?.recommendations?.supplements || [] },
  { key: "followUp", letter: "E", title: "Follow-up", items: report.value?.recommendations?.followUp || [] },
]);

onMounted(async () => {
  try { report.value = await api.getReport(route.params.id as string); } catch { report.value = null; } finally { loading.value = false; }
  if (report.value?.id) {
    try { pharmacySuggestions.value = await api.getPharmacySuggestions(report.value.id); } catch { pharmacySuggestions.value = null; }
  }
});

function formatDate(value: string) { return value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""; }
function capitalize(value: string) { return value ? value.charAt(0).toUpperCase() + value.slice(1) : ""; }
function humanize(value: string) { return capitalize(value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim()); }
function normalizeStatus(value: string) {
  const key = String(value || "").toLowerCase().replace(/[^a-z]/g, "");
  return ({ mildhigh: "mild-high", moderatehigh: "moderate-high", criticalhigh: "critical", high: "moderate-high", mildlow: "mild-low", moderatelow: "moderate-low", criticallow: "critical", low: "mild-low" } as Record<string, string>)[key] || key;
}
function statusLabel(value: string) {
  return ({ normal: "Normal", borderline: "Borderline", "mild-high": "Mild high", "moderate-high": "Moderate high", critical: "Critical", "mild-low": "Mild low", "moderate-low": "Moderate low" } as Record<string, string>)[value] || humanize(value);
}
function riskColor(score: number) { return score >= 75 ? "#b85a68" : score >= 50 ? "#c58a47" : score >= 25 ? "#cbb04f" : "#4c9579"; }

async function downloadFile() {
  if (!resolvedFileUrl.value || downloading.value) return;
  downloading.value = true; downloadError.value = "";
  try {
    const response = await fetch(resolvedFileUrl.value);
    if (!response.ok) throw new Error(`Unable to download the file (${response.status})`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const sourceName = resolvedFileUrl.value.split("/").pop()?.split("?")[0] || "";
    const extension = sourceName.includes(".") ? `.${sourceName.split(".").pop()}` : ".pdf";
    const safeName = String(report.value?.title || "Medivoy-report").replace(/[<>:"/\\|?*\x00-\x1F]/g, "-").replace(/\s+/g, "-");
    const filename = /\.[a-z0-9]+$/i.test(safeName) ? safeName : `${safeName}${extension}`;
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) { downloadError.value = error instanceof Error ? error.message : "Unable to download this report."; }
  finally { downloading.value = false; }
}
function viewFile() { if (resolvedFileUrl.value) window.open(resolvedFileUrl.value, "_blank", "noopener"); }
</script>

<style scoped>
.clinical-report {
  --ink: #1b2a43;
  --muted: #738096;
  --line: #e3e8ef;
  --paper: #fbfcfe;
  --navy: #14284a;
  --blue: #3f74ad;
  min-height: calc(100vh - 72px);
  margin: -24px -32px -24px;
  background: #f3f6fa;
  color: var(--ink);
  font-family: Poppins, system-ui, sans-serif;
}
.clinical-report, .clinical-report * { box-sizing: border-box; font-family: Poppins, system-ui, sans-serif; }
.report-canvas { max-width: 1180px; margin: 0 auto; padding: 24px clamp(18px, 3vw, 44px) 32px; }
.report-topbar { display:flex; align-items:center; justify-content:space-between; height:56px; margin-bottom:18px; border-bottom:1px solid var(--line); }
.back-control, .topbar-actions button { display:inline-flex; height:38px; align-items:center; justify-content:center; gap:7px; border:1px solid var(--line); border-radius:8px; background:#fff; color:#52657f; font-size:10px; font-weight:700; transition:.18s ease; }
.back-control { padding:0 12px 0 8px; }
.back-control svg, .topbar-actions svg { width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round; }
.back-control:hover, .topbar-actions button:hover:not(:disabled) { border-color:#b7c8dd; color:#315f93; background:#f9fbfe; }
.topbar-actions { display:flex; gap:8px; }
.topbar-actions button { min-width:112px; padding:0 12px; cursor:pointer; }
.topbar-actions .open-control { border-color:var(--navy); background:var(--navy); color:#fff; }
.topbar-actions button:disabled { opacity:.55; cursor:wait; }
.download-error { border:1px solid #edcdd2; border-radius:8px; background:#fff7f8; padding:10px 12px; color:#9d4d59; font-size:10px; }
.report-identity { display:grid; grid-template-columns:minmax(0,1fr) 190px; align-items:end; gap:28px; min-height:220px; border-radius:16px; background:linear-gradient(135deg,#fff 0%,#fff 68%,#edf3fa 100%); border:1px solid #dfe6ef; padding:34px 38px; overflow:hidden; }
.report-identity {
  position: relative;
  align-items: center;
  isolation: isolate;
  border: 1px solid #18375f;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, .24), transparent 25%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  box-shadow: 0 14px 34px rgba(11, 28, 57, .14);
  color: #fff;
}
.report-identity::after {
  position: absolute;
  z-index: -1;
  right: -70px;
  bottom: -150px;
  width: 300px;
  height: 300px;
  border: 1px solid rgba(169, 210, 255, .10);
  border-radius: 50%;
  box-shadow: 0 0 0 28px rgba(255,255,255,.018), 0 0 0 58px rgba(255,255,255,.012);
  content: "";
  pointer-events: none;
}
.identity-kicker { display:flex; align-items:center; gap:8px; margin-bottom:12px; color:#a9d2ff; font-size:9px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
.identity-kicker i { width:4px;height:4px;border-radius:50%;background:#72b3ff; box-shadow:0 0 0 3px rgba(114,179,255,.10); }
.identity-copy h1 { max-width:760px; margin:0; color:#fff; font-size:clamp(34px,4.2vw,54px); line-height:1.02; letter-spacing:-.055em; overflow-wrap:anywhere; }
.identity-meta { display:flex; flex-wrap:wrap; gap:22px; margin-top:22px; }
.identity-meta span { display:grid; gap:3px; color:#d8e9fb; font-size:10px; font-weight:700; }
.identity-meta small { color:#91b8df; font-size:8px; text-transform:uppercase; letter-spacing:.08em; }
.identity-score { align-self:stretch; display:flex; flex-direction:column; justify-content:center; border-left:1px solid rgba(169,210,255,.18); padding-left:28px; }
.identity-score > span { color:#a9d2ff; font-size:8px; font-weight:800; text-transform:uppercase; letter-spacing:.1em; }
.identity-score strong { margin:4px 0 10px; color:#fff; font-size:52px; line-height:.95; letter-spacing:-.06em; }
.score-dots { display:grid; grid-template-columns:repeat(5,16px); gap:5px; }
.score-dots i { width:16px;height:5px;border-radius:99px;background:rgba(255,255,255,.16); }
.score-dots i.on { background:#72b3ff; }
.summary-band { display:grid; grid-template-columns:48px minmax(0,1fr); gap:16px; margin-top:12px; border:1px solid var(--line); border-radius:14px; background:#fff; padding:24px 28px; }
.band-number, .panel header > span { width:36px;height:36px;display:grid;place-items:center;border-radius:8px;background:linear-gradient(145deg,#0b1c39 0%,#102b53 58%,#153766 100%);color:#fff;font-size:9px;font-weight:800; }
.summary-band p, .panel header p { margin:0 0 5px;color:#8797aa;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em; }
.summary-band h2, .panel header h2 { margin:0;color:#263d5b;font-size:21px;letter-spacing:-.02em; }
.summary-band blockquote { max-width:950px; margin:14px 0 0; border-left:2px solid #91aecb; padding-left:16px;color:#526984;font-size:16px;line-height:1.75; }
.alert-band { display:grid; grid-template-columns:92px minmax(0,1fr); align-items:start; margin-top:10px; border:1px solid var(--line); border-radius:11px; padding:13px 16px; }
.alert-band > span { font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.08em; }
.alert-band ul { margin:0;padding-left:14px;font-size:10px;line-height:1.7; }
.critical-band { border-color:#e8ccd1;background:#fff7f8;color:#9b4f5b; }
.warning-band { border-color:#eadcaa;background:#fffaf0;color:#947132; }
.bento-row { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-top:12px; }
.panel { min-width:0;margin-top:12px;border:1px solid var(--line);border-radius:14px;background:#fff;padding:22px 24px;box-shadow:0 7px 20px rgba(43,73,112,.035); }
.bento-row .panel { margin-top:0; }
.panel header { display:grid;grid-template-columns:36px minmax(0,1fr);align-items:center;gap:10px;margin-bottom:18px; }
.risk-list { display:grid;gap:15px; }
.risk-list article div:first-child { display:flex;justify-content:space-between;margin-bottom:8px;color:#4b607a;font-size:12px;font-weight:700; }
.risk-line { height:7px;border-radius:99px;background:#edf1f5;overflow:hidden; }
.risk-line i { display:block;height:100%;border-radius:99px; }
.test-panel ol { display:grid;gap:7px;margin:0;padding:0;list-style:none; }
.test-panel li { display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;min-height:44px;border-bottom:1px solid #edf1f5; }
.test-panel li span { color:#86a2c2;font-size:10px;font-weight:800; }
.test-panel li p { margin:0;color:#526984;font-size:12px;line-height:1.55; }
.test-panel small { display:block;margin-top:12px;color:#8e9db0;font-size:10px;line-height:1.6; }
.recommendation-grid { display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px; }
.recommendation-grid article { display:grid;grid-template-columns:32px minmax(0,1fr);gap:9px;min-height:110px;border:1px solid #e5ebf2;border-radius:10px;background:#fbfcfe;padding:12px; }
.recommendation-letter { width:32px;height:32px;display:grid;place-items:center;border-radius:7px;background:#edf3fa;color:#3f74ad;font-size:9px;font-weight:800; }
.recommendation-grid h3 { margin:0;color:#365171;font-size:14px;font-weight:800; }
.findings-list h3 { margin:0;color:#365171;font-size:14px;font-weight:800; }
.card-grid h3,.timeline h3 { margin:0;color:#365171;font-size:13px;font-weight:800; }
.medicine-grid h3 { margin:0;color:#365171;font-size:14px;font-weight:800; }
.recommendation-grid ul { margin:8px 0 0;padding-left:14px;color:#637793;font-size:13px;line-height:1.7; }
.findings-panel { padding:16px 18px;font-family:Poppins,system-ui,sans-serif; }
.findings-panel header { margin-bottom:12px; }
.findings-list { display:grid;gap:6px; }
.findings-list article { border:1px solid #e6ecf3;border-radius:10px;background:#fcfdff;padding:10px; }
.finding-head { display:flex;justify-content:space-between;gap:10px; }
.finding-head strong { display:block;margin-top:4px;color:#244767;font-size:15px; }
.finding-status { height:24px;display:inline-flex;align-items:center;border-radius:99px;background:#edf5f1;padding:0 9px;color:#4f806b;font-size:9px;font-weight:800;text-transform:uppercase; }
.finding-status.mild-high,.finding-status.borderline,.finding-status.mild-low { background:#fff7df;color:#967431; }
.finding-status.moderate-high,.finding-status.moderate-low,.finding-status.critical { background:#fff0f1;color:#9d5963; }
.finding-body,.finding-detail p { margin:9px 0 0;color:#687c94;font-size:13px;line-height:1.7; }
.findings-panel .finding-body { margin-top:6px;line-height:1.55; }
.finding-detail { margin-top:6px;border-top:1px solid #edf1f5;padding-top:6px; }
.finding-detail span { color:#7488a0;font-size:10px;font-weight:800;text-transform:uppercase; }
.marker-scroll { overflow-x:auto; }
.marker-scroll table { width:100%;border-collapse:collapse;font-family:Poppins,system-ui,sans-serif;font-size:12px;font-variant-numeric:tabular-nums; }
.marker-scroll th { border-bottom:1px solid #d6e1ee;background:#f7f9fc;padding:9px 10px;color:#617792;font-size:10px;font-weight:800;letter-spacing:.06em;text-align:left;text-transform:uppercase; }
.marker-scroll td { border-bottom:1px solid #e8edf4;padding:9px 10px;color:#4e6480;font-size:12px; }
.marker-scroll tbody tr:nth-child(even) { background:#fbfcfe; }
.marker-scroll tbody tr:hover { background:#f4f8fd; }
.marker-scroll td strong { color:#1e3c5f;font-size:13px;font-weight:700; }
.marker-scroll td span { color:#7186a0;font-size:11px; }
.editorial-list { display:grid;gap:8px;margin:0;padding:0;list-style:none; }
.editorial-list li { position:relative;border-bottom:1px solid #edf1f5;padding:8px 0 8px 15px;color:#526984;font-family:Poppins,system-ui,sans-serif;font-size:12px;line-height:1.65; }
.editorial-list li:before { position:absolute;left:0;top:13px;width:5px;height:5px;border-radius:50%;background:#89a8c6;content:""; }
.positive-panel { border-color:#dceadf;background:#fcfefd; }
.card-grid,.medicine-grid { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px; }
.card-grid article,.medicine-grid article,.timeline article { border:1px solid #e5ebf2;border-radius:10px;background:#fbfcfe;padding:12px; }
.card-grid article div,.medicine-grid article div { display:flex;justify-content:space-between;gap:8px; }
.card-grid article span,.medicine-grid article div span { border-radius:99px;background:#edf3fa;padding:4px 7px;color:#5d7e9f;font-size:10px;font-weight:800;text-transform:uppercase; }
.card-grid p,.timeline p { margin:8px 0 0;color:#5c7189;font-family:Poppins,system-ui,sans-serif;font-size:12px;line-height:1.65; }
.medicine-grid p,.medicine-grid small { margin:8px 0 0;color:#687d94;font-family:Poppins,system-ui,sans-serif;font-size:12px;line-height:1.65; }
.timeline { display:grid;gap:8px; }
.timeline article>span { color:#758ba5;font-size:10px;font-weight:800;text-transform:uppercase; }
.timeline h3 { margin-top:5px; }
.medical-disclaimer { display:grid;grid-template-columns:150px minmax(0,1fr);gap:12px;margin-bottom:10px;border:1px solid #dde6f0;border-radius:9px;background:#f7faff;padding:11px 12px; }
.medical-disclaimer strong { color:#3f74ad;font-size:10px;text-transform:uppercase; }
.medical-disclaimer p { margin:0;color:#5f738a;font-size:12px;line-height:1.55; }
.medicine-grid article div .rx { background:#fff0f1!important;color:#9d5963!important; }
.source-panel { margin-top:12px;border:1px solid var(--line);border-radius:14px;background:#fff;padding:16px 18px; }
.source-panel summary { display:flex;align-items:center;justify-content:space-between;list-style:none;cursor:pointer; }
.source-panel summary::-webkit-details-marker { display:none; }
.source-panel summary span { display:grid; }
.source-panel summary strong { color:#365171;font-size:14px; }
.source-panel summary small { margin-top:3px;color:#91a0b2;font-size:11px; }
.source-panel summary svg { width:17px;height:17px;fill:none;stroke:#71869e;stroke-width:1.8;transition:.18s; }
.source-panel[open] summary svg { transform:rotate(180deg); }
.source-panel pre { max-height:400px;overflow:auto;margin:12px 0 0;border:1px solid #e5ebf2;border-radius:8px;background:#f8fafc;padding:14px;color:#5d7189;font-family:Poppins,system-ui,sans-serif;font-size:12px;line-height:1.7;white-space:pre-wrap; }
.report-footer { display:flex;justify-content:space-between;gap:20px;margin-top:18px;border-top:1px solid var(--line);padding-top:16px;color:#91a0b2;font-size:8px; }
.report-footer span { color:#3f74ad;font-weight:800;text-transform:uppercase;letter-spacing:.12em; }
.report-footer p { margin:0;text-align:right; }
.report-loader { max-width:1180px;margin:0 auto;padding:24px clamp(18px,3vw,44px); }
.loader-hero,.loader-grid span { border:1px solid var(--line);border-radius:14px;background:linear-gradient(90deg,#fff 25%,#edf2f7 50%,#fff 75%);background-size:200% 100%;animation:load 1.4s infinite; }
.loader-hero { height:220px; }
.loader-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px; }
.loader-grid span { height:160px; }
.empty-report { max-width:560px;margin:70px auto;border:1px solid var(--line);border-radius:14px;background:#fff;padding:44px;text-align:center; }
.empty-report div { color:#3f74ad;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.12em; }
.empty-report h1 { margin:8px 0;color:#263d5b;font-size:24px; }
.empty-report p { color:#7e8da1;font-size:10px; }
.empty-report a { display:inline-flex;height:40px;align-items:center;border-radius:8px;background:var(--navy);padding:0 14px;color:#fff;font-size:10px;font-weight:700; }
@keyframes load { to { background-position:-200% 0; } }
@media(max-width:980px){ .recommendation-grid{grid-template-columns:repeat(2,minmax(0,1fr))} }
@media(max-width:720px){
  .clinical-report{margin:-20px -16px -24px}.report-canvas{padding:18px 14px}.report-topbar{height:58px}.back-control{width:38px;padding:0;font-size:0}.topbar-actions button{min-width:38px;width:38px;padding:0;font-size:0}
  .report-identity{grid-template-columns:1fr;min-height:0;padding:26px 22px}.identity-score{border-left:0;border-top:1px solid #dfe6ef;padding:18px 0 0}.identity-copy h1{font-size:34px}.identity-meta{gap:12px}.bento-row,.card-grid,.medicine-grid{grid-template-columns:1fr}.recommendation-grid{grid-template-columns:1fr}.summary-band{grid-template-columns:40px minmax(0,1fr);padding:20px}.summary-band blockquote{font-size:15px}.alert-band{grid-template-columns:72px minmax(0,1fr)}
  .medical-disclaimer{grid-template-columns:1fr}.report-footer{align-items:flex-start;flex-direction:column}.report-footer p{text-align:left}.loader-grid{grid-template-columns:1fr}
}
@media(max-width:480px){
  .identity-copy h1{font-size:29px}.identity-meta{flex-direction:column}.summary-band{grid-template-columns:1fr}.summary-band h2{font-size:19px}.summary-band blockquote{font-size:14px}.score-dots{grid-template-columns:repeat(5,24px)}.alert-band{grid-template-columns:1fr}.panel{padding:18px}.marker-scroll th:nth-child(3),.marker-scroll td:nth-child(3){display:none}
}
</style>
