// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig:{
    AUTH0_CLIENTID: '',
    AUTH0_SECRET: '',
    BASEURL: '',
    ISSUER: '',
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: "2024-04-03"
})
