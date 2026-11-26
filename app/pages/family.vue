<template>
  <div class="space-y-6">
    <PageHeading
      :icon="IconUsersGroup"
      title="Family health history"
      description="Keep family conditions and relationships organized to support more informed conversations with your clinician."
      eyebrow="Family health"
    />

    <form
      @submit.prevent="addMember"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <div class="flex items-center justify-between gap-3">
        <p class="text-base font-semibold text-slate-900">Add family member</p>
        <button
          type="submit"
          :disabled="saving"
          class="medivoy-primary-button inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <IconPlus v-if="!saving" :size="17" aria-hidden="true" />
          {{ saving ? "Saving..." : "Add member" }}
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <label class="space-y-2 text-sm font-medium text-slate-700">
          <span>Name</span>
          <input
            v-model="form.name"
            autocomplete="name"
            placeholder="Family member's name"
            required
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-cyan-700 focus:bg-white"
          />
        </label>
        <label class="space-y-2 text-sm font-medium text-slate-700">
          <span>Relationship</span>
          <ProfessionalSelect
            id="family-relationship"
            v-model="form.relation"
            :options="relations"
            placeholder="Select relationship"
            required
          />
        </label>
        <label class="space-y-2 text-sm font-medium text-slate-700">
          <span>Age</span>
          <input
            v-model="form.age"
            type="number"
            min="0"
            inputmode="numeric"
            placeholder="Age in years"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-cyan-700 focus:bg-white"
          />
        </label>
      </div>

      <label class="block space-y-2 text-sm font-medium text-slate-700">
        <span>Known conditions</span>
        <input
          v-model="form.conditions"
          placeholder="For example, diabetes or hypertension"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-cyan-700 focus:bg-white"
        />
        <span class="block text-xs font-normal text-slate-500">
          Separate conditions with commas.
        </span>
      </label>
    </form>

    <p
      v-if="actionError"
      role="alert"
      class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
    >
      {{ actionError }}
    </p>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <p class="text-base font-semibold text-slate-900">Family members</p>
        <p class="text-sm text-slate-500">{{ members.length }} total</p>
      </div>

      <div v-if="loading" class="space-y-3 animate-pulse">
        <div
          v-for="n in 2"
          :key="n"
          class="h-20 rounded-2xl bg-slate-100"
        ></div>
      </div>

      <div
        v-else-if="loadError"
        class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
      >
        <p role="alert">{{ loadError }}</p>
        <button
          type="button"
          class="mt-3 font-semibold text-cyan-900 underline underline-offset-2"
          @click="loadMembers"
        >
          Try again
        </button>
      </div>

      <div v-else-if="members.length" class="space-y-3">
        <article
          v-for="m in members"
          :key="m.id"
          class="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
        >
          <div
            class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h4 class="text-base font-semibold text-slate-950">
                  {{ m.name }}
                </h4>
                <span
                  class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                  >{{ m.relation }}</span
                >
              </div>
              <p class="mt-1 text-xs text-slate-500">Age: {{ m.age || "-" }}</p>

              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="(c, ci) in splitConditions(m.conditions)"
                  :key="ci"
                  class="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-100"
                  >{{ c }}</span
                >
                <span
                  v-if="!splitConditions(m.conditions).length"
                  class="text-xs text-slate-400"
                  >No conditions listed</span
                >
              </div>
            </div>

            <button
              type="button"
              @click="removeMember(m.id)"
              :disabled="removingId === m.id"
              class="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IconTrash :size="15" class="mr-1 inline" aria-hidden="true" />
              {{ removingId === m.id ? "Removing..." : "Remove" }}
            </button>
          </div>
        </article>
      </div>

      <div v-else class="rounded-2xl bg-slate-50 p-10 text-center">
        <p class="text-sm font-medium text-slate-700">
          No family members added yet.
        </p>
        <p class="mt-2 text-sm text-slate-500">
          Add parents, siblings, or children to improve hereditary screening and
          nutrition guidance.
        </p>
      </div>
    </section>

    <section
      v-if="riskConditions.length"
      class="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm"
    >
      <p class="text-base font-semibold text-amber-900">
        Hereditary risk summary
      </p>
      <p class="mt-2 text-sm text-amber-800">
        These conditions appear in multiple family members and may carry
        elevated hereditary risk:
      </p>
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="(c, i) in riskConditions"
          :key="i"
          class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200"
          >{{ c }}</span
        >
      </div>
      <p class="mt-3 text-xs text-amber-700">
        Consult a clinician for a detailed hereditary risk assessment.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import IconPlus from "@tabler/icons-vue/icons/IconPlus";
import IconTrash from "@tabler/icons-vue/icons/IconTrash";
import IconUsersGroup from "@tabler/icons-vue/icons/IconUsersGroup";
import { getApiErrorMessage } from "~/utils/apiError";

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
const removingId = ref<string | number | null>(null);
const loadError = ref("");
const actionError = ref("");

const splitConditions = (c: string) =>
  c
    ? c
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

const loadMembers = async () => {
  loading.value = true;
  loadError.value = "";
  try {
    members.value = await api.getFamilyMembers();
  } catch (error) {
    members.value = [];
    loadError.value = getApiErrorMessage(
      error,
      "We couldn't load family members. Please try again.",
    );
  } finally {
    loading.value = false;
  }
};

onMounted(loadMembers);

const addMember = async () => {
  if (!form.name.trim() || !form.relation) return;
  actionError.value = "";
  saving.value = true;
  try {
    const res = await api.addFamilyMember({
      ...form,
      name: form.name.trim(),
    });
    members.value.push(res);
    form.name = "";
    form.relation = "";
    form.age = "";
    form.conditions = "";
  } catch (error) {
    actionError.value = getApiErrorMessage(
      error,
      "We couldn't save this family member. Please try again.",
    );
  } finally {
    saving.value = false;
  }
};

const removeMember = async (id: string) => {
  actionError.value = "";
  removingId.value = id;
  try {
    await api.deleteFamilyMember(id);
    members.value = members.value.filter((m: any) => m.id !== id);
  } catch (error) {
    actionError.value = getApiErrorMessage(
      error,
      "We couldn't remove this family member. Please try again.",
    );
  } finally {
    removingId.value = null;
  }
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
