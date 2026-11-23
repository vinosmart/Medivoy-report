import { _ as __nuxt_component_0 } from './nuxt-link-CIcsgCdR.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, openBlock, createBlock, createVNode, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { u as useMedivoyApi } from './useMedivoyApi-BieI7KwV.mjs';
import { _ as _export_sfc, a as useRoute$1 } from './server.mjs';
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

const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = (() => {
  console.error(intervalError);
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ReportCard",
  __ssrInlineRender: true,
  props: {
    report: {},
    loading: { type: Boolean },
    reportError: {}
  },
  setup(__props) {
    const props = __props;
    useMedivoyApi();
    const current = ref(props.report);
    watch(
      () => props.report,
      (val) => {
        current.value = val != null ? val : null;
      },
      { immediate: true }
    );
    const status = computed(() => {
      var _a;
      return ((_a = current.value) == null ? void 0 : _a.status) || "processing";
    });
    const findings = computed(
      () => {
        var _a;
        return Array.isArray((_a = current.value) == null ? void 0 : _a.findings) ? current.value.findings : [];
      }
    );
    const patterns = computed(
      () => {
        var _a;
        return Array.isArray((_a = current.value) == null ? void 0 : _a.patternAnalysis) ? current.value.patternAnalysis : [];
      }
    );
    const positiveFindings = computed(
      () => {
        var _a;
        return Array.isArray((_a = current.value) == null ? void 0 : _a.positiveFindings) ? current.value.positiveFindings : [];
      }
    );
    const longTermInsights = computed(
      () => {
        var _a;
        return Array.isArray((_a = current.value) == null ? void 0 : _a.longTermInsights) ? current.value.longTermInsights : [];
      }
    );
    const fiveYearAnswers = computed(
      () => {
        var _a;
        return Array.isArray((_a = current.value) == null ? void 0 : _a.fiveYearAnswers) ? current.value.fiveYearAnswers : [];
      }
    );
    const recommendationGroups = computed(() => {
      var _a;
      const raw = (_a = current.value) == null ? void 0 : _a.recommendations;
      if (!raw || typeof raw !== "object") return {};
      return Object.fromEntries(
        Object.entries(raw).filter(
          ([, value]) => Array.isArray(value) && value.length > 0
        )
      );
    });
    const recommendationEntries = computed(
      () => Object.entries(recommendationGroups.value)
    );
    const riskCategories = computed(() => {
      var _a;
      const categories = (_a = current.value) == null ? void 0 : _a.riskCategories;
      if (!categories || typeof categories !== "object") return [];
      return Object.entries(categories).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
        value
      }));
    });
    const riskColor = computed(() => {
      var _a, _b, _c, _d;
      const raw = (_d = (_c = (_a = current.value) == null ? void 0 : _a.overallHealthScore) != null ? _c : (_b = current.value) == null ? void 0 : _b.riskScore) != null ? _d : 0;
      const score = Number(raw);
      if (Number.isNaN(score)) return "text-slate-700";
      if (score <= 35) return "text-rose-600";
      if (score <= 65) return "text-amber-600";
      return "text-emerald-600";
    });
    const confidenceRows = computed(
      () => {
        var _a, _b, _c;
        return [
          ((_a = current.value) == null ? void 0 : _a.confidenceScore) != null ? {
            label: "OCR Confidence",
            value: `${current.value.confidenceScore}%`
          } : null,
          ((_b = current.value) == null ? void 0 : _b.markerConfidence) != null ? {
            label: "Marker Confidence",
            value: `${current.value.markerConfidence}%`
          } : null,
          ((_c = current.value) == null ? void 0 : _c.aiConfidence) != null ? { label: "AI Confidence", value: `${current.value.aiConfidence}%` } : null
        ].filter(Boolean);
      }
    );
    const prettyStatus = (status2) => (status2 || "normal").replaceAll("_", " ");
    const statusClass = (status2) => {
      switch (status2) {
        case "critical_high":
        case "critical_low":
        case "criticallow":
        case "criticalhigh":
          return "bg-rose-100 text-rose-700";
        case "moderate_high":
        case "mild_high":
        case "moderatehigh":
        case "mildhigh":
          return "bg-orange-100 text-orange-700";
        case "mild_low":
        case "mildlow":
          return "bg-blue-100 text-blue-700";
        case "borderline":
          return "bg-amber-100 text-amber-700";
        default:
          return "bg-emerald-100 text-emerald-700";
      }
    };
    const outlookBubble = (outlook) => {
      if (outlook === "high") return "border-rose-300 bg-rose-50 text-rose-700";
      if (outlook === "moderate")
        return "border-amber-300 bg-amber-50 text-amber-700";
      return "border-emerald-300 bg-emerald-50 text-emerald-700";
    };
    const outlookBorder = (outlook) => {
      if (outlook === "high") return "border-rose-200";
      if (outlook === "moderate") return "border-amber-200";
      return "border-emerald-200";
    };
    let pollTimer = null;
    const stopPolling = () => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };
    const startPolling = () => {
      if (pollTimer) return;
      pollTimer = setInterval();
    };
    watch(
      () => {
        var _a;
        return (_a = current.value) == null ? void 0 : _a.status;
      },
      (val) => {
        if (val === "processing" || val === "queued") startPolling();
        else stopPolling();
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5" }, _attrs))}><div class="flex items-center justify-between gap-4"><div><h4 class="text-xl font-bold">AI Health Analysis</h4><p class="text-sm text-slate-500"> Personalized preventive health insights </p></div>`);
      if (unref(status) === "processing") {
        _push(`<span class="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"><svg class="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Analysing... </span>`);
      } else if (unref(status) === "done" || unref(status) === "completed") {
        _push(`<span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"> Completed </span>`);
      } else {
        _push(`<span class="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"> Error </span>`);
      }
      _push(`</div>`);
      if (unref(status) === "processing" || __props.loading) {
        _push(`<div class="space-y-3 animate-pulse"><div class="h-28 rounded-2xl bg-slate-100"></div><div class="h-40 rounded-2xl bg-slate-100"></div><div class="h-32 rounded-2xl bg-slate-100"></div></div>`);
      } else if (__props.reportError) {
        _push(`<div class="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">${ssrInterpolate(__props.reportError)}</div>`);
      } else if (unref(current)) {
        _push(`<div class="space-y-5"><div class="grid gap-4 sm:grid-cols-3"><div class="rounded-2xl bg-slate-50 p-5"><p class="text-xs text-slate-500">Health Score</p><p class="${ssrRenderClass([unref(riskColor), "mt-2 text-4xl font-bold"])}">${ssrInterpolate((_b = (_a = unref(current).overallHealthScore) != null ? _a : unref(current).riskScore) != null ? _b : "-")}</p><p class="mt-1 text-xs text-slate-400">AI wellness score</p></div><div class="rounded-2xl bg-slate-50 p-5 sm:col-span-2"><p class="text-xs text-slate-500">AI Summary</p><p class="mt-2 text-sm leading-6 text-slate-700">${ssrInterpolate(unref(current).summary || "No summary available yet.")}</p></div></div>`);
        if (unref(confidenceRows).length) {
          _push(`<div class="rounded-2xl bg-slate-50 p-5"><p class="mb-4 text-sm font-semibold text-slate-700">Confidence</p><div class="grid gap-3 sm:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(confidenceRows), (row) => {
            _push(`<div class="rounded-xl border border-slate-200 bg-white p-4"><p class="text-xs text-slate-500">${ssrInterpolate(row.label)}</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(row.value)}</p></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(riskCategories).length) {
          _push(`<div class="rounded-2xl bg-slate-50 p-5"><p class="mb-4 text-sm font-semibold text-slate-700"> Health Categories </p><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
          ssrRenderList(unref(riskCategories), (item, i) => {
            _push(`<div class="rounded-xl border border-slate-200 bg-white p-4"><p class="text-xs text-slate-500">${ssrInterpolate(item.label)}</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(item.value)}</p></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(fiveYearAnswers).length) {
          _push(`<div class="rounded-2xl border border-indigo-100 bg-indigo-50 p-5"><div class="mb-5 flex items-center gap-2"><span class="text-2xl">\u{1F52D}</span><div><p class="text-sm font-bold text-indigo-800"> Find answers for the next 5 years on your health profile </p><p class="text-xs text-indigo-500"> Personalised year-by-year roadmap based on your report </p></div></div><div class="relative"><div class="absolute bottom-0 left-5 top-0 hidden w-0.5 bg-indigo-200 sm:block"></div><div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(fiveYearAnswers), (item, i) => {
            _push(`<div class="relative sm:pl-14"><div class="${ssrRenderClass([outlookBubble(item.outlook), "absolute left-0 top-0 z-10 hidden h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold sm:flex"])}"> Y${ssrInterpolate(item.year)}</div><div class="${ssrRenderClass([outlookBorder(item.outlook), "rounded-xl border bg-white p-4 shadow-sm"])}"><div class="flex flex-wrap items-start justify-between gap-3"><div class="flex items-center gap-2 sm:hidden"><span class="${ssrRenderClass([outlookBubble(item.outlook), "rounded-full border px-2 py-0.5 text-xs font-bold"])}"> Year ${ssrInterpolate(item.year)}</span></div><p class="flex-1 text-sm font-semibold text-slate-800">${ssrInterpolate(item.question)}</p><span class="${ssrRenderClass([
              item.outlook === "high" ? "bg-rose-100 text-rose-700" : item.outlook === "moderate" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700",
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
            ])}">${ssrInterpolate(item.outlook)}</span></div><p class="mt-2 text-sm leading-relaxed text-slate-600">${ssrInterpolate(item.answer)}</p></div></div>`);
          });
          _push(`<!--]--></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(findings).length) {
          _push(`<div class="rounded-2xl bg-slate-50 p-5"><p class="mb-4 text-sm font-semibold text-slate-700">Key Findings</p><div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(findings), (f, i) => {
            _push(`<div class="rounded-2xl border border-slate-200 bg-white p-4"><div class="flex items-start justify-between gap-4"><div><p class="font-semibold text-slate-800">${ssrInterpolate(f.label)}</p><p class="mt-1 text-sm text-slate-500">${ssrInterpolate(f.value)}</p></div><span class="${ssrRenderClass([statusClass(f.status), "shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize"])}">${ssrInterpolate(prettyStatus(f.status))}</span></div>`);
            if (f.whyItMatters) {
              _push(`<div class="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">${ssrInterpolate(f.whyItMatters)}</div>`);
            } else {
              _push(`<!---->`);
            }
            if (Array.isArray(f.recommendedActions) && f.recommendedActions.length) {
              _push(`<div class="mt-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500"> Suggested Actions </p><ul class="mt-2 space-y-1 text-sm text-slate-700"><!--[-->`);
              ssrRenderList(f.recommendedActions, (a, ai) => {
                _push(`<li> \u2022 ${ssrInterpolate(a)}</li>`);
              });
              _push(`<!--]--></ul></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(patterns).length) {
          _push(`<div class="rounded-2xl bg-slate-50 p-5"><p class="mb-4 text-sm font-semibold text-slate-700"> AI Pattern Insights </p><div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(patterns), (p, i) => {
            _push(`<div class="rounded-xl border border-slate-200 bg-white p-4"><p class="font-semibold text-slate-800">${ssrInterpolate(p.title)}</p><p class="mt-2 text-sm text-slate-600">${ssrInterpolate(p.insight)}</p></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(positiveFindings).length) {
          _push(`<div class="rounded-2xl bg-emerald-50 p-5"><p class="mb-3 text-sm font-semibold text-emerald-700"> Positive Findings </p><ul class="space-y-2 text-sm text-emerald-800"><!--[-->`);
          ssrRenderList(unref(positiveFindings), (p, i) => {
            _push(`<li>\u2022 ${ssrInterpolate(p)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(longTermInsights).length) {
          _push(`<div class="rounded-2xl bg-slate-50 p-5"><p class="mb-4 text-sm font-semibold text-slate-700">5-Year Outlook</p><div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(longTermInsights), (item, i) => {
            _push(`<div class="rounded-xl border border-slate-200 bg-white p-4"><div class="flex items-center justify-between gap-4"><p class="font-semibold text-slate-800">${ssrInterpolate(item.title)}</p><span class="${ssrRenderClass([
              item.outlook === "high" ? "bg-rose-100 text-rose-700" : item.outlook === "moderate" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700",
              "rounded-full px-3 py-1 text-xs font-semibold"
            ])}">${ssrInterpolate(item.outlook)}</span></div><p class="mt-2 text-sm text-slate-600">${ssrInterpolate(item.insight)}</p><p class="mt-1 text-xs text-slate-400"> Horizon: ${ssrInterpolate(item.horizonYears)} years </p></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(recommendationEntries).length) {
          _push(`<div class="rounded-2xl bg-slate-50 p-5"><p class="mb-4 text-sm font-semibold text-slate-700">Recommendations</p><div class="grid gap-4 sm:grid-cols-2"><!--[-->`);
          ssrRenderList(unref(recommendationEntries), ([key, group], index) => {
            _push(`<div class="rounded-xl border border-slate-200 bg-white p-4"><p class="font-semibold capitalize text-slate-700">${ssrInterpolate(key)}</p><ul class="mt-3 space-y-2 text-sm text-slate-600"><!--[-->`);
            ssrRenderList(group, (item, i) => {
              _push(`<li>\u2022 ${ssrInterpolate(item)}</li>`);
            });
            _push(`<!--]--></ul></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="text-right text-xs text-slate-400"> AI-generated insights are educational and not medical diagnosis. </p></div>`);
      } else {
        _push(`<div class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"> No report data available. </div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ReportCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "upload",
  __ssrInlineRender: true,
  setup(__props) {
    useMedivoyApi();
    const route = useRoute$1();
    const title = ref("");
    const type = ref("blood");
    const file = ref(null);
    const fileName = ref("");
    const previewUrl = ref("");
    const forMember = ref(route.query.for || "");
    const message = ref("");
    const hasError = ref(false);
    const loading = ref(false);
    const report = ref(null);
    const familyMembers = ref([]);
    ref(null);
    const isImage = computed(
      () => !!file.value && file.value.type.startsWith("image/")
    );
    const isPdf = computed(
      () => !!file.value && file.value.type === "application/pdf"
    );
    const pillClass = (active) => [
      "member-chip",
      active && "member-chip-active"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ReportCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "upload-page" }, _attrs))} data-v-7ef35d46><header class="upload-header" data-v-7ef35d46><div class="upload-heading-mark" aria-hidden="true" data-v-7ef35d46><svg viewBox="0 0 24 24" data-v-7ef35d46><path d="M7 3h7l4 4v14H7V3Zm7 0v5h4M10 13h5M10 17h5" data-v-7ef35d46></path></svg></div><div class="upload-heading-copy" data-v-7ef35d46><p class="upload-eyebrow" data-v-7ef35d46><span data-v-7ef35d46></span>Secure document intake</p><h1 data-v-7ef35d46><span data-v-7ef35d46>Upload</span> <span class="upload-title-accent" data-v-7ef35d46>report</span></h1><p data-v-7ef35d46> Add a lab report or scan. Medivoy will organize its markers and link it to the right person. </p></div><button type="submit" form="report-upload-form"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="submit-button header-submit" data-v-7ef35d46>`);
      if (!unref(loading)) {
        _push(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-7ef35d46><path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4" data-v-7ef35d46></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(loading) ? "Uploading..." : "Upload report")}</button></header><form id="report-upload-form" class="upload-form" data-v-7ef35d46><div class="form-details-grid" data-v-7ef35d46><section class="form-section member-section" data-v-7ef35d46><div class="form-section-heading member-section-heading" data-v-7ef35d46><span class="section-index" data-v-7ef35d46>01</span><div data-v-7ef35d46><h2 data-v-7ef35d46>Assign to a person</h2><p data-v-7ef35d46>Choose who this health report belongs to.</p></div><button type="button" class="${ssrRenderClass(pillClass(unref(forMember) === ""))}"${ssrRenderAttr("aria-pressed", unref(forMember) === "")} data-v-7ef35d46><span class="member-avatar" data-v-7ef35d46>ME</span><span data-v-7ef35d46>Myself</span></button></div>`);
      if (unref(familyMembers).length) {
        _push(`<div class="member-options" data-v-7ef35d46><!--[-->`);
        ssrRenderList(unref(familyMembers), (m) => {
          _push(`<button type="button" class="${ssrRenderClass(pillClass(unref(forMember) === m.name))}"${ssrRenderAttr("aria-pressed", unref(forMember) === m.name)} data-v-7ef35d46><span class="member-avatar" data-v-7ef35d46>${ssrInterpolate(String(m.name || "M").slice(0, 1).toUpperCase())}</span><span data-v-7ef35d46>${ssrInterpolate(m.name)}<small data-v-7ef35d46>${ssrInterpolate(m.relation)}</small></span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(familyMembers).length) {
        _push(`<div class="family-empty" data-v-7ef35d46><div class="family-empty-message" data-v-7ef35d46><span class="family-empty-icon" aria-hidden="true" data-v-7ef35d46><svg viewBox="0 0 24 24" data-v-7ef35d46><path d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 8v6m-3-3h6" data-v-7ef35d46></path></svg></span><span data-v-7ef35d46>No family members added</span></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/family",
          class: "family-add-button"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Add family member <svg viewBox="0 0 24 24" aria-hidden="true" data-v-7ef35d46${_scopeId}><path d="m9 18 6-6-6-6" data-v-7ef35d46${_scopeId}></path></svg>`);
            } else {
              return [
                createTextVNode(" Add family member "),
                (openBlock(), createBlock("svg", {
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true"
                }, [
                  createVNode("path", { d: "m9 18 6-6-6-6" })
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="form-helper" data-v-7ef35d46> This keeps report insights and personalized guidance connected to the right person. </p></section><section class="form-section details-section" data-v-7ef35d46><div class="form-section-heading" data-v-7ef35d46><span class="section-index" data-v-7ef35d46>02</span><div data-v-7ef35d46><h2 data-v-7ef35d46>Report details</h2><p data-v-7ef35d46>Add a title and select the report category.</p></div></div><div class="field-grid" data-v-7ef35d46><div class="form-field" data-v-7ef35d46><label for="report-title" data-v-7ef35d46>Report title</label><input id="report-title"${ssrRenderAttr("value", unref(title))} placeholder="e.g. Annual blood test" data-v-7ef35d46></div><div class="form-field" data-v-7ef35d46><label for="report-type" data-v-7ef35d46>Report type</label><select id="report-type" data-v-7ef35d46><option value="blood" data-v-7ef35d46${ssrIncludeBooleanAttr(Array.isArray(unref(type)) ? ssrLooseContain(unref(type), "blood") : ssrLooseEqual(unref(type), "blood")) ? " selected" : ""}>Blood</option><option value="dna" data-v-7ef35d46${ssrIncludeBooleanAttr(Array.isArray(unref(type)) ? ssrLooseContain(unref(type), "dna") : ssrLooseEqual(unref(type), "dna")) ? " selected" : ""}>DNA</option><option value="other" data-v-7ef35d46${ssrIncludeBooleanAttr(Array.isArray(unref(type)) ? ssrLooseContain(unref(type), "other") : ssrLooseEqual(unref(type), "other")) ? " selected" : ""}>Other</option></select></div></div></section></div><section class="form-section file-section" data-v-7ef35d46><div class="form-section-heading" data-v-7ef35d46><span class="section-index" data-v-7ef35d46>03</span><div data-v-7ef35d46><h2 data-v-7ef35d46>Choose a file</h2><p data-v-7ef35d46>Upload a clear PDF or image of your report.</p></div></div><label class="file-dropzone" data-v-7ef35d46><span class="file-drop-icon" aria-hidden="true" data-v-7ef35d46><svg viewBox="0 0 24 24" data-v-7ef35d46><path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4" data-v-7ef35d46></path></svg></span><span class="file-drop-title" data-v-7ef35d46>${ssrInterpolate(unref(fileName) || "Choose a report to upload")}</span><span class="file-drop-subtitle" data-v-7ef35d46>PDF, JPG, JPEG, or PNG</span><input type="file" name="file" class="file-input" accept=".pdf,.jpg,.jpeg,.png,image/png,image/jpeg,application/pdf" data-v-7ef35d46></label></section>`);
      if (unref(previewUrl) && unref(isImage)) {
        _push(`<div class="file-preview" data-v-7ef35d46><img${ssrRenderAttr("src", unref(previewUrl))} alt="Selected image preview" data-v-7ef35d46></div>`);
      } else if (unref(previewUrl) && unref(isPdf)) {
        _push(`<div class="pdf-preview" data-v-7ef35d46><span class="pdf-preview-icon" aria-hidden="true" data-v-7ef35d46>PDF</span><span data-v-7ef35d46>${ssrInterpolate(unref(fileName))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(message)) {
        _push(`<p class="${ssrRenderClass([unref(hasError) ? "message-error" : "message-success", "form-message"])}" role="status" data-v-7ef35d46>${ssrInterpolate(unref(message))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form>`);
      if (unref(report)) {
        _push(ssrRenderComponent(_component_ReportCard, {
          report: unref(report),
          loading: false,
          "report-error": ""
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/upload.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const upload = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7ef35d46"]]);

export { upload as default };
//# sourceMappingURL=upload-DKN0Y6kE.mjs.map
