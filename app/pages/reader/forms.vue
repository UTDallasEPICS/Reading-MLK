<script setup lang="ts">
definePageMeta({ ssr: false })

const settings = reactive({ theme: 'light', dyslexiaFont: false, language: 'en', fontSize: 1 })

const stats = reactive({ xp: 1250, booksRead: 14, streak: 5, tickets: 3 })

const themeClass = computed(() => {
  const t = settings.theme !== 'light' ? `theme-${settings.theme}` : ''
  const d = settings.dyslexiaFont ? 'dyslexia-font' : ''
  return `reader-app ${t} ${d}`.trim()
})

// ── Click badge animations ──
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

// ── Forms data ──
const formsMode = ref<'list'|'history'>('list')

const thisWeekForms = ref([
  {
    id: 201, day: 'Monday', dayNum: 1, title: 'Kindness & Compassion', missed: true, status: 'Active',
    questions: [
      { id: 2011, type: 'context', text: 'Read the story of the Bell of Atri.', textEs: 'Lee la historia de la Campana de Atri.', reference: 'A story about justice and kindness to animals.', referenceEs: 'Una historia sobre la justicia y la bondad con los animales.' },
      { id: 2012, type: 'video',   text: 'Watch this video on empathy', textEs: 'Mira este video sobre la empatía', url: 'https://www.youtube.com/embed/1Evwgu369Jw', reference: '', referenceEs: '' },
      { id: 2013, type: 'text',    text: 'What did the horse do in the story?', textEs: '¿Qué hizo el caballo en la historia?', reference: 'He rang the bell to ask for justice.', referenceEs: 'Tocó la campana para pedir justicia.' },
      { id: 2014, type: 'mcq',     text: 'If there are 5 bells and 3 horses, how many items in total?', textEs: 'Si hay 5 campanas y 3 caballos, ¿cuántos en total?', reference: '8', referenceEs: '8',
        choices: [{ text:'6',correct:false },{ text:'8',correct:true },{ text:'10',correct:false },{ text:'15',correct:false }] },
    ]
  },
  {
    id: 202, day: 'Tuesday', dayNum: 2, title: 'Honesty & Truth', missed: true, status: 'Active',
    questions: [
      { id: 2021, type: 'context', text: 'Read about George Washington and the cherry tree.', textEs: '', reference: 'A tale about the value of telling the truth.', referenceEs: '' },
      { id: 2022, type: 'text',    text: 'Why is honesty important?', textEs: '¿Por qué es importante la honestidad?', reference: 'It builds trust and respect.', referenceEs: 'Genera confianza y respeto.' },
      { id: 2023, type: 'mcq',     text: 'If George planted 12 trees and chopped 1, how many are left?', textEs: '', reference: '11', referenceEs: '11',
        choices: [{ text:'10',correct:false },{ text:'11',correct:true },{ text:'12',correct:false },{ text:'13',correct:false }] },
    ]
  },
  {
    id: 203, day: 'Wednesday', dayNum: 3, title: 'Courage & Bravery', missed: false, status: 'Active',
    questions: [
      { id: 2031, type: 'context', text: 'Read about Ruby Bridges walking to school.', textEs: '', reference: 'Ruby was the first Black child to attend an all-white school.', referenceEs: '' },
      { id: 2032, type: 'video',   text: 'Watch this video about courage', textEs: '', url: 'https://www.youtube.com/embed/1Evwgu369Jw', reference: '', referenceEs: '' },
      { id: 2033, type: 'text',    text: 'What made Ruby brave?', textEs: '¿Qué hizo valiente a Ruby?', reference: 'She kept going even when people tried to stop her.', referenceEs: '' },
    ]
  },
  {
    id: 204, day: 'Thursday', dayNum: 4, title: 'Friendship & Loyalty', missed: false, status: 'Active',
    questions: [
      { id: 2041, type: 'context', text: "Read the story of Charlotte's Web.", textEs: '', reference: "Charlotte saved Wilbur through her friendship.", referenceEs: '' },
      { id: 2042, type: 'text',    text: 'How did Charlotte show she was a true friend?', textEs: '', reference: "She used her web to write messages that saved Wilbur.", referenceEs: '' },
      { id: 2043, type: 'mcq',     text: 'Charlotte wrote 3 words. Each word has 5 letters. How many letters total?', textEs: '', reference: '15', referenceEs: '15',
        choices: [{ text:'8',correct:false },{ text:'10',correct:false },{ text:'15',correct:true },{ text:'20',correct:false }] },
    ]
  },
  {
    id: 205, day: 'Friday', dayNum: 5, title: 'Gratitude & Appreciation', missed: false, status: 'Active',
    questions: [
      { id: 2051, type: 'context', text: 'Read about the meaning of gratitude.', textEs: '', reference: 'Gratitude is being thankful for what you have.', referenceEs: '' },
      { id: 2052, type: 'text',    text: 'Name 3 things you are grateful for today.', textEs: 'Nombra 3 cosas por las que estás agradecido hoy.', reference: 'Open-ended — any thoughtful answer.', referenceEs: '' },
      { id: 2053, type: 'mcq',     text: 'If you thanked 4 people today and 3 yesterday, how many total?', textEs: '', reference: '7', referenceEs: '7',
        choices: [{ text:'5',correct:false },{ text:'6',correct:false },{ text:'7',correct:true },{ text:'8',correct:false }] },
    ]
  },
])

