<template>
  <main class="auth-shell">
    <section class="auth-brand" aria-label="About Medivoy">
      <div class="brand-glow brand-glow-one"></div>
      <div class="brand-glow brand-glow-two"></div>
      <div class="brand-grid"></div>

      <div class="brand-top">
        <img :src="medivoyLogo" alt="Medivoy" class="brand-logo" />
      </div>

      <div class="brand-content">
        <div class="brand-kicker"><span></span> Personal health intelligence</div>
        <h1>One secure place for a healthier future.</h1>
        <p class="brand-lead">
          Connect your health records, family history and genetic insights in one beautifully organized dashboard.
        </p>

        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">01</span>
            <div><strong>Unified reports</strong><small>Health data, clearly organized</small></div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">02</span>
            <div><strong>Family health</strong><small>Understand patterns together</small></div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">03</span>
            <div><strong>Private & secure</strong><small>Your information stays protected</small></div>
          </div>
        </div>
      </div>

      <p class="brand-footer">© 2026 Medivoy. Your health, intelligently connected.</p>
    </section>

    <section class="auth-panel">
      <div class="mobile-logo">
        <img :src="medivoyLogo" alt="Medivoy" />
      </div>

      <div class="auth-card">
        <header class="auth-header">
          <p>{{ tab === "login" ? "Welcome back" : "Start your journey" }}</p>
          <h2>{{ tab === "login" ? "Sign in to Medivoy" : "Create your account" }}</h2>
        </header>

        <div class="auth-tabs" role="tablist" aria-label="Account access">
          <button type="button" role="tab" :aria-selected="tab === 'login'" :class="{ active: tab === 'login' }" @click="switchTab('login')">Sign in</button>
          <button type="button" role="tab" :aria-selected="tab === 'register'" :class="{ active: tab === 'register' }" @click="switchTab('register')">Create account</button>
        </div>

        <form v-if="tab === 'login'" class="auth-form" @submit.prevent="submitLogin">
          <div class="field">
            <label for="login-email">Email address</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.08.35 6.05 4.57a1.5 1.5 0 0 0 1.74 0l6.05-4.57" /></svg>
              <input id="login-email" v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div class="field">
            <div class="label-row">
              <label for="login-password">Password</label>
              <button type="button" class="text-button" @click="message = 'Password recovery can be enabled from the account settings.'">Forgot password?</button>
            </div>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
              <input id="login-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Enter your password" required />
              <button type="button" class="password-toggle" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
                {{ showPassword ? "Hide" : "Show" }}
              </button>
            </div>
          </div>

          <button class="primary-button" :disabled="loading" type="submit">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Signing in..." : "Sign in" }}
          </button>
        </form>

        <form v-else class="auth-form" @submit.prevent="submitRegister">
          <div class="field">
            <label for="register-name">Full name</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>
              <input id="register-name" v-model="name" type="text" autocomplete="name" placeholder="Your full name" required />
            </div>
          </div>

          <div class="field">
            <label for="register-email">Email address</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.08.35 6.05 4.57a1.5 1.5 0 0 0 1.74 0l6.05-4.57" /></svg>
              <input id="register-email" v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div class="field">
            <label for="register-password">Password</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
              <input id="register-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Create a strong password" minlength="8" required />
              <button type="button" class="password-toggle" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">{{ showPassword ? "Hide" : "Show" }}</button>
            </div>
            <div class="strength-row">
              <div class="strength-bars"><span :class="{ on: passwordStrength >= 1 }"></span><span :class="{ on: passwordStrength >= 2 }"></span><span :class="{ on: passwordStrength >= 3 }"></span></div>
              <small>{{ password ? passwordHint : "Minimum 8 characters" }}</small>
            </div>
          </div>

          <div class="field">
            <label for="register-role">Account type</label>
            <div class="select-wrap">
              <select id="register-role" v-model="role"><option value="patient">Patient / Individual</option><option value="doctor">Doctor / Clinician</option></select>
            </div>
          </div>

          <label class="terms-row"><input v-model="agreed" type="checkbox" required /><span>I agree to the <button type="button">Terms of Service</button> and <button type="button">Privacy Notice</button>.</span></label>
          <button class="primary-button" :disabled="loading || !agreed" type="submit">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Creating account..." : "Create account" }}
          </button>
        </form>

        <div v-if="message" class="form-message" :class="{ error }" role="status">{{ message }}</div>
      </div>

      <p class="security-note">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.75 2.98 8.2 7 10 4.02-1.8 7-5.25 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
        Medivoy keeps your information private and secure
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import medivoyLogo from "~/assets/images/medivoy-logo.png";

definePageMeta({ layout: false });

const api = useMedivoyApi();
const auth = useAuthStore();
const router = useRouter();

const tab = ref<"login" | "register">("login");
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

const passwordHint = computed(() =>
  passwordStrength.value === 1
    ? "Basic"
    : passwordStrength.value === 2
      ? "Good"
      : passwordStrength.value === 3
        ? "Strong"
        : "Too short",
);

const switchTab = (nextTab: "login" | "register") => {
  tab.value = nextTab;
  message.value = "";
  error.value = false;
  password.value = "";
};

const readableError = (e: any, fallback: string) => {
  const apiMessage = e?.data?.message;
  if (Array.isArray(apiMessage)) return apiMessage.join(". ");
  if (typeof apiMessage === "string" && !apiMessage.includes("https://")) return apiMessage;
  if (e?.message && !e.message.includes("fetch")) return e.message;
  return "We could not connect to Medivoy right now. Please check your connection and try again.";
};

const setMsg = (msg: string, isError = false) => {
  message.value = msg;
  error.value = isError;
};

const submitLogin = async () => {
  loading.value = true;
  message.value = "";
  try {
    const res = await api.login(email.value, password.value);
    auth.login(
      { ...(res.user || {}), email: res.user?.email || email.value.trim() },
      res.access_token,
    );
    setMsg("Login successful.");
    await router.push("/dashboard");
  } catch (e: any) {
    setMsg(readableError(e, "Login failed."), true);
  } finally {
    loading.value = false;
  }
};

const submitRegister = async () => {
  loading.value = true;
  message.value = "";
  try {
    const res = await api.register(email.value, password.value, role.value, name.value);
    auth.login(
      {
        ...(res.user || {}),
        name: res.user?.name || name.value.trim(),
        email: res.user?.email || email.value.trim(),
      },
      res.access_token,
    );
    setMsg("Account created successfully.");
    await router.push("/dashboard");
  } catch (e: any) {
    setMsg(readableError(e, "Registration failed."), true);
  } finally {
    loading.value = false;
  }
};
</script>
