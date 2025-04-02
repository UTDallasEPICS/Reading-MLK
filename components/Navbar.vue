<template lang="pug">
  header.navbar(class="flex bg-customBlue")
    .img-container(class="w-fit")
      img(
              src="/image.png" 
              alt="Company Logo"
              class="h-20 object-contain"
            )
    .navbar-container(
      class="flex justify-center items-center gap-6 md:gap-10 py-4 mx-auto max-w-full"
    )
      nuxt-link#homebtn(
        to="/"
        class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
      ) Home

      nuxt-link#aboutbtn(
        to="/about"
        class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
      ) About Us

      // Register dropdown
      .dropdown.relative.inline-block.gap-4(
        onmouseenter="this.querySelector('.dropdown-content').style.display = 'block'"
        onmouseleave="this.querySelector('.dropdown-content').style.display = 'none'"
      )
        button.dropbtn(
          class="text-white font-bold py-2 px-4 lg:px-6 text-base lg:text-lg border-none cursor-pointer"
        ) Register

        .dropdown-content.hidden.absolute.bg-white.min-w-40.shadow-lg.z-10.rounded-md
          nuxt-link.navbar-item(
            to="/newuser"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Invite User
          nuxt-link.navbar-item(
            to="/facultyform"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Faculty
          nuxt-link.navbar-item(
            to="/parentform"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Parent

      // View dropdown
      .dropdown.relative.inline-block.gap-4(
        onmouseenter="this.querySelector('.dropdown-content').style.display = 'block'"
        onmouseleave="this.querySelector('.dropdown-content').style.display = 'none'"
      )
        button.dropbtn(
          class="text-white font-bold py-2 px-4 lg:px-6 text-base lg:text-lg border-none cursor-pointer"
        ) View

        .dropdown-content.hidden.absolute.bg-white.min-w-40.shadow-lg.z-10.rounded-md
          nuxt-link.navbar-item(
            to="/viewfaculty"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Faculty
          nuxt-link.navbar-item(
            to="/viewparents"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Parent

      a#logoutbtn(
        href="javascript:void(0)" 
        @click="logout"
        class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
      ) Logout
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{ userRole: string }>(); 

const showViewDropdown = ref<boolean>(false);
const showRegisterDropdown = ref<boolean>(false);
</script>