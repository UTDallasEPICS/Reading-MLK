<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

const isLoggingOut = ref(false)

async function logout() {
  const confirmed = confirm('Are you sure you want to log out?')
  if (!confirmed || isLoggingOut.value) return

  isLoggingOut.value = true

  try {
    await authClient.signOut()
    window.location.href = '/'
  } catch (error) {
    isLoggingOut.value = false
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <button type="button" :disabled="isLoggingOut" @click="logout">
    <slot>⎋ Logout</slot>
  </button>
</template>
