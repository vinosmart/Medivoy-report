<template>
  <div
    class="medivoy-auth-background grid min-h-[100dvh] w-full grid-cols-1 lg:grid-cols-2"
    @click="closeAccountTypeMenu"
  >
    <!-- Left panel -->
    <div
      class="brand-panel relative hidden min-h-[100dvh] flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-900 via-teal-800 to-sky-900 p-8 text-white sm:p-12 lg:flex"
    >
      <div class="health-visual" aria-hidden="true">
        <div class="health-orbit health-orbit--horizontal"></div>
        <div class="health-orbit health-orbit--vertical"></div>
        <div class="health-core">
          <span class="health-core__mark"></span>
        </div>
      </div>
      <div class="health-signal" aria-hidden="true">
        <span class="health-signal__trace"></span>
      </div>

      <div class="brand-logo-loop relative z-10">
        <img
          src="~/assets/images/medivoy-login-logo.png"
          alt="Medivoy"
          class="brand-motion brand-motion--logo h-auto w-48"
          fetchpriority="high"
        />
      </div>

      <div class="brand-content-loop relative z-10 max-w-xl space-y-10">
        <div class="space-y-5">
          <p
            class="brand-motion brand-motion--eyebrow text-xs font-semibold tracking-widest text-cyan-200 uppercase"
          >
            Preventive health, made personal
          </p>
          <h1 class="brand-motion brand-motion--headline text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            A clearer picture of your health.
          </h1>
          <p class="brand-motion brand-motion--description max-w-md text-base leading-7 text-slate-300">
            Bring your reports, family history, and wellness insights together
            to make more informed decisions about what comes next.
          </p>
        </div>

        <div class="max-w-lg divide-y divide-white/10 border-y border-white/10">
          <div class="brand-feature brand-feature--one brand-motion brand-motion--feature-one flex items-center justify-between gap-6 py-4">
            <p class="font-medium text-white">Health reports</p>
            <p class="text-right text-sm text-cyan-100/80">Your results, organized</p>
          </div>
          <div class="brand-feature brand-feature--two brand-motion brand-motion--feature-two flex items-center justify-between gap-6 py-4">
            <p class="font-medium text-white">Family history</p>
            <p class="text-right text-sm text-cyan-100/80">Patterns in context</p>
          </div>
          <div class="brand-feature brand-feature--three brand-motion brand-motion--feature-three flex items-center justify-between gap-6 py-4">
            <p class="font-medium text-white">Personal insights</p>
            <p class="text-right text-sm text-cyan-100/80">Genetics and nutrition</p>
          </div>
        </div>
      </div>

      <p class="brand-footer-loop relative z-10 text-xs text-cyan-100/80">
        © 2026 Medivoy. Not a medical diagnostic tool.
      </p>
    </div>

    <!-- Right panel -->
    <div
      class="auth-panel flex min-h-[100dvh] w-full flex-col items-center justify-center bg-transparent px-5 py-8 sm:px-10 sm:py-12"
    >
      <div
        ref="authCard"
        class="auth-card flex w-full max-w-md flex-col gap-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.38)] sm:p-8"
      >
        <!-- Mobile logo -->
        <div class="flex items-center lg:hidden">
          <div class="w-fit rounded-lg bg-cyan-900 px-3 py-2">
            <img
              src="~/assets/images/medivoy-login-logo.png"
              alt="Medivoy"
              class="brand-motion brand-motion--logo h-auto w-40"
            />
          </div>
        </div>

        <div class="auth-item auth-item--intro">
          <Transition name="auth-copy" mode="out-in">
            <header :key="tab" class="space-y-2">
              <p class="text-sm font-semibold text-blue-700">
                {{ tab === "login" ? "Welcome back" : "Get started with Medivoy" }}
              </p>
              <h2 class="medivoy-title-underline text-3xl font-semibold tracking-tight text-slate-950">
                {{ tab === "login" ? "Sign in to your account" : "Create your account" }}
              </h2>
              <p class="text-sm leading-6 text-slate-600">
                {{
                  tab === "login"
                    ? "Access your health profile and reports."
                    : "Bring your health information together in one place."
                }}
              </p>
            </header>
          </Transition>
        </div>

        <!-- Tabs -->
        <div
          class="auth-tabs auth-item auth-item--tabs flex gap-1 rounded-xl bg-slate-100 p-1"
          role="tablist"
          aria-label="Account access"
        >
          <span
            class="auth-tab-indicator"
            :class="{ 'auth-tab-indicator--register': tab === 'register' }"
            aria-hidden="true"
          ></span>
          <button
            type="button"
            role="tab"
            :aria-selected="tab === 'login'"
            @click="tab = 'login'; message = ''; passwordVisible = false"
            class="auth-tab-button flex-1 rounded-lg py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            :class="
              tab === 'login'
                ? 'text-slate-950'
                : 'text-slate-500'
            "
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="tab === 'register'"
            @click="tab = 'register'; message = ''; passwordVisible = false"
            class="auth-tab-button flex-1 rounded-lg py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            :class="
              tab === 'register'
                ? 'text-slate-950'
                : 'text-slate-500'
            "
          >
            Create account
          </button>
        </div>

        <!-- Login form -->
        <Transition
          name="auth-form"
          mode="out-in"
          @before-leave="freezeAuthCardHeight"
          @before-enter="animateAuthCardHeight"
        >
          <form
            v-if="tab === 'login'"
            key="login"
            class="space-y-5"
            @submit.prevent="submitLogin"
          >
            <div class="auth-field auth-field--one space-y-2">
              <label for="login-email" class="text-sm font-medium text-slate-700">Email address</label>
              <input
                id="login-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                class="auth-input w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                required
              />
            </div>
            <div class="auth-field auth-field--two space-y-2">
              <label for="login-password" class="text-sm font-medium text-slate-700">
                Password
              </label>
              <div class="relative">
                <input
                  id="login-password"
                  v-model="password"
                  :type="passwordVisible ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="auth-input w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 pr-20 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                  required
                />
                <button
                  type="button"
                  class="auth-password-toggle absolute inset-y-0 right-3 my-auto flex h-9 items-center rounded-md px-2 text-xs font-semibold text-slate-500 transition-colors hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
                  :aria-pressed="passwordVisible"
                  @click="passwordVisible = !passwordVisible"
                >
                  {{ passwordVisible ? "Hide" : "Show" }}
                </button>
              </div>
            </div>
            <button
              :disabled="loading"
              type="submit"
              class="medivoy-primary-button auth-submit auth-submit--login w-full rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true"></span>
                Signing in...
              </span>
              <span v-else>Sign in</span>
            </button>
            <p
              v-if="message"
              role="alert"
              class="auth-message rounded-xl px-4 py-3 text-sm font-medium"
              :class="
                error
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-emerald-50 text-emerald-700'
              "
            >
              {{ message }}
            </p>
          </form>

          <!-- Register form -->
          <form
            v-else
            key="register"
            class="auth-register-form flex flex-col gap-4"
            @submit.prevent="submitRegister"
          >
            <div class="auth-field auth-field--one space-y-2">
              <label for="register-name" class="text-sm font-medium text-slate-700"
                >Full name</label
              >
              <input
                id="register-name"
                v-model="name"
                type="text"
                autocomplete="name"
                placeholder="Your name"
                class="auth-input w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                required
              />
            </div>
            <div class="auth-field auth-field--two space-y-2">
              <label for="register-email" class="text-sm font-medium text-slate-700">Email address</label>
              <input
                id="register-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                class="auth-input w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                required
              />
            </div>
            <div class="auth-field auth-field--three space-y-2">
              <label for="register-password" class="text-sm font-medium text-slate-700">Password</label>
              <div class="relative">
                <input
                  id="register-password"
                  v-model="password"
                  :type="passwordVisible ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Min 8 characters"
                  class="auth-input w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                  required
                  minlength="8"
                />
                <button
                  type="button"
                  class="auth-password-toggle absolute inset-y-0 right-3 my-auto flex h-9 items-center rounded-md px-2 text-xs font-semibold text-slate-500 transition-colors hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
                  :aria-pressed="passwordVisible"
                  @click="passwordVisible = !passwordVisible"
                >
                  {{ passwordVisible ? "Hide" : "Show" }}
                </button>
              </div>
            </div>
            <div
              class="auth-field auth-field--four space-y-2"
              :class="{ 'auth-field--role-open': accountTypeMenuOpen }"
            >
              <label
                id="register-role-label"
                class="text-sm font-medium text-slate-700"
              >
                Account type
              </label>
              <div
                class="auth-role-select"
                :class="{ 'auth-role-select--open': accountTypeMenuOpen }"
              >
                <button
                  id="register-role"
                  ref="accountTypeButton"
                  type="button"
                  role="combobox"
                  class="auth-role-trigger"
                  aria-labelledby="register-role-label register-role-value"
                  aria-haspopup="listbox"
                  aria-controls="register-role-options"
                  :aria-expanded="accountTypeMenuOpen"
                  :aria-activedescendant="
                    accountTypeMenuOpen
                      ? `register-role-option-${accountTypeActiveIndex}`
                      : undefined
                  "
                  @click.stop="toggleAccountTypeMenu"
                  @keydown="handleAccountTypeKeydown"
                >
                  <span id="register-role-value">{{ selectedAccountTypeLabel }}</span>
                  <span class="auth-role-chevron" aria-hidden="true"></span>
                </button>
                <Transition name="auth-role-menu">
                  <div
                    v-if="accountTypeMenuOpen"
                    id="register-role-options"
                    class="auth-role-options"
                    role="listbox"
                    aria-labelledby="register-role-label"
                  >
                    <div
                      v-for="(option, index) in accountTypeOptions"
                      :id="`register-role-option-${index}`"
                      :key="option.value"
                      class="auth-role-option"
                      :class="{
                        'auth-role-option--active': accountTypeActiveIndex === index,
                        'auth-role-option--selected': role === option.value,
                      }"
                      role="option"
                      :aria-selected="role === option.value"
                      @mouseenter="accountTypeActiveIndex = index"
                      @click.stop="selectAccountType(option.value)"
                    >
                      <span>{{ option.label }}</span>
                      <span
                        v-if="role === option.value"
                        class="auth-role-check"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
            <div class="auth-field auth-field--terms flex items-start gap-3">
              <ProfessionalCheckbox
                v-model="agreed"
                aria-label="Agree to the terms and privacy policy"
                class="mt-0.5"
              />
              <p class="text-xs leading-5 text-slate-500">
                I agree to Medivoy's
                <span class="font-medium text-slate-700">terms of service</span>
                and
                <span class="font-medium text-slate-700">privacy policy</span>.
              </p>
            </div>
            <button
              :disabled="loading || !agreed"
              type="submit"
              class="medivoy-primary-button auth-submit auth-submit--register w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true"></span>
                Creating account...
              </span>
              <span v-else>Create account</span>
            </button>
            <p
              v-if="message"
              role="alert"
              class="auth-message rounded-xl px-4 py-3 text-sm font-medium"
              :class="
                error
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-emerald-50 text-emerald-700'
              "
            >
              {{ message }}
            </p>
          </form>
        </Transition>

        <p class="auth-security text-center text-xs leading-5 text-slate-500">
          Protected by 256-bit encryption · HIPAA-aligned privacy practices
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const api = useMedivoyApi();
const auth = useAuthStore();
const router = useRouter();

