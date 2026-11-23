<template>
  <div class="genetics-page">
    <section class="genetics-intro">
      <div class="genetics-intro-copy">
        <span class="genetics-eyebrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" />
          </svg>
          Genetic insights
        </span>
        <h1>Understand your genetic <span class="genetics-heading-accent">health profile.</span></h1>
        <p>
          Review selected DNA markers in a clear, organized summary. Upload a
          report or enter known variants to get started.
        </p>
      </div>
      <div class="genetics-intro-note">
        <span class="intro-note-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" />
          </svg>
        </span>
        <span class="intro-note-label">Your profile</span>
        <strong>Genetic markers, made easier to review</strong>
        <span class="intro-note-caption">For discussion with your care team</span>
      </div>
    </section>

    <section class="genetics-workspace">
      <div class="genetics-inputs">
        <article class="genetics-card upload-card">
          <div class="upload-card-heading">
            <span class="genetics-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 16V4m0 0L7 9m5-5 5 5M5 14v5h14v-5" />
              </svg>
            </span>
            <div>
              <span class="genetics-kicker">Report import</span>
              <h2>Upload a DNA report</h2>
            </div>
          </div>
          <p>
            Upload a PDF or TXT report. Key markers such as APOE, MTHFR, FTO,
            LCT, HFE, and CYP1A2 can be extracted automatically.
          </p>
          <NuxtLink to="/reports/upload" class="genetics-upload-link">
            Upload DNA report
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </NuxtLink>
        </article>

        <article class="genetics-card variant-card">
          <div class="variant-card-heading">
            <div class="variant-heading-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" />
              </svg>
            </div>
            <div>
              <span class="genetics-kicker">Manual entry</span>
              <h2>Enter known variants</h2>
              <p>Use the results from your DNA report.</p>
            </div>
          </div>

          <div class="gene-grid">
            <div v-for="gene in genes" :key="gene.name" class="gene-field">
              <label :for="`gene-${gene.name}`">{{ gene.name }}</label>
              <select :id="`gene-${gene.name}`" v-model="variants[gene.name]">
                <option value="">Unknown</option>
                <option v-for="opt in gene.options" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
            </div>
          </div>

          <div class="variant-card-footer">
            <p>Only enter results you know from your report.</p>
            <button
              class="analyze-button"
              type="button"
              :disabled="saving"
              @click="analyze"
            >
              <svg v-if="saving" class="analyze-spinner" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 1 9 9" />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.6-6.4-2.1 2.1m-6.6 6.6-2.1 2.1m0-10.8 2.1 2.1m6.6 6.6 2.1 2.1" />
              </svg>
              {{ saving ? "Analyzing..." : "Analyze variants" }}
            </button>
          </div>
        </article>
      </div>

      <div class="genetics-results">
        <div v-if="loading" class="result-loading" aria-label="Loading genetic profile">
          <div class="loading-score"></div>
          <div class="loading-summary"></div>
          <div class="loading-findings"></div>
        </div>

        <div v-else-if="result" class="result-content">
          <section class="result-overview">
            <article class="result-card score-card">
              <span class="result-kicker">Profile overview</span>
              <p class="score-label">Genetic risk score</p>
              <strong
                class="risk-score"
                :class="
                  result.riskScore >= 60
                    ? 'risk-score-high'
                    : result.riskScore >= 30
                      ? 'risk-score-moderate'
                      : 'risk-score-low'
                "
              >
                {{ result.riskScore }}
              </strong>
              <p class="score-caption">Calculated from selected markers</p>
            </article>
            <article class="result-card summary-card">
              <span class="result-kicker">Summary</span>
              <h2>Your genetic profile</h2>
              <p>{{ result.summary }}</p>
            </article>
          </section>

          <section class="result-card findings-card">
            <div class="result-section-heading">
              <div>
                <span class="result-kicker">Marker review</span>
                <h2>Variant findings</h2>
                <p>Each selected marker is grouped by its reported risk level.</p>
              </div>
              <span class="finding-count">{{ result.findings?.length || 0 }} markers</span>
            </div>
            <div class="finding-list">
              <article
                v-for="(finding, i) in result.findings"
                :key="i"
                class="finding-item"
              >
                <div class="finding-main">
                  <div>
                    <h3>{{ finding.label }}</h3>
                    <p>{{ finding.value }}</p>
                  </div>
                  <span
                    class="finding-status"
                    :class="
                      finding.status === 'high'
                        ? 'finding-status-high'
                        : finding.status === 'low'
                          ? 'finding-status-moderate'
                          : 'finding-status-normal'
                    "
                  >
                    {{
                      finding.status === "high"
                        ? "Elevated risk"
                        : finding.status === "low"
                          ? "Moderate"
                          : "Normal"
                    }}
                  </span>
                </div>
                <p v-if="finding.note" class="finding-note">{{ finding.note }}</p>
              </article>
            </div>
          </section>

          <section class="result-card recommendations-card">
            <div class="result-section-heading">
              <div>
                <span class="result-kicker">Next steps</span>
                <h2>Personalized recommendations</h2>
              </div>
            </div>
            <ul class="recommendation-list">
              <li v-for="(recommendation, i) in result.recommendations" :key="i">
                <span>{{ String(i + 1).padStart(2, "0") }}</span>
                {{ recommendation }}
              </li>
            </ul>
            <p class="genetics-disclaimer">
              Genetic insights are informational and should be discussed with a
              qualified clinician.
            </p>
          </section>
        </div>

        <section v-else class="result-empty">
          <div class="empty-dna-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <path d="M15 5c18 7 18 31 0 38M33 5C15 12 15 36 33 43M16 11h16M13 18h22M13 30h22M16 37h16" />
            </svg>
          </div>
          <span class="genetics-kicker">Your results</span>
          <h2>Your genetic summary will appear here</h2>
          <p>
            Select known variants and analyze them, or upload a DNA report to
            begin building your profile.
          </p>
          <div class="empty-steps">
            <div><span>01</span>Enter or upload results</div>
            <div><span>02</span>Review markers and guidance</div>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const genes = [
  { name: "APOE", options: ["E2/E2", "E2/E3", "E3/E3", "E3/E4", "E4/E4"] },
  {
    name: "MTHFR",
    options: [
      "Normal",
      "C677T heterozygous",
      "C677T homozygous",
      "A1298C heterozygous",
    ],
  },
  { name: "FTO", options: ["No risk variant", "Risk variant present"] },
  {
    name: "LCT",
    options: ["Lactase persistence", "Lactase persistence variant absent"],
  },
  { name: "HFE", options: ["Negative", "Heterozygous carrier", "Positive"] },
  {
    name: "CYP1A2",
    options: ["Fast metaboliser", "Slow metabolism variant present"],
  },
];
const variants = reactive<Record<string, string>>({});
const result = ref<any | null>(null);
const loading = ref(true);
const saving = ref(false);
const variantNotes: Record<string, string> = {
  APOE: "APOE E4 is associated with higher LDL and cardiovascular risk.",
  MTHFR: "MTHFR variants may affect folate metabolism.",
  FTO: "FTO risk variants are associated with weight-gain tendency.",
  LCT: "Lactase non-persistence suggests lactose intolerance tendency.",
  HFE: "HFE variants may relate to iron metabolism.",
  CYP1A2: "CYP1A2 slow variants affect caffeine metabolism.",
};

