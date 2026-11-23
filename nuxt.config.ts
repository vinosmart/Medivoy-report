import tailwindcss from '@tailwindcss/vite'
const apiBase = process.env.NUXT_PUBLIC_API_BASE
  || (process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : 'https://api-geno.medivoy.ae/api')

export default defineNuxtConfig({
  compatibilityDate: '2026-05-01',
  srcDir: 'app',
  modules: ['@pinia/nuxt', '@nuxtjs/google-fonts'],
  vite: { plugins: [tailwindcss()] },
  pinia: { storesDirs: ['app/stores/**'] },
  runtimeConfig: { public: { apiBase } },
  css: ['~/assets/css/main.css'],
  googleFonts: { families: { Poppins: [300, 400, 500, 600, 700, 800] } },
  app: {
    head: { title: 'Medivoy', meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }] },
    pageTransition: { name: 'page', mode: 'out-in', appear: true },
  },
})
