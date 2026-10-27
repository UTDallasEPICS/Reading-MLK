<script setup lang="ts">
definePageMeta({ ssr: false })

const { student, settings, updateExp, restoreStudent } = useCurrentStudent()
const { FormGroup, loadActiveFormGroup } = useCurrentFormGroup()
const { completedFormIds, logFormSubmission, logSubmissionResponse, loadProgress } = useCurrentStudentProgress()

const dataLoaded = ref(false)

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
  dataLoaded.value = true
})

const stats = computed(() => ({
  xp: student.value ? student.value.exp : 0,
}))

const themeClass = computed(() => {
  const d = settings.value.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app ${d}`.trim()
})

const currentFormComponentsWithVideo = computed(() => {
  if (!activeForm.value?.id) return []
  return FormGroup.value.formComponents[activeForm.value.id] || []
})

function embedURL(rawUrl: string) {
  const match = rawUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`
  }
  return rawUrl
}

const firstVideoComponent = computed(() => {
  return currentFormComponentsWithVideo.value.find(c => (c as any).questionType === 'video') as any || null
})

const firstVideoUrl = computed(() => {
  const vc = firstVideoComponent.value
  if (!vc) return null
  const rawUrl = vc.questionOptions?.url || null
  return rawUrl ? embedURL(rawUrl) : null
})

const firstVideoContext = computed(() => {
  const vc = firstVideoComponent.value
  if (!vc) return ''
  return vc.questionText || ''
})

const firstVideoContextEs = computed(() => {
  const vc = firstVideoComponent.value
  if (!vc) return ''
  return vc.questionOptions?.textEs || ''
})

const currentFormComponents = computed(() => {
  const components = currentFormComponentsWithVideo.value
  
  // Find the first video component (the reading resource)
  const firstVideoIndex = components.findIndex(c => c.questionType === 'video')
  let filteredComponents = [...components]
  
  // Always remove the first video component so it doesn't appear in the form flow itself, only pre-form stage
  if (firstVideoIndex !== -1) {
    filteredComponents.splice(firstVideoIndex, 1)
  }

  return filteredComponents
})

const currentComponent = computed(() => currentFormComponents.value[currentComponentID.value])

// Click badge animations
const xpClicked     = ref(false)
const burstCoins    = ref<{id:number;tx:number;ty:number}[]>([])


function triggerXpClick() {
  xpClicked.value = true
  burstCoins.value = [
    { id: Date.now(), tx: -32, ty: -40 }, { id: Date.now()+1, tx: 0, ty: -48 }, { id: Date.now()+2, tx: 32, ty: -40 },
  ]
  setTimeout(() => { xpClicked.value = false; burstCoins.value = [] }, 800)
}

// Flow state
const activeForm         = ref<any>(null)
const preFormStep        = ref<string|null>(null)   // 'ask' | 'has-book' | 'no-book' | null
const hasOwnBook         = ref(false)
const currentComponentID        = ref(0)
const answers            = ref<Record<number,string>>({})
const feedbackVisible    = ref<Record<number,boolean>>({})

const isCurrentComponentCorrect = computed(() => {
  const q = currentComponent.value
  if (!q || !answers.value[q.id]) return true
  if (q.questionType !== 'mcq') return true
  const options = q.questionOptions as any
  if (!options || !options.choices) return true
  const choiceIndex = Number(answers.value[q.id])
  const choice = options.choices[choiceIndex]
  return choice ? choice.correct : false
})

const correctAnswerText = computed(() => {
  const q = currentComponent.value
  if (!q || q.questionType !== 'mcq') return ''
  const options = q.questionOptions as any
  if (!options || !options.choices) return ''
  const correctChoice = options.choices.find((c: any) => c.correct)
  return correctChoice ? correctChoice.text : ''
})

const feedbackReferenceText = computed(() => {
  const q = currentComponent.value
  if (!q) return ''
  const options = q.questionOptions as any
  return options?.reference || ''
})

const feedbackReferenceTextEs = computed(() => {
  const q = currentComponent.value
  if (!q) return ''
  const options = q.questionOptions as any
  return options?.referenceEs || ''
})


function startChallenge(form: any) {
  activeForm.value      = form
  preFormStep.value     = 'ask'
  currentComponentID.value     = 0
  feedbackVisible.value = {}
  //load answers
  answers.value         = {}
}

function preFormSkipToForm() {
  hasOwnBook.value  = false
  preFormStep.value = null
}

function checkAnswer() {
  const q = currentFormComponents.value[currentComponentID.value]
  if (q) feedbackVisible.value[q.id] = true
}