const authCard = ref<HTMLElement | null>(null);
const tab = ref<"login" | "register">("login");
const email = ref("");
const password = ref("");
const passwordVisible = ref(false);
const name = ref("");
const accountTypeOptions = [
  { value: "patient", label: "Patient / Individual" },
  { value: "doctor", label: "Doctor / Clinician" },
] as const;
type AccountType = (typeof accountTypeOptions)[number]["value"];
const role = ref<AccountType>("patient");
const accountTypeMenuOpen = ref(false);
const accountTypeActiveIndex = ref(0);
const accountTypeButton = ref<HTMLButtonElement | null>(null);
const selectedAccountTypeLabel = computed(
  () =>
    accountTypeOptions.find((option) => option.value === role.value)?.label ??
    accountTypeOptions[0].label,
);
const agreed = ref(false);
const loading = ref(false);
const message = ref("");
const error = ref(false);
let authCardHeightFrame = 0;
let authCardHeightReset: number | undefined;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const closeAccountTypeMenu = () => {
  accountTypeMenuOpen.value = false;
};

const openAccountTypeMenu = () => {
  accountTypeActiveIndex.value = accountTypeOptions.findIndex(
    (option) => option.value === role.value,
  );
  accountTypeMenuOpen.value = true;
};

const toggleAccountTypeMenu = () => {
  if (accountTypeMenuOpen.value) {
    closeAccountTypeMenu();
    return;
  }

  openAccountTypeMenu();
};

