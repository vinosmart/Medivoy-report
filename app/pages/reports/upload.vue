<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div>
      <h3 class="text-2xl font-bold">Upload report</h3>
      <p class="text-slate-500">PDF, image or scan — Medivoy will extract the markers.</p>
    </div>

    <form class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" @submit.prevent="submit">

      <!-- Who is this report for -->
      <div class="space-y-2">
        <p class="text-sm font-semibold text-slate-700">Who is this report for?</p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            @click="forMember = ''"
            :class="['rounded-full px-4 py-2 text-sm font-medium border transition', forMember === '' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500']"
          >Myself</button>
          <button
            type="button"
            v-for="m in familyMembers"
            :key="m.id"
            @click="forMember = m.name"
            :class="['rounded-full px-4 py-2 text-sm font-medium border transition', forMember === m.name ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500']"
          >
            {{ m.name }}
            <span class="opacity-60 ml-1 text-xs">{{ m.relation }}</span>
          </button>
        </div>
        <div v-if="!familyMembers.length" class="flex items-center justify-between rounded-2xl bg-slate-50 border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500">
          <span>No family members yet.</span>
          <NuxtLink to="/family" class="font-semibold text-slate-700 underline underline-offset-2">Add family members →</NuxtLink>
        </div>
        <p class="text-xs text-slate-400">This links the report to the right person so Nutrition guidance is personalised correctly.</p>
      </div>

      <input
        v-model="title"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
        placeholder="Report title (e.g. Annual Blood Test)"
      />
      <select v-model="type" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm">
        <option value="blood">Blood</option>
        <option value="dna">DNA</option>
        <option value="other">Other</option>
      </select>

      <label class="flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-slate-300 px-6 py-8 cursor-pointer hover:border-slate-500 transition gap-2">
        <svg class="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
        </svg>
        <span class="text-sm text-slate-500">{{ fileName || 'Click to select PDF or image' }}</span>
        <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" @change="onFile" />
      </label>

      <button
        :disabled="loading"
        class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >{{ loading ? 'Uploading...' : 'Upload report' }}</button>

      <p v-if="message" class="text-sm" :class="hasError ? 'text-rose-600' : 'text-emerald-600'">{{ message }}</p>
    </form>

    <ReportCard v-if="report" :report="report" :loading="false" :report-error="''" />
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi()
const route = useRoute()

const title = ref('')
const type = ref('blood')
const file = ref<File | null>(null)
const fileName = ref('')
// Pre-select member from query param ?for=Father (comes from Nutrition page amber banner)
const forMember = ref<string>((route.query.for as string) || '')
const message = ref('')
const hasError = ref(false)
const loading = ref(false)
const report = ref<any | null>(null)
const familyMembers = ref<any[]>([])

onMounted(async () => {
  try { familyMembers.value = await api.getFamilyMembers() } catch {}
})

const onFile = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0] || null
  file.value = f
  fileName.value = f?.name || ''
}

const submit = async () => {
  hasError.value = false
  message.value = ''
  if (!file.value) { hasError.value = true; message.value = 'Please select a file.'; return }
  loading.value = true
  report.value = null
  try {
    const fd = new FormData()
    fd.append('file', file.value)
    fd.append('title', title.value || file.value.name)
    fd.append('type', type.value)
    // Always send forMember — empty string means "Myself"
    fd.append('forMember', forMember.value)
    const res = await api.uploadReport(fd)
    report.value = res
    message.value = `Uploaded successfully for ${forMember.value || 'Myself'}.`
  } catch (e: any) {
    hasError.value = true
    message.value = e?.data?.message || e?.message || 'Upload failed.'
  } finally {
    loading.value = false
  }
}
</script>
