<template lang="pug">
  .header-container
    p.header-text Welcome to Reading Huddle
</template>

<script setup>
import { ref } from 'vue';
import AccountSelectionWindow from '@/pages/accountSelectionWindow.vue';

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

<style scoped>
.header-container {
  display: flex;
  flex-direction: row;
  background-color: grey;
  justify-content: center;
}

.header-text {
  font-size: 50px;
}
</style>