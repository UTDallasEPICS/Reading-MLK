<script setup>
import { ref } from 'vue'

definePageMeta({
  coursePage: true
})

const message = ref('Welcome to the Course Home Page!')
</script>

<template lang="pug">
.wrapper.flex.bg-white.min-h-screen
  // Sidebar auto-rendered via layout

  // Main content area beside the sidebar
  .main-content.flex.flex-col.flex-1.p-10
    h1.text-4xl.font-bold.text-customBlue.mb-4 Course Home
    p.text-lg.text-gray-600.mb-6 {{ message }}

    button(
      @click="message = 'Thanks for clicking!'"
      class="px-6 py-3 bg-[#C2963A] text-white font-medium rounded-lg shadow-md hover:bg-[#A17C30] transition-all duration-300 mb-4 w-fit"
    ) Click Me

    router-link(
      to="/course_pages/questions"
      class="inline-block mt-4 px-6 py-3 bg-[#C2963A] text-white font-medium rounded-lg shadow-md hover:bg-[#A17C30] transition-all duration-300 w-fit"
    ) Start Questions
</template>

<style scoped>
.main-content {
  min-height: 100vh;
}
</style>
