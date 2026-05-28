<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <section
      class="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-700 p-6 text-white shadow-xl sm:p-8"
    >
      <div class="flex flex-col gap-3">
        <span
          class="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200 ring-1 ring-inset ring-white/10"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          Upload and assign
        </span>
        <h3 class="text-3xl font-bold sm:text-4xl">Upload report</h3>
        <p class="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          PDF, image or scan — Medivoy will extract the markers and link the
          report to the right person so nutrition and family guidance stay
          personalized.
        </p>
      </div>
    </section>

    <form
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5"
      @submit.prevent="submit"
    >
      <div class="space-y-2">
        <p class="text-sm font-semibold text-slate-700">
          Who is this report for?
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            @click="forMember = ''"
            :class="pillClass(forMember === '')"
          >
            Myself
          </button>
          <button
            type="button"
            v-for="m in familyMembers"
            :key="m.id"
            @click="forMember = m.name"
            :class="pillClass(forMember === m.name)"
          >
            {{ m.name }}
            <span class="ml-1 text-xs opacity-60">{{ m.relation }}</span>
          </button>
        </div>
        <div
          v-if="!familyMembers.length"
          class="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500"
        >
          <span>No family members yet.</span>
          <NuxtLink
            to="/family"
            class="font-semibold text-slate-700 underline underline-offset-2"
            >Add family members →</NuxtLink
          >
        </div>
        <p class="text-xs text-slate-400">
          This links the report to the right person so Nutrition guidance is
          personalised correctly.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <label
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >Report title</label
          >
          <input
            v-model="title"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            placeholder="Annual Blood Test"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >Report type</label
          >
          <select
            v-model="type"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          >
            <option value="blood">Blood</option>
            <option value="dna">DNA</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <label
        class="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-slate-500 hover:bg-white"
      >
        <svg
          class="h-8 w-8 text-slate-400 transition group-hover:text-slate-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <div>
          <p class="text-sm font-semibold text-slate-900">
            {{ fileName || "Click to select PDF or image" }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            Supported: PDF, JPG, JPEG, PNG
          </p>
        </div>
        <input
          type="file"
          class="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          @change="onFile"
        />
      </label>

      <button
        :disabled="loading"
        class="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ loading ? "Uploading..." : "Upload report" }}
      </button>

      <p
        v-if="message"
        class="rounded-xl px-4 py-3 text-sm font-medium"
        :class="
          hasError
            ? 'bg-rose-50 text-rose-700'
            : 'bg-emerald-50 text-emerald-700'
        "
      >
        {{ message }}
      </p>
    </form>

    <ReportCard
      v-if="report"
      :report="report"
      :loading="false"
      :report-error="''"
    />
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const route = useRoute();
const title = ref("");
const type = ref("blood");
const file = ref<File | null>(null);
const fileName = ref("");
const forMember = ref<string>((route.query.for as string) || "");
const message = ref("");
const hasError = ref(false);
const loading = ref(false);
const report = ref<any | null>(null);
const familyMembers = ref<any[]>([]);

const pillClass = (active: boolean) => [
  "rounded-full px-4 py-2 text-sm font-medium border transition",
  active
    ? "bg-slate-950 text-white border-slate-950 shadow-md"
    : "bg-white text-slate-700 border-slate-300 hover:border-slate-500 hover:bg-slate-50",
];

onMounted(async () => {
  try {
    familyMembers.value = await api.getFamilyMembers();
  } catch {
    familyMembers.value = [];
  }
});

const onFile = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0] || null;
  file.value = f;
  fileName.value = f?.name || "";
};

const submit = async () => {
  hasError.value = false;
  message.value = "";
  if (!file.value) {
    hasError.value = true;
    message.value = "Please select a file.";
    return;
  }
  loading.value = true;
  report.value = null;
  try {
    const fd = new FormData();
    fd.append("file", file.value);
    fd.append("title", title.value || file.value.name);
    fd.append("type", type.value);
    fd.append("forMember", forMember.value);
    const res = await api.uploadReport(fd);
    report.value = res;
    message.value = `Uploaded successfully for ${forMember.value || "Myself"}.`;
  } catch (e: any) {
    hasError.value = true;
    message.value = e?.data?.message || e?.message || "Upload failed.";
  } finally {
    loading.value = false;
  }
};
</script>
