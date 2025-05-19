<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '~/components/Navbar.vue'
import CoursePageNavbar from '~/components/CoursePageNavbar.vue'
import CoursePageSidebar from '~/components/CoursePageSidebar.vue'
import Footer from '~/components/Footer.vue'

const route = useRoute()

const isCoursePage = computed(() => route.path.startsWith('/course_pages/'))
</script>

<template lang="pug">
.page-wrapper.flex.flex-col.min-h-screen.bg-white
  //if its a coursepage use the coursepage navbar otherwise just use the normal one
  component(:is="isCoursePage ? CoursePageNavbar : Navbar")

  //header for course pages
  .course-header-section.px-10.pt-8.pb-4(v-if="isCoursePage")
    h1.text-4xl.font-bold.text-customBlue.mb-2 Welcome back, John!
    p.text-xl.text-gray-600.font-medium Canyon Creek Elementary School

  //add sidebar for course pages
  .main-layout.flex.flex-1
    component(v-if="isCoursePage" :is="CoursePageSidebar")
    .content-area.flex-1
      NuxtPage

  //if non course page, show footer
  component(v-if="!isCoursePage" :is="Footer")
</template>
