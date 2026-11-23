import { _ as __nuxt_component_0 } from './nuxt-link-CIcsgCdR.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, openBlock, createBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useMedivoyApi();
    const loading = ref(true);
    const userSearch = ref("");
    const users = ref([]);
    const reports = ref([]);
    const familyMembers = ref([]);
    const orders = ref([]);
    const genetics = ref([]);
    const userSearchPlaceholder = ref("");
    const riskClass = (score) => !score ? "text-slate-500" : score >= 60 ? "text-rose-600" : score >= 30 ? "text-amber-600" : "text-emerald-600";
    const statusClass = (status) => status === "completed" ? "bg-emerald-100 text-emerald-700" : status === "failed" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700";
    const stats = computed(() => [
      {
        label: "Users",
        tone: "rose",
        value: String(users.value.length),
        help: "Registered accounts"
      },
      {
        label: "Reports",
        tone: "blue",
        value: String(reports.value.length),
        help: "Uploaded reports"
      },
      {
        label: "Orders",
        tone: "amber",
        value: String(orders.value.length),
        help: "Kit orders placed"
      },
      {
        label: "Completed reports",
        tone: "green",
        value: String(
          reports.value.filter((r) => r.status === "completed").length
        ),
        help: "AI analysis complete"
      },
      {
        label: "Failed jobs",
        tone: "rose",
        value: String(
          reports.value.filter((r) => r.status === "failed").length
        ),
        help: "Processing errors"
      },
      {
        label: "Genetics profiles",
        tone: "purple",
        value: String(genetics.value.length),
        help: "Saved DNA analyses"
      }
    ]);
    const userMap = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const u of users.value)
        map.set(u.id || u.userId, {
          userId: u.id || u.userId,
          name: u.name,
          email: u.email,
          role: u.role || "patient",
          reportCount: 0,
          familyCount: 0,
          hasGenetics: false
        });
      const ensure = (id, defaults = {}) => {
        if (!map.has(id))
          map.set(id, {
            userId: id,
            name: defaults.name,
            email: defaults.email,
            role: defaults.role || "patient",
            reportCount: 0,
            familyCount: 0,
            hasGenetics: false
          });
        return map.get(id);
      };
      for (const r of reports.value) {
        const u = ensure(r.userId, { email: r.userEmail });
        u.reportCount += 1;
      }
      for (const f of familyMembers.value) {
        const u = ensure(f.userId);
        u.familyCount += 1;
      }
      for (const g of genetics.value) {
        const u = ensure(g.userId);
        u.hasGenetics = true;
      }
      return [...map.values()];
    });
    const filteredUsers = computed(() => {
      const q = userSearch.value.trim().toLowerCase();
      if (!q) return userMap.value;
      return userMap.value.filter(
        (u) => [u.name, u.email, u.role, u.userId].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
      );
    });
    const recentReports = computed(
      () => [...reports.value].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 8)
    );
    const topUsers = computed(
      () => [...userMap.value].sort((a, b) => b.reportCount - a.reportCount).slice(0, 5)
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-dashboard" }, _attrs))} data-v-c6ea0291><section class="admin-intro" data-v-c6ea0291><div class="admin-intro-copy" data-v-c6ea0291><span class="admin-eyebrow" data-v-c6ea0291><svg viewBox="0 0 24 24" aria-hidden="true" data-v-c6ea0291><path d="M12 3 20 6v5c0 4.5-3.2 8-8 10-4.8-2-8-5.5-8-10V6l8-3Z" data-v-c6ea0291></path><path d="m9 12 2 2 4-4" data-v-c6ea0291></path></svg> Administration </span><h1 data-v-c6ea0291>Platform overview</h1><p data-v-c6ea0291> Monitor account activity, reports, orders, and genetics profiles from one clear operational view. </p></div><div class="admin-intro-aside" data-v-c6ea0291><span class="admin-aside-icon" aria-hidden="true" data-v-c6ea0291><svg viewBox="0 0 24 24" data-v-c6ea0291><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" data-v-c6ea0291></rect><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" data-v-c6ea0291></rect><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" data-v-c6ea0291></rect><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" data-v-c6ea0291></rect></svg></span><span data-v-c6ea0291>Operational metrics</span><strong data-v-c6ea0291>${ssrInterpolate(unref(stats).length)}</strong><small data-v-c6ea0291>Live platform indicators</small></div></section><section class="admin-stat-grid" aria-label="Platform metrics" data-v-c6ea0291><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<article class="${ssrRenderClass([`stat-tone-${stat.tone}`, "admin-stat-card"])}" data-v-c6ea0291><div class="stat-card-top" data-v-c6ea0291><span class="stat-label" data-v-c6ea0291>${ssrInterpolate(stat.label)}</span><span class="stat-icon" aria-hidden="true" data-v-c6ea0291>`);
        if (stat.label === "Users") {
          _push(`<svg viewBox="0 0 24 24" data-v-c6ea0291><circle cx="9" cy="8" r="3" data-v-c6ea0291></circle><path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20M16 5.5a3 3 0 0 1 0 5.8M17 14h.5a3.5 3.5 0 0 1 3.5 3.5V20" data-v-c6ea0291></path></svg>`);
        } else if (stat.label === "Orders") {
          _push(`<svg viewBox="0 0 24 24" data-v-c6ea0291><path d="M6 3h12l2 4H4l2-4ZM4 7v13h16V7M9 11h6m-6 4h6" data-v-c6ea0291></path></svg>`);
        } else if (stat.label === "Failed jobs") {
          _push(`<svg viewBox="0 0 24 24" data-v-c6ea0291><path d="M12 3 2.8 19h18.4L12 3Z" data-v-c6ea0291></path><path d="M12 9v4m0 3h.01" data-v-c6ea0291></path></svg>`);
        } else if (stat.label === "Genetics profiles") {
          _push(`<svg viewBox="0 0 24 24" data-v-c6ea0291><path d="M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" data-v-c6ea0291></path></svg>`);
        } else {
          _push(`<svg viewBox="0 0 24 24" data-v-c6ea0291><path d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5m-5 3h5" data-v-c6ea0291></path></svg>`);
        }
        _push(`</span></div><strong class="stat-value" data-v-c6ea0291>${ssrInterpolate(stat.value)}</strong><span class="stat-help" data-v-c6ea0291>${ssrInterpolate(stat.help)}</span></article>`);
      });
      _push(`<!--]--></section><section class="admin-overview-grid" data-v-c6ea0291><article class="admin-panel recent-panel" data-v-c6ea0291><div class="admin-panel-heading" data-v-c6ea0291><div data-v-c6ea0291><span class="admin-kicker" data-v-c6ea0291>Activity</span><h2 data-v-c6ea0291>Recent reports</h2><p data-v-c6ea0291>Latest analysis jobs and statuses</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/reports",
        class: "admin-view-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View all <svg viewBox="0 0 24 24" aria-hidden="true" data-v-c6ea0291${_scopeId}><path d="M5 12h14m-6-6 6 6-6 6" data-v-c6ea0291${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" View all "),
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
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="admin-skeleton-list" aria-label="Loading reports" data-v-c6ea0291><!--[-->`);
        ssrRenderList(4, (n) => {
          _push(`<div class="admin-skeleton" data-v-c6ea0291></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(recentReports).length) {
        _push(`<div class="recent-report-list" data-v-c6ea0291><!--[-->`);
        ssrRenderList(unref(recentReports), (report) => {
          var _a2, _b2;
          _push(`<article class="recent-report" data-v-c6ea0291><span class="report-file-icon" aria-hidden="true" data-v-c6ea0291><svg viewBox="0 0 24 24" data-v-c6ea0291><path d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5m-5 3h5" data-v-c6ea0291></path></svg></span><div class="report-info" data-v-c6ea0291><div class="report-title-line" data-v-c6ea0291><p data-v-c6ea0291>${ssrInterpolate(report.title)}</p><span class="${ssrRenderClass([statusClass(report.status), "report-status"])}" data-v-c6ea0291>${ssrInterpolate(report.status)}</span></div><span class="report-meta" data-v-c6ea0291>${ssrInterpolate(((_a2 = report.type) == null ? void 0 : _a2.toUpperCase()) || "REPORT")} <i data-v-c6ea0291></i> ${ssrInterpolate(report.userEmail || report.userId || "\u2014")}</span></div><div class="report-risk" data-v-c6ea0291><span data-v-c6ea0291>Risk score</span><strong class="${ssrRenderClass(riskClass(report.riskScore))}" data-v-c6ea0291>${ssrInterpolate((_b2 = report.riskScore) != null ? _b2 : "\u2014")}</strong></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="admin-empty" data-v-c6ea0291><span class="admin-empty-icon" aria-hidden="true" data-v-c6ea0291><svg viewBox="0 0 24 24" data-v-c6ea0291><path d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5m-5 3h5" data-v-c6ea0291></path></svg></span><p data-v-c6ea0291>No reports to display yet.</p></div>`);
      }
      _push(`</article><article class="admin-panel top-users-panel" data-v-c6ea0291><div class="admin-panel-heading" data-v-c6ea0291><div data-v-c6ea0291><span class="admin-kicker" data-v-c6ea0291>Engagement</span><h2 data-v-c6ea0291>Top users</h2><p data-v-c6ea0291>Users with the most reports</p></div></div>`);
      if (unref(loading)) {
        _push(`<div class="admin-skeleton-list" aria-label="Loading users" data-v-c6ea0291><!--[-->`);
        ssrRenderList(4, (n) => {
          _push(`<div class="admin-skeleton" data-v-c6ea0291></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(topUsers).length) {
        _push(`<div class="top-user-list" data-v-c6ea0291><!--[-->`);
        ssrRenderList(unref(topUsers), (user, index2) => {
          _push(`<article class="top-user" data-v-c6ea0291><span class="top-user-rank" data-v-c6ea0291>${ssrInterpolate(String(index2 + 1).padStart(2, "0"))}</span><span class="top-user-avatar" aria-hidden="true" data-v-c6ea0291>${ssrInterpolate((user.name || user.email || user.userId || "U").slice(0, 1).toUpperCase())}</span><div class="top-user-info" data-v-c6ea0291><strong data-v-c6ea0291>${ssrInterpolate(user.name || user.email || user.userId)}</strong><span data-v-c6ea0291>${ssrInterpolate(user.email || "No email")}</span></div><span class="user-report-count" data-v-c6ea0291>${ssrInterpolate(user.count)} reports</span></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="admin-empty" data-v-c6ea0291><span class="admin-empty-icon" aria-hidden="true" data-v-c6ea0291><svg viewBox="0 0 24 24" data-v-c6ea0291><circle cx="9" cy="8" r="3" data-v-c6ea0291></circle><path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20" data-v-c6ea0291></path></svg></span><p data-v-c6ea0291>No user activity to rank yet.</p></div>`);
      }
      _push(`</article></section><section class="admin-detail-grid" data-v-c6ea0291><article class="admin-panel users-panel" data-v-c6ea0291><div class="admin-panel-heading users-panel-heading" data-v-c6ea0291><div data-v-c6ea0291><span class="admin-kicker" data-v-c6ea0291>Directory</span><h2 data-v-c6ea0291>All users</h2><p data-v-c6ea0291>Accounts, report counts, and health profile activity</p></div><label class="user-search" data-v-c6ea0291><svg viewBox="0 0 24 24" aria-hidden="true" data-v-c6ea0291><circle cx="11" cy="11" r="8" data-v-c6ea0291></circle><path d="m21 21-4.35-4.35" data-v-c6ea0291></path></svg><input${ssrRenderAttr("value", unref(userSearch))} type="search" aria-label="Search users"${ssrRenderAttr("placeholder", unref(userSearchPlaceholder))} data-v-c6ea0291></label></div><div class="user-table-wrap" data-v-c6ea0291><div class="user-table-scroll" data-v-c6ea0291><table class="user-table" data-v-c6ea0291><thead data-v-c6ea0291><tr data-v-c6ea0291><th data-v-c6ea0291>User</th><th data-v-c6ea0291>Role</th><th data-v-c6ea0291>Reports</th><th data-v-c6ea0291>Family</th><th data-v-c6ea0291>Genetics</th></tr></thead><tbody data-v-c6ea0291><!--[-->`);
      ssrRenderList(unref(filteredUsers), (user) => {
        _push(`<tr data-v-c6ea0291><td data-v-c6ea0291><strong data-v-c6ea0291>${ssrInterpolate(user.name || user.email || user.userId)}</strong><span data-v-c6ea0291>${ssrInterpolate(user.email || "No email")}</span></td><td data-v-c6ea0291><span class="role-badge" data-v-c6ea0291>${ssrInterpolate(user.role || "patient")}</span></td><td class="table-number" data-v-c6ea0291>${ssrInterpolate(user.reportCount)}</td><td class="table-number" data-v-c6ea0291>${ssrInterpolate(user.familyCount)}</td><td data-v-c6ea0291><span class="${ssrRenderClass([user.hasGenetics ? "genetics-present" : "genetics-absent", "genetics-badge"])}" data-v-c6ea0291>${ssrInterpolate(user.hasGenetics ? "Available" : "\u2014")}</span></td></tr>`);
      });
      _push(`<!--]-->`);
      if (!unref(filteredUsers).length) {
        _push(`<tr data-v-c6ea0291><td colspan="5" class="table-empty" data-v-c6ea0291>${ssrInterpolate(unref(userSearch) ? "No users match your search." : "No user accounts to display.")}</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div></article><article class="admin-panel workflow-panel" data-v-c6ea0291><div class="admin-panel-heading" data-v-c6ea0291><div data-v-c6ea0291><span class="admin-kicker" data-v-c6ea0291>Operations</span><h2 data-v-c6ea0291>Lab &amp; workflow</h2><p data-v-c6ea0291>Orders, reports, and processing status</p></div></div><div class="workflow-metrics" data-v-c6ea0291><div class="workflow-metric" data-v-c6ea0291><span class="workflow-icon workflow-orders" aria-hidden="true" data-v-c6ea0291><svg viewBox="0 0 24 24" data-v-c6ea0291><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" data-v-c6ea0291></path><path d="m4.5 7.3 7.5 4 7.5-4M12 11.5V21M8 5l8 4" data-v-c6ea0291></path></svg></span><div data-v-c6ea0291><span data-v-c6ea0291>Total orders</span><strong data-v-c6ea0291>${ssrInterpolate((_a = unref(stats).find((stat) => stat.label === "Orders")) == null ? void 0 : _a.value)}</strong></div></div><div class="workflow-metric" data-v-c6ea0291><span class="workflow-icon workflow-complete" aria-hidden="true" data-v-c6ea0291><svg viewBox="0 0 24 24" data-v-c6ea0291><path d="M6 3h8l4 4v14H6V3Zm8 0v5h5" data-v-c6ea0291></path><path d="m9 15 2 2 4-4" data-v-c6ea0291></path></svg></span><div data-v-c6ea0291><span data-v-c6ea0291>Completed reports</span><strong data-v-c6ea0291>${ssrInterpolate((_b = unref(stats).find((stat) => stat.label === "Completed reports")) == null ? void 0 : _b.value)}</strong></div></div><div class="workflow-metric" data-v-c6ea0291><span class="workflow-icon workflow-failed" aria-hidden="true" data-v-c6ea0291><svg viewBox="0 0 24 24" data-v-c6ea0291><circle cx="12" cy="12" r="9" data-v-c6ea0291></circle><path d="M12 7v6m0 4h.01" data-v-c6ea0291></path></svg></span><div data-v-c6ea0291><span data-v-c6ea0291>Failed jobs</span><strong data-v-c6ea0291>${ssrInterpolate((_c = unref(stats).find((stat) => stat.label === "Failed jobs")) == null ? void 0 : _c.value)}</strong></div></div></div></article></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c6ea0291"]]);

export { index as default };
//# sourceMappingURL=admin-kQfeYMYi.mjs.map
