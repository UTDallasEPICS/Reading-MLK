<template lang="pug">
  .header-container(style="display: flex; flex-direction: row; background-color: grey; justify-content: center;")
    p.header-text(style="font-size: 50px;") Welcome to Reading Huddle
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