<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <h2 class="text-lg font-semibold text-medivoy-900">Personalized Nutrition Engine</h2>
    <p class="text-sm text-medivoy-500">AI-generated dietary guidance based on your biomarkers and goals.</p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
        <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">Consume More</p>
        <ul class="space-y-2">
          <li class="flex items-center gap-2 text-sm text-emerald-900"><svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Leafy greens (spinach, kale)</li>
          <li class="flex items-center gap-2 text-sm text-emerald-900"><svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Fatty fish (salmon, mackerel)</li>
          <li class="flex items-center gap-2 text-sm text-emerald-900"><svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Oats &amp; whole grains</li>
          <li class="flex items-center gap-2 text-sm text-emerald-900"><svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Nuts &amp; seeds (walnuts)</li>
        </ul>
      </div>
      <div class="bg-rose-50 rounded-2xl border border-rose-100 p-5">
        <p class="text-xs font-semibold text-rose-600 uppercase tracking-wide mb-2">Limit / Avoid</p>
        <ul class="space-y-2">
          <li class="flex items-center gap-2 text-sm text-rose-900"><svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>Processed sugars</li>
          <li class="flex items-center gap-2 text-sm text-rose-900"><svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>Trans fats (fried foods)</li>
          <li class="flex items-center gap-2 text-sm text-rose-900"><svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>Excess sodium (&gt;2g/day)</li>
          <li class="flex items-center gap-2 text-sm text-rose-900"><svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>Refined carbohydrates</li>
        </ul>
      </div>
      <div class="bg-blue-50 rounded-2xl border border-blue-100 p-5">
        <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Supplement Guidance</p>
        <ul class="space-y-2">
          <li class="flex items-center gap-2 text-sm text-blue-900"><svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Omega-3 (1g/day)</li>
          <li class="flex items-center gap-2 text-sm text-blue-900"><svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Vitamin D3 (2000 IU)</li>
          <li class="flex items-center gap-2 text-sm text-blue-900"><svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Magnesium (400mg)</li>
          <li class="flex items-center gap-2 text-sm text-blue-900"><svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>CoQ10 (100mg)</li>
        </ul>
      </div>
    </div>
    <div class="bg-white rounded-2xl border border-medivoy-200 p-6">
      <h3 class="text-sm font-semibold text-medivoy-900 mb-4">Sample Longevity-Focused Day</h3>
      <div class="space-y-4">
        <div class="flex gap-4"><div class="w-16 flex-shrink-0 text-xs font-semibold text-medivoy-500 uppercase">Breakfast</div><div class="flex-1 p-3 rounded-xl bg-medivoy-50 border border-medivoy-100"><p class="text-sm text-medivoy-800">Overnight oats with chia seeds, walnuts, blueberries, and cinnamon. Green tea.</p></div></div>
        <div class="flex gap-4"><div class="w-16 flex-shrink-0 text-xs font-semibold text-medivoy-500 uppercase">Lunch</div><div class="flex-1 p-3 rounded-xl bg-medivoy-50 border border-medivoy-100"><p class="text-sm text-medivoy-800">Grilled salmon, quinoa bowl with roasted vegetables, olive oil dressing.</p></div></div>
        <div class="flex gap-4"><div class="w-16 flex-shrink-0 text-xs font-semibold text-medivoy-500 uppercase">Dinner</div><div class="flex-1 p-3 rounded-xl bg-medivoy-50 border border-medivoy-100"><p class="text-sm text-medivoy-800">Lentil curry with spinach, brown rice, turmeric. Side of fermented vegetables.</p></div></div>
      </div>
    </div>
  </div>
</template>
