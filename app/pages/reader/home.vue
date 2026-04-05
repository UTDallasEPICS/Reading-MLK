<script setup lang="ts">
import StatsBar from '~/components/StatsBar.vue'
import type { Student, Announcement} from '~~/prisma/generated/client'

definePageMeta({ ssr: false })
/* TODO:
  3 Announcements
    -- default display for no announcements
    -- change display to be larger
    -- change display to show the most recent announcement with a dropdown to show all
 
  5 find and apply unlocked shop items from selected student
*/

//TODO 4 retrieve active student
const { student, settings: globalSettings, loadStudent } = useCurrentStudent()
const { totalFormsInGroup: totalForms, loadActiveFormGroup} = useCurrentFormGroup()
const { tickets: tickets, loadProgress} = useCurrentStudentProgress()
await loadStudent(2)
await loadActiveFormGroup()
await loadProgress()

// ── Theme class ──
const themeClass = computed(() => {
  const t = 'light'
  const d = globalSettings.value.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app ${t} ${d}`.trim()
})

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

const { data: announcements } = await useFetch<Announcement[] | null>('/api/announcement?active=true')

const completionMessage = computed(() => {
  return ['', 'Nice!', 'Good Job!', 'Great Job!', 'Wow!', 'Awesome!', 'Amazing!'][tickets.value] ?? 'Spectacular!'
})
</script>

<template>
  <div :class="themeClass" :style="`font-size: ${globalSettings.fontSize * 16}px`" class="pb-32 px-4 pt-4 min-h-screen">

    <!-- ── TOP BAR ── -->
    <header class="max-w-4xl mx-auto flex justify-between items-center mb-8 px-2 relative z-[200]">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-heading font-bold text-2xl shadow-lg"
             style="background: var(--brand-indigo)">L</div>
        <div class="flex flex-col">
          <span class="font-heading font-bold text-2xl tracking-tight leading-none" style="color: var(--brand-dark)">
            Reading<span style="color: var(--brand-indigo)">Huddle</span>
          </span>
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--brand-mint)">Reading Buddy</span>
        </div>
      </div>

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
          <span class="font-heading font-bold text-amber-600">{{ student?.exp }}</span>
          <span class="text-gray-300">|</span>
          <span class="text-lg" :class="ticketClicked ? 'animate-ticket-wobble' : ''" @click.stop="triggerTicketClick">🎟️</span>
          <span class="font-heading font-bold" style="color:var(--brand-mint)">{{ tickets }}</span>
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

        <!-- Settings button TODO 7-->
        <NuxtLink
          to="/reader/settings"
          class="w-14 h-14 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl transition-all border-2 border-white shadow-xl hover:scale-110 active:scale-95"
          style="hover:color: var(--brand-indigo)"
        >⚙️</NuxtLink>
      </div>
    </header>

    <!-- ── MAIN CONTENT ── -->
    <main class="max-w-4xl mx-auto min-h-[60vh]">
      <section class="h-full flex flex-col justify-between gap-4 pb-4">

        <!-- Welcome heading -->
        <div class="text-center py-4">
          <h1 class="font-heading text-5xl font-bold mb-1" style="color: var(--brand-dark)">Welcome Back! 👋</h1>
          <p class="text-lg text-gray-500 font-medium">Ready for today's reading adventure?</p>
        </div>

        <!-- Announcements Ticker TODO 3-->
        <div v-if="announcements && announcements.length > 0" class="premium-card px-5 py-3" style="background: rgba(245,158,11,0.05); border-color: rgba(245,158,11,0.2)">
          <div class="flex items-center gap-3">
            <span class="text-xl">📢</span>
            <div class="flex-grow overflow-hidden">
              <p class="text-sm font-bold truncate" style="color: var(--brand-dark)">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase mr-2 text-gray-900" style="background: var(--brand-gold)">New</span>
                {{announcements[0]?.content}}
              </p>
            </div>
          </div>
        </div>

        <!-- Daily Form CTA TODO 2-->
        <NuxtLink
          to="/reader/forms"
          class="w-full rounded-3xl p-6 text-white text-left group cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg block"
          style="background: linear-gradient(135deg, #E0604D 0%, #c94a38 100%); border-bottom: 6px solid #a83d2e; text-decoration: none;"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Today's Challenge</p>
              <h3 class="font-heading text-3xl font-black">Start Your Daily Form 📝</h3>
              <p class="text-base opacity-80 mt-1 font-medium">
                {{ tickets }} out of {{ totalForms }} completed this week.
                {{ completionMessage }}
              </p>
            </div>
            <span class="text-5xl group-hover:translate-x-2 transition-transform duration-300">➜</span>
          </div>
        </NuxtLink>
      </section>
    </main>

    <!-- ── LEFT / RIGHT ARROWS ── -->
    <!-- Left: Store -->
    <NuxtLink
      to="/reader/decor"
      class="fixed left-2 top-1/2 -translate-y-1/2 z-[100] p-2 flex items-center gap-1 transition-all cursor-pointer group"
      style="color: rgba(224,96,77,0.6); text-decoration:none;"
    >
      <svg class="w-12 h-16 group-hover:-translate-x-1 transition-transform drop-shadow-md" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="text-sm font-bold uppercase tracking-wide">Store</span>
    </NuxtLink>

    <!-- Right: Forms -->
    <NuxtLink
      to="/reader/forms"
      class="fixed right-2 top-1/2 -translate-y-1/2 z-[100] p-2 flex items-center gap-1 transition-all cursor-pointer group"
      style="color: rgba(224,96,77,0.6); text-decoration:none;"
    >
      <span class="text-sm font-bold uppercase tracking-wide">Forms</span>
      <svg class="w-12 h-16 group-hover:translate-x-1 transition-transform drop-shadow-md" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </NuxtLink>
  </div>
</template>

<style>
@import './reader.css';
</style>
