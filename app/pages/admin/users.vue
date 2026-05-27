<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-medivoy-900">Users</h1>
    <div class="bg-white rounded-xl border border-medivoy-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-medivoy-50 text-xs uppercase text-medivoy-600">
          <tr><th class="px-4 py-3 text-left">Email</th><th class="px-4 py-3 text-left">Role</th><th class="px-4 py-3 text-left">Joined</th></tr>
        </thead>
        <tbody class="divide-y divide-medivoy-100">
          <tr v-for="u in users" :key="u.id" class="hover:bg-medivoy-50">
            <td class="px-4 py-3">{{ u.email }}</td>
            <td class="px-4 py-3 capitalize">{{ u.role }}</td>
            <td class="px-4 py-3 text-medivoy-500">{{ u.joined }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin" });
const users = ref([
  { id: 1, email: "doctor@medivoy.com", role: "doctor", joined: "May 27, 2026" },
  { id: 2, email: "patient@medivoy.com", role: "patient", joined: "May 27, 2026" },
]);
</script>
