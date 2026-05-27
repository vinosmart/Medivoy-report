<template>
  <div class="min-h-screen flex flex-col bg-medivoy-50">
    <header class="h-14 bg-medivoy-900 border-b border-medivoy-800 flex items-center justify-between px-6">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-medivoy-accent flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <span class="text-sm font-bold text-white tracking-tight">Medivoy Admin</span>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink to="/dashboard" class="text-xs text-medivoy-400 hover:text-white transition-colors">Exit Admin</NuxtLink>
        <button @click="logout" class="text-xs text-medivoy-400 hover:text-white transition-colors">Logout</button>
      </div>
    </header>
    <div class="flex-1 flex">
      <aside class="w-56 bg-white border-r border-medivoy-200 flex-shrink-0">
        <nav class="p-3 space-y-1">
          <NuxtLink to="/admin" active-class="bg-medivoy-100 text-medivoy-900" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-medivoy-600 hover:bg-medivoy-100 font-medium">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
            Overview
          </NuxtLink>
          <NuxtLink to="/admin/users" active-class="bg-medivoy-100 text-medivoy-900" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-medivoy-600 hover:bg-medivoy-100 font-medium">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            Users
          </NuxtLink>
          <NuxtLink to="/admin/reports" active-class="bg-medivoy-100 text-medivoy-900" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-medivoy-600 hover:bg-medivoy-100 font-medium">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            Reports
          </NuxtLink>
        </nav>
      </aside>
      <main class="flex-1 p-8"><slot /></main>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
function logout() { router.push("/"); }
</script>
