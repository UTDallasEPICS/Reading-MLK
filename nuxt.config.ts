// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image'],
  css: ['./assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: [
        'better-auth/client/plugins',
        'better-auth/vue',
        'dayjs',
        'dayjs/plugin/utc',
        'emoji-mart',
        'zod',
      ],
    },
  },
  ssr: false,
})
