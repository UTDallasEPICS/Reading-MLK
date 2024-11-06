<template lang="pug">
  .main-container
    .centered-container
      h1 Welcome to Reading Huddle
    .module-container
      .module
        img(src="/public/bookmark.png" alt="Reading Huddle Logo")
        h2 About Us
      .module
        img(src="/public/bookmark.png" alt="Reading Huddle Logo")
        h2 Course Homepage
      .module
        img(src="/public/bookmark.png" alt="Reading Huddle Logo")
        h2 container3
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

<style>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.module-container {
  display: flex;
  /* flex-direction: ;  */
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  background-color: #FFCD98;
  width: 90vw;
  gap: 30px;
}

.module {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80px;
  background-color: #FFE382;
  padding: 60px 60px;
  border-radius: 10px;
  width: 1000px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

.module:hover {
  cursor: pointer;
  background-color: #FFD25A; /* Slightly darker shade for hover */
  transform: scale(1.05); /* Slightly enlarges the module */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); /* Adds a shadow effect */
}

.module h2 {
  font-size: clamp(2vw + 1rem, 2.5rem);
}

.module img {
  width: 50px; /* Adjust size as needed */
  height: 50px;
  margin-right: 10px; /* Add space between image and text */
  border-radius: 5px; /* Slight rounding for a softer look */
  object-fit: contain; /* Ensures image scaling is contained within dimensions */
}


</style>
