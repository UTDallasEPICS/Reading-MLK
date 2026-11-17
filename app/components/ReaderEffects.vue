<script setup lang="ts">
const { settings } = useCurrentStudent()
const effects: Record<string, { symbols: string[]; motion: string }> = {
  'Twinkling Stars': { symbols: ['⭐', '🌟', '✦'], motion: 'twinkle' },
  'Confetti Rain': { symbols: ['🟣', '🟡', '🟢', '🔴', '🔵'], motion: 'confetti' },
  Fireflies: { symbols: [''], motion: 'firefly' },
  'Falling Leaves': { symbols: ['🍂', '🍁'], motion: 'leaf' },
}
type Particle = { id: number; name: string; symbol: string; motion: string; x: number; y: number; dx: number; dy: number; rotation: number }
const particles = ref<Particle[]>([])
let nextId = 0
let lastEmission = -Infinity
let reducedMotion: MediaQueryList | undefined

function clearTrail() {
  particles.value = []
  lastEmission = -Infinity
}
function followPointer(event: PointerEvent) {
  if (event.pointerType === 'touch' || reducedMotion?.matches) return
  const now = performance.now()
  if (now - lastEmission < 45) return
  lastEmission = now
  const emitted: Particle[] = []
  for (const name of settings.value.activeAnimations) {
    const effect = effects[name]
    if (!effect) continue
    const id = nextId++
    emitted.push({
      id, name, symbol: effect.symbols[id % effect.symbols.length]!, motion: effect.motion,
      x: event.clientX + (Math.random() - .5) * 12,
      y: event.clientY + (Math.random() - .5) * 12,
      dx: (Math.random() - .5) * 70,
      dy: ['confetti', 'leaf'].includes(effect.motion) ? 35 + Math.random() * 45 : -25 - Math.random() * 45,
      rotation: (Math.random() - .5) * 180,
    })
  }
  // Bound the work even with several equipped effects and constant movement.
  particles.value = [...particles.value, ...emitted].slice(-96)
}
function removeParticle(id: number) {
  particles.value = particles.value.filter(particle => particle.id !== id)
}
watch(() => settings.value.activeAnimations, () => {
  particles.value = particles.value.filter(particle => settings.value.activeAnimations.includes(particle.name))
})
onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.addEventListener('change', clearTrail)
  window.addEventListener('pointermove', followPointer, { passive: true })
  window.addEventListener('blur', clearTrail)
})
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', followPointer)
  window.removeEventListener('blur', clearTrail)
  reducedMotion?.removeEventListener('change', clearTrail)
  clearTrail()
})
</script>

<template>
  <div aria-hidden="true" class="reader-effects">
    <span v-for="particle in particles" :key="particle.id"
      :class="['trail-particle', `trail-${particle.motion}`]"
      :style="{ left: `${particle.x}px`, top: `${particle.y}px`, '--dx': `${particle.dx}px`, '--dy': `${particle.dy}px`, '--rotation': `${particle.rotation}deg` }"
      @animationend="removeParticle(particle.id)">{{ particle.symbol }}</span>
  </div>
</template>

<style scoped>
.reader-effects { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 250; }
.trail-particle { position: absolute; font-size: 1.2rem; line-height: 1; user-select: none; animation: trail-drift 850ms ease-out forwards; }
.trail-twinkle { color: #fbbf24; filter: drop-shadow(0 0 5px #fcd34d); animation-name: trail-twinkle; }
.trail-confetti { font-size: .65rem; animation: trail-confetti 1100ms ease-out forwards; }
.trail-leaf { font-size: 1.7rem; animation-duration: 1100ms; }
.trail-firefly {
  width: 9px; height: 9px; border-radius: 50%;
  background: radial-gradient(circle, #ffedd5 0 15%, #fb923c 40%, #ea580c 75%);
  box-shadow: 0 0 5px 2px #f97316, 0 0 13px 4px #fb923c88;
  animation: trail-firefly 1500ms ease-out forwards;
}
@keyframes trail-drift {
  from { opacity: .9; transform: translate(-50%, -50%) scale(.7); }
  to { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rotation)) scale(.2); }
}
@keyframes trail-confetti {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  60% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rotation)) scale(.65); }
}
@keyframes trail-twinkle {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(.2); }
  20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rotation)) scale(.1); }
}
@keyframes trail-firefly {
  0% { opacity: .15; transform: translate(-50%, -50%) scale(.65); }
  18% { opacity: 1; }
  38% { opacity: .15; }
  58% { opacity: 1; }
  78% { opacity: .2; }
  88% { opacity: .8; }
  100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(.6); }
}
@media (prefers-reduced-motion: reduce) { .reader-effects { display: none; } }
</style>
