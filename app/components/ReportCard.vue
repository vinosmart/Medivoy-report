<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-xl font-bold">Processing result</h4>
        <p class="text-sm text-slate-500">Live response after upload</p>
      </div>
      <span
        v-if="status === 'processing'"
        class="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
      >
        <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Analysing...
      </span>
      <span
        v-else-if="status === 'done'"
        class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
      >Done</span>
      <span
        v-else-if="status === 'error'"
        class="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
      >Error</span>
    </div>

    <!-- Skeleton while processing or initial loading -->
    <div v-if="status === 'processing' || loading" class="space-y-3 animate-pulse">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="h-24 rounded-2xl bg-slate-100"></div>
        <div class="h-24 rounded-2xl bg-slate-100 sm:col-span-2"></div>
      </div>
      <div class="h-20 rounded-2xl bg-slate-100"></div>
      <div class="h-28 rounded-2xl bg-slate-100"></div>
    </div>

    <div v-else-if="reportError || status === 'error'" class="rounded-2xl bg-rose-50 p-4 text-rose-700 text-sm">
      {{ reportError || 'Failed to process report. Please try uploading again.' }}
    </div>

    <div v-else-if="current" class="space-y-4">
      <!-- Risk score + Summary -->
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="text-xs text-slate-500">Risk score</p>
          <p class="mt-2 text-3xl font-bold" :class="riskColor">
            {{ current.riskScore ?? '-' }}
          </p>
          <p class="text-xs text-slate-400 mt-1">out of 100</p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
          <p class="text-xs text-slate-500">AI summary</p>
          <p class="mt-2 text-sm leading-6 text-slate-700">
            {{ current.summary || current.aiSummary || 'No summary available.' }}
          </p>
        </div>
      </div>

      <!-- Findings with status badges -->
      <div v-if="findings.length" class="rounded-2xl bg-slate-50 p-4">
        <p class="text-sm font-semibold text-slate-700 mb-3">Findings</p>
        <div class="grid gap-2 sm:grid-cols-2">
          <div
            v-for="(f, i) in findings"
            :key="i"
            class="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm border border-slate-200"
          >
            <div>
              <span class="font-medium text-slate-800">{{ f.label }}</span>
              <span class="ml-2 text-slate-500 text-xs">{{ f.value }}</span>
            </div>
            <span
              :class="{
                'bg-rose-100 text-rose-700':   f.status === 'high',
                'bg-blue-100 text-blue-700':   f.status === 'low',
                'bg-emerald-100 text-emerald-700': f.status === 'normal',
              }"
              class="rounded-full px-2 py-0.5 text-xs font-semibold ml-2 shrink-0"
            >{{ f.status }}</span>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="rounded-2xl bg-slate-50 p-4">
        <p class="text-sm font-semibold text-slate-700">Recommendations</p>
        <ul v-if="recommendations.length" class="mt-3 space-y-2 text-sm text-slate-700">
          <li v-for="(rec, i) in recommendations" :key="i">• {{ rec }}</li>
        </ul>
        <p v-else class="mt-3 text-sm text-slate-500">No recommendations yet.</p>
      </div>

      <!-- Raw markers fallback -->
      <div class="rounded-2xl bg-slate-50 p-4">
        <p class="text-sm font-semibold text-slate-700">Markers</p>
        <div v-if="markers.length" class="mt-3 grid gap-2 sm:grid-cols-2">
          <div
            v-for="(m, i) in markers"
            :key="i"
            class="rounded-xl bg-white px-3 py-2 text-sm border border-slate-200"
          >
            {{ m.name }}: <span class="font-medium">{{ m.value }}</span> {{ m.unit }}
          </div>
        </div>
        <p v-else class="mt-3 text-sm text-slate-500">No markers detected in this report.</p>
      </div>

      <p class="text-xs text-slate-400 text-right">Powered by Mistral AI · Not a substitute for medical advice</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  report: any | null
  loading: boolean
  reportError?: string
}>()

const api = useMedivoyApi()

// Internal live copy — updated by polling
const current = ref<any | null>(props.report)
const status = computed(() => current.value?.status || 'processing')

// Sync when parent passes new report (e.g. just after upload)
watch(() => props.report, (val) => {
  if (val) current.value = val
}, { immediate: true })

// Normalised field accessors — handle both old and new field names
const findings = computed(() =>
  current.value?.findings || []
)
const recommendations = computed(() =>
  current.value?.recommendations || []
)
const markers = computed(() =>
  current.value?.markers || current.value?.structuredMarkers || []
)
const riskColor = computed(() => {
  const s = current.value?.riskScore || 0
  if (s >= 60) return 'text-rose-600'
  if (s >= 35) return 'text-amber-600'
  return 'text-emerald-600'
})

// Poll every 3 seconds while status is 'processing'
let pollTimer: ReturnType<typeof setInterval> | null = null

const startPolling = () => {
  if (pollTimer) return
  pollTimer = setInterval(async () => {
    if (!current.value?.id) return
    try {
      const fresh = await api.getReport(current.value.id)
      current.value = fresh
      if (fresh.status !== 'processing') stopPolling()
    } catch {
      stopPolling()
    }
  }, 3000)
}

const stopPolling = () => {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
}

// Start polling when report is first set and still processing
watch(current, (val) => {
  if (val?.status === 'processing') startPolling()
  else stopPolling()
}, { immediate: true })

onUnmounted(() => stopPolling())
</script>