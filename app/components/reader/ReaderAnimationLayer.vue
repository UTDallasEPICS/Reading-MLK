<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type Sparkle = {
  id: number
  x: number
  y: number
  glyph: string
  size: number
}

const props = defineProps<{
  activeAnimations?: string[]
}>()

const activeAnimationSet = computed(() => new Set((props.activeAnimations ?? []).map((name) => String(name))))
const hasAnimation = (name: string) => activeAnimationSet.value.has(name)

const twinkleStars = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  left: `${Math.round((index * 37) % 100)}%`,
  top: `${Math.round((index * 53) % 100)}%`,
  delay: `${(index * 0.23).toFixed(2)}s`,
}))

const confettiBits = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${Math.round((index * 29) % 100)}%`,
  delay: `${(index * 0.21).toFixed(2)}s`,
  duration: `${5 + (index % 4)}s`,
  hue: `${(index * 23) % 360}`,
}))

const fireflies = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${Math.round((index * 31) % 100)}%`,
  top: `${Math.round((index * 47) % 100)}%`,
  delay: `${(index * 0.31).toFixed(2)}s`,
}))

const butterflies = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  top: `${8 + ((index * 11) % 72)}%`,
  delay: `${(index * 0.9).toFixed(2)}s`,
}))

const leaves = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${Math.round((index * 19) % 100)}%`,
  delay: `${(index * 0.7).toFixed(2)}s`,
  duration: `${7 + (index % 4)}s`,
}))

const sparkleGlyphs = ['✨', '✦', '✧', '⋆']
const cursorSparkles = ref<Sparkle[]>([])
let sparkleCounter = 0
let lastSparkleAt = 0

const addCursorSparkles = (event: PointerEvent) => {
  if (!hasAnimation('Magic Sparkles')) {
    return
  }

  const now = Date.now()

  if (now - lastSparkleAt < 35) {
    return
  }

  lastSparkleAt = now

  for (let index = 0; index < 3; index++) {
    sparkleCounter += 1

    const sparkle: Sparkle = {
      id: sparkleCounter,
      x: event.clientX + (Math.random() * 20 - 10),
      y: event.clientY + (Math.random() * 20 - 10),
      glyph: sparkleGlyphs[Math.floor(Math.random() * sparkleGlyphs.length)],
      size: 12 + Math.round(Math.random() * 8),
    }

    cursorSparkles.value.push(sparkle)

    setTimeout(() => {
      cursorSparkles.value = cursorSparkles.value.filter((entry) => entry.id !== sparkle.id)
    }, 650)
  }
}

const attachPointerListener = () => {
  window.addEventListener('pointermove', addCursorSparkles, { passive: true })
}

const detachPointerListener = () => {
  window.removeEventListener('pointermove', addCursorSparkles)
}

watch(
  () => hasAnimation('Magic Sparkles'),
  (enabled) => {
    if (!process.client) {
      return
    }

    if (enabled) {
      attachPointerListener()
      return
    }

    detachPointerListener()
    cursorSparkles.value = []
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  detachPointerListener()
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
    <div v-if="hasAnimation('Twinkling Stars')" class="effect-layer stars-layer">
      <span
        v-for="star in twinkleStars"
        :key="`star-${star.id}`"
        class="star"
        :style="{ left: star.left, top: star.top, animationDelay: star.delay }"
      >✦</span>
    </div>

    <div v-if="hasAnimation('Confetti Rain')" class="effect-layer confetti-layer">
      <span
        v-for="bit in confettiBits"
        :key="`confetti-${bit.id}`"
        class="confetti-bit"
        :style="{
          left: bit.left,
          animationDelay: bit.delay,
          animationDuration: bit.duration,
          backgroundColor: `hsl(${bit.hue} 90% 70%)`,
        }"
      />
    </div>

    <div v-if="hasAnimation('Fireflies')" class="effect-layer firefly-layer">
      <span
        v-for="firefly in fireflies"
        :key="`firefly-${firefly.id}`"
        class="firefly"
        :style="{ left: firefly.left, top: firefly.top, animationDelay: firefly.delay }"
      />
    </div>

    <div v-if="hasAnimation('Fluttering Butterflies')" class="effect-layer butterflies-layer">
      <span
        v-for="butterfly in butterflies"
        :key="`butterfly-${butterfly.id}`"
        class="butterfly"
        :style="{ top: butterfly.top, animationDelay: butterfly.delay }"
      >🦋</span>
    </div>

    <div v-if="hasAnimation('Falling Leaves')" class="effect-layer leaves-layer">
      <span
        v-for="leaf in leaves"
        :key="`leaf-${leaf.id}`"
        class="leaf"
        :style="{ left: leaf.left, animationDelay: leaf.delay, animationDuration: leaf.duration }"
      >🍂</span>
    </div>

    <div v-if="hasAnimation('Magic Sparkles')" class="sparkles-layer">
      <span
        v-for="sparkle in cursorSparkles"
        :key="sparkle.id"
        class="cursor-sparkle"
        :style="{
          left: `${sparkle.x}px`,
          top: `${sparkle.y}px`,
          fontSize: `${sparkle.size}px`,
        }"
      >{{ sparkle.glyph }}</span>
    </div>
  </div>
</template>

<style scoped>
.effect-layer {
  position: fixed;
  inset: 0;
  z-index: 1;
}

.stars-layer .star {
  position: absolute;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  animation: twinkle 2.5s ease-in-out infinite;
}

.confetti-layer .confetti-bit {
  position: absolute;
  top: -6vh;
  width: 7px;
  height: 14px;
  border-radius: 9999px;
  opacity: 0.55;
  animation-name: confettiFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.firefly-layer .firefly {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: rgba(253, 224, 71, 0.85);
  box-shadow: 0 0 14px rgba(253, 224, 71, 0.8);
  animation: fireflyFloat 4s ease-in-out infinite;
}

.butterflies-layer .butterfly {
  position: absolute;
  left: -8%;
  font-size: 16px;
  opacity: 0.65;
  animation: butterflyFly 11s linear infinite;
}

.leaves-layer .leaf {
  position: absolute;
  top: -10vh;
  font-size: 18px;
  opacity: 0.6;
  animation-name: leafFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.sparkles-layer {
  position: fixed;
  inset: 0;
  z-index: 220;
}

.cursor-sparkle {
  position: fixed;
  transform: translate(-50%, -50%);
  animation: cursorSparkleFade 0.65s ease-out forwards;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 0.95; transform: scale(1.15); }
}

@keyframes confettiFall {
  0% { transform: translateY(-8vh) rotate(0deg); }
  100% { transform: translateY(110vh) rotate(300deg); }
}

@keyframes fireflyFloat {
  0%, 100% { transform: translate(0, 0); opacity: 0.3; }
  35% { transform: translate(10px, -16px); opacity: 1; }
  70% { transform: translate(-8px, -6px); opacity: 0.45; }
}

@keyframes butterflyFly {
  0% { transform: translateX(0) translateY(0) rotate(2deg); }
  30% { transform: translateX(38vw) translateY(-18px) rotate(-5deg); }
  65% { transform: translateX(72vw) translateY(16px) rotate(3deg); }
  100% { transform: translateX(120vw) translateY(-6px) rotate(-2deg); }
}

@keyframes leafFall {
  0% { transform: translateY(-12vh) rotate(0deg); }
  100% { transform: translateY(112vh) rotate(270deg); }
}

@keyframes cursorSparkleFade {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
  100% { opacity: 0; transform: translate(-50%, -65%) scale(0.55); }
}
</style>
