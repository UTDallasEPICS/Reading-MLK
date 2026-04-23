<script setup lang="ts">
definePageMeta({ ssr: false })

import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/utils/auth-client'

const toast = useToast()
const route = useRoute()

const loginRole = computed(() => {
  return route.query.role === 'admin' ? 'admin' : 'reader'
})

const isNewUser = ref(false)
const checkingEmail = ref(false)

// Language preference selected during signup (before a Student record exists)
const selectedLanguage = ref<'en' | 'es'>('en')

const schema = computed(() => {
  if (isNewUser.value && loginRole.value === 'reader') {
    return z.object({
      email: z.string().email('Invalid email'),
      name: z.string().min(1, 'Name is required'),
    })
  }

  return z.object({
    email: z.string().email('Invalid email'),
  })
})

const state = reactive({
  email: '',
  name: '',
})

async function sendMagicLink(callbackURL: string) {
  const { error } = await authClient.signIn.magicLink({
    email: state.email,
    callbackURL,
  })

  if (error) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'error',
    })
    return false
  }

  return true
}

async function handleSubmit(_event: FormSubmitEvent<any>) {
  const callbackURL = loginRole.value === 'admin' ? '/admin' : '/reader/profile'

  // New reader flow: create account first, then send magic link
  if (isNewUser.value && loginRole.value === 'reader') {
    const signupResult = await $fetch('/api/users/signup', {
      method: 'POST',
      body: {
        email: state.email,
        name: state.name,
      },
    }).catch((error) => {
      toast.add({
        title: 'Error',
        description: error?.data?.statusMessage || 'Failed to create account',
        color: 'error',
      })
      return null
    })

    if (!signupResult) return

    // Persist the language preference so the profile page can apply it
    // when the student record is first selected after login
    if (process.client) {
      localStorage.setItem('signupPreferredLanguage', selectedLanguage.value)
    }

    const success = await sendMagicLink(callbackURL)

    if (success) {
      toast.add({
        title: 'Check your email',
        description: 'Your account was created. We sent you a magic sign-in link.',
        color: 'success',
      })
    }

    return
  }

  // First step: check whether the email exists
  checkingEmail.value = true

  const result = await $fetch<{
    exists: boolean
    user: {
      id: string
      email: string
      name: string
      role: string
    } | null
  }>('/api/users/check-email', {
    method: 'POST',
    body: {
      email: state.email,
    },
  }).catch((error) => {
    toast.add({
      title: 'Error',
      description: error?.data?.statusMessage || 'Failed to check email',
      color: 'error',
    })
    return null
  })

  checkingEmail.value = false

  if (!result) return

  // Existing user
  if (result.exists) {
    if (loginRole.value === 'admin' && result.user?.role !== 'admin') {
      toast.add({
        title: 'Error',
        description: 'Admin account not found.',
        color: 'error',
      })
      return
    }

    const success = await sendMagicLink(callbackURL)

    if (success) {
      toast.add({
        title: 'Check your email',
        description: 'We sent you a magic sign-in link.',
        color: 'success',
      })
    }

    return
  }

  // New admins are not allowed through public signup
  if (loginRole.value === 'admin') {
    toast.add({
      title: 'Error',
      description: 'Admin account not found.',
      color: 'error',
    })
    return
  }

  // New reader: reveal name field
  isNewUser.value = true

  toast.add({
    title: 'New user',
    description: 'Please enter your name to create an account.',
    color: 'primary',
  })
}
</script>

