/**
 * Notes for the person who works on Registration next:
 * 
 * email code has been set up but not connected to this page- using placeholders for now
 */



<template lang="pug">
  .centered-container.flex.justify-center.items-center.my-10
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
        // Header section
        .form-header.text-center.bg-customBlue.p-6.rounded-t-lg.text-gray-100
          h2.text-4xl.font-medium.uppercase.tracking-wider New User Sign Up
          .heading-line.w-32.h-1.bg-green-400.my-2.mx-auto.rounded-sm
        .info-box.bg-gray-100.border.border-gray-300.rounded-lg.p-4.mb-6
          h1.text-2xl.font-semibold.text-gray-800.text-center Please type in your email, and hit the "Send" button. Check your email for a code from readinghuddle@gmail.com, and type in the code below to register your account.
        
        // Form fields
        .form-input.grid.gap-6.p-8.bg-white.rounded-b-lg
          // Email Field
          .form-element.flex.flex-col
            label(for="email" class="text-lg font-semibold text-gray-800 mb-2 text-center" required) My Email
            input#email(
              type="email" 
              placeholder="Type your email address here." 
              required 
              class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
              v-model="data_UserProfile.email"
              :disabled="showCode"
            )
          
          // Send Code Button
          .button-container(class="flex justify-center mt-5")
            button(
              type="button"
              class="submit-button px-5 py-2.5 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-[#1a1a2e] disabled:opacity-50 disabled:cursor-not-allowed"
              @click="sendEmail"
              :disabled="!data_UserProfile.email || isLoading || showCode"
            ) {{ isLoading ? 'Sending...' : (showCode ? 'Code Sent' : 'Send') }}
          
          // Success message when code is sent
          .success-message(v-if="showCode && !isVerified" class="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg text-green-700 text-center")
            p ✓ Verification code sent to {{ data_UserProfile.email }}
            p.text-sm.mt-1 For demo purposes, use code: <strong>123456</strong>
          
          transition(name="slide-down")
            .additional-content(v-if="showCode" class="mt-8 pt-8 border-t border-gray-200")
              .form-element.flex.flex-col.mb-4
                label(class="text-lg font-semibold text-gray-800 mb-2 text-center") Verification Code
                .div(class="flex justify-center gap-2")
                  input(
                    v-for="(digit, index) in verificationCode"
                    :key="index"
                    type="text"
                    maxlength="1"
                    class="w-12 h-12 text-center text-lg border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                    v-model="verificationCode[index]"
                    @input="handleCodeInput(index, $event)"
                    @keydown="handleKeyDown(index, $event)"
                    :ref="el => setCodeInputRef(el, index)"
                  )
              
              // Error message for wrong code
              .error-message(v-if="codeError" class="mt-2 p-2 bg-red-100 border border-red-400 rounded text-red-700 text-center")
                | {{ codeError }}
              
              .button-container(class="flex justify-center mt-5")
                button(
                  class="submit-button px-5 py-2.5 bg-green-600 text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="verifyCode"
                  :disabled="isVerifying || verificationCode.join('').length !== 6"
                ) {{ isVerifying ? 'Verifying...' : 'Verify & Continue' }}
</template>

<script setup lang="ts">
const router = useRouter()
const rhuser = useCookie<any>('rhuser')

// Define the form data
const data_UserProfile = ref({
  user_name: "",
  first_name: "",
  last_name: "",
  preferred_name: "",
  email: "",
  role: "Parent",
})

// Define reactive variables
const showCode = ref(false)
const isLoading = ref(false)
const isVerifying = ref(false)
const isVerified = ref(false)
const codeError = ref('')

// Verification code as array of 6 digits
const verificationCode = ref(['', '', '', '', '', ''])

// Mock verification code
const MOCK_VERIFICATION_CODE = '123456'

const codeInputRefs = ref<(HTMLInputElement | null)[]>([])
const setCodeInputRef = (el: HTMLInputElement | null, index: number) => {
  codeInputRefs.value[index] = el
}

// Function to handle sending email
const sendEmail = async () => {
  // Validate email
  if (!data_UserProfile.value.email) {
    alert("Please enter your email address.")
    return
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data_UserProfile.value.email)) {
    alert("Please enter a valid email address.")
    return
  }

  isLoading.value = true
  codeError.value = ''

  try {

    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
    
    console.log(`Mock: Sending verification code to ${data_UserProfile.value.email}`)
    console.log(`Mock verification code: ${MOCK_VERIFICATION_CODE}`)
    
    // Show the verification code input
    showCode.value = true
    
    // Focus on first code input after a short delay
    await nextTick()
    setTimeout(() => {
      if (codeInputRefs.value[0]) {
        codeInputRefs.value[0].focus()
      }
    }, 100)
    
  } catch (error) {
    console.error('Error sending email:', error)
    alert('There was an error sending the verification code. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Handle input in verification code fields
const handleCodeInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^0-9]/g, '') // Only allow numbers
  
  verificationCode.value[index] = value
  
  // Auto-focus next input
  if (value && index < 5) {
    const nextInput = codeInputRefs.value[index + 1]
    if (nextInput) {
      nextInput.focus()
    }
  }
  
  // Clear error when user starts typing
  if (codeError.value) {
    codeError.value = ''
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    const prevInput = codeInputRefs.value[index - 1]
    if (prevInput) {
      prevInput.focus()
    }
  }
  
  // Handle paste
  if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    // Allow paste to be handled by browser, then process it
    setTimeout(() => {
      const pastedValue = (event.target as HTMLInputElement).value
      if (pastedValue.length >= 6) {
        const digits = pastedValue.slice(0, 6).split('')
        for (let i = 0; i < 6; i++) {
          verificationCode.value[i] = digits[i] || ''
        }
      }
    }, 10)
  }
}

// Verify the entered code
const verifyCode = async () => {
  const enteredCode = verificationCode.value.join('')
  
  if (enteredCode.length !== 6) {
    codeError.value = 'Please enter all 6 digits'
    return
  }
  
  isVerifying.value = true
  codeError.value = ''
  
  try {
    // Simulate API call to verify the code
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
    
    if (enteredCode === MOCK_VERIFICATION_CODE) {
      // Verification successful
      isVerified.value = true
      
      // Store email in cookies
      const userEmail = useCookie('userEmail', {
        default: () => '',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      userEmail.value = data_UserProfile.value.email
      
      // Update rhuser cookie if needed
      if (rhuser.value) {
        rhuser.value.email = data_UserProfile.value.email
      } else {
        rhuser.value = { email: data_UserProfile.value.email }
      }
      
      console.log('Email verified and stored in cookie:', data_UserProfile.value.email)
      
      // Navigate to register.vue
      await router.push('/register')
      
    } else {
      // Verification failed
      codeError.value = 'Invalid verification code. Please try again.'
      // Clear the code inputs
      verificationCode.value = ['', '', '', '', '', '']
      // Focus first input
      if (codeInputRefs.value[0]) {
        codeInputRefs.value[0].focus()
      }
    }
    
  } catch (error) {
    console.error('Error verifying code:', error)
    codeError.value = 'There was an error verifying the code. Please try again.'
  } finally {
    isVerifying.value = false
  }
}

// Handle the form submission
const handleSubmit = async () => {
  console.log("handleSubmit called - this shouldn't happen in the new flow")
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>