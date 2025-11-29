<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '~/components/Navbar.vue'
import CoursePageNavbar from '~/components/CoursePageNavbar.vue'
import CoursePageSidebar from '~/components/CoursePageSidebar.vue'
import Footer from '~/components/Footer.vue'

const route = useRoute()
const { getSession } = useAuth()

const isCoursePage = computed(() => route.path.startsWith('/course_pages/'))
const user = ref(null)

onMounted(async () => {
  try {
    const session = await getSession()
    const userData = session?.data?.user || session?.user
    user.value = userData || null
  } catch (error) {
    console.error('Error loading user session:', error)
  }
})

// Get user's display name (email username or full email)
const userDisplayName = computed(() => {
  if (!user.value?.email) return 'Guest'
  const emailName = user.value.email.split('@')[0]
  return emailName.charAt(0).toUpperCase() + emailName.slice(1)
})
</script>

<template lang="pug">
.page-wrapper.flex.flex-col.min-h-screen.bg-white
  //if its a coursepage use the coursepage navbar otherwise just use the normal one
  component(:is="isCoursePage ? CoursePageNavbar : Navbar")

  //header for course pages
  .course-header-section.px-10.pt-8.pb-4(v-if="isCoursePage")
    h1.text-4xl.font-bold.text-customBlue.mb-2 Welcome back, {{ userDisplayName }}!
    p.text-xl.text-gray-600.font-medium(v-if="user?.email") {{ user.email }}
    p.text-xl.text-gray-600.font-medium(v-else) Canyon Creek Elementary School

  //add sidebar for course pages
  .main-layout.flex.flex-1
    component(v-if="isCoursePage" :is="CoursePageSidebar")
    .content-area.flex-1
      NuxtPage

  //if non course page, show footer
  component(v-if="!isCoursePage" :is="Footer")
</template>
