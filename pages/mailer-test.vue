<template>
  <div class="p-8 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">Mailer Test</h1>
    <form @submit.prevent="send" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Recipient email</label>
        <input v-model="to" type="email" required class="mt-1 block w-full rounded border p-2" />
      </div>

      <div class="flex items-center space-x-2">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Send OTP</button>
        <span v-if="loading" class="text-sm text-gray-500">Sending…</span>
      </div>
    </form>

    <div v-if="result" class="mt-4 p-4 rounded" :class="result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">
      <strong>{{ result.success ? 'Success' : 'Error' }}</strong>
      <div>{{ result.message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const to = ref('')
const loading = ref(false)
const result = ref(null)

const send = async () => {
  loading.value = true
  result.value = null
  try {
    const res = await fetch('/api/mailer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: to.value }),
    })
    const json = await res.json()
    result.value = json
  } catch (e) {
    result.value = { success: false, message: e.message }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* minimal styles — project already uses Tailwind */
</style>
