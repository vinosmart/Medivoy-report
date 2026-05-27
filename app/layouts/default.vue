<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-medivoy-50">
    <aside class="w-full md:w-64 bg-white border-r border-medivoy-200 flex-shrink-0">
      <div class="h-16 flex items-center px-6 border-b border-medivoy-200">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-medivoy-accent flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span class="text-lg font-bold text-medivoy-900 tracking-tight">Medivoy</span>
        </div>
      </div>
      <nav class="p-3 space-y-1">
        <NuxtLink to="/dashboard" active-class="bg-medivoy-100 text-medivoy-900" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-medivoy-600 hover:bg-medivoy-100 hover:text-medivoy-900 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/reports" active-class="bg-medivoy-100 text-medivoy-900" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-medivoy-600 hover:bg-medivoy-100 hover:text-medivoy-900 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          Reports
        </NuxtLink>
        <NuxtLink to="/reports/upload" active-class="bg-medivoy-100 text-medivoy-900" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-medivoy-600 hover:bg-medivoy-100 hover:text-medivoy-900 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
          Upload Report
        </NuxtLink>
        <NuxtLink to="/family" active-class="bg-medivoy-100 text-medivoy-900" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-medivoy-600 hover:bg-medivoy-100 hover:text-medivoy-900 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
          Family Health
        </NuxtLink>
        <NuxtLink to="/nutrition" active-class="bg-medivoy-100 text-medivoy-900" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-medivoy-600 hover:bg-medivoy-100 hover:text-medivoy-900 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Nutrition
        </NuxtLink>
        <NuxtLink v-if="auth.isAdmin" to="/admin" active-class="bg-medivoy-100 text-medivoy-900" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-medivoy-600 hover:bg-medivoy-100 hover:text-medivoy-900 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 01-.659 1.591L5 14.5m4.5-11.396V3.75a2.25 2.25 0 00-2.25-2.25h-1.5A2.25 2.25 0 006 3.75v.104m12 5.714v4.286c0 .597-.237 1.169-.659 1.591L19 14.5m-5.25-5.25V3.75a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0119.5 3.75v.104" /></svg>
          Admin Panel
        </NuxtLink>
      </nav>
      <div class="mt-auto p-4 border-t border-medivoy-200">
        <button @click="handleLogout" class="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-medivoy-500 hover:bg-medivoy-100 hover:text-medivoy-700 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
          Sign Out
        </button>
      </div>
    </aside>
    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 bg-white/80 backdrop-blur border-b border-medivoy-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <h1 class="text-lg font-semibold text-medivoy-900">{{ pageTitle }}</h1>
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-medivoy-900">{{ auth.user?.email || 'Guest' }}</p>
            <p class="text-xs text-medivoy-500 capitalize">{{ auth.user?.role || 'User' }}</p>
          </div>
          <div class="w-9 h-9 rounded-full bg-medivoy-100 flex items-center justify-center">
            <span class="text-sm font-semibold text-medivoy-600">{{ (auth.user?.email || 'U').charAt(0).toUpperCase() }}</span>
          </div>
        </div>
      </header>
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
function handleLogout() { auth.logout(); router.push("/"); }
const pageTitle = computed(() => {
  const titles = {"/dashboard":"Health Dashboard","/reports":"My Reports","/reports/upload":"Upload Report","/family":"Family Health","/nutrition":"Nutrition Engine","/admin":"Admin Panel"};
  return titles[route.path] || "Medivoy";
});
</script>
