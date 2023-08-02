export default defineNuxtConfig({
  telemetry: false,
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/color-mode",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxtjs/google-fonts",
    "@nuxtjs/supabase",
  ],
  colorMode: {
    classSuffix: ""
  },
  build: {
    transpile: ["@headlessui/vue"]
  }
});