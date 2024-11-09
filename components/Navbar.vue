<template lang="pug">
  header.navbar
    .navbar-container(style="background-color: #122C4F; display: flex; justify-content: center; align-items: center; gap: 15px; height: 60px;")
      .log
        nuxt-link#homebtn(
          to="/"
          :style="{ color: 'white', textDecoration: 'none', fontFamily: 'Arial', fontSize: homeFontSize, transition: 'font-size 0.3s ease' }"
          @mouseover="homeFontSize = '20px'"
          @mouseleave="homeFontSize = '16px'"
        ) Home
      .log
        nuxt-link#aboutbtn(
          to="/"
          :style="{ color: 'white', textDecoration: 'none', fontFamily: 'Arial', fontSize: aboutFontSize, transition: 'font-size 0.3s ease' }"
          @mouseover="aboutFontSize = '20px'"
          @mouseleave="aboutFontSize = '16px'"
        ) About Us

      .main
        .dropdown(style="position: relative; display: inline-block; gap: 15px;")
          button.dropbtn(
            :style="{ backgroundColor: '#122C4F', color: 'white', padding: '10px', fontSize: registerFontSize, border: 'none', cursor: 'pointer', transition: 'font-size 0.3s ease' }"
            @mouseover="registerFontSize = '20px'"
            @mouseleave="registerFontSize = '16px'"
            @click="showRegisterDropdown = !showRegisterDropdown"
          ) Register

          .dropdown-content(:style="{ display: showRegisterDropdown ? 'block' : 'none', position: 'absolute', backgroundColor: '#f9f9f9', minWidth: '160px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)', zIndex: '1' }"
            @mouseleave="showRegisterDropdown=!showRegisterDropdown")
            nuxt-link.navbar-item(to="/facultyform" :style="{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block', backgroundColor: registerFacultyBackground, transition: 'background-color 0.3s ease'}"
            @mouseover="registerFacultyBackground = '#ddd'"
            @mouseleave="registerFacultyBackground = none") Faculty
            nuxt-link.navbar-item(to="/parentform" :style="{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block', backgroundColor: registerParentBackground, transition: 'background-color 0.3s ease'}"
            @mouseover="registerParentBackground = '#ddd'"
            @mouseleave="registerParentBackground = none") Parent

        .dropdown(style="position: relative; display: inline-block; gap: 15px;")
          button.dropbtn(
            :style="{ backgroundColor: '#122C4F', color: 'white', padding: '10px', fontSize: viewFontSize, border: 'none', cursor: 'pointer', transition: 'font-size 0.3s ease' }"
            @mouseover="viewFontSize = '20px'"
            @mouseleave="viewFontSize = '16px'"
            @click="showViewDropdown = !showViewDropdown"
          ) View

          .dropdown-content(:style="{ display: showViewDropdown ? 'block' : 'none', position: 'absolute', backgroundColor: '#f9f9f9', minWidth: '160px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)', zIndex: '1' }"
            @mouseleave="showViewDropdown=!showViewDropdown")
            nuxt-link.navbar-item( to="/viewfaculty" :style="{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block', backgroundColor: viewFacultyBackground, transition: 'background-color 0.3s ease'}"
            @mouseover="viewFacultyBackground = '#ddd'"
            @mouseleave="viewFacultyBackground = none") Faculty
            nuxt-link.navbar-item(to="/viewparents" :style="{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block', backgroundColor: viewParentBackground, transition: 'background-color 0.3s ease'}"
            @mouseover="viewParentBackground = '#ddd'"
            @mouseleave="viewParentBackground = none") Parent
            
      .log
        a#logoutbtn(
          href="/api/logout"
          @click="logout"
          :style="{ color: 'white', textDecoration: 'none', fontFamily: 'Arial', fontSize: logoutFontSize, transition: 'font-size 0.3s ease' }"
          @mouseover="logoutFontSize = '20px'"
          @mouseleave="logoutFontSize = '16px'"
        ) Logout
</template>

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