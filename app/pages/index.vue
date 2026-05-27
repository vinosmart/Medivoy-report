<template>
  <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
    <div class="mb-6 flex items-center gap-3"><div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xl">M</div><div><h1 class="text-2xl font-bold">Medivoy</h1><p class="text-sm text-slate-500">Preventive health intelligence</p></div></div>
    <form class="space-y-4" @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Email" class="w-full rounded-xl border border-slate-300 px-4 py-3" />
      <input v-model="password" type="password" placeholder="Password" class="w-full rounded-xl border border-slate-300 px-4 py-3" />
      <button :disabled="loading" class="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60">{{ loading ? 'Logging in...' : 'Login' }}</button>
      <p v-if="message" class="text-sm" :class="error ? 'text-rose-600' : 'text-emerald-600'">{{ message }}</p>
    </form>
  </div>
</template>
<script setup lang="ts">definePageMeta({ layout: 'auth' }); const email=ref(''); const password=ref(''); const loading=ref(false); const message=ref(''); const error=ref(false); const router=useRouter(); const auth=useAuthStore(); const api=useMedivoyApi(); const submit = async()=>{ loading.value=true; error.value=false; message.value=''; try { const res = await api.login(email.value,password.value); auth.login(res.user, res.access_token); await router.push('/dashboard') } catch (e:any) { error.value=true; message.value=e?.data?.message || e?.message || 'Login failed.' } finally { loading.value=false } }</script>
