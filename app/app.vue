<script setup lang="ts">
  const colorMode = useColorMode()

  const isDark = computed({
    get() {
      return colorMode.value === 'dark'
    },
    set() {
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    },
  })
</script>

<template>
  <UApp>
    <div
      class="flex min-h-screen flex-col bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100"
    >
      <main class="flex-1">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </main>
    </div>
  </UApp>
</template>
