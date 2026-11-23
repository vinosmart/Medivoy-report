import { defineComponent, ref, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
import { u as useMedivoyApi } from './useMedivoyApi-BieI7KwV.mjs';
import { _ as _export_sfc } from './server.mjs';
import './auth-DLg6Nzla.mjs';
import 'pinia';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "lab-kits",
  __ssrInlineRender: true,
  setup(__props) {
    useMedivoyApi();
    const orders = ref([]);
    const loading = ref(true);
    const orderingId = ref(null);
    const showAddKit = ref(false);
    const editingId = ref(null);
    const markersInput = ref("");
    ref(null);
    ref(null);
    const kitForm = reactive({
      name: "",
      badge: "",
      price: "",
      description: "",
      badgeClass: "bg-slate-100 text-slate-700"
    });
    const kits = ref([
      {
        id: 1,
        name: "Complete Blood Count",
        badge: "Popular",
        badgeClass: "bg-emerald-100 text-emerald-700",
        price: "799",
        description: "Full CBC panel to check for anaemia, infections, and blood cell health.",
        markers: [
          "Hemoglobin",
          "WBC",
          "RBC",
          "Platelets",
          "Hematocrit",
          "MCV",
          "MCH"
        ]
      },
      {
        id: 2,
        name: "Heart & Lipid Panel",
        badge: "Cardio",
        badgeClass: "bg-rose-100 text-rose-700",
        price: "999",
        description: "Cardiovascular risk markers including cholesterol and inflammation.",
        markers: [
          "Total Cholesterol",
          "LDL",
          "HDL",
          "Triglycerides",
          "hs-CRP",
          "Lipoprotein(a)"
        ]
      },
      {
        id: 3,
        name: "Vitamin & Mineral Check",
        badge: "Nutrition",
        badgeClass: "bg-blue-100 text-blue-700",
        price: "1299",
        description: "Check for micronutrient deficiencies affecting energy and immunity.",
        markers: [
          "Vitamin D",
          "Vitamin B12",
          "Iron",
          "Ferritin",
          "Zinc",
          "Magnesium",
          "Folate"
        ]
      },
      {
        id: 4,
        name: "Thyroid Function",
        badge: "Hormones",
        badgeClass: "bg-purple-100 text-purple-700",
        price: "699",
        description: "Evaluate thyroid health for metabolism, energy, and mood.",
        markers: ["TSH", "T3", "T4", "Anti-TPO"]
      },
      {
        id: 5,
        name: "Diabetes & Blood Sugar",
        badge: "Metabolic",
        badgeClass: "bg-amber-100 text-amber-700",
        price: "599",
        description: "Track glucose metabolism and long-term blood sugar control.",
        markers: ["Fasting Glucose", "HbA1c", "Insulin", "HOMA-IR"]
      },
      {
        id: 6,
        name: "Full Body Wellness",
        badge: "Best Value",
        badgeClass: "bg-slate-100 text-slate-700",
        price: "2499",
        description: "Everything \u2014 CBC, lipids, vitamins, liver, kidney, thyroid, and diabetes.",
        markers: [
          "All CBC markers",
          "Full lipid panel",
          "Vitamins D, B12, Iron",
          "Liver & Kidney",
          "HbA1c",
          "TSH"
        ]
      }
    ]);
    const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    const statusClass = (s) => s === "completed" ? "bg-emerald-100 text-emerald-700" : s === "dispatched" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "lab-page" }, _attrs))} data-v-50d17b3a><section class="lab-intro" data-v-50d17b3a><div class="lab-intro-copy" data-v-50d17b3a><span class="lab-eyebrow" data-v-50d17b3a><svg viewBox="0 0 24 24" aria-hidden="true" data-v-50d17b3a><path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" data-v-50d17b3a></path></svg> At-home health screening </span><h1 data-v-50d17b3a>Choose a health panel <span class="lab-heading-accent" data-v-50d17b3a>with confidence.</span></h1><p data-v-50d17b3a> Explore collection kits, review the markers in each panel, and keep track of your orders in one place. </p></div><aside class="lab-highlight" data-v-50d17b3a><span class="lab-highlight-icon" aria-hidden="true" data-v-50d17b3a><svg viewBox="0 0 24 24" data-v-50d17b3a><path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" data-v-50d17b3a></path></svg></span><span class="lab-highlight-label" data-v-50d17b3a>Available panels</span><strong data-v-50d17b3a>${ssrInterpolate(unref(kits).length)}</strong><span class="lab-highlight-note" data-v-50d17b3a>Choose a panel to view its included markers.</span></aside></section><section class="kit-section" aria-label="Available collection kits" data-v-50d17b3a><div class="kit-section-heading" data-v-50d17b3a><div data-v-50d17b3a><span class="lab-kicker" data-v-50d17b3a>Explore testing</span><h2 data-v-50d17b3a>Collection kits</h2></div><span class="kit-section-count" data-v-50d17b3a>${ssrInterpolate(unref(kits).length)} panels</span></div>`);
      if (unref(kits).length) {
        _push(`<div class="kit-grid" data-v-50d17b3a><!--[-->`);
        ssrRenderList(unref(kits), (kit) => {
          _push(`<article class="kit-card" data-v-50d17b3a><div class="kit-card-top" data-v-50d17b3a><span class="${ssrRenderClass([kit.badgeClass, "kit-badge"])}" data-v-50d17b3a>${ssrInterpolate(kit.badge)}</span><div class="kit-price" data-v-50d17b3a><span data-v-50d17b3a>Price</span><strong data-v-50d17b3a><small data-v-50d17b3a>Rs.</small> ${ssrInterpolate(kit.price)}</strong></div></div><div class="kit-title-block" data-v-50d17b3a><span class="kit-icon" aria-hidden="true" data-v-50d17b3a><svg viewBox="0 0 24 24" data-v-50d17b3a><path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" data-v-50d17b3a></path></svg></span><div data-v-50d17b3a><h3 data-v-50d17b3a>${ssrInterpolate(kit.name)}</h3><p data-v-50d17b3a>${ssrInterpolate(kit.description)}</p></div></div><div class="kit-markers" data-v-50d17b3a><span class="kit-markers-label" data-v-50d17b3a>Included markers</span><div class="marker-list" data-v-50d17b3a><!--[-->`);
          ssrRenderList(kit.markers, (marker, i) => {
            _push(`<span data-v-50d17b3a>${ssrInterpolate(marker)}</span>`);
          });
          _push(`<!--]--></div></div><div class="kit-actions" data-v-50d17b3a><button class="kit-order-button" type="button"${ssrIncludeBooleanAttr(unref(orderingId) === kit.id) ? " disabled" : ""} data-v-50d17b3a>${ssrInterpolate(unref(orderingId) === kit.id ? "Ordering..." : "Order kit")}</button><button class="kit-edit-button" type="button" data-v-50d17b3a> Edit </button><button class="kit-delete-button" type="button"${ssrRenderAttr("aria-label", `Delete ${kit.name}`)} data-v-50d17b3a><svg viewBox="0 0 24 24" aria-hidden="true" data-v-50d17b3a><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" data-v-50d17b3a></path></svg></button></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="kit-empty" data-v-50d17b3a><span class="kit-empty-icon" aria-hidden="true" data-v-50d17b3a><svg viewBox="0 0 24 24" data-v-50d17b3a><path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" data-v-50d17b3a></path></svg></span><h3 data-v-50d17b3a>No collection kits available</h3><p data-v-50d17b3a>New panels will appear here when they become available.</p></div>`);
      }
      _push(`</section><section class="orders-panel" data-v-50d17b3a><div class="orders-heading" data-v-50d17b3a><div class="orders-title" data-v-50d17b3a><span class="orders-icon" aria-hidden="true" data-v-50d17b3a><svg viewBox="0 0 24 24" data-v-50d17b3a><path d="M6 3h12l2 4H4l2-4ZM4 7v13h16V7M9 11h6m-6 4h6" data-v-50d17b3a></path></svg></span><div data-v-50d17b3a><span class="lab-kicker" data-v-50d17b3a>Order history</span><h2 data-v-50d17b3a>Your orders</h2><p data-v-50d17b3a>Review your collection kit orders and lab status.</p></div></div><button class="add-kit-toggle" type="button"${ssrRenderAttr("aria-expanded", unref(showAddKit))} data-v-50d17b3a>`);
      if (!unref(showAddKit)) {
        _push(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-50d17b3a><path d="M12 5v14M5 12h14" data-v-50d17b3a></path></svg>`);
      } else {
        _push(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-50d17b3a><path d="M5 12h14" data-v-50d17b3a></path></svg>`);
      }
      _push(` ${ssrInterpolate(unref(showAddKit) ? "Close form" : "Add kit")}</button></div>`);
      if (unref(showAddKit)) {
        _push(`<div class="kit-editor" data-v-50d17b3a><div class="editor-heading" data-v-50d17b3a><div data-v-50d17b3a><span class="lab-kicker" data-v-50d17b3a>${ssrInterpolate(unref(editingId) ? "Edit panel" : "New panel")}</span><h3 data-v-50d17b3a>${ssrInterpolate(unref(editingId) ? "Update collection kit" : "Add a collection kit")}</h3></div></div><div class="editor-fields" data-v-50d17b3a><label class="editor-field" data-v-50d17b3a><span data-v-50d17b3a>Kit name</span><input${ssrRenderAttr("value", unref(kitForm).name)} placeholder="e.g. Complete Blood Count" data-v-50d17b3a></label><label class="editor-field" data-v-50d17b3a><span data-v-50d17b3a>Badge</span><input${ssrRenderAttr("value", unref(kitForm).badge)} placeholder="e.g. Popular" data-v-50d17b3a></label><label class="editor-field" data-v-50d17b3a><span data-v-50d17b3a>Price (Rs.)</span><input${ssrRenderAttr("value", unref(kitForm).price)} inputmode="decimal" placeholder="e.g. 799" data-v-50d17b3a></label><label class="editor-field editor-field-wide" data-v-50d17b3a><span data-v-50d17b3a>Description</span><input${ssrRenderAttr("value", unref(kitForm).description)} placeholder="Briefly describe this panel" data-v-50d17b3a></label><label class="editor-field editor-field-wide" data-v-50d17b3a><span data-v-50d17b3a>Included markers</span><input${ssrRenderAttr("value", unref(markersInput))} placeholder="Separate markers with commas" data-v-50d17b3a></label></div><div class="editor-actions" data-v-50d17b3a><button class="kit-order-button" type="button" data-v-50d17b3a>${ssrInterpolate(unref(editingId) ? "Save changes" : "Save kit")}</button><button class="kit-edit-button" type="button" data-v-50d17b3a> Reset </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="order-loading" aria-label="Loading orders" data-v-50d17b3a><!--[-->`);
        ssrRenderList(2, (n) => {
          _push(`<div class="order-skeleton" aria-hidden="true" data-v-50d17b3a></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(orders).length) {
        _push(`<div class="order-list" data-v-50d17b3a><!--[-->`);
        ssrRenderList(unref(orders), (order) => {
          _push(`<article class="order-card" data-v-50d17b3a><div class="order-card-main" data-v-50d17b3a><span class="order-kit-icon" aria-hidden="true" data-v-50d17b3a><svg viewBox="0 0 24 24" data-v-50d17b3a><path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" data-v-50d17b3a></path></svg></span><div data-v-50d17b3a><h3 data-v-50d17b3a>${ssrInterpolate(order.kitName)}</h3><p data-v-50d17b3a>Ordered ${ssrInterpolate(formatDate(order.createdAt))} <span data-v-50d17b3a>\xB7</span> Rs. ${ssrInterpolate(order.price)}</p></div></div><div class="order-card-actions" data-v-50d17b3a><span class="${ssrRenderClass([statusClass(order.status), "order-status"])}" data-v-50d17b3a>${ssrInterpolate(order.status)}</span><button class="cancel-order-button" type="button"${ssrRenderAttr("aria-label", `Cancel order for ${order.kitName}`)} data-v-50d17b3a> Cancel </button></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="orders-empty" data-v-50d17b3a><span class="orders-empty-icon" aria-hidden="true" data-v-50d17b3a><svg viewBox="0 0 24 24" data-v-50d17b3a><path d="M6 3h12l2 4H4l2-4ZM4 7v13h16V7M9 11h6m-6 4h6" data-v-50d17b3a></path></svg></span><h3 data-v-50d17b3a>No orders yet</h3><p data-v-50d17b3a>Your kit orders and updates will appear here.</p></div>`);
      }
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lab-kits.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const labKits = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-50d17b3a"]]);

export { labKits as default };
//# sourceMappingURL=lab-kits-B_Hzhe1G.mjs.map
