<template>
  <div class="w-full space-y-6">
    <PageHeading
      :icon="IconFileUpload"
      title="Upload a health report"
      description="Add a PDF, image, or scan to your record and choose who the report belongs to."
      eyebrow="Health records"
    >
      <template #actions>
        <button
          type="button"
          :disabled="loading"
          aria-controls="report-file"
          class="medivoy-primary-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-800 bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:border-cyan-900 hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          @click="openFilePicker"
        >
          <IconUpload :size="18" aria-hidden="true" />
          {{ fileName ? "Change file" : "Choose a report" }}
        </button>
      </template>
    </PageHeading>

    <form
      class="upload-form space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7"
      @submit.prevent="submit"
    >
      <fieldset class="space-y-3">
        <legend class="text-sm font-semibold text-slate-700">
          Who is this report for?
        </legend>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            @click="forMember = ''"
            :aria-pressed="forMember === ''"
            :class="pillClass(forMember === '')"
          >
            Myself
          </button>
          <button
            type="button"
            v-for="m in familyMembers"
            :key="m.id"
            @click="forMember = m.name"
            :aria-pressed="forMember === m.name"
            :class="pillClass(forMember === m.name)"
          >
            {{ m.name }}
            <span class="ml-1 text-xs opacity-60">{{ m.relation }}</span>
          </button>
        </div>
        </fieldset>

        <div
          v-if="!familyMembers.length"
          class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>No family members yet.</span>
          <NuxtLink
            to="/family"
            class="inline-flex items-center gap-1 font-semibold text-cyan-800 underline underline-offset-2 transition hover:text-cyan-950"
          >
            Add family members
            <IconArrowRight :size="15" aria-hidden="true" />
          </NuxtLink>
        </div>

        <p class="text-xs text-slate-400">
          This links the report to the right person so nutrition guidance is
          personalized correctly.
        </p>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <label for="report-title" class="text-sm font-medium text-slate-700">
            Report title
          </label>
          <input
            id="report-title"
            v-model="title"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-700 focus:bg-white"
            placeholder="Annual Blood Test"
          />
        </div>

        <div class="space-y-2">
          <label for="report-type" class="text-sm font-medium text-slate-700">
            Report type
          </label>
          <ProfessionalSelect
            id="report-type"
            v-model="type"
            :options="[
              { value: 'blood', label: 'Blood' },
              { value: 'dna', label: 'DNA' },
              { value: 'other', label: 'Other' },
            ]"
          />
        </div>
      </div>

      <label
        class="group flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:-translate-y-px hover:border-cyan-700 hover:bg-cyan-50 focus-within:border-cyan-700 focus-within:ring-4 focus-within:ring-cyan-100 sm:min-h-[210px]"
        :class="{
          '!border-cyan-600 !bg-cyan-50/60': fileName,
          '!border-cyan-700 !bg-cyan-50 ring-4 ring-cyan-100': isDragging,
        }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
      >
        <IconUpload
          :size="30"
          :stroke-width="1.7"
          class="text-cyan-800 transition group-hover:-translate-y-0.5"
          aria-hidden="true"
        />

        <div>
          <p class="text-sm font-semibold text-slate-900">
            {{ fileName || "Choose a report or drag it here" }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            PDF, JPG, JPEG, or PNG
          </p>
        </div>

        <input
          ref="fileInput"
          id="report-file"
          type="file"
          name="file"
          class="sr-only"
          accept=".pdf,.jpg,.jpeg,.png,image/png,image/jpeg,application/pdf"
          @change="onFile"
        />
      </label>

      <div
        v-if="previewUrl && isImage"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
      >
        <img
          :src="previewUrl"
          alt="Selected image preview"
          class="h-auto max-h-[420px] w-full object-contain"
        />
      </div>

      <div
        v-else-if="previewUrl && isPdf"
        class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
      >
        PDF selected: {{ fileName }}
      </div>

      <div class="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs leading-5 text-slate-500">
          {{ file ? "Your report is ready to upload." : "Choose a file above to continue." }}
        </p>
        <button
          :disabled="loading || !file"
          type="submit"
          class="medivoy-primary-button inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-cyan-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none disabled:hover:translate-y-0 sm:w-auto sm:min-w-48"
        >
          <IconLoader2
            v-if="loading"
            :size="17"
            class="animate-spin"
            aria-hidden="true"
          />
          <IconFileUpload v-else :size="17" aria-hidden="true" />
          {{ loading ? "Uploading..." : "Upload report" }}
        </button>
      </div>

      <p
        v-if="message"
        :role="hasError ? 'alert' : 'status'"
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
import IconArrowRight from "@tabler/icons-vue/icons/IconArrowRight";
import IconFileUpload from "@tabler/icons-vue/icons/IconFileUpload";
import IconLoader2 from "@tabler/icons-vue/icons/IconLoader2";
import IconUpload from "@tabler/icons-vue/icons/IconUpload";

const api = useMedivoyApi();
const route = useRoute();

const title = ref("");
const type = ref("blood");
const file = ref<File | null>(null);
const fileName = ref("");
const previewUrl = ref("");
const forMember = ref<string>((route.query.for as string) || "");
const message = ref("");
const hasError = ref(false);
const loading = ref(false);
const isDragging = ref(false);
const report = ref<any | null>(null);
const familyMembers = ref<any[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const openFilePicker = () => fileInput.value?.click();

const isImage = computed(
  () => !!file.value && file.value.type.startsWith("image/"),
);
const isPdf = computed(
  () => !!file.value && file.value.type === "application/pdf",
);

const pillClass = (active: boolean) => [
  "rounded-full px-4 py-2 text-sm font-medium border transition",
  active
    ? "bg-cyan-800 text-white border-cyan-800 shadow-sm"
    : "bg-white text-slate-700 border-slate-300 hover:border-cyan-700 hover:bg-cyan-50",
];

onMounted(async () => {
  try {
    familyMembers.value = await api.getFamilyMembers();
  } catch {
    familyMembers.value = [];
  }
});

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});

