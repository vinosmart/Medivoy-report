import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://geno.medivoy.in'
const siteName = 'Medivoy'
const siteDescription =
  'Medivoy turns your medical, lab, and genetic reports into clear, AI-powered health insights. Upload a report for instant analysis, track family health history, and get personalized nutrition and genetics guidance.'
const siteKeywords = [
  'medical report analysis',
  'AI medical report analysis',
  'health report analysis',
  'lab report analysis online',
  'genetic report analysis',
  'DNA report analysis',
  'blood test report analysis',
  'upload medical report online',
  'AI health insights',
  'family health history tracker',
  'personalized nutrition guidance',
  'Medivoy',
].join(', ')

export default defineNuxtConfig({
  compatibilityDate: '2026-05-01',
  srcDir: 'app',
  modules: ['@pinia/nuxt', '@nuxtjs/google-fonts'],
  vite: { plugins: [tailwindcss()] },
  pinia: { storesDirs: ['app/stores/**'] },
  runtimeConfig: { public: { apiBase: 'https://api-geno.medivoy.ae/v2/api', siteUrl } },
  css: ['~/assets/css/main.css'],
  googleFonts: { families: { Inter: [300, 400, 500, 600, 700, 800] } },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'AI Medical & Genetic Report Analysis',
      titleTemplate: '%s | Medivoy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: siteDescription },
        { name: 'keywords', content: siteKeywords },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#0e7490' },
        { name: 'author', content: siteName },

        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:title', content: 'Medivoy — AI Medical & Genetic Report Analysis' },
        { property: 'og:description', content: siteDescription },
        { property: 'og:url', content: siteUrl },
        { property: 'og:image', content: `${siteUrl}/icon-512.png` },
        { property: 'og:locale', content: 'en_US' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Medivoy — AI Medical & Genetic Report Analysis' },
        { name: 'twitter:description', content: siteDescription },
        { name: 'twitter:image', content: `${siteUrl}/icon-512.png` },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: siteUrl },
      ],
    },
  },
})
