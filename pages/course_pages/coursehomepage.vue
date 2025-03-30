<script setup>
import { ref } from 'vue'

definePageMeta({
  coursePage: true
})

const message = ref('Welcome to the Course Home Page!')
</script>

<template lang="pug">
.main-container(class="flex flex-col items-center justify-center min-h-screen bg-white p-10")

  h1(class="text-4xl font-bold text-customBlue mb-6") New Page

  p(class="text-lg text-gray-700 mb-4") {{ message }}

  button(@click="message = 'Thanks for clicking!'" class="px-6 py-3 bg-customBlue text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300")
    | Click Me
</template>