const selectAccountType = (value: AccountType) => {
  role.value = value;
  closeAccountTypeMenu();
  accountTypeButton.value?.focus();
};

const handleAccountTypeKeydown = (event: KeyboardEvent) => {
  const optionCount = accountTypeOptions.length;

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!accountTypeMenuOpen.value) {
      openAccountTypeMenu();
      return;
    }

    const direction = event.key === "ArrowDown" ? 1 : -1;
    accountTypeActiveIndex.value =
      (accountTypeActiveIndex.value + direction + optionCount) % optionCount;
    return;
  }

  if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    accountTypeMenuOpen.value = true;
    accountTypeActiveIndex.value = event.key === "Home" ? 0 : optionCount - 1;
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (accountTypeMenuOpen.value) {
      selectAccountType(accountTypeOptions[accountTypeActiveIndex.value].value);
    } else {
      openAccountTypeMenu();
    }
    return;
  }

  if (event.key === "Escape") {
    closeAccountTypeMenu();
    return;
  }

  if (event.key === "Tab") {
    closeAccountTypeMenu();
    return;
  }

  if (
    event.key.length === 1 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    const matchIndex = accountTypeOptions.findIndex((option) =>
      option.label.toLowerCase().startsWith(event.key.toLowerCase()),
    );
    if (matchIndex !== -1) {
      event.preventDefault();
      accountTypeActiveIndex.value = matchIndex;
      if (!accountTypeMenuOpen.value) {
        selectAccountType(accountTypeOptions[matchIndex].value);
      }
    }
  }
};

