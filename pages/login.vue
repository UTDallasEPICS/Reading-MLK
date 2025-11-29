<script setup>
const { signInWithMagicLink } = useAuth()

const email = ref('')
const isLoading = ref(false)
const message = ref('')
const messageType = ref('') // 'success' or 'error'
const mode = ref('signin') // 'signin' or 'signup'

const handleMagicLink = async () => {
  if (!email.value) {
    message.value = 'Please enter your email address'
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  message.value = ''
  
  try {
    await signInWithMagicLink(email.value, '/auth/success')
    
    message.value = 'Check your email! We sent you a magic link to sign in.'
    messageType.value = 'success'
    email.value = ''
  } catch (error) {
    console.error('Magic link error:', error)
    message.value = error.message || 'Something went wrong. Please try again.'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

const toggleMode = () => {
  mode.value = mode.value === 'signin' ? 'signup' : 'signin'
  message.value = ''
}
</script>

<template lang="pug">
.login-container(class="flex flex-col items-center justify-center min-h-screen bg-white overflow-y-auto")
  // Background Section with Image
  .section-container(class="relative w-full h-[300px]")
    // Background Image
    img(class="absolute inset-0 w-full h-full object-cover" src="/children_playing.jpg" alt="Background")
    
    // Page Header
    .page-header(class="absolute inset-0 flex items-end justify-center mb-9")
      h1(class="text-6xl font-bold text-white uppercase tracking-wide") {{ mode === 'signin' ? 'Welcome Back' : 'Join Us' }}

  // Main Content
  .content-wrapper(class="flex flex-col items-center w-full py-12 px-6 animate-fadeIn")
    // Login Card
    .login-card(class="relative flex flex-col items-center bg-white rounded-lg shadow-2xl border-4 border-customBlue p-8 w-full max-w-md animate-slideDown")
      // Logo or Icon
      .icon-container(class="mb-6")
        i(class="fa fa-envelope-open-text text-6xl text-customBlue")
      
      // Title
      h2(class="text-3xl font-bold text-gray-800 uppercase mb-2 tracking-wide text-center") {{ mode === 'signin' ? 'Sign In' : 'Create Account' }}
      p(class="text-gray-600 text-center mb-6") 
        | {{ mode === 'signin' ? 'Enter your email to receive a magic link' : 'Sign up with just your email - no password needed!' }}

      // Message Display
      .message-container(v-if="message" class="w-full mb-4 p-4 rounded-lg" :class="messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'")
        .flex(class="items-start")
          i(class="fa mr-2 mt-1" :class="messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'")
          p(class="text-sm") {{ message }}

      // Email Form
      form(@submit.prevent="handleMagicLink" class="flex flex-col w-full space-y-6")
        // Email Input
        .input-group(class="relative")
          label(for="email" class="block text-sm font-semibold text-gray-700 mb-2") Email Address
          .input-wrapper(class="relative")
            i(class="fa fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400")
            input(
              id="email"
              v-model="email"
              type="email"
              placeholder="your@email.com"
              :disabled="isLoading"
              class="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-customBlue focus:ring-2 focus:ring-customBlue/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            )

        // Submit Button
        button(
          type="submit"
          :disabled="isLoading"
          class="w-full px-6 py-4 bg-customBlue text-white font-bold rounded-lg shadow-md hover:bg-lighterBlue hover:shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        )
          span(v-if="!isLoading") 
            i(class="fa fa-paper-plane mr-2")
            | Send Magic Link
          span(v-else class="flex items-center")
            i(class="fa fa-spinner fa-spin mr-2")
            | Sending...

      // Divider
      .divider(class="w-full my-6 flex items-center")
        .line(class="flex-1 h-px bg-gray-300")
        span(class="px-4 text-gray-500 text-sm") OR
        .line(class="flex-1 h-px bg-gray-300")

      // Toggle Mode
      .toggle-mode(class="text-center")
        p(class="text-gray-600")
          | {{ mode === 'signin' ? "Don't have an account?" : "Already have an account?" }}
          button(
            @click="toggleMode"
            type="button"
            class="ml-2 text-customBlue font-bold hover:text-lighterBlue transition-colors"
          ) {{ mode === 'signin' ? 'Sign Up' : 'Sign In' }}

      // Back to Home
      .back-home(class="mt-6")
        router-link(
          to="/"
          class="flex items-center justify-center text-gray-600 hover:text-customBlue transition-colors"
        )
          i(class="fa fa-arrow-left mr-2")
          | Back to Home

    // Info Section
    .info-section(class="mt-8 max-w-2xl text-center")
      h3(class="text-2xl font-bold text-gray-800 mb-4") What are Magic Links?
      .info-grid(class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6")
        .info-item(class="flex flex-col items-center p-4 bg-lighterBlue/10 rounded-lg")
          i(class="fa fa-shield-alt text-3xl text-customBlue mb-3")
          h4(class="font-semibold text-gray-800 mb-2") Secure
          p(class="text-sm text-gray-600") No passwords to remember or worry about
        
        .info-item(class="flex flex-col items-center p-4 bg-[#C2963A]/10 rounded-lg")
          i(class="fa fa-bolt text-3xl text-[#C2963A] mb-3")
          h4(class="font-semibold text-gray-800 mb-2") Fast
          p(class="text-sm text-gray-600") Sign in with just one click from your email
        
        .info-item(class="flex flex-col items-center p-4 bg-lighterBlue/10 rounded-lg")
          i(class="fa fa-check-circle text-3xl text-customBlue mb-3")
          h4(class="font-semibold text-gray-800 mb-2") Simple
          p(class="text-sm text-gray-600") Enter your email and we'll handle the rest

</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-in-out;
}

.animate-slideDown {
  animation: slideDown 0.5s ease-out;
}
</style>