function nextStep() {
  const qs = currentFormComponents.value
  if (currentComponentID.value < qs.length - 1) {
    currentComponentID.value++
  } else {
    submitChallenge()
  }
}

const showXpReward = ref(false)
const submitting = ref(false)

async function submitChallenge() {
  if (submitting.value || !activeForm.value) return
  submitting.value = true
  try {
    const submission = await logFormSubmission(activeForm.value.id)
    if (!submission) return
    await updateExp(500)
    activeForm.value = null
    currentComponentID.value = 0
    feedbackVisible.value = {}
    answers.value = {}
    showXpReward.value = true
  } finally {
    submitting.value = false
  }
}

function getBadgeClass(type: string) {
  if (type === 'text')    return 'bg-blue-100 text-blue-700 border-2 border-blue-200'
  if (type === 'mcq')     return 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
  if (type === 'video')   return 'bg-pink-100 text-pink-600 border-2 border-pink-200'
  return 'bg-gray-100 text-gray-500 border-2 border-gray-200'
}
</script>

<template>
  <div :class="themeClass" :style="`font-size:${settings.fontSize*16}px`" class="pb-32 px-4 pt-4 min-h-screen">

    <!-- ── TOP BAR ── -->
    <header class="max-w-4xl mx-auto flex justify-between items-center mb-8 px-2 relative z-[200]">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-heading font-bold text-2xl shadow-lg" style="background:var(--brand-indigo)">L</div>
        <div class="flex flex-col">
          <span class="font-heading font-bold text-2xl tracking-tight leading-none" style="color:var(--brand-dark)">Reading<span style="color:var(--brand-indigo)">Huddle</span></span>
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color:var(--brand-mint)">Reading Buddy</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- XP -->
        <div class="relative bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border-2 flex items-center gap-3 cursor-pointer select-none"
             style="border-color:rgba(245,158,11,0.3)"
             :class="(xpClicked) ? 'scale-90 transition-transform duration-100' : 'transition-transform duration-100'"
             @click="triggerXpClick">
             <span class="text-lg" :class="xpClicked ? 'animate-star-spin' : ''">🪙</span>
          <span class="font-heading font-bold text-amber-600">{{ stats.xp }}</span>
          <span v-for="c in burstCoins" :key="c.id" class="absolute text-sm animate-coin-burst"
                :style="`--tx:${c.tx}px;--ty:${c.ty}px;left:50%;top:50%;`">🪙</span>
        </div>
        <!-- Settings / Home -->
        <NuxtLink to="/reader/settings"
          class="w-14 h-14 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-all"
          style="text-decoration:none">⚙️</NuxtLink>
      </div>
    </header>

    <!-- ── MAIN ── -->
    <main class="max-w-4xl mx-auto min-h-[60vh]">
      <!-- Loading state -->
      <div v-if="!dataLoaded" class="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div class="text-6xl animate-bounce">📝</div>
        <p class="font-heading text-xl font-bold text-gray-400">Loading forms...</p>
      </div>

      <section v-else class="space-y-6">

        <div class="mb-2">
          <h2 class="font-heading text-4xl font-bold mb-4" style="color:var(--brand-dark)">Daily Forms 📝</h2>
        </div>

        <!-- ── FORMS LIST ── -->
        <div v-if="!activeForm" class="grid gap-3">
          <div
            v-for="form in FormGroup.forms" :key="form.id"
            @click="!completedFormIds.includes(form.id) && startChallenge(form)"
            class="premium-card p-5 flex items-center justify-between group transition-all"
            :class="[
              completedFormIds.includes(form.id) ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]',
              completedFormIds.includes(form.id) ? '' : (new Date(form.startDate) < new Date() ? 'hover:!border-amber-400' : '')
            ]"
            :style="completedFormIds.includes(form.id)
              ? 'border-color:rgba(45,212,191,0.4); background:rgba(45,212,191,0.05)'
              : (new Date(form.startDate) < new Date() ? 'border-color:#fcd34d; background:rgba(251,191,36,0.05)' : '')"
          >
            <div class="flex items-center gap-5">
              <div
                class="w-14 h-14 rounded-xl flex flex-col items-center justify-center font-heading font-bold transition text-sm"
                :style="completedFormIds.includes(form.id)
                  ? 'background:var(--brand-mint); color:white'
                  : (new Date(form.startDate) < new Date())
                    ? 'background:#f59e0b; color:white'
                    : 'background:rgba(224,96,77,0.1); color:var(--brand-indigo)'"
              >
                <span class="text-[9px] uppercase leading-none">{{ new Date(form.startDate).toLocaleDateString('en-US', {weekday:'short'}) }}</span>
                <span class="text-lg font-black leading-tight">{{ new Date(form.startDate).getDate() }}</span>
              </div>
              <div>
                <h4 class="font-heading text-lg font-bold" style="color:var(--brand-dark)">{{ form.title }}</h4>
                <div class="flex items-center gap-2 mt-0.5">
                  <p class="text-xs font-bold text-gray-400">
                    {{ new Date(form.startDate).toLocaleDateString('en-US', {weekday:'long'}) }} • 
                    {{ (FormGroup.formComponents[form.id] || []).length }} Steps
                  </p>
                  <span v-if="completedFormIds.includes(form.id)" class="text-xs font-black px-2 py-0.5 rounded-full" style="color:var(--brand-mint); background:rgba(45,212,191,0.15)">✓ Done</span>
                </div>
              </div>
            </div>
            <div v-if="!completedFormIds.includes(form.id)">
              <button class="btn-fun text-white px-5 py-2 rounded-xl font-bold text-sm"
                      :style="(new Date(form.startDate) < new Date()) ? 'background:#f59e0b' : 'background:var(--brand-indigo)'">Start 🚀</button>
            </div>
            <div v-else><span class="text-2xl">✅</span></div>
          </div>
        </div>

        <!-- ── PRE-FORM: Ask ── -->
        <div v-else-if="activeForm && preFormStep === 'ask'" class="space-y-6">
          <div class="premium-card p-10 bg-white/60 text-center space-y-6">
            <div class="text-8xl animate-bounce">📚</div>
            <h3 class="font-heading text-3xl font-bold" style="color:var(--brand-dark)">Before we start...</h3>
            <p class="text-xl text-gray-500 font-medium">Do you already have a book to read?</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto" :class="{ 'sm:grid-cols-1': !firstVideoUrl }">
              <button @click="hasOwnBook = true; preFormStep = null"
                class="btn-fun text-white py-5 rounded-2xl font-bold text-xl shadow-lg hover:scale-105"
                style="background:var(--brand-indigo)">Yes, I have a book! 📖</button>
              <button @click="preFormStep = 'no-book'"
                class="btn-fun text-gray-900 py-5 rounded-2xl font-bold text-xl shadow-lg hover:scale-105"
                style="background:var(--brand-gold)">No, I need one 📺</button>
            </div>
            <button @click="activeForm = null; preFormStep = null" class="text-gray-400 font-bold hover:text-gray-700 transition text-sm">← Back to Forms</button>
          </div>
        </div>


        <!-- ── PRE-FORM: No book (watch video) ── -->
        <div v-else-if="activeForm && preFormStep === 'no-book'" class="space-y-4">
          <div class="premium-card p-5 bg-white/60 text-center space-y-3">
            <h3 class="font-heading text-xl font-bold" style="color:var(--brand-dark)">📺 Let's read a story together!</h3>
            <p class="text-gray-500 font-medium text-sm">Use this provided resource, then we'll do the form.</p>
            <div v-if="firstVideoContext" class="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-2 text-left max-w-2xl mx-auto">
              <p class="text-xl font-heading font-bold leading-snug" style="color:var(--brand-dark)"><span v-html="firstVideoContext"></span></p>
              <p
                v-if="settings.language === 'es' && firstVideoContextEs"
                class="text-base italic text-gray-500 leading-snug border-t border-amber-200 pt-2"
              >
                <span v-html="firstVideoContextEs"></span>
              </p>
            </div>
            <div class="max-w-2xl mx-auto aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <iframe v-if="firstVideoUrl" class="w-full h-full" :src="firstVideoUrl" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="flex items-center justify-center gap-4 pt-1">
              <button @click="preFormStep = 'ask'" class="text-gray-400 font-bold hover:text-gray-700 transition text-sm">← Back</button>
              <button @click="preFormSkipToForm"
                class="btn-fun text-white py-3 px-10 rounded-2xl font-bold text-lg shadow-lg hover:scale-105"
                style="background:var(--brand-indigo)">Continue to Form ➡️</button>
            </div>
          </div>
        </div>

        <!-- ── ACTIVE FORM QUESTIONS ── -->
        <div v-else-if="activeForm && !preFormStep" class="space-y-6">
          <div class="premium-card p-5 bg-white/60 relative overflow-hidden">
            <!-- Progress bar -->
            <div class="absolute top-0 left-0 w-full h-2 bg-gray-100">
              <div class="h-full transition-all duration-500" style="background:var(--brand-indigo)"
                   :style="`width:${((currentComponentID + 1) / currentFormComponents.length) * 100}%`" />
            </div>

            <div class="flex justify-between items-center mb-4 mt-2">
              <div>
                <h3 class="font-heading text-2xl font-bold" style="color:var(--brand-dark)">{{ activeForm?.title }}</h3>
                <p class="text-gray-400 font-bold">Step {{ Number(currentComponentID) + 1 }} of {{ currentFormComponents?.length }}</p>
              </div>
              <button @click="activeForm = null; preFormStep = null" class="text-gray-400 hover:text-red-500 font-bold text-lg">Cancel</button>
            </div>

            <Transition name="step-fade" mode="out-in">
              <div :key="currentComponentID">
                <div v-if="currentComponent" class="space-y-3">

                  <!-- Type badge -->
                  <span v-if="currentComponent.questionType !== 'video'"
                    class="inline-block px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    :class="getBadgeClass(currentComponent.questionType)">
                    {{ currentComponent.questionType }}
                  </span>

                  <!-- Context block -->
                  <div v-if="currentComponent.questionType === 'context'" class="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                    <p class="text-xl font-heading font-bold leading-snug" style="color:var(--brand-dark)"><span v-html="currentComponent.questionText"></span></p>
                    <!-- Spanish translation shown below English when language is set to Spanish -->
                    <p
                      v-if="settings.language === 'es' && (currentComponent.questionOptions as any)?.textEs"
                      class="text-base italic text-gray-500 leading-snug border-t border-amber-200 pt-2"
                    >
                      <span v-html="(currentComponent.questionOptions as any).textEs"></span>
                    </p>
                  </div>

                  <!-- Video -->
                  <div v-else-if="currentComponent.questionType === 'video'" class="space-y-3">
                    <div v-if="currentComponent.questionText" class="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                      <p class="text-xl font-heading font-bold leading-snug" style="color:var(--brand-dark)"><span v-html="currentComponent.questionText"></span></p>
                      <p
                        v-if="settings.language === 'es' && (currentComponent.questionOptions as any)?.textEs"
                        class="text-base italic text-gray-500 leading-snug border-t border-amber-200 pt-2"
                      >
                        <span v-html="(currentComponent.questionOptions as any).textEs"></span>
                      </p>
                    </div>
                    <div class="max-w-2xl mx-auto aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                      <iframe class="w-full h-full" :src="embedURL((currentComponent.questionOptions as any)?.url)" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                  </div>

                  <!-- Text / MCQ question -->
                  <div v-else class="space-y-1">
                    <h4 class="text-xl font-heading font-bold" style="color:var(--brand-dark)"><span v-html="currentComponent.questionText"></span></h4>
                    <!-- Spanish translation shown below English when language is set to Spanish -->
                    <p
                      v-if="settings.language === 'es' && (currentComponent.questionOptions as any)?.textEs"
                      class="text-base italic text-gray-500"
                    >
                      <span v-html="(currentComponent.questionOptions as any).textEs"></span>
                    </p>
                  </div>

                  <!-- Input area -->
                  <div v-if="['text','mcq'].includes(currentComponent.questionType)" class="mt-6">
                    <!-- Not yet answered -->
                    <div v-if="!feedbackVisible[currentComponent.id]">
                      <textarea
                        v-if="currentComponent.questionType === 'text'"
                        v-model="answers[currentComponent.id]"
                        placeholder="Type your answer here..."
                        class="w-full premium-card bg-white p-6 text-gray-500 outline-none min-h-[120px] shadow-inner"
                      />
                      <!-- MCQ -->
                      <div v-else-if="currentComponent.questionType === 'mcq'" class="space-y-3">
                        <button
                          v-for="(choice, ci) in (currentComponent.questionOptions as any)?.choices" :key="ci"
                          @click="answers[currentComponent.id] = String(ci)"
                          class="w-full text-left p-5 rounded-2xl font-bold text-lg border-2 transition-all"
                          :style="answers[currentComponent.id] === String(ci)
                            ? 'border-color:var(--brand-indigo); background:rgba(224,96,77,0.1); color:var(--brand-indigo); transform:scale(1.02)'
                            : 'border-color:#f1f5f9; background:white; color:#374151'"
                        >
                          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-black"
                            :style="answers[currentComponent.id] === String(ci)
                              ? 'background:var(--brand-indigo); color:white'
                              : 'background:#f1f5f9; color:#6b7280'"
                          >{{ String.fromCharCode(65 + Number(ci)) }}</span>
                          <span v-html="(choice as any).text"></span>
                        </button>
                      </div>

                      <button
                        @click="checkAnswer"
                        :disabled="!answers[currentComponent.id]"
                        class="mt-6 btn-fun w-full text-white py-4 rounded-2xl font-bold text-xl disabled:opacity-50 shadow-lg"
                        style="background:var(--brand-indigo)">Check Answer ✨</button>
                    </div>

                    <!-- Feedback -->
                    <div v-else class="p-6 rounded-[2rem] animate-pop-bounce border-2"
                         :style="isCurrentComponentCorrect 
                           ? 'background:rgba(45,212,191,0.1); border-color:rgba(45,212,191,0.3)' 
                           : 'background:rgba(245,158,11,0.1); border-color:rgba(245,158,11,0.3)'">
                      <div class="font-black mb-2 uppercase tracking-widest flex items-center gap-2" 
                           :style="isCurrentComponentCorrect ? 'color:var(--brand-mint)' : 'color:var(--brand-gold)'">
                        {{ isCurrentComponentCorrect ? '✨ Great job!' : '💡 Great Try!' }}
                      </div>
                      <div class="text-gray-700 font-medium space-y-2">
                        <template v-if="feedbackReferenceText">
                          <p class="italic"><span v-html="feedbackReferenceText"></span></p>
                          <p v-if="settings.language === 'es' && feedbackReferenceTextEs" class="italic text-gray-500"><span v-html="feedbackReferenceTextEs"></span></p>
                        </template>
                        <div v-if="currentComponent.questionType === 'mcq'">
                        <p v-if="isCurrentComponentCorrect">
                          The correct answer was: <span class="font-bold" v-html="correctAnswerText"></span>
                          Keep going! You're doing awesome!
                        </p>
                        <p v-else>
                          The correct answer was: <span class="font-bold" v-html="correctAnswerText"></span> You'll get it next time!
                        </p>
                      </div>
                    </div>
                  </div>

                  </div>

                  <!-- Navigation -->
                  <div class="flex justify-between items-center mt-4">
                    <button v-if="currentComponentID > 0" @click="currentComponentID--"
                      class="text-gray-400 font-bold hover:text-gray-700 transition text-lg">← Back</button>
                    <div v-else />
                    <div class="flex-grow" />
                    <!-- Context / Video: always show Continue -->
                    <button
                      v-if="['context','video'].includes(currentComponent.questionType)"
                      @click="nextStep"
                      class="btn-fun text-white px-10 py-3 rounded-2xl font-bold text-lg shadow-lg"
                      style="background:var(--brand-dark)"
                    >{{ currentComponentID < currentFormComponents.length - 1 ? 'Continue ➡️' : 'Finish Challenge! 🎉' }}</button>
                    <!-- Text/MCQ after answered -->
                    <button
                      v-else-if="feedbackVisible[currentComponent.id]"
                      @click="nextStep"
                      class="btn-fun text-white px-10 py-3 rounded-2xl font-bold text-lg"
                      style="background:var(--brand-dark)"
                    >{{ currentComponentID < currentFormComponents.length - 1 ? 'Next Step' : 'Finish Challenge! 🎉' }}</button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

      </section>
    </main>

    <!-- ── LEFT ARROW ── -->
    <NuxtLink to="/reader"
      class="fixed left-2 top-1/2 -translate-y-1/2 z-[100] p-2 flex items-center gap-1 transition-all cursor-pointer group"
      style="color:rgba(224,96,77,0.6); text-decoration:none">
      <svg class="w-12 h-16 group-hover:-translate-x-1 transition-transform drop-shadow-md" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="text-sm font-bold uppercase tracking-wide">Home</span>
    </NuxtLink>

    <Transition name="fade">
      <div v-if="showXpReward" role="dialog" aria-modal="true" aria-labelledby="xp-reward-title"
           class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
        <div class="relative w-full max-w-sm rounded-[2.5rem] border-b-8 border-amber-400 bg-white p-8 text-center shadow-2xl animate-shop-pop">
          <div class="text-7xl mb-4 animate-pop-bounce" aria-hidden="true">🌟</div>
          <p class="text-sm font-black uppercase tracking-widest text-amber-600">Challenge complete!</p>
          <h2 id="xp-reward-title" class="font-heading text-3xl font-black text-slate-800 mt-2">You earned 500 XP!</h2>
          <p class="text-gray-500 mt-3">Great work! Keep your reading streak going.</p>
          <button @click="showXpReward = false; navigateTo('/reader')"
                  class="btn-fun text-white py-3 px-8 rounded-2xl font-bold mt-6 shadow-lg hover:scale-105 transition-transform"
                  style="background:var(--brand-indigo)">Back to Home 🏠</button>
        </div>
      </div>
    </Transition>


  </div>
</template>

<style>
@import './reader.css';
</style>
