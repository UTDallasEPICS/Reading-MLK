// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
export default defineNuxtConfig({
  $production: {
    routeRules: {
      '/**': { isr: true }
    }
  },
  devtools: { enabled: true },
  css: [
    "~/assets/main.scss"
  ]
});
