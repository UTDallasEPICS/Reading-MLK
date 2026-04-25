<script setup lang="ts">
import { onMounted } from 'vue'
import { authClient } from '~/utils/auth-client'
import type { Student, Announcement} from '~~/prisma/generated/client'

definePageMeta({ ssr: false })

// retrieve active student
const { student, settings: settings, restoreStudent } = useCurrentStudent()
const { totalFormsInGroup: totalForms, loadActiveFormGroup} = useCurrentFormGroup()
const { tickets: tickets, loadProgress} = useCurrentStudentProgress()
await loadActiveFormGroup()
await loadProgress()
const checkingStudent = ref(true)

onMounted(async () => {
  if (!student.value) {
    await restoreStudent()
  }

  if (!student.value) {
    await navigateTo('/reader/profile')
    return
  }

  checkingStudent.value = false
})


// ── Theme class ──
const themeClass = computed(() => {
  const t = 'light'
  const d = settings.value.dyslexiaFont ? 'dyslexia-font' : ''
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

//TODO 3
//Announcement fetch all currently-active announcements
const { data: announcements } = await useFetch<any[] | null>('/api/announcement?active=true')

//parseContent of announcement
function parseContent (raw: any): { icon: string; title: string; body: string } {
  if (raw && typeof raw === 'object') return raw as { icon: string; title: string; body: string }
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as { icon: string; title: string; body: string } }
    catch { return { icon: '📢', title: raw, body: '' } }
  }
  return { icon: '📢', title: '', body: '' }
}

//fmtDate - converts ISO string to a short, human-readable date e.g. "Apr 12, 2026"
function fmtDate (iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

//mostRecent - the newest active announcement sorted by postDate descending
const mostRecent = computed(() => {
  if (!announcements.value?.length) return null
  return [...announcements.value].sort(
    (a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
  )[0]
})

//Controls the "View All Announcements"
const showAllAnnouncements = ref(false)

const completionMessage = computed(() => {
  return ['', 'Nice!', 'Good Job!', 'Great Job!', 'Wow!', 'Awesome!', 'Amazing!'][tickets.value] ?? 'Spectacular!'
})
</script>

<template>
  <div :class="themeClass" :style="`font-size: ${settings.fontSize * 16}px`" class="pb-32 px-4 pt-4 min-h-screen">

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
          <span class="font-heading font-bold text-amber-600">{{ Number(student?.exp) }}</span>
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

        <!-- ANNOUNCEMENTS -->
        <div
          v-if="mostRecent"
          class="premium-card px-4 py-3"
          style="background: rgba(245,158,11,0.06); border-color: rgba(245,158,11,0.25);"
        >
          <div class="flex items-center gap-3">
            <span class="text-lg shrink-0">{{ parseContent(mostRecent.content).icon }}</span>
            <div class="flex-grow overflow-hidden">
              <p class="text-sm font-bold truncate" style="color: var(--brand-dark)">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase mr-2 text-gray-900" style="background: var(--brand-gold)">New</span>
                {{ parseContent(mostRecent.content).title }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5 truncate">{{ parseContent(mostRecent.content).body }}</p>
            </div>
            <!-- "View All" button always visible when there's at least one announcement -->
            <button
              @click="showAllAnnouncements = true"
              class="shrink-0 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all"
              style="background: rgba(245,158,11,0.18); color: var(--brand-dark); border: 1px solid rgba(245,158,11,0.3);"
            >
              View All ›
            </button>
          </div>
        </div>

        <!-- No active announcements -->
        <div
          v-else
          class="premium-card px-5 py-4 flex items-center gap-3"
          style="background: rgba(245,158,11,0.04); border-color: rgba(245,158,11,0.15);"
        >
          <span class="text-xl">📤</span>
          <p class="text-sm font-medium text-gray-400">No announcements right now. Check back later!</p>
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


    <!-- ALL ANNOUNCEMENTS -->
    <Transition name="modal-fade">
      <div v-if="showAllAnnouncements" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showAllAnnouncements = false" />

        <!-- Dialog box -->
        <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
          <!-- Header -->
          <div class="px-6 pt-6 pb-4 flex items-center justify-between shrink-0 border-b border-gray-100">
            <div>
              <h2 class="font-heading text-2xl font-bold" style="color: var(--brand-dark)">📢 Announcements</h2>
              <p class="text-xs text-gray-400 mt-0.5">{{ announcements?.length ?? 0 }} active</p>
            </div>
            <!-- ✕ close button -->
            <button
              @click="showAllAnnouncements = false"
              class="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Close announcements"
            >✕</button>
          </div>

          <!-- Scrollable announcement cards — sorted newest first -->
          <div class="overflow-y-auto px-6 py-5 space-y-4">
            <div
              v-for="ann in [...(announcements ?? [])].sort((a,b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime())"
              :key="ann.id"
              class="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-4 items-start"
            >
              <!-- Icon -->
              <div class="p-3 bg-indigo-50 rounded-xl text-3xl shrink-0 border border-indigo-100 shadow-sm flex items-center justify-center min-w-[56px] min-h-[56px]">
                {{ parseContent(ann.content).icon }}
              </div>
              <!-- Body -->
              <div class="flex-grow">
                <div class="flex flex-col gap-0.5 mb-2">
                  <h4 class="text-base font-bold text-gray-800">{{ parseContent(ann.content).title }}</h4>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {{ fmtDate(ann.postDate) }}{{ ann.expiryDate ? ' → ' + fmtDate(ann.expiryDate) : ' (Ongoing)' }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 font-medium leading-relaxed">{{ parseContent(ann.content).body }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@import './reader.css';
</style>