const clearAuthCardHeightReset = () => {
  if (authCardHeightReset !== undefined) {
    window.clearTimeout(authCardHeightReset);
    authCardHeightReset = undefined;
  }
};

const freezeAuthCardHeight = () => {
  const card = authCard.value;
  if (!card) return;

  window.cancelAnimationFrame(authCardHeightFrame);
  clearAuthCardHeightReset();
  if (prefersReducedMotion()) {
    card.style.height = "";
    return;
  }

  card.style.height = `${card.getBoundingClientRect().height}px`;
};

const animateAuthCardHeight = () => {
  const card = authCard.value;
  if (!card) return;

  window.cancelAnimationFrame(authCardHeightFrame);
  clearAuthCardHeightReset();
  if (prefersReducedMotion()) {
    card.style.height = "";
    return;
  }

  const startHeight = card.getBoundingClientRect().height;

  authCardHeightFrame = window.requestAnimationFrame(() => {
    if (authCard.value !== card) return;

    card.style.height = "auto";
    const targetHeight = card.getBoundingClientRect().height;
    card.style.height = `${startHeight}px`;
    void card.offsetHeight;

    authCardHeightFrame = window.requestAnimationFrame(() => {
      if (authCard.value !== card) return;

      card.style.height = `${targetHeight}px`;
      authCardHeightReset = window.setTimeout(() => {
        if (authCard.value === card) card.style.height = "";
        authCardHeightReset = undefined;
      }, 320);
    });
  });
};

const setMsg = (msg: string, isError = false) => {
  message.value = msg;
  error.value = isError;
};

