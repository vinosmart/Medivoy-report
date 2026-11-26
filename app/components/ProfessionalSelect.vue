<template>
  <div ref="root" class="relative">
    <button
      :id="id"
      type="button"
      role="combobox"
      :disabled="disabled"
      :aria-expanded="open"
      :aria-controls="menuId"
      :aria-required="required"
      aria-haspopup="listbox"
      class="professional-select"
      :class="{ 'professional-select--open': open }"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span :class="{ 'text-slate-500': !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <IconChevronDown
        :size="18"
        :stroke-width="1.8"
        class="shrink-0 text-slate-400 transition-transform"
        :class="{ 'rotate-180': open }"
        aria-hidden="true"
      />
    </button>

    <Teleport to="body">
      <Transition name="select-menu">
        <div
          v-if="open"
          :id="menuId"
          ref="menu"
          role="listbox"
          class="professional-select-menu"
          :style="menuStyle"
          @keydown="onMenuKeydown"
        >
          <button
            v-for="(option, index) in normalizedOptions"
            :key="String(option.value)"
            type="button"
            role="option"
            :aria-selected="option.value === modelValue"
            class="professional-select-option"
            :class="{ 'professional-select-option--active': index === activeIndex }"
            @mouseenter="activeIndex = index"
            @click="selectOption(option)"
          >
            <span>{{ option.label }}</span>
            <IconCheck
              v-if="option.value === modelValue"
              :size="17"
              :stroke-width="2"
              class="text-cyan-800"
              aria-hidden="true"
            />
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import IconCheck from "@tabler/icons-vue/icons/IconCheck";
import IconChevronDown from "@tabler/icons-vue/icons/IconChevronDown";

type SelectOption = {
  value: string | number;
  label: string;
};

const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue: string | number;
    options: Array<SelectOption | string>;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
  }>(),
  {
    placeholder: "Select an option",
    disabled: false,
    required: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const root = ref<HTMLElement | null>(null);
const menu = ref<HTMLElement | null>(null);
const open = ref(false);
const activeIndex = ref(0);
const menuPosition = ref({ top: 0, left: 0, width: 0, maxHeight: 288 });
let layoutObserver: ResizeObserver | null = null;
const menuId = computed(() => `${props.id || "professional-select"}-menu`);
const menuStyle = computed(() => ({
  top: `${menuPosition.value.top}px`,
  left: `${menuPosition.value.left}px`,
  width: `${menuPosition.value.width}px`,
  maxHeight: `${menuPosition.value.maxHeight}px`,
}));

const normalizedOptions = computed<SelectOption[]>(() =>
  props.options.map((option) =>
    typeof option === "string"
      ? { value: option, label: option }
      : option,
  ),
);

const selectedLabel = computed(
  () =>
    normalizedOptions.value.find(
      (option) => String(option.value) === String(props.modelValue),
    )?.label || "",
);

const updateMenuPosition = () => {
  const bounds = root.value?.getBoundingClientRect();
  if (!bounds) return;

  const gap = 8;
  const spaceBelow = Math.max(0, window.innerHeight - bounds.bottom - gap);
  const spaceAbove = Math.max(0, bounds.top - gap);
  const desiredHeight = Math.min(288, normalizedOptions.value.length * 42 + 14);
  const placeAbove = spaceBelow < desiredHeight && spaceAbove > spaceBelow;
  const maxHeight = Math.max(
    0,
    Math.min(desiredHeight, placeAbove ? spaceAbove : spaceBelow),
  );

  menuPosition.value = {
    top: placeAbove ? bounds.top - gap - maxHeight : bounds.bottom + gap,
    left: bounds.left,
    width: bounds.width,
    maxHeight,
  };
};

const openMenu = async () => {
  if (props.disabled) return;
  updateMenuPosition();
  open.value = true;
  const selectedIndex = normalizedOptions.value.findIndex(
    (option) => String(option.value) === String(props.modelValue),
  );
  activeIndex.value = selectedIndex >= 0 ? selectedIndex : 0;
  await nextTick();
  updateMenuPosition();
};

const closeMenu = () => {
  open.value = false;
};

const toggle = () => {
  if (open.value) closeMenu();
  else openMenu();
};

const selectOption = (option: SelectOption) => {
  emit("update:modelValue", option.value);
  closeMenu();
};

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openMenu();
  }
};

const onMenuKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    document.getElementById(props.id || "")?.focus();
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex.value =
      (activeIndex.value + 1) % normalizedOptions.value.length;
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex.value =
      (activeIndex.value - 1 + normalizedOptions.value.length) %
      normalizedOptions.value.length;
  }
  if (event.key === "Enter" && normalizedOptions.value[activeIndex.value]) {
    event.preventDefault();
    selectOption(normalizedOptions.value[activeIndex.value]);
  }
};

const handlePointerDown = (event: PointerEvent) => {
  const target = event.target as Node;
  if (!root.value?.contains(target) && !menu.value?.contains(target)) {
    closeMenu();
  }
};

watch(open, (isOpen) => {
  if (isOpen) {
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    layoutObserver = new ResizeObserver(updateMenuPosition);
    layoutObserver.observe(document.body);
  } else {
    window.removeEventListener("resize", updateMenuPosition);
    window.removeEventListener("scroll", updateMenuPosition, true);
    layoutObserver?.disconnect();
    layoutObserver = null;
  }
});

watch(
  () => props.modelValue,
  () => closeMenu(),
);

onMounted(() => document.addEventListener("pointerdown", handlePointerDown));
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handlePointerDown);
  window.removeEventListener("resize", updateMenuPosition);
  window.removeEventListener("scroll", updateMenuPosition, true);
  layoutObserver?.disconnect();
});
</script>

