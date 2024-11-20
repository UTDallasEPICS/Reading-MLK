<template>
  <header class="page-header">
    <div class="left">
    </div>
    <!-- <div class="right flex">
        <div class="right">
          <nuxt-link v-if="userRole === 'staff' || userRole === 'admin'" to="/entry" class="navPage">Student Entry</nuxt-link>
          <nuxt-link to="/database" v-if="userRole === 'staff' || userRole === 'admin'" class="navPage">View Students</nuxt-link>
          <nuxt-link to="/admin" v-if="userRole === 'admin'" class="navPage">Admin</nuxt-link>
        </div>
        <a class="right navPage" href="/api/logout">Logout</a>
      </div> -->
    <!-- hamburger menu code below  -->
    <div class="off-screen-menu">
      <nuxt-link to="/facultyform" class="navPage">Register Faculty Account</nuxt-link>
      <nuxt-link to="/parentform" class="navPage">Register Parent Account</nuxt-link>
      <nuxt-link to="/viewfaculty" class="navPage">View Faculty Accounts</nuxt-link>
      <nuxt-link to="/viewparents" class="navPage">View Parent Accounts</nuxt-link>
      <a class="right navPage" href="/api/logout">Logout</a>
      <a class="right navPage" href="/api/login">Login</a>
      <nuxt-link to="/AboutUs" class="navPage">AboutUs</nuxt-link>
    </div>
    <nav>
      <div class="ham-menu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  </header>
</template>

<script setup>
const props = defineProps(['userRole']);
</script>


<style scoped>
.page-header {
  display: flex;
  background-color: #122C4F;
  /* Set the background to blue */
  color: #ffffff;
  /* Set the text color to white */
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
</style>

<script>
export default {
  mounted() {
    const hamMenu = document.querySelector(".ham-menu");
    const offScreenMenu = document.querySelector(".off-screen-menu");
    hamMenu.addEventListener('click', () => {
      hamMenu.classList.toggle('active');
      offScreenMenu.classList.toggle('active');
    });
    //added below code for it to disappear once clicked, still in progress
    // hamMenu.addEventListener('click', () => {
    //   hamMenu.classList.toggle('active');
    //   offScreenMenu.classList.toggle('active');
    // });
  }
};
</script>