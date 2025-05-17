<template lang="pug">
  section(class="flex flex-col items-start")
    // First Box - Quick Actions
    aside(class="bg-[#C2963A] w-64 flex flex-col items-start px-6 py-6 mt-4 ml-4 mb-4 shadow-md")
      h2(class="text-white text-2xl font-bold mb-4 text-left") Quick Actions
  
      NuxtLink(
        to="/course_pages/library"
        class="w-[95%] bg-[#C2963A] text-white font-medium py-2 px-4 mb-2 hover:bg-[#A17C30] transition duration-300 flex items-center gap-4 no-underline"
      )
        img(src="/book.svg" alt="Book Icon" class="w-6 h-6 pl-0")
        | Library
  
      NuxtLink(
        to="/course_pages/log-book"
        class="w-[95%] bg-[#C2963A] text-white font-medium py-2 px-4 mb-2 hover:bg-[#A17C30] transition duration-300 flex items-center gap-4 no-underline"
      )
        img(src="/plus.svg" alt="Plus Icon" class="w-6 h-6 pl-0")
        | Log New Book
  
      NuxtLink(
        to="/course_pages/progress"
        class="w-[95%] bg-[#C2963A] text-white font-medium py-2 px-4 mb-2 hover:bg-[#A17C30] transition duration-300 flex items-center gap-4 no-underline"
      )
        img(src="/chart.svg" alt="Chart Icon" class="w-6 h-6 pl-0")
        | Progress
  
    // Second Box - My Collections
    aside(class="bg-[#C2963A] w-64 flex flex-col items-start px-6 py-6 ml-4 mt-6 mb-8 shadow-md")
      h2(class="text-white text-2xl font-bold mb-4 text-left") My Collections
  
      NuxtLink(
        to="/course_pages/recently-read"
        class="w-[95%] bg-[#C2963A] text-white font-medium py-2 px-4 mb-2 hover:bg-[#A17C30] transition duration-300 flex items-center gap-4 no-underline"
      )
        img(src="/recent.svg" alt="Recently Read Icon" class="w-6 h-6 pl-0")
        | Recently Read
  
      NuxtLink(
        to="/course_pages/favorites"
        class="w-[95%] bg-[#C2963A] text-white font-medium py-2 px-4 mb-2 hover:bg-[#A17C30] transition duration-300 flex items-center gap-4 no-underline"
      )
        img(src="/heart.svg" alt="Favorites Icon" class="w-6 h-6 pl-0")
        | Favorites
  
      NuxtLink(
        to="/course_pages/wishlist"
        class="w-[95%] bg-[#C2963A] text-white font-medium py-2 px-4 hover:bg-[#A17C30] transition duration-300 flex items-center gap-4 no-underline"
      )
        img(src="/star.svg" alt="Wishlist Icon" class="w-6 h-6 pl-0")
        | Wishlist
  </template>
  
  <script setup>
  // No logic needed here for sidebar links
  </script>
  
  <style scoped>
  /* Optional styles can go here */
  </style>
  