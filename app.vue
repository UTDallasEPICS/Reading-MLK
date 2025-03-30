
<script setup>
//import ButtonCompoent from './components/buttonComponent.vue';
import Navbar from './components/Navbar.vue'
import CoursePageNavbar from './components/CoursePageNavbar.vue'
import CoursePageSidebar from './components/CoursePageSidebar.vue'

import {useRoute } from 'vue-router'
import { computed } from 'vue'


const route = useRoute() 
const isCoursePage = computed(() => route.meta.coursePage == true)

</script>
<template lang="pug">
component(v-bind:is="isCoursePage ? CoursePageNavbar : Navbar")
component(v-if="isCoursePage" :is="CoursePageSidebar")
NuxtPage
component(v-if="!isCoursePage" :is="Footer")
</template>