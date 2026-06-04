<script setup lang="ts">
definePageMeta({ ssr: false })

const { student, settings, updateExp } = useCurrentStudent()
const { FormGroup } = useCurrentFormGroup()
const { tickets, completedFormIds, logFormSubmission, logSubmissionResponse } = useCurrentStudentProgress()

const stats = computed(() => ({
  xp: student.value ? student.value.exp : 0,
  tickets: tickets.value? tickets.value : 0,
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

const firstVideoUrl = computed(() => {
  const videoComponent = currentFormComponentsWithVideo.value.find(c => (c as any).questionType === 'video')
  const rawUrl = (videoComponent as any)?.questionText || null

  return rawUrl ? embedURL(rawUrl) : null
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
const ticketClicked = ref(false)
const burstCoins    = ref<{id:number;tx:number;ty:number}[]>([])
const flyTickets    = ref<number[]>([])

function triggerXpClick() {
  xpClicked.value = true
  burstCoins.value = [
    { id: Date.now(), tx: -32, ty: -40 }, { id: Date.now()+1, tx: 0, ty: -48 }, { id: Date.now()+2, tx: 32, ty: -40 },
  ]
  setTimeout(() => { xpClicked.value = false; burstCoins.value = [] }, 800)
}
function triggerTicketClick() {
  ticketClicked.value = true
  flyTickets.value = [Date.now()]
  setTimeout(() => { ticketClicked.value = false; flyTickets.value = [] }, 1000)
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
  const choice = options.choices.find((c: any) => c.text === answers.value[q.id])
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

// Raffle reward
const showRaffleReward   = ref(false)
const ticketDropped      = ref(false)
const ticketOverBox      = ref(false)
const ticketStyle        = ref<Record<string,string>>({})
let touchStartY = 0

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

async function submitChallenge() {
  const formId = activeForm.value.id
  
  // Persist completion and XP
  const submission  = await logFormSubmission(formId)
  await updateExp(100)

  // grab newly posted submission ID
  const submissionID = Number(submission?.id)

  showRaffleReward.value = true
  ticketDropped.value    = false
  ticketOverBox.value    = false
  ticketStyle.value      = {}
  setTimeout(() => {
    activeForm.value      = null
    currentComponentID.value     = 0
    feedbackVisible.value = {}
    answers.value         = {}
  }, 500)
}

function onTicketDragStart(e: DragEvent) { e.dataTransfer?.setData('text/plain', 'ticket') }
function onTicketDrop() { ticketOverBox.value = false; ticketDropped.value = true }
function onTicketTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTicketTouchMove(e: TouchEvent) {
  e.preventDefault()
  const t  = e.touches[0]
  const dy = t.clientY - touchStartY
  ticketStyle.value = { transform: `translate(-50%, ${dy}px)` }
  const box = document.getElementById('raffle-box')
  if (box) {
    const r = box.getBoundingClientRect()
    ticketOverBox.value = t.clientX >= r.left && t.clientX <= r.right && t.clientY >= r.top && t.clientY <= r.bottom
  }
}
function onTicketTouchEnd() { ticketOverBox.value ? onTicketDrop() : (ticketStyle.value = {}) }

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
        <!-- XP + Tickets -->
        <div class="relative bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border-2 flex items-center gap-3 cursor-pointer select-none"
             style="border-color:rgba(245,158,11,0.3)"
             :class="(xpClicked || ticketClicked) ? 'scale-90 transition-transform duration-100' : 'transition-transform duration-100'"
             @click="triggerXpClick">
             <span class="text-lg" :class="xpClicked ? 'animate-star-spin' : ''">🪙</span>
          <span class="font-heading font-bold text-amber-600">{{ stats.xp }}</span>
          <span class="text-gray-300">|</span>
          <span class="text-lg" :class="ticketClicked ? 'animate-ticket-wobble' : ''" @click.stop="triggerTicketClick">🎟️</span>
          <span class="font-heading font-bold" style="color:var(--brand-mint)">{{ stats.tickets }}</span>
          <span v-for="c in burstCoins" :key="c.id" class="absolute text-sm animate-coin-burst"
                :style="`--tx:${c.tx}px;--ty:${c.ty}px;left:50%;top:50%;`">🪙</span>
          <Transition name="box-pop">
            <span 
              v-if="ticketClicked"
              class="absolute -bottom-15 left-1/2 -translate-x-1/2 text-2xl animate-box-shake pointer-events-none">
              📦
            </span>
          </Transition>
          <span v-for="id in flyTickets" :key="id" class="absolute text-lg animate-ticket-fly pointer-events-none"
                style="left:50%;top:50%;transform:translateX(-50%) translateY(-50%)">🎟️</span>
        </div>
        <!-- Settings / Home -->
        <NuxtLink to="/reader/settings"
          class="w-14 h-14 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-all"
          style="text-decoration:none">⚙️</NuxtLink>
      </div>
    </header>

    <!-- ── MAIN ── -->
    <main class="max-w-4xl mx-auto min-h-[60vh]">
      <section class="space-y-6">

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
                    <p class="text-xl font-heading font-bold leading-snug" style="color:var(--brand-dark)">{{ currentComponent.questionText }}</p>
                    <!-- Spanish translation shown below English when language is set to Spanish -->
                    <p
                      v-if="settings.language === 'es' && (currentComponent.questionOptions as any)?.textEs"
                      class="text-base italic text-gray-500 leading-snug border-t border-amber-200 pt-2"
                    >
                      {{ (currentComponent.questionOptions as any).textEs }}
                    </p>
                  </div>

                  <!-- Video -->
                  <div v-else-if="currentComponent.questionType === 'video'"
                    class="max-w-2xl mx-auto aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                    <iframe class="w-full h-full" :src="embedURL(currentComponent.questionText)" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>

                  <!-- Text / MCQ question -->
                  <div v-else class="space-y-1">
                    <h4 class="text-xl font-heading font-bold" style="color:var(--brand-dark)">&quot;{{ currentComponent.questionText }}&quot;</h4>
                    <!-- Spanish translation shown below English when language is set to Spanish -->
                    <p
                      v-if="settings.language === 'es' && (currentComponent.questionOptions as any)?.textEs"
                      class="text-base italic text-gray-500"
                    >
                      &quot;{{ (currentComponent.questionOptions as any).textEs }}&quot;
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
                        class="w-full premium-card bg-white p-6 text-lg outline-none min-h-[120px] shadow-inner"
                      />
                      <!-- MCQ -->
                      <div v-else-if="currentComponent.questionType === 'mcq'" class="space-y-3">
                        <button
                          v-for="(choice, ci) in (currentComponent.questionOptions as any)?.choices" :key="ci"
                          @click="answers[currentComponent.id] = (choice as any).text"
                          class="w-full text-left p-5 rounded-2xl font-bold text-lg border-2 transition-all"
                          :style="answers[currentComponent.id] === (choice as any).text
                            ? 'border-color:var(--brand-indigo); background:rgba(224,96,77,0.1); color:var(--brand-indigo); transform:scale(1.02)'
                            : 'border-color:#f1f5f9; background:white; color:#374151'"
                        >
                          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-black"
                            :style="answers[currentComponent.id] === (choice as any).text
                              ? 'background:var(--brand-indigo); color:white'
                              : 'background:#f1f5f9; color:#6b7280'"
                          >{{ String.fromCharCode(65 + Number(ci)) }}</span>
                          {{ (choice as any).text }}
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
                          <p class="italic">{{ feedbackReferenceText }}</p>
                          <p v-if="settings.language === 'es' && feedbackReferenceTextEs" class="italic text-gray-500">{{ feedbackReferenceTextEs }}</p>
                        </template>
                        <p v-else-if="isCurrentComponentCorrect">
                          Keep going! You're doing awesome!
                        </p>
                        <p v-if="!isCurrentComponentCorrect">
                          The correct answer was: <span class="font-bold">{{ correctAnswerText }}</span> You'll get it next time!
                        </p>
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
    <NuxtLink to="/reader/home"
      class="fixed left-2 top-1/2 -translate-y-1/2 z-[100] p-2 flex items-center gap-1 transition-all cursor-pointer group"
      style="color:rgba(224,96,77,0.6); text-decoration:none">
      <svg class="w-12 h-16 group-hover:-translate-x-1 transition-transform drop-shadow-md" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="text-sm font-bold uppercase tracking-wide">Home</span>
    </NuxtLink>

    <!-- ── RAFFLE TICKET DRAG-AND-DROP OVERLAY ── -->
    <Transition name="fade">
      <div v-if="showRaffleReward" class="fixed inset-0 z-[200] flex items-center justify-center" style="width:100vw; height:100vh; left:0; top:0;">
        <div class="absolute inset-0 backdrop-blur-md" style="background:rgba(15,23,42,0.6)" />
        <div class="p-6 bg-white max-w-md w-[90%] relative z-10 animate-pop text-center space-y-5 overflow-auto"
             style="border-radius:2.5rem; box-shadow:0 20px 60px rgba(0,0,0,0.3); border-bottom:8px solid var(--brand-gold);">

          <!-- Drag zone -->
          <div v-if="!ticketDropped" class="space-y-6">
            <h2 class="font-heading text-2xl font-black" style="color:var(--brand-dark)">You earned a RAFFLE TICKET! 🎉</h2>
            <p class="text-gray-500 font-medium">Drag your ticket into the raffle box!</p>

            <div class="relative mx-auto" style="height:200px">
              <div
                draggable="true"
                @dragstart="onTicketDragStart"
                @touchstart="onTicketTouchStart"
                @touchmove="onTicketTouchMove"
                @touchend="onTicketTouchEnd"
                class="absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing hover:scale-110 select-none transition-transform"
                :style="[{zIndex:10, touchAction:'none'}, ticketStyle]"
              >
                <div class="text-[80px] leading-none drop-shadow-lg animate-bounce">🎟️</div>
                <p class="text-xs font-bold text-gray-400 mt-1">Drag me! ↑</p>
              </div>
            </div>

            <div
              id="raffle-box"
              @dragover.prevent="ticketOverBox = true"
              @dragleave="ticketOverBox = false"
              @drop.prevent="onTicketDrop"
              class="mx-auto w-40 h-32 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center transition-all duration-300"
              :style="ticketOverBox ? 'border-color:var(--brand-gold); background:rgba(245,158,11,0.2); transform:scale(1.1)' : 'border-color:#d1d5db; background:#f9fafb'"
            >
              <span class="text-4xl">📦</span>
              <span class="text-xs font-bold text-gray-400 uppercase mt-1">Raffle Box</span>
            </div>
          </div>

          <!-- After drop -->
          <div v-else class="flex flex-col items-center justify-center text-center space-y-4 py-4">
            <div class="text-[72px] leading-none">🎉</div>
            <h2 class="font-heading text-2xl font-black" style="color:var(--brand-dark)">Ticket Entered!</h2>
            <p class="text-base text-gray-500 font-medium">Great job completing today's form!</p>
            <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full font-heading font-black text-lg" style="background:rgba(245,158,11,0.2); color:var(--brand-dark)">
              🎟️ You now have {{ stats.tickets }} tickets!
            </div>
            <button
              @click="showRaffleReward = false; ticketDropped = false"
              class="btn-fun text-white py-3 px-10 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 mt-1"
              style="background:var(--brand-indigo)">Back to Home 🏠</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style>
@import './reader.css';
</style>
