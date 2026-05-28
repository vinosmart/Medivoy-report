<template>
  <div class="space-y-6">
    <section
      class="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-700 p-6 text-white shadow-xl sm:p-8"
    >
      <div class="max-w-3xl">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200 ring-1 ring-inset ring-white/10"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          Home collection kits
        </span>
        <h3 class="mt-4 text-3xl font-bold sm:text-4xl">
          Order a home collection kit.
        </h3>
        <p class="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
          Your sample is processed by a Medivoy partner lab and results appear
          here. You can add, edit, and delete kits from the admin panel or
          inline controls.
        </p>
      </div>
    </section>

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

        <div class="mt-4">
          <p class="text-base font-bold text-slate-950">{{ kit.name }}</p>
          <p class="mt-1 text-sm leading-6 text-slate-500">
            {{ kit.description }}
          </p>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <span
            v-for="(m, i) in kit.markers"
            :key="i"
            class="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200"
            >{{ m }}</span
          >
        </div>

        <div class="mt-6 flex gap-2">
          <button
            @click="placeOrder(kit)"
            :disabled="orderingId === kit.id"
            class="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ orderingId === kit.id ? "Ordering..." : "Order kit" }}
          </button>
          <button
            @click="editKit(kit)"
            class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            @click="deleteKit(kit.id)"
            class="rounded-xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </article>
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div
        class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p class="text-base font-semibold text-slate-950">Your orders</p>
          <p class="text-sm text-slate-500">Track kit orders and lab status</p>
        </div>
        <button
          @click="showAddKit = !showAddKit"
          class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {{ showAddKit ? "Close" : "Add kit" }}
        </button>
      </div>

      <div
        v-if="showAddKit"
        class="mb-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4"
      >
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <input
            v-model="kitForm.name"
            placeholder="Kit name"
            class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
          <input
            v-model="kitForm.badge"
            placeholder="Badge"
            class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
          <input
            v-model="kitForm.price"
            placeholder="Price"
            class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
          <input
            v-model="kitForm.description"
            placeholder="Description"
            class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <input
          v-model="markersInput"
          placeholder="Markers (comma separated)"
          class="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        <div class="mt-3 flex gap-2">
          <button
            @click="saveKit"
            class="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Save kit
          </button>
          <button
            @click="resetKitForm"
            class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

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
        No orders yet. Order a kit above.
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const orders = ref<any[]>([]);
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
