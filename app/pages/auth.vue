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
  <div class="min-h-screen bg-[#f8f7f4] font-sans">
    <div class="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-amber-400 to-amber-500" />

    <main class="max-w-4xl mx-auto min-h-[calc(100vh-6px)] flex flex-col">
      <div class="flex items-center justify-center flex-1 py-20 px-4">
        <div
          class="relative bg-white/80 backdrop-blur rounded-3xl border border-gray-100 shadow-xl p-12 w-full max-w-md text-center space-y-8 overflow-hidden"
        >
          <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-amber-400 to-amber-500" />

          <div
            class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-6xl mx-auto shadow-inner select-none"
          >
            🪄
          </div>

          <div>
            <h2 class="text-4xl font-black text-gray-900 mb-1">Magic Login</h2>

            <p class="text-sm font-semibold text-gray-500 mb-2">
              Signing in as: {{ loginRole === 'admin' ? 'Faculty & Admin' : 'Reading Buddy' }}
            </p>

            <p class="text-gray-400 font-medium">
              {{
                isNewUser && loginRole === 'reader'
                  ? 'New user? Enter your name to create your account.'
                  : 'Enter your email to continue.'
              }}
            </p>
          </div>

          <UForm :schema="schema" :state="state" @submit="handleSubmit" class="space-y-5 text-left">
            <UFormField name="email" label="Email Address">
              <UInput
                v-model="state.email"
                type="email"
                placeholder="name@school.edu"
                size="xl"
                class="w-full"
              />
            </UFormField>

            <UFormField v-if="isNewUser && loginRole === 'reader'" name="name" label="Your Name">
              <UInput
                v-model="state.name"
                type="text"
                placeholder="Enter your name"
                size="xl"
                class="w-full"
              />
            </UFormField>

            <UButton
              :loading="checkingEmail"
              loading-auto
              type="submit"
              size="xl"
              class="w-full justify-center font-bold rounded-2xl bg-gray-900 hover:bg-black text-white transition active:scale-95"
            >
              {{ isNewUser && loginRole === 'reader' ? 'Create Account' : 'Continue' }}
            </UButton>
          </UForm>

          <button
            @click="navigateTo('/')"
            class="text-xs font-bold text-gray-400 hover:text-gray-700 uppercase tracking-widest transition-colors"
          >
            ← Back to Portal
          </button>
        </div>
      </div>
    </main>
  </div>
</template>