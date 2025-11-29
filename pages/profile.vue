<script setup>
const { getSession, signOut } = useAuth()
const router = useRouter()

const user = ref(null)
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  await loadUserProfile()
})

const loadUserProfile = async () => {
  try {
    isLoading.value = true
    const session = await getSession()
    const userData = session?.data?.user || session?.user
    
    if (!userData) {
      router.push('/login')
      return
    }
    
    user.value = userData
  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = 'Failed to load your profile'
  } finally {
    isLoading.value = false
  }
}

const handleLogout = async () => {
  try {
    await signOut()
    router.push('/login')
  } catch (err) {
    console.error('Logout error:', err)
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template lang="pug">
.profile-container(class="flex flex-col items-center min-h-screen bg-gray-50 py-12 px-6")
  
  // Loading State
  .loading-container(v-if="isLoading" class="flex flex-col items-center justify-center min-h-[50vh]")
    i(class="fa fa-spinner fa-spin text-6xl text-customBlue mb-4")
    p(class="text-gray-600 text-lg") Loading your profile...

  // Error State
  .error-container(v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-2xl")
    i(class="fa fa-exclamation-circle mr-2")
    | {{ error }}

  // Profile Content
  .profile-content(v-else-if="user" class="w-full max-w-4xl animate-fadeIn")
    
    // Header Section
    .profile-header(class="relative bg-gradient-to-r from-customBlue to-lighterBlue rounded-t-lg p-8 text-white shadow-lg")
      .header-content(class="flex flex-col md:flex-row items-center justify-between")
        .user-avatar-section(class="flex items-center space-x-6")
          .avatar-circle(class="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg")
            i(class="fa fa-user text-5xl text-white")
          .user-info
            h1(class="text-3xl font-bold mb-2") {{ user.name || 'User Profile' }}
            p(class="text-lg opacity-90 flex items-center")
              i(class="fa fa-envelope mr-2")
              | {{ user.email }}
        
        .header-actions(class="mt-4 md:mt-0")
          button(
            @click="handleLogout"
            class="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all border-2 border-white"
          )
            i(class="fa fa-sign-out-alt mr-2")
            | Logout

    // Profile Details Card
    .profile-details(class="bg-white rounded-b-lg shadow-lg p-8")
      
      h2(class="text-2xl font-bold text-gray-800 mb-6 flex items-center")
        i(class="fa fa-id-card text-customBlue mr-3")
        | Account Information

      .details-grid(class="grid grid-cols-1 md:grid-cols-2 gap-6")
        
        // User ID
        .detail-item(class="flex flex-col p-4 bg-gray-50 rounded-lg")
          .label(class="text-sm font-semibold text-gray-600 mb-1 flex items-center")
            i(class="fa fa-fingerprint mr-2 text-customBlue")
            | User ID
          .value(class="text-lg text-gray-800 font-mono text-sm") {{ user.id }}
        
        // Email
        .detail-item(class="flex flex-col p-4 bg-gray-50 rounded-lg")
          .label(class="text-sm font-semibold text-gray-600 mb-1 flex items-center")
            i(class="fa fa-envelope mr-2 text-customBlue")
            | Email Address
          .value(class="text-lg text-gray-800") {{ user.email }}
        
        // Email Verified
        .detail-item(class="flex flex-col p-4 bg-gray-50 rounded-lg")
          .label(class="text-sm font-semibold text-gray-600 mb-1 flex items-center")
            i(class="fa fa-check-circle mr-2 text-customBlue")
            | Email Verification
          .value(class="text-lg flex items-center")
            span(
              v-if="user.emailVerified"
              class="text-green-600 font-semibold flex items-center"
            )
              i(class="fa fa-check-circle mr-2")
              | Verified
            span(
              v-else
              class="text-yellow-600 font-semibold flex items-center"
            )
              i(class="fa fa-exclamation-triangle mr-2")
              | Not Verified
        
        // Account Created
        .detail-item(class="flex flex-col p-4 bg-gray-50 rounded-lg")
          .label(class="text-sm font-semibold text-gray-600 mb-1 flex items-center")
            i(class="fa fa-calendar-plus mr-2 text-customBlue")
            | Account Created
          .value(class="text-lg text-gray-800") {{ formatDate(user.createdAt) }}

      // Quick Actions Section
      .quick-actions(class="mt-8 pt-6 border-t border-gray-200")
        h3(class="text-xl font-bold text-gray-800 mb-4") Quick Actions
        .actions-grid(class="grid grid-cols-1 md:grid-cols-3 gap-4")
          
          router-link(
            to="/course_pages/coursehomepage"
            class="flex items-center justify-center p-4 bg-customBlue text-white rounded-lg shadow hover:shadow-lg hover:bg-lighterBlue transition-all"
          )
            i(class="fa fa-book-reader text-2xl mr-3")
            span(class="font-semibold") My Courses
          
          router-link(
            to="/course_pages/library"
            class="flex items-center justify-center p-4 bg-[#C2963A] text-white rounded-lg shadow hover:shadow-lg hover:bg-[#A17C30] transition-all"
          )
            i(class="fa fa-books text-2xl mr-3")
            span(class="font-semibold") Library
          
          router-link(
            to="/"
            class="flex items-center justify-center p-4 bg-gray-700 text-white rounded-lg shadow hover:shadow-lg hover:bg-gray-600 transition-all"
          )
            i(class="fa fa-home text-2xl mr-3")
            span(class="font-semibold") Home

      // Authentication Info
      .auth-info(class="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200")
        .flex(class="items-start")
          i(class="fa fa-info-circle text-blue-500 text-2xl mr-4 mt-1")
          div
            h4(class="text-lg font-bold text-gray-800 mb-2") About Your Account
            p(class="text-gray-700 leading-relaxed")
              | You're using passwordless authentication with Magic Links. This means you can sign in securely 
              | without remembering a password. Simply request a magic link to your email whenever you need to log in.
            .security-badges(class="flex gap-3 mt-4")
              .badge(class="flex items-center px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm")
                i(class="fa fa-shield-alt text-green-500 mr-2")
                | Secure
              .badge(class="flex items-center px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm")
                i(class="fa fa-lock text-blue-500 mr-2")
                | Encrypted
              .badge(class="flex items-center px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm")
                i(class="fa fa-bolt text-yellow-500 mr-2")
                | Fast Login

</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
</style>

