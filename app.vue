
<script setup>
//import ButtonCompoent from './components/buttonComponent.vue';
import Navbar from './components/Navbar.vue'
import CoursePageNavbar from './components/CoursePageNavbar.vue'
import {useRoute } from 'vue-router'
import { computed } from 'vue'


const route = useRoute() 
const isCoursePage = computed(() => route.meta.coursePage == true)

</script>
<template lang="pug">
component(v-bind:is="isCoursePage ? CoursePageNavbar : Navbar")

NuxtPage
Footer
</template>