const getAuthErrorMessage = (
  cause: unknown,
  action: "login" | "register",
) => {
  if (!cause || typeof cause !== "object") {
    return "We couldn't connect right now. Please try again.";
  }

  const failure = cause as {
    status?: unknown;
    statusCode?: unknown;
    response?: { status?: unknown } | null;
  };
  const status = [failure.statusCode, failure.status, failure.response?.status]
    .find((value): value is number => typeof value === "number");

  if (action === "login" && status === 401) {
    return "That email and password combination wasn't recognized. Please try again.";
  }
  if (action === "register" && status === 409) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (!status || status >= 500) {
    return "We couldn't connect right now. Please check your connection and try again.";
  }

  return action === "login"
    ? "We couldn't sign you in. Please check your details and try again."
    : "We couldn't create your account. Please check your details and try again.";
};

const submitLogin = async () => {
  loading.value = true;
  message.value = "";
  try {
    const res = await api.login(email.value, password.value);
    auth.login(res.user, res.access_token);
    setMsg("Login successful.");
    await router.push("/dashboard");
  } catch (e: unknown) {
    setMsg(getAuthErrorMessage(e, "login"), true);
  } finally {
    loading.value = false;
  }
};

const submitRegister = async () => {
  loading.value = true;
  message.value = "";
  try {
    const res = await api.register(email.value, password.value, role.value);
    auth.login(res.user, res.access_token);
    setMsg("Account created successfully.");
    await router.push("/dashboard");
  } catch (e: unknown) {
    setMsg(getAuthErrorMessage(e, "register"), true);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.medivoy-auth-background {
  background:
    radial-gradient(
      ellipse at 88% 8%,
      rgb(14 116 144 / 0.08),
      transparent 36rem
    ),
    linear-gradient(145deg, #f1f7f9 0%, #f8fbfc 58%, #edf6f7 100%);
}

.auth-panel {
  background-image:
    radial-gradient(
      ellipse at 92% 8%,
      rgb(6 182 212 / 0.07),
      transparent 36%
    ),
    radial-gradient(
      ellipse at 8% 94%,
      rgb(37 99 235 / 0.045),
      transparent 32%
    );
}

.auth-input {
  background-image: linear-gradient(#0891b2, #0891b2);
  background-position: left bottom;
  background-repeat: no-repeat;
  background-size: 0 2px;
  transition:
    background-size 260ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.auth-input:focus {
  background-size: 100% 2px;
}

.auth-field:focus-within > label {
  color: #0e7490;
  transition: color 160ms ease;
}

.auth-tab-button[aria-selected="true"] {
  color: #0e7490;
}

.auth-submit {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.auth-submit::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    108deg,
    transparent 25%,
    rgb(103 232 249 / 0.3) 50%,
    transparent 75%
  );
  content: "";
  pointer-events: none;
  transform: translateX(-110%);
  transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.auth-submit:hover::before {
  transform: translateX(110%);
}

.auth-submit:focus-visible {
  outline: 2px solid #0891b2;
  outline-offset: 3px;
}

.auth-submit:disabled::before {
  display: none;
}

.brand-panel::before {
  position: absolute;
  inset: -24%;
  z-index: 0;
  content: "";
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at 22% 24%,
      rgb(59 130 246 / 0.16),
      transparent 46%
    ),
    radial-gradient(
      ellipse at 78% 78%,
      rgb(56 189 248 / 0.1),
      transparent 42%
    );
  opacity: 0.6;
  transform: translate3d(-2%, 1%, 0) scale(0.98);
  will-change: transform, opacity;
  animation: panel-atmosphere 18s ease-in-out infinite alternate;
}

.brand-logo-loop {
  animation: brand-float 7s ease-in-out 800ms infinite;
}

.brand-content-loop {
  animation: brand-float 9s ease-in-out 1.2s infinite reverse;
}

.brand-footer-loop {
  animation: footer-breathe 8s ease-in-out infinite;
}

.brand-feature {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.brand-feature::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    105deg,
    transparent 18%,
    rgb(147 197 253 / 0.08) 50%,
    transparent 82%
  );
  content: "";
  pointer-events: none;
  transform: translateX(-100%);
  animation: feature-sweep 8s ease-in-out infinite;
}

.brand-feature--two::after {
  animation-delay: 2.6s;
}

.brand-feature--three::after {
  animation-delay: 5.2s;
}

.brand-feature > p {
  position: relative;
  z-index: 1;
}

.health-visual {
  position: absolute;
  inset: 0;
  z-index: 1;
  --orbit-center-x: 85%;
  --core-size: 6rem;
  pointer-events: none;
  opacity: 0.42;
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .health-visual {
    --orbit-center-x: 93%;
    --core-size: 4.5rem;
  }
}

.health-orbit {
  position: absolute;
  top: 50%;
  left: var(--orbit-center-x);
  width: 150%;
  height: 38%;
  border: 1px solid rgb(147 197 253 / 0.28);
  border-radius: 50%;
  transform-style: preserve-3d;
  will-change: transform;
}

.health-orbit::after {
  position: absolute;
  top: 50%;
  left: -5px;
  width: 10px;
  height: 10px;
  border: 2px solid rgb(15 23 42 / 0.9);
  border-radius: 50%;
  background: #7dd3fc;
  content: "";
}

.health-orbit--horizontal {
  transform: translate(-50%, -50%) rotateX(68deg);
  animation: orbit-horizontal 24s linear infinite;
}

.health-orbit--vertical {
  width: 54%;
  height: 86%;
  border-color: rgb(96 165 250 / 0.36);
  transform: translate(-50%, -50%) rotateY(68deg) rotateZ(32deg);
  animation: orbit-vertical 19s linear infinite reverse;
}

.health-orbit--vertical::after {
  background: #60a5fa;
}

.health-core {
  position: absolute;
  top: 50%;
  left: var(--orbit-center-x);
  display: grid;
  width: var(--core-size);
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgb(191 219 254 / 0.55);
  border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, #38bdf8, #1d4ed8 72%);
  box-shadow:
    inset 0 1px 5px rgb(255 255 255 / 0.3),
    0 12px 30px rgb(2 6 23 / 0.24);
  animation: core-pulse 4s ease-in-out infinite;
  will-change: transform;
  transform: translate(-50%, -50%);
}

.health-core::before {
  position: absolute;
  inset: -12px;
  border: 1px solid rgb(147 197 253 / 0.28);
  border-radius: 50%;
  content: "";
}

.health-core__mark {
  position: relative;
  width: 1.65rem;
  height: 1.65rem;
}

.health-core__mark::before,
.health-core__mark::after {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 2px;
  background: rgb(255 255 255 / 0.94);
  content: "";
  transform: translate(-50%, -50%);
}

.health-core__mark::before {
  width: 100%;
  height: 5px;
}

.health-core__mark::after {
  width: 5px;
  height: 100%;
}

.health-signal {
  position: absolute;
  top: 82%;
  left: 10%;
  z-index: 2;
  width: 80%;
  height: 2.25rem;
  overflow: hidden;
  opacity: 0.34;
  pointer-events: none;
}

.health-signal::before {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(96 165 250 / 0.32) 16%,
    rgb(125 211 252 / 0.46) 50%,
    rgb(96 165 250 / 0.32) 84%,
    transparent
  );
  content: "";
}

.health-signal__trace {
  position: absolute;
  top: 0;
  left: 0;
  width: 36%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(125 211 252 / 0.94) 48%,
    rgb(191 219 254 / 0.84) 52%,
    transparent
  );
  clip-path: polygon(
    0 47%,
    38% 47%,
    43% 40%,
    47% 60%,
    51% 8%,
    56% 92%,
    61% 47%,
    100% 47%,
    100% 53%,
    61% 53%,
    56% 100%,
    51% 20%,
    47% 68%,
    43% 54%,
    38% 53%,
    0 53%
  );
  animation: health-signal-pass 7s linear infinite;
  filter: drop-shadow(0 0 5px rgb(56 189 248 / 0.3));
  will-change: transform;
}

@media (max-height: 860px) {
  .auth-panel {
    padding-block: 1rem;
  }

  .auth-card {
    gap: 1rem;
    padding-block: 1rem;
  }

  .auth-register-form {
    gap: 0.5rem;
  }
}

@media (max-height: 800px) {
  .health-signal {
    display: none;
  }
}

@keyframes panel-atmosphere {
  from {
    opacity: 0.42;
    transform: translate3d(-2%, 1%, 0) scale(0.98);
  }

  to {
    opacity: 0.74;
    transform: translate3d(2%, -1%, 0) scale(1.03);
  }
}

@keyframes brand-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }
}

