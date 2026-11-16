<script setup lang="ts">
  import type { PetType } from '~~/shared/pet'

  const props = withDefaults(
    defineProps<{
      type: PetType
      stage?: number
      alt?: string
    }>(),
    { stage: 0, alt: '' }
  )

  const safeStage = computed(() => Math.max(0, Math.min(4, Math.floor(props.stage))))
</script>

<template>
  <span class="pet-sprite" role="img" :aria-label="alt">
    <img :src="`/pets/${type}-${safeStage + 1}.webp`" alt="" draggable="false" />
  </span>
</template>

<style scoped>
  .pet-sprite {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .pet-sprite img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
  }
</style>
