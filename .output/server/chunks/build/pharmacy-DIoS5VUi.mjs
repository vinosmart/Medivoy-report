import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "pharmacy",
  __ssrInlineRender: true,
  setup(__props) {
    useMedivoyApi();
    const searchQuery = ref("");
    const results = ref([]);
    const searching = ref(false);
    const doctors = ref([]);
    const suggestions = ref(null);
    const searchPlaceholder = ref("");
    const categories = [
      { name: "Paracetamol", icon: "\u{1F48A}" },
      { name: "Vitamins", icon: "\u{1F48A}" },
      { name: "Antibiotics", icon: "\u{1F48A}" },
      { name: "Blood Pressure", icon: "\u2764\uFE0F" },
      { name: "Diabetes", icon: "\u{1FA78}" },
      { name: "Supplements", icon: "\u{1F48A}" }
    ];
    const specialties = [
      "General Physician",
      "Cardiologist",
      "Dermatologist",
      "ENT Specialist",
      "Gynecologist",
      "Pediatrician",
      "Orthopedic",
      "Ophthalmologist"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pharmacy-page" }, _attrs))} data-v-4c628e31><div class="disclaimer-banner" role="note" data-v-4c628e31><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-4c628e31><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" data-v-4c628e31></path><line x1="12" y1="8" x2="12" y2="12" data-v-4c628e31></line><line x1="12" y1="16" x2="12.01" y2="16" data-v-4c628e31></line></svg><div data-v-4c628e31><strong data-v-4c628e31>Medical Disclaimer:</strong> For information only. Consult a doctor or pharmacist before taking medication. Do not self-medicate. </div></div><div class="pharmacy-header" data-v-4c628e31><span class="pharmacy-eyebrow" data-v-4c628e31>MEDICINES &amp; CARE</span><h1 class="page-title" data-v-4c628e31>Pharmacy</h1><p class="page-subtitle" data-v-4c628e31>Search medicines, find doctors, and order from nearby pharmacies</p><div class="search-section" data-v-4c628e31><div class="search-heading" data-v-4c628e31><div data-v-4c628e31><h2 data-v-4c628e31>Find a medicine</h2><p data-v-4c628e31>Search by medicine, vitamin, or supplement name.</p></div></div><div class="search-bar" data-v-4c628e31><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" aria-hidden="true" data-v-4c628e31><circle cx="11" cy="11" r="8" data-v-4c628e31></circle><path d="M21 21l-4.35-4.35" data-v-4c628e31></path></svg><input${ssrRenderAttr("value", unref(searchQuery))} type="text" aria-label="Search medicines, vitamins, or supplements"${ssrRenderAttr("placeholder", unref(searchPlaceholder))} data-v-4c628e31>`);
      if (unref(searchQuery)) {
        _push(`<button type="button" class="clear-btn" aria-label="Clear search" data-v-4c628e31><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-4c628e31><line x1="18" y1="6" x2="6" y2="18" data-v-4c628e31></line><line x1="6" y1="6" x2="18" y2="18" data-v-4c628e31></line></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (((_b = (_a = unref(suggestions)) == null ? void 0 : _a.medicineSuggestions) == null ? void 0 : _b.length) || ((_d = (_c = unref(suggestions)) == null ? void 0 : _c.doctorSuggestions) == null ? void 0 : _d.length)) {
        _push(`<section class="card suggestions-card" data-v-4c628e31><h2 class="card-title" data-v-4c628e31>Suggested for You</h2><p class="card-desc" data-v-4c628e31>Based on your latest report analysis &quot;${ssrInterpolate(unref(suggestions).reportTitle)}&quot;, cross-checked against live pharmacy stock.</p>`);
        if ((_e = unref(suggestions).medicineSuggestions) == null ? void 0 : _e.length) {
          _push(`<div class="med-suggestions-list" data-v-4c628e31><!--[-->`);
          ssrRenderList(unref(suggestions).medicineSuggestions, (med, idx) => {
            var _a2, _b2, _c2, _d2, _e2, _f2;
            _push(`<div class="${ssrRenderClass(["med-type-" + med.type, "med-suggestion-item"])}" data-v-4c628e31><div class="med-suggestion-header" data-v-4c628e31><span class="med-suggestion-type" data-v-4c628e31>${ssrInterpolate(med.type === "medicine" ? "\u{1F48A}" : med.type === "vitamin" ? "\u{1F48A}" : "\u{1F33F}")} ${ssrInterpolate(med.type)}</span>`);
            if ((_b2 = (_a2 = med.live) == null ? void 0 : _a2.isPrescriptionRequired) != null ? _b2 : med.isPrescriptionRequired) {
              _push(`<span class="rx-badge" data-v-4c628e31>Rx</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><h3 class="med-name" data-v-4c628e31>${ssrInterpolate(((_c2 = med.live) == null ? void 0 : _c2.brandName) || med.name)}</h3>`);
            if ((_d2 = med.live) == null ? void 0 : _d2.genericName) {
              _push(`<p class="med-generic" data-v-4c628e31>${ssrInterpolate(med.live.genericName)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<p class="med-suggestion-reason" data-v-4c628e31>${ssrInterpolate(med.reason)}</p>`);
            if (med.evidence) {
              _push(`<p class="med-suggestion-evidence" data-v-4c628e31>Evidence: ${ssrInterpolate(med.evidence)}</p>`);
            } else {
              _push(`<!---->`);
            }
            if (((_e2 = med.live) == null ? void 0 : _e2.sellPricePaise) != null) {
              _push(`<div class="med-price" data-v-4c628e31><span class="price" data-v-4c628e31>\u20B9${ssrInterpolate((med.live.sellPricePaise / 100).toFixed(2))}</span>`);
              if (med.live.mrpPaise) {
                _push(`<span class="mrp" data-v-4c628e31>MRP \u20B9${ssrInterpolate((med.live.mrpPaise / 100).toFixed(2))}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            if ((_f2 = med.live) == null ? void 0 : _f2.slug) {
              _push(`<a${ssrRenderAttr("href", `https://pharmacy.medivoy.ae/product/${med.live.slug}`)} target="_blank" rel="noopener noreferrer" class="buy-btn" data-v-4c628e31> Buy Now \u2192 </a>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_f = unref(suggestions).doctorSuggestions) == null ? void 0 : _f.length) {
          _push(`<div class="doctor-list suggested-doctors" data-v-4c628e31><!--[-->`);
          ssrRenderList(unref(suggestions).doctorSuggestions, (doc) => {
            var _a2;
            _push(`<div class="doctor-card" data-v-4c628e31><div class="doc-avatar" data-v-4c628e31>${ssrInterpolate((doc.name || "Dr. ")[0])}</div><div class="doc-info" data-v-4c628e31><p class="doc-name" data-v-4c628e31>${ssrInterpolate(doc.name || "Doctor")}</p><p class="doc-spec" data-v-4c628e31>${ssrInterpolate(doc.specialty || ((_a2 = doc.specialties) == null ? void 0 : _a2.join(", ")) || "General Physician")}</p>`);
            if (doc.experience) {
              _push(`<p class="doc-exp" data-v-4c628e31>${ssrInterpolate(doc.experience)} years experience</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(searching)) {
        _push(`<div class="loading-section" data-v-4c628e31><div class="loading-spinner" data-v-4c628e31></div><p data-v-4c628e31>Searching medicines...</p></div>`);
      } else if (unref(results).length) {
        _push(`<div class="results-grid" data-v-4c628e31><!--[-->`);
        ssrRenderList(unref(results), (med) => {
          var _a2;
          _push(`<div class="medicine-card" data-v-4c628e31><div class="med-header" data-v-4c628e31><span class="${ssrRenderClass([(_a2 = med.type) == null ? void 0 : _a2.toLowerCase(), "med-type"])}" data-v-4c628e31>${ssrInterpolate(med.type || "Medicine")}</span>`);
          if (med.isPrescriptionRequired) {
            _push(`<span class="rx-badge" data-v-4c628e31>Rx</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><h3 class="med-name" data-v-4c628e31>${ssrInterpolate(med.brandName || med.name)}</h3>`);
          if (med.genericName) {
            _push(`<p class="med-generic" data-v-4c628e31>${ssrInterpolate(med.genericName)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (med.manufacturer) {
            _push(`<p class="med-manufacturer" data-v-4c628e31>${ssrInterpolate(med.manufacturer)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (med.packText) {
            _push(`<div class="med-pack" data-v-4c628e31>${ssrInterpolate(med.packText)}</div>`);
          } else {
            _push(`<!---->`);
          }
          if (med.sellPricePaise != null) {
            _push(`<div class="med-price" data-v-4c628e31><span class="price" data-v-4c628e31>\u20B9${ssrInterpolate((med.sellPricePaise / 100).toFixed(2))}</span>`);
            if (med.mrpPaise) {
              _push(`<span class="mrp" data-v-4c628e31>MRP \u20B9${ssrInterpolate((med.mrpPaise / 100).toFixed(2))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (med.slug) {
            _push(`<a${ssrRenderAttr("href", `https://pharmacy.medivoy.ae/product/${med.slug}`)} target="_blank" rel="noopener noreferrer" class="buy-btn" data-v-4c628e31> Buy Now \u2192 </a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(searchQuery) && !unref(searching)) {
        _push(`<div class="empty-state" data-v-4c628e31><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" data-v-4c628e31><circle cx="11" cy="11" r="8" data-v-4c628e31></circle><path d="M21 21l-4.35-4.35" data-v-4c628e31></path></svg><h3 data-v-4c628e31>No medicines found</h3><p data-v-4c628e31>Try a different search term or check the spelling.</p></div>`);
      } else {
        _push(`<div class="default-sections" data-v-4c628e31><section class="card" data-v-4c628e31><h2 class="card-title" data-v-4c628e31>Browse Categories</h2><div class="category-grid" data-v-4c628e31><!--[-->`);
        ssrRenderList(categories, (cat) => {
          _push(`<button type="button" class="category-chip" data-v-4c628e31><span data-v-4c628e31>${ssrInterpolate(cat.name)}</span></button>`);
        });
        _push(`<!--]--></div></section><section class="card" data-v-4c628e31><h2 class="card-title" data-v-4c628e31>Find a Doctor</h2><p class="card-desc" data-v-4c628e31>Search for doctors by specialty to book a consultation.</p><div class="doctor-specialties" data-v-4c628e31><!--[-->`);
        ssrRenderList(specialties, (spec) => {
          _push(`<button type="button" class="specialty-btn" data-v-4c628e31>${ssrInterpolate(spec)}</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(doctors).length) {
          _push(`<div class="doctor-list" data-v-4c628e31><!--[-->`);
          ssrRenderList(unref(doctors), (doc) => {
            var _a2;
            _push(`<div class="doctor-card" data-v-4c628e31><div class="doc-avatar" data-v-4c628e31>${ssrInterpolate((doc.name || "Dr. ")[0])}</div><div class="doc-info" data-v-4c628e31><p class="doc-name" data-v-4c628e31>${ssrInterpolate(doc.name || "Doctor")}</p><p class="doc-spec" data-v-4c628e31>${ssrInterpolate(doc.specialty || ((_a2 = doc.specialties) == null ? void 0 : _a2.join(", ")) || "General Physician")}</p>`);
            if (doc.experience) {
              _push(`<p class="doc-exp" data-v-4c628e31>${ssrInterpolate(doc.experience)} years experience</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pharmacy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const pharmacy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4c628e31"]]);

export { pharmacy as default };
//# sourceMappingURL=pharmacy-DIoS5VUi.mjs.map
