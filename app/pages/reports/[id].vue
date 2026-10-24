<template>
  <div class="report-page">
    <!-- Header -->
    <div class="report-header">
      <NuxtLink to="/reports" class="back-btn">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to Reports
      </NuxtLink>
      <div v-if="report" class="header-actions">
        <button class="btn-outline" @click="downloadFile">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
            />
          </svg>
          Download
        </button>
        <button class="btn-outline" @click="viewFile">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View File
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-card">
      <div class="skeleton skeleton-heading"></div>
      <div class="skeleton skeleton-text" style="width: 60%"></div>
      <div class="skeleton skeleton-text" style="width: 80%"></div>
      <div class="skeleton skeleton-text" style="width: 50%"></div>
    </div>

    <!-- Error -->
    <div v-else-if="!report" class="empty-state">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3>Report not found</h3>
      <p>This report may have been deleted or you may not have access to it.</p>
      <NuxtLink to="/reports" class="btn-primary">Go to Reports</NuxtLink>
    </div>

    <!-- Report Content -->
    <div v-else class="report-content">
      <!-- Summary Card -->
      <div class="card summary-card">
        <div class="summary-top">
          <div class="summary-info">
            <div class="report-type-badge" :class="'type-' + reportType">
              {{ reportType.toUpperCase() }}
            </div>
            <h1 class="report-title">{{ report.title }}</h1>
            <p class="report-meta">
              <span
                class="status-dot"
                :class="'status-' + report.status"
              ></span>
              {{ capitalize(report.status) }}
              <span class="meta-sep">·</span>
              {{ formatDate(report.createdAt) }}
              <template v-if="report.forMember">
                <span class="meta-sep">·</span>
                {{ report.forMember }}
              </template>
              <template v-if="confidencePercent != null">
                <span class="meta-sep">·</span>
                {{ confidencePercent }}% confidence
              </template>
            </p>
          </div>
          <div v-if="healthScore != null" class="risk-score-ring">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="var(--ring-bg)"
                stroke-width="7"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                :stroke="healthColor(healthScore)"
                stroke-width="7"
                stroke-linecap="round"
                :stroke-dasharray="213.6"
                :stroke-dashoffset="213.6 - (213.6 * healthScore) / 100"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <span
              class="risk-number"
              :style="{ color: healthColor(healthScore) }"
              >{{ healthScore }}</span
            >
            <span class="risk-label">Health</span>
          </div>
        </div>
        <p class="summary-text">{{ report.summary }}</p>
      </div>

      <!-- Critical Findings -->
      <div v-if="report.criticalFindings?.length" class="card alert-card alert-critical">
        <h2 class="card-title">Critical Findings</h2>
        <ul class="rec-list">
          <li v-for="c in report.criticalFindings" :key="c">{{ c }}</li>
        </ul>
      </div>

      <!-- Warnings -->
      <div v-if="report.warnings?.length" class="card alert-card alert-warning">
        <h2 class="card-title">Warnings</h2>
        <ul class="rec-list">
          <li v-for="w in report.warnings" :key="w">{{ w }}</li>
        </ul>
      </div>

      <!-- Key Insights & Positive Findings -->
      <div
        v-if="report.keyInsights?.length || report.positiveFindings?.length"
        class="even-col"
      >
        <div v-if="report.keyInsights?.length" class="card">
          <h2 class="card-title">Key Insights</h2>
          <ul class="rec-list">
            <li v-for="k in report.keyInsights" :key="k">{{ k }}</li>
          </ul>
        </div>
        <div v-if="report.positiveFindings?.length" class="card positive-card">
          <h2 class="card-title">Positive Findings</h2>
          <ul class="rec-list">
            <li v-for="p in report.positiveFindings" :key="p">{{ p }}</li>
          </ul>
        </div>
      </div>

      <div class="two-col">
        <!-- Findings -->
        <div v-if="report.findings?.length" class="card">
          <h2 class="card-title">Findings</h2>
          <div class="findings-list">
            <div
              v-for="f in report.findings"
              :key="f.label"
              class="finding-item"
              :class="'finding-' + normalizeStatus(f.status)"
            >
              <div class="finding-header">
                <span class="finding-label">{{ f.label }}</span>
                <span
                  class="finding-badge"
                  :class="'badge-' + normalizeStatus(f.status)"
                  >{{ statusLabel(normalizeStatus(f.status)) }}</span
                >
              </div>
              <p v-if="f.value" class="finding-value">{{ f.value }}</p>
              <p v-if="f.whyItMatters" class="finding-why">
                {{ f.whyItMatters }}
              </p>
              <div v-if="f.possibleCauses?.length" class="finding-sub">
                <p class="finding-sub-title">Possible causes</p>
                <ul class="rec-list">
                  <li v-for="c in f.possibleCauses" :key="c">{{ c }}</li>
                </ul>
              </div>
              <div v-if="f.recommendedActions?.length" class="finding-sub">
                <p class="finding-sub-title">What to do</p>
                <ul class="rec-list">
                  <li v-for="a in f.recommendedActions" :key="a">{{ a }}</li>
                </ul>
              </div>
              <div v-if="f.severityScore != null" class="severity-bar-wrap">
                <div class="severity-bar">
                  <div
                    class="severity-fill"
                    :style="{
                      width: severityPercent(f.severityScore) + '%',
                      background: riskColor(severityPercent(f.severityScore)),
                    }"
                  ></div>
                </div>
                <span class="severity-num">{{ severityPercent(f.severityScore) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="right-col">
          <!-- Markers -->
          <div v-if="report.markers?.length" class="card">
            <h2 class="card-title">Markers</h2>
            <table class="markers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in report.markers" :key="m.name">
                  <td>
                    {{ m.name }}
                    <span v-if="m.referenceRange" class="range-text"
                      >Range: {{ m.referenceRange }}</span
                    >
                  </td>
                  <td>
                    <strong>{{ m.value }}</strong>
                  </td>
                  <td class="unit-cell">{{ m.unit || "—" }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Recommendations -->
          <div v-if="hasRecommendations" class="card">
            <h2 class="card-title">Recommendations</h2>
            <div class="recs-grid">
              <div
                v-if="report.recommendations?.diet?.length"
                class="rec-section"
              >
                <div class="rec-icon rec-diet">🥗</div>
                <div>
                  <p class="rec-heading">Diet</p>
                  <ul class="rec-list">
                    <li v-for="r in report.recommendations.diet" :key="r">
                      {{ r }}
                    </li>
                  </ul>
                </div>
              </div>
              <div
                v-if="report.recommendations?.exercise?.length"
                class="rec-section"
              >
                <div class="rec-icon rec-exercise">🏃</div>
                <div>
                  <p class="rec-heading">Exercise</p>
                  <ul class="rec-list">
                    <li v-for="r in report.recommendations.exercise" :key="r">
                      {{ r }}
                    </li>
                  </ul>
                </div>
              </div>
              <div
                v-if="report.recommendations?.sleep?.length"
                class="rec-section"
              >
                <div class="rec-icon rec-sleep">😴</div>
                <div>
                  <p class="rec-heading">Sleep</p>
                  <ul class="rec-list">
                    <li v-for="r in report.recommendations.sleep" :key="r">
                      {{ r }}
                    </li>
                  </ul>
                </div>
              </div>
              <div
                v-if="report.recommendations?.supplements?.length"
                class="rec-section"
              >
                <div class="rec-icon rec-supp">💊</div>
                <div>
                  <p class="rec-heading">Supplements</p>
                  <ul class="rec-list">
                    <li
                      v-for="r in report.recommendations.supplements"
                      :key="r"
                    >
                      {{ r }}
                    </li>
                  </ul>
                </div>
              </div>
              <div
                v-if="report.recommendations?.followUp?.length"
                class="rec-section rec-full"
              >
                <div class="rec-icon rec-followup">📋</div>
                <div>
                  <p class="rec-heading">Follow-Up</p>
                  <ul class="rec-list">
                    <li v-for="r in report.recommendations.followUp" :key="r">
                      {{ r }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Risk Categories & Missing Markers -->
      <div
        v-if="riskCategoryList.length || report.missingImportantMarkers?.length"
        class="even-col"
      >
        <div v-if="riskCategoryList.length" class="card">
          <h2 class="card-title">Risk Breakdown</h2>
          <div class="risk-cat-list">
            <div v-for="rc in riskCategoryList" :key="rc.key" class="risk-cat">
              <span class="risk-cat-label">{{ rc.label }}</span>
              <div class="severity-bar-wrap risk-cat-bar">
                <div class="severity-bar">
                  <div
                    class="severity-fill"
                    :style="{ width: rc.value + '%', background: riskColor(rc.value) }"
                  ></div>
                </div>
                <span class="severity-num">{{ rc.value }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="report.missingImportantMarkers?.length" class="card">
          <h2 class="card-title">Suggested Additional Tests</h2>
          <p class="card-note">
            These tests weren't in this report but would help complete the picture.
          </p>
          <div class="chip-list">
            <span
              v-for="m in report.missingImportantMarkers"
              :key="m"
              class="detail-chip"
              >{{ m }}</span
            >
          </div>
        </div>
      </div>

      <!-- Pattern Analysis -->
      <div v-if="report.patternAnalysis?.length" class="card">
        <h2 class="card-title">Pattern Analysis</h2>
        <div class="findings-list">
          <div
            v-for="p in report.patternAnalysis"
            :key="p.title"
            class="finding-item"
            :class="'outlook-' + p.severity"
          >
            <div class="finding-header">
              <span class="finding-label">{{ p.title }}</span>
              <span class="finding-badge" :class="'outlook-badge-' + p.severity">{{
                capitalize(p.severity)
              }}</span>
            </div>
            <p class="finding-why">{{ p.insight }}</p>
          </div>
        </div>
      </div>

      <!-- Long-Term Outlook & 5-Year Plan -->
      <div
        v-if="report.longTermInsights?.length || report.fiveYearAnswers?.length"
        class="even-col"
      >
        <div v-if="report.longTermInsights?.length" class="card">
          <h2 class="card-title">Long-Term Outlook</h2>
          <div class="findings-list">
            <div
              v-for="lt in report.longTermInsights"
              :key="lt.title"
              class="finding-item"
              :class="'outlook-' + lt.outlook"
            >
              <div class="finding-header">
                <span class="finding-label">{{ lt.title }}</span>
                <span class="finding-badge" :class="'outlook-badge-' + lt.outlook"
                  >{{ lt.horizonYears }}-year · {{ capitalize(lt.outlook) }} risk</span
                >
              </div>
              <p class="finding-why">{{ lt.insight }}</p>
            </div>
          </div>
        </div>
        <div v-if="report.fiveYearAnswers?.length" class="card">
          <h2 class="card-title">5-Year Plan</h2>
          <div class="timeline">
            <div v-for="y in report.fiveYearAnswers" :key="y.year" class="timeline-item">
              <div class="timeline-year" :class="'outlook-badge-' + y.outlook">
                Y{{ y.year }}
              </div>
              <div>
                <p class="timeline-question">{{ y.question }}</p>
                <p class="finding-why">{{ y.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DNA Traits -->
      <div v-if="report.dnaTraits?.length" class="card">
        <h2 class="card-title">Genetic Traits</h2>
        <div class="findings-list">
          <div v-for="t in report.dnaTraits" :key="t.trait" class="finding-item">
            <div class="finding-header">
              <span class="finding-label">{{ t.trait }}</span>
              <span class="finding-badge badge-borderline">{{ t.result }}</span>
            </div>
            <p class="finding-why">{{ t.insight }}</p>
            <p v-if="t.basedOn?.length" class="range-text">
              Based on: {{ t.basedOn.join(", ") }}
            </p>
          </div>
        </div>
      </div>

      <!-- Medicine & Supplement Suggestions -->
      <div v-if="displayedMedicineSuggestions.length" class="card medicine-card">
        <div class="disclaimer-inline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span><strong>AI Suggestion — Consult a doctor before taking any medicine.</strong> These are AI-generated recommendations based on your report, cross-checked against live pharmacy stock where available. They are NOT a medical prescription. Always consult a qualified healthcare professional before starting any medication or supplement.</span>
        </div>

        <h2 class="card-title">Suggested Medicines & Supplements</h2>
        <div class="med-suggestions-list">
          <div v-for="(med, idx) in displayedMedicineSuggestions" :key="idx" class="med-suggestion-item" :class="'med-type-' + med.type">
            <div class="med-suggestion-header">
              <span class="med-suggestion-type">{{ med.type === 'medicine' ? '💊' : med.type === 'vitamin' ? '💊' : '🌿' }} {{ capitalize(med.type) }}</span>
              <span v-if="med.live?.isPrescriptionRequired ?? med.isPrescriptionRequired" class="rx-badge-sm">Requires Prescription</span>
            </div>
            <h3 class="med-suggestion-name">{{ med.live?.brandName || med.name }}</h3>
            <p v-if="med.live?.genericName" class="med-suggestion-generic">{{ med.live.genericName }}</p>
            <p class="med-suggestion-reason">{{ med.reason }}</p>
            <p v-if="med.evidence" class="med-suggestion-evidence">Evidence: {{ med.evidence }}</p>
            <div v-if="med.dosage || med.duration" class="med-suggestion-details">
              <span v-if="med.dosage" class="detail-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12H4"/></svg>
                {{ med.dosage }}
              </span>
              <span v-if="med.duration" class="detail-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ med.duration }}
              </span>
            </div>
            <div v-if="med.live?.sellPricePaise != null" class="med-suggestion-price">
              <span class="price">₹{{ (med.live.sellPricePaise / 100).toFixed(2) }}</span>
              <span v-if="med.live.mrpPaise" class="mrp">MRP ₹{{ (med.live.mrpPaise / 100).toFixed(2) }}</span>
              <span v-if="med.live.packText" class="pack">{{ med.live.packText }}</span>
            </div>
            <a
              v-if="med.live?.slug"
              :href="`https://pharmacy.medivoy.ae/product/${med.live.slug}`"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary btn-sm buy-btn"
            >
              Buy Now →
            </a>
          </div>
        </div>
        <div class="pharmacy-cta">
          <NuxtLink to="/pharmacy" class="btn-primary btn-sm">
            Search in Pharmacy →
          </NuxtLink>
        </div>
      </div>

      <!-- Suggested Doctors -->
      <div v-if="pharmacySuggestions?.doctorSuggestions?.length" class="card medicine-card">
        <h2 class="card-title">Suggested Doctors</h2>
        <div class="doctor-list">
          <div v-for="doc in pharmacySuggestions.doctorSuggestions" :key="doc.doctorId || doc.id" class="doctor-card">
            <div class="doc-avatar">{{ (doc.name || 'Dr. ')[0] }}</div>
            <div class="doc-info">
              <p class="doc-name">{{ doc.name || 'Doctor' }}</p>
              <p class="doc-spec">{{ doc.specialty || doc.specialties?.join(', ') || 'General Physician' }}</p>
              <p v-if="doc.experience" class="doc-exp">{{ doc.experience }} years experience</p>
            </div>
          </div>
        </div>
        <div class="pharmacy-cta">
          <NuxtLink to="/pharmacy" class="btn-primary btn-sm">
            Find more doctors →
          </NuxtLink>
        </div>
      </div>

      <!-- Document Preview -->
      <div v-if="resolvedFileUrl" class="card preview-card">
        <div class="preview-header">
          <h2 class="card-title" style="margin: 0">Document Preview</h2>
          <a :href="resolvedFileUrl" target="_blank" class="btn-outline btn-sm"
            >Open in tab ↗</a
          >
        </div>
        <div class="preview-frame">
          <iframe
            v-if="isPdf"
            :src="resolvedFileUrl"
            class="pdf-frame"
            title="Report document"
          ></iframe>
          <img
            v-else-if="isImage"
            :src="resolvedFileUrl"
            class="img-preview"
            alt="Report document"
          />
          <div v-else class="preview-unavailable">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p>Preview not available for this file type.</p>
            <a :href="resolvedFileUrl" target="_blank" class="btn-primary"
              >Download File</a
            >
          </div>
        </div>
      </div>

      <!-- Extracted Text -->
      <details v-if="report.extractedText" class="card extracted-card">
        <summary class="card-title extracted-summary">Extracted Text</summary>
        <pre class="extracted-text">{{ report.extractedText }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const api = useMedivoyApi();
const report = ref<any>(null);
const loading = ref(true);
const pharmacySuggestions = ref<any>(null);

// Uploads are served from the API host, outside the /api prefix.
const API_BASE = String(useRuntimeConfig().public.apiBase || "https://api-geno.medivoy.ae/api")
  .replace(/\/api\/?$/, "");

const reportType = computed(() =>
  String(report.value?.reportType || report.value?.type || "other").toLowerCase(),
);

// Older reports store the health score only in riskScore.
const healthScore = computed(() => {
  const v = report.value?.overallHealthScore ?? report.value?.riskScore;
  return v == null ? null : Math.round(Number(v));
});

// The AI returns confidence either as 0-1 or 0-100.
const confidencePercent = computed(() => {
  const v = Number(report.value?.confidenceScore);
  if (!v) return null;
  return Math.round(v <= 1 ? v * 100 : v);
});

const riskCategoryList = computed(() => {
  const rc = report.value?.riskCategories || {};
  const entries = Object.entries(rc).filter(([, v]) => typeof v === "number");
  // Scores come back as 0-10 or 0-100 depending on the report.
  const scale = entries.every(([, v]) => (v as number) <= 10) ? 10 : 1;
  return entries.map(([key, v]) => ({
    key,
    label: humanize(key.replace(/Risk$/, "")),
    value: Math.min(100, Math.round((v as number) * scale)),
  }));
});

const displayedMedicineSuggestions = computed(() => {
  if (pharmacySuggestions.value?.medicineSuggestions?.length) {
    return pharmacySuggestions.value.medicineSuggestions;
  }
  return report.value?.medicineSuggestions || [];
});

onMounted(async () => {
  try {
    report.value = await api.getReport(route.params.id as string);
  } catch {
    report.value = null;
  } finally {
    loading.value = false;
  }

  if (report.value?.id) {
    try {
      pharmacySuggestions.value = await api.getPharmacySuggestions(report.value.id);
    } catch {
      pharmacySuggestions.value = null;
    }
  }
});

const resolvedFileUrl = computed(() => {
  const raw = report.value?.fileUrl || "";
  if (!raw) return "";
  if (raw.startsWith("http")) return raw;
  // strip leading slash if present then prepend API base
  const clean = raw.startsWith("/") ? raw : "/" + raw;
  return `${API_BASE}${clean}`;
});

const isPdf = computed(() =>
  resolvedFileUrl.value.toLowerCase().includes(".pdf"),
);
const isImage = computed(() =>
  /\.(png|jpe?g|gif|webp|svg)$/i.test(resolvedFileUrl.value),
);

const hasRecommendations = computed(() => {
  const r = report.value?.recommendations;
  if (!r) return false;
  return ["diet", "exercise", "sleep", "supplements", "followUp"].some(
    (k) => r[k]?.length,
  );
});

function formatDate(dt: string) {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function capitalize(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function humanize(s: string) {
  return capitalize(
    s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim().toLowerCase(),
  );
}

// The backend sends statuses like "mildhigh"; styles use "mild_high".
function normalizeStatus(s: string) {
  const key = String(s || "").toLowerCase().replace(/[^a-z]/g, "");
  const map: Record<string, string> = {
    mildhigh: "mild_high",
    moderatehigh: "moderate_high",
    criticalhigh: "critical_high",
    high: "moderate_high",
    mildlow: "mild_low",
    moderatelow: "moderate_low",
    criticallow: "critical_low",
    low: "mild_low",
  };
  return map[key] || key;
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    normal: "Normal",
    borderline: "Borderline",
    mild_high: "Mild High",
    moderate_high: "Moderate High",
    critical_high: "Critical",
    mild_low: "Mild Low",
    moderate_low: "Moderate Low",
    critical_low: "Critical Low",
  };
  return map[s] || humanize(s);
}

// Severity comes back as 0-10 or 0-100; show it as a percentage.
function severityPercent(score: number) {
  const n = Number(score) || 0;
  return Math.min(100, Math.round(n <= 10 ? n * 10 : n));
}

function riskColor(score: number) {
  if (score >= 75) return "#e53935";
  if (score >= 50) return "#fb8c00";
  if (score >= 25) return "#fdd835";
  return "#43a047";
}

function healthColor(score: number) {
  return riskColor(100 - score);
}

function downloadFile() {
  if (!resolvedFileUrl.value) return;
  const a = document.createElement("a");
  a.href = resolvedFileUrl.value;
  a.download = report.value?.title || "report";
  a.target = "_blank";
  a.click();
}

function viewFile() {
  if (!resolvedFileUrl.value) return;
  window.open(resolvedFileUrl.value, "_blank");
}
</script>

<style scoped>
.report-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  padding: 0.5rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.625rem;
  background: #fff;
  transition: all 0.15s;
}
.back-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}
.header-actions {
  display: flex;
  gap: 0.625rem;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  padding: 0.5rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.625rem;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
}
.btn-outline:hover {
  background: #f9fafb;
}
.btn-outline.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  padding: 0.625rem 1.125rem;
  border: none;
  border-radius: 0.625rem;
  background: #01696f;
  cursor: pointer;
  transition: background 0.15s;
  text-decoration: none;
}
.btn-primary:hover {
  background: #0c4e54;
}

/* Cards */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}
.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem;
}

/* Loading */
.loading-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 2rem;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 0.375rem;
}
.skeleton-heading {
  height: 1.5rem;
  width: 40%;
  margin-bottom: 1rem;
}
.skeleton-text {
  height: 1rem;
  margin-bottom: 0.625rem;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}
.empty-state svg {
  margin-bottom: 1rem;
  color: #d1d5db;
}
.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}
.empty-state p {
  max-width: 36ch;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

/* Summary */
.summary-card {
  margin-bottom: 1.25rem;
}
.summary-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.report-type-badge {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  margin-bottom: 0.625rem;
}
.type-blood {
  background: #fee2e2;
  color: #991b1b;
}
.type-dna {
  background: #dbeafe;
  color: #1e40af;
}
.type-other {
  background: #f3e8ff;
  color: #6b21a8;
}

.report-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem;
  word-break: break-word;
}
.report-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
  flex-wrap: wrap;
}
.meta-sep {
  color: #d1d5db;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.status-done {
  background: #22c55e;
}
.status-error {
  background: #ef4444;
}
.status-pending,
.status-processing {
  background: #f59e0b;
}
.summary-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.65;
}

