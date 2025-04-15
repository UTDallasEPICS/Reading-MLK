<script setup>
const showAccountSelectionWindow = ref(false);

const isHovered = ref(false)
const showArrow = ref(true)

function openAccountSelectionWindow() {
  console.log('Opening account selection window...');
  showAccountSelectionWindow.value = true;
}

function closeAccountSelectionWindow() {
  console.log('Closing account selection window...');
  showAccountSelectionWindow.value = false;
}

const scrollToNextSection = () => {
  isHovered.value = true // Stop bouncing immediately on click
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  })
}

const checkScroll = () => {
  showArrow.value = window.scrollY < 100
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>


<template lang="pug">
  .main-container(class="flex flex-col items-center min-h-screen bg-white overflow-y-hidden")
    // Centered Section
    // Centered Section
    .centered-container(class="relative flex items-center justify-center text-center w-full overflow-hidden h-[93vh] transition-all duration-500")
      img(src="/children_playing.jpg" alt="Welcome to Reading Huddle" class="absolute inset-0 w-full h-full object-cover opacity-100 transition-transform transform group-hover:scale-110 group-hover:opacity-80 motion-safe:animate-zoomIn")
      .text-container(class="flex flex-col items-center z-10 w-full bg-black/30 p-6 sm:p-8 animate-slideFadeIn shadow-xl")
        h1(class="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white drop-shadow-xl overflow-hidden whitespace-nowrap p-4 animate-typing") Welcome to Reading Huddle
        h3(class="text-2xl sm:text-3xl lg:text-5xl font-medium text-yellow-300 drop-shadow-lg italic tracking-wider") Creating story time wins

      // Scroll Down Pointer
      .scroll-down-pointer(
        @click="scrollToNextSection"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        v-show="showArrow"
        class="absolute bottom-10 w-8 h-8 bg-white rounded-full flex items-center justify-center mx-auto cursor-pointer transition-all duration-300"
        :class="{ 'animate-bounce': !isHovered }"
      )
        i(
          class="fa fa-chevron-down"
          :class="{ 'text-gray-400': !isHovered, 'text-gray-600': isHovered }"
        )

    // Mission Section
    .mission-container(id="mission" class="relative flex flex-row justify-center items-center w-full py-12 px-6 animate-fadeIn")
      .mission-header-container(class="flex flex-col items-center justify-center px-8 py-4 bg-missionBox w-full h-[20vw] max-w-4xl rounded-lg shadow-md animate-slideDown" style="clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 50%, 100% 100%, 0 100%);")
        h3(class="text-3xl lg:text-4xl font-bold text-white uppercase tracking-wide") Our Mission
      .mission-content-container(class="text-center space-y-6 ")
        p(class="text-lg sm:text-xl px-4 sm:px-6 font-medium text-gray-800 leading-relaxed") 
          | At Reading Huddle, our mission is to empower caregivers and preschoolers to build a foundation of literacy through the joy of storytelling. By connecting families with inspiring  "reading coaches," including sports figures and community leaders, we foster meaningful daily story time experiences that ignite a love for reading, strengthen bonds, and nurture the skills essential for lifelong learning. Together, we aim to champion early childhood literacy and create a future where every child has the tools to succeed.
        .mission-img-container(class="flex flex-wrap justify-center gap-8 animate-fadeInUp")
          img(src="/children_playing.jpg" alt="Image 1" class="w-80 h-auto rounded-lg shadow-lg object-cover transition-transform transform hover:scale-105 duration-300 hover:rotate-2")
          img(src="/children_playing.jpg" alt="Image 2" class="w-80 h-auto rounded-lg shadow-lg object-cover transition-transform transform hover:scale-105 duration-300 hover:rotate-2")
          img(src="/children_playing.jpg" alt="Image 3" class="w-80 h-auto rounded-lg shadow-lg object-cover transition-transform transform hover:scale-105 duration-300 hover:rotate-2")

    // Join Section
    .join-main-container(class="flex items-center items-baseline justify-center gap-36 bg-customBlue w-full py-12")
      .join-header-container(class="flex flex-col")
        h3(class="text-3xl lg:text-4xl font-semibold text-white tracking-wide") JOIN THE TEAM!
        div(class="h-1 bg-yellow-400 mt-2 rounded")
      .register-button-container(class="bg-registerGold px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer animate-bounce")
        button(@click="openAccountSelectionWindow" class="text-2xl font-bold text-white") Register Here!
        AccountSelectionWindow(v-if="showAccountSelectionWindow" @close="closeAccountSelectionWindow")

    // Modules Section
    div(class="flex flex-row items-baseline w-full h-auto p-9")
      .module-container(class="flex flex-wrap justify-center items-baseline gap-6 w-full py-10 px-4")
        .module(class="flex flex-col justify-center items-center w-[20vw] h-[20vh] p-4 bg-moduleGold text-white rounded-lg shadow-lg hover:shadow-xl transition-transform hover:scale-105")
          img(src="/whitebookstack.svg" alt="Bookstack icon" class="w-12 h-12 mr-4 object-contain")
          h2(class="text-xl font-semibold hover:text-yellow-300 transition") Read any book
        router-link(to="/course_pages/coursehomepage" class="flex flex-col justify-center items-center w-[20vw] h-[20vh] p-4 bg-moduleGold text-white rounded-lg shadow-lg hover:shadow-xl transition-transform hover:scale-105")
          img(src="/whitehome.svg" alt="Home icon" class="w-12 h-12 mr-4 object-contain")
          h2(class="text-xl font-semibold hover:text-yellow-300 transition") Course Homepage

      .mission-header-container(class="flex flex-col flex-wrap items-center justify-center pl-20 py-4 bg-missionBox w-[60vw] h-[20vw] max-w-4xl rounded-lg shadow-md animate-slideDown" style="clip-path: polygon(100% 0, 0 0, calc(0% + 30px) 50%, 0 100%, 100% 100%);")
        h3(class="text-3xl lg:text-4xl font-bold text-white uppercase tracking-wide") Start your reading Huddle


    // Huddle Section
    .huddle-container(class="flex flex-col items-center bg-[#C2963A] w-full py-12")
      div(class="flex")
        .huddle-header-container(class="flex items-center justify-center bg-[#A17C30] w-full max-w-4xl rounded-lg shadow-md")
          h3(class="text-3xl lg:text-4xl font-bold text-white uppercase tracking-wide") Inside The Huddle
        .huddle-content-container(class="text-center mt-6 space-y-6 ml-16")
          p(class="text-lg sm:text-xl px-4 font-medium text-gray-800 leading-relaxed") 
            | Inside the huddle, we bring together families and sports icons to create meaningful story time experiences for children.
          .huddle-img-container(class="flex flex-col px-7")
            img(src="/children_playing.jpg" alt="Huddle image 1" class="self-start w-64 h-48 rounded-lg shadow-lg object-cover hover:scale-105 transition-transform")
            img(src="/children_playing.jpg" alt="Huddle image 2" class="self-end w-64 h-48 rounded-lg shadow-lg object-cover hover:scale-105 transition-transform")

    
</template>
