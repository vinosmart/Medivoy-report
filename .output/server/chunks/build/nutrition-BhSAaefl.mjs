import { defineComponent, ref, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
  __name: "nutrition",
  __ssrInlineRender: true,
  setup(__props) {
    useMedivoyApi();
    const guidance = ref(null);
    const generating = ref(false);
    const reportLoading = ref(false);
    const error = ref("");
    const animateNutritionTitle = ref(false);
    const profile = reactive({ goal: "", diet: "", region: "" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "nutrition-page" }, _attrs))} data-v-3a4b910d><section class="nutrition-intro" data-v-3a4b910d><div class="nutrition-intro-copy" data-v-3a4b910d><span class="nutrition-eyebrow" data-v-3a4b910d><svg viewBox="0 0 24 24" aria-hidden="true" data-v-3a4b910d><path d="M20 4C11 4 5 7.5 5 14a6 6 0 0 0 6 6c6.5 0 9-7 9-16Z" data-v-3a4b910d></path><path d="M4 21c3-5 7-8 12-11" data-v-3a4b910d></path></svg> Nutrition guidance </span><h1 data-v-3a4b910d>Small choices. <span class="${ssrRenderClass(["nutrition-heading-accent", { "nutrition-heading-typewriter-active": unref(animateNutritionTitle) }])}" data-v-3a4b910d>A healthier routine.</span></h1><p data-v-3a4b910d> Get personalized food, vitamin, and habit guidance using your health goal, preferences, and available report data. </p></div><aside class="nutrition-highlight" data-v-3a4b910d><span class="highlight-icon" aria-hidden="true" data-v-3a4b910d><svg viewBox="0 0 24 24" data-v-3a4b910d><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" data-v-3a4b910d></path><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" data-v-3a4b910d></path></svg></span><span class="highlight-label" data-v-3a4b910d>Personalized for you</span><strong data-v-3a4b910d>Guidance shaped by your profile</strong><span class="highlight-note" data-v-3a4b910d>Goal \xB7 diet \xB7 available report data</span></aside></section><section class="nutrition-panel" aria-labelledby="nutrition-preferences-title" data-v-3a4b910d><div class="nutrition-panel-heading" data-v-3a4b910d><div class="nutrition-heading-icon" aria-hidden="true" data-v-3a4b910d><svg viewBox="0 0 24 24" data-v-3a4b910d><path d="M4 7h16M4 17h16" data-v-3a4b910d></path><circle cx="9" cy="7" r="2" data-v-3a4b910d></circle><circle cx="15" cy="17" r="2" data-v-3a4b910d></circle></svg></div><div class="nutrition-heading-copy" data-v-3a4b910d><span class="nutrition-kicker" data-v-3a4b910d>Your preferences</span><h2 id="nutrition-preferences-title" data-v-3a4b910d>Personalize your guidance</h2><p data-v-3a4b910d>Choose a goal and preferences to shape your recommendations.</p></div>`);
      if (unref(guidance) && !unref(error)) {
        _push(`<div class="nutrition-success" role="status" data-v-3a4b910d><svg viewBox="0 0 24 24" aria-hidden="true" data-v-3a4b910d><path d="m5 12 4 4L19 6" data-v-3a4b910d></path></svg> Guidance ready </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="nutrition-fields" data-v-3a4b910d><label class="nutrition-field" data-v-3a4b910d><span data-v-3a4b910d>Health goal</span><select data-v-3a4b910d><option value="" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).goal) ? ssrLooseContain(unref(profile).goal, "") : ssrLooseEqual(unref(profile).goal, "")) ? " selected" : ""}>Choose your goal</option><option value="weight_loss" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).goal) ? ssrLooseContain(unref(profile).goal, "weight_loss") : ssrLooseEqual(unref(profile).goal, "weight_loss")) ? " selected" : ""}>Weight loss</option><option value="muscle_gain" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).goal) ? ssrLooseContain(unref(profile).goal, "muscle_gain") : ssrLooseEqual(unref(profile).goal, "muscle_gain")) ? " selected" : ""}>Muscle gain</option><option value="heart_health" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).goal) ? ssrLooseContain(unref(profile).goal, "heart_health") : ssrLooseEqual(unref(profile).goal, "heart_health")) ? " selected" : ""}>Heart health</option><option value="diabetes_control" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).goal) ? ssrLooseContain(unref(profile).goal, "diabetes_control") : ssrLooseEqual(unref(profile).goal, "diabetes_control")) ? " selected" : ""}>Diabetes control</option><option value="longevity" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).goal) ? ssrLooseContain(unref(profile).goal, "longevity") : ssrLooseEqual(unref(profile).goal, "longevity")) ? " selected" : ""}>Longevity</option><option value="energy" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).goal) ? ssrLooseContain(unref(profile).goal, "energy") : ssrLooseEqual(unref(profile).goal, "energy")) ? " selected" : ""}>Energy and focus</option></select></label><label class="nutrition-field" data-v-3a4b910d><span data-v-3a4b910d>Diet preference</span><select data-v-3a4b910d><option value="" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).diet) ? ssrLooseContain(unref(profile).diet, "") : ssrLooseEqual(unref(profile).diet, "")) ? " selected" : ""}>Choose a diet</option><option value="omnivore" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).diet) ? ssrLooseContain(unref(profile).diet, "omnivore") : ssrLooseEqual(unref(profile).diet, "omnivore")) ? " selected" : ""}>Omnivore</option><option value="vegetarian" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).diet) ? ssrLooseContain(unref(profile).diet, "vegetarian") : ssrLooseEqual(unref(profile).diet, "vegetarian")) ? " selected" : ""}>Vegetarian</option><option value="vegan" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).diet) ? ssrLooseContain(unref(profile).diet, "vegan") : ssrLooseEqual(unref(profile).diet, "vegan")) ? " selected" : ""}>Vegan</option><option value="keto" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).diet) ? ssrLooseContain(unref(profile).diet, "keto") : ssrLooseEqual(unref(profile).diet, "keto")) ? " selected" : ""}>Keto</option><option value="mediterranean" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).diet) ? ssrLooseContain(unref(profile).diet, "mediterranean") : ssrLooseEqual(unref(profile).diet, "mediterranean")) ? " selected" : ""}>Mediterranean</option></select></label><label class="nutrition-field" data-v-3a4b910d><span data-v-3a4b910d>Region</span><select data-v-3a4b910d><option value="" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).region) ? ssrLooseContain(unref(profile).region, "") : ssrLooseEqual(unref(profile).region, "")) ? " selected" : ""}>Choose a region</option><option value="south_asian" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).region) ? ssrLooseContain(unref(profile).region, "south_asian") : ssrLooseEqual(unref(profile).region, "south_asian")) ? " selected" : ""}>South Asian</option><option value="east_asian" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).region) ? ssrLooseContain(unref(profile).region, "east_asian") : ssrLooseEqual(unref(profile).region, "east_asian")) ? " selected" : ""}>East Asian</option><option value="african" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).region) ? ssrLooseContain(unref(profile).region, "african") : ssrLooseEqual(unref(profile).region, "african")) ? " selected" : ""}>African</option><option value="western" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).region) ? ssrLooseContain(unref(profile).region, "western") : ssrLooseEqual(unref(profile).region, "western")) ? " selected" : ""}>Western</option><option value="middle_eastern" data-v-3a4b910d${ssrIncludeBooleanAttr(Array.isArray(unref(profile).region) ? ssrLooseContain(unref(profile).region, "middle_eastern") : ssrLooseEqual(unref(profile).region, "middle_eastern")) ? " selected" : ""}>Middle Eastern</option></select></label></div><div class="nutrition-panel-footer" data-v-3a4b910d><p data-v-3a4b910d>Recommendations are based on the information available in your profile.</p><button class="nutrition-submit" type="button"${ssrIncludeBooleanAttr(unref(generating)) ? " disabled" : ""} data-v-3a4b910d>`);
      if (unref(generating)) {
        _push(`<svg class="nutrition-spinner" viewBox="0 0 24 24" aria-hidden="true" data-v-3a4b910d><circle cx="12" cy="12" r="9" data-v-3a4b910d></circle><path d="M12 3a9 9 0 0 1 9 9" data-v-3a4b910d></path></svg>`);
      } else {
        _push(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-3a4b910d><path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.6-6.4-2.1 2.1m-6.6 6.6-2.1 2.1m0-10.8 2.1 2.1m6.6 6.6 2.1 2.1" data-v-3a4b910d></path></svg>`);
      }
      _push(` ${ssrInterpolate(unref(generating) ? "Generating guidance..." : "Generate guidance")}</button></div>`);
      if (unref(error)) {
        _push(`<p class="nutrition-error" role="alert" data-v-3a4b910d><svg viewBox="0 0 24 24" aria-hidden="true" data-v-3a4b910d><circle cx="12" cy="12" r="9" data-v-3a4b910d></circle><path d="M12 8v5m0 3h.01" data-v-3a4b910d></path></svg> ${ssrInterpolate(unref(error))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
      if (unref(reportLoading)) {
        _push(`<section class="guidance-loading" aria-label="Generating recommendations" data-v-3a4b910d><div class="loading-heading" data-v-3a4b910d></div><div class="loading-grid" data-v-3a4b910d><div class="loading-card" data-v-3a4b910d></div><div class="loading-card" data-v-3a4b910d></div></div><div class="loading-card loading-wide" data-v-3a4b910d></div></section>`);
      } else if (unref(guidance)) {
        _push(`<section class="guidance-results" aria-label="Nutrition recommendations" data-v-3a4b910d><div class="guidance-context" data-v-3a4b910d><span class="context-icon" aria-hidden="true" data-v-3a4b910d><svg viewBox="0 0 24 24" data-v-3a4b910d><path d="M12 3v18M3 12h18" data-v-3a4b910d></path><circle cx="12" cy="12" r="8" data-v-3a4b910d></circle></svg></span><div class="context-copy" data-v-3a4b910d><span class="nutrition-kicker" data-v-3a4b910d>Your nutrition plan</span><p data-v-3a4b910d> Prepared for <strong data-v-3a4b910d>${ssrInterpolate(unref(guidance).subject || "Myself")}</strong>`);
        if (unref(guidance).sourceReport) {
          _push(`<span data-v-3a4b910d> \xB7 Based on ${ssrInterpolate(unref(guidance).sourceReport)}</span>`);
        } else {
          _push(`<span data-v-3a4b910d> \xB7 Based on your profile</span>`);
        }
        _push(`</p></div></div><div class="recommendation-grid" data-v-3a4b910d><article class="recommendation-card eat-card" data-v-3a4b910d><div class="recommendation-heading" data-v-3a4b910d><span class="recommendation-icon" aria-hidden="true" data-v-3a4b910d><svg viewBox="0 0 24 24" data-v-3a4b910d><path d="M20 4C11 4 5 7.5 5 14a6 6 0 0 0 6 6c6.5 0 9-7 9-16Z" data-v-3a4b910d></path><path d="M4 21c3-5 7-8 12-11" data-v-3a4b910d></path></svg></span><div data-v-3a4b910d><span class="recommendation-kicker" data-v-3a4b910d>Food choices</span><h3 data-v-3a4b910d>Enjoy more often</h3></div></div><ul class="recommendation-list" data-v-3a4b910d><!--[-->`);
        ssrRenderList(unref(guidance).eat, (food, i) => {
          _push(`<li data-v-3a4b910d><span class="list-marker" aria-hidden="true" data-v-3a4b910d><svg viewBox="0 0 24 24" data-v-3a4b910d><path d="m5 12 4 4L19 6" data-v-3a4b910d></path></svg></span> ${ssrInterpolate(food)}</li>`);
        });
        _push(`<!--]--></ul></article><article class="recommendation-card avoid-card" data-v-3a4b910d><div class="recommendation-heading" data-v-3a4b910d><span class="recommendation-icon" aria-hidden="true" data-v-3a4b910d><svg viewBox="0 0 24 24" data-v-3a4b910d><path d="M12 3v18M3 12h18" data-v-3a4b910d></path><circle cx="12" cy="12" r="8.5" data-v-3a4b910d></circle></svg></span><div data-v-3a4b910d><span class="recommendation-kicker" data-v-3a4b910d>Mindful choices</span><h3 data-v-3a4b910d>Reduce or avoid</h3></div></div><ul class="recommendation-list" data-v-3a4b910d><!--[-->`);
        ssrRenderList(unref(guidance).avoid, (food, i) => {
          _push(`<li data-v-3a4b910d><span class="list-marker" aria-hidden="true" data-v-3a4b910d><svg viewBox="0 0 24 24" data-v-3a4b910d><path d="M5 12h14" data-v-3a4b910d></path></svg></span> ${ssrInterpolate(food)}</li>`);
        });
        _push(`<!--]--></ul></article></div><article class="recommendation-card vitamins-card" data-v-3a4b910d><div class="recommendation-heading" data-v-3a4b910d><span class="recommendation-icon" aria-hidden="true" data-v-3a4b910d><svg viewBox="0 0 24 24" data-v-3a4b910d><path d="M8 4h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8Zm0 8h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8Z" data-v-3a4b910d></path><path d="M12 4v8m0 0v8" data-v-3a4b910d></path></svg></span><div data-v-3a4b910d><span class="recommendation-kicker" data-v-3a4b910d>Nutrient support</span><h3 data-v-3a4b910d>Vitamins and supplements</h3></div></div><div class="vitamin-list" data-v-3a4b910d><!--[-->`);
        ssrRenderList(unref(guidance).vitamins, (vitamin, i) => {
          _push(`<span data-v-3a4b910d>${ssrInterpolate(vitamin)}</span>`);
        });
        _push(`<!--]--></div></article><article class="recommendation-card habits-card" data-v-3a4b910d><div class="recommendation-heading" data-v-3a4b910d><span class="recommendation-icon" aria-hidden="true" data-v-3a4b910d><svg viewBox="0 0 24 24" data-v-3a4b910d><circle cx="12" cy="12" r="9" data-v-3a4b910d></circle><path d="M12 7v5l3 2" data-v-3a4b910d></path></svg></span><div data-v-3a4b910d><span class="recommendation-kicker" data-v-3a4b910d>Everyday wellness</span><h3 data-v-3a4b910d>Daily habits</h3></div></div><ul class="habit-list" data-v-3a4b910d><!--[-->`);
        ssrRenderList(unref(guidance).habits, (habit, i) => {
          _push(`<li data-v-3a4b910d><span data-v-3a4b910d>${ssrInterpolate(String(i + 1).padStart(2, "0"))}</span> ${ssrInterpolate(habit)}</li>`);
        });
        _push(`<!--]--></ul></article><p class="nutrition-disclaimer" data-v-3a4b910d> AI-generated guidance \xB7 Not a substitute for professional medical advice </p></section>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/nutrition.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const nutrition = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3a4b910d"]]);

export { nutrition as default };
//# sourceMappingURL=nutrition-BhSAaefl.mjs.map
