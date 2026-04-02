<script setup lang="ts">
definePageMeta({ ssr: false })
</script>

<template>
  <div class="min-h-screen bg-[#f5ede3] flex flex-col items-center justify-center gap-12 p-8">
    <div class="text-8xl animate-bounce">🚀</div>
    <div class="text-center space-y-3">
      <h1 class="text-6xl font-black text-gray-900">ReadingHuddle</h1>
      <p class="text-xl text-gray-400">Where are you heading today?</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
      <button
        @click="navigateTo('/admin')"
        class="group bg-white rounded-3xl border-2 border-gray-100 p-10 text-center shadow-sm hover:border-indigo-400 hover:shadow-lg transition-all duration-200"
      >
        <div class="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-5xl mb-5 mx-auto group-hover:rotate-12 transition-transform duration-300">🏫</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Faculty & Admin</h3>
        <p class="text-gray-400 font-medium">Manage students, curriculum & raffles.</p>
      </button>
      <button
        @click="navigateTo('/reader')"
        class="group bg-white rounded-3xl border-2 border-gray-100 p-10 text-center shadow-sm hover:border-amber-400 hover:shadow-lg transition-all duration-200"
      >
        <div class="w-20 h-20 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-5xl mb-5 mx-auto group-hover:rotate-12 transition-transform duration-300">✨</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Reading Buddy</h3>
        <p class="text-gray-400 font-medium">Complete challenges, log books & win prizes!</p>
      </button>
    </div>
  </div>
</template>