@keyframes footer-breathe {
  0%,
  100% {
    opacity: 0.82;
  }

  50% {
    opacity: 1;
  }
}

@keyframes feature-sweep {
  0%,
  18% {
    transform: translateX(-100%);
  }

  48%,
  100% {
    transform: translateX(100%);
  }
}

@keyframes orbit-horizontal {
  from {
    transform: translate(-50%, -50%) rotateX(68deg) rotateZ(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotateX(68deg) rotateZ(360deg);
  }
}

@keyframes orbit-vertical {
  from {
    transform: translate(-50%, -50%) rotateY(68deg) rotateZ(32deg);
  }

  to {
    transform: translate(-50%, -50%) rotateY(68deg) rotateZ(392deg);
  }
}

@keyframes core-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.045);
  }
}

@keyframes health-signal-pass {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(300%);
  }
}

.auth-card {
  animation: card-arrive 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: height 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.auth-item,
.auth-field,
.auth-security,
.auth-message {
  opacity: 0;
  animation: item-arrive 480ms cubic-bezier(0.2, 0.8, 0.2, 1) var(--delay) both;
}

.auth-submit {
  animation: submit-arrive 480ms cubic-bezier(0.2, 0.8, 0.2, 1) var(--delay) both;
}

.auth-item--intro {
  --delay: 90ms;
}

.auth-item--tabs {
  --delay: 170ms;
}

.auth-field--one {
  --delay: 240ms;
}

.auth-field--two {
  --delay: 320ms;
}

.auth-field--three {
  --delay: 400ms;
}

.auth-field--four {
  --delay: 480ms;
}

.auth-field--terms {
  --delay: 540ms;
}

.auth-submit--login {
  --delay: 420ms;
}

.auth-submit--register {
  --delay: 620ms;
}

.auth-security {
  --delay: 700ms;
}

.auth-message {
  --delay: 0ms;
}

.auth-form-enter-active,
.auth-form-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 220ms ease;
}

