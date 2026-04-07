<script setup lang="ts">
import { onMounted } from 'vue'
import { authClient } from '~/utils/auth-client'

definePageMeta({ ssr: false })
/* TODO:
  1 change settings option to switch profiles into a redirect to teh profile selection page

  2 calculations/parsing for selected student
    -- streak    (decide between daily and weekly)
    -- tickets    (raffle entries, number of forms completed during the current form group))
    -- completed forms in form group

  3 Announcements
    -- get active announcements
    -- change display to be larger
    -- change display to show the most recent announcement with a dropdown to show all
 
  4 get student selected from previous page
    -- should come from session, nuxt store, or be passed as a param from previous page, could also use a tool like pinia or may also be a function of auth
  5 find and apply unlocked shop items from selected student

  6 make progress bar dynamic based on form group size and completed forms.
*/

//TODO 4 retrieve active student
const { student, restoreStudent } = useCurrentStudent()
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

//Logout
const { clearStudent } = useCurrentStudent()

async function logout() {
  try {
    clearStudent()

    await authClient.signOut()

    await navigateTo('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
 
//TODO 2 parse settings from student
const settings = computed(() => {
  const raw = student.value?.settings as any || {}

  return {
    dyslexiaFont: !!raw.dyslexiaFont,
    language: raw.language || 'en',
    fontSize: Number(raw.fontSize) || 1,
  }
})

//TODO 2 calculate stats from student data
const stats = {
  xp: computed(() => student.value?.exp ?? 0),
  streak: 0,   // we'll implement later
  tickets: 0,  // will come from submissions later
}

const showSettings = ref(false)

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
// Announcements 
const announcements = computed(() => [
  {
    id: 1,
    title: 'New Book Added!',
    content: student.value?.name ?? 'Student',
    icon: '📚',
  },
  {
    id: 2,
    title: 'Raffle Winners Announced!',
    content: 'Congrats to our latest raffle winners! 🎉',
    icon: '🎟️',
  },
])

//TODO 2
//  Weekly forms progress 
const thisWeekForms = ref([
  { id: 201, day: 'Monday',    dayNum: 1, missed: true  },
  { id: 202, day: 'Tuesday',   dayNum: 2, missed: true  },
  { id: 203, day: 'Wednesday', dayNum: 3, missed: false },
  { id: 204, day: 'Thursday',  dayNum: 4, missed: false },
  { id: 205, day: 'Friday',    dayNum: 5, missed: false },
])
const completedWeeks = ref<number[]>([201, 202])

const completedThisWeek = computed(() =>
  completedWeeks.value.filter(id => thisWeekForms.value.some(f => f.id === id))
)

const completionMessage = computed(() => {
  const n = completedThisWeek.value.length
  return ['', 'Nice!', 'Good Job!', 'Great Job!', 'Wow!', 'Awesome!', 'Amazing!'][n] ?? 'Spectacular!'
})
</script>

<template>
  <div v-if="checkingStudent" class="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
    <p class="text-gray-500 font-semibold text-lg">Loading reader...</p>
  </div>

  <div
    v-else
    :class="themeClass"
    :style="`font-size: ${settings.fontSize * 16}px`"
    class="pb-32 px-4 pt-4 min-h-screen"
  >
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
          :class="xpClicked ? 'scale-90' : ''"
          @click="triggerXpClick"
        >
          <span class="text-lg" :class="xpClicked ? 'animate-star-spin' : ''">⭐</span>
          <span class="font-heading font-bold text-amber-600">{{ stats.xp }}</span>
          <span class="text-gray-300">|</span>
          <span class="text-lg" :class="ticketClicked ? 'animate-ticket-wobble' : ''">🎟️</span>
          <span class="font-heading font-bold" style="color: var(--brand-mint)">{{ stats.tickets }}</span>

          <!-- Burst coins on XP click -->
          <span
            v-for="c in burstCoins" :key="c.id"
            class="absolute text-sm animate-coin-burst"
            :style="`--tx:${c.tx}px; --ty:${c.ty}px; left:50%; top:50%;`"
          >🪙</span>
        </div>

        <!-- Settings button -->
        <button
          @click="showSettings = !showSettings"
          class="w-14 h-14 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl transition-all border-2 border-white shadow-xl hover:scale-110 active:scale-95"
        >
          ⚙️
        </button>
      </div>
    </header>

    <!-- ── MAIN CONTENT ── -->
    <main class="max-w-4xl mx-auto min-h-[60vh]">
      <section class="h-full flex flex-col justify-between gap-4 pb-4">

        <!-- Welcome heading -->
        <div class="text-center py-4">
          <h1 class="font-heading text-5xl font-bold mb-1" style="color: var(--brand-dark)">Welcome Back, {{ student?.name }}! 👋</h1>
          <p class="text-lg text-gray-500 font-medium">Ready for today's reading adventure?</p>
        </div>

        <!-- Announcements Ticker TODO 3-->
        <div
          v-if="announcements.length > 0"
          class="premium-card px-5 py-3"
          style="background: rgba(245,158,11,0.05); border-color: rgba(245,158,11,0.2)"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">📢</span>

            <div class="flex-grow overflow-hidden">
              <p class="text-sm font-bold truncate" style="color: var(--brand-dark)">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase mr-2 text-gray-900"
                  style="background: var(--brand-gold)"
                >
                  New
                </span>
                {{ announcements[0]?.title }} — {{ announcements[0]?.content }}
              </p>
            </div>

            <span class="text-lg">{{ announcements[0]?.icon }}</span>
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
                {{ completedThisWeek.length }} out of {{ thisWeekForms.length }} completed this week.
                {{ completionMessage }}
              </p>
            </div>
            <span class="text-5xl group-hover:translate-x-2 transition-transform duration-300">➜</span>
          </div>
        </NuxtLink>
        <!-- TODO 6-->>
        <!-- 7-Day Raffle Progress -->
        <div class="premium-card p-5 bg-white/80" style="border: 2px solid rgba(224,96,77,0.1)">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-heading font-black text-base flex items-center gap-2" style="color: var(--brand-dark)">
              🎟️ Weekly Raffle Progress
            </h3>
            <span class="text-sm font-bold text-gray-400">
              {{ completedThisWeek.length }} / {{ thisWeekForms.length }} days
            </span>
          </div>

          <div class="flex items-center justify-between gap-2">
            <div v-for="form in thisWeekForms" :key="form.id" class="flex-1 flex flex-col items-center gap-1">
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm"
                :class="
                  completedWeeks.includes(form.id)
                    ? 'text-white scale-110'
                    : form.missed
                      ? 'text-amber-500 border-2 border-amber-300 border-dashed bg-amber-100'
                      : 'text-gray-300 border-2 border-gray-200 bg-gray-100'
                "
                :style="completedWeeks.includes(form.id) ? `background: var(--brand-mint)` : ''"
              >
                <span v-if="completedWeeks.includes(form.id)">✓</span>
                <span v-else>{{ form.dayNum }}</span>
              </div>
              <span class="text-[10px] font-bold text-gray-400 uppercase">{{ form.day.substring(0,3) }}</span>
            </div>
          </div>

          <div class="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              style="background: linear-gradient(to right, var(--brand-mint), var(--brand-indigo))"
              :style="`width: ${(completedThisWeek.length / thisWeekForms.length) * 100}%`"
            />
          </div>
          <p v-if="completedThisWeek.length === thisWeekForms.length"
             class="text-center font-bold mt-2 text-sm animate-pop"
             style="color: var(--brand-mint)">
            🎉 All done this week! Your raffle ticket is in!
          </p>
        </div>

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

    <!-- ── SETTINGS PANEL (slide-up) ── -->
    <Transition name="slide-up">
      <div v-if="showSettings" class="fixed inset-0 z-50 flex flex-col justify-end">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showSettings = false" />
        <div class="relative rounded-t-[2.5rem] p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto bg-white">
          <div class="w-12 h-1.5 rounded-full bg-gray-300 mx-auto -mt-2" />
          <div class="text-center mb-2">
            <div class="text-5xl mb-3">⚙️</div>
            <h2 class="font-heading text-3xl font-bold" style="color: var(--brand-dark)">Settings</h2>
          </div>

          <!-- Kid profiles TODO 1-->
          <div>
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Profile
            </label>

            <button
              @click="navigateTo('/reader/profile')"
              class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold">
                  {{ student?.name?.charAt(0).toUpperCase() }}
                </div>
                <span class="font-bold text-gray-800">
                  {{ student?.name }}
                </span>
              </div>

              <span class="text-gray-400 font-bold">Switch</span>
            </button>
          </div>

          <!-- Font size -->
          <div>
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Text Size</label>
            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span class="text-sm font-bold text-gray-400">A</span>
              <input type="range" min="1" max="1.5" step="0.1" v-model.number="settings.fontSize"
                     class="flex-grow h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-indigo" />
              <span class="text-xl font-bold text-gray-400">A</span>
              <span class="text-xs font-bold px-2 py-1 rounded-lg" style="color: var(--brand-indigo); background: rgba(224,96,77,0.1)">
                {{ Math.round(settings.fontSize * 100) }}%
              </span>
            </div>
          </div>

          <!-- Dyslexia font -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 class="font-bold" style="color: var(--brand-dark)">Dyslexia-Friendly Font</h4>
              <p class="text-xs text-gray-400">Uses OpenDyslexic typeface</p>
            </div>
            <button
              @click="settings.dyslexiaFont = !settings.dyslexiaFont"
              class="w-14 h-8 rounded-full transition-all relative"
              :style="settings.dyslexiaFont ? `background: var(--brand-mint)` : 'background: #d1d5db'"
            >
              <div class="w-6 h-6 bg-white rounded-full shadow-md absolute top-1 transition-all"
                   :class="settings.dyslexiaFont ? 'right-1' : 'left-1'" />
            </button>
          </div>

          <!-- Language -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 class="font-bold" style="color: var(--brand-dark)">Language / Idioma</h4>
              <p class="text-xs text-gray-400">{{ settings.language === 'en' ? 'English' : 'Español' }}</p>
            </div>
            <button
              @click="settings.language = settings.language === 'en' ? 'es' : 'en'"
              class="px-4 py-2 rounded-xl font-bold text-sm transition"
              style="background: rgba(224,96,77,0.1); color: var(--brand-indigo)"
            >
              {{ settings.language === 'en' ? '🇪🇸 Español' : '🇺🇸 English' }}
            </button>
          </div>
          <button
            @click="logout"
            class="w-full py-4 rounded-2xl font-heading font-bold text-lg border-2 border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition active:scale-95"
          >
            Log Out
          </button>

          <button @click="showSettings = false"
            class="w-full py-4 rounded-2xl font-heading font-bold text-lg text-white transition transform active:scale-95 shadow-lg hover:bg-black"
            style="background: var(--brand-dark)"
          >Done ✓</button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style>
@import './reader.css';
</style>
