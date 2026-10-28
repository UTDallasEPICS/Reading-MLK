<script setup lang="ts">
definePageMeta({ ssr: false })

import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/utils/auth-client'
import { getUserErrorMessage } from '~/utils/user-error'
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
  return route.query.role === 'coach' ? 'coach' : 'reader'
})

const isNewUser = ref(false)
const checkingEmail = ref(false)
const showTos = ref(false)

const schema = computed(() => {
  if (isNewUser.value) {
    return z.object({
      email: z.string().email('Invalid email'),
      name: z.string().min(1, 'Name is required'),
      tosCheck: z.literal(true, {
        message: 'You must accept the Terms of Service to create an account.',
      }),
    })
  }

  return z.object({
    email: z.string().email('Invalid email'),
  })
})

const state = reactive({
  email: '',
  name: '',
  tosCheck: false,
})

async function sendMagicLink(callbackURL: string) {
  const { error } = await authClient.signIn.magicLink({
    email: state.email,
    callbackURL,
  })

  if (error) {
    toast.add({
      title: 'Error',
      description: 'We could not send the magic link. Please try again.',
      color: 'error',
    })
    return false
  }

  return true
}

async function handleSubmit(_event: FormSubmitEvent<any>) {
  const callbackURL = loginRole.value === 'coach' ? '/auth?role=coach' : '/reader/profile'

  // New user flow: create account first, then send magic link
  if (isNewUser.value) {
    const signupResult = await $fetch('/api/users/signup', {
      method: 'POST',
      body: {
        email: state.email,
        name: state.name,
        role: loginRole.value,
        tosCheck: state.tosCheck,
      },
    }).catch((error) => {
      toast.add({
        title: 'Error',
        description: getUserErrorMessage(error, 'We could not create your account. Please try again.'),
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
      description: getUserErrorMessage(error, 'We could not check that email. Please try again.'),
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

  // New user: reveal name field
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
            {{ loginRole === 'coach' ? 'Reading Coach' : 'Reading Buddy' }}
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
                  base: 'rounded-2xl h-14 px-4 text-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-300 shadow-sm'
                }"
              />
            </UFormField>

            <UFormField v-if="isNewUser" name="tosCheck">
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="tos"
                  v-model="state.tosCheck"
                  class="w-4 h-4 text-[#0d1735] border-gray-300 rounded focus:ring-[#0d1735]"
                />

                <label for="tos" class="text-sm text-[#5c6475]">
                  I agree to the
                  <a href="/terms" class="text-[#0d1735] font-bold hover:underline"
                  @click.prevent="showTos = true">Release and Waiver of Liability</a>
                </label>
              </div>
            </UFormField>
            
            <Transition name="fade">
                <div v-if="showTos"
                    class="fixed inset-0 z-[200] flex items-center justify-center"
                    @click.self="showTos = false">

                  <div class="absolute inset-0 backdrop-blur-md pointer-events-none"
                      style="background:rgba(15,23,42,0.6)" />

                  <div class="p-6 bg-white max-w-md w-[90%] max-h-[80vh] relative z-10 animate-pop flex flex-col gap-4"
                      style="border-radius:2.5rem; box-shadow:0 20px 60px rgba(0,0,0,0.3); border-bottom:8px solid var(--brand-gold);">

                    <h2 class="font-heading text-2xl text-black text-center font-bold text-lg">
                      Release and Waiver of Liability
                    </h2>

                    <div class="flex-1 min-h-0 overflow-y-auto pr-2 text-left text-sm text-gray-500 space-y-3">
                      <p>
                        This Release and Waiver of Liability (the “Release”) executed on ___/___/___ (date) by
                        __________________________ (“Participant”) releases Friends of MLK (“FOMLK”) and each of its directors,
                        officers, employees, and agents from any and all liability, claims, demands, costs and damages of any kind.
                        Participant understands that the scope of Participant’s relationship with FOMLK is limited to a Participant position
                        and that no compensation is expected in return for services provided by Participant; that FOMLK will not provide
                        any benefits traditionally associated with employment to Participant; and that Participant is responsible for his/her
                        own insurance coverage in the event of personal injury or illness as a result of Participant’s services to FOMLK.
                        1. Waiver and Release: I, the Participant, release and forever discharge and hold harmless FOMLK and its
                        successors and assigns from any and all liability, claims, and demands of whatever kind of nature, either in law or in
                        equity, which arise or may hereafter arise from the services I provide to FOMLK. I understand and acknowledge
                        that this Release discharges FOMLK from any liability or claim that I may have against FOMLK with respect to
                        bodily injury, personal injury, illness, death, or property damage that may result from the services I provide to
                        FOMLK or occurring while I am providing Participant services.
                        2. Insurance: Further I understand that FOMLK does not assume any responsibility for or obligation to
                        provide me with financial or other assistance, including but not limited to medical, health, or disability benefits or
                        insurance. I expressly waive any such claim for compensation or liability on the part of FOMLK beyond what may
                        be offered freely by FOMLK in the event of injury or medical expenses incurred by me.
                        3. Medical Treatment: I hereby Release and forever discharge FOMLK from any claim whatsoever which
                        arises or may hereafter arise on account of any first-aid treatment or other medical services rendered in connection
                        with an emergency during my tenure as a Participant with FOMLK.
                        4. Assumption of Risk: I understand that the services I provide to FOMLK should not but may include
                        activities that may be hazardous to me. As a Participant, I hereby expressly assume risk of injury or harm from these
                        activities and Release FOMLK from all liability.
                        5. Photographic Release: I grant and convey to FOMLK all right, title, and interests in any and all products,
                        photographs, images, video, or audio recordings of me or my likeness or voice made by FOMLK in connection with
                        my providing Participant services to FOMLK.
                        6. Other: As a Participant, I expressly agree that this Release is intended to be as broad and inclusive as
                        permitted. I agree that in the event that any clause or provision of this Release is deemed invalid, the enforceability
                        of the remaining provisions of this Release shall not be affected. I agree to indemnify, defend, and hold harmless
                        FOMLK, and its directors, officers, employees, agents, subsidiaries and affiliates from and against any and all
                        losses, injuries, claims, demands, liabilities, obligations, suits, penalties, forfeitures, costs or expenses of every kind
                        including but not limited to attorney’s fees, arising out of participation in FOMLK activities.
                        By clicking the checkbox, I express my understanding and intent to enter into this Release and Waiver of Liability willingly
                        and voluntarily.
                      </p>
                    </div>

                    <button type="button" @click="showTos = false"
                            class="btn-fun text-black py-3 px-10 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 self-center"
                            style="background:var(--brand-indigo)">
                      Close
                    </button>
                  </div>
                </div>
              </Transition>

            <UButton
              :loading="checkingEmail"
              loading-auto
              type="submit"
              size="xl"
              class="w-full justify-center rounded-2xl h-14 text-xl font-black bg-[#0d1735] hover:bg-[#132149] text-white shadow-xl"
            >
              {{ isNewUser ? 'Create Account ✨' : 'Send Magic Link 🪄' }}
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
