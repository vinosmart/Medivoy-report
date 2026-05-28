<template>
  <div class="flex min-h-screen w-full">
    <!-- Left panel -->
    <div
      class="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-12 text-white"
    >
      <div class="flex items-center gap-3">
        <div
          class="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-lg"
        >
          M
        </div>
        <div>
          <p class="font-bold text-lg tracking-tight">Medivoy</p>
          <p class="text-xs text-slate-400">Preventive Health OS</p>
        </div>
      </div>
      <div class="space-y-8">
        <div>
          <p
            class="text-xs font-semibold tracking-widest text-blue-400 uppercase"
          >
            AI Preventive Health Screening
          </p>
          <h2 class="mt-4 text-4xl font-bold leading-tight">
            Know your health<br />for the next 5 years
          </h2>
          <p class="mt-4 text-slate-400 max-w-sm text-base leading-relaxed">
            Upload your reports and find answers about your health profile, bio
            age, family risk, nutrition gaps and longevity plan.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div
            class="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
          >
            <p class="text-2xl font-bold text-cyan-400">87%</p>
            <p class="mt-1 text-xs text-slate-400">Average health score</p>
          </div>
          <div
            class="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
          >
            <p class="text-2xl font-bold text-emerald-400">5 yr</p>
            <p class="mt-1 text-xs text-slate-400">Preventive horizon</p>
          </div>
          <div
            class="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
          >
            <p class="text-2xl font-bold text-violet-400">DNA</p>
            <p class="mt-1 text-xs text-slate-400">Genetic risk analysis</p>
          </div>
          <div
            class="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
          >
            <p class="text-2xl font-bold text-amber-400">Bio Age</p>
            <p class="mt-1 text-xs text-slate-400">Longevity intelligence</p>
          </div>
        </div>
      </div>
      <p class="text-xs text-slate-600">
        © 2026 Medivoy. Not a medical diagnostic tool.
      </p>
    </div>

    <!-- Right panel -->
    <div
      class="flex w-full lg:w-1/2 flex-col items-center justify-center bg-slate-50 p-6 sm:p-12"
    >
      <div class="w-full max-w-md space-y-8">
        <!-- Mobile logo -->
        <div class="flex lg:hidden items-center gap-3">
          <div
            class="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold"
          >
            M
          </div>
          <div>
            <p class="font-bold text-lg">Medivoy</p>
            <p class="text-xs text-slate-500">Preventive Health OS</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 rounded-2xl bg-slate-200 p-1">
          <button
            @click="tab = 'login'"
            class="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
            :class="
              tab === 'login'
                ? 'bg-white shadow text-slate-900'
                : 'text-slate-500'
            "
          >
            Login
          </button>
          <button
            @click="tab = 'register'"
            class="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
            :class="
              tab === 'register'
                ? 'bg-white shadow text-slate-900'
                : 'text-slate-500'
            "
          >
            Create account
          </button>
        </div>

        <!-- Login form -->
        <form
          v-if="tab === 'login'"
          class="space-y-4"
          @submit.prevent="submitLogin"
        >
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-600">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-slate-600"
                >Password</label
              >
              <a href="#" class="text-xs text-blue-600 hover:underline"
                >Forgot password?</a
              >
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>
          <button
            :disabled="loading"
            class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Logging in...
            </span>
            <span v-else>Login to Medivoy</span>
          </button>
          <p
            v-if="message"
            class="rounded-xl px-4 py-3 text-sm font-medium"
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
          v-if="tab === 'register'"
          class="space-y-4"
          @submit.prevent="submitRegister"
        >
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-600"
              >Full name</label
            >
            <input
              v-model="name"
              type="text"
              placeholder="Your name"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-600">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-600">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Min 8 characters"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
              minlength="8"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-600"
              >Account type</label
            >
            <select
              v-model="role"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="patient">Patient / Individual</option>
              <option value="doctor">Doctor / Clinician</option>
            </select>
          </div>
          <div class="flex items-start gap-3">
            <input
              v-model="agreed"
              id="terms"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-slate-300 accent-slate-900"
              required
            />
            <label for="terms" class="text-xs text-slate-500 leading-5"
              >I agree to Medivoy's
              <a href="#" class="text-blue-600 hover:underline"
                >terms of service</a
              >
              and
              <a href="#" class="text-blue-600 hover:underline"
                >privacy policy</a
              >.</label
            >
          </div>
          <button
            :disabled="loading || !agreed"
            class="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Creating account...
            </span>
            <span v-else>Create account</span>
          </button>
          <p
            v-if="message"
            class="rounded-xl px-4 py-3 text-sm font-medium"
            :class="
              error
                ? 'bg-rose-50 text-rose-700'
                : 'bg-emerald-50 text-emerald-700'
            "
          >
            {{ message }}
          </p>
        </form>

        <p class="text-center text-xs text-slate-400">
          Protected by 256-bit encryption · HIPAA-aligned privacy practices
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "blank" });

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

const setMsg = (msg: string, isError = false) => {
  message.value = msg;
  error.value = isError;
};

const submitLogin = async () => {
  loading.value = true;
  message.value = "";
  try {
    const res = await api.login(email.value, password.value);
    auth.login(res.user, res.access_token);
    setMsg("Login successful.");
    await router.push("/dashboard");
  } catch (e: any) {
    setMsg(e?.data?.message || e?.message || "Login failed.", true);
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
  } catch (e: any) {
    setMsg(e?.data?.message || e?.message || "Registration failed.", true);
  } finally {
    loading.value = false;
  }
};
</script>
