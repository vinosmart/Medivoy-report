<template>
  <div class="space-y-6">
    <PageHeading
      :icon="IconSalad"
      title="Nutrition guidance"
      description="Get practical food and habit recommendations based on your health profile and selected goals."
      eyebrow="Nutrition"
    />

    <section
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5"
    >
      <div
        class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <h3 class="text-xl font-semibold text-slate-950">Personalize your plan</h3>
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
        <label class="space-y-2 text-sm font-medium text-slate-700">
          <span>Health goal</span>
          <ProfessionalSelect
            id="nutrition-goal"
            v-model="profile.goal"
            :options="goalOptions"
            placeholder="Choose a goal"
          />
        </label>
        <label class="space-y-2 text-sm font-medium text-slate-700">
          <span>Diet type</span>
          <ProfessionalSelect
            id="nutrition-diet"
            v-model="profile.diet"
            :options="dietOptions"
            placeholder="Choose a diet"
          />
        </label>
        <label class="space-y-2 text-sm font-medium text-slate-700">
          <span>Region</span>
          <ProfessionalSelect
            id="nutrition-region"
            v-model="profile.region"
            :options="regionOptions"
            placeholder="Choose a region"
          />
        </label>
      </div>

      <button
        @click="generate"
        :disabled="generating"
        class="medivoy-primary-button inline-flex items-center gap-2 rounded-xl bg-cyan-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-900/15 transition hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-cyan-800"
      >
        <IconSparkles v-if="!generating" :size="18" aria-hidden="true" />
        <IconLoader2 v-else :size="18" class="animate-spin" aria-hidden="true" />
        {{ generating ? "Generating..." : "Generate guidance" }}
      </button>
      <p
        v-if="error"
        role="alert"
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
import IconLoader2 from "@tabler/icons-vue/icons/IconLoader2";
import IconSparkles from "@tabler/icons-vue/icons/IconSparkles";
import IconSalad from "@tabler/icons-vue/icons/IconSalad";
import {
  dietTypeOptions,
  healthGoalOptions,
  healthRegionOptions,
} from "~/utils/profileOptions";

const api = useMedivoyApi();
const guidance = ref<any | null>(null);
const generating = ref(false);
const reportLoading = ref(false);
const error = ref("");
const profile = reactive({ goal: "", diet: "", region: "" });
const goalOptions = healthGoalOptions;
const dietOptions = dietTypeOptions;
const regionOptions = healthRegionOptions;

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
