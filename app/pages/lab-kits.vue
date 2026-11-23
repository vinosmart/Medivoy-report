<template>
  <div class="lab-page">
    <section class="lab-intro">
      <div class="lab-intro-copy">
        <span class="lab-eyebrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" />
          </svg>
          At-home health screening
        </span>
        <h1>Choose a health panel <span class="lab-heading-accent">with confidence.</span></h1>
        <p>
          Explore collection kits, review the markers in each panel, and keep
          track of your orders in one place.
        </p>
      </div>
      <aside class="lab-highlight">
        <span class="lab-highlight-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" />
          </svg>
        </span>
        <span class="lab-highlight-label">Available panels</span>
        <strong>{{ kits.length }}</strong>
        <span class="lab-highlight-note">Choose a panel to view its included markers.</span>
      </aside>
    </section>

    <section class="kit-section" aria-label="Available collection kits">
      <div class="kit-section-heading">
        <div>
          <span class="lab-kicker">Explore testing</span>
          <h2>Collection kits</h2>
        </div>
        <span class="kit-section-count">{{ kits.length }} panels</span>
      </div>

      <div v-if="kits.length" class="kit-grid">
        <article v-for="kit in kits" :key="kit.id" class="kit-card">
          <div class="kit-card-top">
            <span class="kit-badge" :class="kit.badgeClass">{{ kit.badge }}</span>
            <div class="kit-price">
              <span>Price</span>
              <strong><small>Rs.</small> {{ kit.price }}</strong>
            </div>
          </div>

          <div class="kit-title-block">
            <span class="kit-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" />
              </svg>
            </span>
            <div>
              <h3>{{ kit.name }}</h3>
              <p>{{ kit.description }}</p>
            </div>
          </div>

          <div class="kit-markers">
            <span class="kit-markers-label">Included markers</span>
            <div class="marker-list">
              <span v-for="(marker, i) in kit.markers" :key="i">{{ marker }}</span>
            </div>
          </div>

          <div class="kit-actions">
            <button
              class="kit-order-button"
              type="button"
              :disabled="orderingId === kit.id"
              @click="placeOrder(kit)"
            >
              {{ orderingId === kit.id ? "Ordering..." : "Order kit" }}
            </button>
            <button class="kit-edit-button" type="button" @click="editKit(kit)">
              Edit
            </button>
            <button
              class="kit-delete-button"
              type="button"
              :aria-label="`Delete ${kit.name}`"
              @click="deleteKit(kit.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
              </svg>
            </button>
          </div>
        </article>
      </div>
      <div v-else class="kit-empty">
        <span class="kit-empty-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" />
          </svg>
        </span>
        <h3>No collection kits available</h3>
        <p>New panels will appear here when they become available.</p>
      </div>
    </section>

    <section class="orders-panel">
      <div class="orders-heading">
        <div class="orders-title">
          <span class="orders-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M6 3h12l2 4H4l2-4ZM4 7v13h16V7M9 11h6m-6 4h6" />
            </svg>
          </span>
          <div>
            <span class="lab-kicker">Order history</span>
            <h2>Your orders</h2>
            <p>Review your collection kit orders and lab status.</p>
          </div>
        </div>
        <button
          class="add-kit-toggle"
          type="button"
          :aria-expanded="showAddKit"
          @click="showAddKit = !showAddKit"
        >
          <svg v-if="!showAddKit" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
          {{ showAddKit ? "Close form" : "Add kit" }}
        </button>
      </div>

      <div v-if="showAddKit" ref="kitEditorRef" class="kit-editor">
        <div class="editor-heading">
          <div>
            <span class="lab-kicker">{{ editingId ? "Edit panel" : "New panel" }}</span>
            <h3>{{ editingId ? "Update collection kit" : "Add a collection kit" }}</h3>
          </div>
        </div>
        <div class="editor-fields">
          <label class="editor-field">
            <span>Kit name</span>
            <input ref="kitNameInputRef" v-model="kitForm.name" placeholder="e.g. Complete Blood Count" />
          </label>
          <label class="editor-field">
            <span>Badge</span>
            <input v-model="kitForm.badge" placeholder="e.g. Popular" />
          </label>
          <label class="editor-field">
            <span>Price (Rs.)</span>
            <input v-model="kitForm.price" inputmode="decimal" placeholder="e.g. 799" />
          </label>
          <label class="editor-field editor-field-wide">
            <span>Description</span>
            <input v-model="kitForm.description" placeholder="Briefly describe this panel" />
          </label>
          <label class="editor-field editor-field-wide">
            <span>Included markers</span>
            <input v-model="markersInput" placeholder="Separate markers with commas" />
          </label>
        </div>
        <div class="editor-actions">
          <button class="kit-order-button" type="button" @click="saveKit">
            {{ editingId ? "Save changes" : "Save kit" }}
          </button>
          <button class="kit-edit-button" type="button" @click="resetKitForm">
            Reset
          </button>
        </div>
      </div>

      <div v-if="loading" class="order-loading" aria-label="Loading orders">
        <div v-for="n in 2" :key="n" class="order-skeleton" aria-hidden="true"></div>
      </div>
      <div v-else-if="orders.length" class="order-list">
        <article v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-card-main">
            <span class="order-kit-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" />
              </svg>
            </span>
            <div>
              <h3>{{ order.kitName }}</h3>
              <p>Ordered {{ formatDate(order.createdAt) }} <span>·</span> Rs. {{ order.price }}</p>
            </div>
          </div>
          <div class="order-card-actions">
            <span class="order-status" :class="statusClass(order.status)">
              {{ order.status }}
            </span>
            <button
              class="cancel-order-button"
              type="button"
              :aria-label="`Cancel order for ${order.kitName}`"
              @click="cancelOrder(order.id)"
            >
              Cancel
            </button>
          </div>
        </article>
      </div>
      <div v-else class="orders-empty">
        <span class="orders-empty-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M6 3h12l2 4H4l2-4ZM4 7v13h16V7M9 11h6m-6 4h6" />
          </svg>
        </span>
        <h3>No orders yet</h3>
        <p>Your kit orders and updates will appear here.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";

