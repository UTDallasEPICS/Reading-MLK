<template lang="pug">
  div(class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50")
    div(class="bg-white p-5 rounded-lg text-center w-80")
      h2.mb-4.text-2xl.font-semibold Select Account Type
      nuxt-link(to="/parentform" class="block bg-gray-300 text-black py-2 px-4 m-2 rounded hover:bg-gray-400 transition duration-300") Parent
      nuxt-link(to="/facultyform" class="block bg-gray-300 text-black py-2 px-4 m-2 rounded hover:bg-gray-400 transition duration-300") Faculty
      button(@click="closeAccountSelectionWindow" class="block bg-red-500 text-white py-3 px-6 m-auto mt-4 rounded-lg hover:bg-red-700 transition duration-300") Close
</template>

<script setup lang="ts">
//const props = defineProps<{ showAccountSelectionWindow: boolean}>();
const emit = defineEmits(['close']);

const closeAccountSelectionWindow = () => {
  emit('close');
};
//console.log('Account Selection Window component rendered!'); //testing line
</script>



