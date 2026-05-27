<template>
  <ClientOnly>
    <div ref="chartRef" style="height: 220px;"></div>
    <template #fallback>
      <div class="h-[220px] bg-medivoy-50 rounded-xl border border-medivoy-100 flex items-center justify-center">
        <p class="text-xs text-medivoy-400">Loading chart...</p>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: { date: string; value: number }[];
  color: string;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: any = null;

async function initChart() {
  if (!chartRef.value || !process.client) return;
  const echarts = await import("echarts");
  chartInstance = echarts.init(chartRef.value);
  updateChart();
  window.addEventListener("resize", handleResize);
}

function updateChart() {
  if (!chartInstance) return;
  chartInstance.setOption({
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#e2e8f0",
      textStyle: { color: "#0f172a", fontSize: 12 },
    },
    grid: { left: 10, right: 10, top: 10, bottom: 0, containLabel: true },
    xAxis: {
      type: "category",
      data: props.data.map((d) => d.date),
      axisLine: { lineStyle: { color: "#e2e8f0" } },
      axisLabel: { color: "#64748b", fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: "#f1f5f9" } },
      axisLabel: { color: "#64748b", fontSize: 11 },
    },
    series: [
      {
        type: "line",
        data: props.data.map((d) => d.value),
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: props.color },
        lineStyle: { width: 3, color: props.color },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: props.color + "30" },
              { offset: 1, color: props.color + "05" },
            ],
          },
        },
      },
    ],
  });
}

function handleResize() {
  chartInstance?.resize();
}

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  chartInstance?.dispose();
  chartInstance = null;
});

watch(() => props.data, updateChart, { deep: true });
</script>
