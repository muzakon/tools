// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'DevKit',
      meta: [
        { name: 'description', content: 'A collection of handy tools for product development — converters, graphics utilities, text tools, and more.' },
      ],
    },
  },
  modules: ['@nuxt/icon', '@nuxt/fonts', 'vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark'
      }
    }
  },
  css: ['@/assets/style/tailwind.css', '@/assets/style/main.scss'],
  ssr: false,
  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
})