<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-medivoy-900">Admin Overview</h1>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl border border-medivoy-200 p-5">
        <p class="text-xs text-medivoy-500 uppercase">Total Users</p>
        <p class="text-2xl font-bold text-medivoy-900 mt-1">12</p>
      </div>
      <div class="bg-white rounded-xl border border-medivoy-200 p-5">
        <p class="text-xs text-medivoy-500 uppercase">Reports Today</p>
        <p class="text-2xl font-bold text-medivoy-900 mt-1">3</p>
      </div>
      <div class="bg-white rounded-xl border border-medivoy-200 p-5">
        <p class="text-xs text-medivoy-500 uppercase">AI Analyses</p>
        <p class="text-2xl font-bold text-medivoy-900 mt-1">47</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin" });
</script>
