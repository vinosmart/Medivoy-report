import { _ as __nuxt_component_0 } from './nuxt-link-CIcsgCdR.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useMedivoyApi } from './useMedivoyApi-BieI7KwV.mjs';
import { u as useAuthStore } from './auth-DLg6Nzla.mjs';
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
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    useMedivoyApi();
    const auth = useAuthStore();
    const reports = ref([]);
    const loadingReports = ref(true);
    const animateDashboardTitle = ref(false);
    const animatedMetricValues = reactive({});
    const currentDate = computed(
      () => new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
      }).format(/* @__PURE__ */ new Date())
    );
    const metrics = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g;
      return [
        { key: "health", label: "Health score", value: (_b = (_a = auth.user) == null ? void 0 : _a.healthScore) != null ? _b : "87", icon: "health", tone: "tone-health", note: (_d = (_c = auth.user) == null ? void 0 : _c.healthChange) != null ? _d : "+2 from last month", noteTone: "note-positive" },
        { key: "risk", label: "Risk score", value: ((_e = auth.user) == null ? void 0 : _e.riskScore) ? `${auth.user.riskScore}%` : "24%", icon: "risk", tone: "tone-risk", note: "Moderate risk zone", noteTone: "note-warning" },
        { key: "bio", label: "Bio age", value: (_g = (_f = auth.user) == null ? void 0 : _f.bioAge) != null ? _g : "35", icon: "bio", tone: "tone-bio", note: "2 years below calendar age", noteTone: "note-positive" },
        { key: "reports", label: "Reports", value: String(reports.value.length), icon: "reports", tone: "tone-reports", note: reports.value.length ? "Latest reports loaded" : "Upload to get started", noteTone: "note-muted" }
      ];
    });
    const quickActions = [
      { label: "Upload report", desc: "Blood, DNA, scan or PDF", icon: "upload", tone: "tone-reports", to: "/reports/upload" },
      { label: "View reports", desc: "Manage uploaded reports", icon: "reports", tone: "tone-reports", to: "/reports" },
      { label: "Family health", desc: "Hereditary health history", icon: "family", tone: "tone-health", to: "/family" },
      { label: "Nutrition guidance", desc: "Diet and vitamin support", icon: "nutrition", tone: "tone-nutrition", to: "/nutrition" }
    ];
    const formatDate = (date) => date ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date)) : "Date unavailable";
    const fileTone = (type) => type === "dna" ? "type-dna" : type === "blood" ? "type-blood" : "type-general";
    const riskClass = (score) => !score ? "risk-low" : score >= 60 ? "risk-high" : score >= 30 ? "risk-medium" : "risk-low";
    const statusClass = (status) => status === "completed" ? "status-completed" : status === "failed" ? "status-failed" : "status-processing";
    const statusLabel = (status) => {
      if (!status) return "Processing";
      return status.charAt(0).toUpperCase() + status.slice(1);
    };
    const metricDisplayValue = (metric) => {
      var _a, _b;
      const currentValue = animatedMetricValues[metric.key];
      if (currentValue === void 0) return String(metric.value);
      const rawValue = String(metric.value);
      const match = rawValue.match(/^(-?[\d,.]+)(.*)$/);
      if (!match) return rawValue;
      const decimalPlaces = (_b = (_a = match[1].split(".")[1]) == null ? void 0 : _a.length) != null ? _b : 0;
      const scale = 10 ** decimalPlaces;
      const roundedValue = Math.round(currentValue * scale) / scale;
      const formattedValue = decimalPlaces ? roundedValue.toFixed(decimalPlaces) : String(Math.round(roundedValue));
      return `${formattedValue}${match[2]}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-page" }, _attrs))} data-v-cf60697a><section class="page-heading" data-v-cf60697a><div data-v-cf60697a><p class="breadcrumb" data-v-cf60697a>Workspace <span data-v-cf60697a>/</span> Dashboard</p><h1 data-v-cf60697a><span class="heading-health" data-v-cf60697a>Health</span><span class="${ssrRenderClass(["dashboard-title-typewriter", { "dashboard-title-typewriter-active": unref(animateDashboardTitle) }])}" aria-label="Dashboard" data-v-cf60697a><span class="heading-dashboard" data-v-cf60697a>Dashboard</span></span></h1><p data-v-cf60697a>${ssrInterpolate(unref(currentDate))} \xB7 Account overview</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/reports/upload",
        class: "primary-action"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a${_scopeId}><path d="M12 5v14M5 12h14" data-v-cf60697a${_scopeId}></path></svg> Upload report `);
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
      _push(`</section><section class="summary-grid" aria-label="Health summary" data-v-cf60697a><!--[-->`);
      ssrRenderList(unref(metrics), (metric) => {
        _push(`<article class="${ssrRenderClass(["summary-card", `metric-card-${metric.icon}`])}" data-v-cf60697a><div class="summary-label" data-v-cf60697a><span data-v-cf60697a>${ssrInterpolate(metric.label)}</span><span class="${ssrRenderClass([metric.tone, "summary-icon"])}" data-v-cf60697a>`);
        if (metric.icon === "health") {
          _push(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a><path d="M3 12h4.2l2.2-5.5 4.3 11 2.2-5.5H21" data-v-cf60697a></path></svg>`);
        } else if (metric.icon === "risk") {
          _push(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a><path d="M12 3 19 6v5c0 4.4-2.8 7.8-7 10-4.2-2.2-7-5.6-7-10V6l7-3Z" data-v-cf60697a></path><path d="M12 8.5v4M12 16h.01" data-v-cf60697a></path></svg>`);
        } else if (metric.icon === "bio") {
          _push(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a><circle cx="12" cy="13" r="8" data-v-cf60697a></circle><path d="M12 9v4l3 1.8M9 2h6M12 2v3" data-v-cf60697a></path></svg>`);
        } else {
          _push(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a><path d="M9 4.5h6a2 2 0 0 1 2 2V20H7V6.5a2 2 0 0 1 2-2ZM9 4.5V3h6v1.5M10 11h4M10 14.5h4M10 18h2" data-v-cf60697a></path></svg>`);
        }
        _push(`</span></div><strong class="summary-value" data-v-cf60697a>${ssrInterpolate(metricDisplayValue(metric))}</strong><p class="${ssrRenderClass(metric.noteTone)}" data-v-cf60697a>${ssrInterpolate(metric.note)}</p></article>`);
      });
      _push(`<!--]--></section><section class="workspace-grid" data-v-cf60697a><article class="workspace-card reports-card" data-v-cf60697a><header class="card-header" data-v-cf60697a><div data-v-cf60697a><h2 data-v-cf60697a>Recent reports</h2><p data-v-cf60697a>Latest files uploaded to your account</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/reports",
        class: "text-link text-link-outline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`View all reports <span aria-hidden="true" data-v-cf60697a${_scopeId}>\u2192</span>`);
          } else {
            return [
              createTextVNode("View all reports "),
              createVNode("span", { "aria-hidden": "true" }, "\u2192")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header>`);
      if (unref(loadingReports)) {
        _push(`<div class="loading-list" aria-label="Loading reports" data-v-cf60697a><!--[-->`);
        ssrRenderList(4, (n) => {
          _push(`<div data-v-cf60697a></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(reports).length) {
        _push(`<div class="table-list" data-v-cf60697a><!--[-->`);
        ssrRenderList(unref(reports).slice(0, 5), (report) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: report.id,
            to: `/reports/${report.id}`,
            class: "report-row"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b;
              if (_push2) {
                _push2(`<span class="${ssrRenderClass([fileTone(report.type), "file-type"])}" data-v-cf60697a${_scopeId}>${ssrInterpolate(report.type ? String(report.type).slice(0, 3).toUpperCase() : "RPT")}</span><div class="report-info" data-v-cf60697a${_scopeId}><strong data-v-cf60697a${_scopeId}>${ssrInterpolate(report.title)}</strong><span data-v-cf60697a${_scopeId}>${ssrInterpolate(formatDate(report.createdAt))}</span></div><span class="${ssrRenderClass([statusClass(report.status), "status"])}" data-v-cf60697a${_scopeId}>${ssrInterpolate(statusLabel(report.status))}</span><div class="risk" data-v-cf60697a${_scopeId}><span data-v-cf60697a${_scopeId}>Risk</span><strong class="${ssrRenderClass(riskClass(report.riskScore))}" data-v-cf60697a${_scopeId}>${ssrInterpolate((_a = report.riskScore) != null ? _a : "\u2014")}</strong></div><svg class="row-arrow" viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a${_scopeId}><path d="m9 18 6-6-6-6" data-v-cf60697a${_scopeId}></path></svg>`);
              } else {
                return [
                  createVNode("span", {
                    class: ["file-type", fileTone(report.type)]
                  }, toDisplayString(report.type ? String(report.type).slice(0, 3).toUpperCase() : "RPT"), 3),
                  createVNode("div", { class: "report-info" }, [
                    createVNode("strong", null, toDisplayString(report.title), 1),
                    createVNode("span", null, toDisplayString(formatDate(report.createdAt)), 1)
                  ]),
                  createVNode("span", {
                    class: ["status", statusClass(report.status)]
                  }, toDisplayString(statusLabel(report.status)), 3),
                  createVNode("div", { class: "risk" }, [
                    createVNode("span", null, "Risk"),
                    createVNode("strong", {
                      class: riskClass(report.riskScore)
                    }, toDisplayString((_b = report.riskScore) != null ? _b : "\u2014"), 3)
                  ]),
                  (openBlock(), createBlock("svg", {
                    class: "row-arrow",
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", { d: "m9 18 6-6-6-6" })
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="empty-state" data-v-cf60697a><div class="empty-art" aria-hidden="true" data-v-cf60697a><span class="empty-art-orbit" data-v-cf60697a></span><span class="empty-icon" data-v-cf60697a><svg viewBox="0 0 24 24" data-v-cf60697a><path d="M7 3h7l4 4v14H7V3ZM14 3v5h4M10 13h5M10 17h5" data-v-cf60697a></path></svg></span><span class="empty-plus" data-v-cf60697a>+</span></div><div class="empty-copy" data-v-cf60697a><span class="empty-kicker" data-v-cf60697a>GET STARTED</span><h3 data-v-cf60697a>Start with your first report</h3><p data-v-cf60697a>Upload a lab result to see your health information organized in one place.</p><div class="empty-actions" data-v-cf60697a>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/reports/upload",
          class: "empty-action"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a${_scopeId}><path d="M12 16V4M7 9l5-5 5 5M5 16v4h14v-4" data-v-cf60697a${_scopeId}></path></svg> Upload your first report `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true"
                }, [
                  createVNode("path", { d: "M12 16V4M7 9l5-5 5 5M5 16v4h14v-4" })
                ])),
                createTextVNode(" Upload your first report ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="empty-formats" data-v-cf60697a>PDF, JPG or PNG</span></div></div></div>`);
      }
      _push(`</article><aside class="workspace-card actions-card" data-v-cf60697a><header class="card-header" data-v-cf60697a><div data-v-cf60697a><h2 data-v-cf60697a>Quick actions</h2><p data-v-cf60697a>Frequently used features</p></div></header><nav class="quick-list" aria-label="Quick actions" data-v-cf60697a><!--[-->`);
      ssrRenderList(quickActions, (action) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: action.label,
          to: action.to,
          class: "quick-row"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([action.tone, "quick-icon"])}" data-v-cf60697a${_scopeId}>`);
              if (action.icon === "upload") {
                _push2(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a${_scopeId}><path d="M12 16V4M7 9l5-5 5 5M5 16v4h14v-4" data-v-cf60697a${_scopeId}></path></svg>`);
              } else if (action.icon === "reports") {
                _push2(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a${_scopeId}><path d="M7 3h10v18H7V3ZM10 8h4M10 12h4M10 16h4" data-v-cf60697a${_scopeId}></path></svg>`);
              } else if (action.icon === "family") {
                _push2(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a${_scopeId}><circle cx="12" cy="8" r="3" data-v-cf60697a${_scopeId}></circle><path d="M5 21v-2a7 7 0 0 1 14 0v2M5 11v4M19 11v4" data-v-cf60697a${_scopeId}></path></svg>`);
              } else {
                _push2(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a${_scopeId}><path d="M12 21c5-3 7-7 7-11A7 7 0 1 0 5 10c0 4 2 8 7 11ZM8.5 12h7M12 8.5v7" data-v-cf60697a${_scopeId}></path></svg>`);
              }
              _push2(`</span><span class="quick-copy" data-v-cf60697a${_scopeId}><strong data-v-cf60697a${_scopeId}>${ssrInterpolate(action.label)}</strong><small data-v-cf60697a${_scopeId}>${ssrInterpolate(action.desc)}</small></span><svg class="row-arrow" viewBox="0 0 24 24" aria-hidden="true" data-v-cf60697a${_scopeId}><path d="m9 18 6-6-6-6" data-v-cf60697a${_scopeId}></path></svg>`);
            } else {
              return [
                createVNode("span", {
                  class: ["quick-icon", action.tone]
                }, [
                  action.icon === "upload" ? (openBlock(), createBlock("svg", {
                    key: 0,
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", { d: "M12 16V4M7 9l5-5 5 5M5 16v4h14v-4" })
                  ])) : action.icon === "reports" ? (openBlock(), createBlock("svg", {
                    key: 1,
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", { d: "M7 3h10v18H7V3ZM10 8h4M10 12h4M10 16h4" })
                  ])) : action.icon === "family" ? (openBlock(), createBlock("svg", {
                    key: 2,
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true"
                  }, [
                    createVNode("circle", {
                      cx: "12",
                      cy: "8",
                      r: "3"
                    }),
                    createVNode("path", { d: "M5 21v-2a7 7 0 0 1 14 0v2M5 11v4M19 11v4" })
                  ])) : (openBlock(), createBlock("svg", {
                    key: 3,
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", { d: "M12 21c5-3 7-7 7-11A7 7 0 1 0 5 10c0 4 2 8 7 11ZM8.5 12h7M12 8.5v7" })
                  ]))
                ], 2),
                createVNode("span", { class: "quick-copy" }, [
                  createVNode("strong", null, toDisplayString(action.label), 1),
                  createVNode("small", null, toDisplayString(action.desc), 1)
                ]),
                (openBlock(), createBlock("svg", {
                  class: "row-arrow",
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true"
                }, [
                  createVNode("path", { d: "m9 18 6-6-6-6" })
                ]))
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav></aside><article class="workspace-card compliance-card" data-v-cf60697a><div class="compliance-mark" aria-hidden="true" data-v-cf60697a><div class="compliance-icon" data-v-cf60697a><svg viewBox="0 0 24 24" data-v-cf60697a><path d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3ZM9 12l2 2 4-4" data-v-cf60697a></path></svg></div></div><div class="compliance-copy" data-v-cf60697a><div class="compliance-overline" data-v-cf60697a><span data-v-cf60697a>Privacy &amp; security</span><span class="compliance-status" data-v-cf60697a><i data-v-cf60697a></i>Protected</span></div><h2 data-v-cf60697a>Health account status</h2><p data-v-cf60697a>Your profile and report information remain private and secure.</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/family",
        class: "text-link text-link-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Review health profile <span aria-hidden="true" data-v-cf60697a${_scopeId}>\u2192</span>`);
          } else {
            return [
              createTextVNode("Review health profile "),
              createVNode("span", { "aria-hidden": "true" }, "\u2192")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</article></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cf60697a"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard-CfDHrs5o.mjs.map
