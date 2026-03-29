<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '../utils/auth-client'

const toast = useToast()
const isEmailSent = ref(false)
const view = ref<'landing' | 'login'>('landing')
const loginRole = ref<'admin' | 'reader'>('admin')

const schema = computed(() => {
  if (!isEmailSent.value) {
    return z.object({
      email: z.string().email('Invalid email'),
    })
  } else {
    return z.object({
      email: z.string().email('Invalid email'),
      otp: z.array(z.string()).length(6, 'Must be 6 digits'),
    })
  }
})

const state = reactive({
  email: '',
  otp: [] as string[],
})

function goToLogin(role: 'admin' | 'reader') {
  loginRole.value = role
  view.value = 'login'
}

async function handleSubmit(event: FormSubmitEvent<any>) {
  if (!isEmailSent.value) {
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email: state.email,
      type: 'sign-in',
    })
    if (error) {
      toast.add({ title: 'Error', description: error.message, color: 'error' })
    } else {
      isEmailSent.value = true
      toast.add({ title: 'Success', description: 'OTP sent to your email', color: 'success' })
    }
  } else {
    const { data, error } = await authClient.signIn.emailOtp({
      email: state.email,
      otp: state.otp.join(''),
    })
    if (error) {
      toast.add({ title: 'Error', description: error.message, color: 'error' })
    } else {
      await navigateTo('/', { external: true })
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f8f7f4] font-sans">

    <!-- Shared top gradient bar -->
    <div class="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-amber-400 to-amber-500" />

    <main class="max-w-4xl mx-auto min-h-[calc(100vh-6px)] flex flex-col">

      <!-- ── LANDING VIEW ── -->
      <Transition name="fade" mode="out-in">
        <div
          v-if="view === 'landing'"
          class="flex flex-col items-center justify-center flex-1 py-20 text-center gap-12"
        >
          <!-- Bouncing rocket -->
          <div class="animate-bounce text-8xl select-none">🚀</div>

          <!-- Headline -->
          <div class="space-y-3">
            <h1
              class="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-amber-400 to-amber-500 drop-shadow-sm leading-none pb-1"
            >
              Welcome!
            </h1>
            <p class="text-xl sm:text-2xl font-medium text-gray-400 max-w-xl mx-auto">
              Your school reading adventure starts here.
            </p>
          </div>

          <!-- Role cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl px-4">
            <!-- Admin card -->
            <button
              @click="navigateTo('/admin')"
              class="group bg-white rounded-3xl border-2 border-gray-100 p-10 text-center shadow-sm hover:border-indigo-400 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div
                class="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-5xl mb-5 mx-auto group-hover:rotate-12 transition-transform duration-300 select-none"
              >
                🏫
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Faculty & Admin</h3>
              <p class="text-gray-400 font-medium">Manage students, curriculum & raffles.</p>
            </button>

            <!-- Student card -->
            <button
              @click="navigateTo('/reader')"

              class="group bg-white rounded-3xl border-2 border-gray-100 p-10 text-center shadow-sm hover:border-amber-400 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div
                class="w-20 h-20 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-5xl mb-5 mx-auto group-hover:rotate-12 transition-transform duration-300 select-none"
              >
                ✨
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Reading Buddy</h3>
              <p class="text-gray-400 font-medium">Complete challenges, log books & win prizes!</p>
            </button>
          </div>
        </div>

        <!-- ── LOGIN VIEW ── -->
        <div
          v-else-if="view === 'login'"
          class="flex items-center justify-center flex-1 py-20 px-4"
        >
          <div class="relative bg-white/80 backdrop-blur rounded-3xl border border-gray-100 shadow-xl p-12 w-full max-w-md text-center space-y-8 overflow-hidden">

            <!-- Top accent bar -->
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-amber-400 to-amber-500" />

            <!-- Icon -->
            <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-6xl mx-auto shadow-inner select-none">
              🪄
            </div>

            <!-- Title -->
            <div>
              <h2 class="text-4xl font-black text-gray-900 mb-1">Magic Login</h2>
              <p class="text-gray-400 font-medium">
                {{ isEmailSent ? 'Enter the 6-digit code we sent you.' : 'Enter your email to receive a one-time code.' }}
              </p>
            </div>

            <!-- Form -->
            <UForm :schema="schema" :state="state" @submit="handleSubmit" class="space-y-5 text-left">

              <!-- Email field -->
              <UFormField v-if="!isEmailSent" name="email" label="Email Address">
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="name@school.edu"
                  size="xl"
                  class="w-full"
                />
              </UFormField>

              <!-- OTP field -->
              <UFormField v-if="isEmailSent" name="otp" label="Verification Code">
                <div class="flex justify-center">
                  <UPinInput
                    otp
                    v-model="state.otp"
                    :length="6"
                    size="xl"
                  />
                </div>
              </UFormField>

              <!-- Submit -->
              <UButton
                loading-auto
                type="submit"
                size="xl"
                class="w-full justify-center font-bold rounded-2xl bg-gray-900 hover:bg-black text-white transition active:scale-95"
              >
                {{ isEmailSent ? 'Verify & Login 🪄' : 'Send Magic Link 🪄' }}
              </UButton>
            </UForm>

            <!-- Back link -->
            <button
              @click="view = 'landing'; isEmailSent = false"
              class="text-xs font-bold text-gray-400 hover:text-gray-700 uppercase tracking-widest transition-colors"
            >
              ← Back to Portal
            </button>
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