const onFile = (e: Event) => {
  const selected = (e.target as HTMLInputElement).files?.[0] || null;
  setSelectedFile(selected);
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  const selected = event.dataTransfer?.files[0] || null;
  if (selected) setSelectedFile(selected);
};

const onDragLeave = (event: DragEvent) => {
  const currentTarget = event.currentTarget as HTMLElement;
  const relatedTarget = event.relatedTarget as Node | null;
  if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
    isDragging.value = false;
  }
};

const setSelectedFile = (selected: File | null) => {
  hasError.value = false;
  message.value = "";

  if (!selected) {
    file.value = null;
    fileName.value = "";
    if (previewUrl.value && previewUrl.value !== "pdf") {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = "";
    return;
  }

  const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg"];
  const validByMime = allowedMimeTypes.includes(selected.type);
  const validByName = /\.(pdf|png|jpe?g)$/i.test(selected.name);

  if (!validByMime && !validByName) {
    hasError.value = true;
    message.value = "Only PDF, JPG, JPEG, and PNG files are allowed.";
    file.value = null;
    fileName.value = "";
    if (previewUrl.value && previewUrl.value !== "pdf") {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = "";
    if (fileInput.value) fileInput.value.value = "";
    return;
  }

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);

  file.value = selected;
  fileName.value = selected.name;

  if (selected.type.startsWith("image/")) {
    previewUrl.value = URL.createObjectURL(selected);
  } else {
    previewUrl.value = "pdf";
  }
};

const resetFormFile = () => {
  file.value = null;
  fileName.value = "";
  if (previewUrl.value && previewUrl.value !== "pdf") {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = "";
  if (fileInput.value) fileInput.value.value = "";
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
    resetFormFile();
  } catch (e: any) {
    hasError.value = true;
    message.value = e?.data?.message || e?.message || "Upload failed.";
  } finally {
    loading.value = false;
  }
};
</script>
