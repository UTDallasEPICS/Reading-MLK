<script setup lang="ts">

const { student, settings: globalSettings, saveSettings: pushSettings, loadStudent } = useCurrentStudent()

// Fallback: If no student is currently loaded into global state, load student 1
//this is stupid and funny, remove
if (!student.value) {
  await loadStudent(1) 
}

// Map the global settings to a local reactive object so our sliders/toggles can mutate them
const settings = reactive({ 
  dyslexiaFont: globalSettings.value.dyslexiaFont,
  language: globalSettings.value.language,
  fontSize: globalSettings.value.fontSize
})

// ── Theme class ── 
const themeClass = computed(() => {
  const t = 'light'
  const d = settings.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app ${t} ${d}`.trim()
})

// Watch for any changes to settings and automatically save using the composable
watch(settings, (newSettings) => {
  pushSettings(newSettings)
}, { deep: true })

</script>

<template>
  <div :class="themeClass" :style="`font-size: ${settings.fontSize * 16}px`" class="pb-32 px-4 pt-4 min-h-screen relative">
    
    <!-- ── TOP BAR ── -->
    <header class="absolute top-4 left-0 right-0 w-full max-w-4xl mx-auto flex justify-end items-center px-6 z-[200]">
      <div class="flex items-center gap-3">
        <!-- Home button -->
        <NuxtLink
          to="/reader/home"
          class="w-14 h-14 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl transition-all border-2 border-white shadow-xl hover:scale-110 active:scale-95"
        >🏠</NuxtLink>
      </div>
    </header>

    <div class="p-6 max-w-lg mx-auto space-y-4 bg-white/80 mt-8 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/40 shadow-[0_10px_30px_rgba(79,70,229,0.1)]">
      <div class="text-center mb-1">
          <div class="text-5xl mb-2">⚙️</div>
          <h2 class="font-heading text-2xl font-bold text-brand-dark">Settings</h2>
            </div>

              <!-- Profile Switcher -->
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Which Student?</label>
                <NuxtLink to="/reader/StudentSelect"
                class="w-full text-white font-bold py-2.5 rounded-lg transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                style="background-color: var(--brand-indigo); box-shadow: 0 4px 14px rgba(224, 96, 77, 0.4);">
                  👥 Switch Profile
                </NuxtLink>
              </div>



              <!-- Font Size Slider -->
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Text
                  Size</label>
                  <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span class="text-xs font-bold text-gray-400">A</span>
                      <input type="range" min="1" max="1.5" step="0.1" v-model.number="settings.fontSize"
                                    class="flex-grow h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-indigo">
                                <span class="text-lg font-bold text-gray-400">A</span>
                                <span
                                    class="text-xs font-bold text-brand-indigo bg-brand-indigo/10 px-2 py-1 rounded-lg">{{
                                    Math.round(settings.fontSize * 100) }}%</span>
                            </div>
                        </div>

                        <!-- Dyslexia Font Toggle -->
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <h4 class="font-bold text-sm text-brand-dark">Dyslexia-Friendly Font</h4>
                                <p class="text-[10px] text-gray-400">Uses OpenDyslexic typeface</p>
                            </div>
                            <button @click="settings.dyslexiaFont = !settings.dyslexiaFont"
                                :class="['w-12 h-6 rounded-full transition-all relative', settings.dyslexiaFont ? 'bg-brand-mint' : 'bg-gray-300']">
                                <div
                                    :class="['w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-all', settings.dyslexiaFont ? 'right-0.5' : 'left-0.5']">
                                </div>
                            </button>
                        </div>

                        <!-- Language Toggle -->
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <h4 class="font-bold text-sm text-brand-dark">Language / Idioma</h4>
                                <p class="text-[10px] text-gray-400">{{ settings.language === 'en' ? 'English' : 'Español' }}</p>
                            </div>
                            <button @click="settings.language = settings.language === 'en' ? 'es' : 'en'"
                                class="bg-brand-indigo/10 text-brand-indigo px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-brand-indigo/20 transition">
                                {{ settings.language === 'en' ? '🇪🇸 Español' : '🇺🇸 English' }}
                            </button>
                        </div>



                        <!-- Logout Button -->
                        <button @click="logout"
                            class="w-full bg-red-500 hover:bg-red-600 text-white font-heading font-bold text-base py-3 rounded-lg shadow-lg hover:shadow-xl transition transform active:scale-95 mt-2">
                            Logout 👋
                        </button>
                    </div>
  </div>
</template>