<script setup>
import { ref } from 'vue'

definePageMeta({
  coursePage: true
})

const message = ref('Welcome to the Course Home Page!')
</script>

<template lang="pug">
    .wrapper.flex.bg-white.min-h-screen
      // Sidebar is auto-rendered via app.vue
    
      // Main content area next to the sidebar
      .main-content.flex.flex-col.flex-1.p-10
        h1.text-4xl.font-bold.text-customBlue.mb-6 New Page
        p.text-lg.text-gray-700.mb-4 {{ message }}
        button(
          @click="message = 'Thanks for clicking!'"
          class="px-6 py-3 bg-customBlue text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        ) Click Me

        // link to Questions page
        nuxt-link(
          to="questions"
          class="inline-block mt-6 px-6 py-3 bg-customBlue text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        ) Start Questions

        // link to Multiple Choice Questions page (multiplechoicequiz)
        nuxt-link(
          to="multiplechoicequiz"
          class="inline-block mt-6 px-6 py-3 bg-customBlue text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        ) Start Multiple Choice Quiz

    </template>
    

<style scoped>
/* Optional: You can control sidebar width here if needed */
</style>
