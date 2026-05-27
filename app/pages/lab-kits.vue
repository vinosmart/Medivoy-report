<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold text-slate-900">Lab Kits</h3>
      <p class="text-sm text-slate-500">
        Order a home collection kit. Your sample is processed by a Medivoy
        partner lab and results appear here.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="kit in kits"
        :key="kit.id"
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4"
      >
        <div class="flex items-center justify-between">
          <span
            class="rounded-full px-3 py-1 text-xs font-semibold"
            :class="kit.badgeClass"
            >{{ kit.badge }}</span
          >
          <span class="text-sm font-bold text-slate-900"
            >Rs. {{ kit.price }}</span
          >
        </div>
        <div>
          <p class="font-bold text-slate-900 text-base">{{ kit.name }}</p>
          <p class="text-xs text-slate-500 mt-1">{{ kit.description }}</p>
        </div>
        <ul class="space-y-1">
          <li
            v-for="(m, i) in kit.markers"
            :key="i"
            class="text-xs text-slate-600 flex items-center gap-2"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0"></span
            >{{ m }}
          </li>
        </ul>
        <div class="mt-auto pt-2">
          <button
            @click="placeOrder(kit)"
            :disabled="orderingId === kit.id"
            class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {{ orderingId === kit.id ? "Ordering..." : "Order kit" }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <p class="font-semibold text-slate-800">Your orders</p>
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
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 p-4 gap-2"
        >
          <div>
            <p class="font-semibold text-slate-900 text-sm">{{ o.kitName }}</p>
            <p class="text-xs text-slate-500 mt-1">
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
              class="rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div v-else class="py-8 text-center text-slate-400 text-sm">
        No orders yet. Order a kit above.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const orders = ref<any[]>([]);
const loading = ref(true);
const orderingId = ref<number | null>(null);

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

const kits = [
  {
    id: 1,
    name: "Complete Blood Count",
    badge: "Popular",
    badgeClass: "bg-emerald-100 text-emerald-700",
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
    badgeClass: "bg-rose-100 text-rose-700",
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
    badgeClass: "bg-blue-100 text-blue-700",
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
    badgeClass: "bg-purple-100 text-purple-700",
    price: "699",
    description: "Evaluate thyroid health for metabolism, energy, and mood.",
    markers: ["TSH", "T3", "T4", "Anti-TPO"],
  },
  {
    id: 5,
    name: "Diabetes & Blood Sugar",
    badge: "Metabolic",
    badgeClass: "bg-amber-100 text-amber-700",
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
      "Everything — CBC, lipids, vitamins, liver, kidney, thyroid, and diabetes.",
    markers: [
      "All CBC markers",
      "Full lipid panel",
      "Vitamins D, B12, Iron",
      "Liver & Kidney",
      "HbA1c",
      "TSH",
    ],
  },
];

onMounted(async () => {
  try {
    orders.value = await api.getOrders();
  } catch {
    orders.value = [];
  } finally {
    loading.value = false;
  }
});

const placeOrder = async (kit: any) => {
  orderingId.value = kit.id;
  try {
    const res = await api.placeOrder({
      kitId: String(kit.id),
      kitName: kit.name,
      price: kit.price,
    });
    orders.value.unshift(res);
  } finally {
    orderingId.value = null;
  }
};

const cancelOrder = async (id: string) => {
  await api.deleteOrder(id);
  orders.value = orders.value.filter((o: any) => o.id !== id);
};
</script>
