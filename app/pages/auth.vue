<script setup lang="ts">
definePageMeta({ ssr: false })

import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/utils/auth-client'
import { onMounted } from 'vue'

const toast = useToast()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (route.query.emailChanged) {
    alert('Your email was successfully updated. Please sign in again.')

    const newQuery = { ...route.query }
    delete newQuery.emailChanged

    router.replace({ query: newQuery })
  }

  if (route.query.emailChangeError) {
    const errorMessages: Record<string, string> = {
      invalid: 'The email change link is invalid or has already been used.',
      expired: 'The email change link has expired. Please request a new one.',
      conflict: 'That email address is already in use by another account.',
    }

    const code = route.query.emailChangeError as string
    toast.add({
      title: 'Email change failed',
      description: errorMessages[code] || 'Something went wrong. Please try again.',
      color: 'error',
    })

    const newQuery = { ...route.query }
    delete newQuery.emailChangeError
    router.replace({ query: newQuery })
  }
})

const loginRole = computed(() => {
  return route.query.role === 'admin' ? 'admin' : 'reader'
})

const isNewUser = ref(false)
const checkingEmail = ref(false)

const schema = computed(() => {
  if (isNewUser.value) {
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
  const callbackURL = loginRole.value === 'admin' ? '/auth?role=admin' : '/reader/profile'

  // New users entering through Faculty become Posters; Reading Buddies remain readers.
  if (isNewUser.value) {
    const signupResult = await $fetch('/api/users/signup', {
      method: 'POST',
      body: {
        email: state.email,
        name: state.name,
        role: loginRole.value === 'admin' ? 'poster' : 'reader',
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

  // New user: reveal the name field before creating the account.
  isNewUser.value = true

  toast.add({
    title: 'New user',
    description: 'Please enter your name to create an account.',
    color: 'primary',
  })
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#f8efe5] font-sans">
    <div class="absolute inset-0 bg-gradient-to-br from-[#faefe5] via-[#f7eee6] to-[#f5eadf]" />
    <div class="pointer-events-none absolute inset-0 opacity-70">
      <div class="absolute top-16 left-16 h-36 w-36 rounded-full bg-orange-100 blur-3xl" />
      <div class="absolute right-20 bottom-20 h-44 w-44 rounded-full bg-yellow-100 blur-3xl" />
      <div class="absolute top-1/3 right-1/4 h-28 w-28 rounded-full bg-pink-100 blur-2xl" />
    </div>

    <main class="relative z-10 flex min-h-screen items-center justify-center px-4 py-6">
      <div
        class="w-full max-w-lg overflow-hidden rounded-[2.25rem] border border-white bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.10)] backdrop-blur"
      >
        <div class="h-2 w-full bg-gradient-to-r from-[#6b6ee8] via-[#f0a446] to-[#ffb400]" />

        <div class="px-8 py-8 text-center sm:px-12">
          <div
            class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#eef0fb] text-5xl shadow-inner"
          >
            🪄
          </div>

          <h1 class="mb-3 text-4xl font-black tracking-tight text-[#0f1730] sm:text-5xl">
            Magic Login
          </h1>

          <p class="mb-8 text-lg font-bold text-[#70798c]">
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
                  base: 'rounded-2xl h-14 px-4 text-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-300 shadow-sm',
                }"
              />
            </UFormField>

            <UFormField
              v-if="isNewUser"
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
                  base: 'rounded-2xl h-14 px-4 text-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-300 shadow-sm',
                }"
              />
            </UFormField>

            <UButton
              :loading="checkingEmail"
              loading-auto
              type="submit"
              size="xl"
              class="h-14 w-full justify-center rounded-2xl bg-[#0d1735] text-xl font-black text-white shadow-xl hover:bg-[#132149]"
            >
              {{ isNewUser ? 'Create Account ✨' : 'Send Magic Link 🪄' }}
            </UButton>
          </UForm>

          <button
            @click="navigateTo('/')"
            class="mt-6 text-sm font-black tracking-[0.25em] text-[#9aa3b4] uppercase transition-colors hover:text-[#6c7486]"
          >
            ← Back to Portal
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
