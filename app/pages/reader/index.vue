<script setup lang="ts">
  import { onMounted } from 'vue'
  import { authClient } from '~/utils/auth-client'
  import type { Student, Announcement } from '~~/prisma/generated/client'

  definePageMeta({ ssr: false })

  // Retrieve the active student.
  const { student, settings: settings, restoreStudent } = useCurrentStudent()
  const { totalFormsInGroup: totalForms, loadActiveFormGroup } = useCurrentFormGroup()
  const { completedFormIds, loadProgress } = useCurrentStudentProgress()
  const checkingStudent = ref(true)

  onMounted(async () => {
    if (!student.value) {
      await restoreStudent()
    }

    if (!student.value) {
      await navigateTo('/reader/profile')
      return
    }

    await loadActiveFormGroup()
    await loadProgress()
    checkingStudent.value = false
  })

  // ── Theme class ──
  const themeClass = computed(() => {
    const t = settings.value.theme !== 'light' ? `theme-${settings.value.theme}` : ''
    const d = settings.value.dyslexiaFont ? 'dyslexia-font' : ''
    return `reader-app ${t} ${d}`.trim()
  })

  // ── Click-triggered badge animations ──
  const xpClicked = ref(false)
  const burstCoins = ref<{ id: number; tx: number; ty: number }[]>([])

  function triggerXpClick() {
    xpClicked.value = true
    burstCoins.value = [
      { id: Date.now(), tx: -32, ty: -40 },
      { id: Date.now() + 1, tx: 0, ty: -48 },
      { id: Date.now() + 2, tx: 32, ty: -40 },
    ]
    setTimeout(() => {
      xpClicked.value = false
      burstCoins.value = []
    }, 800)
  }

  //TODO 3
  //Announcement fetch all currently-active announcements
  const { data: announcements } = await useFetch<any[] | null>('/api/announcement?active=true')

  //parseContent of announcement
  function parseContent(raw: any): { icon: string; title: string; body: string } {
    if (raw && typeof raw === 'object') return raw as { icon: string; title: string; body: string }
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw) as { icon: string; title: string; body: string }
      } catch {
        return { icon: '📢', title: raw, body: '' }
      }
    }
    return { icon: '📢', title: '', body: '' }
  }

  //fmtDate - converts ISO string to a short, human-readable date e.g. "Apr 12, 2026"
  function fmtDate(iso: string | null) {
    if (!iso) return null
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
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
    return (
      ['', 'Nice!', 'Good Job!', 'Great Job!', 'Wow!', 'Awesome!', 'Amazing!'][
        completedFormIds.value.length
      ] ?? 'Spectacular!'
    )
  })
</script>

