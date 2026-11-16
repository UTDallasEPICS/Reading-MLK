<script setup lang="ts">
import { shopCatalog } from '~~/shared/shop'
const { settings } = useCurrentStudent()
const banner = computed(() => shopCatalog.find(item => item.type === 'banner' && item.name === settings.value.activeBanner))
const overlay = ref<HTMLElement | null>(null)
type Strand = ReturnType<typeof makeStrand>
const placedStrands = ref<{ x: number; strand: Strand }[]>([])
let observer: ResizeObserver | undefined
const obstacleSelector = 'header'

function makeStrand(count: number, offset: number, middle: boolean) {
  const start = middle ? 8 : 18 + offset % 3 * 2
  const spacing = middle ? 52 : 62
  const charms = Array.from({ length: count }, (_, index) => ({
    x: index % 2 ? 52 : 42, y: start + index * spacing, tilt: index % 2 ? 8 : -6,
  }))
  let cord = `M42-8Q26 6 42 ${start}`
  for (let index = 1; index < charms.length; index++) {
    const previous = charms[index - 1]!
    const point = charms[index]!
    cord += `Q65 ${(previous.y + point.y) / 2} ${point.x} ${point.y}`
  }
  const last = charms[charms.length - 1]!
  const endY = last.y + (middle ? 58 : 56)
  cord += `Q30 ${last.y + 28} 42 ${endY}`
  return { charms, cord, endY, offset }
}

function arrangeStrands() {
  const element = overlay.value
  const page = element?.parentElement
  if (!element || !page) return
  const bounds = element.getBoundingClientRect()
  const header = page.querySelector('header')?.getBoundingClientRect()
  if (!header) return
  const contentLeft = header.left - bounds.left
  const contentRight = header.right - bounds.left
  // Reserve the same logo and control slots on every reader page.
  const reserved = [
    { left: contentLeft - 16, right: contentLeft + 112 },
    { left: contentRight - 224, right: contentRight + 16 },
  ]
  let gaps = [{ left: 34, right: bounds.width - 34 }]
  for (const slot of reserved) {
    gaps = gaps.flatMap(gap => [
      { left: gap.left, right: Math.min(gap.right, slot.left - 34) },
      { left: Math.max(gap.left, slot.right + 34), right: gap.right },
    ].filter(part => part.right > part.left))
  }
  const placed: { x: number; strand: Strand }[] = []
  for (const gap of gaps) {
    const count = Math.max(1, Math.round((gap.right - gap.left) / 90))
    const inset = Math.min(12, (gap.right - gap.left) / 2)
    const spacing = count > 1 ? (gap.right - gap.left - inset * 2) / (count - 1) : 0
    for (let index = 0; index < count; index++) {
      const center = count > 1 ? gap.left + inset + spacing * index : (gap.left + gap.right) / 2
      const middle = center >= contentLeft && center <= contentRight
      const inward = count > 1 ? (center < contentLeft ? index : count - 1 - index) / (count - 1) : 0
      const decorations = middle ? 2 : Math.round(3 + 3 * inward)
      placed.push({ x: center - 42, strand: makeStrand(decorations, placed.length, middle) })
    }
  }
  placedStrands.value = placed
}

function observeLayout() {
  observer?.disconnect()
  const page = overlay.value?.parentElement
  if (!page || !overlay.value) return
  observer = new ResizeObserver(arrangeStrands)
  observer.observe(overlay.value)
  observer.observe(page)
  page.querySelectorAll(obstacleSelector).forEach(node => observer!.observe(node))
  arrangeStrands()
}
onMounted(observeLayout)
watch(overlay, observeLayout, { flush: 'post' })
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div v-if="banner" ref="overlay" aria-hidden="true" class="equipped-banner">
    <svg width="100%" height="100%" class="top-garlands" fill="none">
      <g v-for="(placed, strandIndex) in placedStrands" :key="strandIndex" :transform="`translate(${placed.x}, 0)`">
        <path :d="placed.strand.cord" :stroke="banner.bannerStyle === 'ocean' ? '#30bfd1' : banner.bannerStyle === 'sunny' ? '#ffb547' : '#b08ee9'"
          stroke-width="1.5" stroke-linecap="round" />
        <g v-for="(charm, index) in placed.strand.charms" :key="index"
          :transform="`translate(${charm.x - 22}, ${charm.y - 6}) rotate(${charm.tilt} 22 6)`">
          <ReaderBannerCharm :color="banner.colors?.[(index + placed.strand.offset) % banner.colors.length] || '#ffc83d'"
            :index="index + placed.strand.offset" :variant="banner.bannerStyle" />
        </g>
        <circle cx="42" :cy="placed.strand.endY + 4" r="2.5" fill="#ffcc4d" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.equipped-banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 410px;
  z-index: -1;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
}
.top-garlands { display: block; width: 100%; height: 100%; opacity: .95; }
</style>
