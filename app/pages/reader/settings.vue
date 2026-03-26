<script setup lang="ts">
import type { Student } from '~~/prisma/generated/client'

//retrieve from proper place (auth store, nuxt store, etc.)
const {data: student} = await useFetch<Student | null>('/api/student/1')


//define type for student settings
type StudentSettings = {
  dyslexiaFont?: boolean
  language?: string
  fontSize?: number
}
//cast raw student settings JSON from api call to type
const parsedSettings = computed(() => {
  return (student.value?.settings || {}) as StudentSettings
})

//load parsed student settings
const settings = reactive({
  dyslexiaFont: computed(() => Boolean(parsedSettings.value.dyslexiaFont) || false),
  language:    computed(() => parsedSettings.value.language || 'en'),
  fontSize:    computed(() => Number(parsedSettings.value.fontSize) || 1),
})

// ── Theme class ── change later to exported and load it in
const themeClass = computed(() => {
  const t = 'light'
  const d = settings.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app ${t} ${d}`.trim()
})

</script>

<template>
  <div :class="themeClass" :style="`font-size: ${settings.fontSize * 16}px`" class="pb-32 px-4 pt-4 min-h-screen">
    <div class="premium-card p-10 max-w-lg mx-auto space-y-6 bg-white/80">
      <div class="text-center mb-2">
          <div class="text-6xl mb-4">⚙️</div>
          <h2 class="font-heading text-3xl font-bold text-brand-dark">Settings</h2>
            </div>

              <!-- Netflix-style Kid Profiles -->
              <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Who's
                Reading?</label>
                <NuxtLink to="/reader/profiles"
                class="w-full bg-brand-indigo/10 text-brand-indigo font-bold py-3 rounded-lg transition hover:bg-brand-indigo/20 flex items-center justify-center gap-2">
                  👥 Switch Profile
                </NuxtLink>
              </div>



                        <!-- Font Size Slider -->
                        <div>
                            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Text
                                Size</label>
                            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <span class="text-sm font-bold text-gray-400">A</span>
                                <input type="range" min="1" max="1.5" step="0.1" v-model.number="settings.fontSize"
                                    class="flex-grow h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-indigo">
                                <span class="text-xl font-bold text-gray-400">A</span>
                                <span
                                    class="text-xs font-bold text-brand-indigo bg-brand-indigo/10 px-2 py-1 rounded-lg">{{
                                    Math.round(settings.fontSize * 100) }}%</span>
                            </div>
                        </div>

                        <!-- Dyslexia Font Toggle -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 class="font-bold text-brand-dark">Dyslexia-Friendly Font</h4>
                                <p class="text-xs text-gray-400">Uses OpenDyslexic typeface</p>
                            </div>
                            <button @click="settings.dyslexiaFont = !settings.dyslexiaFont"
                                :class="['w-14 h-8 rounded-full transition-all relative', settings.dyslexiaFont ? 'bg-brand-mint' : 'bg-gray-300']">
                                <div
                                    :class="['w-6 h-6 bg-white rounded-full shadow-md absolute top-1 transition-all', settings.dyslexiaFont ? 'right-1' : 'left-1']">
                                </div>
                            </button>
                        </div>

                        <!-- Language Toggle -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 class="font-bold text-brand-dark">Language / Idioma</h4>
                                <p class="text-xs text-gray-400">{{ locale === 'en' ? 'English' : 'Español' }}</p>
                            </div>
                            <button @click="toggleLanguage"
                                class="bg-brand-indigo/10 text-brand-indigo px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-indigo/20 transition">
                                {{ locale === 'en' ? '🇪🇸 Español' : '🇺🇸 English' }}
                            </button>
                        </div>



                        <!-- Logout Button -->
                        <button @click="logout"
                            class="w-full bg-red-500 hover:bg-red-600 text-white font-heading font-bold text-lg py-4 rounded-lg shadow-lg hover:shadow-xl transition transform active:scale-95 mt-4">
                            Logout 👋
                        </button>
                    </div>
  </div>
</template>