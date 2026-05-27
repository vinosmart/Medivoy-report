<template>
  <div
    class="border-2 border-dashed rounded-2xl p-10 text-center transition-colors"
    :class="isDragging ? 'border-medivoy-accent bg-medivoy-accent/5' : 'border-medivoy-300 bg-medivoy-50'"
    @dragenter.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <div class="w-14 h-14 rounded-2xl bg-medivoy-100 flex items-center justify-center mx-auto mb-4">
      <svg class="w-7 h-7 text-medivoy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
      </svg>
    </div>
    <p class="text-sm font-medium text-medivoy-900 mb-1">Drag & drop your report here</p>
    <p class="text-xs text-medivoy-500 mb-4">or click to browse files</p>
    <input ref="fileInput" type="file" accept=".pdf,.png,.jpg,.jpeg,.dicom,.csv" class="hidden" @change="handleFileSelect" />
    <button @click="fileInput?.click()" class="px-4 py-2 rounded-xl bg-white border border-medivoy-200 text-sm font-medium text-medivoy-700 hover:border-medivoy-accent hover:text-medivoy-accent transition-colors">
      Select File
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ upload: [file: File] }>();
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

function handleDrop(e: DragEvent) {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    emit("upload", files[0]);
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    emit("upload", target.files[0]);
  }
}
</script>
