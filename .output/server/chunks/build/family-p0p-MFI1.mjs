import { defineComponent, reactive, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
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
  __name: "family",
  __ssrInlineRender: true,
  setup(__props) {
    useMedivoyApi();
    const relations = [
      "Father",
      "Mother",
      "Brother",
      "Sister",
      "Grandfather",
      "Grandmother",
      "Uncle",
      "Aunt",
      "Son",
      "Daughter"
    ];
    const form = reactive({ name: "", relation: "", age: "", conditions: "" });
    const members = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const splitConditions = (c) => c ? c.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const riskConditions = computed(() => {
      const count = {};
      for (const m of members.value)
        for (const c of splitConditions(m.conditions)) {
          const k = c.toLowerCase();
          count[k] = (count[k] || 0) + 1;
        }
      return Object.entries(count).filter(([, v]) => v > 1).map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "family-page" }, _attrs))} data-v-e29b1e27><section class="family-intro" data-v-e29b1e27><div class="family-intro-copy" data-v-e29b1e27><span class="family-eyebrow" data-v-e29b1e27><svg viewBox="0 0 24 24" aria-hidden="true" data-v-e29b1e27><path d="M12 20v-7m0 0-5-4m5 4 5-4M7 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm10 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" data-v-e29b1e27></path></svg> Family health </span><h1 data-v-e29b1e27>A more complete picture of your <span class="family-intro-accent" data-v-e29b1e27>family\u2019s health</span>.</h1><p data-v-e29b1e27> Keep important family history together and make it easier to discuss with your care team. </p></div><div class="family-total" aria-label="Family member count" data-v-e29b1e27><span class="family-total-label" data-v-e29b1e27>Family members</span><div class="family-total-value" data-v-e29b1e27><strong data-v-e29b1e27>${ssrInterpolate(unref(members).length)}</strong><span data-v-e29b1e27>${ssrInterpolate(unref(members).length === 1 ? "relative" : "relatives")}</span></div><span class="family-total-note" data-v-e29b1e27>in your health profile</span></div></section><form class="family-panel family-form" data-v-e29b1e27><div class="family-panel-heading" data-v-e29b1e27><div class="family-heading-icon" aria-hidden="true" data-v-e29b1e27><svg viewBox="0 0 24 24" data-v-e29b1e27><path d="M12 5v14M5 12h14" data-v-e29b1e27></path></svg></div><div class="family-heading-copy" data-v-e29b1e27><span class="family-kicker" data-v-e29b1e27>Family profile</span><h2 data-v-e29b1e27>Add a family member</h2></div><button class="family-submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} type="submit" data-v-e29b1e27>`);
      if (!unref(saving)) {
        _push(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-e29b1e27><path d="M12 5v14M5 12h14" data-v-e29b1e27></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(saving) ? "Saving..." : "Add member")}</button></div><div class="family-fields" data-v-e29b1e27><label class="family-field" data-v-e29b1e27><span data-v-e29b1e27>Name</span><input${ssrRenderAttr("value", unref(form).name)} autocomplete="off" placeholder="Enter their name" required data-v-e29b1e27></label><label class="family-field" data-v-e29b1e27><span data-v-e29b1e27>Relationship</span><select data-v-e29b1e27><option value="" data-v-e29b1e27${ssrIncludeBooleanAttr(Array.isArray(unref(form).relation) ? ssrLooseContain(unref(form).relation, "") : ssrLooseEqual(unref(form).relation, "")) ? " selected" : ""}>Select relationship</option><!--[-->`);
      ssrRenderList(relations, (r) => {
        _push(`<option${ssrRenderAttr("value", r)} data-v-e29b1e27${ssrIncludeBooleanAttr(Array.isArray(unref(form).relation) ? ssrLooseContain(unref(form).relation, r) : ssrLooseEqual(unref(form).relation, r)) ? " selected" : ""}>${ssrInterpolate(r)}</option>`);
      });
      _push(`<!--]--></select></label><label class="family-field" data-v-e29b1e27><span data-v-e29b1e27>Age <em data-v-e29b1e27>Optional</em></span><input${ssrRenderAttr("value", unref(form).age)} type="number" min="0" placeholder="Enter age" data-v-e29b1e27></label><label class="family-field family-field-wide" data-v-e29b1e27><span data-v-e29b1e27>Known conditions <em data-v-e29b1e27>Optional</em></span><input${ssrRenderAttr("value", unref(form).conditions)} placeholder="e.g. Diabetes, hypertension" data-v-e29b1e27><small data-v-e29b1e27>Separate multiple conditions with commas.</small></label></div></form><section class="family-panel family-members" data-v-e29b1e27><div class="family-list-heading" data-v-e29b1e27><div data-v-e29b1e27><span class="family-kicker" data-v-e29b1e27>Your family</span><h2 data-v-e29b1e27>Family members</h2></div><span class="family-count" data-v-e29b1e27>${ssrInterpolate(unref(members).length)} total</span></div>`);
      if (unref(loading)) {
        _push(`<div class="family-member-grid" aria-label="Loading family members" data-v-e29b1e27><!--[-->`);
        ssrRenderList(2, (n) => {
          _push(`<div class="family-skeleton" aria-hidden="true" data-v-e29b1e27></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(members).length) {
        _push(`<div class="family-member-grid" data-v-e29b1e27><!--[-->`);
        ssrRenderList(unref(members), (m) => {
          var _a;
          _push(`<article class="member-card" data-v-e29b1e27><div class="member-card-top" data-v-e29b1e27><div class="member-identity" data-v-e29b1e27><span class="member-avatar" aria-hidden="true" data-v-e29b1e27>${ssrInterpolate(((_a = m.name) == null ? void 0 : _a.slice(0, 1).toUpperCase()) || "?")}</span><div class="member-name-wrap" data-v-e29b1e27><h3 data-v-e29b1e27>${ssrInterpolate(m.name)}</h3><span class="member-relation" data-v-e29b1e27>${ssrInterpolate(m.relation)}</span></div></div><button class="member-remove" type="button"${ssrRenderAttr("aria-label", `Remove ${m.name}`)} data-v-e29b1e27><svg viewBox="0 0 24 24" aria-hidden="true" data-v-e29b1e27><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" data-v-e29b1e27></path></svg> Remove </button></div><div class="member-details" data-v-e29b1e27><span class="member-age" data-v-e29b1e27><svg viewBox="0 0 24 24" aria-hidden="true" data-v-e29b1e27><circle cx="12" cy="12" r="8.5" data-v-e29b1e27></circle><path d="M12 7v5l3 2" data-v-e29b1e27></path></svg> Age ${ssrInterpolate(m.age || "\u2014")}</span></div><div class="member-conditions" data-v-e29b1e27><span class="member-detail-label" data-v-e29b1e27>Known conditions</span><div class="condition-list" data-v-e29b1e27><!--[-->`);
          ssrRenderList(splitConditions(m.conditions), (c, ci) => {
            _push(`<span class="condition-chip" data-v-e29b1e27>${ssrInterpolate(c)}</span>`);
          });
          _push(`<!--]-->`);
          if (!splitConditions(m.conditions).length) {
            _push(`<span class="condition-empty" data-v-e29b1e27>None listed</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="family-empty" data-v-e29b1e27><div class="empty-illustration" aria-hidden="true" data-v-e29b1e27><svg viewBox="0 0 48 48" data-v-e29b1e27><circle cx="24" cy="12" r="5" data-v-e29b1e27></circle><circle cx="11" cy="21" r="4" data-v-e29b1e27></circle><circle cx="37" cy="21" r="4" data-v-e29b1e27></circle><path d="M15 39v-3a9 9 0 0 1 18 0v3M3 38v-2a7 7 0 0 1 10-6.3M45 38v-2a7 7 0 0 0-10-6.3" data-v-e29b1e27></path></svg></div><h3 data-v-e29b1e27>Your family profile starts here</h3><p data-v-e29b1e27> Add a parent, sibling, or child to keep family health history in one place. </p></div>`);
      }
      _push(`</section>`);
      if (unref(riskConditions).length) {
        _push(`<section class="family-risk" data-v-e29b1e27><div class="risk-icon" aria-hidden="true" data-v-e29b1e27><svg viewBox="0 0 24 24" data-v-e29b1e27><path d="M12 3 2.8 19h18.4L12 3Z" data-v-e29b1e27></path><path d="M12 9v4m0 3h.01" data-v-e29b1e27></path></svg></div><div class="risk-copy" data-v-e29b1e27><h2 data-v-e29b1e27>Conditions reported across family members</h2><p data-v-e29b1e27> These conditions appear in multiple family members. Consider discussing them with a clinician as part of a hereditary risk assessment. </p><div class="risk-tags" data-v-e29b1e27><!--[-->`);
        ssrRenderList(unref(riskConditions), (c, i) => {
          _push(`<span data-v-e29b1e27>${ssrInterpolate(c)}</span>`);
        });
        _push(`<!--]--></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/family.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const family = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e29b1e27"]]);

export { family as default };
//# sourceMappingURL=family-p0p-MFI1.mjs.map
