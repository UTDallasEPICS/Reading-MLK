<script setup lang="ts">
definePageMeta({ ssr: false })
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">

    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col pt-6 min-h-screen fixed left-0 top-0">
      <!-- Logo -->
      <div class="px-6 mb-8 flex items-center gap-3">
        <div class="w-10 h-10 bg-[#E0604D] rounded-xl flex items-center justify-center text-white font-bold text-xl">L</div>
        <div>
          <div class="font-bold text-gray-900 leading-none">Reading<span class="text-[#E0604D]">Huddle</span></div>
          <div class="text-[10px] text-teal-500 uppercase tracking-widest font-bold">Teacher Portal</div>
        </div>
      </div>

      <div class="px-6 mb-4">
        <h2 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Admin Tools</h2>
        <nav class="space-y-1">
          <NuxtLink
            to="/admin/builder"
            class="flex items-center gap-3 px-4 py-3 font-bold rounded-r-xl transition-all border-l-4"
            :class="$route.path === '/admin/builder'
              ? 'bg-purple-50 text-purple-700 border-purple-500'
              : 'text-gray-600 hover:bg-gray-50 border-transparent'"
          >
            📝 Form Builder
          </NuxtLink>
          <NuxtLink
            to="/admin/progress"
            class="flex items-center gap-3 px-4 py-3 font-bold rounded-r-xl transition-all border-l-4"
            :class="$route.path === '/admin/progress'
              ? 'bg-blue-50 text-blue-700 border-blue-500'
              : 'text-gray-600 hover:bg-gray-50 border-transparent'"
          >
            📊 Class Progress
          </NuxtLink>
          <NuxtLink
            to="/admin/raffle"
            class="flex items-center gap-3 px-4 py-3 font-bold rounded-r-xl transition-all border-l-4"
            :class="$route.path === '/admin/raffle'
              ? 'bg-orange-50 text-orange-700 border-orange-500'
              : 'text-gray-600 hover:bg-gray-50 border-transparent'"
          >
            🎰 Raffle System
          </NuxtLink>
        </nav>
      </div>

      <!-- Back to home -->
      <div class="mt-auto px-6 pb-8">
        <NuxtLink to="/" class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-bold transition">
          ← Back to Portal
        </NuxtLink>
      </div>
    </aside>

    <!-- Main content area -->
    <main class="ml-64 flex-1 p-10">
      <!-- If on /admin exactly, show a welcome screen -->
      <div v-if="$route.path === '/admin'" class="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <div class="text-8xl">🏫</div>
        <h1 class="text-4xl font-black text-gray-900">Welcome, Teacher!</h1>
        <p class="text-gray-400 font-medium text-lg">Pick a tool from the sidebar to get started.</p>
        <div class="grid grid-cols-3 gap-4 mt-4 max-w-lg w-full">
          <NuxtLink to="/admin/builder" class="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center hover:border-purple-300 hover:shadow-md transition">
            <div class="text-3xl mb-2">📝</div>
            <div class="font-bold text-gray-700 text-sm">Form Builder</div>
          </NuxtLink>
          <NuxtLink to="/admin/progress" class="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center hover:border-blue-300 hover:shadow-md transition">
            <div class="text-3xl mb-2">📊</div>
            <div class="font-bold text-gray-700 text-sm">Class Progress</div>
          </NuxtLink>
          <NuxtLink to="/admin/raffle" class="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center hover:border-orange-300 hover:shadow-md transition">
            <div class="text-3xl mb-2">🎰</div>
            <div class="font-bold text-gray-700 text-sm">Raffle</div>
          </NuxtLink>
        </div>
      </div>

      <!-- Child pages render here -->
      <NuxtPage v-else />
    </main>
  </div>
</template>
