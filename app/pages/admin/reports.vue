<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-medivoy-900">All Reports</h1>
    <div class="bg-white rounded-xl border border-medivoy-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-medivoy-50 text-xs uppercase text-medivoy-600">
          <tr><th class="px-4 py-3 text-left">Title</th><th class="px-4 py-3 text-left">User</th><th class="px-4 py-3 text-left">Status</th><th class="px-4 py-3 text-left">Risk</th></tr>
        </thead>
        <tbody class="divide-y divide-medivoy-100">
          <tr v-for="r in reports" :key="r.id" class="hover:bg-medivoy-50">
            <td class="px-4 py-3">{{ r.title }}</td>
            <td class="px-4 py-3">{{ r.user }}</td>
            <td class="px-4 py-3 capitalize">{{ r.status }}</td>
            <td class="px-4 py-3">{{ r.risk }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin" });
const reports = ref([
  { id: 1, title: "Blood Test May 2026", user: "patient@medivoy.com", status: "completed", risk: 24 },
]);
</script>
