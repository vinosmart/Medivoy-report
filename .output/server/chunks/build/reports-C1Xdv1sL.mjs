import { _ as __nuxt_component_0 } from './nuxt-link-CIcsgCdR.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrLooseContain, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useMedivoyApi();
    const reports = ref([]);
    const loading = ref(true);
    const deletingId = ref(null);
    const deletingBulk = ref(false);
    const search = ref("");
    const selectedIds = ref([]);
    const searchPlaceholder = ref("");
    const formatDate = (d) => new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    const filteredReports = computed(() => {
      const q = search.value.trim().toLowerCase();
      if (!q) return reports.value;
      return reports.value.filter(
        (report) => [report.title, report.type, report.status].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
      );
    });
    const selectAll = computed({
      get: () => filteredReports.value.length > 0 && filteredReports.value.every((r) => selectedIds.value.includes(r.id)),
      set: (value) => {
        selectedIds.value = value ? filteredReports.value.map((r) => r.id) : [];
      }
    });
    watch(filteredReports, (items) => {
      const ids = new Set(items.map((r) => r.id));
      selectedIds.value = selectedIds.value.filter((id) => ids.has(id));
    });
    const riskClass = (score) => !score ? "risk-neutral" : score >= 60 ? "risk-high" : score >= 30 ? "risk-medium" : "risk-low";
    const statusClass = (status) => status === "completed" ? "status-completed" : status === "failed" ? "status-failed" : "status-processing";
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "reports-page" }, _attrs))} data-v-83a6f48b><header class="reports-header" data-v-83a6f48b><div class="reports-heading-brand" data-v-83a6f48b><div class="reports-heading-mark" aria-hidden="true" data-v-83a6f48b><svg viewBox="0 0 24 24" data-v-83a6f48b><path d="M9 4.5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v.5" data-v-83a6f48b></path><rect x="6" y="4.5" width="12" height="17" rx="2" data-v-83a6f48b></rect><path d="M9 10h6M9 13.5h6M9 17h4" data-v-83a6f48b></path></svg></div><div class="reports-heading-copy" data-v-83a6f48b><p class="reports-eyebrow" data-v-83a6f48b><span data-v-83a6f48b></span>Your health records</p><h1 data-v-83a6f48b>Reports</h1><p class="reports-intro" data-v-83a6f48b> Review your uploaded reports, AI summaries, and risk insights. </p></div></div><div class="reports-header-actions" data-v-83a6f48b><button type="button"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="refresh-button" data-v-83a6f48b><svg viewBox="0 0 24 24" aria-hidden="true" data-v-83a6f48b><path d="M20 7v5h-5M4.8 9A7.5 7.5 0 0 1 18 6l2 2M4 17v-5h5m10.2 3A7.5 7.5 0 0 1 6 18l-2-2" data-v-83a6f48b></path></svg> ${ssrInterpolate(unref(loading) ? "Refreshing..." : "Refresh")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/reports/upload",
        class: "upload-button"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-83a6f48b${_scopeId}><path d="M12 5v14M5 12h14" data-v-83a6f48b${_scopeId}></path></svg> Upload report `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                viewBox: "0 0 24 24",
                "aria-hidden": "true"
              }, [
                createVNode("path", { d: "M12 5v14M5 12h14" })
              ])),
              createTextVNode(" Upload report ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header><section class="reports-panel" aria-label="Your reports" data-v-83a6f48b><div class="reports-toolbar" data-v-83a6f48b><label class="search-field" data-v-83a6f48b><svg viewBox="0 0 24 24" aria-hidden="true" data-v-83a6f48b><circle cx="10.5" cy="10.5" r="6.5" data-v-83a6f48b></circle><path d="m15.5 15.5 4 4" data-v-83a6f48b></path></svg><input${ssrRenderAttr("value", unref(search))} type="text" aria-label="Search reports"${ssrRenderAttr("placeholder", unref(searchPlaceholder))} data-v-83a6f48b></label><div class="reports-controls" data-v-83a6f48b><span class="report-count" data-v-83a6f48b><strong data-v-83a6f48b>${ssrInterpolate(unref(filteredReports).length)}</strong><span data-v-83a6f48b>report${ssrInterpolate(unref(filteredReports).length === 1 ? "" : "s")}</span></span><label class="select-all-control" data-v-83a6f48b><input${ssrIncludeBooleanAttr(Array.isArray(unref(selectAll)) ? ssrLooseContain(unref(selectAll), null) : unref(selectAll)) ? " checked" : ""} type="checkbox" data-v-83a6f48b><span data-v-83a6f48b>Select all</span></label><button type="button"${ssrIncludeBooleanAttr(unref(selectedIds).length === 0 || unref(deletingBulk)) ? " disabled" : ""} class="bulk-delete-button" data-v-83a6f48b><svg viewBox="0 0 24 24" aria-hidden="true" data-v-83a6f48b><path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 14h11l1-14M9 7V4h6v3" data-v-83a6f48b></path></svg> ${ssrInterpolate(unref(deletingBulk) ? "Deleting..." : `Delete selected (${unref(selectedIds).length})`)}</button></div></div>`);
      if (unref(loading)) {
        _push(`<div class="report-list loading-reports" aria-label="Loading reports" data-v-83a6f48b><!--[-->`);
        ssrRenderList(3, (n) => {
          _push(`<div class="report-skeleton" data-v-83a6f48b><span data-v-83a6f48b></span><div data-v-83a6f48b><i data-v-83a6f48b></i><i data-v-83a6f48b></i></div><b data-v-83a6f48b></b></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(filteredReports).length) {
        _push(`<div class="report-list" data-v-83a6f48b><!--[-->`);
        ssrRenderList(unref(filteredReports), (report) => {
          var _a, _b;
          _push(`<article class="report-card" data-v-83a6f48b><div class="report-main" data-v-83a6f48b><input${ssrIncludeBooleanAttr(Array.isArray(unref(selectedIds)) ? ssrLooseContain(unref(selectedIds), report.id) : unref(selectedIds)) ? " checked" : ""}${ssrRenderAttr("value", report.id)} type="checkbox"${ssrRenderAttr("aria-label", `Select ${report.title}`)} class="report-checkbox" data-v-83a6f48b><div class="report-copy" data-v-83a6f48b><h2 data-v-83a6f48b>${ssrInterpolate(report.title)}</h2><div class="report-meta" data-v-83a6f48b><span class="${ssrRenderClass([statusClass(report.status), "report-status"])}" data-v-83a6f48b>${ssrInterpolate(report.status)}</span><span class="report-type" data-v-83a6f48b>${ssrInterpolate((_a = report.type) == null ? void 0 : _a.toUpperCase())}</span><span class="report-date" data-v-83a6f48b>${ssrInterpolate(formatDate(report.createdAt))}</span></div><p class="report-summary" data-v-83a6f48b>${ssrInterpolate(report.aiSummary || "No summary available yet.")}</p></div></div><div class="report-actions" data-v-83a6f48b><div class="risk-score" data-v-83a6f48b><span data-v-83a6f48b>Risk score</span><strong class="${ssrRenderClass(riskClass(report.riskScore))}" data-v-83a6f48b>${ssrInterpolate((_b = report.riskScore) != null ? _b : "\u2014")}</strong></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/reports/${report.id}`,
            class: "view-report-button"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View report <span aria-hidden="true" data-v-83a6f48b${_scopeId}>\u2192</span>`);
              } else {
                return [
                  createTextVNode(" View report "),
                  createVNode("span", { "aria-hidden": "true" }, "\u2192")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button type="button"${ssrIncludeBooleanAttr(unref(deletingId) === report.id) ? " disabled" : ""} class="delete-report-button" data-v-83a6f48b>${ssrInterpolate(unref(deletingId) === report.id ? "Deleting..." : "Delete")}</button></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="empty-reports" data-v-83a6f48b><div class="empty-reports-icon" aria-hidden="true" data-v-83a6f48b><svg viewBox="0 0 24 24" data-v-83a6f48b><path d="M4 13h4.5l1.5 2h4l1.5-2H20v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z" data-v-83a6f48b></path><path d="M12 12V3m0 0L8.5 6.5M12 3l3.5 3.5" data-v-83a6f48b></path></svg></div><p class="empty-reports-title" data-v-83a6f48b>${ssrInterpolate(unref(search) ? "No matching reports found" : "No reports yet")}</p><p class="empty-reports-copy" data-v-83a6f48b> Upload a report to see its AI summary and risk score here. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/reports/upload",
          class: "upload-button empty-upload-button"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-83a6f48b${_scopeId}><path d="M12 5v14M5 12h14" data-v-83a6f48b${_scopeId}></path></svg> Upload report `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true"
                }, [
                  createVNode("path", { d: "M12 5v14M5 12h14" })
                ])),
                createTextVNode(" Upload report ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-83a6f48b"]]);

export { index as default };
//# sourceMappingURL=reports-C1Xdv1sL.mjs.map
