<script setup>
import { ref, reactive } from 'vue';
</script>

<!-- <template lang="pug">
  .main-container(class="flex flex-col items-center min-h-screen bg-[#fefcf9]")
    // Centered Section
    .centered-container(class="relative flex items-center justify-center text-center m-5 w-[97vw] sm:h-[350px] lg:h-[450px] overflow-hidden rounded-xl shadow-2xl")
      img(src="/children_playing.jpg" alt="Welcome to Reading Huddle" class="absolute inset-0 w-full h-full object-cover opacity-100 transition-transform transform group-hover:scale-110 group-hover:opacity-80 motion-safe:animate-zoomIn")
      .text-container(class="flex flex-col items-center gap-3 z-10 bg-black/20 p-4 sm:p-6 rounded-lg animate-slideFadeIn")
        h1(class="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white drop-shadow-xl overflow-hidden whitespace-nowrap p-4 animate-typing") Welcome to Reading Huddle
        h3(class="text-2xl sm:text-3xl lg:text-5xl font-medium text-yellow-300 drop-shadow-lg italic") Creating story time wins
    .mission-container(class="relative flex flex-col justify-center items-center bg-[#FFCD98] w-full gap-8 p-10")
      .mission-header-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-[90%] max-w-[800px] rounded-xl shadow-md")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide") Our Mission
      .mission-content-container(class="flex flex-col justify-center items-center p-6 sm:p-4 gap-8 text-center")
        p(class="lg:text-lg px-4 sm:px-6 font-medium text-black leading-relaxed animate-slideFadeIn") 
          | Reading Huddle is a literacy tool that uses sports figures and community members as reading “coaches” who help caregivers conduct effective, daily story time sessions with preschoolers.
        .mission-img-container(class="flex flex-wrap justify-center items-center gap-12")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-md shadow-lg object-cover shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-md shadow-lg object-cover shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-md shadow-lg object-cover shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300")
    .join-main-container(class="relative flex flex-row justify-center items-center bg-[#FFCD98] w-full gap-24")
      .join-header-container(class="flex flex-col justify-center items-center px-8 py-6 w-auto max-w-[800px]")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-wide") JOIN THE TEAM!
        div(class="h-[5px] bg-yellow-200 w-full mt-2")
      .register-button-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-auto max-w-[800px] rounded-xl shadow-md")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide") Register Here!

    .huddle-container(class="relative flex flex-col justify-center items-center bg-[#FFCD98] w-full gap-8")
      .huddle-header-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-[90%] max-w-[800px] rounded-xl shadow-md")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide") Inside The Huddle
      .huddle-content-container(class="flex flex-col justify-center items-center p-6 sm:p-4 gap-8 text-center")
        p(class="lg:text-lg px-4 sm:px-6 font-medium text-black leading-relaxed animate-slideFadeIn") 
          | Reading Huddle is a literacy tool that uses sports figures and community members as reading “coaches” who help caregivers conduct effective, daily story time sessions with preschoolers.
        .huddle-img-container(class="flex flex-wrap justify-center items-center gap-12")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-md shadow-md object-cover animate-slideFadeIn")
          img(src="/children_playing.jpg" alt="Image 2" class="w-80 h-auto rounded-md shadow-md object-cover animate-slideFadeIn")
          img(src="/children_playing.jpg" alt="Image 3" class="w-80 h-auto rounded-md shadow-md object-cover animate-slideFadeIn")


    // Module Section
    .module-container(class="flex justify-center items-center p-6 sm:p-8 bg-[#FFCD98] w-full flex-wrap")
      .module(
        class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300 m-4"
      )
        img(src="/bookstack.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain cursor-pointer")
        h2(class="text-2xl sm:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer text-ellipsis") Read any book
      .module(
        class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300 m-4"
      )
        img(src="/home.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain")
        h2(class="text-2xl sm:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer") Course Homepage
</template> -->

