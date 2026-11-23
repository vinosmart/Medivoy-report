import { _ as __nuxt_component_0 } from './nuxt-link-CIcsgCdR.mjs';
import { defineComponent, reactive, ref, mergeProps, withCtx, createTextVNode, openBlock, createBlock, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { u as useMedivoyApi } from './useMedivoyApi-BieI7KwV.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './auth-DLg6Nzla.mjs';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "genetics",
  __ssrInlineRender: true,
  setup(__props) {
    useMedivoyApi();
    const genes = [
      { name: "APOE", options: ["E2/E2", "E2/E3", "E3/E3", "E3/E4", "E4/E4"] },
      {
        name: "MTHFR",
        options: [
          "Normal",
          "C677T heterozygous",
          "C677T homozygous",
          "A1298C heterozygous"
        ]
      },
      { name: "FTO", options: ["No risk variant", "Risk variant present"] },
      {
        name: "LCT",
        options: ["Lactase persistence", "Lactase persistence variant absent"]
      },
      { name: "HFE", options: ["Negative", "Heterozygous carrier", "Positive"] },
      {
        name: "CYP1A2",
        options: ["Fast metaboliser", "Slow metabolism variant present"]
      }
    ];
    const variants = reactive({});
    const result = ref(null);
    const loading = ref(true);
    const saving = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "genetics-page" }, _attrs))} data-v-54e35f84><section class="genetics-intro" data-v-54e35f84><div class="genetics-intro-copy" data-v-54e35f84><span class="genetics-eyebrow" data-v-54e35f84><svg viewBox="0 0 24 24" aria-hidden="true" data-v-54e35f84><path d="M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" data-v-54e35f84></path></svg> Genetic insights </span><h1 data-v-54e35f84>Understand your genetic <span class="genetics-heading-accent" data-v-54e35f84>health profile.</span></h1><p data-v-54e35f84> Review selected DNA markers in a clear, organized summary. Upload a report or enter known variants to get started. </p></div><div class="genetics-intro-note" data-v-54e35f84><span class="intro-note-icon" aria-hidden="true" data-v-54e35f84><svg viewBox="0 0 24 24" data-v-54e35f84><path d="M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" data-v-54e35f84></path></svg></span><span class="intro-note-label" data-v-54e35f84>Your profile</span><strong data-v-54e35f84>Genetic markers, made easier to review</strong><span class="intro-note-caption" data-v-54e35f84>For discussion with your care team</span></div></section><section class="genetics-workspace" data-v-54e35f84><div class="genetics-inputs" data-v-54e35f84><article class="genetics-card upload-card" data-v-54e35f84><div class="upload-card-heading" data-v-54e35f84><span class="genetics-icon" aria-hidden="true" data-v-54e35f84><svg viewBox="0 0 24 24" data-v-54e35f84><path d="M12 16V4m0 0L7 9m5-5 5 5M5 14v5h14v-5" data-v-54e35f84></path></svg></span><div data-v-54e35f84><span class="genetics-kicker" data-v-54e35f84>Report import</span><h2 data-v-54e35f84>Upload a DNA report</h2></div></div><p data-v-54e35f84> Upload a PDF or TXT report. Key markers such as APOE, MTHFR, FTO, LCT, HFE, and CYP1A2 can be extracted automatically. </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/reports/upload",
        class: "genetics-upload-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Upload DNA report <svg viewBox="0 0 24 24" aria-hidden="true" data-v-54e35f84${_scopeId}><path d="M5 12h14m-6-6 6 6-6 6" data-v-54e35f84${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" Upload DNA report "),
              (openBlock(), createBlock("svg", {
                viewBox: "0 0 24 24",
                "aria-hidden": "true"
              }, [
                createVNode("path", { d: "M5 12h14m-6-6 6 6-6 6" })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</article><article class="genetics-card variant-card" data-v-54e35f84><div class="variant-card-heading" data-v-54e35f84><div class="variant-heading-icon" aria-hidden="true" data-v-54e35f84><svg viewBox="0 0 24 24" data-v-54e35f84><path d="M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" data-v-54e35f84></path></svg></div><div data-v-54e35f84><span class="genetics-kicker" data-v-54e35f84>Manual entry</span><h2 data-v-54e35f84>Enter known variants</h2><p data-v-54e35f84>Use the results from your DNA report.</p></div></div><div class="gene-grid" data-v-54e35f84><!--[-->`);
      ssrRenderList(genes, (gene) => {
        _push(`<div class="gene-field" data-v-54e35f84><label${ssrRenderAttr("for", `gene-${gene.name}`)} data-v-54e35f84>${ssrInterpolate(gene.name)}</label><select${ssrRenderAttr("id", `gene-${gene.name}`)} data-v-54e35f84><option value="" data-v-54e35f84${ssrIncludeBooleanAttr(Array.isArray(unref(variants)[gene.name]) ? ssrLooseContain(unref(variants)[gene.name], "") : ssrLooseEqual(unref(variants)[gene.name], "")) ? " selected" : ""}>Unknown</option><!--[-->`);
        ssrRenderList(gene.options, (opt) => {
          _push(`<option${ssrRenderAttr("value", opt)} data-v-54e35f84${ssrIncludeBooleanAttr(Array.isArray(unref(variants)[gene.name]) ? ssrLooseContain(unref(variants)[gene.name], opt) : ssrLooseEqual(unref(variants)[gene.name], opt)) ? " selected" : ""}>${ssrInterpolate(opt)}</option>`);
        });
        _push(`<!--]--></select></div>`);
      });
      _push(`<!--]--></div><div class="variant-card-footer" data-v-54e35f84><p data-v-54e35f84>Only enter results you know from your report.</p><button class="analyze-button" type="button"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-54e35f84>`);
      if (unref(saving)) {
        _push(`<svg class="analyze-spinner" viewBox="0 0 24 24" aria-hidden="true" data-v-54e35f84><circle cx="12" cy="12" r="9" data-v-54e35f84></circle><path d="M12 3a9 9 0 0 1 9 9" data-v-54e35f84></path></svg>`);
      } else {
        _push(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-54e35f84><path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.6-6.4-2.1 2.1m-6.6 6.6-2.1 2.1m0-10.8 2.1 2.1m6.6 6.6 2.1 2.1" data-v-54e35f84></path></svg>`);
      }
      _push(` ${ssrInterpolate(unref(saving) ? "Analyzing..." : "Analyze variants")}</button></div></article></div><div class="genetics-results" data-v-54e35f84>`);
      if (unref(loading)) {
        _push(`<div class="result-loading" aria-label="Loading genetic profile" data-v-54e35f84><div class="loading-score" data-v-54e35f84></div><div class="loading-summary" data-v-54e35f84></div><div class="loading-findings" data-v-54e35f84></div></div>`);
      } else if (unref(result)) {
        _push(`<div class="result-content" data-v-54e35f84><section class="result-overview" data-v-54e35f84><article class="result-card score-card" data-v-54e35f84><span class="result-kicker" data-v-54e35f84>Profile overview</span><p class="score-label" data-v-54e35f84>Genetic risk score</p><strong class="${ssrRenderClass([
          unref(result).riskScore >= 60 ? "risk-score-high" : unref(result).riskScore >= 30 ? "risk-score-moderate" : "risk-score-low",
          "risk-score"
        ])}" data-v-54e35f84>${ssrInterpolate(unref(result).riskScore)}</strong><p class="score-caption" data-v-54e35f84>Calculated from selected markers</p></article><article class="result-card summary-card" data-v-54e35f84><span class="result-kicker" data-v-54e35f84>Summary</span><h2 data-v-54e35f84>Your genetic profile</h2><p data-v-54e35f84>${ssrInterpolate(unref(result).summary)}</p></article></section><section class="result-card findings-card" data-v-54e35f84><div class="result-section-heading" data-v-54e35f84><div data-v-54e35f84><span class="result-kicker" data-v-54e35f84>Marker review</span><h2 data-v-54e35f84>Variant findings</h2><p data-v-54e35f84>Each selected marker is grouped by its reported risk level.</p></div><span class="finding-count" data-v-54e35f84>${ssrInterpolate(((_a = unref(result).findings) == null ? void 0 : _a.length) || 0)} markers</span></div><div class="finding-list" data-v-54e35f84><!--[-->`);
        ssrRenderList(unref(result).findings, (finding, i) => {
          _push(`<article class="finding-item" data-v-54e35f84><div class="finding-main" data-v-54e35f84><div data-v-54e35f84><h3 data-v-54e35f84>${ssrInterpolate(finding.label)}</h3><p data-v-54e35f84>${ssrInterpolate(finding.value)}</p></div><span class="${ssrRenderClass([
            finding.status === "high" ? "finding-status-high" : finding.status === "low" ? "finding-status-moderate" : "finding-status-normal",
            "finding-status"
          ])}" data-v-54e35f84>${ssrInterpolate(finding.status === "high" ? "Elevated risk" : finding.status === "low" ? "Moderate" : "Normal")}</span></div>`);
          if (finding.note) {
            _push(`<p class="finding-note" data-v-54e35f84>${ssrInterpolate(finding.note)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</article>`);
        });
        _push(`<!--]--></div></section><section class="result-card recommendations-card" data-v-54e35f84><div class="result-section-heading" data-v-54e35f84><div data-v-54e35f84><span class="result-kicker" data-v-54e35f84>Next steps</span><h2 data-v-54e35f84>Personalized recommendations</h2></div></div><ul class="recommendation-list" data-v-54e35f84><!--[-->`);
        ssrRenderList(unref(result).recommendations, (recommendation, i) => {
          _push(`<li data-v-54e35f84><span data-v-54e35f84>${ssrInterpolate(String(i + 1).padStart(2, "0"))}</span> ${ssrInterpolate(recommendation)}</li>`);
        });
        _push(`<!--]--></ul><p class="genetics-disclaimer" data-v-54e35f84> Genetic insights are informational and should be discussed with a qualified clinician. </p></section></div>`);
      } else {
        _push(`<section class="result-empty" data-v-54e35f84><div class="empty-dna-icon" aria-hidden="true" data-v-54e35f84><svg viewBox="0 0 48 48" data-v-54e35f84><path d="M15 5c18 7 18 31 0 38M33 5C15 12 15 36 33 43M16 11h16M13 18h22M13 30h22M16 37h16" data-v-54e35f84></path></svg></div><span class="genetics-kicker" data-v-54e35f84>Your results</span><h2 data-v-54e35f84>Your genetic summary will appear here</h2><p data-v-54e35f84> Select known variants and analyze them, or upload a DNA report to begin building your profile. </p><div class="empty-steps" data-v-54e35f84><div data-v-54e35f84><span data-v-54e35f84>01</span>Enter or upload results</div><div data-v-54e35f84><span data-v-54e35f84>02</span>Review markers and guidance</div></div></section>`);
      }
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/genetics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const genetics = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-54e35f84"]]);

export { genetics as default };
//# sourceMappingURL=genetics-CQj-tlLT.mjs.map
