<template lang="pug">
  div(class="text-center p-5")
    p.text-lg.font-semibold Welcome to Reading Huddle
    button(@click="openAccountSelectionWindow" class="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300") Register Now
    AccountSelectionWindow(v-if="showAccountSelectionWindow" @close="closeAccountSelectionWindow")
</template>

<script setup>
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
