import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2026-05-01',
  srcDir: 'app',
  modules: ['@pinia/nuxt', '@nuxtjs/google-fonts'],
  vite: { plugins: [tailwindcss()] },
  pinia: { storesDirs: ['app/stores/**'] },
  runtimeConfig: { public: { apiBase: 'http://localhost:3001/api' } },
  css: ['~/assets/css/main.css'],
  googleFonts: { families: { Inter: [300, 400, 500, 600, 700, 800] } },
  app: { head: { title: 'Medivoy', meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }] } },
})