const api = useMedivoyApi();
const orders = ref<any[]>([]);
const loading = ref(true);
const orderingId = ref<number | string | null>(null);
const showAddKit = ref(false);
const editingId = ref<number | string | null>(null);
const markersInput = ref("");
const kitEditorRef = ref<HTMLDivElement | null>(null);
const kitNameInputRef = ref<HTMLInputElement | null>(null);
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
const editKit = async (kit: any) => {
  editingId.value = kit.id;
  kitForm.name = kit.name;
  kitForm.badge = kit.badge;
  kitForm.price = kit.price;
  kitForm.description = kit.description;
  kitForm.badgeClass = kit.badgeClass || "bg-slate-100 text-slate-700";
  markersInput.value = (kit.markers || []).join(", ");
  showAddKit.value = true;
  await nextTick();
  kitEditorRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  kitNameInputRef.value?.focus({ preventScroll: true });
};
const deleteKit = (id: number | string) => {
  kits.value = kits.value.filter((k) => String(k.id) !== String(id));
};
</script>

<style scoped>
.lab-page {
  display: grid;
  gap: 22px;
  color: #233b59;
  font-family: Poppins, system-ui, sans-serif;
}
.lab-intro {
  position: relative;
  display: flex;
  min-height: 214px;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  overflow: hidden;
  border: 1px solid #e1ebf7;
  border-radius: 22px;
  background: linear-gradient(112deg, #fff 0%, #fff 58%, #f0f6ff 100%);
  padding: 29px 32px;
  box-shadow: 0 12px 32px rgba(37, 75, 120, 0.045);
}
.lab-intro::after {
  position: absolute;
  top: -135px;
  right: 145px;
  width: 290px;
  height: 290px;
  border: 1px solid rgba(95, 151, 218, 0.1);
  border-radius: 50%;
  box-shadow: 0 0 0 30px rgba(95, 151, 218, 0.035), 0 0 0 62px rgba(95, 151, 218, 0.025);
  content: "";
  pointer-events: none;
}
.lab-intro-copy {
  position: relative;
  z-index: 1;
  max-width: 720px;
}
.lab-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #274568;
  border-radius: 999px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 7px 11px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.lab-eyebrow svg,
.lab-highlight-icon svg,
.kit-icon svg,
.kit-empty-icon svg,
.orders-icon svg,
.order-kit-icon svg,
.orders-empty-icon svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.lab-intro h1 {
  max-width: 700px;
  margin: 16px 0 0;
  color: #1c3656;
  font-size: clamp(30px, 3.3vw, 40px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.04em;
}
.lab-heading-accent {
  color: #438cdf;
}
.lab-intro-copy > p {
  max-width: 650px;
  margin: 12px 0 0;
  color: #7489a3;
  font-size: 16px;
  line-height: 1.75;
}
.lab-highlight {
  position: relative;
  z-index: 1;
  display: grid;
  width: 190px;
  flex: 0 0 auto;
  justify-items: start;
  border: 1px solid rgba(151, 190, 235, 0.22);
  border-radius: 17px;
  background: linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 16px;
  box-shadow: 0 10px 24px rgba(11, 28, 57, 0.16);
  cursor: default;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.lab-highlight:hover,
.lab-highlight:active {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(11, 28, 57, 0.24);
}
.lab-highlight-icon,
.kit-icon,
.orders-icon,
.order-kit-icon,
.kit-empty-icon,
.orders-empty-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
}
.lab-highlight-icon {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(169, 210, 255, 0.26);
  border-radius: 12px;
  background: rgba(109, 176, 255, 0.14);
  color: #b7dcff;
}
.lab-highlight-label {
  margin-top: 11px;
  color: #a9d2ff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.lab-highlight > strong {
  margin-top: 2px;
  color: #fff;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
}
.lab-highlight-note {
  margin-top: 5px;
  color: #c1d4eb;
  font-size: 11px;
  line-height: 1.5;
}
.kit-section,
.orders-panel {
  border: 1px solid #e4ecf5;
  border-radius: 20px;
  background: #fff;
  padding: 22px;
  box-shadow: 0 8px 26px rgba(33, 70, 112, 0.035);
}
.kit-section-heading,
.orders-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.lab-kicker {
  display: block;
  margin-bottom: 4px;
  color: #8a9db5;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.kit-section-heading h2,
.orders-title h2 {
  margin: 0;
  color: #263f5e;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.025em;
}
.kit-section-count {
  border: 1px solid #274568;
  border-radius: 999px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 6px 10px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}
.kit-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}
.kit-card {
  --kit-accent: #438be0;
  --kit-soft: #eaf3ff;
  --kit-hover: #f7faff;
  display: flex;
  position: relative;
  overflow: hidden;
  min-width: 0;
  flex-direction: column;
  border: 1px solid #e4ebf5;
  border-top: 2px solid var(--kit-accent);
  border-radius: 18px;
  background: #fff;
  padding: 18px;
  box-shadow: 0 8px 22px rgba(37, 87, 145, 0.055);
  transition: transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}
.kit-card::after {
  position: absolute;
  right: -28px;
  bottom: -42px;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: var(--kit-soft);
  content: "";
  opacity: 0.72;
  pointer-events: none;
}
.kit-card > * {
  position: relative;
  z-index: 1;
}
.kit-card:nth-child(6n + 2) {
  --kit-accent: #e96d86;
  --kit-soft: #fff1f4;
  --kit-hover: #fff9fa;
}
.kit-card:nth-child(6n + 3) {
  --kit-accent: #4b9170;
  --kit-soft: #edf7f1;
  --kit-hover: #f7fbf8;
}
.kit-card:nth-child(6n + 4) {
  --kit-accent: #8c75cb;
  --kit-soft: #f2eefb;
  --kit-hover: #fbf9ff;
}
.kit-card:nth-child(6n + 5) {
  --kit-accent: #e5a02c;
  --kit-soft: #fff4e5;
  --kit-hover: #fffaf2;
}
.kit-card:hover {
  transform: translateY(-3px);
  border-color: var(--kit-accent);
  background: var(--kit-hover);
  box-shadow: 0 14px 28px rgba(37, 87, 145, 0.11);
}
.kit-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.kit-badge {
  display: inline-flex;
  min-height: 25px;
  align-items: center;
  border: 1px solid var(--kit-soft);
  border-radius: 999px;
  padding: 4px 10px;
  background-color: var(--kit-soft);
  color: var(--kit-accent);
  font-size: 11px;
  font-weight: 700;
}
.kit-price {
  display: grid;
  justify-items: end;
}
.kit-price > span {
  color: #93a2b5;
  font-size: 10px;
  font-weight: 600;
}
.kit-price strong {
  margin-top: 2px;
  color: #0b1c39;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.2;
}
.kit-price small {
  color: #0b1c39;
  font-size: 12px;
  font-weight: 600;
}
.kit-title-block {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-top: 17px;
}
.kit-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 1px solid var(--kit-soft);
  border-radius: 12px;
  background: var(--kit-soft);
  color: var(--kit-accent);
}
.kit-title-block > div {
  min-width: 0;
}
.kit-title-block h3 {
  margin: 1px 0 0;
  color: #2b4564;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
}
.kit-title-block p {
  margin: 5px 0 0;
  color: #778ba4;
  font-size: 13px;
  line-height: 1.65;
}
.kit-markers {
  margin-top: 17px;
}
.kit-markers-label {
  display: block;
  margin-bottom: 8px;
  color: #8a9db5;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.marker-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.marker-list span {
  border: 1px solid #e2eaf4;
  border-radius: 999px;
  background: #f8faff;
  padding: 5px 8px;
  color: #637d9a;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
}
.kit-actions {
  display: flex;
  align-items: stretch;
  gap: 7px;
  margin-top: auto;
  padding-top: 18px;
}
.kit-order-button,
.kit-edit-button,
.kit-delete-button,
.add-kit-toggle,
.cancel-order-button {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}
.kit-order-button {
  flex: 1;
  border: 1px solid #397fca;
  background: linear-gradient(135deg, #4a91df, #3478c8);
  padding: 0 12px;
  color: #fff;
  box-shadow: 0 4px 11px rgba(55, 123, 199, 0.15);
}
.kit-order-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: linear-gradient(135deg, #397fc9, #2869b5);
  box-shadow: 0 6px 14px rgba(55, 123, 199, 0.2);
}
.kit-order-button:disabled {
  opacity: 0.65;
  cursor: wait;
}
.kit-edit-button {
  flex: 0 0 auto;
  border: 1px solid #dfe8f2;
  background: #fff;
  padding: 0 12px;
  color: #627b99;
}
.kit-edit-button:hover {
  border-color: #cddff3;
  background: #f7faff;
  color: #3478c8;
}
.kit-delete-button {
  width: 40px;
  flex: 0 0 auto;
  border: 1px solid #f0e2e2;
  background: #fff;
  color: #b77474;
}
.kit-delete-button:hover,
.cancel-order-button:hover {
  border-color: #edcccc;
  background: #fff7f7;
  color: #a64e4e;
}
.kit-delete-button svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.kit-order-button:focus-visible,
.kit-edit-button:focus-visible,
.kit-delete-button:focus-visible,
.add-kit-toggle:focus-visible,
.cancel-order-button:focus-visible,
.editor-field input:focus-visible {
  outline: 3px solid rgba(71, 139, 211, 0.25);
  outline-offset: 2px;
}
.kit-empty,
.orders-empty {
  display: grid;
  justify-items: center;
  border: 1px dashed #dbe6f2;
  border-radius: 16px;
  background: linear-gradient(145deg, #fbfdff, #f7faff);
  padding: 32px 18px;
  text-align: center;
}
.kit-empty-icon,
.orders-empty-icon {
  width: 54px;
  height: 54px;
  border: 1px solid #dfeafb;
  border-radius: 17px;
  background: #eff6ff;
  color: #5b91ca;
}
.kit-empty h3,
.orders-empty h3 {
  margin: 12px 0 0;
  color: #334d6d;
  font-size: 16px;
  font-weight: 700;
}
.kit-empty p,
.orders-empty p {
  margin: 5px 0 0;
  color: #8498b1;
  font-size: 12px;
  line-height: 1.6;
}
.orders-panel {
  padding: 22px;
}
.orders-heading {
  margin-bottom: 19px;
}
.orders-title {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
}
.orders-icon {
  width: 44px;
  height: 44px;
  border: 1px solid #dceafb;
  border-radius: 13px;
  background: linear-gradient(145deg, #f1f7ff, #e8f2ff);
  color: #4384ca;
}
.orders-title h2 {
  margin: 0;
  color: #263f5e;
  font-size: 20px;
  font-weight: 700;
}
.orders-title p {
  margin: 3px 0 0;
  color: #7d91aa;
  font-size: 12px;
}
.add-kit-toggle {
  gap: 7px;
  border: 1px solid #dbe8f6;
  background: #f7faff;
  padding: 0 13px;
  color: #3c72a9;
}
.add-kit-toggle:hover {
  border-color: #c7dcf4;
  background: #eff6ff;
}
.add-kit-toggle svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}
.kit-editor {
  margin-bottom: 18px;
  border: 1px solid #e3ebf5;
  border-radius: 16px;
  background: #fbfcfe;
  padding: 18px;
}
.editor-heading {
  margin-bottom: 15px;
}
.editor-heading h3 {
  margin: 0;
  color: #314b69;
  font-size: 17px;
  font-weight: 700;
}
.editor-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}
.editor-field {
  display: grid;
  min-width: 0;
  gap: 7px;
}
.editor-field > span {
  color: #526a86;
  font-size: 12px;
  font-weight: 700;
}
.editor-field input {
  width: 100%;
  height: 43px;
  border: 1px solid #dfe8f2;
  border-radius: 10px;
  background: #fff;
  padding: 0 12px;
  color: #304a69;
  font-family: inherit;
  font-size: 13px;
}
.editor-field input::placeholder {
  color: #9aabc0;
}
.editor-field input:focus {
  border-color: #82b4e8;
  box-shadow: 0 0 0 3px rgba(71, 139, 211, 0.1);
  outline: none;
}
.editor-field-wide {
  grid-column: 1 / -1;
}
.editor-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}
.editor-actions .kit-order-button,
.editor-actions .kit-edit-button {
  flex: 0 0 auto;
  min-width: 110px;
}
.order-list,
.order-loading {
  display: grid;
  gap: 10px;
}
.order-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #e6edf5;
  border-radius: 14px;
  background: #fff;
  padding: 13px 15px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.order-card:hover {
  border-color: #d7e5f4;
  box-shadow: 0 4px 12px rgba(42, 82, 132, 0.045);
}
.order-card-main {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
}
.order-kit-icon {
  width: 38px;
  height: 38px;
  border: 1px solid #274568;
  border-radius: 12px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  color: #fff;
}
.order-card-main h3 {
  overflow: hidden;
  margin: 0;
  color: #2b4564;
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-card-main p {
  margin: 4px 0 0;
  color: #7c90a9;
  font-size: 11px;
}
.order-card-main p span {
  margin: 0 3px;
  color: #b0bdcc;
}
.order-card-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
}
.order-status {
  border: 1px solid rgba(110, 142, 177, 0.12);
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 10px;
  font-weight: 700;
  text-transform: capitalize;
}
.cancel-order-button {
  min-height: 34px;
  border: 1px solid #f0e2e2;
  background: #fff;
  padding: 0 10px;
  color: #b77474;
  font-size: 11px;
}
.order-skeleton {
  min-height: 68px;
  border: 1px solid #e8eef5;
  border-radius: 14px;
  background: linear-gradient(100deg, #f6f8fb 30%, #edf2f8 50%, #f6f8fb 70%);
  background-size: 200% 100%;
  animation: lab-shimmer 1.5s ease-in-out infinite;
}
@keyframes lab-shimmer {
  to {
    background-position: -200% 0;
  }
}
@media (max-width: 1020px) {
  .kit-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 800px) {
  .lab-intro {
    align-items: flex-start;
    padding: 25px;
  }
  .lab-highlight {
    width: 170px;
  }
  .kit-grid {
    gap: 12px;
  }
}
@media (max-width: 560px) {
  .lab-page {
    gap: 16px;
  }
  .lab-intro {
    min-height: 0;
    flex-direction: column;
    gap: 18px;
    border-radius: 18px;
    padding: 21px;
  }
  .lab-intro::after {
    top: -130px;
    right: -130px;
  }
  .lab-intro h1 {
    font-size: 29px;
  }
  .lab-intro-copy > p {
    font-size: 14px;
  }
  .lab-highlight {
    width: 100%;
    grid-template-columns: 38px 1fr;
    column-gap: 11px;
    padding: 12px 14px;
  }
  .lab-highlight-icon {
    grid-row: span 3;
  }
  .lab-highlight-label,
  .lab-highlight > strong,
  .lab-highlight-note {
    margin-top: 0;
  }
  .lab-highlight > strong {
    font-size: 20px;
  }
  .kit-section,
  .orders-panel {
    border-radius: 17px;
    padding: 17px;
  }
  .kit-grid {
    grid-template-columns: 1fr;
  }
  .kit-card {
    padding: 16px;
  }
  .orders-heading {
    align-items: flex-start;
  }
  .orders-title {
    align-items: flex-start;
  }
  .orders-icon {
    width: 40px;
    height: 40px;
  }
  .add-kit-toggle {
    min-height: 36px;
    padding: 0 9px;
    font-size: 11px;
  }
  .editor-fields {
    grid-template-columns: 1fr;
  }
  .editor-field-wide {
    grid-column: auto;
  }
  .order-card {
    align-items: flex-start;
    flex-direction: column;
  }
  .order-card-actions {
    width: 100%;
    justify-content: space-between;
  }
}
@media (prefers-reduced-motion: reduce) {
  .kit-card,
  .lab-highlight,
  .kit-order-button,
  .kit-edit-button,
  .kit-delete-button,
  .add-kit-toggle,
  .cancel-order-button,
  .order-card {
    transition: none;
  }
  .lab-highlight:hover,
  .lab-highlight:active {
    transform: none;
  }
  .order-skeleton {
    animation: none;
  }
}
</style>
