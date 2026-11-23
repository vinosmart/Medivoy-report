<template>
  <div class="nutrition-page">
    <section class="nutrition-intro">
      <div class="nutrition-intro-copy">
        <span class="nutrition-eyebrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 4C11 4 5 7.5 5 14a6 6 0 0 0 6 6c6.5 0 9-7 9-16Z" />
            <path d="M4 21c3-5 7-8 12-11" />
          </svg>
          Nutrition guidance
        </span>
        <h1>Small choices. <span :class="['nutrition-heading-accent', { 'nutrition-heading-typewriter-active': animateNutritionTitle }]">A healthier routine.</span></h1>
        <p>
          Get personalized food, vitamin, and habit guidance using your health
          goal, preferences, and available report data.
        </p>
      </div>
      <aside class="nutrition-highlight">
        <span class="highlight-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
            <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
          </svg>
        </span>
        <span class="highlight-label">Personalized for you</span>
        <strong>Guidance shaped by your profile</strong>
        <span class="highlight-note">Goal · diet · available report data</span>
      </aside>
    </section>

    <section class="nutrition-panel" aria-labelledby="nutrition-preferences-title">
      <div class="nutrition-panel-heading">
        <div class="nutrition-heading-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 7h16M4 17h16" />
            <circle cx="9" cy="7" r="2" />
            <circle cx="15" cy="17" r="2" />
          </svg>
        </div>
        <div class="nutrition-heading-copy">
          <span class="nutrition-kicker">Your preferences</span>
          <h2 id="nutrition-preferences-title">Personalize your guidance</h2>
          <p>Choose a goal and preferences to shape your recommendations.</p>
        </div>
        <div v-if="guidance && !error" class="nutrition-success" role="status">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12 4 4L19 6" />
          </svg>
          Guidance ready
        </div>
      </div>

      <div class="nutrition-fields">
        <label class="nutrition-field">
          <span>Health goal</span>
          <select v-model="profile.goal">
            <option value="">Choose your goal</option>
            <option value="weight_loss">Weight loss</option>
            <option value="muscle_gain">Muscle gain</option>
            <option value="heart_health">Heart health</option>
            <option value="diabetes_control">Diabetes control</option>
            <option value="longevity">Longevity</option>
            <option value="energy">Energy and focus</option>
          </select>
        </label>
        <label class="nutrition-field">
          <span>Diet preference</span>
          <select v-model="profile.diet">
            <option value="">Choose a diet</option>
            <option value="omnivore">Omnivore</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="mediterranean">Mediterranean</option>
          </select>
        </label>
        <label class="nutrition-field">
          <span>Region</span>
          <select v-model="profile.region">
            <option value="">Choose a region</option>
            <option value="south_asian">South Asian</option>
            <option value="east_asian">East Asian</option>
            <option value="african">African</option>
            <option value="western">Western</option>
            <option value="middle_eastern">Middle Eastern</option>
          </select>
        </label>
      </div>

      <div class="nutrition-panel-footer">
        <p>Recommendations are based on the information available in your profile.</p>
        <button
          class="nutrition-submit"
          type="button"
          :disabled="generating"
          @click="generate"
        >
          <svg v-if="generating" class="nutrition-spinner" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 1 9 9" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.6-6.4-2.1 2.1m-6.6 6.6-2.1 2.1m0-10.8 2.1 2.1m6.6 6.6 2.1 2.1" />
          </svg>
          {{ generating ? "Generating guidance..." : "Generate guidance" }}
        </button>
      </div>

      <p v-if="error" class="nutrition-error" role="alert">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5m0 3h.01" />
        </svg>
        {{ error }}
      </p>
    </section>

    <section v-if="reportLoading" class="guidance-loading" aria-label="Generating recommendations">
      <div class="loading-heading"></div>
      <div class="loading-grid">
        <div class="loading-card"></div>
        <div class="loading-card"></div>
      </div>
      <div class="loading-card loading-wide"></div>
    </section>

    <section v-else-if="guidance" class="guidance-results" aria-label="Nutrition recommendations">
      <div class="guidance-context">
        <span class="context-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3v18M3 12h18" />
            <circle cx="12" cy="12" r="8" />
          </svg>
        </span>
        <div class="context-copy">
          <span class="nutrition-kicker">Your nutrition plan</span>
          <p>
            Prepared for <strong>{{ guidance.subject || "Myself" }}</strong>
            <span v-if="guidance.sourceReport"> · Based on {{ guidance.sourceReport }}</span>
            <span v-else> · Based on your profile</span>
          </p>
        </div>
      </div>

      <div class="recommendation-grid">
        <article class="recommendation-card eat-card">
          <div class="recommendation-heading">
            <span class="recommendation-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M20 4C11 4 5 7.5 5 14a6 6 0 0 0 6 6c6.5 0 9-7 9-16Z" />
                <path d="M4 21c3-5 7-8 12-11" />
              </svg>
            </span>
            <div>
              <span class="recommendation-kicker">Food choices</span>
              <h3>Enjoy more often</h3>
            </div>
          </div>
          <ul class="recommendation-list">
            <li v-for="(food, i) in guidance.eat" :key="i">
              <span class="list-marker" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>
              </span>
              {{ food }}
            </li>
          </ul>
        </article>

        <article class="recommendation-card avoid-card">
          <div class="recommendation-heading">
            <span class="recommendation-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3v18M3 12h18" />
                <circle cx="12" cy="12" r="8.5" />
              </svg>
            </span>
            <div>
              <span class="recommendation-kicker">Mindful choices</span>
              <h3>Reduce or avoid</h3>
            </div>
          </div>
          <ul class="recommendation-list">
            <li v-for="(food, i) in guidance.avoid" :key="i">
              <span class="list-marker" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M5 12h14" /></svg>
              </span>
              {{ food }}
            </li>
          </ul>
        </article>
      </div>

      <article class="recommendation-card vitamins-card">
        <div class="recommendation-heading">
          <span class="recommendation-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M8 4h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8Zm0 8h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8Z" />
              <path d="M12 4v8m0 0v8" />
            </svg>
          </span>
          <div>
            <span class="recommendation-kicker">Nutrient support</span>
            <h3>Vitamins and supplements</h3>
          </div>
        </div>
        <div class="vitamin-list">
          <span v-for="(vitamin, i) in guidance.vitamins" :key="i">{{ vitamin }}</span>
        </div>
      </article>

      <article class="recommendation-card habits-card">
        <div class="recommendation-heading">
          <span class="recommendation-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </span>
          <div>
            <span class="recommendation-kicker">Everyday wellness</span>
            <h3>Daily habits</h3>
          </div>
        </div>
        <ul class="habit-list">
          <li v-for="(habit, i) in guidance.habits" :key="i">
            <span>{{ String(i + 1).padStart(2, "0") }}</span>
            {{ habit }}
          </li>
        </ul>
      </article>

      <p class="nutrition-disclaimer">
        AI-generated guidance · Not a substitute for professional medical advice
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const guidance = ref<any | null>(null);
const generating = ref(false);
const reportLoading = ref(false);
const error = ref("");
const animateNutritionTitle = ref(false);
const profile = reactive({ goal: "", diet: "", region: "" });

