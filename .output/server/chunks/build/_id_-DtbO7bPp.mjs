import { _ as __nuxt_component_0 } from './nuxt-link-CIcsgCdR.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRoute$1, b as useRuntimeConfig } from './server.mjs';
import { u as useMedivoyApi } from './useMedivoyApi-BieI7KwV.mjs';
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
import 'pinia';
import './auth-DLg6Nzla.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute$1();
    useMedivoyApi();
    const report = ref(null);
    const loading = ref(true);
    const pharmacySuggestions = ref(null);
    const downloading = ref(false);
    const downloadError = ref("");
    const API_BASE = String(useRuntimeConfig().public.apiBase || "https://api-geno.medivoy.ae/api").replace(/\/api\/?$/, "");
    const reportType = computed(() => {
      var _a, _b;
      return String(((_a = report.value) == null ? void 0 : _a.reportType) || ((_b = report.value) == null ? void 0 : _b.type) || "Clinical report").replace(/[_-]/g, " ");
    });
    const healthScore = computed(() => {
      var _a, _b, _c;
      const value = (_c = (_a = report.value) == null ? void 0 : _a.overallHealthScore) != null ? _c : (_b = report.value) == null ? void 0 : _b.riskScore;
      return value == null ? null : Math.min(100, Math.max(0, Math.round(Number(value))));
    });
    const confidencePercent = computed(() => {
      var _a;
      const value = Number((_a = report.value) == null ? void 0 : _a.confidenceScore);
      return value ? Math.round(value <= 1 ? value * 100 : value) : null;
    });
    const riskCategoryList = computed(() => {
      var _a;
      const entries = Object.entries(((_a = report.value) == null ? void 0 : _a.riskCategories) || {}).filter(([, value]) => typeof value === "number");
      const scale = entries.every(([, value]) => value <= 10) ? 10 : 1;
      return entries.map(([key, value]) => ({ key, label: humanize(key.replace(/Risk$/, "")), value: Math.min(100, Math.round(value * scale)) }));
    });
    const displayedMedicineSuggestions = computed(() => {
      var _a, _b, _c;
      return ((_b = (_a = pharmacySuggestions.value) == null ? void 0 : _a.medicineSuggestions) == null ? void 0 : _b.length) ? pharmacySuggestions.value.medicineSuggestions : ((_c = report.value) == null ? void 0 : _c.medicineSuggestions) || [];
    });
    computed(() => {
      var _a;
      const raw = ((_a = report.value) == null ? void 0 : _a.fileUrl) || "";
      if (!raw) return "";
      return raw.startsWith("http") ? raw : `${API_BASE}${raw.startsWith("/") ? raw : `/${raw}`}`;
    });
    const hasRecommendations = computed(() => {
      var _a;
      return !!((_a = report.value) == null ? void 0 : _a.recommendations) && ["diet", "exercise", "sleep", "supplements", "followUp"].some((key) => {
        var _a2;
        return (_a2 = report.value.recommendations[key]) == null ? void 0 : _a2.length;
      });
    });
    const recommendationSections = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      return [
        { key: "diet", letter: "A", title: "Nutrition", items: ((_b = (_a = report.value) == null ? void 0 : _a.recommendations) == null ? void 0 : _b.diet) || [] },
        { key: "exercise", letter: "B", title: "Movement", items: ((_d = (_c = report.value) == null ? void 0 : _c.recommendations) == null ? void 0 : _d.exercise) || [] },
        { key: "sleep", letter: "C", title: "Sleep", items: ((_f = (_e = report.value) == null ? void 0 : _e.recommendations) == null ? void 0 : _f.sleep) || [] },
        { key: "supplements", letter: "D", title: "Supplements", items: ((_h = (_g = report.value) == null ? void 0 : _g.recommendations) == null ? void 0 : _h.supplements) || [] },
        { key: "followUp", letter: "E", title: "Follow-up", items: ((_j = (_i = report.value) == null ? void 0 : _i.recommendations) == null ? void 0 : _j.followUp) || [] }
      ];
    });
    function formatDate(value) {
      return value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
    }
    function capitalize(value) {
      return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
    }
    function humanize(value) {
      return capitalize(value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim());
    }
    function normalizeStatus(value) {
      const key = String(value || "").toLowerCase().replace(/[^a-z]/g, "");
      return { mildhigh: "mild-high", moderatehigh: "moderate-high", criticalhigh: "critical", high: "moderate-high", mildlow: "mild-low", moderatelow: "moderate-low", criticallow: "critical", low: "mild-low" }[key] || key;
    }
    function statusLabel(value) {
      return { normal: "Normal", borderline: "Borderline", "mild-high": "Mild high", "moderate-high": "Moderate high", critical: "Critical", "mild-low": "Mild low", "moderate-low": "Moderate low" }[value] || humanize(value);
    }
    function riskColor(score) {
      return score >= 75 ? "#b85a68" : score >= 50 ? "#c58a47" : score >= 25 ? "#cbb04f" : "#4c9579";
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "clinical-report" }, _attrs))} data-v-3bd15a42>`);
      if (unref(loading)) {
        _push(`<div class="report-loader" data-v-3bd15a42><div class="loader-hero" data-v-3bd15a42></div><div class="loader-grid" data-v-3bd15a42><span data-v-3bd15a42></span><span data-v-3bd15a42></span><span data-v-3bd15a42></span></div></div>`);
      } else if (unref(report)) {
        _push(`<main class="report-canvas" data-v-3bd15a42><header class="report-topbar" data-v-3bd15a42>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/reports",
          class: "back-control"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg viewBox="0 0 24 24" aria-hidden="true" data-v-3bd15a42${_scopeId}><path d="m15 18-6-6 6-6" data-v-3bd15a42${_scopeId}></path></svg> Reports `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true"
                }, [
                  createVNode("path", { d: "m15 18-6-6 6-6" })
                ])),
                createTextVNode(" Reports ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="topbar-actions" data-v-3bd15a42><button type="button"${ssrIncludeBooleanAttr(unref(downloading)) ? " disabled" : ""} data-v-3bd15a42><svg viewBox="0 0 24 24" aria-hidden="true" data-v-3bd15a42><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" data-v-3bd15a42></path></svg> ${ssrInterpolate(unref(downloading) ? "Preparing..." : "Download")}</button><button type="button" class="open-control" data-v-3bd15a42><svg viewBox="0 0 24 24" aria-hidden="true" data-v-3bd15a42><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" data-v-3bd15a42></path><circle cx="12" cy="12" r="2.5" data-v-3bd15a42></circle></svg> Open original </button></div></header>`);
        if (unref(downloadError)) {
          _push(`<p class="download-error" role="alert" data-v-3bd15a42>${ssrInterpolate(unref(downloadError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="report-identity" data-v-3bd15a42><div class="identity-copy" data-v-3bd15a42><div class="identity-kicker" data-v-3bd15a42><span data-v-3bd15a42>${ssrInterpolate(unref(reportType))}</span><i data-v-3bd15a42></i><span data-v-3bd15a42>${ssrInterpolate(capitalize(unref(report).status))}</span></div><h1 data-v-3bd15a42>${ssrInterpolate(unref(report).title)}</h1><div class="identity-meta" data-v-3bd15a42><span data-v-3bd15a42><small data-v-3bd15a42>Issued</small>${ssrInterpolate(formatDate(unref(report).createdAt))}</span>`);
        if (unref(report).forMember) {
          _push(`<span data-v-3bd15a42><small data-v-3bd15a42>Patient</small>${ssrInterpolate(unref(report).forMember)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(confidencePercent) != null) {
          _push(`<span data-v-3bd15a42><small data-v-3bd15a42>Confidence</small>${ssrInterpolate(unref(confidencePercent))}%</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(healthScore) != null) {
          _push(`<div class="identity-score" data-v-3bd15a42><span data-v-3bd15a42>Health index</span><strong data-v-3bd15a42>${ssrInterpolate(unref(healthScore))}</strong><div class="score-dots" aria-hidden="true" data-v-3bd15a42><!--[-->`);
          ssrRenderList(10, (n) => {
            _push(`<i class="${ssrRenderClass({ on: n <= Math.ceil(unref(healthScore) / 10) })}" data-v-3bd15a42></i>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section><section class="summary-band" data-v-3bd15a42><span class="band-number" data-v-3bd15a42>01</span><div data-v-3bd15a42><p data-v-3bd15a42>Executive summary</p><h2 data-v-3bd15a42>What we found</h2><blockquote data-v-3bd15a42>${ssrInterpolate(unref(report).summary || "No summary is available for this report.")}</blockquote></div></section>`);
        if ((_a = unref(report).criticalFindings) == null ? void 0 : _a.length) {
          _push(`<section class="alert-band critical-band" data-v-3bd15a42><span data-v-3bd15a42>Priority</span><ul data-v-3bd15a42><!--[-->`);
          ssrRenderList(unref(report).criticalFindings, (item) => {
            _push(`<li data-v-3bd15a42>${ssrInterpolate(item)}</li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_b = unref(report).warnings) == null ? void 0 : _b.length) {
          _push(`<section class="alert-band warning-band" data-v-3bd15a42><span data-v-3bd15a42>Review</span><ul data-v-3bd15a42><!--[-->`);
          ssrRenderList(unref(report).warnings, (item) => {
            _push(`<li data-v-3bd15a42>${ssrInterpolate(item)}</li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(riskCategoryList).length || ((_c = unref(report).missingImportantMarkers) == null ? void 0 : _c.length)) {
          _push(`<div class="bento-row" data-v-3bd15a42>`);
          if (unref(riskCategoryList).length) {
            _push(`<section class="panel risk-panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>02</span><div data-v-3bd15a42><p data-v-3bd15a42>Risk assessment</p><h2 data-v-3bd15a42>Health risk profile</h2></div></header><div class="risk-list" data-v-3bd15a42><!--[-->`);
            ssrRenderList(unref(riskCategoryList), (risk) => {
              _push(`<article data-v-3bd15a42><div data-v-3bd15a42><span data-v-3bd15a42>${ssrInterpolate(risk.label)}</span><strong data-v-3bd15a42>${ssrInterpolate(risk.value)}%</strong></div><div class="risk-line" data-v-3bd15a42><i style="${ssrRenderStyle({ width: `${risk.value}%`, background: riskColor(risk.value) })}" data-v-3bd15a42></i></div></article>`);
            });
            _push(`<!--]--></div></section>`);
          } else {
            _push(`<!---->`);
          }
          if ((_d = unref(report).missingImportantMarkers) == null ? void 0 : _d.length) {
            _push(`<section class="panel test-panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>03</span><div data-v-3bd15a42><p data-v-3bd15a42>Next investigations</p><h2 data-v-3bd15a42>Suggested tests</h2></div></header><ol data-v-3bd15a42><!--[-->`);
            ssrRenderList(unref(report).missingImportantMarkers, (test, index) => {
              _push(`<li data-v-3bd15a42><span data-v-3bd15a42>${ssrInterpolate(String(index + 1).padStart(2, "0"))}</span><p data-v-3bd15a42>${ssrInterpolate(test)}</p></li>`);
            });
            _push(`<!--]--></ol><small data-v-3bd15a42>Discuss these tests with a qualified healthcare professional.</small></section>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(hasRecommendations)) {
          _push(`<section class="panel recommendation-panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>04</span><div data-v-3bd15a42><p data-v-3bd15a42>Personal action plan</p><h2 data-v-3bd15a42>Recommendations</h2></div></header><div class="recommendation-grid" data-v-3bd15a42><!--[-->`);
          ssrRenderList(unref(recommendationSections), (section) => {
            _push(`<article style="${ssrRenderStyle(section.items.length ? null : { display: "none" })}" data-v-3bd15a42><span class="recommendation-letter" data-v-3bd15a42>${ssrInterpolate(section.letter)}</span><div data-v-3bd15a42><h3 data-v-3bd15a42>${ssrInterpolate(section.title)}</h3><ul data-v-3bd15a42><!--[-->`);
            ssrRenderList(section.items, (item) => {
              _push(`<li data-v-3bd15a42>${ssrInterpolate(item)}</li>`);
            });
            _push(`<!--]--></ul></div></article>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_e = unref(report).findings) == null ? void 0 : _e.length) {
          _push(`<section class="panel findings-panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>05</span><div data-v-3bd15a42><p data-v-3bd15a42>Detailed interpretation</p><h2 data-v-3bd15a42>Clinical findings</h2></div></header><div class="findings-list" data-v-3bd15a42><!--[-->`);
          ssrRenderList(unref(report).findings, (finding) => {
            var _a2, _b2;
            _push(`<article data-v-3bd15a42><div class="finding-head" data-v-3bd15a42><div data-v-3bd15a42><h3 data-v-3bd15a42>${ssrInterpolate(finding.label)}</h3>`);
            if (finding.value) {
              _push(`<strong data-v-3bd15a42>${ssrInterpolate(finding.value)}</strong>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><span class="${ssrRenderClass(`finding-status ${normalizeStatus(finding.status)}`)}" data-v-3bd15a42>${ssrInterpolate(statusLabel(normalizeStatus(finding.status)))}</span></div>`);
            if (finding.whyItMatters) {
              _push(`<p class="finding-body" data-v-3bd15a42>${ssrInterpolate(finding.whyItMatters)}</p>`);
            } else {
              _push(`<!---->`);
            }
            if ((_a2 = finding.possibleCauses) == null ? void 0 : _a2.length) {
              _push(`<div class="finding-detail" data-v-3bd15a42><span data-v-3bd15a42>Possible causes</span><p data-v-3bd15a42>${ssrInterpolate(finding.possibleCauses.join(" \xB7 "))}</p></div>`);
            } else {
              _push(`<!---->`);
            }
            if ((_b2 = finding.recommendedActions) == null ? void 0 : _b2.length) {
              _push(`<div class="finding-detail" data-v-3bd15a42><span data-v-3bd15a42>Recommended action</span><p data-v-3bd15a42>${ssrInterpolate(finding.recommendedActions.join(" \xB7 "))}</p></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</article>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (((_f = unref(report).keyInsights) == null ? void 0 : _f.length) || ((_g = unref(report).positiveFindings) == null ? void 0 : _g.length)) {
          _push(`<div class="bento-row" data-v-3bd15a42>`);
          if ((_h = unref(report).keyInsights) == null ? void 0 : _h.length) {
            _push(`<section class="panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>06</span><div data-v-3bd15a42><p data-v-3bd15a42>At a glance</p><h2 data-v-3bd15a42>Key insights</h2></div></header><ul class="editorial-list" data-v-3bd15a42><!--[-->`);
            ssrRenderList(unref(report).keyInsights, (item) => {
              _push(`<li data-v-3bd15a42>${ssrInterpolate(item)}</li>`);
            });
            _push(`<!--]--></ul></section>`);
          } else {
            _push(`<!---->`);
          }
          if ((_i = unref(report).positiveFindings) == null ? void 0 : _i.length) {
            _push(`<section class="panel positive-panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>07</span><div data-v-3bd15a42><p data-v-3bd15a42>Healthy indicators</p><h2 data-v-3bd15a42>Positive findings</h2></div></header><ul class="editorial-list" data-v-3bd15a42><!--[-->`);
            ssrRenderList(unref(report).positiveFindings, (item) => {
              _push(`<li data-v-3bd15a42>${ssrInterpolate(item)}</li>`);
            });
            _push(`<!--]--></ul></section>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_j = unref(report).markers) == null ? void 0 : _j.length) {
          _push(`<section class="panel markers-panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>08</span><div data-v-3bd15a42><p data-v-3bd15a42>Laboratory values</p><h2 data-v-3bd15a42>Markers</h2></div></header><div class="marker-scroll" data-v-3bd15a42><table data-v-3bd15a42><thead data-v-3bd15a42><tr data-v-3bd15a42><th data-v-3bd15a42>Marker</th><th data-v-3bd15a42>Result</th><th data-v-3bd15a42>Reference</th></tr></thead><tbody data-v-3bd15a42><!--[-->`);
          ssrRenderList(unref(report).markers, (marker) => {
            _push(`<tr data-v-3bd15a42><td data-v-3bd15a42>${ssrInterpolate(marker.name)}</td><td data-v-3bd15a42><strong data-v-3bd15a42>${ssrInterpolate(marker.value)}</strong> <span data-v-3bd15a42>${ssrInterpolate(marker.unit)}</span></td><td data-v-3bd15a42>${ssrInterpolate(marker.referenceRange || "\u2014")}</td></tr>`);
          });
          _push(`<!--]--></tbody></table></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_k = unref(report).patternAnalysis) == null ? void 0 : _k.length) {
          _push(`<section class="panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>09</span><div data-v-3bd15a42><p data-v-3bd15a42>Interconnected results</p><h2 data-v-3bd15a42>Pattern analysis</h2></div></header><div class="card-grid" data-v-3bd15a42><!--[-->`);
          ssrRenderList(unref(report).patternAnalysis, (pattern) => {
            _push(`<article data-v-3bd15a42><div data-v-3bd15a42><h3 data-v-3bd15a42>${ssrInterpolate(pattern.title)}</h3><span data-v-3bd15a42>${ssrInterpolate(capitalize(pattern.severity))}</span></div><p data-v-3bd15a42>${ssrInterpolate(pattern.insight)}</p></article>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (((_l = unref(report).longTermInsights) == null ? void 0 : _l.length) || ((_m = unref(report).fiveYearAnswers) == null ? void 0 : _m.length)) {
          _push(`<div class="bento-row" data-v-3bd15a42>`);
          if ((_n = unref(report).longTermInsights) == null ? void 0 : _n.length) {
            _push(`<section class="panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>10</span><div data-v-3bd15a42><p data-v-3bd15a42>Future outlook</p><h2 data-v-3bd15a42>Long-term insights</h2></div></header><div class="timeline" data-v-3bd15a42><!--[-->`);
            ssrRenderList(unref(report).longTermInsights, (item) => {
              _push(`<article data-v-3bd15a42><span data-v-3bd15a42>${ssrInterpolate(item.horizonYears)} year horizon</span><h3 data-v-3bd15a42>${ssrInterpolate(item.title)}</h3><p data-v-3bd15a42>${ssrInterpolate(item.insight)}</p></article>`);
            });
            _push(`<!--]--></div></section>`);
          } else {
            _push(`<!---->`);
          }
          if ((_o = unref(report).fiveYearAnswers) == null ? void 0 : _o.length) {
            _push(`<section class="panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>11</span><div data-v-3bd15a42><p data-v-3bd15a42>Forward plan</p><h2 data-v-3bd15a42>Five-year roadmap</h2></div></header><div class="timeline" data-v-3bd15a42><!--[-->`);
            ssrRenderList(unref(report).fiveYearAnswers, (item) => {
              _push(`<article data-v-3bd15a42><span data-v-3bd15a42>Year ${ssrInterpolate(item.year)}</span><h3 data-v-3bd15a42>${ssrInterpolate(item.question)}</h3><p data-v-3bd15a42>${ssrInterpolate(item.answer)}</p></article>`);
            });
            _push(`<!--]--></div></section>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_p = unref(report).dnaTraits) == null ? void 0 : _p.length) {
          _push(`<section class="panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>12</span><div data-v-3bd15a42><p data-v-3bd15a42>Genetic profile</p><h2 data-v-3bd15a42>DNA traits</h2></div></header><div class="card-grid" data-v-3bd15a42><!--[-->`);
          ssrRenderList(unref(report).dnaTraits, (trait) => {
            _push(`<article data-v-3bd15a42><div data-v-3bd15a42><h3 data-v-3bd15a42>${ssrInterpolate(trait.trait)}</h3><span data-v-3bd15a42>${ssrInterpolate(trait.result)}</span></div><p data-v-3bd15a42>${ssrInterpolate(trait.insight)}</p></article>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(displayedMedicineSuggestions).length) {
          _push(`<section class="panel medicine-panel" data-v-3bd15a42><header data-v-3bd15a42><span data-v-3bd15a42>13</span><div data-v-3bd15a42><p data-v-3bd15a42>Treatment considerations</p><h2 data-v-3bd15a42>Medicines &amp; supplements</h2></div></header><div class="medical-disclaimer" data-v-3bd15a42><strong data-v-3bd15a42>Professional guidance required</strong><p data-v-3bd15a42>These AI-generated suggestions are not a prescription. Consult a qualified healthcare professional before starting any medicine or supplement.</p></div><div class="medicine-grid" data-v-3bd15a42><!--[-->`);
          ssrRenderList(unref(displayedMedicineSuggestions), (medicine, index) => {
            var _a2, _b2, _c2, _d2;
            _push(`<article data-v-3bd15a42><div data-v-3bd15a42><span data-v-3bd15a42>${ssrInterpolate(capitalize(medicine.type))}</span>`);
            if ((_b2 = (_a2 = medicine.live) == null ? void 0 : _a2.isPrescriptionRequired) != null ? _b2 : medicine.isPrescriptionRequired) {
              _push(`<span class="rx" data-v-3bd15a42>Prescription</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><h3 data-v-3bd15a42>${ssrInterpolate(((_c2 = medicine.live) == null ? void 0 : _c2.brandName) || medicine.name)}</h3>`);
            if ((_d2 = medicine.live) == null ? void 0 : _d2.genericName) {
              _push(`<p data-v-3bd15a42>${ssrInterpolate(medicine.live.genericName)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<p data-v-3bd15a42>${ssrInterpolate(medicine.reason)}</p>`);
            if (medicine.evidence) {
              _push(`<small data-v-3bd15a42>${ssrInterpolate(medicine.evidence)}</small>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</article>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(report).extractedText) {
          _push(`<details class="source-panel" data-v-3bd15a42><summary data-v-3bd15a42><span data-v-3bd15a42><strong data-v-3bd15a42>Source document</strong><small data-v-3bd15a42>View extracted text</small></span><svg viewBox="0 0 24 24" data-v-3bd15a42><path d="m7 10 5 5 5-5" data-v-3bd15a42></path></svg></summary><pre data-v-3bd15a42>${ssrInterpolate(unref(report).extractedText)}</pre></details>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<footer class="report-footer" data-v-3bd15a42><span data-v-3bd15a42>Medivoy</span><p data-v-3bd15a42>Support document only. It does not replace professional medical diagnosis or care.</p></footer></main>`);
      } else {
        _push(`<main class="empty-report" data-v-3bd15a42><div data-v-3bd15a42>Report unavailable</div><h1 data-v-3bd15a42>We could not find this report</h1><p data-v-3bd15a42>It may have been removed or is not available to your account.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/reports" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Back to reports`);
            } else {
              return [
                createTextVNode("Back to reports")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</main>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3bd15a42"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-DtbO7bPp.mjs.map
