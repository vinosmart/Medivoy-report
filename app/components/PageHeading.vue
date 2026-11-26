<template>
  <section
    class="relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-cyan-100/90 bg-[linear-gradient(135deg,#ffffff_0%,#f7fcfd_68%,#eaf7f9_100%)] p-5 shadow-[0_12px_28px_-24px_rgba(14,116,144,0.38)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
  >
    <div class="relative z-10 flex min-w-0 items-start gap-4">
      <div
        class="page-heading-icon relative isolate grid size-12 shrink-0 place-items-center rounded-2xl bg-cyan-50 text-cyan-800 ring-1 ring-inset ring-cyan-100 sm:size-14"
      >
        <component :is="icon" :size="24" :stroke-width="1.8" aria-hidden="true" />
      </div>
      <div class="min-w-0">
        <p
          v-if="eyebrow"
          class="mb-1 text-xs font-semibold tracking-wide text-cyan-800"
        >
          {{ eyebrow }}
        </p>
        <h1 class="medivoy-title-underline text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {{ title }}
        </h1>
        <p v-if="description" class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          {{ description }}
        </p>
      </div>
    </div>
    <div
      v-if="$slots.actions"
      class="relative z-10 flex shrink-0 flex-wrap items-center gap-2 sm:justify-end"
    >
      <slot name="actions" />
    </div>
    <div
      class="pointer-events-none absolute -right-16 -top-24 size-56 rounded-full bg-cyan-100/35 blur-3xl"
      aria-hidden="true"
    ></div>
  </section>
</template>

<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  title: string;
  description?: string;
  eyebrow?: string;
  icon: Component;
}>();
</script>

<style scoped>
.page-heading-icon::after {
  position: absolute;
  inset: 0;
  border: 1px solid rgb(14 116 144 / 0.28);
  border-radius: inherit;
  content: "";
  opacity: 0;
  pointer-events: none;
}

@keyframes page-heading-icon-enter {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes page-heading-icon-ring {
  from {
    opacity: 0.42;
    transform: scale(0.9);
  }
  to {
    opacity: 0;
    transform: scale(1.38);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .page-heading-icon {
    animation: page-heading-icon-enter 360ms var(--medivoy-ease) both;
  }

  .page-heading-icon::after {
    animation: page-heading-icon-ring 620ms ease-out 80ms both;
  }
}
</style>
