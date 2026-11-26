<template>
  <div class="space-y-6">
    <PageHeading
      :icon="IconUserCircle"
      title="Your profile"
      description="Review your account information and access your health workspace."
      eyebrow="Account"
    />

    <div v-if="auth.token" class="space-y-6">
      <div class="grid gap-6 xl:grid-cols-3">
        <section
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 xl:col-span-2"
        >
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span
              class="grid size-16 shrink-0 place-items-center rounded-full bg-cyan-50 text-cyan-800 ring-1 ring-inset ring-cyan-100"
            >
              <IconUserCircle :size="34" :stroke-width="1.6" aria-hidden="true" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold uppercase tracking-wide text-cyan-800">
                Account profile
              </p>
              <h2 class="mt-1 truncate text-xl font-semibold text-slate-950">
                {{ displayName }}
              </h2>
              <p class="mt-1 truncate text-sm text-slate-600">
                {{ displayEmail }}
              </p>
            </div>
            <span
              class="w-fit rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900"
            >
              {{ roleLabel }}
            </span>
          </div>

          <dl class="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <div class="rounded-2xl bg-slate-50 p-4">
              <dt class="text-xs font-medium text-slate-500">Account type</dt>
              <dd class="mt-1 text-sm font-semibold text-slate-800">
                {{ roleLabel }}
              </dd>
            </div>
            <div class="rounded-2xl bg-slate-50 p-4">
              <dt class="text-xs font-medium text-slate-500">Account status</dt>
              <dd class="mt-1 text-sm font-semibold text-slate-800">
                Signed in
              </dd>
            </div>
          </dl>
        </section>

        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-base font-semibold text-slate-950">Health workspace</h2>
          <p class="mt-1 text-sm leading-6 text-slate-600">
            Open a section to review your saved health information.
          </p>

          <nav class="mt-4 space-y-2" aria-label="Health workspace">
            <NuxtLink
              to="/nutrition"
              class="flex min-h-12 items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-cyan-100 hover:bg-cyan-50"
            >
              <IconSalad :size="18" :stroke-width="1.8" class="shrink-0 text-cyan-800" aria-hidden="true" />
              <span class="min-w-0 flex-1">Nutrition preferences</span>
              <IconChevronRight :size="17" class="shrink-0 text-slate-400" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink
              to="/family"
              class="flex min-h-12 items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-cyan-100 hover:bg-cyan-50"
            >
              <IconUsersGroup :size="18" :stroke-width="1.8" class="shrink-0 text-cyan-800" aria-hidden="true" />
              <span class="min-w-0 flex-1">Family health</span>
              <IconChevronRight :size="17" class="shrink-0 text-slate-400" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink
              to="/reports"
              class="flex min-h-12 items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-cyan-100 hover:bg-cyan-50"
            >
              <IconFiles :size="18" :stroke-width="1.8" class="shrink-0 text-cyan-800" aria-hidden="true" />
              <span class="min-w-0 flex-1">Health reports</span>
              <IconChevronRight :size="17" class="shrink-0 text-slate-400" aria-hidden="true" />
            </NuxtLink>
          </nav>
        </section>
      </div>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-950">
              Personal health details
            </h2>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              Add optional details to personalize your health and nutrition guidance.
            </p>
          </div>
          <span
            v-if="hasSavedDetails"
            class="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
          >
            Saved profile
          </span>
        </div>

        <p
          v-if="profileLoadError"
          role="alert"
          class="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          {{ profileLoadError }}
          <button
            type="button"
            class="ml-2 font-semibold underline underline-offset-2"
            @click="loadProfile"
          >
            Try again
          </button>
        </p>
        <p
          v-if="profileLoaded && !hasSavedDetails"
          role="status"
          class="mt-5 rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-900"
        >
          No health details saved yet. Add only what you want to share.
        </p>

        <div
          v-if="profileLoading"
          class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          role="status"
          aria-label="Loading saved health details"
        >
          <div
            v-for="field in 5"
            :key="field"
            class="h-[74px] animate-pulse rounded-xl bg-slate-100"
          ></div>
        </div>

        <form v-else class="mt-6 space-y-5" @submit.prevent="saveProfile">
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <label class="grid gap-2 text-sm font-medium text-slate-700">
              <span>Age <span class="font-normal text-slate-500">(optional)</span></span>
              <input
                v-model="profile.age"
                type="number"
                min="0"
                inputmode="numeric"
                placeholder="Age in years"
                class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:bg-white"
              />
            </label>

            <label class="grid gap-2 text-sm font-medium text-slate-700">
              <span>Gender <span class="font-normal text-slate-500">(optional)</span></span>
              <input
                v-model.trim="profile.gender"
                type="text"
                placeholder="Enter if relevant to your care"
                class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:bg-white"
              />
            </label>

            <label class="grid gap-2 text-sm font-medium text-slate-700">
              <span>Health goal</span>
              <ProfessionalSelect
                id="profile-health-goal"
                v-model="profile.goal"
                :options="healthGoalOptions"
                placeholder="Choose a health goal"
              />
            </label>

            <label class="grid gap-2 text-sm font-medium text-slate-700">
              <span>Diet type</span>
              <ProfessionalSelect
                id="profile-diet-type"
                v-model="profile.diet"
                :options="dietTypeOptions"
                placeholder="Choose a diet type"
              />
            </label>

            <label class="grid gap-2 text-sm font-medium text-slate-700">
              <span>Region</span>
              <ProfessionalSelect
                id="profile-health-region"
                v-model="profile.region"
                :options="healthRegionOptions"
                placeholder="Choose a region"
              />
            </label>
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p class="max-w-2xl text-xs leading-5 text-slate-500">
              These details are optional and can be updated at any time.
            </p>
            <button
              type="submit"
              :disabled="profileSaving"
              class="medivoy-primary-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IconLoader2
                v-if="profileSaving"
                :size="17"
                class="animate-spin"
                aria-hidden="true"
              />
              <IconCheck
                v-else-if="profileSaved"
                :size="17"
                aria-hidden="true"
              />
              {{ profileSaving ? "Saving..." : profileSaved ? "Saved" : "Save details" }}
            </button>
          </div>

          <p
            v-if="profileSaveError"
            role="alert"
            class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            {{ profileSaveError }}
          </p>
          <p
            v-if="profileSaved"
            role="status"
            class="text-sm font-medium text-emerald-800"
          >
            Your health details have been saved.
          </p>
        </form>
      </section>
    </div>

    <section
      v-else
      class="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <span
          class="grid size-14 shrink-0 place-items-center rounded-full bg-cyan-50 text-cyan-800 ring-1 ring-inset ring-cyan-100"
        >
          <IconUserCircle :size="30" :stroke-width="1.7" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="text-lg font-semibold text-slate-950">
            Sign in to view your profile
          </h2>
          <p class="mt-1 text-sm leading-6 text-slate-600">
            Your account information will appear here after you sign in.
          </p>
        </div>
        <NuxtLink
          to="/"
          class="medivoy-primary-button inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-900"
        >
          Sign in
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import IconCheck from "@tabler/icons-vue/icons/IconCheck";
import IconChevronRight from "@tabler/icons-vue/icons/IconChevronRight";
import IconFiles from "@tabler/icons-vue/icons/IconFiles";
import IconLoader2 from "@tabler/icons-vue/icons/IconLoader2";
import IconSalad from "@tabler/icons-vue/icons/IconSalad";
import IconUserCircle from "@tabler/icons-vue/icons/IconUserCircle";
import IconUsersGroup from "@tabler/icons-vue/icons/IconUsersGroup";
import { getApiErrorMessage } from "~/utils/apiError";
import {
  dietTypeOptions,
  healthGoalOptions,
  healthRegionOptions,
} from "~/utils/profileOptions";