const completedWeeks = ref<number[]>([])

// ── Flow state ──
const activeForm         = ref<any>(null)
const preFormStep        = ref<string|null>(null)   // 'ask' | 'has-book' | 'no-book' | null
const preFormBookTitle   = ref('')
const hasOwnBook         = ref(false)
const currentQIdx        = ref(0)
const answers            = ref<Record<number,string>>({})
const feedbackVisible    = ref<Record<number,boolean>>({})

// Raffle reward
const showRaffleReward   = ref(false)
const ticketDropped      = ref(false)
const ticketOverBox      = ref(false)
const ticketStyle        = ref<Record<string,string>>({})
let touchStartY = 0

function startChallenge(form: any) {
  activeForm.value      = form
  preFormStep.value     = 'ask'
  preFormBookTitle.value = ''
  currentQIdx.value     = 0
  feedbackVisible.value = {}
  answers.value         = {}
}

function preFormAddBook() {
  if (preFormBookTitle.value.trim()) { stats.booksRead++; hasOwnBook.value = true }
  preFormStep.value = null
}

function preFormSkipToForm() {
  hasOwnBook.value  = false
  preFormStep.value = null
}

function checkAnswer() {
  const q = activeForm.value.questions[currentQIdx.value]
  feedbackVisible.value[q.id] = true
}

function nextStep() {
  const qs = activeForm.value.questions
  if (currentQIdx.value < qs.length - 1) {
    currentQIdx.value++
    if (hasOwnBook.value && qs[currentQIdx.value].type === 'video') nextStep()
  } else {
    submitChallenge()
  }
}

