<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <h2 class="text-lg font-semibold text-medivoy-900">Family Health Intelligence</h2>
    <p class="text-sm text-medivoy-500">Add family members to unlock hereditary risk predictions.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="member in family" :key="member.id" class="bg-white rounded-2xl border border-medivoy-200 p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-medivoy-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-medivoy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          </div>
          <div><p class="text-sm font-semibold text-medivoy-900">{{ member.name }}</p><p class="text-xs text-medivoy-500 capitalize">{{ member.relation }}</p></div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="condition in member.conditions" :key="condition" class="px-2 py-1 rounded-md bg-medivoy-50 text-[11px] font-medium text-medivoy-600 border border-medivoy-100">{{ condition }}</span>
        </div>
      </div>
      <button class="bg-white rounded-2xl border border-dashed border-medivoy-300 p-5 flex flex-col items-center justify-center gap-2 hover:border-medivoy-accent hover:bg-medivoy-50 transition-colors text-medivoy-500 hover:text-medivoy-accent">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        <span class="text-sm font-medium">Add Family Member</span>
      </button>
    </div>
    <div class="bg-white rounded-2xl border border-medivoy-200 p-6">
      <h3 class="text-sm font-semibold text-medivoy-900 mb-3">Predicted Hereditary Risks</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100"><div class="flex items-center gap-3"><div class="w-2 h-2 rounded-full bg-amber-500"></div><span class="text-sm font-medium text-amber-900">Type 2 Diabetes</span></div><span class="text-xs font-semibold text-amber-700">Moderate Risk</span></div>
        <div class="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100"><div class="flex items-center gap-3"><div class="w-2 h-2 rounded-full bg-rose-500"></div><span class="text-sm font-medium text-rose-900">Hypertension</span></div><span class="text-xs font-semibold text-rose-700">High Risk</span></div>
        <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100"><div class="flex items-center gap-3"><div class="w-2 h-2 rounded-full bg-emerald-500"></div><span class="text-sm font-medium text-emerald-900">Heart Disease</span></div><span class="text-xs font-semibold text-emerald-700">Low Risk</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const family = ref([
  { id: "f1", relation: "father", name: "Ramesh K.", conditions: ["Hypertension", "Type 2 Diabetes"] },
  { id: "f2", relation: "mother", name: "Lakshmi K.", conditions: ["Hypothyroidism"] },
  { id: "f3", relation: "sister", name: "Priya K.", conditions: ["Anemia"] },
]);
</script>
