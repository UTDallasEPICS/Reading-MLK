<template lang="pug">
    div(class="landing-page")
        p Welcome to Reading Huddle
        button(@click="openAccountSelectionWindow") Register Now
        AccountSelectionWindow(v-if="showAccountSelectionWindow" @close="closeAccountSelectionWindow")
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
    
    <style lang="css" scoped>
    .landing-page {
      text-align: center;
      padding: 20px;
    }
    
    button {
      padding: 10px 20px;
      background-color: #3498db;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #2980b9;
    }
    </style>
    