.auth-form-enter-from {
  filter: blur(3px);
  opacity: 0;
  transform: translateY(8px);
}

.auth-form-leave-to {
  filter: blur(2px);
  opacity: 0;
  transform: translateY(-4px);
}

.auth-copy-enter-active,
.auth-copy-leave-active {
  transition:
    opacity 180ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.auth-copy-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.auth-copy-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.auth-tabs {
  position: relative;
}

.auth-tab-indicator {
  position: absolute;
  inset-block: 4px;
  left: 4px;
  width: calc(50% - 6px);
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.12);
  pointer-events: none;
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.auth-tab-indicator--register {
  transform: translateX(calc(100% + 4px));
}

.auth-tab-button {
  position: relative;
  z-index: 1;
}

.auth-role-select {
  position: relative;
}

.auth-field--role-open {
  position: relative;
  z-index: 3;
}

.auth-role-select--open {
  z-index: 2;
}

.auth-role-trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  background: white;
  padding: 0.75rem 1rem;
  color: #0f172a;
  font-size: 0.875rem;
  text-align: left;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.auth-role-trigger:hover {
  border-color: #94a3b8;
}

.auth-role-trigger:focus-visible {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 4px #dbeafe;
}

.auth-role-chevron {
  width: 0.5rem;
  height: 0.5rem;
  flex: none;
  border-right: 1.5px solid #64748b;
  border-bottom: 1.5px solid #64748b;
  transform: translateY(-2px) rotate(45deg);
  transition: transform 180ms ease;
}

.auth-role-select--open .auth-role-chevron {
  transform: translateY(2px) rotate(225deg);
}

.auth-role-options {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  left: 0;
  z-index: 1;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  background: white;
  padding: 0.25rem;
  box-shadow: 0 16px 36px rgb(15 23 42 / 0.16);
}

.auth-role-option {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-radius: 0.625rem;
  padding: 0.7rem 0.75rem;
  color: #334155;
  font-size: 0.875rem;
  text-align: left;
  transition:
    background-color 140ms ease,
    color 140ms ease;
}

.auth-role-option--active,
.auth-role-option:hover {
  background: #eff6ff;
  color: #1d4ed8;
}

.auth-role-option--selected {
  font-weight: 600;
}

.auth-role-check {
  color: #1d4ed8;
  font-size: 0.875rem;
}

.auth-role-menu-enter-active,
.auth-role-menu-leave-active {
  transform-origin: top;
  transition:
    opacity 140ms ease,
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.auth-role-menu-enter-from,
.auth-role-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.99);
}

