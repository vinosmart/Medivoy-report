import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-05-01",
  srcDir: "app",
  devtools: { enabled: true },
  css: ["assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  modules: ["@pinia/nuxt", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700, 800],
    },
  },
  pinia: {
    storesDirs: ["stores/**"],
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3001/api",
    },
  },
  app: {
    head: {
      title: "Medivoy AI — Preventive Healthcare",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "AI-powered preventive health and longevity platform." },
      ],
    },
  },
});
