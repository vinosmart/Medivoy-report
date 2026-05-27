<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-10">
      <div class="w-16 h-16 rounded-2xl bg-medivoy-accent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-900/20">
        <svg class="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-white tracking-tight">Medivoy AI</h1>
      <p class="text-medivoy-400 mt-2 text-sm">Preventive healthcare &amp; longevity intelligence</p>
    </div>

    <div class="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
      <div class="flex mb-6 bg-white/5 rounded-xl p-1">
        <button @click="mode = 'login'" :class="['flex-1 py-2 rounded-lg text-sm font-medium transition-colors', mode === 'login' ? 'bg-medivoy-accent text-white' : 'text-medivoy-300 hover:text-white']">Sign In</button>
        <button @click="mode = 'register'" :class="['flex-1 py-2 rounded-lg text-sm font-medium transition-colors', mode === 'register' ? 'bg-medivoy-accent text-white' : 'text-medivoy-300 hover:text-white']">Create Account</button>
      </div>

      <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-medivoy-300 mb-1.5">Email</label>
          <input v-model="email" type="email" required class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-medivoy-500 focus:outline-none focus:ring-2 focus:ring-medivoy-accent text-sm" placeholder="you@example.com" />
        </div>
        <div>
          <label class="block text-xs font-medium text-medivoy-300 mb-1.5">Password</label>
          <input v-model="password" type="password" required minlength="6" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-medivoy-500 focus:outline-none focus:ring-2 focus:ring-medivoy-accent text-sm" placeholder="••••••••" />
        </div>
        <button type="submit" :disabled="loading" class="w-full py-2.5 rounded-xl bg-medivoy-accent hover:bg-medivoy-accent-dark text-white font-semibold text-sm transition-colors disabled:opacity-50">{{ loading ? 'Signing in...' : 'Get Started' }}</button>
        <p v-if="error" class="text-xs text-rose-400 text-center">{{ error }}</p>
      </form>

      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-medivoy-300 mb-1.5">Email</label>
          <input v-model="email" type="email" required class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-medivoy-500 focus:outline-none focus:ring-2 focus:ring-medivoy-accent text-sm" placeholder="you@example.com" />
        </div>
        <div>
          <label class="block text-xs font-medium text-medivoy-300 mb-1.5">Password</label>
          <input v-model="password" type="password" required minlength="6" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-medivoy-500 focus:outline-none focus:ring-2 focus:ring-medivoy-accent text-sm" placeholder="Min 6 characters" />
        </div>
        <div class="flex gap-4">
          <label class="text-xs text-medivoy-400 flex items-center gap-2"><input v-model="role" type="radio" value="patient" class="accent-medivoy-accent" /> Patient</label>
          <label class="text-xs text-medivoy-400 flex items-center gap-2"><input v-model="role" type="radio" value="doctor" class="accent-medivoy-accent" /> Doctor</label>
        </div>
        <button type="submit" :disabled="loading" class="w-full py-2.5 rounded-xl bg-medivoy-accent hover:bg-medivoy-accent-dark text-white font-semibold text-sm transition-colors disabled:opacity-50">{{ loading ? 'Creating...' : 'Create Account' }}</button>
        <p v-if="error" class="text-xs text-rose-400 text-center">{{ error }}</p>
        <p v-if="success" class="text-xs text-emerald-400 text-center">Account created! Redirecting...</p>
      </form>
    </div>

    <div class="mt-8 grid grid-cols-3 gap-3">
      <div class="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-4 text-center"><p class="text-xl font-bold text-white">AI</p><p class="text-[11px] text-medivoy-400 mt-1">Health Analysis</p></div>
      <div class="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-4 text-center"><p class="text-xl font-bold text-white">OCR</p><p class="text-[11px] text-medivoy-400 mt-1">Report Parsing</p></div>
      <div class="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-4 text-center"><p class="text-xl font-bold text-white">RAG</p><p class="text-[11px] text-medivoy-400 mt-1">Medical Knowledge</p></div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "auth" });
const api = useApi();
const router = useRouter();
const email = ref("");
const password = ref("");
const role = ref("patient");
const mode = ref("login");
const loading = ref(false);
const error = ref("");
const success = ref(false);

async function handleLogin() {
  loading.value = true; error.value = "";
  try { await api.login(email.value, password.value); router.push("/dashboard"); }
  catch (err) { error.value = err?.data?.message || "Invalid email or password"; }
  finally { loading.value = false; }
}

async function handleRegister() {
  loading.value = true; error.value = ""; success.value = false;
  try { await api.register(email.value, password.value, role.value); success.value = true; setTimeout(() => router.push("/dashboard"), 800); }
  catch (err) { error.value = err?.data?.message || "Registration failed"; }
  finally { loading.value = false; }
}
</script>
