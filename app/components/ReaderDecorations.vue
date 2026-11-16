<script setup lang="ts">
import { shopCatalog } from '~~/shared/shop'
const { settings } = useCurrentStudent()
const stickers = computed(() => shopCatalog.filter(item => item.type === 'sticker').map((item, slot) => ({ ...item, slot })).filter(item => settings.value.activeStickers.includes(item.name)))
</script>
<template>
  <div aria-hidden="true" class="reader-decorations">
    <NuxtImg v-for="item in stickers" :key="item.id" :src="item.image" alt="" :class="['background-sticker', `sticker-slot-${item.slot}`]" width="160" height="160" format="webp" densities="1x 2x" draggable="false" />
  </div>
</template>
<style scoped>
.reader-decorations { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; user-select: none; }
.background-sticker { position: absolute; width: clamp(5rem, 9vw, 9rem); height: auto; object-fit: contain; opacity: .95; }
.sticker-slot-0 { left: 3%; top: 26%; transform: rotate(-14deg); }
.sticker-slot-1 { right: 3%; top: 25%; transform: rotate(14deg); }
.sticker-slot-2 { left: 4%; bottom: 12%; transform: rotate(-9deg); }
.sticker-slot-3 { right: 4%; bottom: 9%; transform: rotate(10deg); }
.sticker-slot-4 { left: 1%; top: 53%; transform: rotate(8deg); }
.sticker-slot-5 { right: 1%; top: 55%; transform: rotate(-10deg); }
@media (max-width: 640px) {
  .background-sticker { width: 4.5rem; opacity: .7; }
  .sticker-slot-0, .sticker-slot-2, .sticker-slot-4 { left: -8px; }
  .sticker-slot-1, .sticker-slot-3, .sticker-slot-5 { right: -8px; }
}
</style>
