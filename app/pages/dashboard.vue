<template>
  <div class="space-y-6">
    <section class="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 p-6 text-white shadow-lg">
      <h3 class="text-3xl font-bold">AI based health screening for reports</h3>
      <p class="mt-3 max-w-3xl text-white/90">Upload your reports and find answers for your health profile, next 5 years, diet, vitamins, family risk and longevity guidance.</p>
      <div class="mt-6 flex gap-3"><NuxtLink to="/reports/upload" class="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900">Upload report</NuxtLink><NuxtLink to="/reports" class="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white">View reports</NuxtLink></div>
    </section>
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="text-sm text-slate-500">Health score</p><p class="mt-3 text-3xl font-bold">87</p></div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="text-sm text-slate-500">Risk score</p><p class="mt-3 text-3xl font-bold">24%</p></div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="text-sm text-slate-500">Bio age</p><p class="mt-3 text-3xl font-bold">35</p></div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p class="text-sm text-slate-500">Reports</p><p class="mt-3 text-3xl font-bold">3</p></div>
    </section>
  </div>
</template>
