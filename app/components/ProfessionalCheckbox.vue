<template>
  <label class="professional-checkbox" :class="{ 'professional-checkbox--disabled': disabled }">
    <input
      :checked="modelValue"
      type="checkbox"
      :disabled="disabled"
      :aria-label="ariaLabel"
      @change="onChange"
    />
    <span class="professional-checkbox__box" aria-hidden="true">
      <IconCheck :size="13" :stroke-width="2.5" />
    </span>
    <span v-if="$slots.default" class="professional-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import IconCheck from "@tabler/icons-vue/icons/IconCheck";

withDefaults(
  defineProps<{
    modelValue: boolean;
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    disabled: false,
    ariaLabel: "Select",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const onChange = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).checked);
};
</script>
