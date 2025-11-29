<script setup>
const { getSession } = useAuth()
const router = useRouter()
const status = ref('verifying') // 'verifying', 'success', 'error'
const errorMessage = ref('')

onMounted(async () => {
  try {
    // The magic link verification is handled automatically by BetterAuth
    // when the user clicks the link. The token is in the URL query params.
    
    // Wait a moment for the auth state to update
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Check if user is authenticated
    const session = await getSession()
    
    if (session?.user) {
      status.value = 'success'
      // Redirect to home or dashboard after a short delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      status.value = 'error'
      errorMessage.value = 'Unable to verify your magic link. It may have expired.'
    }
  } catch (error) {
    console.error('Verification error:', error)
    status.value = 'error'
    errorMessage.value = error.message || 'Something went wrong during verification.'
  }
})
</script>

<template lang="pug">
.verify-container(class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-customBlue to-lighterBlue")
  .verify-card(class="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-slideIn")
    
    // Verifying State
    .verifying-state(v-if="status === 'verifying'" class="flex flex-col items-center")
      .spinner-container(class="mb-6")
        i(class="fa fa-spinner fa-spin text-6xl text-customBlue")
      h2(class="text-2xl font-bold text-gray-800 mb-2 text-center") Verifying Your Magic Link
      p(class="text-gray-600 text-center") Please wait while we log you in...
      
    // Success State
    .success-state(v-else-if="status === 'success'" class="flex flex-col items-center")
      .icon-container(class="mb-6")
        i(class="fa fa-check-circle text-6xl text-green-500 animate-bounce")
      h2(class="text-2xl font-bold text-gray-800 mb-2 text-center") Welcome!
      p(class="text-gray-600 text-center mb-4") You've been successfully signed in.
      p(class="text-sm text-gray-500 text-center") Redirecting you to the homepage...
      
    // Error State
    .error-state(v-else-if="status === 'error'" class="flex flex-col items-center")
      .icon-container(class="mb-6")
        i(class="fa fa-exclamation-triangle text-6xl text-red-500")
      h2(class="text-2xl font-bold text-gray-800 mb-2 text-center") Verification Failed
      p(class="text-gray-600 text-center mb-6") {{ errorMessage }}
      
      // Action Buttons
      .button-group(class="flex flex-col space-y-3 w-full")
        router-link(
          to="/login"
          class="px-6 py-3 bg-customBlue text-white font-bold rounded-lg text-center shadow-md hover:bg-lighterBlue transition-all"
        )
          i(class="fa fa-redo mr-2")
          | Try Again
        router-link(
          to="/"
          class="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg text-center shadow-md hover:bg-gray-400 transition-all"
        )
          i(class="fa fa-home mr-2")
          | Go Home

</template>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.4s ease-out;
}
</style>