onMounted(async () => {
  animateNutritionTitle.value = true;
  const saved = await api.getProfile().catch(() => null);
  if (saved?.goal) {
    profile.goal = saved.goal || "";
    profile.diet = saved.diet || "";
    profile.region = saved.region || "";
  }
});

const generate = async () => {
  if (!profile.goal) {
    error.value = "Please select a health goal.";
    return;
  }
  error.value = "";
  generating.value = true;
  reportLoading.value = true;
  try {
    const reports = await api.getReports().catch(() => []);
    const latest =
      reports.find((r: any) => (r.forMember ? true : true)) || null;
    const payload: Record<string, any> = {
      ...profile,
      reportSummary: latest?.ocrText || latest?.aiSummary || "",
      sourceReport: latest?.title || "",
    };
    guidance.value = await api.getNutritionGuidance(payload);
    await api.saveProfile({ ...profile });
  } catch (e: any) {
    error.value =
      e?.data?.message || "Failed to get guidance. Please try again.";
  } finally {
    generating.value = false;
    reportLoading.value = false;
  }
};
</script>

<style scoped>
.nutrition-page {
  display: grid;
  gap: 22px;
  color: #233b59;
  font-family: Poppins, system-ui, sans-serif;
}
.nutrition-intro {
  position: relative;
  display: flex;
  min-height: 220px;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  overflow: hidden;
  border: 1px solid #e1ebf7;
  border-radius: 22px;
  background: linear-gradient(112deg, #fff 0%, #fff 58%, #f0f6ff 100%);
  padding: 30px 34px;
  box-shadow: 0 12px 32px rgba(37, 75, 120, 0.045);
}
.nutrition-intro::after {
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
.nutrition-intro-copy {
  position: relative;
  z-index: 1;
  max-width: 720px;
}
.nutrition-eyebrow {
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
.nutrition-eyebrow svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.nutrition-intro h1 {
  max-width: 700px;
  margin: 16px 0 0;
  color: #1c3656;
  font-size: clamp(28px, 3.2vw, 38px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.04em;
}
.nutrition-heading-accent {
  color: #438cdf;
}
.nutrition-heading-typewriter-active {
  display: inline-block;
  max-width: 0;
  overflow: hidden;
  vertical-align: bottom;
  white-space: nowrap;
  animation: nutrition-typewriter 1.4s steps(20, end) 180ms forwards;
}
.nutrition-intro-copy > p {
  max-width: 650px;
  margin: 12px 0 0;
  color: #7489a3;
  font-size: 15px;
  line-height: 1.75;
}
.nutrition-highlight {
  position: relative;
  z-index: 1;
  display: grid;
  width: 218px;
  flex: 0 0 auto;
  justify-items: start;
  border: 1px solid rgba(151, 190, 235, 0.22);
  border-radius: 17px;
  background: linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 17px;
  box-shadow: 0 10px 24px rgba(11, 28, 57, 0.16);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.nutrition-highlight:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(11, 28, 57, 0.19);
}
.highlight-icon,
.nutrition-heading-icon,
.recommendation-icon,
.context-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
}
.highlight-icon {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(169, 210, 255, 0.26);
  border-radius: 12px;
  background: rgba(109, 176, 255, 0.14);
  color: #b7dcff;
}
.highlight-icon svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.highlight-label {
  margin-top: 12px;
  color: #a9d2ff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.nutrition-highlight strong {
  margin-top: 4px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}
.highlight-note {
  margin-top: 6px;
  color: #c1d4eb;
  font-size: 10px;
  line-height: 1.5;
}
.nutrition-panel,
.recommendation-card {
  border: 1px solid #e4ecf5;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 26px rgba(33, 70, 112, 0.035);
}
.nutrition-panel {
  padding: 24px;
}
.nutrition-panel-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 22px;
}
.nutrition-heading-icon {
  width: 46px;
  height: 46px;
  border: 1px solid #274568;
  border-radius: 14px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.nutrition-panel:hover .nutrition-heading-icon {
  transform: translateY(-1px);
  box-shadow: 0 5px 12px rgba(55, 123, 199, 0.1);
}
.nutrition-heading-icon svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
}
.nutrition-heading-copy {
  min-width: 0;
  flex: 1;
}
.nutrition-kicker {
  display: block;
  margin-bottom: 4px;
  color: #8a9db5;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.nutrition-heading-copy h2 {
  margin: 0;
  color: #263f5e;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.025em;
}
.nutrition-heading-copy p {
  margin: 4px 0 0;
  color: #7d91aa;
  font-size: 12px;
  line-height: 1.6;
}
.nutrition-success {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  border: 1px solid #d9eee4;
  border-radius: 999px;
  background: #f3fbf7;
  padding: 8px 11px;
  color: #3c8666;
  font-size: 11px;
  font-weight: 600;
  animation: nutrition-enter 360ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.nutrition-success svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.nutrition-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}
.nutrition-field {
  display: grid;
  min-width: 0;
  gap: 8px;
}
.nutrition-field > span {
  color: #526a86;
  font-size: 12px;
  font-weight: 700;
}
.nutrition-field select {
  width: 100%;
  height: 48px;
  appearance: none;
  border: 1px solid #dfe8f2;
  border-radius: 12px;
  background-color: #fbfcfe;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23748aa5' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.8' viewBox='0 0 24 24'%3E%3Cpath d='m7 10 5 5 5-5'/%3E%3C/svg%3E");
  background-position: right 15px center;
  background-repeat: no-repeat;
  padding: 0 42px 0 14px;
  color: #304a69;
  font-family: inherit;
  font-size: 13px;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}
.nutrition-field select:focus-visible {
  border-color: #82b4e8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(71, 139, 211, 0.12);
  outline: none;
}
.nutrition-panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 20px;
  border-top: 1px solid #edf2f7;
  padding-top: 18px;
}
.nutrition-panel-footer p {
  margin: 0;
  color: #8498b1;
  font-size: 11px;
  line-height: 1.6;
}
.nutrition-submit {
  display: inline-flex;
  min-height: 46px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid #397fca;
  border-radius: 12px;
  background: linear-gradient(135deg, #4a91df, #3478c8);
  padding: 0 17px;
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 5px 12px rgba(55, 123, 199, 0.16);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.nutrition-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  background: linear-gradient(135deg, #397fc9, #2869b5);
  box-shadow: 0 7px 16px rgba(55, 123, 199, 0.22);
}
.nutrition-submit:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
}
.nutrition-submit:disabled {
  opacity: 0.65;
  cursor: wait;
}
.nutrition-submit:focus-visible {
  outline: 3px solid rgba(71, 139, 211, 0.28);
  outline-offset: 3px;
}
.nutrition-submit > svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.18s ease;
}
.nutrition-submit:hover:not(:disabled) > svg {
  transform: translateY(-1px) scale(1.05);
}
.nutrition-spinner {
  animation: nutrition-spin 0.9s linear infinite;
}
.nutrition-error {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 16px 0 0;
  border: 1px solid #f1dede;
  border-radius: 11px;
  background: #fff8f8;
  padding: 11px 13px;
  color: #a64e4e;
  font-size: 12px;
  font-weight: 500;
  animation: nutrition-enter 360ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.nutrition-error svg {
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.guidance-loading {
  display: grid;
  gap: 14px;
}
.loading-heading,
.loading-card {
  border: 1px solid #e8eef5;
  border-radius: 16px;
  background: linear-gradient(100deg, #f6f8fb 30%, #edf2f8 50%, #f6f8fb 70%);
  background-size: 200% 100%;
  animation: nutrition-shimmer 1.5s ease-in-out infinite;
}
.loading-heading {
  width: 45%;
  height: 58px;
}
.loading-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.loading-card {
  min-height: 190px;
}
.loading-wide {
  min-height: 120px;
}
.guidance-results {
  display: grid;
  gap: 15px;
}
.guidance-context {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e4ecf5;
  border-radius: 16px;
  background: linear-gradient(105deg, #fff, #f8fbff);
  padding: 15px 18px;
}
.context-icon {
  width: 38px;
  height: 38px;
  border: 1px solid #dceafb;
  border-radius: 12px;
  background: #eff6ff;
  color: #4384ca;
}
.context-icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.context-copy p {
  margin: 0;
  color: #7187a1;
  font-size: 12px;
  line-height: 1.6;
}
.context-copy strong {
  color: #294767;
  font-weight: 700;
}
.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
}
.recommendation-card {
  min-width: 0;
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.recommendation-card:hover {
  transform: translateY(-2px);
  border-color: #d3e3f5;
  box-shadow: 0 12px 26px rgba(42, 82, 132, 0.075);
}
.recommendation-heading {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 16px;
}
.recommendation-icon {
  width: 40px;
  height: 40px;
  border: 1px solid #e0eaf4;
  border-radius: 13px;
  background: #f6f9fd;
  color: #6d8daf;
}
.recommendation-icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.eat-card .recommendation-icon {
  border-color: #dceee4;
  background: #f1faf5;
  color: #579875;
}
.avoid-card .recommendation-icon {
  border-color: #f0e2d9;
  background: #fff8f4;
  color: #bd8065;
}
.recommendation-kicker {
  display: block;
  margin-bottom: 3px;
  color: #8a9db5;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.recommendation-heading h3 {
  margin: 0;
  color: #2b4564;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.recommendation-list,
.habit-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.recommendation-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #5e748f;
  font-size: 13px;
  line-height: 1.65;
}
.list-marker {
  display: grid;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  place-items: center;
  margin-top: 1px;
  border-radius: 50%;
  background: #eef7f1;
  color: #579875;
}
.avoid-card .list-marker {
  background: #fff3ed;
  color: #bd8065;
}
.list-marker svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.vitamin-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.vitamin-list span {
  border: 1px solid #dceafb;
  border-radius: 999px;
  background: #f4f8ff;
  padding: 7px 11px;
  color: #4c7198;
  font-size: 11px;
  font-weight: 600;
  transition: transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}
.vitamin-list span:hover {
  transform: translateY(-1px);
  border-color: #c9ddf5;
  background: #edf5ff;
}
.habit-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.habit-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid #edf1f6;
  border-radius: 12px;
  background: #fbfcfe;
  padding: 11px 12px;
  color: #5e748f;
  font-size: 12px;
  line-height: 1.6;
}
.habit-list li > span {
  color: #7295bb;
  font-size: 10px;
  font-weight: 700;
}
.nutrition-disclaimer {
  margin: 0;
  color: #91a1b5;
  font-size: 10px;
  text-align: right;
}
@keyframes nutrition-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes nutrition-shimmer {
  to {
    background-position: -200% 0;
  }
}
@keyframes nutrition-enter {
  from {
    opacity: 0;
    translate: 0 10px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
@keyframes nutrition-typewriter {
  to {
    max-width: 100%;
  }
}
.nutrition-intro,
.nutrition-panel,
.guidance-loading,
.guidance-results {
  animation: nutrition-enter 500ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.nutrition-panel {
  animation-delay: 80ms;
}
.guidance-loading,
.guidance-results {
  animation-delay: 160ms;
}
.guidance-context,
.recommendation-card,
.nutrition-disclaimer {
  animation: nutrition-enter 420ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.recommendation-card.eat-card {
  animation-delay: 220ms;
}
.recommendation-card.avoid-card {
  animation-delay: 280ms;
}
.recommendation-card.vitamins-card {
  animation-delay: 340ms;
}
.recommendation-card.habits-card {
  animation-delay: 400ms;
}
.nutrition-disclaimer {
  animation-delay: 460ms;
}
@media (max-width: 800px) {
  .nutrition-intro {
    align-items: flex-start;
    padding: 25px;
  }
  .nutrition-highlight {
    width: 190px;
  }
  .nutrition-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .nutrition-fields .nutrition-field:first-child {
    grid-column: 1 / -1;
  }
  .recommendation-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .nutrition-page {
    gap: 16px;
  }
  .nutrition-intro {
    min-height: 0;
    flex-direction: column;
    gap: 18px;
    border-radius: 18px;
    padding: 21px;
  }
  .nutrition-intro::after {
    top: -130px;
    right: -130px;
  }
  .nutrition-intro h1 {
    font-size: 27px;
  }
  .nutrition-intro-copy > p {
    font-size: 13px;
  }
  .nutrition-highlight {
    width: 100%;
    padding: 13px 15px;
  }
  .nutrition-panel {
    border-radius: 17px;
    padding: 18px;
  }
  .nutrition-panel-heading {
    flex-wrap: wrap;
    margin-bottom: 18px;
  }
  .nutrition-heading-copy h2 {
    font-size: 17px;
  }
  .nutrition-heading-copy p {
    font-size: 11px;
  }
  .nutrition-success {
    margin-left: 58px;
  }
  .nutrition-fields {
    grid-template-columns: 1fr;
    gap: 13px;
  }
  .nutrition-fields .nutrition-field:first-child {
    grid-column: auto;
  }
  .nutrition-panel-footer {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }
  .nutrition-submit {
    width: 100%;
  }
  .recommendation-card {
    border-radius: 17px;
    padding: 17px;
  }
  .habit-list {
    grid-template-columns: 1fr;
  }
  .nutrition-disclaimer {
    text-align: left;
  }
}
@media (prefers-reduced-motion: reduce) {
  .nutrition-submit,
  .nutrition-highlight,
  .nutrition-heading-icon,
  .nutrition-submit > svg,
  .recommendation-card,
  .vitamin-list span {
    transition: none;
  }
  .nutrition-intro,
  .nutrition-panel,
  .guidance-loading,
  .guidance-results,
  .guidance-context,
  .recommendation-card,
  .nutrition-disclaimer,
  .nutrition-success,
  .nutrition-error {
    animation: none;
    translate: none;
  }
  .nutrition-highlight:hover,
  .nutrition-panel:hover .nutrition-heading-icon,
  .nutrition-submit:hover:not(:disabled),
  .nutrition-submit:active:not(:disabled),
  .nutrition-submit:hover:not(:disabled) > svg,
  .recommendation-card:hover,
  .vitamin-list span:hover {
    transform: none;
  }
  .nutrition-spinner,
  .loading-heading,
  .loading-card {
    animation: none;
  }
  .nutrition-heading-typewriter-active {
    max-width: none;
    animation: none;
  }
}
</style>
