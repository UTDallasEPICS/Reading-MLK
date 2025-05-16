<template lang="pug">
    header.navbar(class="flex justify-between items-center bg-lighterBlue px-4 py-2")
      .img-container(class="w-fit")
        img(
          src="/image.png" 
          alt="Company Logo"
          class="h-20 object-contain"
        )
  
      a#logoutbtn(
        href="/api/logout"
        @click="logout"
        class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
      ) Logout
  </template>
  
  <style scoped>
  body {
    margin-top: 80px;
  }
  </style>
  
  <script setup>
  function logout() {
    console.log("Logging out..."); 
  }
  </script>
  