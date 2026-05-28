<template>
  <div class="space-y-6">
    <section
      class="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-700 p-6 text-white shadow-xl sm:p-8"
    >
      <div class="max-w-3xl">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200 ring-1 ring-inset ring-white/10"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          AI nutrition guidance
        </span>
        <h3 class="mt-4 text-3xl font-bold sm:text-4xl">
          Personalized diet, vitamin, and habit guidance.
        </h3>
        <p class="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
          Choose your health goal and generate recommendations using your
          profile and latest report data. Family member selection has been
          removed for a cleaner experience.
        </p>
      </div>
    </section>

    <section
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5"
    >
      <div
        class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <h3 class="text-2xl font-bold text-slate-950">Nutrition</h3>
          <p class="text-sm text-slate-500">
            AI-powered personalised guidance based on your health profile and
            medical reports.
          </p>
        </div>
        <div
          v-if="guidance"
          class="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-100"
        >
          Guidance generated successfully.
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <select
          v-model="profile.goal"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
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
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
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
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
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
        class="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          v-if="generating"
          class="h-4 w-4 animate-spin"
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
      <p
        v-if="error"
        class="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
      >
        {{ error }}
      </p>
    </section>

    <div v-if="reportLoading" class="space-y-4 animate-pulse">
      <div class="h-10 rounded-3xl bg-slate-100"></div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="h-48 rounded-3xl bg-slate-100"></div>
        <div class="h-48 rounded-3xl bg-slate-100"></div>
      </div>
      <div class="h-24 rounded-3xl bg-slate-100"></div>
    </div>

    <div v-else-if="guidance" class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span class="h-2 w-2 rounded-full bg-slate-400"></span>
        Guidance for
        <span class="font-semibold text-slate-700">{{
          guidance.subject || "Myself"
        }}</span>
        <span v-if="guidance.sourceReport" class="text-emerald-600"
          >· personalised from {{ guidance.sourceReport }}</span
        >
        <span v-else>· profile-based</span>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
        >
          <p class="font-semibold text-slate-900">Eat more of these</p>
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
          <p class="font-semibold text-slate-900">Reduce or avoid</p>
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
        <p class="font-semibold text-slate-900">
          Recommended vitamins and supplements
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(v, i) in guidance.vitamins"
            :key="i"
            class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100"
            >{{ v }}</span
          >
        </div>
      </div>

      <div
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2"
      >
        <p class="font-semibold text-slate-900">Daily habits</p>
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
const guidance = ref<any | null>(null);
const generating = ref(false);
const reportLoading = ref(false);
const error = ref("");
const profile = reactive({ goal: "", diet: "", region: "" });

onMounted(async () => {
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