/* Risk ring */
.risk-score-ring {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}
.risk-score-ring svg {
  position: absolute;
  top: 0;
  left: 0;
}
.risk-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1;
}
.risk-label {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.625rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:root {
  --ring-bg: #f3f4f6;
}

/* Two column layout */
.two-col {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.25rem;
  align-items: start;
}
@media (max-width: 768px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}
.right-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.right-col .card {
  margin-bottom: 0;
}

/* Findings */
.findings-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.finding-item {
  padding: 0.875rem;
  border-radius: 0.625rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}
.finding-critical_high,
.finding-critical_low {
  background: #fff5f5;
  border-color: #fecaca;
}
.finding-moderate_high,
.finding-moderate_low {
  background: #fff7ed;
  border-color: #fed7aa;
}
.finding-mild_high,
.finding-mild_low {
  background: #fffbeb;
  border-color: #fde68a;
}
.finding-borderline {
  background: #f0f9ff;
  border-color: #bae6fd;
}
.finding-normal {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.finding-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}
.finding-label {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
}
.finding-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}
.badge-normal {
  background: #dcfce7;
  color: #166534;
}
.badge-borderline {
  background: #dbeafe;
  color: #1e40af;
}
.badge-mild_high,
.badge-mild_low {
  background: #fef9c3;
  color: #854d0e;
}
.badge-moderate_high,
.badge-moderate_low {
  background: #ffedd5;
  color: #9a3412;
}
.badge-critical_high,
.badge-critical_low {
  background: #fee2e2;
  color: #991b1b;
}

