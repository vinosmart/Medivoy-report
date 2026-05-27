<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold text-slate-900">Nutrition</h3>
      <p class="text-sm text-slate-500">
        AI-powered personalised guidance based on your health profile and
        medical reports.
      </p>
    </div>

    <!-- Who is this for -->
    <div
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <p class="font-semibold text-slate-800">Who is this for?</p>
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          @click="selectMember(null)"
          :class="[
            'rounded-full px-4 py-2 text-sm font-medium border transition',
            selectedMember === null
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500',
          ]"
        >
          Myself
        </button>
        <button
          type="button"
          v-for="m in familyMembers"
          :key="m.id"
          @click="selectMember(m)"
          :class="[
            'rounded-full px-4 py-2 text-sm font-medium border transition',
            selectedMember?.id === m.id
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500',
          ]"
        >
          {{ m.name }}
          <span class="opacity-60 ml-1 text-xs">{{ m.relation }}</span>
        </button>
        <NuxtLink
          to="/family"
          class="rounded-full px-4 py-2 text-sm font-medium border border-dashed border-slate-300 text-slate-500 hover:border-slate-500 hover:text-slate-700 transition"
          >+ Add family member</NuxtLink
        >
      </div>

      <!-- Report status for selected person -->
      <div
        v-if="reportLoading"
        class="h-10 rounded-2xl bg-slate-100 animate-pulse"
      ></div>

      <div
        v-else-if="memberReport"
        class="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3"
      >
        <svg
          class="h-4 w-4 text-emerald-600 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="text-sm text-emerald-800">
          <span class="font-semibold">{{ memberReport.title }}</span> found — AI
          will personalise guidance using this report.
        </div>
      </div>

      <div
        v-else
        class="flex items-center justify-between rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3"
      >
        <p class="text-sm text-amber-800">
          No report uploaded for
          <strong>{{
            selectedMember ? selectedMember.name : "yourself"
          }}</strong
          >. Guidance will be based on profile only.
        </p>
        <NuxtLink
          :to="
            selectedMember
              ? `/reports/upload?for=${encodeURIComponent(selectedMember.name)}`
              : '/reports/upload'
          "
          class="ml-4 shrink-0 rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200 transition"
          >Upload report</NuxtLink
        >
      </div>
    </div>

    <!-- Health profile -->
    <div
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <p class="font-semibold text-slate-800">
        Health profile
        <span
          v-if="selectedMember"
          class="ml-2 text-xs font-normal text-slate-500"
          >for {{ selectedMember.name }}</span
        >
      </p>

      <div
        v-if="selectedMember?.conditions"
        class="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm"
      >
        <span class="font-medium text-slate-700">Known conditions:</span>
        <span
          v-for="(c, i) in splitConditions(selectedMember.conditions)"
          :key="i"
          class="rounded-full bg-rose-50 text-rose-700 px-2.5 py-0.5 text-xs font-medium"
          >{{ c }}</span
        >
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <select
          v-model="profile.goal"
          class="rounded-xl border border-slate-300 px-4 py-3 text-sm w-full"
        >
          <option value="">Health goal</option>
          <option value="weight_loss">Weight loss</option>
          <option value="muscle_gain">Muscle gain</option>
          <option value="heart_health">Heart health</option>
          <option value="diabetes_control">Diabetes control</option>
          <option value="longevity">Longevity</option>
          <option value="energy">Energy and focus</option>
        </select>
        <select
          v-model="profile.diet"
          class="rounded-xl border border-slate-300 px-4 py-3 text-sm w-full"
        >
          <option value="">Diet type</option>
          <option value="omnivore">Omnivore</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
          <option value="mediterranean">Mediterranean</option>
        </select>
        <select
          v-model="profile.region"
          class="rounded-xl border border-slate-300 px-4 py-3 text-sm w-full"
        >
          <option value="">Region</option>
          <option value="south_asian">South Asian</option>
          <option value="east_asian">East Asian</option>
          <option value="african">African</option>
          <option value="western">Western</option>
          <option value="middle_eastern">Middle Eastern</option>
        </select>
      </div>

      <button
        @click="generate"
        :disabled="generating"
        class="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 flex items-center gap-2"
      >
        <svg
          v-if="generating"
          class="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
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
        {{ generating ? "Generating..." : "Generate guidance" }}
      </button>
      <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
    </div>

    <!-- Skeleton -->
    <div v-if="generating" class="space-y-4 animate-pulse">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="h-48 rounded-3xl bg-slate-100"></div>
        <div class="h-48 rounded-3xl bg-slate-100"></div>
      </div>
      <div class="h-24 rounded-3xl bg-slate-100"></div>
      <div class="h-32 rounded-3xl bg-slate-100"></div>
    </div>

    <!-- Results -->
    <div v-else-if="guidance" class="space-y-4">
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span class="h-2 w-2 rounded-full bg-slate-400"></span>
        Guidance for
        <span class="font-semibold text-slate-700">{{
          selectedMember ? selectedMember.name : "Myself"
        }}</span>
        <span v-if="memberReport" class="text-emerald-600"
          >· personalised from {{ memberReport.title }}</span
        >
        <span v-else>· profile-based</span>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
        >
          <p class="font-semibold text-slate-800">Eat more of these</p>
          <ul class="space-y-2">
            <li
              v-for="(f, i) in guidance.eat"
              :key="i"
              class="flex items-center gap-2 text-sm text-slate-700"
            >
              <span class="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span
              >{{ f }}
            </li>
          </ul>
        </div>
        <div
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
        >
          <p class="font-semibold text-slate-800">Reduce or avoid</p>
          <ul class="space-y-2">
            <li
              v-for="(f, i) in guidance.avoid"
              :key="i"
              class="flex items-center gap-2 text-sm text-slate-700"
            >
              <span class="h-2 w-2 rounded-full bg-rose-500 shrink-0"></span
              >{{ f }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
      >
        <p class="font-semibold text-slate-800">
          Recommended vitamins and supplements
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(v, i) in guidance.vitamins"
            :key="i"
            class="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium"
            >{{ v }}</span
          >
        </div>
      </div>
      <div
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2"
      >
        <p class="font-semibold text-slate-800">Daily habits</p>
        <ul class="space-y-2">
          <li
            v-for="(h, i) in guidance.habits"
            :key="i"
            class="text-sm text-slate-700"
          >
            • {{ h }}
          </li>
        </ul>
      </div>
      <p class="text-xs text-slate-400 text-right">
        Powered by Mistral AI · Not a substitute for medical advice
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();

const familyMembers = ref<any[]>([]);
const allReports = ref<any[]>([]);
const selectedMember = ref<any | null>(null); // null = Myself
const memberReport = ref<any | null>(null);
const reportLoading = ref(false);

const profile = reactive({ goal: "", diet: "", region: "" });
const guidance = ref<any | null>(null);
const generating = ref(false);
const error = ref("");

const splitConditions = (c: string) =>
  c
    ? c
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

// Find the right report for a given person
// myself  → forMember is null or empty string
// member  → forMember === member.name (exact, case-insensitive)
const findReport = (memberName: string | null): any | null => {
  if (!allReports.value.length) return null;
  if (!memberName) {
    // Myself: report where forMember is null, empty, or "myself"
    return (
      allReports.value.find(
        (r: any) =>
          !r.forMember ||
          r.forMember === "" ||
          r.forMember?.toLowerCase() === "myself",
      ) || null
    );
  }
  return (
    allReports.value.find(
      (r: any) => r.forMember?.toLowerCase() === memberName.toLowerCase(),
    ) || null
  );
};

onMounted(async () => {
  // Load family members and all reports in parallel
  const [members, reports, savedProfile] = await Promise.allSettled([
    api.getFamilyMembers(),
    api.getReports(),
    api.getProfile(),
  ]);

  if (members.status === "fulfilled") familyMembers.value = members.value || [];
  if (reports.status === "fulfilled") allReports.value = reports.value || [];
  if (savedProfile.status === "fulfilled" && savedProfile.value?.goal) {
    profile.goal = savedProfile.value.goal;
    profile.diet = savedProfile.value.diet || "";
    profile.region = savedProfile.value.region || "";
  }

  // Default: Myself, find report for myself
  memberReport.value = findReport(null);
});

const selectMember = (member: any | null) => {
  selectedMember.value = member;
  guidance.value = null;
  error.value = "";
  memberReport.value = findReport(member ? member.name : null);
};

const generate = async () => {
  if (!profile.goal) {
    error.value = "Please select a health goal.";
    return;
  }
  error.value = "";
  generating.value = true;
  try {
    const payload: Record<string, any> = {
      goal: profile.goal,
      diet: profile.diet,
      region: profile.region,
    };

    if (selectedMember.value) {
      payload.memberName = selectedMember.value.name;
      payload.relation = selectedMember.value.relation || "";
      payload.age = selectedMember.value.age || "";
      payload.conditions = selectedMember.value.conditions || "";
    }

    // Attach report extracted text if available for this person
    if (memberReport.value?.extractedText) {
      payload.reportSummary = memberReport.value.extractedText;
    }

    guidance.value = await api.getNutritionGuidance(payload);
    await api.saveProfile({ ...profile });
  } catch (e: any) {
    error.value =
      e?.data?.message || "Failed to get guidance. Please try again.";
  } finally {
    generating.value = false;
  }
};
</script>
