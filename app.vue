<script setup>
import Navbar from './components/Navbar.vue'
import CoursePageNavbar from './components/CoursePageNavbar.vue'
import CoursePageSidebar from './components/CoursePageSidebar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isCoursePage = computed(() => route.meta.coursePage === true)
</script>

<template lang="pug">
.page-wrapper.flex.flex-col.min-h-screen.bg-white

  component(v-bind:is="isCoursePage ? CoursePageNavbar : Navbar")

  .course-header-section.px-10.pt-8.pb-4(v-if="isCoursePage")
    h1.text-4xl.font-bold.text-customBlue.mb-2 Welcome back, John!
    p.text-xl.text-gray-600.font-medium | Canyon Creek Elementary School

  .main-layout.flex.flex-1
    component(v-if="isCoursePage" :is="CoursePageSidebar")
    .content-area.flex-1
      NuxtPage

  component(v-if="!isCoursePage" :is="Footer")
</template>