<template lang="pug">
  .main-container(style="display: flex; flex-direction: column; align-items: center; justify-content: center;")
    .centered-container(style="display: flex; align-items: center; justify-content: center; text-align: center;")
      h1 Welcome to Reading Huddle
    .module-container(style="display: flex; justify-content: center; align-items: center; padding: 20px; border-radius: 20px; background-color: #FFCD98; width: 90vw; gap: 30px;")
      .module(
        :key="index"
        :style="moduleStyles[0]"
        @mouseover="applyHoverStyles(0)"
        @mouseleave="removeHoverStyles(0)"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" style="width: 50px; height: 50px; margin-right: 10px; border-radius: 5px; object-fit: contain;")
        h2(style="font-size: clamp(2vw + 1rem, 2.5rem);") About Us
      .module(
        :key="index"
        :style="moduleStyles[1]"
        @mouseover="applyHoverStyles(1)"
        @mouseleave="removeHoverStyles(1)"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" style="width: 50px; height: 50px; margin-right: 10px; border-radius: 5px; object-fit: contain;")
        h2(style="font-size: clamp(2vw + 1rem, 2.5rem);") Course Homepage
      .module(
        :key="index"
        :style="moduleStyles[2]"
        @mouseover="applyHoverStyles(2)"
        @mouseleave="removeHoverStyles(2)"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" style="width: 50px; height: 50px; margin-right: 10px; border-radius: 5px; object-fit: contain;")
        h2(style="font-size: clamp(2vw + 1rem, 2.5rem);") container 3
</template>

<script setup>
import { ref, reactive } from 'vue';

const showAccountSelectionWindow = ref(false);
const modules = [
  { title: 'About Us' },
  { title: 'Course Homepage' },
  { title: 'Container 3' },
];

const moduleStyles = reactive(modules.map(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80px',
  backgroundColor: '#FFE382',
  padding: '60px 60px',
  borderRadius: '10px',
  width: '1000px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease'
})));

function applyHoverStyles(index) {
  moduleStyles[index].backgroundColor = '#FFBB33'; // Change background color on hover
  moduleStyles[index].transform = 'scale(1.05)'; // Slightly scale the element on hover
  moduleStyles[index].boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Add box shadow on hover
}

function removeHoverStyles(index) {
  moduleStyles[index].backgroundColor = '#FFE382'; // Revert to original background color
  moduleStyles[index].transform = 'scale(1)'; // Revert scaling
  moduleStyles[index].boxShadow = 'none'; // Remove box shadow
}

function openAccountSelectionWindow() {
  console.log('Opening account selection window...');
  showAccountSelectionWindow.value = true;
}

function closeAccountSelectionWindow() {
  console.log('Closing account selection window...');
  showAccountSelectionWindow.value = false;
}
</script>