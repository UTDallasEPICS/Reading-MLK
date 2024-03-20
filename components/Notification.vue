<template>
    <div v-if="isVisible" class="notification">
      {{ message }}
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watchEffect } from 'vue';
  
  const props = defineProps(['isVisible', 'message']);
  
  const isVisible = ref(false);
  const message = ref('');
  
  // Watch for changes in isVisible and message
  watchEffect(() => {
    isVisible.value = props.isVisible;
    message.value = props.message;
  });
  
  onMounted(() => {
    setTimeout(() => {
      isVisible.value = false;
    }, 3000);
  });
  </script>
  
  <style scoped>
  .notification {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4caf50;
    color: white;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  </style>