<template>
  <div :class="themeClass" class="min-h-screen px-4 pt-4 pb-32">
    <ReaderEquippedBanner />
    <ReaderDecorations />
    <ReaderEffects />
    <ProgressPet mode="background" />

    <!-- ── TOP BAR ── -->
    <header class="relative z-[200] mx-auto mb-8 flex max-w-4xl items-center justify-between px-2">
      <div class="flex items-center gap-3">
        <NuxtLink to="/reader" aria-label="Go to Reading Buddy home">
          <img src="/reader-logo.png" alt="Reading Huddle" class="h-20 w-20 object-contain" />
        </NuxtLink>
      </div>

      <!-- XP + settings -->
      <div class="flex items-center gap-3">
        <!-- XP badge — click triggers star spin + coin burst -->
        <div
          class="relative flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-white/90 px-4 py-2 shadow-xl backdrop-blur-md transition-all select-none"
          style="border-color: rgba(245, 158, 11, 0.3)"
          :class="
            xpClicked
              ? 'scale-90 transition-transform duration-100'
              : 'transition-transform duration-100'
          "
          @click="triggerXpClick"
        >
          <span class="text-lg" :class="xpClicked ? 'animate-star-spin' : ''">⭐️</span>
          <span class="font-heading font-bold text-amber-600">{{ Number(student?.exp) }}</span>
          <span
            v-for="c in burstCoins"
            :key="c.id"
            class="animate-coin-burst absolute text-sm"
            :style="`--tx:${c.tx}px;--ty:${c.ty}px;left:50%;top:50%;`"
            >⭐️</span
          >
        </div>

        <!-- Settings button TODO 7-->
        <NuxtLink
          to="/reader/settings"
          class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-white bg-white/90 text-2xl shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
          style="hover:color: var(--brand-indigo)"
          >⚙️</NuxtLink
        >
      </div>
    </header>

    <!-- ── MAIN CONTENT ── -->
    <main class="mx-auto min-h-[60vh] max-w-4xl">
      <section class="flex h-full flex-col justify-between gap-4 pb-4">
        <!-- Welcome heading -->
        <div class="py-4 text-center">
          <h1 class="font-heading mb-1 text-5xl font-bold" style="color: var(--brand-dark)">
            Welcome Back!
          </h1>
          <p class="text-lg font-medium text-gray-500">Ready for today's reading adventure?</p>
        </div>

        <!-- ANNOUNCEMENTS -->
        <div
          v-if="mostRecent"
          class="premium-card px-4 py-3"
          style="background: rgba(245, 158, 11, 0.06); border-color: rgba(245, 158, 11, 0.25)"
        >
          <div class="flex items-center gap-3">
            <span class="shrink-0 text-lg">{{ parseContent(mostRecent.content).icon }}</span>
            <div class="flex-grow overflow-hidden">
              <p class="truncate text-sm font-bold" style="color: var(--brand-dark)">
                <span
                  class="mr-2 rounded-full px-2 py-0.5 text-[10px] font-black text-gray-900 uppercase"
                  style="background: var(--brand-gold)"
                  >New</span
                >
                {{ parseContent(mostRecent.content).title }}
              </p>
              <p class="mt-0.5 truncate text-xs text-gray-400">
                <span v-html="parseContent(mostRecent.content).body"></span>
              </p>
            </div>
            <!-- "View All" button always visible when there's at least one announcement -->
            <button
              @click="showAllAnnouncements = true"
              class="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase transition-all"
              style="
                background: rgba(245, 158, 11, 0.18);
                color: var(--brand-dark);
                border: 1px solid rgba(245, 158, 11, 0.3);
              "
            >
              View All ›
            </button>
          </div>
        </div>

        <!-- No active announcements -->
        <div
          v-else
          class="premium-card flex items-center gap-3 px-5 py-4"
          style="background: rgba(245, 158, 11, 0.04); border-color: rgba(245, 158, 11, 0.15)"
        >
          <p class="text-sm font-medium text-gray-400">
            No announcements right now. Check back later!
          </p>
        </div>

        <!-- Daily Form CTA TODO 2-->
        <NuxtLink
          to="/reader/forms"
          class="group block w-full cursor-pointer rounded-3xl p-6 text-left text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style="
            background: linear-gradient(135deg, #e0604d 0%, #c94a38 100%);
            border-bottom: 6px solid #a83d2e;
            text-decoration: none;
          "
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="mb-1 text-sm font-bold tracking-widest uppercase opacity-80">
                Today's Challenge
              </p>
              <h3 class="font-heading text-3xl font-black">Start Your Daily Form</h3>
              <p class="mt-1 text-base font-medium opacity-80">
                {{ completedFormIds.length }} out of {{ totalForms }} completed this week.
                {{ completionMessage }}
              </p>
            </div>
            <span class="text-5xl transition-transform duration-300 group-hover:translate-x-2"
              >➜</span
            >
          </div>
        </NuxtLink>
      </section>
    </main>

    <!-- ── LEFT / RIGHT ARROWS ── -->
    <!-- Left: Store -->
    <NuxtLink
      to="/reader/decor"
      class="group fixed top-1/2 left-2 z-[100] flex -translate-y-1/2 cursor-pointer items-center gap-1 p-2 transition-all"
      style="color: rgba(224, 96, 77, 0.6); text-decoration: none"
    >
      <svg
        class="h-16 w-12 drop-shadow-md transition-transform group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="text-sm font-bold tracking-wide uppercase">Store</span>
    </NuxtLink>

    <!-- Right: Forms -->
    <NuxtLink
      to="/reader/forms"
      class="group fixed top-1/2 right-2 z-[100] flex -translate-y-1/2 cursor-pointer items-center gap-1 p-2 transition-all"
      style="color: rgba(224, 96, 77, 0.6); text-decoration: none"
    >
      <span class="text-sm font-bold tracking-wide uppercase">Forms</span>
      <svg
        class="h-16 w-12 drop-shadow-md transition-transform group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </NuxtLink>

    <!-- ALL ANNOUNCEMENTS -->
    <Transition name="modal-fade">
      <div
        v-if="showAllAnnouncements"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="showAllAnnouncements = false"
        />

        <!-- Dialog box -->
        <div
          class="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl bg-white shadow-2xl"
        >
          <!-- Header -->
          <div
            class="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 pt-6 pb-4"
          >
            <div>
              <h2 class="font-heading text-2xl font-bold" style="color: var(--brand-dark)">
                📢 Announcements
              </h2>
              <p class="mt-0.5 text-xs text-gray-400">{{ announcements?.length ?? 0 }} active</p>
            </div>
            <!-- ✕ close button -->
            <button
              @click="showAllAnnouncements = false"
              class="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close announcements"
            >
              ✕
            </button>
          </div>

          <!-- Scrollable announcement cards — sorted newest first -->
          <div class="space-y-4 overflow-y-auto px-6 py-5">
            <div
              v-for="ann in [...(announcements ?? [])].sort(
                (a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
              )"
              :key="ann.id"
              class="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <!-- Icon -->
              <div
                class="flex min-h-[56px] min-w-[56px] shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-3xl shadow-sm"
              >
                {{ parseContent(ann.content).icon }}
              </div>
              <!-- Body -->
              <div class="flex-grow">
                <div class="mb-2 flex flex-col gap-0.5">
                  <h4 class="text-base font-bold text-gray-800">
                    {{ parseContent(ann.content).title }}
                  </h4>
                  <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    {{ fmtDate(ann.postDate)
                    }}{{ ann.expiryDate ? ' → ' + fmtDate(ann.expiryDate) : ' (Ongoing)' }}
                  </span>
                </div>
                <p class="text-sm leading-relaxed font-medium text-gray-500">
                  <span v-html="parseContent(ann.content).body"></span>
                </p>
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