.finding-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0.25rem 0 0;
}
.finding-why {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0.375rem 0 0;
  line-height: 1.55;
}
.severity-bar-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.625rem;
}
.severity-bar {
  flex: 1;
  height: 5px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}
.severity-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}
.severity-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  min-width: 24px;
  text-align: right;
}

/* Markers table */
.markers-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.markers-table th {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  padding: 0 0 0.5rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
.markers-table td {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}
.markers-table tr:last-child td {
  border-bottom: none;
}
.unit-cell {
  color: #9ca3af;
  font-size: 0.8125rem;
}
.range-text {
  display: block;
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.4;
  margin-top: 0.125rem;
}

/* Two equal columns */
.even-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  align-items: start;
  margin-bottom: 1.25rem;
}
.even-col .card {
  margin-bottom: 0;
}
@media (max-width: 768px) {
  .even-col {
    grid-template-columns: 1fr;
  }
}

/* Alerts */
.alert-critical {
  background: #fff5f5;
  border-color: #fecaca;
}
.alert-critical .card-title {
  color: #991b1b;
}
.alert-warning {
  background: #fffbeb;
  border-color: #fde68a;
}
.alert-warning .card-title {
  color: #92400e;
}
.positive-card {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.card-note {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: -0.5rem 0 0.875rem;
}
.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Finding details */
.finding-sub {
  margin-top: 0.625rem;
}
.finding-sub-title {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin: 0 0 0.25rem;
}
.finding-sub .rec-list li {
  font-size: 0.8125rem;
}

/* Risk categories */
.risk-cat-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.risk-cat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}
.risk-cat-bar {
  margin-top: 0.25rem;
}

