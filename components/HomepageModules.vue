<template>
    <div class="homepage-modules">
      <h1>Homepage Modules</h1>
      <div class="module-buttons">
        <button @click="showModule('home')">Home</button>
        <button @click="showModule('about')">About Us</button>
        <button @click="showModule('login')">Login</button>
        <button @click="showModule('logout')">Logout</button>
      </div>
      
      <div v-if="activeModule === 'home'">
        <Home />
      </div>
      <div v-if="activeModule === 'about'">
        <AboutUs />
      </div>
      <div v-if="activeModule === 'login'">
        <Login />
      </div>
      <div v-if="activeModule === 'logout'">
        <Logout />
      </div>
    </div>
  </template>
  
  <script>
  import Home from './Home.vue';
  import AboutUs from './AboutUs.vue';
  import Login from './Login.vue';
  import Logout from './Logout.vue';
  
  export default {
    name: 'HomePageModules',
    components: {
      Home,
      AboutUs,
      Login,
      Logout
    },
    data() {
      return {
        activeModule: ''
      };
    },
    methods: {
      showModule(module) {
        this.activeModule = module;
      }
    }
  };
  </script>
  
  <style scoped>
  .homepage-modules {
    text-align: center;
  }
  
  .module-buttons {
    margin-bottom: 20px;
  }
  
  .module-buttons button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  