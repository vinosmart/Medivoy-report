<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold text-slate-900">Family Health</h3>
      <p class="text-sm text-slate-500">
        Track hereditary conditions and health history across your family.
      </p>
    </div>

    <form
      @submit.prevent="addMember"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <p class="font-semibold text-slate-800">Add family member</p>
      <div class="grid gap-4 sm:grid-cols-3">
        <input
          v-model="form.name"
          placeholder="Name"
          class="rounded-xl border border-slate-300 px-4 py-3 text-sm w-full"
        />
        <select
          v-model="form.relation"
          class="rounded-xl border border-slate-300 px-4 py-3 text-sm w-full"
        >
          <option value="">Relation</option>
          <option v-for="r in relations" :key="r" :value="r">{{ r }}</option>
        </select>
        <input
          v-model="form.age"
          type="number"
          placeholder="Age"
          class="rounded-xl border border-slate-300 px-4 py-3 text-sm w-full"
        />
      </div>
      <input
        v-model="form.conditions"
        placeholder="Known conditions (e.g. Diabetes, Hypertension)"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
      />
      <button
        :disabled="saving"
        class="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {{ saving ? "Saving..." : "Add Member" }}
      </button>
    </form>

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="font-semibold text-slate-800 mb-4">Family members</p>
      <div v-if="loading" class="space-y-3 animate-pulse">
        <div
          v-for="n in 2"
          :key="n"
          class="h-16 rounded-2xl bg-slate-100"
        ></div>
      </div>
      <div v-else-if="members.length" class="space-y-3">
        <div
          v-for="m in members"
          :key="m.id"
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 p-4 gap-3"
        >
          <div>
            <p class="font-semibold text-slate-900">
              {{ m.name }}
              <span class="text-xs text-slate-500 font-normal ml-1">{{
                m.relation
              }}</span>
            </p>
            <p class="text-xs text-slate-500 mt-1">Age: {{ m.age || "—" }}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="(c, ci) in splitConditions(m.conditions)"
                :key="ci"
                class="rounded-full bg-rose-50 text-rose-700 px-3 py-1 text-xs font-medium"
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
            class="rounded-xl border border-rose-200 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 self-start"
          >
            Remove
          </button>
        </div>
      </div>
      <div v-else class="py-12 text-center text-slate-400 text-sm">
        No family members added yet.
      </div>
    </div>

    <div
      v-if="riskConditions.length"
      class="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm space-y-3"
    >
      <p class="font-semibold text-amber-800">Hereditary risk summary</p>
      <p class="text-sm text-amber-700">
        These conditions appear in multiple family members and may carry
        elevated hereditary risk:
      </p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span
          v-for="(c, i) in riskConditions"
          :key="i"
          class="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold"
          >{{ c }}</span
        >
      </div>
      <p class="text-xs text-amber-600 mt-2">
        Consult a clinician for a detailed hereditary risk assessment.
      </p>
    </div>
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