/* Outlook (low / moderate / high) */
.outlook-low {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.outlook-moderate {
  background: #fffbeb;
  border-color: #fde68a;
}
.outlook-high {
  background: #fff5f5;
  border-color: #fecaca;
}
.outlook-badge-low {
  background: #dcfce7;
  color: #166534;
}
.outlook-badge-moderate {
  background: #fef9c3;
  color: #854d0e;
}
.outlook-badge-high {
  background: #fee2e2;
  color: #991b1b;
}

/* 5-year timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.timeline-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}
.timeline-year {
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  flex-shrink: 0;
}
.timeline-question {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

/* Extracted text */
.extracted-summary {
  cursor: pointer;
  margin: 0;
}
.extracted-card[open] .extracted-summary {
  margin-bottom: 1rem;
}
.extracted-text {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: #4b5563;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.625rem;
  padding: 1rem;
  max-height: 400px;
  overflow: auto;
  margin: 0;
}

/* Recommendations */
.recs-grid {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.rec-section {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}
.rec-full {
  width: 100%;
}
.rec-icon {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}
.rec-diet {
  background: #dcfce7;
}
.rec-exercise {
  background: #dbeafe;
}
.rec-sleep {
  background: #fef9c3;
}
.rec-supp {
  background: #f3e8ff;
}
.rec-followup {
  background: #f0f9ff;
}
.rec-heading {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.rec-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.rec-list li {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.55;
  padding-left: 0.875rem;
  position: relative;
}
.rec-list li::before {
  content: "·";
  position: absolute;
  left: 0;
  color: #9ca3af;
  font-weight: 700;
}

/* Medicine Suggestions */
.medicine-card {
  border-color: #dbeafe;
  background: #f8faff;
}
.disclaimer-inline {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 0.625rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: #92400e;
  line-height: 1.5;
}
.disclaimer-inline svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: #d97706;
}
.med-suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.med-suggestion-item {
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}
.med-suggestion-item.med-type-medicine {
  border-left: 3px solid #f59e0b;
}
.med-suggestion-item.med-type-supplement {
  border-left: 3px solid #10b981;
}
.med-suggestion-item.med-type-vitamin {
  border-left: 3px solid #3b82f6;
}
.med-suggestion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
  flex-wrap: wrap;
}
.med-suggestion-type {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}
.rx-badge-sm {
  font-size: 0.625rem;
  font-weight: 700;
  color: #dc2626;
  background: #fee2e2;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}
.med-suggestion-name {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.375rem;
}
.med-suggestion-generic {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: -0.25rem 0 0.375rem;
}
.med-suggestion-reason {
  font-size: 0.8125rem;
  color: #4b5563;
  line-height: 1.55;
  margin: 0 0 0.625rem;
}
.med-suggestion-evidence {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
  margin: -0.375rem 0 0.625rem;
}
.med-suggestion-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.med-suggestion-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.625rem;
}
.med-suggestion-price .price {
  font-size: 1rem;
  font-weight: 800;
  color: #01696f;
}
.med-suggestion-price .mrp {
  font-size: 0.75rem;
  color: #9ca3af;
  text-decoration: line-through;
}
.med-suggestion-price .pack {
  font-size: 0.75rem;
  color: #6b7280;
}
.detail-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  background: #f3f4f6;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
}
.detail-chip svg {
  color: #9ca3af;
}
.pharmacy-cta {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
}
.buy-btn {
  display: inline-flex;
  align-items: center;
  margin-top: 0.75rem;
  text-decoration: none;
}
.doctor-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.doctor-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #f9fafb;
}
.doc-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #01696f, #0c4e54);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.125rem;
  flex-shrink: 0;
}
.doc-info { flex: 1; }
.doc-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.125rem;
}
.doc-spec {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 0.125rem;
}
.doc-exp {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

/* Preview */
.preview-card {
}
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.preview-frame {
  border-radius: 0.625rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #f3f4f6;
  min-height: 400px;
}
.pdf-frame {
  width: 100%;
  height: 600px;
  border: none;
  display: block;
}
.img-preview {
  width: 100%;
  height: auto;
  display: block;
}
.preview-unavailable {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 0.75rem;
  color: #9ca3af;
  padding: 2rem;
}
.preview-unavailable p {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}
</style>
