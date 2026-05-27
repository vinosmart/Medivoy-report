<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-900">
    <aside class="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-white">
      <div class="px-6 py-6 border-b border-slate-200">
        <h1 class="text-2xl font-bold">Medivoy</h1>
        <p class="text-sm text-slate-500">Preventive Health OS</p>
      </div>
      <nav class="flex-1 px-4 py-6 space-y-2 text-sm">
        <NuxtLink to="/dashboard" class="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100">Dashboard</NuxtLink>
        <NuxtLink to="/reports" class="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100">Reports</NuxtLink>
        <NuxtLink to="/reports/upload" class="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100">Upload</NuxtLink>
        <NuxtLink to="/family" class="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100">Family Health</NuxtLink>
        <NuxtLink to="/nutrition" class="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100">Nutrition</NuxtLink>
        <NuxtLink to="/lab-kits" class="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100">Lab Kits</NuxtLink>
        <NuxtLink to="/genetics" class="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100">Genetics</NuxtLink>
        <NuxtLink v-if="auth.isAdmin" to="/admin" class="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100">Admin</NuxtLink>
      </nav>
      <div class="p-4 border-t border-slate-200"><button @click="logout" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50">Sign out</button></div>
    </aside>
    <div class="flex-1 min-w-0">
      <header class="sticky top-0 z-10 h-16 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8"><h2 class="text-lg font-semibold">{{ title }}</h2><div class="text-sm text-slate-600">{{ auth.user?.email || 'Guest' }}</div></header>
      <main class="p-4 sm:p-6 lg:p-8"><slot /></main>
    </div>
  </div>
</template>
<script setup lang="ts">const auth = useAuthStore(); const router = useRouter(); const route = useRoute(); const title = computed(() => ({'/dashboard':'Dashboard','/reports':'Reports','/reports/upload':'Upload Report','/family':'Family Health','/nutrition':'Nutrition','/lab-kits':'Lab Kits','/genetics':'Genetics','/admin':'Admin'}[route.path] || 'Medivoy')); const logout = () => { auth.logout(); router.push('/') }</script>
