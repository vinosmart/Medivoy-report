<template>
  <div class="family-page">
    <section class="family-intro">
      <div class="family-intro-copy">
        <span class="family-eyebrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20v-7m0 0-5-4m5 4 5-4M7 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm10 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
          </svg>
          Family health
        </span>
        <h1>A more complete picture of your <span class="family-intro-accent">family’s health</span>.</h1>
        <p>
          Keep important family history together and make it easier to discuss
          with your care team.
        </p>
      </div>
      <div class="family-total" aria-label="Family member count">
        <span class="family-total-label">Family members</span>
        <div class="family-total-value">
          <strong>{{ members.length }}</strong>
          <span>{{ members.length === 1 ? "relative" : "relatives" }}</span>
        </div>
        <span class="family-total-note">in your health profile</span>
      </div>
    </section>

    <form class="family-panel family-form" @submit.prevent="addMember">
      <div class="family-panel-heading">
        <div class="family-heading-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <div class="family-heading-copy">
          <span class="family-kicker">Family profile</span>
          <h2>Add a family member</h2>
        </div>
        <button class="family-submit" :disabled="saving" type="submit">
          <svg v-if="!saving" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {{ saving ? "Saving..." : "Add member" }}
        </button>
      </div>

      <div class="family-fields">
        <label class="family-field">
          <span>Name</span>
          <input
            v-model="form.name"
            autocomplete="off"
            placeholder="Enter their name"
            required
          />
        </label>
        <label class="family-field">
          <span>Relationship</span>
          <select v-model="form.relation">
            <option value="">Select relationship</option>
            <option v-for="r in relations" :key="r" :value="r">{{ r }}</option>
          </select>
        </label>
        <label class="family-field">
          <span>Age <em>Optional</em></span>
          <input
            v-model="form.age"
            type="number"
            min="0"
            placeholder="Enter age"
          />
        </label>
        <label class="family-field family-field-wide">
          <span>Known conditions <em>Optional</em></span>
          <input
            v-model="form.conditions"
            placeholder="e.g. Diabetes, hypertension"
          />
          <small>Separate multiple conditions with commas.</small>
        </label>
      </div>
    </form>

    <section class="family-panel family-members">
      <div class="family-list-heading">
        <div>
          <span class="family-kicker">Your family</span>
          <h2>Family members</h2>
        </div>
        <span class="family-count">{{ members.length }} total</span>
      </div>

      <div v-if="loading" class="family-member-grid" aria-label="Loading family members">
        <div v-for="n in 2" :key="n" class="family-skeleton" aria-hidden="true"></div>
      </div>

      <div v-else-if="members.length" class="family-member-grid">
        <article v-for="m in members" :key="m.id" class="member-card">
          <div class="member-card-top">
            <div class="member-identity">
              <span class="member-avatar" aria-hidden="true">
                {{ m.name?.slice(0, 1).toUpperCase() || "?" }}
              </span>
              <div class="member-name-wrap">
                <h3>{{ m.name }}</h3>
                <span class="member-relation">{{ m.relation }}</span>
              </div>
            </div>
            <button
              class="member-remove"
              type="button"
              :aria-label="`Remove ${m.name}`"
              @click="removeMember(m.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
              </svg>
              Remove
            </button>
          </div>

          <div class="member-details">
            <span class="member-age">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7v5l3 2" />
              </svg>
              Age {{ m.age || "—" }}
            </span>
          </div>

          <div class="member-conditions">
            <span class="member-detail-label">Known conditions</span>
            <div class="condition-list">
              <span
                v-for="(c, ci) in splitConditions(m.conditions)"
                :key="ci"
                class="condition-chip"
              >{{ c }}</span>
              <span
                v-if="!splitConditions(m.conditions).length"
                class="condition-empty"
              >None listed</span>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="family-empty">
        <div class="empty-illustration" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="12" r="5" />
            <circle cx="11" cy="21" r="4" />
            <circle cx="37" cy="21" r="4" />
            <path d="M15 39v-3a9 9 0 0 1 18 0v3M3 38v-2a7 7 0 0 1 10-6.3M45 38v-2a7 7 0 0 0-10-6.3" />
          </svg>
        </div>
        <h3>Your family profile starts here</h3>
        <p>
          Add a parent, sibling, or child to keep family health history in one
          place.
        </p>
      </div>
    </section>

    <section v-if="riskConditions.length" class="family-risk">
      <div class="risk-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 3 2.8 19h18.4L12 3Z" />
          <path d="M12 9v4m0 3h.01" />
        </svg>
      </div>
      <div class="risk-copy">
        <h2>Conditions reported across family members</h2>
        <p>
          These conditions appear in multiple family members. Consider discussing
          them with a clinician as part of a hereditary risk assessment.
        </p>
        <div class="risk-tags">
          <span v-for="(c, i) in riskConditions" :key="i">{{ c }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const relations = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Uncle",
  "Aunt",
  "Son",
  "Daughter",
];
const form = reactive({ name: "", relation: "", age: "", conditions: "" });
const members = ref<any[]>([]);
const loading = ref(true);
const saving = ref(false);

