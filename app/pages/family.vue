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
          Family health intelligence
        </span>
        <h3 class="mt-4 text-3xl font-bold sm:text-4xl">
          Track hereditary conditions and health history across your family.
        </h3>
        <p class="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
          Add family members, list known conditions, and surface recurring risks
          that may need preventive screening.
        </p>
      </div>
    </section>

    <form
      @submit.prevent="addMember"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <div class="flex items-center justify-between gap-3">
        <p class="text-base font-semibold text-slate-900">Add family member</p>
        <button
          :disabled="saving"
          class="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {{ saving ? "Saving..." : "Add Member" }}
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <input
          v-model="form.name"
          placeholder="Name"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        />
        <select
          v-model="form.relation"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        >
          <option value="">Relation</option>
          <option v-for="r in relations" :key="r" :value="r">{{ r }}</option>
        </select>
        <input
          v-model="form.age"
          type="number"
          min="0"
          placeholder="Age"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        />
      </div>

      <input
        v-model="form.conditions"
        placeholder="Known conditions (e.g. Diabetes, Hypertension)"
        class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
      />
      <p class="text-xs text-slate-400">
        Separate conditions with commas. These will be used for hereditary risk
        summaries.
      </p>
    </form>

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
              <p class="mt-1 text-xs text-slate-500">Age: {{ m.age || "—" }}</p>

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
              @click="removeMember(m.id)"
              class="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              Remove
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