function submitChallenge() {
  completedWeeks.value.push(activeForm.value.id)
  stats.xp      += 100
  stats.tickets += 1
  showRaffleReward.value = true
  ticketDropped.value    = false
  ticketOverBox.value    = false
  ticketStyle.value      = {}
  setTimeout(() => {
    activeForm.value      = null
    currentQIdx.value     = 0
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
        <NuxtLink to="/reader"
          class="w-14 h-14 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-all"
          style="text-decoration:none">🏠</NuxtLink>
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
            v-for="form in thisWeekForms" :key="form.id"
            @click="!completedWeeks.includes(form.id) && startChallenge(form)"
            class="premium-card p-5 flex items-center justify-between group transition-all"
            :class="[
              completedWeeks.includes(form.id) ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]',
              completedWeeks.includes(form.id) ? '' : form.missed ? 'hover:!border-amber-400' : ''
            ]"
            :style="completedWeeks.includes(form.id)
              ? 'border-color:rgba(45,212,191,0.4); background:rgba(45,212,191,0.05)'
              : form.missed ? 'border-color:#fcd34d; background:rgba(251,191,36,0.05)' : ''"
          >
            <div class="flex items-center gap-5">
              <div
                class="w-14 h-14 rounded-xl flex flex-col items-center justify-center font-heading font-bold transition text-sm"
                :style="completedWeeks.includes(form.id)
                  ? 'background:var(--brand-mint); color:white'
                  : form.missed
                    ? 'background:#f59e0b; color:white'
                    : 'background:rgba(224,96,77,0.1); color:var(--brand-indigo)'"
              >
                <span class="text-[9px] uppercase leading-none">{{ form.day.substring(0,3) }}</span>
                <span class="text-lg font-black leading-tight">{{ form.dayNum }}</span>
              </div>
              <div>
                <h4 class="font-heading text-lg font-bold" style="color:var(--brand-dark)">{{ form.title }}</h4>
                <div class="flex items-center gap-2 mt-0.5">
                  <p class="text-xs font-bold text-gray-400">{{ form.day }} • {{ form.questions.length }} Steps</p>
                  <span v-if="completedWeeks.includes(form.id)" class="text-xs font-black px-2 py-0.5 rounded-full" style="color:var(--brand-mint); background:rgba(45,212,191,0.15)">✓ Done</span>
                  <span v-else-if="form.missed" class="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Missed</span>
                </div>
              </div>
            </div>
            <div v-if="!completedWeeks.includes(form.id)">
              <button class="btn-fun text-white px-5 py-2 rounded-xl font-bold text-sm"
                      :style="form.missed ? 'background:#f59e0b' : 'background:var(--brand-indigo)'">Start 🚀</button>
            </div>
            <div v-else><span class="text-2xl">✅</span></div>
          </div>
        </div>

        <!-- ── PRE-FORM: Ask ── -->
        <div v-else-if="activeForm && preFormStep === 'ask'" class="space-y-6">
          <div class="premium-card p-10 bg-white/60 text-center space-y-6">
            <div class="text-8xl animate-bounce">📚</div>
            <h3 class="font-heading text-3xl font-bold" style="color:var(--brand-dark)">Before we start...</h3>
            <p class="text-xl text-gray-500 font-medium">Do you already have a book you've been reading?</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <button @click="preFormStep = 'has-book'"
                class="btn-fun text-white py-5 rounded-2xl font-bold text-xl shadow-lg hover:scale-105"
                style="background:var(--brand-indigo)">Yes, I have a book! 📖</button>
              <button @click="preFormStep = 'no-book'"
                class="btn-fun text-gray-900 py-5 rounded-2xl font-bold text-xl shadow-lg hover:scale-105"
                style="background:var(--brand-gold)">No, I need one 📺</button>
            </div>
            <button @click="activeForm = null; preFormStep = null" class="text-gray-400 font-bold hover:text-gray-700 transition text-sm">← Back to Forms</button>
          </div>
        </div>

        <!-- ── PRE-FORM: Has book ── -->
        <div v-else-if="activeForm && preFormStep === 'has-book'" class="space-y-6">
          <div class="premium-card p-10 bg-white/60 text-center space-y-6">
            <div class="text-8xl">📖</div>
            <h3 class="font-heading text-3xl font-bold" style="color:var(--brand-dark)">Awesome! What book are you reading?</h3>
            <div class="max-w-md mx-auto">
              <input v-model="preFormBookTitle" type="text" placeholder="Type your book title..."
                class="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-xl outline-none text-center transition"
                style="focus:border-color:var(--brand-indigo)" />
            </div>
            <button @click="preFormAddBook" :disabled="!preFormBookTitle.trim()"
              class="btn-fun text-white py-4 px-12 rounded-2xl font-bold text-xl shadow-lg disabled:opacity-40 hover:scale-105"
              style="background:var(--brand-indigo)">Add to Library & Start Form ✨</button>
            <button @click="preFormStep = 'ask'" class="block mx-auto text-gray-400 font-bold hover:text-gray-700 transition text-sm">← Go Back</button>
          </div>
        </div>

        <!-- ── PRE-FORM: No book (watch video) ── -->
        <div v-else-if="activeForm && preFormStep === 'no-book'" class="space-y-4">
          <div class="premium-card p-5 bg-white/60 text-center space-y-3">
            <h3 class="font-heading text-xl font-bold" style="color:var(--brand-dark)">📺 Let's read a story together!</h3>
            <p class="text-gray-500 font-medium text-sm">Watch this book being read aloud, then we'll do the form.</p>
            <div class="max-w-2xl mx-auto aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <iframe class="w-full h-full" src="https://www.youtube.com/embed/1Evwgu369Jw" frameborder="0" allowfullscreen />
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
                   :style="`width:${((currentQIdx + 1) / activeForm.questions.length) * 100}%`" />
            </div>

            <div class="flex justify-between items-center mb-4 mt-2">
              <div>
                <h3 class="font-heading text-2xl font-bold" style="color:var(--brand-dark)">{{ activeForm.title }}</h3>
                <p class="text-gray-400 font-bold">Step {{ currentQIdx + 1 }} of {{ activeForm.questions.length }}</p>
              </div>
              <button @click="activeForm = null; preFormStep = null" class="text-gray-400 hover:text-red-500 font-bold text-lg">Cancel</button>
            </div>

            <Transition name="step-fade" mode="out-in">
              <div :key="currentQIdx">
                <div v-if="activeForm.questions[currentQIdx]" class="space-y-3">

                  <!-- Type badge -->
                  <span v-if="activeForm.questions[currentQIdx].type !== 'video'"
                    class="inline-block px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    :class="getBadgeClass(activeForm.questions[currentQIdx].type)">
                    {{ activeForm.questions[currentQIdx].type }}
                  </span>

                  <!-- Context block -->
                  <div v-if="activeForm.questions[currentQIdx].type === 'context'" class="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                    <p class="text-xl font-heading font-bold leading-snug" style="color:var(--brand-dark)">{{ activeForm.questions[currentQIdx].text }}</p>
                    <p v-if="activeForm.questions[currentQIdx].textEs" class="text-sm text-gray-500 italic font-medium">{{ activeForm.questions[currentQIdx].textEs }}</p>
                  </div>

                  <!-- Video -->
                  <div v-else-if="activeForm.questions[currentQIdx].type === 'video'"
                    class="max-w-2xl mx-auto aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                    <iframe class="w-full h-full" :src="activeForm.questions[currentQIdx].url" frameborder="0" allowfullscreen />
                  </div>

                  <!-- Text / MCQ question -->
                  <div v-else class="space-y-1">
                    <h4 class="text-xl font-heading font-bold" style="color:var(--brand-dark)">"{{ activeForm.questions[currentQIdx].text }}"</h4>
                    <p v-if="activeForm.questions[currentQIdx].textEs" class="text-sm font-medium text-gray-400 italic">"{{ activeForm.questions[currentQIdx].textEs }}"</p>
                  </div>

                  <!-- Input area -->
                  <div v-if="['text','mcq'].includes(activeForm.questions[currentQIdx].type)" class="mt-6">
                    <!-- Not yet answered -->
                    <div v-if="!feedbackVisible[activeForm.questions[currentQIdx].id]">
                      <textarea
                        v-if="activeForm.questions[currentQIdx].type === 'text'"
                        v-model="answers[activeForm.questions[currentQIdx].id]"
                        placeholder="Type your answer here..."
                        class="w-full premium-card bg-white p-6 text-lg outline-none min-h-[120px] shadow-inner"
                      />
                      <!-- MCQ -->
                      <div v-else-if="activeForm.questions[currentQIdx].type === 'mcq'" class="space-y-3">
                        <button
                          v-for="(choice, ci) in activeForm.questions[currentQIdx].choices" :key="ci"
                          @click="answers[activeForm.questions[currentQIdx].id] = choice.text"
                          class="w-full text-left p-5 rounded-2xl font-bold text-lg border-2 transition-all"
                          :style="answers[activeForm.questions[currentQIdx].id] === choice.text
                            ? 'border-color:var(--brand-indigo); background:rgba(224,96,77,0.1); color:var(--brand-indigo); transform:scale(1.02)'
                            : 'border-color:#f1f5f9; background:white; color:#374151'"
                        >
                          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-black"
                            :style="answers[activeForm.questions[currentQIdx].id] === choice.text
                              ? 'background:var(--brand-indigo); color:white'
                              : 'background:#f1f5f9; color:#6b7280'"
                          >{{ String.fromCharCode(65 + ci) }}</span>
                          {{ choice.text }}
                        </button>
                      </div>

                      <button
                        @click="checkAnswer"
                        :disabled="!answers[activeForm.questions[currentQIdx].id]"
                        class="mt-6 btn-fun w-full text-white py-4 rounded-2xl font-bold text-xl disabled:opacity-50 shadow-lg"
                        style="background:var(--brand-indigo)">Check Answer ✨</button>
                    </div>

                    <!-- Feedback -->
                    <div v-else class="p-6 rounded-[2rem] animate-pop-bounce border-2"
                         style="background:rgba(45,212,191,0.1); border-color:rgba(45,212,191,0.3)">
                      <div class="font-black mb-2 uppercase tracking-widest flex items-center gap-2" style="color:var(--brand-mint)">
                        ✨ Great job!
                      </div>
                      <p class="text-gray-700 font-medium">Reference: "{{ activeForm.questions[currentQIdx].reference }}"</p>
                      <p v-if="activeForm.questions[currentQIdx].referenceEs" class="text-gray-500 italic text-sm">"{{ activeForm.questions[currentQIdx].referenceEs }}"</p>
                    </div>
                  </div>

                  <!-- Navigation -->
                  <div class="flex justify-between items-center mt-4">
                    <button v-if="currentQIdx > 0" @click="currentQIdx--"
                      class="text-gray-400 font-bold hover:text-gray-700 transition text-lg">← Back</button>
                    <div v-else />
                    <div class="flex-grow" />
                    <!-- Context / Video: always show Continue -->
                    <button
                      v-if="['context','video'].includes(activeForm.questions[currentQIdx].type)"
                      @click="nextStep"
                      class="btn-fun text-white px-10 py-3 rounded-2xl font-bold text-lg shadow-lg"
                      style="background:var(--brand-dark)"
                    >{{ currentQIdx < activeForm.questions.length - 1 ? 'Continue ➡️' : 'Finish Challenge! 🎉' }}</button>
                    <!-- Text/MCQ after answered -->
                    <button
                      v-else-if="feedbackVisible[activeForm.questions[currentQIdx].id]"
                      @click="nextStep"
                      class="btn-fun text-white px-10 py-3 rounded-2xl font-bold text-lg"
                      style="background:var(--brand-dark)"
                    >{{ currentQIdx < activeForm.questions.length - 1 ? 'Next Step' : 'Finish Challenge! 🎉' }}</button>
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
      <div v-if="showRaffleReward" class="fixed inset-0 z-[200]" style="width:100vw; height:100vh; left:0; top:0;">
        <div class="absolute inset-0 backdrop-blur-md" style="background:rgba(15,23,42,0.6)" />
        <div class="p-6 bg-white max-w-md w-[90%] absolute z-10 animate-pop text-center space-y-5 overflow-auto"
             style="border-radius:2.5rem; box-shadow:0 20px 60px rgba(0,0,0,0.3); border-bottom:8px solid var(--brand-gold); left:50%; top:50%; transform:translate(-50%,-50%)">

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
