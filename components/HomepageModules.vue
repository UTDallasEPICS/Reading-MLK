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
  div(class = "text-center")
    h1 Homepage Modules
    div(class="mb-5")
      button(class = " mt-0 mb-2.5 pt-2.5 pb-5 text-4 cursor-pointer" @click="showModule('home')") Home
      button(class = " mt-0 mb-2.5 pt-2.5 pb-5 text-4 cursor-pointer" @click="showModule('about')") About Us
      button(class = " mt-0 mb-2.5 pt-2.5 pb-5 text-4 cursor-pointer" @click="showModule('login')") Login
      button( class = " mt-0 mb-2.5 pt-2.5 pb-5 text-4 cursor-pointer" @click="showModule('logout')") Logout

    div(v-if="activeModule === 'home'")
      Home
    div(v-if="activeModule === 'about'")
      About
    div(v-if="activeModule === 'login'")
      Login
    div(v-if="activeModule === 'logout'")
      Logout
</template>
  