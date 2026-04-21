<script setup lang="ts">

import { authClient } from '~/utils/auth-client'
import { onMounted } from 'vue'

const { student, settings: globalSettings, saveSettings: pushSettings, clearStudent } = useCurrentStudent()

if (!student.value) {
  await navigateTo('/reader/profile')
}

// Map the global settings to a local reactive object so our sliders/toggles can mutate them
const settings = reactive({ 
  dyslexiaFont: globalSettings.value.dyslexiaFont,
  language: globalSettings.value.language,
  fontSize: globalSettings.value.fontSize,
})

const accountSettings = reactive({
  raffleOptIn: true,
  publicityConsent: false,
})

const loadingAccountSettings = ref(true)
const savingAccountSettings = ref(false)

//Logout
async function logout() {
  try {
    clearStudent()
    await authClient.signOut()
    window.location.href = '/auth'
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

//Change Email
const newEmail = ref('')
const savingEmail = ref(false)

async function changeEmail() {
  if (!newEmail.value.trim()) return

  savingEmail.value = true

  try {
    await $fetch('/api/users/request-email-change', {
      method: 'POST',
      body: {
        email: newEmail.value.trim(),
      },
    })

    alert('Check your new email to confirm the change.')
    newEmail.value = ''
  } catch (error: any) {
    alert(error?.data?.statusMessage || 'Failed to request email change')
    console.error('Failed to request email change:', error)
  } finally {
    savingEmail.value = false
  }
}

//Loading accont settings
async function loadAccountSettings() {
  try {
    const data = await $fetch('/api/users/account-settings', {
      method: 'GET',
    })

    accountSettings.raffleOptIn = data.raffleOptIn
    accountSettings.publicityConsent = data.publicityConsent
  } catch (error) {
    console.error('Failed to load account settings:', error)
  } finally {
    loadingAccountSettings.value = false
  }
}

onMounted(async () => {
  await loadAccountSettings()
})


//Saving aacount settings
async function saveAccountSettings() {
  savingAccountSettings.value = true

  try {
    await $fetch<{
      success: boolean
      settings: {
        raffleOptIn: boolean
        publicityConsent: boolean
      }
    }>('/api/users/account-settings', {
      method: 'PUT' as 'PUT',
      body: {
        raffleOptIn: accountSettings.raffleOptIn,
        publicityConsent: accountSettings.publicityConsent,
      },
    })
  } catch (error) {
    console.error('Failed to save account settings:', error)
  } finally {
    savingAccountSettings.value = false
  }
}

// ── Theme class ── 
const themeClass = computed(() => {
  const t = 'light'
  const d = settings.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app ${t} ${d}`.trim()
})

// Watch for any changes to settings and automatically save using the composable
watch(settings, (newSettings) => {
  pushSettings(newSettings)
}, { deep: true })

</script>

<template>
  <div
    :class="themeClass"
    :style="`font-size: ${settings.fontSize * 16}px`"
    class="pb-32 px-4 pt-4 min-h-screen relative text-gray-800"
  >

    <!-- TOP BAR -->
    <header
      class="absolute top-4 left-0 right-0 w-full max-w-4xl mx-auto flex justify-end items-center px-6 z-[200]"
    >
      <NuxtLink
        to="/reader/home"
        class="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl transition-all border border-gray-200 shadow-lg hover:scale-110 active:scale-95"
      >
        🏠
      </NuxtLink>
    </header>

    <!-- MAIN CARD -->
    <div
      class="p-6 max-w-lg mx-auto space-y-4 bg-white mt-8 rounded-[2.5rem] border border-gray-200 shadow-xl"
    >

      <!-- TITLE -->
      <div class="text-center mb-2">
        <div class="text-5xl mb-2">⚙️</div>
        <h2 class="font-heading text-3xl font-bold text-gray-800">
          Settings
        </h2>
      </div>

      <!-- PROFILE SWITCH -->
      <div>
        <label
          class="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1.5"
        >
          Which Student?
        </label>

        <NuxtLink
          to="/reader/profile"
          class="w-full text-white font-bold py-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 bg-[#e25d47]"
        >
          Switch Profile
        </NuxtLink>
      </div>

      <!-- FONT SIZE -->
      <div>
        <label
          class="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1.5"
        >
          Text Size
        </label>

        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <span class="text-sm font-bold text-gray-500">A</span>

          <input
            type="range"
            min="1"
            max="1.5"
            step="0.1"
            v-model.number="settings.fontSize"
            class="flex-grow h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />

          <span class="text-lg font-bold text-gray-500">A</span>

          <span
            class="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg"
          >
            {{ Math.round(settings.fontSize * 100) }}%
          </span>
        </div>
      </div>

      <!-- DYSLEXIA -->
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div>
          <h4 class="font-bold text-sm text-gray-800">
            Dyslexia-Friendly Font
          </h4>
          <p class="text-xs text-gray-600">
            Uses OpenDyslexic typeface
          </p>
        </div>

        <button
          @click="settings.dyslexiaFont = !settings.dyslexiaFont"
          :class="[
            'w-12 h-6 rounded-full transition-all relative',
            settings.dyslexiaFont ? 'bg-green-400' : 'bg-gray-300'
          ]"
        >
          <div
            :class="[
              'w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all',
              settings.dyslexiaFont ? 'right-0.5' : 'left-0.5'
            ]"
          />
        </button>
      </div>

      <!-- LANGUAGE -->
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div>
          <h4 class="font-bold text-sm text-gray-800">
            Language / Idioma
          </h4>

          <p class="text-xs text-gray-600">
            {{ settings.language === 'en' ? 'English' : 'Español' }}
          </p>
        </div>

        <button
          @click="settings.language = settings.language === 'en' ? 'es' : 'en'"
          class="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-indigo-200 transition"
        >
          {{ settings.language === 'en' ? '🇪🇸 Español' : '🇺🇸 English' }}
        </button>
      </div>

      <!-- RAFFLE -->
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div>
          <h4 class="font-bold text-sm text-gray-800">
            Raffle Participation
          </h4>

          <p class="text-xs text-gray-600">
            Opt in or out of Friends of MLK raffles
          </p>
        </div>

        <button
          @click="accountSettings.raffleOptIn = !accountSettings.raffleOptIn; saveAccountSettings()"
          :class="[
            'w-12 h-6 rounded-full transition-all relative',
            accountSettings.raffleOptIn ? 'bg-green-400' : 'bg-gray-300'
          ]"
        >
          <div
            :class="[
              'w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all',
              accountSettings.raffleOptIn ? 'right-0.5' : 'left-0.5'
            ]"
          />
        </button>
      </div>

      <!-- PUBLICITY -->
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div>
          <h4 class="font-bold text-sm text-gray-800">
            Publicity Consent
          </h4>

          <p class="text-xs text-gray-600">
            Allow Friends of MLK to use responses for publicity
          </p>
        </div>

        <button
          @click="accountSettings.publicityConsent = !accountSettings.publicityConsent; saveAccountSettings()"
          :class="[
            'w-12 h-6 rounded-full transition-all relative',
            accountSettings.publicityConsent ? 'bg-green-400' : 'bg-gray-300'
          ]"
        >
          <div
            :class="[
              'w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all',
              accountSettings.publicityConsent ? 'right-0.5' : 'left-0.5'
            ]"
          />
        </button>
      </div>

      <!-- CHANGE EMAIL -->
      <div>
        <label
          class="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1.5"
        >
          Change Email
        </label>

        <div class="p-3 bg-gray-50 rounded-xl space-y-3">
          <input
            v-model="newEmail"
            type="email"
            placeholder="Enter new email"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-indigo-500"
          />

          <button
            @click="changeEmail"
            :disabled="savingEmail"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {{ savingEmail ? 'Updating...' : 'Update Email ✉️' }}
          </button>
        </div>
      </div>

      <!-- LOGOUT -->
      <button
        @click="logout"
        class="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-base py-3 rounded-xl shadow-lg transition active:scale-95 mt-2"
      >
        Logout 👋
      </button>

    </div>
  </div>
</template>