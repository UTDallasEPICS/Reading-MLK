<!-- <template lang="pug">
  header.navbar
    .navbar-container(class="bg-customBlue flex justify-center items-center gap-6 md:gap-10 py-4")
      .log
      nuxt-link#homebtn(
        to="/"
        class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
      ) Home
      .log
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

      .log
        a#logoutbtn(
          href="/api/logout"
          @click="logout"
          class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
        ) Logout
</template> -->

<!-- <template lang="pug">
  header.navbar
    .navbar-container(
      class="bg-customBlue flex justify-center items-center gap-6 md:gap-10 py-4 rounded-full shadow-lg mx-auto max-w-7xl relative"
    )
      .log
      nuxt-link#homebtn(
        to="/"
        class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
      ) Home
      .log
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

      .log
        a#logoutbtn(
          href="/api/logout"
          @click="logout"
          class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
        ) Logout
</template> -->

<!-- <template lang="pug">
  header.navbar
    .navbar-container(
      class="bg-customBlue flex justify-center items-center gap-6 md:gap-10 py-4 rounded-full shadow-lg mx-auto max-w-7xl relative fixed top-0 left-0 right-0 z-50"
    )
      .log
      nuxt-link#homebtn(
        to="/"
        class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
      ) Home
      .log
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

      .log
        a#logoutbtn(
          href="/api/logout"
          @click="logout"
          class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
        ) Logout
</template> -->


<template lang="pug">
  header.navbar
    .navbar-container(
      class="bg-customBlue flex justify-center items-center gap-6 md:gap-10 py-4 shadow-lg mx-auto max-w-full fixed top-0 left-0 right-0 z-50"
    )
      .log
      nuxt-link#homebtn(
        to="/"
        class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
      ) Home
      .log
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

      .log
        a#logoutbtn(
          href="/api/logout"
          @click="logout"
          class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
        ) Logout
</template>

<style scoped>
  body {
    margin-top: 80px; /* Adjust according to the height of the navbar */
  }
</style>



<script setup>
const props = defineProps(['userRole']);
const viewFontSize = ref('16px');
const registerFontSize = ref('16px');
const homeFontSize = ref('16px');
const aboutFontSize = ref('16px');
const logoutFontSize = ref('16px');

const showViewDropdown = ref(false);
const showRegisterDropdown = ref(false);

const viewFacultyBackground = ref('white');
const viewParentBackground = ref('white');

const registerFacultyBackground = ref('white');
const registerParentBackground = ref('white');

</script>