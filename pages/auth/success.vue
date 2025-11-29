<script setup>
const router = useRouter()
const { getSession } = useAuth()

const status = ref('loading')
const user = ref(null)

onMounted(async () => {
  console.log('Success page mounted, checking session...')
  
  // Give BetterAuth more time to set the session cookie
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  try {
    console.log('Attempting to get session...')
    const session = await getSession()
    console.log('Session result:', session)
    
    // BetterAuth returns session as { data: { user, session }, error }
    const userData = session?.data?.user || session?.user
    
    if (userData) {
      console.log('User found:', userData)
      status.value = 'success'
      user.value = userData
      
      // Redirect to home after showing success message
      setTimeout(() => {
        console.log('Redirecting to home...')
        router.push('/')
      }, 2000)
    } else {
      console.warn('No session found, redirecting to login...')
      console.warn('Session structure:', JSON.stringify(session, null, 2))
      // If no session, redirect to login
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    }
  } catch (error) {
    console.error('Session check error:', error)
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }
})
</script>

<template lang="pug">
.success-container(class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-customBlue to-lighterBlue")
  .success-card(class="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-slideIn text-center")
    
    .icon-container(class="mb-6")
      i(class="fa fa-check-circle text-7xl text-green-500 animate-bounce")
    
    h1(class="text-3xl font-bold text-gray-800 mb-4") Success!
    
    p(v-if="user" class="text-lg text-gray-600 mb-2") Welcome back, {{ user.email }}!
    p(v-else class="text-lg text-gray-600 mb-2") You've been successfully authenticated.
    
    p(class="text-sm text-gray-500") Redirecting you to the homepage...
    
    .spinner-small(class="mt-6")
      i(class="fa fa-spinner fa-spin text-2xl text-customBlue")

</template>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.5s ease-out;
}
</style>

