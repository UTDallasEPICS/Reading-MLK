<script setup lang="ts">
definePageMeta({ ssr: false })

// Profiles — matches the HTML kidProfiles array exactly
const kidProfiles = ref([
  { name: 'Emma',   avatar: '🦊', color: 'bg-orange-400' },
  { name: 'Jayden', avatar: '🐸', color: 'bg-green-400'  },
  { name: 'Sofia',  avatar: '🦋', color: 'bg-purple-400' },
])

const { settings } = useCurrentStudent()

const readerAppStyle = computed(() => buildReaderAppStyle(settings.value.theme, settings.value.fontSize))

const themeClass = computed(() => {
  const d = settings.value.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app ${d}`.trim()
})

function selectProfile(idx: number) {
  // Store chosen profile index so home.vue and other pages can read it
  // (In a real app this would go into a composable / pinia store)
  localStorage.setItem('activeProfileIdx', String(idx))
  navigateTo('/reader/home')
}
</script>

<template>
  <div
    :class="themeClass"
    :style="readerAppStyle"
    class="min-h-screen pb-32 px-4 pt-4"
  >
    <ReaderAnimationLayer :active-animations="settings.activeAnimations" />

    <!-- ── TOP BAR ── -->
    <header class="max-w-4xl mx-auto flex justify-between items-center mb-8 px-2 relative z-[200]">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-heading font-bold text-2xl shadow-lg"
          style="background: var(--brand-indigo)"
        >L</div>
        <div class="flex flex-col">
          <span class="font-heading font-bold text-2xl tracking-tight leading-none" style="color: var(--brand-dark)">
            Reading<span style="color: var(--brand-indigo)">Huddle</span>
          </span>
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--brand-mint)">
            Reading Buddy
          </span>
        </div>
      </div>
    </header>

    <!-- ── PROFILES VIEW ── -->
    <main class="max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center py-20 text-center space-y-12">

      <div class="animate-bounce text-7xl">👋</div>

      <div class="space-y-4">
        <h2 class="text-5xl font-heading font-black" style="color: var(--brand-dark)">Who's Reading?</h2>
        <p class="text-xl text-gray-400 font-bold uppercase tracking-widest">
          Select your profile to start your adventure!
        </p>
      </div>

      <!-- Profile cards -->
      <div class="flex gap-8 justify-center max-w-4xl flex-wrap">

        <div
          v-for="(profile, idx) in kidProfiles"
          :key="idx"
          @click="selectProfile(idx)"
          class="flex flex-col items-center gap-4 cursor-pointer group transition-all"
        >
          <div
            class="w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-xl transition-all group-hover:scale-110 group-hover:rotate-6"
            :class="profile.color"
          >
            {{ profile.avatar }}
          </div>
          <span
            class="text-xl font-bold transition-colors group-hover:text-[color:var(--brand-indigo)]"
            style="color: var(--brand-dark)"
          >{{ profile.name }}</span>
        </div>

        <!-- Add New profile slot -->
        <div class="flex flex-col items-center gap-4 cursor-pointer group transition-all opacity-50 hover:opacity-100">
          <div
            class="w-32 h-32 rounded-[2.5rem] border-4 border-dashed border-gray-300 flex items-center justify-center text-4xl text-gray-400 transition-all group-hover:scale-110 group-hover:border-[color:var(--brand-indigo)] group-hover:text-[color:var(--brand-indigo)]"
          >➕</div>
          <span
            class="text-xl font-bold text-gray-400 transition-colors group-hover:text-[color:var(--brand-indigo)]"
          >Add New</span>
        </div>

      </div>
    </main>
  </div>
</template>

<style>
@import './reader.css';
</style>