onMounted(async () => {
  try {
    const saved = await api.getGenetics();
    if (saved) {
      result.value = {
        riskScore: saved.riskScore,
        summary: saved.summary,
        findings: saved.findings,
        recommendations: saved.recommendations,
      };
      if (saved.variants) Object.assign(variants, saved.variants);
    }
  } catch {
  } finally {
    loading.value = false;
  }
});

function scoreVariant(name: string, value: string) {
  const v = value.toLowerCase();
  if (name === "APOE") return v.includes("e4") ? 12 : 4;
  if (name === "MTHFR")
    return v.includes("homozygous") ? 10 : v.includes("heterozygous") ? 6 : 0;
  if (name === "FTO") return v.includes("risk") ? 8 : 0;
  if (name === "LCT") return v.includes("absent") ? 4 : 0;
  if (name === "HFE")
    return v.includes("positive") ? 8 : v.includes("carrier") ? 4 : 0;
  if (name === "CYP1A2") return v.includes("slow") ? 4 : 0;
  return 0;
}

const analyze = async () => {
  let riskScore = 20;
  const findings: any[] = [];
  const recs = new Set<string>();
  for (const gene of genes) {
    const value = variants[gene.name];
    if (!value) continue;
    const add = scoreVariant(gene.name, value);
    riskScore += add;
    const status = add >= 8 ? "high" : add >= 4 ? "low" : "normal";
    findings.push({
      label: gene.name,
      status,
      value,
      note: variantNotes[gene.name],
    });
    if (gene.name === "APOE" && value.includes("E4"))
      recs.add("Follow a heart-healthy, low saturated-fat diet.");
    if (gene.name === "MTHFR")
      recs.add("Review folate, B12, and homocysteine levels.");
    if (gene.name === "FTO" && value.includes("Risk"))
      recs.add("Prioritise regular physical activity and protein-rich meals.");
    if (gene.name === "LCT" && value.includes("absent"))
      recs.add("Reduce lactose or switch to lactose-free alternatives.");
    if (gene.name === "HFE" && value !== "Negative")
      recs.add("Review iron levels before taking iron supplements.");
    if (gene.name === "CYP1A2" && value.includes("Slow"))
      recs.add("Limit caffeine intake.");
  }
  riskScore = Math.min(90, Math.max(10, riskScore));
  if (recs.size === 0)
    recs.add(
      "Maintain a balanced diet, regular exercise, and periodic health screening.",
    );
  const payload = {
    riskScore,
    summary: findings.length
      ? "Genetic profile shows actionable lifestyle and nutrition considerations."
      : "No variants entered.",
    findings,
    recommendations: [...recs],
    variants: { ...variants },
  };
  saving.value = true;
  try {
    await api.saveGenetics(payload);
    result.value = payload;
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.genetics-page {
  display: grid;
  gap: 22px;
  color: #233b59;
  font-family: Poppins, system-ui, sans-serif;
}
.genetics-intro {
  position: relative;
  display: flex;
  min-height: 210px;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  overflow: hidden;
  border: 1px solid #e1ebf7;
  border-radius: 22px;
  background: linear-gradient(112deg, #fff 0%, #fff 58%, #f0f6ff 100%);
  padding: 29px 32px;
  box-shadow: 0 12px 32px rgba(37, 75, 120, 0.045);
}
.genetics-intro::after {
  position: absolute;
  top: -135px;
  right: 145px;
  width: 290px;
  height: 290px;
  border: 1px solid rgba(95, 151, 218, 0.1);
  border-radius: 50%;
  box-shadow: 0 0 0 30px rgba(95, 151, 218, 0.035), 0 0 0 62px rgba(95, 151, 218, 0.025);
  content: "";
  pointer-events: none;
}
.genetics-intro-copy {
  position: relative;
  z-index: 1;
  max-width: 720px;
}
.genetics-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #274568;
  border-radius: 999px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 7px 11px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.genetics-eyebrow svg,
.intro-note-icon svg,
.genetics-icon svg,
.variant-heading-icon svg,
.analyze-button svg,
.finding-status svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.genetics-intro h1 {
  max-width: 700px;
  margin: 16px 0 0;
  color: #1c3656;
  font-size: clamp(28px, 3.2vw, 38px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.04em;
}
.genetics-heading-accent {
  color: #438cdf;
}
.genetics-intro-copy > p {
  max-width: 650px;
  margin: 12px 0 0;
  color: #7489a3;
  font-size: 15px;
  line-height: 1.75;
}
.genetics-intro-note {
  position: relative;
  z-index: 1;
  display: grid;
  width: 210px;
  flex: 0 0 auto;
  justify-items: start;
  border: 1px solid rgba(151, 190, 235, 0.22);
  border-radius: 17px;
  background: linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 16px;
  box-shadow: 0 10px 24px rgba(11, 28, 57, 0.16);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.genetics-intro-note:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(11, 28, 57, 0.19);
}
.intro-note-icon,
.genetics-icon,
.variant-heading-icon {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #dceafb;
  border-radius: 13px;
  background: #eff6ff;
  color: #4384ca;
}
.genetics-icon {
  border-color: #274568;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  color: #fff;
}
.genetics-intro-note .intro-note-icon {
  border-color: rgba(169, 210, 255, 0.26);
  background: rgba(109, 176, 255, 0.14);
  color: #b7dcff;
}
.intro-note-label {
  margin-top: 11px;
  color: #a9d2ff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.genetics-intro-note strong {
  margin-top: 4px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}
.intro-note-caption {
  margin-top: 6px;
  color: #c1d4eb;
  font-size: 10px;
  line-height: 1.5;
}
.genetics-workspace {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  align-items: start;
  gap: 18px;
}
.genetics-inputs,
.genetics-results,
.result-content {
  display: grid;
  min-width: 0;
  gap: 16px;
}
.genetics-card,
.result-card,
.result-empty {
  min-width: 0;
  border: 1px solid #e4ecf5;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 26px rgba(33, 70, 112, 0.035);
}
.genetics-card {
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.genetics-card:hover {
  transform: translateY(-2px);
  border-color: #d3e3f5;
  box-shadow: 0 12px 26px rgba(42, 82, 132, 0.075);
}
.upload-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(125deg, #fff, #f8fbff);
}
.upload-card::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(#74abe5, #d6e8fa);
  content: "";
}
.upload-card-heading,
.variant-card-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}
.genetics-kicker,
.result-kicker {
  display: block;
  margin-bottom: 4px;
  color: #8a9db5;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.upload-card h2,
.variant-card h2 {
  margin: 0;
  color: #263f5e;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.upload-card > p {
  margin: 13px 0 16px;
  color: #7489a3;
  font-size: 12px;
  line-height: 1.7;
}
.genetics-upload-link {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #397fca;
  border-radius: 11px;
  background: linear-gradient(135deg, #4a91df, #3478c8);
  padding: 0 14px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 5px 12px rgba(55, 123, 199, 0.16);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.genetics-upload-link:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg, #397fc9, #2869b5);
  box-shadow: 0 7px 16px rgba(55, 123, 199, 0.2);
}
.genetics-upload-link svg {
  transition: transform 0.18s ease;
}
.genetics-upload-link:hover svg {
  transform: translateX(2px);
}
.genetics-upload-link svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.variant-heading-icon {
  width: 42px;
  height: 42px;
  border: 1px solid #274568;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  color: #fff;
}
.variant-heading-icon svg {
  width: 21px;
  height: 21px;
}
.variant-card-heading p {
  margin: 4px 0 0;
  color: #7d91aa;
  font-size: 11px;
}
.gene-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
  margin-top: 19px;
}
.gene-field {
  display: grid;
  min-width: 0;
  gap: 7px;
}
.gene-field label {
  color: #526a86;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.gene-field select {
  width: 100%;
  height: 43px;
  appearance: none;
  border: 1px solid #dfe8f2;
  border-radius: 10px;
  background-color: #fbfcfe;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23748aa5' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.8' viewBox='0 0 24 24'%3E%3Cpath d='m7 10 5 5 5-5'/%3E%3C/svg%3E");
  background-position: right 12px center;
  background-repeat: no-repeat;
  padding: 0 34px 0 11px;
  color: #304a69;
  font-family: inherit;
  font-size: 11px;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}
.gene-field select:focus-visible {
  border-color: #82b4e8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(71, 139, 211, 0.11);
  outline: none;
}
.variant-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  border-top: 1px solid #edf2f7;
  padding-top: 15px;
}
.variant-card-footer p {
  margin: 0;
  color: #8397b0;
  font-size: 10px;
  line-height: 1.5;
}
.analyze-button {
  display: inline-flex;
  min-height: 42px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #397fca;
  border-radius: 11px;
  background: linear-gradient(135deg, #4a91df, #3478c8);
  padding: 0 13px;
  color: #fff;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 5px 12px rgba(55, 123, 199, 0.16);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.analyze-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: linear-gradient(135deg, #397fc9, #2869b5);
  box-shadow: 0 7px 16px rgba(55, 123, 199, 0.2);
}
.analyze-button:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
}
.analyze-button:disabled {
  opacity: 0.65;
  cursor: wait;
}
.analyze-button:focus-visible,
.genetics-upload-link:focus-visible,
.gene-field select:focus-visible {
  outline: 3px solid rgba(71, 139, 211, 0.25);
  outline-offset: 3px;
}
.analyze-button svg {
  width: 16px;
  height: 16px;
  transition: transform 0.18s ease;
}
.analyze-button:hover:not(:disabled) > svg {
  transform: translateY(-1px) scale(1.05);
}
.analyze-spinner {
  animation: genetics-spin 0.9s linear infinite;
}
.result-loading {
  display: grid;
  gap: 13px;
}
.loading-score,
.loading-summary,
.loading-findings {
  border: 1px solid #e8eef5;
  border-radius: 16px;
  background: linear-gradient(100deg, #f6f8fb 30%, #edf2f8 50%, #f6f8fb 70%);
  background-size: 200% 100%;
  animation: genetics-shimmer 1.5s ease-in-out infinite;
}
.loading-score {
  height: 150px;
}
.loading-summary {
  height: 130px;
}
.loading-findings {
  height: 250px;
}
.result-overview {
  display: grid;
  grid-template-columns: minmax(150px, 0.72fr) minmax(0, 1.28fr);
  gap: 13px;
}
.result-card {
  padding: 19px;
}
.score-card {
  background: linear-gradient(145deg, #fff, #f8fbff);
}
.score-label {
  margin: 13px 0 0;
  color: #667e99;
  font-size: 11px;
  font-weight: 600;
}
.risk-score {
  display: block;
  margin-top: 3px;
  font-size: 42px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.04em;
}
.risk-score-high {
  color: #c76363;
}
.risk-score-moderate {
  color: #bd8a42;
}
.risk-score-low {
  color: #568e71;
}
.score-caption {
  margin: 7px 0 0;
  color: #8a9db5;
  font-size: 9px;
  line-height: 1.5;
}
.summary-card h2,
.result-section-heading h2 {
  margin: 0;
  color: #2b4564;
  font-size: 16px;
  font-weight: 700;
}
.summary-card > p {
  margin: 10px 0 0;
  color: #637a95;
  font-size: 12px;
  line-height: 1.75;
}
.result-section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px;
}
.result-section-heading > div > p {
  margin: 4px 0 0;
  color: #7d91aa;
  font-size: 11px;
}
.finding-count {
  flex: 0 0 auto;
  border: 1px solid #e4edf7;
  border-radius: 999px;
  background: #f8faff;
  padding: 5px 9px;
  color: #7389a4;
  font-size: 9px;
  font-weight: 700;
}
.finding-list {
  display: grid;
  gap: 9px;
}
.finding-item {
  border: 1px solid #e8eef5;
  border-radius: 12px;
  background: #fbfcfe;
  padding: 12px 13px;
  transition: border-color 0.18s ease, background-color 0.18s ease;
}
.finding-item:hover {
  border-color: #d8e6f5;
  background: #f8fbff;
}
.finding-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.finding-main h3 {
  margin: 0;
  color: #304a69;
  font-size: 12px;
  font-weight: 700;
}
.finding-main > div > p {
  margin: 3px 0 0;
  color: #8296ae;
  font-size: 10px;
}
.finding-status {
  flex: 0 0 auto;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 9px;
  font-weight: 700;
}
.finding-status-high {
  border-color: #f1dddd;
  background: #fff5f5;
  color: #b65c5c;
}
.finding-status-moderate {
  border-color: #f1e7d6;
  background: #fffaf1;
  color: #a77a3b;
}
.finding-status-normal {
  border-color: #dceee4;
  background: #f3fbf7;
  color: #4f8a6a;
}
.finding-note {
  margin: 8px 0 0;
  border-top: 1px solid #edf2f7;
  padding-top: 8px;
  color: #7187a1;
  font-size: 10px;
  line-height: 1.6;
}
.recommendation-list {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.recommendation-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid #e8eef5;
  border-radius: 11px;
  background: #fbfcfe;
  padding: 11px 12px;
  color: #637a95;
  font-size: 11px;
  line-height: 1.6;
}
.recommendation-list li > span {
  color: #7295bb;
  font-size: 9px;
  font-weight: 700;
}
.genetics-disclaimer {
  margin: 14px 0 0;
  border-top: 1px solid #edf2f7;
  padding-top: 12px;
  color: #8a9db5;
  font-size: 9px;
  line-height: 1.6;
}
.result-empty {
  display: grid;
  min-height: 420px;
  align-content: center;
  justify-items: center;
  border-style: dashed;
  background: linear-gradient(145deg, #fff, #f8fbff);
  padding: 32px;
  text-align: center;
}
.empty-dna-icon {
  display: grid;
  width: 68px;
  height: 68px;
  place-items: center;
  border: 1px solid #274568;
  border-radius: 21px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.result-empty:hover .empty-dna-icon {
  transform: translateY(-2px);
  box-shadow: 0 7px 16px rgba(55, 123, 199, 0.1);
}
.empty-dna-icon svg {
  width: 43px;
  height: 43px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.result-empty > .genetics-kicker {
  margin-top: 18px;
  font-size: 11px;
  letter-spacing: 0.12em;
}
.result-empty h2 {
  max-width: 500px;
  margin: 0;
  color: #2b4564;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.025em;
}
.result-empty > p {
  max-width: 520px;
  margin: 8px 0 0;
  color: #7d91aa;
  font-size: 15px;
  line-height: 1.7;
}
.empty-steps {
  display: grid;
  width: 100%;
  gap: 8px;
  margin-top: 21px;
  text-align: left;
}
.empty-steps > div {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e8eef5;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 11px 13px;
  color: #637a95;
  font-size: 13px;
  font-weight: 500;
}
.empty-steps > div > span {
  color: #7295bb;
  font-size: 11px;
  font-weight: 700;
}
@keyframes genetics-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes genetics-shimmer {
  to {
    background-position: -200% 0;
  }
}
@keyframes genetics-enter {
  from {
    opacity: 0;
    translate: 0 10px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
.genetics-intro,
.upload-card,
.variant-card,
.genetics-results {
  animation: genetics-enter 500ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.upload-card {
  animation-delay: 80ms;
}
.variant-card {
  animation-delay: 150ms;
}
.genetics-results {
  animation-delay: 220ms;
}
.result-loading,
.result-empty,
.result-overview,
.findings-card,
.recommendations-card {
  animation: genetics-enter 420ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.result-empty,
.result-overview {
  animation-delay: 280ms;
}
.findings-card {
  animation-delay: 340ms;
}
.recommendations-card {
  animation-delay: 400ms;
}
.finding-item {
  animation: genetics-enter 360ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.finding-item:nth-child(1) {
  animation-delay: 380ms;
}
.finding-item:nth-child(2) {
  animation-delay: 430ms;
}
.finding-item:nth-child(3) {
  animation-delay: 480ms;
}
@media (max-width: 1000px) {
  .genetics-workspace {
    grid-template-columns: 1fr;
  }
  .genetics-inputs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
}
@media (max-width: 700px) {
  .genetics-intro {
    align-items: flex-start;
    padding: 24px;
  }
  .genetics-intro-note {
    width: 180px;
  }
  .genetics-inputs {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .genetics-page {
    gap: 16px;
  }
  .genetics-intro {
    min-height: 0;
    flex-direction: column;
    gap: 18px;
    border-radius: 18px;
    padding: 21px;
  }
  .genetics-intro::after {
    top: -130px;
    right: -130px;
  }
  .genetics-intro h1 {
    font-size: 27px;
  }
  .genetics-intro-copy > p {
    font-size: 13px;
  }
  .genetics-intro-note {
    width: 100%;
    grid-template-columns: 40px 1fr;
    column-gap: 11px;
    padding: 12px 14px;
  }
  .intro-note-icon {
    grid-row: span 3;
  }
  .intro-note-label,
  .genetics-intro-note strong,
  .intro-note-caption {
    margin-top: 0;
  }
  .genetics-card,
  .result-card,
  .result-empty {
    border-radius: 16px;
    padding: 17px;
  }
  .gene-grid {
    gap: 10px;
  }
  .variant-card-footer {
    align-items: stretch;
    flex-direction: column;
  }
  .analyze-button {
    width: 100%;
  }
  .result-overview {
    grid-template-columns: 1fr;
  }
  .result-section-heading {
    align-items: flex-start;
  }
  .result-empty {
    min-height: 360px;
  }
  .result-empty h2 { font-size: 19px; }
  .result-empty > p { font-size: 14px; }
  .empty-steps > div { font-size: 12px; }
  .empty-steps > div > span { font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .genetics-upload-link,
  .analyze-button,
  .genetics-intro-note,
  .genetics-card,
  .genetics-upload-link svg,
  .analyze-button svg,
  .finding-item,
  .empty-dna-icon {
    transition: none;
  }
  .genetics-intro,
  .upload-card,
  .variant-card,
  .genetics-results,
  .result-loading,
  .result-empty,
  .result-overview,
  .findings-card,
  .recommendations-card,
  .finding-item {
    animation: none;
    translate: none;
  }
  .genetics-intro-note:hover,
  .genetics-card:hover,
  .genetics-upload-link:hover,
  .genetics-upload-link:hover svg,
  .analyze-button:hover:not(:disabled),
  .analyze-button:active:not(:disabled),
  .analyze-button:hover:not(:disabled) > svg,
  .result-empty:hover .empty-dna-icon {
    transform: none;
  }
  .analyze-spinner,
  .loading-score,
  .loading-summary,
  .loading-findings {
    animation: none;
  }
}
</style>
