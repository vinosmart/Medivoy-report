import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { u as useRouter$1 } from './server.mjs';
import { u as useMedivoyApi } from './useMedivoyApi-BieI7KwV.mjs';
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

const medivoyLogo = "" + buildAssetsURL("medivoy-logo.CEZXNJWu.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useMedivoyApi();
    useAuthStore();
    useRouter$1();
    const tab = ref("login");
    const email = ref("");
    const password = ref("");
    const name = ref("");
    const role = ref("patient");
    const agreed = ref(false);
    const loading = ref(false);
    const message = ref("");
    const error = ref(false);
    const showPassword = ref(false);
    const passwordStrength = computed(() => {
      if (!password.value) return 0;
      let score = password.value.length >= 8 ? 1 : 0;
      if (/[A-Z]/.test(password.value) && /[a-z]/.test(password.value)) score++;
      if (/\d/.test(password.value) && /[^A-Za-z0-9]/.test(password.value)) score++;
      return score;
    });
    const passwordHint = computed(
      () => passwordStrength.value === 1 ? "Basic" : passwordStrength.value === 2 ? "Good" : passwordStrength.value === 3 ? "Strong" : "Too short"
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "auth-shell" }, _attrs))}><section class="auth-brand" aria-label="About Medivoy"><div class="brand-glow brand-glow-one"></div><div class="brand-glow brand-glow-two"></div><div class="brand-grid"></div><div class="brand-top"><img${ssrRenderAttr("src", unref(medivoyLogo))} alt="Medivoy" class="brand-logo"></div><div class="brand-content"><div class="brand-kicker"><span></span> Personal health intelligence</div><h1>One secure place for a healthier future.</h1><p class="brand-lead"> Connect your health records, family history and genetic insights in one beautifully organized dashboard. </p><div class="feature-list"><div class="feature-item"><span class="feature-icon">01</span><div><strong>Unified reports</strong><small>Health data, clearly organized</small></div></div><div class="feature-item"><span class="feature-icon">02</span><div><strong>Family health</strong><small>Understand patterns together</small></div></div><div class="feature-item"><span class="feature-icon">03</span><div><strong>Private &amp; secure</strong><small>Your information stays protected</small></div></div></div></div><p class="brand-footer">\xA9 2026 Medivoy. Your health, intelligently connected.</p></section><section class="auth-panel"><div class="mobile-logo"><img${ssrRenderAttr("src", unref(medivoyLogo))} alt="Medivoy"></div><div class="auth-card"><header class="auth-header"><p>${ssrInterpolate(unref(tab) === "login" ? "Welcome back" : "Start your journey")}</p><h2>${ssrInterpolate(unref(tab) === "login" ? "Sign in to Medivoy" : "Create your account")}</h2></header><div class="auth-tabs" role="tablist" aria-label="Account access"><button type="button" role="tab"${ssrRenderAttr("aria-selected", unref(tab) === "login")} class="${ssrRenderClass({ active: unref(tab) === "login" })}">Sign in</button><button type="button" role="tab"${ssrRenderAttr("aria-selected", unref(tab) === "register")} class="${ssrRenderClass({ active: unref(tab) === "register" })}">Create account</button></div>`);
      if (unref(tab) === "login") {
        _push(`<form class="auth-form"><div class="field"><label for="login-email">Email address</label><div class="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.08.35 6.05 4.57a1.5 1.5 0 0 0 1.74 0l6.05-4.57"></path></svg><input id="login-email"${ssrRenderAttr("value", unref(email))} type="email" autocomplete="email" placeholder="you@example.com" required></div></div><div class="field"><div class="label-row"><label for="login-password">Password</label><button type="button" class="text-button">Forgot password?</button></div><div class="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg><input id="login-password"${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} autocomplete="current-password" placeholder="Enter your password" required><button type="button" class="password-toggle"${ssrRenderAttr("aria-label", unref(showPassword) ? "Hide password" : "Show password")}>${ssrInterpolate(unref(showPassword) ? "Hide" : "Show")}</button></div></div><button class="primary-button"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} type="submit">`);
        if (unref(loading)) {
          _push(`<span class="spinner"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(loading) ? "Signing in..." : "Sign in")}</button></form>`);
      } else {
        _push(`<form class="auth-form"><div class="field"><label for="register-name">Full name</label><div class="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21v-2a8 8 0 0 1 16 0v2"></path></svg><input id="register-name"${ssrRenderAttr("value", unref(name))} type="text" autocomplete="name" placeholder="Your full name" required></div></div><div class="field"><label for="register-email">Email address</label><div class="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.08.35 6.05 4.57a1.5 1.5 0 0 0 1.74 0l6.05-4.57"></path></svg><input id="register-email"${ssrRenderAttr("value", unref(email))} type="email" autocomplete="email" placeholder="you@example.com" required></div></div><div class="field"><label for="register-password">Password</label><div class="input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg><input id="register-password"${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} autocomplete="new-password" placeholder="Create a strong password" minlength="8" required><button type="button" class="password-toggle"${ssrRenderAttr("aria-label", unref(showPassword) ? "Hide password" : "Show password")}>${ssrInterpolate(unref(showPassword) ? "Hide" : "Show")}</button></div><div class="strength-row"><div class="strength-bars"><span class="${ssrRenderClass({ on: unref(passwordStrength) >= 1 })}"></span><span class="${ssrRenderClass({ on: unref(passwordStrength) >= 2 })}"></span><span class="${ssrRenderClass({ on: unref(passwordStrength) >= 3 })}"></span></div><small>${ssrInterpolate(unref(password) ? unref(passwordHint) : "Minimum 8 characters")}</small></div></div><div class="field"><label for="register-role">Account type</label><div class="select-wrap"><select id="register-role"><option value="patient"${ssrIncludeBooleanAttr(Array.isArray(unref(role)) ? ssrLooseContain(unref(role), "patient") : ssrLooseEqual(unref(role), "patient")) ? " selected" : ""}>Patient / Individual</option><option value="doctor"${ssrIncludeBooleanAttr(Array.isArray(unref(role)) ? ssrLooseContain(unref(role), "doctor") : ssrLooseEqual(unref(role), "doctor")) ? " selected" : ""}>Doctor / Clinician</option></select></div></div><label class="terms-row"><input${ssrIncludeBooleanAttr(Array.isArray(unref(agreed)) ? ssrLooseContain(unref(agreed), null) : unref(agreed)) ? " checked" : ""} type="checkbox" required><span>I agree to the <button type="button">Terms of Service</button> and <button type="button">Privacy Notice</button>.</span></label><button class="primary-button"${ssrIncludeBooleanAttr(unref(loading) || !unref(agreed)) ? " disabled" : ""} type="submit">`);
        if (unref(loading)) {
          _push(`<span class="spinner"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(loading) ? "Creating account..." : "Create account")}</button></form>`);
      }
      if (unref(message)) {
        _push(`<div class="${ssrRenderClass([{ error: unref(error) }, "form-message"])}" role="status">${ssrInterpolate(unref(message))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="security-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.75 2.98 8.2 7 10 4.02-1.8 7-5.25 7-10V6l-7-3Z"></path><path d="m9 12 2 2 4-4"></path></svg> Medivoy keeps your information private and secure </p></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=pages-BTsQLx_0.mjs.map