type HealthProfile = {
  age: string;
  gender: string;
  goal: string;
  diet: string;
  region: string;
};

const auth = useAuthStore();
const api = useMedivoyApi();
const profile = reactive<HealthProfile>({
  age: "",
  gender: "",
  goal: "",
  diet: "",
  region: "",
});
const profileLoading = ref(false);
const profileLoaded = ref(false);
const profileSaving = ref(false);
const profileSaved = ref(false);
const hasSavedDetails = ref(false);
const profileLoadError = ref("");
const profileSaveError = ref("");

const displayName = computed(() => {
  const name = auth.user?.name;
  return typeof name === "string" && name.trim() ? name.trim() : "Your account";
});

const displayEmail = computed(() => {
  const email = auth.user?.email;
  return typeof email === "string" && email.trim()
    ? email.trim()
    : "Email not provided";
});

const roleLabel = computed(() => {
  const role = auth.user?.role;
  if (typeof role !== "string" || !role.trim()) return "Member";

  const labels: Record<string, string> = {
    admin: "Admin",
    doctor: "Clinician",
    patient: "Patient",
  };
  return labels[role.toLowerCase()] ?? role;
});

const profileHasDetails = () =>
  Object.values(profile).some((value) => value.trim().length > 0);

const readProfileValue = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

const loadProfile = async () => {
  profileLoading.value = true;
  profileLoadError.value = "";
  profileLoaded.value = false;
  profileSaved.value = false;

  try {
    const saved: unknown = await api.getProfile();
    const details =
      saved && typeof saved === "object" && !Array.isArray(saved)
        ? (saved as Record<string, unknown>)
        : {};
    profile.age = readProfileValue(details.age);
    profile.gender = readProfileValue(details.gender);
    profile.goal = readProfileValue(details.goal);
    profile.diet = readProfileValue(details.diet);
    profile.region = readProfileValue(details.region);
    hasSavedDetails.value = profileHasDetails();
    profileLoaded.value = true;
  } catch (error) {
    profileLoadError.value = getApiErrorMessage(
      error,
      "We couldn't load your health details. Please try again.",
    );
  } finally {
    profileLoading.value = false;
  }
};

const saveProfile = async () => {
  profileSaving.value = true;
  profileSaved.value = false;
  profileSaveError.value = "";

  try {
    await api.saveProfile({ ...profile });
    profileSaved.value = true;
    hasSavedDetails.value = profileHasDetails();
    profileLoaded.value = true;
  } catch (error) {
    profileSaveError.value = getApiErrorMessage(
      error,
      "We couldn't save your health details. Please try again.",
    );
  } finally {
    profileSaving.value = false;
  }
};

watch(
  profile,
  () => {
    profileSaved.value = false;
  },
  { deep: true },
);

onMounted(loadProfile);
</script>
