<script setup lang="ts">
defineProps<{ colors: readonly string[]; variant?: 'rainbow' | 'sunny' | 'ocean' }>()
const patternId = useId()
</script>

<template>
  <svg aria-hidden="true" viewBox="0 0 256 64"
    class="reader-banner" width="100%" height="64">
    <defs>
      <pattern :id="patternId" :width="Math.max(colors.length, 1) * 64" height="64" patternUnits="userSpaceOnUse">
        <path :d="`M0 6H${Math.max(colors.length, 1) * 64}`" :stroke="variant === 'ocean' ? '#30bfd1' : variant === 'sunny' ? '#ffb547' : '#b08ee9'" stroke-width="1.4" />
        <path :d="`M0 5.4H${Math.max(colors.length, 1) * 64}`" stroke="#faf4e8" stroke-width=".5" />
        <ReaderBannerCharm v-for="(color, index) in colors" :key="index" :color="color" :index="index" :variant="variant"
          :transform="`translate(${index * 64 + 10}, 0)`" />
        <circle v-for="(_, index) in colors" :key="`bead-${index}`" :cx="index * 64 + 64" cy="6" r="1.7" fill="#ffcc4d" />
      </pattern>
    </defs>
    <rect width="100%" height="64" :fill="`url(#${patternId})`" />
  </svg>
</template>

<style scoped>
.reader-banner { display: block; width: 100%; height: auto; }
</style>
