<script setup>
const testClick = () => {
  console.log('Dashboard button clicked!')
}
</script>

<template lang="pug">
aside.sidebar(class="bg-green-700 w-64 flex flex-col items-start px-6 py-6 mt-4 mb-8 rounded-lg shadow-md")
  h2(class="text-white text-2xl font-semibold mb-4") Dashboard

  button(
    @click="testClick"
    class="bg-white text-green-700 font-bold py-2 px-4 rounded-md hover:bg-green-100 transition duration-300"
  ) Test Button
</template>
