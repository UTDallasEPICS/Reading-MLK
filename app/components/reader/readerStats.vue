<script setup lang="ts">

defineProps<{
  'tickets': Number,
  'xp': Number
}>()

// ── Click-triggered badge animations ──
const xpClicked     = ref(false)
const ticketClicked = ref(false)
const burstCoins    = ref<{id:number; tx:number; ty:number}[]>([])
const flyTickets    = ref<number[]>([])

function triggerXpClick() {
  xpClicked.value = true
  burstCoins.value = [
    { id: Date.now(),     tx: -32, ty: -40 },
    { id: Date.now() + 1, tx:   0, ty: -48 },
    { id: Date.now() + 2, tx:  32, ty: -40 },
  ]
  setTimeout(() => { xpClicked.value = false; burstCoins.value = [] }, 800)
}


function triggerTicketClick() {
  ticketClicked.value = true
  flyTickets.value = [Date.now()]
  setTimeout(() => { ticketClicked.value = false; flyTickets.value = [] }, 1000)
}
</script>
<template>
  <!-- XP + Tickets badge + settings -->
  <div class="flex items-center gap-3">
  <!-- XP badge — click triggers star spin + coin burst -->
    <div
      class="relative bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border-2 flex items-center gap-3 cursor-pointer select-none transition-all"
      style="border-color: rgba(245,158,11,0.3)"
      :class="(xpClicked || ticketClicked) ? 'scale-90 transition-transform duration-100' : 'transition-transform duration-100'"
      @click="triggerXpClick"
    >
    <span class="text-lg" :class="xpClicked ? 'animate-star-spin' : ''">🪙</span>
      <span class="font-heading font-bold text-amber-600">{{xp}}</span>
      <span class="text-gray-300">|</span>
      <span class="text-lg" :class="ticketClicked ? 'animate-ticket-wobble' : ''" @click.stop="triggerTicketClick">🎟️</span>
      <span class="font-heading font-bold" style="color:var(--brand-mint)">{{tickets}}</span>
      <span v-for="c in burstCoins" :key="c.id" class="absolute text-sm animate-coin-burst"
        :style="`--tx:${c.tx}px;--ty:${c.ty}px;left:50%;top:50%;`">🪙</span>
      <Transition name="box-pop">
        <span 
          v-if="ticketClicked"
          class="absolute -bottom-15 left-1/2 text-2xl animate-box-shake pointer-events-none">
          📦
        </span>
      </Transition>
      <span v-for="id in flyTickets" :key="id" class="absolute text-lg animate-ticket-fly pointer-events-none"
        style="left:50%;top:50%;transform:translateX(-50%) translateY(-50%)">🎟️</span>
    </div>

    <NuxtLink to="/reader/settings"
    class="w-14 h-14 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl transition-all border-2 border-white shadow-xl hover:scale-110 active:scale-95 hover:text-[var(--brand-indigo)]">
    ⚙️
    </NuxtLink>
  </div>
</template>