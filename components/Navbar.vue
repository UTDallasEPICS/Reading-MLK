<template lang="pug">
  header.navbar(class="flex bg-lighterBlue")
    .img-container(class="w-fit")
      img(
              src="/image.png" 
              alt="Company Logo"
              class="h-20 object-contain"
            )
    .navbar-container(
      class="flex justify-center items-center gap-6 md:gap-10 py-4 mx-auto max-w-full"
    )
      nuxt-link#homebtn(
        to="/"
        class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
      ) Home

      nuxt-link#aboutbtn(
        to="/about"
        class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
      ) About Us

      // Register dropdown (only show when authenticated)
      .dropdown.relative.inline-block.gap-4(
        v-if="isAuthenticated"
        onmouseenter="this.querySelector('.dropdown-content').style.display = 'block'"
        onmouseleave="this.querySelector('.dropdown-content').style.display = 'none'"
      )
        button.dropbtn(
          class="text-white font-bold py-2 px-4 lg:px-6 text-base lg:text-lg border-none cursor-pointer"
        ) Register

        .dropdown-content.hidden.absolute.bg-white.min-w-40.shadow-lg.z-10.rounded-md
          nuxt-link.navbar-item(
            to="/newuser"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Invite User
          nuxt-link.navbar-item(
            to="/facultyform"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Faculty
          nuxt-link.navbar-item(
            to="/parentform"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Parent

      // View dropdown (only show when authenticated)
      .dropdown.relative.inline-block.gap-4(
        v-if="isAuthenticated"
        onmouseenter="this.querySelector('.dropdown-content').style.display = 'block'"
        onmouseleave="this.querySelector('.dropdown-content').style.display = 'none'"
      )
        button.dropbtn(
          class="text-white font-bold py-2 px-4 lg:px-6 text-base lg:text-lg border-none cursor-pointer"
        ) View

        .dropdown-content.hidden.absolute.bg-white.min-w-40.shadow-lg.z-10.rounded-md
          nuxt-link.navbar-item(
            to="/viewfaculty"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Faculty
          nuxt-link.navbar-item(
            to="/viewparents"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Parent
          nuxt-link.navbar-item(
            to="/viewassignments"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Assignments
          nuxt-link.navbar-item(
            to="/viewstudents"
            class="text-black py-3 px-4 no-underline block hover:bg-gray-200 rounded-md"
          ) Students
      
      // User info and auth buttons
      .auth-section(class="ml-auto flex items-center gap-4")
        // Show user info with link to profile when authenticated
        nuxt-link(
          v-if="isAuthenticated && user"
          to="/profile"
          class="flex items-center gap-2 hover:opacity-80 transition-opacity"
        )
          i(class="fa fa-user-circle text-white text-2xl")
          span(class="text-white text-sm") {{ user.email }}
        
        // Login button (show when not authenticated)
        nuxt-link(
          v-if="!isAuthenticated"
          to="/login"
          class="text-white font-bold no-underline font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center"
        )
          i(class="fa fa-sign-in-alt mr-2")
          | Login
        
        // Logout button (show when authenticated)
        button(
          v-else
          @click="handleLogout"
          class="text-white font-bold font-sans text-base lg:text-lg px-2 lg:px-4 hover:scale-110 transform transition-all duration-700 inline-flex items-center justify-center bg-transparent border-none cursor-pointer"
        )
          i(class="fa fa-sign-out-alt mr-2")
          | Logout
</template>

<script lang="ts" setup>
const props = defineProps<{ userRole?: string }>(); 

const { getSession, signOut } = useAuth()
const router = useRouter()

const isAuthenticated = ref(false)
const user = ref(null)

// Check authentication status on mount
onMounted(async () => {
  await checkAuth()
})

const checkAuth = async () => {
  try {
    const session = await getSession()
    const userData = session?.data?.user || session?.user
    isAuthenticated.value = !!userData
    user.value = userData || null
  } catch (error) {
    console.error('Error checking auth:', error)
    isAuthenticated.value = false
    user.value = null
  }
}

const handleLogout = async () => {
  try {
    await signOut()
    isAuthenticated.value = false
    user.value = null
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>