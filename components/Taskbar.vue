<template>
  <header class="taskbar">
    <div class="taskbar-container">
      <div class="log">
        <a id="homebtn" href="">Home</a>
      </div>
      <div class="main">
        <div class="dropdown">
          <button class="dropbtn">Register</button>
          <div class="dropdown-content">
            <nuxt-link to="/facultyform" class="taskbar-item">Faculty</nuxt-link>
            <nuxt-link to="/parentform" class="taskbar-item">Parent</nuxt-link>
          </div>
        </div>

        <div class="dropdown">
          <button class="dropbtn">View</button>
          <div class="dropdown-content">
            <nuxt-link to="/viewfaculty" class="taskbar-item">Faculty</nuxt-link>
            <nuxt-link to="/viewparents" class="taskbar-item">Parent</nuxt-link>
          </div>
        </div>
      </div>
      <div class="log">
        <a id="logoutbtn" href="/api/logout" @click="logout">Logout</a>
      </div>
    </div>

  </header>
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

<!-- <style scoped>
.taskbar {
  display: flex;
  background-color: #122C4F;
  color: #ffffff;
  padding: 10px 20px;
  position: relative;
  justify-content: space-between;
}


.left img {
  width: auto;
  /* Adjust the image size as needed */
  height: 60px;
}

.right a {
  color: #ffff;
  /* Set button text color to dark */
  margin-left: 20px;
  text-decoration: none;
}

.navPage {
  color: white;
  text-decoration: none;
}

.navPage:hover {
  font-weight: bold;
}

.off-screen-menu {
  background-color: #ffff;
  height: 150px;
  border-radius: 20px;
  width: 200px;
  max-width: 450px;
  position: absolute;
  top: 50px;
  right: -450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: medium;
  transition: .3s ease;
}

.off-screen-menu.active {
  background-color: #122C4F;
  right: 0;
}

.ham-menu {
  height: 50px;
  width: 40px;
  /* border-radius: 20px; */
  /* width was 1150 puts it to left  */
  margin-left: auto;
  margin-right: 0;
  position: relative;
}

.ham-menu span {
  height: 5px;
  width: 40px;
  background-color: white;
  border-radius: 25px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: .3s ease;
}

.ham-menu span:nth-child(1) {
  top: 25%;
}

.ham-menu span:nth-child(3) {
  top: 75%;
}

.ham-menu.active span {
  background-color: white;
}

.ham-menu.active span:nth-child(1) {
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.ham-menu.active span:nth-child(2) {
  opacity: 0;
}

.ham-menu.active span:nth-child(3) {
  top: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style> -->

<!-- <script>
export default {
  mounted() {
    const hamMenu = document.querySelector(".ham-menu");
    const offScreenMenu = document.querySelector(".off-screen-menu");
    hamMenu.addEventListener('click', () => {
      hamMenu.classList.toggle('active');
      offScreenMenu.classList.toggle('active');
    });
  }
};
</script> -->