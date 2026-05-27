<template>
  <div class="flex flex-col items-end">
    <span :class="['text-xs font-semibold px-3 py-1 rounded-lg', badgeClass]">
      {{ label }}
    </span>
    <span class="text-xs text-medivoy-500 mt-1">Risk Score: {{ score }}/100</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ score: number }>();

const label = computed(() => {
  if (props.score <= 20) return "Low Risk";
  if (props.score <= 40) return "Low-Moderate";
  if (props.score <= 60) return "Moderate";
  if (props.score <= 80) return "High";
  return "Critical";
});

const badgeClass = computed(() => {
  if (props.score <= 20) return "bg-emerald-50 text-emerald-700";
  if (props.score <= 40) return "bg-amber-50 text-amber-700";
  if (props.score <= 60) return "bg-orange-50 text-orange-700";
  if (props.score <= 80) return "bg-rose-50 text-rose-700";
  return "bg-red-100 text-red-800";
});
</script>