<template>
  <div class="min-h-screen bg-[#f8efe5] relative overflow-hidden font-sans">
    <div class="absolute inset-0 bg-gradient-to-br from-[#faefe5] via-[#f7eee6] to-[#f5eadf]" />
    <div class="absolute inset-0 pointer-events-none opacity-70">
      <div class="absolute top-16 left-16 h-36 w-36 rounded-full bg-orange-100 blur-3xl" />
      <div class="absolute bottom-20 right-20 h-44 w-44 rounded-full bg-yellow-100 blur-3xl" />
      <div class="absolute top-1/3 right-1/4 h-28 w-28 rounded-full bg-pink-100 blur-2xl" />
    </div>

    <main class="relative z-10 min-h-screen flex items-center justify-center px-4 py-6">
      <div class="w-full max-w-lg rounded-[2.25rem] bg-white/80 backdrop-blur border border-white shadow-[0_20px_60px_rgba(0,0,0,0.10)] overflow-hidden">
        <div class="h-2 w-full bg-gradient-to-r from-[#6b6ee8] via-[#f0a446] to-[#ffb400]" />

        <div class="px-8 sm:px-12 py-8 text-center">
          <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#eef0fb] text-5xl shadow-inner">
            🪄
          </div>

          <h1 class="text-4xl sm:text-5xl font-black text-[#0f1730] mb-3 tracking-tight">
            Magic Login
          </h1>

          <p class="text-lg font-bold text-[#70798c] mb-8">
            Signing in as:
            {{ loginRole === 'admin' ? 'Faculty & Admin' : 'Reading Buddy' }}
          </p>

          <UForm :schema="schema" :state="state" @submit="handleSubmit" class="space-y-5 text-left">
            <UFormField
              name="email"
              label="Email Address"
              :ui="{ label: 'text-[#5c6475] font-bold text-sm tracking-wide' }"
            >
              <UInput
                v-model="state.email"
                type="email"
                placeholder="name@school.edu"
                size="xl"
                class="w-full"
                :ui="{
                  base: 'rounded-2xl h-14 px-4 text-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-300 shadow-sm'
                }"
              />
            </UFormField>

            <UFormField
              v-if="isNewUser && loginRole === 'reader'"
              name="name"
              label="Your Name"
              :ui="{ label: 'text-[#5c6475] font-bold text-sm tracking-wide' }"
            >
              <UInput
                v-model="state.name"
                type="text"
                placeholder="Enter your name"
                size="xl"
                class="w-full"
                :ui="{
                  base: 'rounded-2xl h-14 px-4 text-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-300 shadow-sm'
                }"
              />
            </UFormField>

            <!-- Language preference — shown when creating a new reader account -->
            <div v-if="isNewUser && loginRole === 'reader'" class="space-y-2">
              <p class="text-[#5c6475] font-bold text-sm tracking-wide">
                Preferred Language / Idioma preferido
              </p>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="selectedLanguage = 'en'"
                  :class="[
                    'flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-base border-2 transition-all',
                    selectedLanguage === 'en'
                      ? 'border-[#6b6ee8] bg-[#eef0fb] text-[#6b6ee8] shadow-md scale-[1.02]'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-[#6b6ee8]/50'
                  ]"
                >
                  <span class="text-xl">🇺🇸</span> English
                </button>
                <button
                  type="button"
                  @click="selectedLanguage = 'es'"
                  :class="[
                    'flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-base border-2 transition-all',
                    selectedLanguage === 'es'
                      ? 'border-[#6b6ee8] bg-[#eef0fb] text-[#6b6ee8] shadow-md scale-[1.02]'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-[#6b6ee8]/50'
                  ]"
                >
                  <span class="text-xl">🇪🇸</span> Español
                </button>
              </div>
            </div>

            <UButton
              :loading="checkingEmail"
              loading-auto
              type="submit"
              size="xl"
              class="w-full justify-center rounded-2xl h-14 text-xl font-black bg-[#0d1735] hover:bg-[#132149] text-white shadow-xl"
            >
              {{ isNewUser && loginRole === 'reader' ? 'Create Account ✨' : 'Send Magic Link 🪄' }}
            </UButton>
          </UForm>

          <button
            @click="navigateTo('/')"
            class="mt-6 text-sm font-black uppercase tracking-[0.25em] text-[#9aa3b4] hover:text-[#6c7486] transition-colors"
          >
            ← Back to Portal
          </button>
        </div>
      </div>
    </main>
  </div>
</template>