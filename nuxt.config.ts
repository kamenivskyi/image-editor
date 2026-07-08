// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@pinia/nuxt', 'vuetify-nuxt-module'],

  app: {
    head: {
      title: 'Image Editor — Non-Destructive Browser Image Editor',
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      meta: [
        { name: 'description', content: 'A non-destructive browser-based image editor built with Vue 3, Vuetify, and Pinia. Supports crop, brightness, saturation, filters, and JSON export.' },
        { name: 'theme-color', content: '#0f172a' },
      ],
    },
  },

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