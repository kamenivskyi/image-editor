// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@pinia/nuxt', 'vuetify-nuxt-module'],

  css: ['~/assets/scss/main.scss', 'cropperjs/dist/cropper.css'],

  vite: {
    optimizeDeps: {
      include: ['cropperjs'],
    },
  },

  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
        themes: {
          dark: {
            dark: true,
            colors: {
              primary: '#16a34a',
              secondary: '#22c55e',
              success: '#22c55e',
              background: '#0f172a',
              surface: '#1e293b',
              error: '#ef4444',
              info: '#3b82f6',
              warning: '#f59e0b',
            },
          },
        },
      },
    },
  },
})