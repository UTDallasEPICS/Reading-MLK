<template lang="pug">
  header.taskbar
    .taskbar-container
      .log
        nuxt-link#homebtn(to="/") Home
      .main
        .dropdown
          button.dropbtn Register
          .dropdown-content
            nuxt-link.taskbar-item(to="/facultyform") Faculty
            nuxt-link.taskbar-item(to="/parentform") Parent
        .dropdown
          button.dropbtn View
          .dropdown-content
            nuxt-link.taskbar-item(to="/viewfaculty") Faculty
            nuxt-link.taskbar-item(to="/viewparents") Parent
      .log
        a#logoutbtn(href="/api/logout" @click="logout") Logout
</template>

<script setup>
const props = defineProps(['userRole']);
</script>

<style scoped>
.taskbar-container {
  background-color: #122C4F;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  height: 60px;
}

.dropdown {
  position: relative;
  display: inline-block;
  gap: 15px;
}

.dropbtn {
  background-color: #122C4F;
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropbtn:hover, #logoutbtn:hover, #homebtn:hover {
  font-size: 20px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content .taskbar-item {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content .taskbar-item:hover {
  background-color: #ddd;
}

.log-container {
  display: flex;
  flex-direction: row;
  gap: 15px;
}

#logoutbtn,
#loginbtn,
#homebtn {
  color: white;
  text-decoration: none;
  font-family: Arial;
  font-size: 16px;
}
</style>