<!-- <template lang="pug">
  .main-container(class="flex flex-col items-center min-h-screen bg-[#fefcf9]")

    // Centered Section
    .centered-container(class="relative flex items-center justify-center text-center m-5 w-[97vw] sm:h-[350px] lg:h-[450px] overflow-hidden rounded-xl shadow-2xl")
      img(src="/children_playing.jpg" alt="Welcome to Reading Huddle" class="absolute inset-0 w-full h-full object-cover opacity-100 transition-transform transform group-hover:scale-110 group-hover:opacity-80 motion-safe:animate-zoomIn")
      .text-container(class="flex flex-col items-center gap-3 z-10 bg-black/30 p-4 sm:p-6 rounded-lg animate-slideFadeIn")
        h1(class="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white drop-shadow-xl overflow-hidden whitespace-nowrap p-4 animate-typing") Welcome to Reading Huddle
        h3(class="text-2xl sm:text-3xl lg:text-5xl font-medium text-yellow-300 drop-shadow-lg italic") Creating story time wins

    // Mission Section
    .mission-container(class="relative flex flex-col justify-center items-center bg-[#FFCD98] w-full gap-8 p-10")
      .mission-header-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-[90%] max-w-[800px] rounded-xl shadow-md")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide") Our Mission
      .mission-content-container(class="flex flex-col justify-center items-center p-6 sm:p-4 gap-8 text-center")
        p(class="lg:text-lg px-4 sm:px-6 font-medium text-black leading-relaxed animate-slideFadeIn") 
          | Reading Huddle is a literacy tool that uses sports figures and community members as reading “coaches” who help caregivers conduct effective, daily story time sessions with preschoolers.
        .mission-img-container(class="flex flex-wrap justify-center items-center gap-12")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-md shadow-lg object-cover shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-md shadow-lg object-cover shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-md shadow-lg object-cover shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300")

    // Join Section
    .join-main-container(class="relative flex flex-row justify-center items-center bg-[#FFCD98] w-full gap-24")
      .join-header-container(class="flex flex-col justify-center items-center px-8 py-6 w-auto max-w-[800px]")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-wide") JOIN THE TEAM!
        div(class="h-[5px] bg-yellow-200 w-full mt-2")
      .register-button-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-auto max-w-[800px] rounded-xl shadow-md")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide") Register Here!

    // Huddle Section
    .huddle-container(class="relative flex flex-col justify-center items-center bg-[#FFCD98] w-full gap-8")
      .huddle-header-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-[90%] max-w-[800px] rounded-xl shadow-md")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide") Inside The Huddle
      .huddle-content-container(class="flex flex-col justify-center items-center p-6 sm:p-4 gap-8 text-center")
        p(class="lg:text-lg px-4 sm:px-6 font-medium text-black leading-relaxed animate-slideFadeIn") 
          | Reading Huddle is a literacy tool that uses sports figures and community members as reading “coaches” who help caregivers conduct effective, daily story time sessions with preschoolers.
        .huddle-img-container(class="flex flex-wrap justify-center items-center gap-12")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-md shadow-md object-cover animate-slideFadeIn")
          img(src="/children_playing.jpg" alt="Image 2" class="w-80 h-auto rounded-md shadow-md object-cover animate-slideFadeIn")
          img(src="/children_playing.jpg" alt="Image 3" class="w-80 h-auto rounded-md shadow-md object-cover animate-slideFadeIn")

    // Module Section
    .module-container(class="flex justify-center items-center p-6 sm:p-8 bg-[#FFCD98] w-full flex-wrap")
      .module(class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300 m-4")
        img(src="/bookstack.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain cursor-pointer")
        h2(class="text-2xl sm:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer text-ellipsis") Read any book
      .module(class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300 m-4")
        img(src="/home.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain")
        h2(class="text-2xl sm:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer") Course Homepage
</template> -->

<template lang="pug">
  .main-container(class="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#fefcf9] via-[#FFCD98] to-[#F6D8A1]")

    // Centered Section
    .centered-container(class="relative flex items-center justify-center text-center w-full overflow-hidden h-[100vh] transition-all duration-500")
      img(src="/children_playing.jpg" alt="Welcome to Reading Huddle" class="absolute inset-0 w-full h-full object-cover opacity-100 transition-transform transform group-hover:scale-110 group-hover:opacity-80 motion-safe:animate-zoomIn")
      .text-container(class="flex flex-col items-center gap-3 z-10 w-full bg-black/30 p-6 sm:p-8 animate-slideFadeIn shadow-xl")
        h1(class="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white drop-shadow-xl overflow-hidden whitespace-nowrap p-4 animate-typing") Welcome to Reading Huddle
        h3(class="text-2xl sm:text-3xl lg:text-5xl font-medium text-yellow-300 drop-shadow-lg italic tracking-wider") Creating story time wins


    // Mission Section
    .mission-container(class="relative flex flex-col justify-center items-center bg-[#FFCD98] w-full gap-8 py-14")
      .mission-header-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-[90%] max-w-[800px] rounded-xl shadow-md border-2 border-[#FFBD47]")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide uppercase") Our Mission
      .mission-content-container(class="flex flex-col justify-center items-center p-6 sm:p-4 gap-8 text-center")
        p(class="lg:text-lg px-4 sm:px-6 font-medium text-black leading-relaxed animate-slideFadeIn") 
          | Reading Huddle is a literacy tool that uses sports figures and community members as reading “coaches” who help caregivers conduct effective, daily story time sessions with preschoolers.
        .mission-img-container(class="flex flex-wrap justify-center items-center gap-12")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-lg shadow-lg object-cover transition-transform transform hover:scale-105 duration-300")
          img(src="/children_playing.jpg" alt="Image 2" class="w-80 h-auto rounded-lg shadow-lg object-cover transition-transform transform hover:scale-105 duration-300")
          img(src="/children_playing.jpg" alt="Image 3" class="w-80 h-auto rounded-lg shadow-lg object-cover transition-transform transform hover:scale-105 duration-300")

    // Join Section
    .join-main-container(class="relative flex flex-row justify-center items-center bg-[#FFCD98] w-full gap-24 py-14")
      .join-header-container(class="flex flex-col justify-center items-center px-8 py-6 w-auto max-w-[800px] bg-[#F6D8A1] rounded-lg shadow-md")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-wide") JOIN THE TEAM!
        div(class="h-[5px] bg-yellow-200 w-full mt-2")
      .register-button-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-auto max-w-[800px] rounded-xl shadow-md hover:shadow-xl transition-all duration-300")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide") Register Here!

    // Huddle Section
    .huddle-container(class="relative flex flex-col justify-center items-center bg-[#FFCD98] w-full gap-8 py-14")
      .huddle-header-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-[90%] max-w-[800px] rounded-xl shadow-md border-2 border-[#FFBD47]")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide uppercase") Inside The Huddle
      .huddle-content-container(class="flex flex-col justify-center items-center p-6 sm:p-4 gap-8 text-center")
        p(class="lg:text-lg px-4 sm:px-6 font-medium text-black leading-relaxed animate-slideFadeIn") 
          | Reading Huddle is a literacy tool that uses sports figures and community members as reading “coaches” who help caregivers conduct effective, daily story time sessions with preschoolers.
        .huddle-img-container(class="flex flex-wrap justify-center items-center gap-12")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-lg shadow-lg object-cover animate-slideFadeIn hover:scale-105 duration-300")
          img(src="/children_playing.jpg" alt="Image 2" class="w-80 h-auto rounded-lg shadow-lg object-cover animate-slideFadeIn hover:scale-105 duration-300")
          img(src="/children_playing.jpg" alt="Image 3" class="w-80 h-auto rounded-lg shadow-lg object-cover animate-slideFadeIn hover:scale-105 duration-300")

    // Module Section
    .module-container(class="flex justify-center items-center p-6 sm:p-8 bg-[#FFCD98] w-full flex-wrap")
      .module(class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300 m-4")
        img(src="/bookstack.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain cursor-pointer transition-all duration-300")
        h2(class="text-2xl sm:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer text-ellipsis") Read any book
      .module(class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300 m-4")
        img(src="/home.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain cursor-pointer transition-all duration-300")
        h2(class="text-2xl sm:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer") Course Homepage
  div(class="text-center p-5")
    p.text-lg.font-semibold Welcome to Reading Huddle
    button(@click="openAccountSelectionWindow" class="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300") Register Now
    AccountSelectionWindow(v-if="showAccountSelectionWindow" @close="closeAccountSelectionWindow")
</template>

<!-- <template lang="pug">
  .main-container(class="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#fefcf9] via-[#FFCD98] to-[#F6D8A1]")

    // Centered Section with Parallax Effect
    .centered-container(class="relative flex items-center justify-center text-center m-5 w-[97vw] sm:h-[350px] lg:h-[450px] overflow-hidden rounded-xl shadow-2xl hover:scale-105 transition-all duration-500")
      img(src="/children_playing.jpg" alt="Welcome to Reading Huddle" class="absolute inset-0 w-full h-full object-cover opacity-100 transition-transform transform group-hover:scale-110 group-hover:opacity-80 motion-safe:animate-zoomIn")
      .text-container(class="flex flex-col items-center gap-3 z-10 bg-black/40 p-6 sm:p-8 rounded-lg animate-slideFadeIn shadow-xl")
        h1(class="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white drop-shadow-xl overflow-hidden whitespace-nowrap p-4 animate-typing") Welcome to Reading Huddle
        h3(class="text-2xl sm:text-3xl lg:text-5xl font-medium text-yellow-300 drop-shadow-lg italic tracking-wider") Creating story time wins

    // Mission Section with Gradient Overlay
    .mission-container(class="relative flex flex-col justify-center items-center bg-[#FFCD98] w-full gap-8 py-14")
      .mission-header-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-[90%] max-w-[800px] rounded-xl shadow-md border-2 border-[#FFBD47] bg-gradient-to-r from-[#FFCD98] via-[#F6D8A1] to-[#E0B07C]")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide uppercase") Our Mission
      .mission-content-container(class="flex flex-col justify-center items-center p-6 sm:p-4 gap-8 text-center")
        p(class="lg:text-lg px-4 sm:px-6 font-medium text-black leading-relaxed animate-slideFadeIn") 
          | Reading Huddle is a literacy tool that uses sports figures and community members as reading “coaches” who help caregivers conduct effective, daily story time sessions with preschoolers.
        .mission-img-container(class="flex flex-wrap justify-center items-center gap-12")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-lg shadow-lg object-cover transition-transform transform hover:scale-105 duration-300 hover:border-4 hover:border-yellow-400")
          img(src="/children_playing.jpg" alt="Image 2" class="w-80 h-auto rounded-lg shadow-lg object-cover transition-transform transform hover:scale-105 duration-300 hover:border-4 hover:border-yellow-400")
          img(src="/children_playing.jpg" alt="Image 3" class="w-80 h-auto rounded-lg shadow-lg object-cover transition-transform transform hover:scale-105 duration-300 hover:border-4 hover:border-yellow-400")

    // Join Section with Floating Button Effect
    .join-main-container(class="relative flex flex-row justify-center items-center bg-[#FFCD98] w-full gap-24 py-14")
      .join-header-container(class="flex flex-col justify-center items-center px-8 py-6 w-auto max-w-[800px] bg-[#F6D8A1] rounded-lg shadow-md")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-wide") JOIN THE TEAM!
        div(class="h-[5px] bg-yellow-200 w-full mt-2")
      .register-button-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-auto max-w-[800px] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide") Register Here!
      
    // Huddle Section with Parallax Scrolling
    .huddle-container(class="relative flex flex-col justify-center items-center bg-[#FFCD98] w-full gap-8 py-14")
      .huddle-header-container(class="flex justify-center items-center px-8 py-6 bg-[#E0B07C] w-[90%] max-w-[800px] rounded-xl shadow-md border-2 border-[#FFBD47]")
        h3(class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide uppercase") Inside The Huddle
      .huddle-content-container(class="flex flex-col justify-center items-center p-6 sm:p-4 gap-8 text-center")
        p(class="lg:text-lg px-4 sm:px-6 font-medium text-black leading-relaxed animate-slideFadeIn") 
          | Reading Huddle is a literacy tool that uses sports figures and community members as reading “coaches” who help caregivers conduct effective, daily story time sessions with preschoolers.
        .huddle-img-container(class="flex flex-wrap justify-center items-center gap-12")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-lg shadow-lg object-cover animate-slideFadeIn hover:scale-105 duration-300 hover:border-4 hover:border-yellow-400")
          img(src="/children_playing.jpg" alt="Image 2" class="w-80 h-auto rounded-lg shadow-lg object-cover animate-slideFadeIn hover:scale-105 duration-300 hover:border-4 hover:border-yellow-400")
          img(src="/children_playing.jpg" alt="Image 3" class="w-80 h-auto rounded-lg shadow-lg object-cover animate-slideFadeIn hover:scale-105 duration-300 hover:border-4 hover:border-yellow-400")

    // Module Section with Hover and Smooth Transitions
    .module-container(class="flex justify-center items-center p-6 sm:p-8 bg-[#FFCD98] w-full flex-wrap")
      .module(class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300 m-4 hover:shadow-lg hover:bg-gradient-to-r from-[#FFCD98] via-[#F6D8A1] to-[#E0B07C]")
        img(src="/bookstack.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain cursor-pointer transition-all duration-300")
        h2(class="text-2xl sm:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer text-ellipsis") Read any book
      .module(class="flex items-center p-4 sm:p-5 bg-white rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300 m-4 hover:shadow-lg hover:bg-gradient-to-r from-[#FFCD98] via-[#F6D8A1] to-[#E0B07C]")
        img(src="/home.svg" alt="Reading Huddle Logo" class="w-16 h-16 mr-4 rounded-full object-contain cursor-pointer transition-all duration-300")
        h2(class="text-2xl sm:text-4xl font-semibold text-gray-800 hover:text-yellow-500 transition-all duration-300 cursor-pointer") Course Homepage
        
</template> -->

<!-- <template lang="pug">
  .main-container(style="display: flex; flex-direction: column; align-items: center; min-height: 100vh; background: linear-gradient(to bottom, #fefcf9, #FFCD98, #F6D8A1);")

    // Centered Section with Parallax Effect
    .centered-container(style="position: relative; display: flex; align-items: center; justify-content: center; text-align: center; margin: 20px; width: 97vw; height: 450px; overflow: hidden; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); transition: transform 0.5s;")
      img(src="/children_playing.jpg" alt="Welcome to Reading Huddle" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.7; transition: opacity 0.3s ease-in-out; transform: scale(1.1);")
      .text-container(style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 15px; padding: 20px; background-color: rgba(0, 0, 0, 0.5); border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);")
        h1(style="font-size: 3rem; font-weight: 800; color: white; text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.6); margin: 0;") Welcome to Reading Huddle
        h3(style="font-size: 1.5rem; font-weight: 600; color: #FFCD98; text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);") Creating story time wins

    // Mission Section with Gradient Overlay
    .mission-container(style="position: relative; display: flex; flex-direction: column; align-items: center; background: #FFCD98; width: 100%; padding: 60px 20px;")
      .mission-header-container(style="display: flex; justify-content: center; align-items: center; padding: 15px; width: 90%; max-width: 800px; background: linear-gradient(90deg, #FFCD98, #F6D8A1); border-radius: 20px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);")
        h3(style="font-size: 2rem; font-weight: 700; color: white; letter-spacing: 2px; text-transform: uppercase;") Our Mission
      .mission-content-container(style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 30px; padding: 20px; text-align: center;")
        p(style="font-size: 1.25rem; color: #333; line-height: 1.6; max-width: 800px;") 
          Reading Huddle is a literacy tool that uses sports figures and community members as reading “coaches” who help caregivers conduct effective, daily story time sessions with preschoolers.
        .mission-img-container(style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;")
          img(src="/children_playing.jpg" alt="Image 1" style="width: 250px; height: auto; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease;")
          img(src="/children_playing.jpg" alt="Image 2" style="width: 250px; height: auto; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease;")
          img(src="/children_playing.jpg" alt="Image 3" style="width: 250px; height: auto; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease;")

    // Join Section with Floating Button Effect
    .join-main-container(style="position: relative; display: flex; justify-content: center; align-items: center; background: #F6D8A1; width: 100%; padding: 60px 20px;")
      .join-header-container(style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 15px; width: auto; max-width: 800px; background: #E0B07C; border-radius: 20px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);")
        h3(style="font-size: 2rem; font-weight: 700; color: white; letter-spacing: 2px; text-transform: uppercase;") JOIN THE TEAM!
      .register-button-container(style="display: flex; justify-content: center; align-items: center; padding: 15px; width: auto; max-width: 800px; background: #F6D8A1; border-radius: 20px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); margin-top: 20px; transition: transform 0.3s ease;")
        h3(style="font-size: 2rem; font-weight: 700; color: #333; text-transform: uppercase;") Register Here!
      
    // Huddle Section with Parallax Scrolling
    .huddle-container(style="position: relative; display: flex; flex-direction: column; align-items: center; background: #FFCD98; width: 100%; padding: 60px 20px;")
      .huddle-header-container(style="display: flex; justify-content: center; align-items: center; padding: 15px; width: 90%; max-width: 800px; background: #E0B07C; border-radius: 20px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);")
        h3(style="font-size: 2rem; font-weight: 700; color: white; letter-spacing: 2px; text-transform: uppercase;") Inside The Huddle
      .huddle-content-container(style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 30px; padding: 20px; text-align: center;")
        p(style="font-size: 1.25rem; color: #333; line-height: 1.6; max-width: 800px;") 
          Reading Huddle is a literacy tool that uses sports figures and community members as reading “coaches” who help caregivers conduct effective, daily story time sessions with preschoolers.
        .huddle-img-container(style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;")
          img(src="/children_playing.jpg" alt="Image 1" style="width: 250px; height: auto; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease;")
          img(src="/children_playing.jpg" alt="Image 2" style="width: 250px; height: auto; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease;")
          img(src="/children_playing.jpg" alt="Image 3" style="width: 250px; height: auto; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease;")

    // Module Section with Hover and Smooth Transitions
    .module-container(style="display: flex; justify-content: center; align-items: center; padding: 20px; flex-wrap: wrap; background: #FFCD98; width: 100%;")
      .module(style="display: flex; align-items: center; padding: 20px; background: white; border-radius: 15px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); margin: 10px; width: 300px; justify-content: center; text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease;")
        img(src="/bookstack.svg" alt="Book Icon" style="width: 50px; height: 50px; margin-bottom: 10px; transition: transform 0.3s ease;")
        h4(style="font-size: 1.25rem; color: #333; font-weight: 600;") Module Title
        p(style="font-size: 1rem; color: #777; line-height: 1.4;") A short description of the module goes here.

</template> -->
