<template>
  <div class="p-4 rounded-xl border" :class="parseSeverityClass(marker.severity)">
    <div class="flex items-center justify-between mb-1">
      <span class="text-sm font-semibold">{{ marker.name }}</span>
      <span class="text-sm font-bold">{{ marker.value }} <span class="text-xs font-normal">{{ marker.unit }}</span></span>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-xs opacity-70">{{ marker.category }}</span>
      <span class="text-xs opacity-70">Ref: {{ marker.referenceRange }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HealthMarker } from "~/types/health";
import { useReportParser } from "~/composables/useReportParser";

const props = defineProps<{ marker: HealthMarker }>();
const { parseSeverityClass } = useReportParser();
</script>