@keyframes card-arrive {
  from {
    filter: blur(8px);
    opacity: 0;
    transform: translateY(14px) scale(0.99);
  }

  to {
    filter: blur(0);
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes item-arrive {
  0% {
    filter: blur(4px);
    opacity: 0;
    transform: translateY(10px);
  }

  70% {
    filter: blur(0);
    opacity: 1;
    transform: translateY(-1px);
  }

  100% {
    filter: blur(0);
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes submit-arrive {
  from {
    transform: translateY(8px) scale(0.99);
  }

  to {
    transform: translateY(0) scale(1);
  }
}

.brand-motion {
  opacity: 0;
  filter: blur(12px);
  transform: perspective(900px) rotateY(-65deg) translateY(14px);
  transform-origin: left center;
  animation: brand-reveal 780ms cubic-bezier(0.2, 0.8, 0.2, 1) var(--delay) both;
}

.brand-motion--logo {
  --delay: 40ms;
}

.brand-motion--eyebrow {
  --delay: 120ms;
}

.brand-motion--headline {
  --delay: 200ms;
}

.brand-motion--description {
  --delay: 360ms;
}

.brand-motion--feature-one {
  --delay: 520ms;
}

.brand-motion--feature-two {
  --delay: 620ms;
}

.brand-motion--feature-three {
  --delay: 720ms;
}

@keyframes brand-reveal {
  0% {
    opacity: 0;
    filter: blur(12px);
    transform: perspective(900px) rotateY(-65deg) translateY(14px);
  }

  65% {
    opacity: 1;
    filter: blur(1px);
    transform: perspective(900px) rotateY(5deg) translateY(-2px);
  }

  100% {
    opacity: 1;
    filter: blur(0);
    transform: perspective(900px) rotateY(0) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .brand-panel::before,
  .brand-logo-loop,
  .brand-content-loop,
  .brand-footer-loop,
  .brand-feature::after {
    animation: none;
    transform: none;
    will-change: auto;
  }

  .brand-feature::after {
    display: none;
  }

  .brand-panel::before {
    opacity: 0.5;
  }

  .brand-footer-loop {
    opacity: 1;
  }

  .health-orbit,
  .health-core {
    animation: none;
    will-change: auto;
  }

  .health-signal__trace {
    animation: none;
    transform: translateX(100%);
    will-change: auto;
  }

  .health-orbit--horizontal {
    transform: rotateX(68deg);
  }

  .health-orbit--vertical {
    transform: rotateY(68deg) rotateZ(32deg);
  }

  .auth-card,
  .auth-item,
  .auth-field,
  .auth-security,
  .auth-message {
    animation: none;
    filter: none;
    opacity: 1;
    transform: none;
  }

  .auth-card,
  .auth-copy-enter-active,
  .auth-copy-leave-active {
    transition: none;
  }

  .auth-submit {
    animation: none;
    filter: none;
    transform: none;
  }

  .auth-input,
  .auth-submit::before,
  .auth-field:focus-within > label {
    transition: none;
  }

  .auth-form-enter-active,
  .auth-form-leave-active {
    transition: none;
  }

  .auth-tab-indicator {
    transition: none;
  }

  .auth-role-chevron,
  .auth-role-menu-enter-active,
  .auth-role-menu-leave-active {
    transition: none;
  }

  .brand-motion {
    animation: none;
    filter: none;
    opacity: 1;
    transform: none;
  }
}
</style>
