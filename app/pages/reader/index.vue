<script setup lang="ts">
definePageMeta({ ssr: false })

// ── Student + data loading ────────────────────────────────────────────────────
const { student, settings, restoreStudent } = useCurrentStudent()
const { classes, totalTickets, loadClasses } = useStudentClasses()

const dataLoaded    = ref(false)
const announcements = ref<any[]>([])

onMounted(async () => {
  if (!student.value) await restoreStudent()
  if (!student.value) { await navigateTo('/reader/profile'); return }

  // Load data in parallel — same pattern as forms.vue
  const [anns] = await Promise.all([
    $fetch<any[]>('/api/announcement', {
      query: { active: 'true', studentId: student.value.id },
    }).catch(() => []),
    loadClasses(),
  ])
  announcements.value = Array.isArray(anns) ? anns : []
  dataLoaded.value = true
})

// ── Theme class ──────────────────────────────────────────────────────────────
const themeClass = computed(() => {
  const d = settings.value.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app light ${d}`.trim()
})

// ── Badge click animations ────────────────────────────────────────────────────
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

// ── Announcements helpers ─────────────────────────────────────────────────────
function parseContent(raw: any): { icon: string; title: string; body: string } {
  if (raw && typeof raw === 'object') return raw as { icon: string; title: string; body: string }
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as { icon: string; title: string; body: string } }
    catch { return { icon: '📢', title: raw, body: '' } }
  }
  return { icon: '📢', title: '', body: '' }
}

function fmtDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Per-class announcement partitioning (mirrors forms.vue) ─────────────────
const collapsedAnnouncementClasses = ref<Record<string, boolean>>({})
function toggleAnnouncementClass(classId: string) {
  collapsedAnnouncementClasses.value[classId] = !collapsedAnnouncementClasses.value[classId]
}

const announcementsByClass = computed(() =>
  classes.value.map(cls => ({
    ...cls,
    classAnnouncements: [...announcements.value]
      .filter(ann => ann.class === cls.id)
      .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()),
  }))
)

// Banner: strictly the most recent announcement across all enrolled classes
const bannerAnnouncement = computed(() => {
  if (!announcements.value.length) return null
  return [...announcements.value].sort(
    (a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
  )[0]
})

const showAllAnnouncements = ref(false)

// ── Join a Class modal ────────────────────────────────────────────────────────
const showJoinModal = ref(false)
const joinToken     = ref('')
const joinLoading   = ref(false)
const joinError     = ref('')
const joinSuccess   = ref('')

function openJoinModal() {
  joinToken.value   = ''
  joinError.value   = ''
  joinSuccess.value = ''
  showJoinModal.value = true
}

async function submitJoin() {
  if (!student.value?.id || !joinToken.value.trim()) return
  joinLoading.value = true
  joinError.value   = ''
  joinSuccess.value = ''
  try {
    const result = await $fetch<{ name: string }>('/api/reader/join-class', {
      method: 'POST',
      body: { studentId: student.value.id, joinToken: joinToken.value.trim() },
    })
    joinSuccess.value = `You joined "${result.name}"! 🎉`
    joinToken.value = ''
    await refreshNuxtData()
  } catch (e: any) {
    joinError.value = e?.data?.statusMessage ?? e?.statusMessage ?? 'Class not found. Check the code and try again.'
  } finally {
    joinLoading.value = false
  }
}
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

        <!-- Join a Class button -->
        <button
          id="join-class-btn"
          @click="openJoinModal"
          class="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md border-2"
          style="background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); border-color:rgba(224,96,77,0.3); color:var(--brand-indigo);"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Join Class
        </button>
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
          <span class="font-heading font-bold" style="color:var(--brand-mint)">{{ totalTickets }}</span>
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

      <!-- Loading -->
      <div v-if="!dataLoaded" class="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div class="text-6xl animate-bounce">📢</div>
        <p class="font-heading text-xl font-bold text-gray-400">Loading...</p>
      </div>

      <section v-else class="h-full flex flex-col justify-between gap-4 pb-4">

        <!-- Welcome heading -->
        <div class="text-center py-4">
          <h1 class="font-heading text-5xl font-bold mb-1" style="color: var(--brand-dark)">Welcome Back! 👋</h1>
          <p class="text-lg text-gray-500 font-medium">Ready for today's reading adventure?</p>
        </div>

        <!-- ANNOUNCEMENTS BANNER -->
        <div
          v-if="bannerAnnouncement"
          class="premium-card px-4 py-3 cursor-pointer hover:scale-[1.01] transition-all"
          style="background: rgba(245,158,11,0.06); border-color: rgba(245,158,11,0.25);"
          @click="showAllAnnouncements = true"
        >
          <div class="flex items-center gap-3">
            <span class="text-lg shrink-0">{{ parseContent(bannerAnnouncement.content).icon }}</span>
            <div class="flex-grow overflow-hidden">
              <p class="text-sm font-bold truncate" style="color: var(--brand-dark)">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase mr-2 text-gray-900" style="background: var(--brand-gold)">New</span>
                {{ parseContent(bannerAnnouncement.content).title }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5 truncate"><span v-html="parseContent(bannerAnnouncement.content).body"></span></p>
            </div>
            <button
              class="shrink-0 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all"
              style="background: rgba(245,158,11,0.18); color: var(--brand-dark); border: 1px solid rgba(245,158,11,0.3);"
            >View All ›</button>
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

        <!-- Daily Form CTA -->
        <NuxtLink
          to="/reader/forms"
          class="w-full rounded-3xl p-6 text-white text-left group cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg block"
          style="background: linear-gradient(135deg, #E0604D 0%, #c94a38 100%); border-bottom: 6px solid #a83d2e; text-decoration: none;"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Today's Challenge</p>
              <h3 class="font-heading text-3xl font-black">Start Your Daily Form 📝</h3>
              <p class="text-base opacity-80 mt-1 font-medium">Keep up the great work!</p>
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


    <!-- ── ANNOUNCEMENTS MODAL ── -->
    <Transition name="modal-fade">
      <div v-if="showAllAnnouncements" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showAllAnnouncements = false" />

        <!-- Dialog -->
        <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
          <!-- Header -->
          <div class="px-6 pt-6 pb-4 flex items-center justify-between shrink-0 border-b border-gray-100">
            <div>
              <h2 class="font-heading text-2xl font-bold" style="color: var(--brand-dark)">📢 Announcements</h2>
              <p class="text-xs text-gray-400 mt-0.5">{{ announcements.length }} active across all classes</p>
            </div>
            <button
              @click="showAllAnnouncements = false"
              class="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Close announcements"
            >✕</button>
          </div>

          <!-- Per-class sections inside the modal -->
          <div class="overflow-y-auto px-6 py-5 space-y-5">

            <!-- No classes -->
            <div v-if="announcementsByClass.length === 0" class="text-center py-10 text-gray-400">
              <p class="font-medium text-sm">No classes found.</p>
            </div>

            <div v-for="cls in announcementsByClass" :key="cls.id">
              <!-- Class header -->
              <button
                class="class-header w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 mb-2"
                :class="cls.isFriendsOfMLK ? 'class-header--mlk' : 'class-header--normal'"
                @click="toggleAnnouncementClass(cls.id)"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <svg
                    class="w-4 h-4 shrink-0 transition-transform duration-200"
                    :class="collapsedAnnouncementClasses[cls.id] ? '' : 'rotate-90'"
                    fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span class="font-heading font-bold text-base truncate" :class="cls.isFriendsOfMLK ? 'text-white' : ''">{{ cls.name }}</span>
                </div>
                <span class="font-heading font-black text-base tabular-nums" :class="cls.isFriendsOfMLK ? 'text-white' : ''">
                  📢 {{ cls.classAnnouncements.length }}
                </span>
              </button>

              <!-- Announcements for this class -->
              <Transition name="class-expand">
                <div v-if="!collapsedAnnouncementClasses[cls.id]" class="space-y-2">
                  <!-- Empty -->
                  <div
                    v-if="cls.classAnnouncements.length === 0"
                    class="px-4 py-3 rounded-2xl flex items-center gap-3"
                    style="background:rgba(245,158,11,0.04); border:1px solid rgba(245,158,11,0.15);"
                  >
                    <span>📭</span>
                    <p class="text-sm text-gray-400">No announcements for this class right now.</p>
                  </div>

                  <!-- Cards -->
                  <div
                    v-for="ann in cls.classAnnouncements"
                    :key="ann.id"
                    class="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-4 items-start"
                  >
                    <div class="p-3 rounded-xl text-2xl shrink-0 border flex items-center justify-center min-w-[48px] min-h-[48px]"
                         style="background:rgba(245,158,11,0.12); border-color:rgba(245,158,11,0.2)">
                      {{ parseContent(ann.content).icon }}
                    </div>
                    <div class="flex-grow min-w-0">
                      <div class="flex items-start justify-between gap-2 mb-1">
                        <h4 class="text-sm font-bold text-gray-800">{{ parseContent(ann.content).title }}</h4>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
                          {{ fmtDate(ann.postDate) }}{{ ann.expiryDate ? ' → ' + fmtDate(ann.expiryDate) : ' (Ongoing)' }}
                        </span>
                      </div>
                      <p v-if="parseContent(ann.content).body" class="text-sm text-gray-500 font-medium leading-relaxed">
                        <span v-html="parseContent(ann.content).body"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="modal-fade">
      <div v-if="showJoinModal" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showJoinModal = false" />

        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="px-6 pt-6 pb-4 flex items-center justify-between shrink-0 border-b border-gray-100">
            <div>
              <h2 class="font-heading text-2xl font-bold" style="color: var(--brand-dark)">🏫 Join a Class</h2>
              <p class="text-xs text-gray-400 mt-0.5">Enter the class code your reading coach gave you!</p>
            </div>
            <button
              @click="showJoinModal = false"
              class="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Close"
            >✕</button>
          </div>

          <!-- Body -->
          <div class="px-6 py-6 space-y-4">
            <!-- Success state -->
            <div v-if="joinSuccess" class="p-4 rounded-2xl text-center space-y-3" style="background:rgba(45,212,191,0.1); border:2px solid rgba(45,212,191,0.3)">
              <div class="text-4xl">🎉</div>
              <p class="font-heading font-bold text-lg" style="color:var(--brand-dark)">{{ joinSuccess }}</p>
              <p class="text-sm text-gray-500">Head over to Forms to see your new class!</p>
              <button
                @click="showJoinModal = false"
                class="btn-fun text-white px-8 py-2 rounded-xl font-bold text-sm shadow"
                style="background:var(--brand-mint)"
              >Done ✓</button>
            </div>

            <!-- Input form -->
            <template v-else>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-gray-600" for="join-token-input">Class Code</label>
                <input
                  id="join-token-input"
                  v-model="joinToken"
                  type="text"
                  placeholder="Paste or type the code here…"
                  class="w-full px-4 py-3 rounded-2xl border-2 font-bold text-gray-700 outline-none transition-all text-sm"
                  style="border-color: rgba(224,96,77,0.25);"
                  :style="joinError ? 'border-color: rgba(239,68,68,0.5); background:rgba(239,68,68,0.04)' : ''"
                  @focus="(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--brand-indigo)'"
                  @blur="(e) => (e.target as HTMLInputElement).style.borderColor = joinError ? 'rgba(239,68,68,0.5)' : 'rgba(224,96,77,0.25)'"
                  @keydown.enter="submitJoin"
                />
                <!-- Error message -->
                <p v-if="joinError" class="text-xs font-bold text-red-500 px-1">⚠️ {{ joinError }}</p>
              </div>

              <div class="flex gap-3 pt-1">
                <button
                  @click="showJoinModal = false"
                  class="flex-1 py-3 rounded-2xl font-bold text-sm text-gray-500 border-2 border-gray-200 hover:bg-gray-50 transition"
                >Cancel</button>
                <button
                  @click="submitJoin"
                  :disabled="!joinToken.trim() || joinLoading"
                  class="flex-1 btn-fun text-white py-3 rounded-2xl font-bold text-sm shadow-lg disabled:opacity-50"
                  style="background:var(--brand-indigo)"
                >
                  {{ joinLoading ? 'Joining…' : 'Join Class 🚀' }}
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>


<style>
@import './reader.css';
</style>
