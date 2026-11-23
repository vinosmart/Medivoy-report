import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CIcsgCdR.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderTeleport, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc, c as useRouter, e as useRoute } from './server.mjs';
import { u as useAuthStore } from './auth-DLg6Nzla.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';

const medivoyLogo = "" + buildAssetsURL("medivoy-logo-color.DQnfz6ii.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    useRouter();
    const route = useRoute();
    const reports = ref([]);
    const mobileMenu = ref(false);
    const sidebarCollapsed = ref(true);
    const profileMenuOpen = ref(false);
    const logoutConfirmOpen = ref(false);
    watch(sidebarCollapsed, (collapsed) => {
    });
    const accountName = computed(() => {
      var _a, _b;
      const name = String(((_a = auth.user) == null ? void 0 : _a.name) || "").trim();
      if (name) return name;
      const email = String(((_b = auth.user) == null ? void 0 : _b.email) || "").trim();
      return email ? email.split("@")[0] : "Medivoy user";
    });
    watch(
      () => route.fullPath,
      () => {
        mobileMenu.value = false;
        profileMenuOpen.value = false;
      }
    );
    const navItems = computed(() => [
      { label: "Dashboard", to: "/dashboard", icon: "D" },
      {
        label: "Reports",
        to: "/reports",
        icon: "R",
        badge: reports.value.length ? String(reports.value.length) : ""
      },
      { label: "Upload report", to: "/reports/upload", icon: "+" },
      { label: "Family health", to: "/family", icon: "F" },
      { label: "Nutrition", to: "/nutrition", icon: "N" },
      { label: "Lab kits", to: "/lab-kits", icon: "L" },
      { label: "Genetics", to: "/genetics", icon: "G" },
      { label: "Pharmacy", to: "/pharmacy", icon: "P" },
      { label: "Admin", to: "/admin", icon: "A", badge: auth.isAdmin ? "on" : "" }
    ]);
    const routeTitles = {
      "/dashboard": "Dashboard",
      "/reports": "Reports",
      "/reports/upload": "Upload Report",
      "/family": "Family Health",
      "/nutrition": "Nutrition",
      "/lab-kits": "Lab Kits",
      "/genetics": "Genetics",
      "/pharmacy": "Pharmacy",
      "/admin": "Admin"
    };
    const subtitleMap = {
      "/dashboard": "Overview of your health intelligence",
      "/reports": "Manage uploaded reports",
      "/reports/upload": "Upload and analyze a new report",
      "/family": "Track hereditary and family history",
      "/nutrition": "View diet and vitamin guidance",
      "/lab-kits": "Partner kits and fulfillment",
      "/genetics": "DNA and variant insights",
      "/pharmacy": "Search medicines and find doctors",
      "/admin": "Platform control center"
    };
    const title = computed(() => routeTitles[route.path] || "Medivoy");
    const subtitle = computed(
      () => subtitleMap[route.path] || "Preventive Health OS"
    );
    const initials = computed(
      () => {
        var _a, _b;
        return (((_a = auth.user) == null ? void 0 : _a.name) || ((_b = auth.user) == null ? void 0 : _b.email) || "M").split(" ").map((v) => v[0]).slice(0, 2).join("").toUpperCase();
      }
    );
    computed(() => {
      var _a, _b;
      return (_b = (_a = auth.user) == null ? void 0 : _a.healthScore) != null ? _b : "87";
    });
    computed(() => reports.value.length);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white text-slate-900" }, _attrs))} data-v-f3175827>`);
      if (mobileMenu.value) {
        _push(`<button type="button" class="sidebar-overlay" aria-label="Close navigation" data-v-f3175827></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex min-h-screen" data-v-f3175827>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (logoutConfirmOpen.value) {
          _push2(`<div class="logout-confirm-backdrop" role="presentation" data-v-f3175827><section class="logout-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title" aria-describedby="logout-confirm-description" data-v-f3175827><div class="logout-confirm-icon" aria-hidden="true" data-v-f3175827><svg viewBox="0 0 24 24" data-v-f3175827><path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10" data-v-f3175827></path></svg></div><h2 id="logout-confirm-title" data-v-f3175827>Sign out of Medivoy?</h2><p id="logout-confirm-description" data-v-f3175827> You will need to sign in again to access your health workspace. </p><div class="logout-confirm-actions" data-v-f3175827><button type="button" class="logout-stay-button" data-v-f3175827> Stay signed in </button><button type="button" class="logout-confirm-button" data-v-f3175827> Sign out </button></div></section></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<aside id="workspace-sidebar" class="${ssrRenderClass(["app-sidebar", { "app-sidebar-open": mobileMenu.value, "app-sidebar-collapsed": sidebarCollapsed.value }])}" data-v-f3175827><button type="button" class="sidebar-toggle"${ssrRenderAttr("aria-label", sidebarCollapsed.value ? "Expand sidebar" : "Collapse sidebar")}${ssrRenderAttr("aria-expanded", !sidebarCollapsed.value)} aria-controls="workspace-sidebar"${ssrRenderAttr("title", sidebarCollapsed.value ? "Expand sidebar" : "Collapse sidebar")} data-v-f3175827><svg viewBox="0 0 24 24" aria-hidden="true" data-v-f3175827>`);
      if (sidebarCollapsed.value) {
        _push(`<path d="m9 6 6 6-6 6" data-v-f3175827></path>`);
      } else {
        _push(`<path d="m15 6-6 6 6 6" data-v-f3175827></path>`);
      }
      _push(`</svg></button><button type="button" class="sidebar-close" aria-label="Close navigation" data-v-f3175827><svg viewBox="0 0 24 24" aria-hidden="true" data-v-f3175827><path d="m6 6 12 12M18 6 6 18" data-v-f3175827></path></svg></button><div class="sidebar-brand" data-v-f3175827><div class="brand-row" data-v-f3175827><img${ssrRenderAttr("src", unref(medivoyLogo))} alt="Medivoy" class="brand-logo" data-v-f3175827><span class="brand-collapsed-mark" aria-hidden="true" data-v-f3175827>M</span><p class="brand-caption" data-v-f3175827>Personal health workspace</p></div></div><div class="flex-1 overflow-y-auto px-4 py-5" data-v-f3175827><div class="nav-label" data-v-f3175827>Health management</div><nav class="workspace-nav" aria-label="Workspace navigation" data-v-f3175827><!--[-->`);
      ssrRenderList(navItems.value, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: "nav-item",
          "exact-active-class": "nav-item-active",
          "aria-label": sidebarCollapsed.value ? item.label : void 0,
          title: sidebarCollapsed.value ? item.label : void 0
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="nav-icon" aria-hidden="true" data-v-f3175827${_scopeId}>`);
              if (item.icon === "D") {
                _push2(`<svg viewBox="0 0 24 24" data-v-f3175827${_scopeId}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" data-v-f3175827${_scopeId}></rect><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" data-v-f3175827${_scopeId}></rect><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" data-v-f3175827${_scopeId}></rect><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" data-v-f3175827${_scopeId}></rect></svg>`);
              } else if (item.icon === "R") {
                _push2(`<svg viewBox="0 0 24 24" data-v-f3175827${_scopeId}><path d="M7 3.5h7l4 4v13H7v-17ZM14 3.5v4h4M10 12h5M10 15.5h5" data-v-f3175827${_scopeId}></path></svg>`);
              } else if (item.icon === "+") {
                _push2(`<svg viewBox="0 0 24 24" data-v-f3175827${_scopeId}><path d="M12 5v14M5 12h14" data-v-f3175827${_scopeId}></path></svg>`);
              } else if (item.icon === "F") {
                _push2(`<svg viewBox="0 0 24 24" data-v-f3175827${_scopeId}><circle cx="9" cy="8" r="3" data-v-f3175827${_scopeId}></circle><path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20M16 5.5a3 3 0 0 1 0 5.8M17 14h.5a3.5 3.5 0 0 1 3.5 3.5V20" data-v-f3175827${_scopeId}></path></svg>`);
              } else if (item.icon === "N") {
                _push2(`<svg viewBox="0 0 24 24" data-v-f3175827${_scopeId}><path d="M20 4C11 4 5 7.5 5 14a6 6 0 0 0 6 6c6.5 0 9-7 9-16Z" data-v-f3175827${_scopeId}></path><path d="M4 21c3-5 7-8 12-11" data-v-f3175827${_scopeId}></path></svg>`);
              } else if (item.icon === "L") {
                _push2(`<svg viewBox="0 0 24 24" data-v-f3175827${_scopeId}><path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" data-v-f3175827${_scopeId}></path></svg>`);
              } else if (item.icon === "G") {
                _push2(`<svg viewBox="0 0 24 24" data-v-f3175827${_scopeId}><path d="M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" data-v-f3175827${_scopeId}></path></svg>`);
              } else if (item.icon === "P") {
                _push2(`<svg viewBox="0 0 24 24" data-v-f3175827${_scopeId}><path d="M8 4h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8ZM8 12h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8ZM12 4v8M12 12v8" data-v-f3175827${_scopeId}></path></svg>`);
              } else {
                _push2(`<svg viewBox="0 0 24 24" data-v-f3175827${_scopeId}><path d="m12 3 8 3v5c0 4.5-3.2 8-8 10-4.8-2-8-5.5-8-10V6l8-3Z" data-v-f3175827${_scopeId}></path><path d="m9 12 2 2 4-4" data-v-f3175827${_scopeId}></path></svg>`);
              }
              _push2(`</span><span class="flex-1" data-v-f3175827${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              if (item.badge) {
                _push2(`<span class="nav-badge" data-v-f3175827${_scopeId}>${ssrInterpolate(item.badge)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("span", {
                  class: "nav-icon",
                  "aria-hidden": "true"
                }, [
                  item.icon === "D" ? (openBlock(), createBlock("svg", {
                    key: 0,
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("rect", {
                      x: "3.5",
                      y: "3.5",
                      width: "7",
                      height: "7",
                      rx: "1.5"
                    }),
                    createVNode("rect", {
                      x: "13.5",
                      y: "3.5",
                      width: "7",
                      height: "7",
                      rx: "1.5"
                    }),
                    createVNode("rect", {
                      x: "3.5",
                      y: "13.5",
                      width: "7",
                      height: "7",
                      rx: "1.5"
                    }),
                    createVNode("rect", {
                      x: "13.5",
                      y: "13.5",
                      width: "7",
                      height: "7",
                      rx: "1.5"
                    })
                  ])) : item.icon === "R" ? (openBlock(), createBlock("svg", {
                    key: 1,
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", { d: "M7 3.5h7l4 4v13H7v-17ZM14 3.5v4h4M10 12h5M10 15.5h5" })
                  ])) : item.icon === "+" ? (openBlock(), createBlock("svg", {
                    key: 2,
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", { d: "M12 5v14M5 12h14" })
                  ])) : item.icon === "F" ? (openBlock(), createBlock("svg", {
                    key: 3,
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("circle", {
                      cx: "9",
                      cy: "8",
                      r: "3"
                    }),
                    createVNode("path", { d: "M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20M16 5.5a3 3 0 0 1 0 5.8M17 14h.5a3.5 3.5 0 0 1 3.5 3.5V20" })
                  ])) : item.icon === "N" ? (openBlock(), createBlock("svg", {
                    key: 4,
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", { d: "M20 4C11 4 5 7.5 5 14a6 6 0 0 0 6 6c6.5 0 9-7 9-16Z" }),
                    createVNode("path", { d: "M4 21c3-5 7-8 12-11" })
                  ])) : item.icon === "L" ? (openBlock(), createBlock("svg", {
                    key: 5,
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", { d: "M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" })
                  ])) : item.icon === "G" ? (openBlock(), createBlock("svg", {
                    key: 6,
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", { d: "M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" })
                  ])) : item.icon === "P" ? (openBlock(), createBlock("svg", {
                    key: 7,
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", { d: "M8 4h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8ZM8 12h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8ZM12 4v8M12 12v8" })
                  ])) : (openBlock(), createBlock("svg", {
                    key: 8,
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", { d: "m12 3 8 3v5c0 4.5-3.2 8-8 10-4.8-2-8-5.5-8-10V6l8-3Z" }),
                    createVNode("path", { d: "m9 12 2 2 4-4" })
                  ]))
                ]),
                createVNode("span", { class: "flex-1" }, toDisplayString(item.label), 1),
                item.badge ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "nav-badge"
                }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav></div><div class="sidebar-account" data-v-f3175827><div class="account-card" data-v-f3175827><div class="account-avatar" data-v-f3175827>${ssrInterpolate(initials.value)}</div><div class="account-copy" data-v-f3175827><span class="account-overline" data-v-f3175827>Your account</span><strong data-v-f3175827>${ssrInterpolate(accountName.value)}</strong><span class="account-email" data-v-f3175827>${ssrInterpolate(((_a = unref(auth).user) == null ? void 0 : _a.email) || "Guest")}</span></div></div><button class="sign-out" data-v-f3175827><svg viewBox="0 0 24 24" aria-hidden="true" data-v-f3175827><path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10" data-v-f3175827></path></svg><span class="sign-out-label" data-v-f3175827>Sign out</span></button></div></aside><div class="${ssrRenderClass(["flex-1", "xl:pl-80", { "app-content-collapsed": sidebarCollapsed.value }])}" data-v-f3175827><header class="app-header sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl" data-v-f3175827><div class="app-header-inner flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8" data-v-f3175827><div class="flex items-center gap-3" data-v-f3175827><button type="button" class="app-menu-button xl:hidden" aria-label="Open navigation" data-v-f3175827><svg viewBox="0 0 24 24" aria-hidden="true" data-v-f3175827><path d="M4 7h16M4 12h16M4 17h16" data-v-f3175827></path></svg></button><div class="header-titles" data-v-f3175827><h2 data-v-f3175827>${ssrInterpolate(title.value)}</h2><p data-v-f3175827>${ssrInterpolate(subtitle.value)}</p></div></div><div class="header-account-menu" data-v-f3175827><button type="button" class="header-profile"${ssrRenderAttr("aria-expanded", profileMenuOpen.value)} aria-haspopup="menu" aria-controls="header-profile-menu"${ssrRenderAttr("aria-label", `${accountName.value} account menu`)} data-v-f3175827><span class="header-profile-copy" data-v-f3175827><span class="header-user-overline" data-v-f3175827><i data-v-f3175827></i> Signed in</span><span class="header-user-name" data-v-f3175827>${ssrInterpolate(accountName.value)}</span><span class="header-user-email" data-v-f3175827>${ssrInterpolate(((_b = unref(auth).user) == null ? void 0 : _b.email) || "Guest")}</span></span><span class="header-avatar" aria-hidden="true" data-v-f3175827>${ssrInterpolate(initials.value)}</span></button>`);
      if (profileMenuOpen.value) {
        _push(`<div class="header-profile-menu" data-v-f3175827><div class="profile-menu-account" data-v-f3175827><span class="profile-menu-avatar" aria-hidden="true" data-v-f3175827>${ssrInterpolate(initials.value)}</span><div class="profile-menu-copy" data-v-f3175827><span class="profile-menu-overline" data-v-f3175827>Your account</span><strong data-v-f3175827>${ssrInterpolate(accountName.value)}</strong><span class="profile-menu-email" data-v-f3175827>${ssrInterpolate(((_c = unref(auth).user) == null ? void 0 : _c.email) || "Guest")}</span></div></div><div id="header-profile-menu" role="menu" data-v-f3175827><button type="button" class="profile-sign-out" role="menuitem" data-v-f3175827><svg viewBox="0 0 24 24" aria-hidden="true" data-v-f3175827><path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10" data-v-f3175827></path></svg><span data-v-f3175827>Sign out</span></button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header><main class="app-main px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12" data-v-f3175827><div class="mx-auto max-w-7xl" data-v-f3175827>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f3175827"]]);

export { _default as default };
//# sourceMappingURL=default-D-YaJVMt.mjs.map
