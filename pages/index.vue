<template lang="pug">
  .main-container(class="flex flex-col items-center justify-center bg-gray-100 py-10")
    .centered-container(class="flex items-center justify-center text-center my-10 sm:mx-10 lg:mx-20 cursor-default")
      h1(class="text-4xl sm:text-4xl lg:text-7xl font-extrabold text-gray-800") Welcome to Reading Huddle
    .module-container(class="flex justify-center items-center p-6 sm:p-8 rounded-2xl bg-[#FFCD98] w-[90vw] sm:gap-36 shadow-lg")
      .module(
        :key="index"
        class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300"
      )
        img(src="/home.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain cursor-pointer")
        h2(class="text-4xl sm:text-2xl lg:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer") About Us
      .module(
        :key="index"
        class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300"
      )
        img(src="/bookstack.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain")
        h2(class="text-4xl sm:text-2xl lg:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer") Course Homepage
      .module(
        :key="index"
        class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300"
      )
        img(src="/bookstack.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain cursor-pointer")
        h2(class="text-4xl sm:text-2xl lg:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer") container 3

    Footer
  div(class="text-center p-5")
    p.text-lg.font-semibold Welcome to Reading Huddle
    button(@click="openAccountSelectionWindow" class="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300") Register Now
    AccountSelectionWindow(v-if="showAccountSelectionWindow" @close="closeAccountSelectionWindow")
    AboutUs
</template>

<script setup>
import { ref, reactive } from 'vue';

const showAccountSelectionWindow = ref(false);

function openAccountSelectionWindow() {
  console.log('Opening account selection window...');
  showAccountSelectionWindow.value = true;
}

function closeAccountSelectionWindow() {
  console.log('Closing account selection window...');
  showAccountSelectionWindow.value = false;
}
</script>
