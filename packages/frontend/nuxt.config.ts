export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ['@nuxt/ui'],
    ui: { global: true },
    runtimeConfig: { 
      public: { 
        backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'http://localhost:3000' 
      } 
    }
  })