const splitConditions = (c: string) =>
  c
    ? c
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

onMounted(async () => {
  try {
    members.value = await api.getFamilyMembers();
  } catch {
    members.value = [];
  } finally {
    loading.value = false;
  }
});

const addMember = async () => {
  if (!form.name) return;
  saving.value = true;
  try {
    const res = await api.addFamilyMember({ ...form });
    members.value.push(res);
    form.name = "";
    form.relation = "";
    form.age = "";
    form.conditions = "";
  } finally {
    saving.value = false;
  }
};

const removeMember = async (id: string) => {
  await api.deleteFamilyMember(id);
  members.value = members.value.filter((m: any) => m.id !== id);
};

const riskConditions = computed(() => {
  const count: Record<string, number> = {};
  for (const m of members.value)
    for (const c of splitConditions(m.conditions)) {
      const k = c.toLowerCase();
      count[k] = (count[k] || 0) + 1;
    }
  return Object.entries(count)
    .filter(([, v]) => v > 1)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));
});
</script>

<style scoped>
.family-page {
  display: grid;
  gap: 22px;
  color: #233b59;
  font-family: Poppins, system-ui, sans-serif;
}
.family-intro {
  position: relative;
  display: flex;
  min-height: 204px;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  overflow: hidden;
  border: 1px solid #e1ebf7;
  border-radius: 22px;
  background: linear-gradient(112deg, #fff 0%, #fff 58%, #f0f6ff 100%);
  padding: 28px 32px;
  box-shadow: 0 12px 32px rgba(37, 75, 120, 0.045);
}
.family-intro::after {
  position: absolute;
  top: -126px;
  right: 132px;
  width: 270px;
  height: 270px;
  border: 1px solid rgba(95, 151, 218, 0.1);
  border-radius: 50%;
  box-shadow: 0 0 0 28px rgba(95, 151, 218, 0.035), 0 0 0 58px rgba(95, 151, 218, 0.025);
  content: "";
  pointer-events: none;
}
.family-intro-copy {
  position: relative;
  z-index: 1;
  max-width: 700px;
}
.family-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #274568;
  border-radius: 999px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 6px 10px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.family-eyebrow svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.family-intro h1 {
  max-width: 650px;
  margin: 15px 0 0;
  color: #1c3656;
  font-size: clamp(27px, 3.2vw, 36px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.04em;
}
.family-intro-accent {
  color: #438cdf;
}
.family-intro-copy > p {
  max-width: 600px;
  margin: 10px 0 0;
  color: #7489a3;
  font-size: 15px;
  line-height: 1.75;
}
.family-total {
  position: relative;
  z-index: 1;
  width: 174px;
  flex: 0 0 auto;
  border: 1px solid rgba(151, 190, 235, 0.22);
  border-radius: 16px;
  background: linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 16px 18px;
  box-shadow: 0 10px 24px rgba(11, 28, 57, 0.16);
  cursor: default;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.family-total:hover,
.family-total:active {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(11, 28, 57, 0.24);
}
.family-total-label {
  display: block;
  color: #a9d2ff;
  font-size: 10px;
  font-weight: 600;
}
.family-total-note {
  display: block;
  color: #c1d4eb;
  font-size: 10px;
  font-weight: 600;
}
.family-total-value {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin: 7px 0 2px;
}
.family-total-value strong {
  color: #fff;
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
}
.family-total-value span {
  color: #d3e2f5;
  font-size: 12px;
  font-weight: 600;
}
.family-panel {
  border: 1px solid #e4ecf5;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 26px rgba(33, 70, 112, 0.035);
}
.family-form {
  padding: 22px 24px 24px;
}
.family-panel-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.family-heading-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #274568;
  border-radius: 13px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.family-form:hover .family-heading-icon {
  transform: translateY(-1px);
  box-shadow: 0 5px 12px rgba(55, 123, 199, 0.1);
}
.family-heading-icon svg,
.family-submit svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}
.family-heading-copy {
  min-width: 0;
  flex: 1;
}
.family-kicker {
  display: block;
  margin-bottom: 3px;
  color: #8a9db5;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.family-heading-copy h2,
.family-list-heading h2 {
  margin: 0;
  color: #263f5e;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.family-submit {
  display: inline-flex;
  min-height: 40px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid #397fca;
  border-radius: 11px;
  background: linear-gradient(135deg, #4a91df, #3478c8);
  padding: 0 15px;
  color: #fff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 5px 12px rgba(55, 123, 199, 0.16);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.family-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  background: linear-gradient(135deg, #397fc9, #2869b5);
  box-shadow: 0 7px 16px rgba(55, 123, 199, 0.22);
}
.family-submit:disabled {
  opacity: 0.65;
  cursor: wait;
}
.family-submit:focus-visible,
.member-remove:focus-visible,
.family-field input:focus-visible,
.family-field select:focus-visible {
  outline: 3px solid rgba(71, 139, 211, 0.24);
  outline-offset: 2px;
}
.family-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.family-field {
  display: grid;
  min-width: 0;
  gap: 7px;
}
.family-field > span {
  color: #526a86;
  font-size: 12px;
  font-weight: 700;
}
.family-field em {
  margin-left: 4px;
  color: #9aabc0;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
}
.family-field input,
.family-field select {
  width: 100%;
  height: 44px;
  border: 1px solid #dfe8f2;
  border-radius: 11px;
  background: #fbfcfe;
  padding: 0 13px;
  color: #2f4968;
  font-family: inherit;
  font-size: 13px;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}
.family-field input::placeholder {
  color: #9aabc0;
}
.family-field input:focus,
.family-field select:focus {
  border-color: #82b4e8;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(71, 139, 211, 0.1);
  outline: none;
}
.family-field select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23748aa5' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.8' viewBox='0 0 24 24'%3E%3Cpath d='m7 10 5 5 5-5'/%3E%3C/svg%3E");
  background-position: right 13px center;
  background-repeat: no-repeat;
  padding-right: 36px;
}
.family-field-wide {
  grid-column: 1 / -1;
}
.family-field small {
  color: #8a9db5;
  font-size: 11px;
  line-height: 1.5;
}
.family-members {
  padding: 22px 24px 24px;
}
.family-list-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.family-count {
  border: 1px solid #e5edf7;
  border-radius: 999px;
  background: #f8faff;
  padding: 5px 10px;
  color: #748aa5;
  font-size: 10px;
  font-weight: 700;
}
.family-member-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}
.member-card {
  min-width: 0;
  border: 1px solid #e5ecf4;
  border-radius: 15px;
  background: linear-gradient(145deg, #fff, #fcfdff);
  padding: 16px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}
.member-card:hover {
  transform: translateY(-2px);
  border-color: #d3e3f5;
  box-shadow: 0 8px 20px rgba(42, 82, 132, 0.07);
}
.member-card-top,
.member-identity {
  display: flex;
  align-items: center;
}
.member-card-top {
  justify-content: space-between;
  gap: 10px;
}
.member-identity {
  min-width: 0;
  gap: 11px;
}
.member-avatar {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #dceafb;
  border-radius: 13px;
  background: linear-gradient(145deg, #eff6ff, #e3efff);
  color: #397cc1;
  font-size: 14px;
  font-weight: 700;
}
.member-name-wrap {
  min-width: 0;
}
.member-name-wrap h3 {
  overflow: hidden;
  margin: 0;
  color: #2b4361;
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.member-relation {
  display: inline-block;
  margin-top: 4px;
  border-radius: 999px;
  background: #f2f6fb;
  padding: 3px 7px;
  color: #7188a3;
  font-size: 10px;
  font-weight: 600;
}
.member-remove {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  padding: 6px 7px;
  color: #8497ad;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
}
.member-remove svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.member-remove:hover {
  border-color: #f3dddd;
  background: #fff8f8;
  color: #bd6262;
}
.member-details {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 0;
  border-top: 1px solid #eef2f7;
  padding-top: 12px;
}
.member-age {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7187a1;
  font-size: 11px;
  font-weight: 500;
}
.member-age svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: #91a5bd;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.member-detail-label {
  display: block;
  margin-bottom: 7px;
  color: #8a9db5;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.condition-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.condition-chip {
  border: 1px solid #e0ebf8;
  border-radius: 999px;
  background: #f5f9ff;
  padding: 4px 8px;
  color: #56779d;
  font-size: 10px;
  font-weight: 600;
}
.condition-empty {
  color: #98a8bb;
  font-size: 11px;
}
.family-skeleton {
  min-height: 176px;
  border: 1px solid #e8eef5;
  border-radius: 15px;
  background: linear-gradient(100deg, #f6f8fb 30%, #edf2f8 50%, #f6f8fb 70%);
  background-size: 200% 100%;
  animation: family-shimmer 1.5s ease-in-out infinite;
}
.family-empty {
  display: grid;
  justify-items: center;
  border: 1px dashed #dbe6f2;
  border-radius: 16px;
  background: linear-gradient(145deg, #fbfdff, #f7faff);
  padding: 34px 20px;
  text-align: center;
}
.empty-illustration {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border: 1px solid #274568;
  border-radius: 20px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.family-empty:hover .empty-illustration {
  transform: translateY(-2px);
  box-shadow: 0 7px 16px rgba(55, 123, 199, 0.1);
}
.empty-illustration svg {
  width: 38px;
  height: 38px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.family-empty h3 {
  margin: 14px 0 0;
  color: #334d6d;
  font-size: 15px;
  font-weight: 700;
}
.family-empty p {
  max-width: 420px;
  margin: 6px 0 0;
  color: #8498b1;
  font-size: 12px;
  line-height: 1.7;
}
.family-risk {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  border: 1px solid #f0e2c6;
  border-radius: 16px;
  background: linear-gradient(110deg, #fffdf8, #fffaf0);
  padding: 18px 20px;
}
.risk-icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #f0dfbd;
  border-radius: 11px;
  background: #fff7e6;
  color: #b88335;
}
.risk-icon svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.risk-copy h2 {
  margin: 1px 0 0;
  color: #765a31;
  font-size: 13px;
  font-weight: 700;
}
.risk-copy p {
  margin: 5px 0 0;
  color: #8a7658;
  font-size: 11px;
  line-height: 1.6;
}
.risk-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.risk-tags span {
  border: 1px solid #f0dfbd;
  border-radius: 999px;
  background: #fff8e9;
  padding: 4px 8px;
  color: #8a6c3e;
  font-size: 10px;
  font-weight: 600;
}
@keyframes family-shimmer {
  to {
    background-position: -200% 0;
  }
}
@keyframes family-enter {
  from {
    opacity: 0;
    translate: 0 10px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
.family-intro,
.family-form,
.family-members,
.family-risk {
  animation: family-enter 500ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.family-form {
  animation-delay: 80ms;
}
.family-members {
  animation-delay: 160ms;
}
.family-risk {
  animation-delay: 240ms;
}
.member-card,
.family-empty {
  animation: family-enter 420ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.member-card:nth-child(1),
.family-empty {
  animation-delay: 220ms;
}
.member-card:nth-child(2) {
  animation-delay: 280ms;
}
.member-card:nth-child(3) {
  animation-delay: 340ms;
}
@media (max-width: 800px) {
  .family-intro {
    align-items: flex-start;
    padding: 24px;
  }
  .family-total {
    width: 150px;
  }
  .family-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .family-member-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .family-page {
    gap: 16px;
  }
  .family-intro {
    min-height: 0;
    flex-direction: column;
    gap: 18px;
    border-radius: 18px;
    padding: 20px;
  }
  .family-intro::after {
    top: -120px;
    right: -120px;
  }
  .family-intro h1 {
    font-size: 26px;
  }
  .family-intro-copy > p {
    font-size: 13px;
  }
  .family-total {
    width: 100%;
    padding: 12px 14px;
  }
  .family-total-value {
    display: inline-flex;
    margin: 5px 7px 0 0;
  }
  .family-total-value strong {
    font-size: 24px;
  }
  .family-total-note {
    display: inline;
  }
  .family-form,
  .family-members {
    border-radius: 17px;
    padding: 17px;
  }
  .family-panel-heading {
    flex-wrap: wrap;
    margin-bottom: 17px;
  }
  .family-submit {
    min-height: 38px;
    margin-left: auto;
    padding: 0 11px;
  }
  .family-fields {
    grid-template-columns: 1fr;
    gap: 13px;
  }
  .family-field-wide {
    grid-column: auto;
  }
  .family-list-heading {
    margin-bottom: 14px;
  }
  .member-card {
    padding: 13px;
  }
  .family-risk {
    padding: 15px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .family-submit,
  .member-card,
  .member-remove,
  .family-heading-icon,
  .empty-illustration,
  .family-total {
    transition: none;
  }
  .family-intro,
  .family-form,
  .family-members,
  .family-risk,
  .member-card,
  .family-empty {
    animation: none;
  }
  .family-form:hover .family-heading-icon,
  .family-empty:hover .empty-illustration,
  .family-submit:hover:not(:disabled),
  .member-card:hover,
  .family-total:hover,
  .family-total:active {
    transform: none;
  }
  .family-skeleton {
    animation: none;
  }
}
</style>
