<template>
  <div class="space-y-6">
    <PageHeading
      :icon="IconTestPipe"
      title="Home collection kits"
      description="Choose a test kit and track its order and lab status here."
      eyebrow="Lab testing"
    />

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="kit in kits"
        :key="kit.id"
        class="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div class="flex items-center justify-between gap-3">
          <span
            class="rounded-full px-3 py-1 text-xs font-semibold"
            :class="kit.badgeClass"
            >{{ kit.badge }}</span
          >
          <span class="text-lg font-bold text-slate-950"
            >Rs. {{ kit.price }}</span
          >
        </div>

        <div class="mt-4 flex items-start gap-3">
          <div
            class="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-800"
          >
            <IconTestPipe :size="19" :stroke-width="1.8" aria-hidden="true" />
          </div>
          <div>
            <p class="text-base font-bold text-slate-950">{{ kit.name }}</p>
          <p class="mt-1 text-sm leading-6 text-slate-500">
            {{ kit.description }}
          </p>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <span
            v-for="(m, i) in kit.markers"
            :key="i"
            class="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200"
            >{{ m }}</span
          >
        </div>

        <div class="mt-6 grid grid-cols-2 gap-2">
          <button
            @click="placeOrder(kit)"
            :disabled="orderingId === kit.id"
            class="medivoy-primary-button col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IconLoader2
              v-if="orderingId === kit.id"
              :size="16"
              class="animate-spin"
              aria-hidden="true"
            />
            <IconShoppingCart v-else :size="16" aria-hidden="true" />
            {{ orderingId === kit.id ? "Ordering..." : "Order kit" }}
          </button>
          <button
            @click="editKit(kit)"
            class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <IconPencil :size="16" aria-hidden="true" />
            Edit
          </button>
          <button
            @click="deleteKit(kit.id)"
            class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
          >
            <IconTrash :size="16" aria-hidden="true" />
            Delete
          </button>
        </div>
      </article>
    </div>

    <p
      v-if="orderError"
      role="alert"
      class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
    >
      {{ orderError }}
    </p>

    <section
      ref="ordersSection"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div
        class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p class="text-base font-semibold text-slate-950">Your orders</p>
          <p class="text-sm text-slate-500">Track kit orders and lab status</p>
        </div>
        <button
          @click="showAddKit = !showAddKit"
          class="medivoy-primary-button inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-900 active:scale-[0.99]"
        >
          <IconX v-if="showAddKit" :size="17" aria-hidden="true" />
          <IconPlus v-else :size="17" aria-hidden="true" />
          {{ showAddKit ? "Close" : "Add kit" }}
        </button>
      </div>

      <p
        v-if="orderSuccess"
        role="status"
        class="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
      >
        <IconCircleCheck :size="18" class="shrink-0" aria-hidden="true" />
        {{ orderSuccess }}
      </p>

      <form
        v-if="showAddKit"
        @submit.prevent="saveKit"
        class="mb-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4"
      >
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>Kit name</span>
            <input
              v-model="kitForm.name"
              placeholder="For example, Vitamin panel"
              required
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-cyan-700"
            />
          </label>
          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>Badge</span>
            <input
              v-model="kitForm.badge"
              placeholder="Optional category"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-cyan-700"
            />
          </label>
          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>Price (Rs.)</span>
            <input
              v-model="kitForm.price"
              type="number"
              min="0"
              inputmode="decimal"
              placeholder="Enter price"
              required
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-cyan-700"
            />
          </label>
          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>Description</span>
            <input
              v-model="kitForm.description"
              placeholder="Briefly describe the test"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-cyan-700"
            />
          </label>
        </div>
        <label class="mt-3 block space-y-2 text-sm font-medium text-slate-700">
          <span>Test markers</span>
          <input
            v-model="markersInput"
            placeholder="Separate markers with commas"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-cyan-700"
          />
        </label>
        <div class="mt-3 flex gap-2">
          <button
            type="submit"
            class="medivoy-primary-button inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900 active:scale-[0.99]"
          >
            <IconDeviceFloppy :size="17" aria-hidden="true" />
            Save kit
          </button>
          <button
            type="button"
            @click="resetKitForm"
            class="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <IconRefresh :size="16" aria-hidden="true" />
            Reset
          </button>
        </div>
      </form>

      <div v-if="loading" class="space-y-3 animate-pulse">
        <div
          v-for="n in 2"
          :key="n"
          class="h-16 rounded-2xl bg-slate-100"
        ></div>
      </div>
      <div v-else-if="orders.length" class="space-y-3">
        <div
          v-for="o in orders"
          :key="o.id"
          class="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm font-semibold text-slate-950">{{ o.kitName }}</p>
            <p class="mt-1 text-xs text-slate-500">
              Ordered {{ formatDate(o.createdAt) }} · Rs. {{ o.price }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="statusClass(o.status)"
              >{{ o.status }}</span
            >
            <button
              @click="cancelOrder(o.id)"
              class="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div v-else class="py-8 text-center text-sm text-slate-400">
        <IconClipboardList
          :size="24"
          class="mx-auto mb-2 text-slate-400"
          aria-hidden="true"
        />
        No orders yet. Order a kit above.
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import IconCircleCheck from "@tabler/icons-vue/icons/IconCircleCheck";
import IconClipboardList from "@tabler/icons-vue/icons/IconClipboardList";
import IconDeviceFloppy from "@tabler/icons-vue/icons/IconDeviceFloppy";
import IconLoader2 from "@tabler/icons-vue/icons/IconLoader2";
import IconPencil from "@tabler/icons-vue/icons/IconPencil";
import IconPlus from "@tabler/icons-vue/icons/IconPlus";
import IconRefresh from "@tabler/icons-vue/icons/IconRefresh";
import IconShoppingCart from "@tabler/icons-vue/icons/IconShoppingCart";
import IconTrash from "@tabler/icons-vue/icons/IconTrash";
import IconTestPipe from "@tabler/icons-vue/icons/IconTestPipe";
import IconX from "@tabler/icons-vue/icons/IconX";

const api = useMedivoyApi();
const orders = ref<any[]>([]);
const orderError = ref("");
const orderSuccess = ref("");
const ordersSection = ref<HTMLElement | null>(null);
const loading = ref(true);
const orderingId = ref<number | string | null>(null);
const showAddKit = ref(false);
const editingId = ref<number | string | null>(null);
const markersInput = ref("");
const kitForm = reactive({
  name: "",
  badge: "",
  price: "",
  description: "",
  badgeClass: "bg-slate-100 text-slate-700",
});

const kits = ref<any[]>([
  {
    id: 1,
    name: "Complete Blood Count",
    badge: "Popular",
    badgeClass: "bg-cyan-50 text-cyan-800",
    price: "799",
    description:
      "Full CBC panel to check for anaemia, infections, and blood cell health.",
    markers: [
      "Hemoglobin",
      "WBC",
      "RBC",
      "Platelets",
      "Hematocrit",
      "MCV",
      "MCH",
    ],
  },
  {
    id: 2,
    name: "Heart & Lipid Panel",
    badge: "Cardio",
    badgeClass: "bg-cyan-50 text-cyan-800",
    price: "999",
    description:
      "Cardiovascular risk markers including cholesterol and inflammation.",
    markers: [
      "Total Cholesterol",
      "LDL",
      "HDL",
      "Triglycerides",
      "hs-CRP",
      "Lipoprotein(a)",
    ],
  },
  {
    id: 3,
    name: "Vitamin & Mineral Check",
    badge: "Nutrition",
    badgeClass: "bg-cyan-50 text-cyan-800",
    price: "1299",
    description:
      "Check for micronutrient deficiencies affecting energy and immunity.",
    markers: [
      "Vitamin D",
      "Vitamin B12",
      "Iron",
      "Ferritin",
      "Zinc",
      "Magnesium",
      "Folate",
    ],
  },
  {
    id: 4,
    name: "Thyroid Function",
    badge: "Hormones",
    badgeClass: "bg-cyan-50 text-cyan-800",
    price: "699",
    description: "Evaluate thyroid health for metabolism, energy, and mood.",
    markers: ["TSH", "T3", "T4", "Anti-TPO"],
  },
  {
    id: 5,
    name: "Diabetes & Blood Sugar",
    badge: "Metabolic",
    badgeClass: "bg-cyan-50 text-cyan-800",
    price: "599",
    description: "Track glucose metabolism and long-term blood sugar control.",
    markers: ["Fasting Glucose", "HbA1c", "Insulin", "HOMA-IR"],
  },
  {
    id: 6,
    name: "Full Body Wellness",
    badge: "Best Value",
    badgeClass: "bg-slate-100 text-slate-700",
    price: "2499",
    description:
      "Includes CBC, lipid, vitamin, liver, kidney, thyroid, and diabetes markers.",
    markers: [
      "All CBC markers",
      "Full lipid panel",
      "Vitamins D, B12, Iron",
      "Liver & Kidney",
      "HbA1c",
      "TSH",
    ],
  },
]);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const statusClass = (s: string) =>
  s === "completed"
    ? "bg-emerald-100 text-emerald-700"
    : s === "dispatched"
      ? "bg-blue-100 text-blue-700"
      : "bg-amber-100 text-amber-700";

onMounted(async () => {
  try {
    orders.value = await api.getOrders();
  } catch (error) {
    orders.value = [];
    orderError.value =
      error instanceof Error
        ? error.message
        : "We couldn't load your orders. Please try again.";
  } finally {
    loading.value = false;
  }
});

const placeOrder = async (kit: any) => {
  orderError.value = "";
  orderSuccess.value = "";
  orderingId.value = kit.id;
  try {
    const res = await api.placeOrder({
      kitId: String(kit.id),
      kitName: kit.name,
      price: kit.price,
    });
    orders.value.unshift(res);
    orderSuccess.value = `Order confirmed. ${kit.name} has been added to Your orders.`;
    await nextTick();
    ordersSection.value?.scrollIntoView({ behavior: "auto", block: "start" });
  } catch (error) {
    orderError.value =
      error instanceof Error
        ? error.message
        : "We couldn't place this order. Please try again.";
  } finally {
    orderingId.value = null;
  }
};
const cancelOrder = async (id: string) => {
  orderError.value = "";
  orderSuccess.value = "";
  try {
    await api.deleteOrder(id);
    orders.value = orders.value.filter((o: any) => o.id !== id);
  } catch (error) {
    orderError.value =
      error instanceof Error
        ? error.message
        : "We couldn't cancel this order. Please try again.";
  }
};

const resetKitForm = () => {
  kitForm.name = "";
  kitForm.badge = "";
  kitForm.price = "";
  kitForm.description = "";
  kitForm.badgeClass = "bg-slate-100 text-slate-700";
  markersInput.value = "";
  editingId.value = null;
};
const saveKit = () => {
  const markers = markersInput.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!kitForm.name || !kitForm.price) return;
  const payload = {
    id: editingId.value || Date.now(),
    name: kitForm.name,
    badge: kitForm.badge || "Custom",
    badgeClass: kitForm.badgeClass,
    price: kitForm.price,
    description: kitForm.description,
    markers,
  };
  if (editingId.value) {
    kits.value = kits.value.map((k) =>
      String(k.id) === String(editingId.value) ? payload : k,
    );
  } else {
    kits.value.unshift(payload);
  }
  resetKitForm();
  showAddKit.value = false;
};
const editKit = (kit: any) => {
  editingId.value = kit.id;
  kitForm.name = kit.name;
  kitForm.badge = kit.badge;
  kitForm.price = kit.price;
  kitForm.description = kit.description;
  kitForm.badgeClass = kit.badgeClass || "bg-slate-100 text-slate-700";
  markersInput.value = (kit.markers || []).join(", ");
  showAddKit.value = true;
};
const deleteKit = (id: number | string) => {
  kits.value = kits.value.filter((k) => String(k.id) !== String(id));
};
</script>
