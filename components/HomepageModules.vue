<script lang="ts">
import { defineComponent } from 'vue';
import Home from './Home.vue';
import About from './About.vue';
import Login from './Login.vue';
import Logout from './Logout.vue';

export default defineComponent({
  name: 'HomePageModules',
  components: {
    Home,
    About,
    Login,
    Logout
  },
  data() {
    return {
      activeModule: '' as string
    };
  },
  methods: {
    showModule(module: string) {
      this.activeModule = module;
    }
  }
});
</script>


<template lang="pug">
  div.homepage-modules
    h1 Homepage Modules
    div.module-buttons
      button(@click="showModule('home')") Home
      button(@click="showModule('about')") About Us
      button(@click="showModule('login')") Login
      button(@click="showModule('logout')") Logout

    div(v-if="activeModule === 'home'")
      Home
    div(v-if="activeModule === 'about'")
      About
    div(v-if="activeModule === 'login'")
      Login
    div(v-if="activeModule === 'logout'")
      Logout
</template>

  
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
  