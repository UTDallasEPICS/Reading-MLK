<script setup lang="ts">
  definePageMeta({ ssr: false })

  const { student, settings, restoreStudent } = useCurrentStudent()
  const { FormGroup, loadActiveFormGroup } = useCurrentFormGroup()
  const { completedFormIds, logFormSubmission, logSubmissionResponse, loadProgress } =
    useCurrentStudentProgress()
  const { loadPet } = useProgressPet()
  const petReaction = ref<'idle' | 'next' | 'complete'>('idle')
  const petReactionKey = ref(0)

  function reactPet(reaction: 'idle' | 'next' | 'complete') {
    petReaction.value = reaction
    petReactionKey.value++
  }

  const dataLoaded = ref(false)
  const joinToken = ref('')
  const joiningClass = ref(false)
  const joinMessage = ref('')
  const joinError = ref('')
  const selectedClass = computed(() => {
    if (FormGroup.value.selectedClassId === 'all') {
      return { id: 'all', name: 'All Published Forms' }
    }

    return (
      FormGroup.value.classes.find(
        (classroom) => classroom.id === FormGroup.value.selectedClassId
      ) ?? null
    )
  })

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

  async function joinClass() {
    if (!student.value?.id || joiningClass.value) return

    joiningClass.value = true
    joinMessage.value = ''
    joinError.value = ''

    try {
      const classroom = await $fetch<{ id: string; name: string }>(
        `/api/student/${student.value.id}/join`,
        {
          method: 'POST',
          body: { joinToken: joinToken.value },
        }
      )
      joinToken.value = ''
      joinMessage.value = `Joined ${classroom.name}`
      await loadActiveFormGroup(classroom.id)
      await loadProgress()
    } catch (error: any) {
      joinError.value = error.data?.statusMessage || 'Could not join this class'
    } finally {
      joiningClass.value = false
    }
  }

  async function enterClass(classId: string) {
    await loadActiveFormGroup(classId)
    await loadProgress()
  }

  async function returnToClasses() {
    activeForm.value = null
    preFormStep.value = null
    await loadActiveFormGroup()
    await loadProgress()
  }

  const themeClass = computed(() => {
    const t = settings.value.theme !== 'light' ? `theme-${settings.value.theme}` : ''
    const d = settings.value.dyslexiaFont ? 'dyslexia-font' : ''
    return `reader-app ${t} ${d}`.trim()
  })

  const currentFormComponentsWithVideo = computed(() => {
    if (!activeForm.value?.id) return []
    return FormGroup.value.formComponents[activeForm.value.id] || []
  })

  function embedURL(rawUrl: string) {
    const match = rawUrl.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    )
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
    return rawUrl
  }

  const firstVideoComponent = computed(() => {
    return (
      (currentFormComponentsWithVideo.value.find(
        (c) => (c as any).questionType === 'video'
      ) as any) || null
    )
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
    const firstVideoIndex = components.findIndex((c) => c.questionType === 'video')
    let filteredComponents = [...components]

    // Always remove the first video component so it doesn't appear in the form flow itself, only pre-form stage
    if (firstVideoIndex !== -1) {
      filteredComponents.splice(firstVideoIndex, 1)
    }

    return filteredComponents
  })

  const currentComponent = computed(() => currentFormComponents.value[currentComponentID.value])

  // Click badge animations
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

  // Flow state
  const activeForm = ref<any>(null)
  const preFormStep = ref<string | null>(null) // 'ask' | 'has-book' | 'no-book' | null
  const hasOwnBook = ref(false)
  const currentComponentID = ref(0)
  const answers = ref<Record<number, string>>({})
  const feedbackVisible = ref<Record<number, boolean>>({})

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
    activeForm.value = form
    preFormStep.value = 'ask'
    currentComponentID.value = 0
    feedbackVisible.value = {}
    //load answers
    answers.value = {}
  }

  function preFormSkipToForm() {
    hasOwnBook.value = false
    preFormStep.value = null
  }

  function checkAnswer() {
    const q = currentFormComponents.value[currentComponentID.value]
    if (q) feedbackVisible.value[q.id] = true
  }

  function nextStep() {
    const qs = currentFormComponents.value
    if (currentComponentID.value < qs.length - 1) {
      reactPet('next')
      currentComponentID.value++
    } else {
      submitChallenge()
    }
  }

  const showXpReward = ref(false)
  const xpRewardAmount = ref(0)
  const submitting = ref(false)
  const submissionError = ref('')

  async function submitChallenge() {
    if (submitting.value || !activeForm.value) return
    submitting.value = true
    submissionError.value = ''
    try {
      const classId = FormGroup.value.selectedClassId
      const submission = await logFormSubmission(
        activeForm.value.id,
        classId === 'all' ? null : classId
      )
      if (!submission) {
        submissionError.value = 'Could not submit your challenge. Please try again.'
        return
      }
      activeForm.value = null
      currentComponentID.value = 0
      feedbackVisible.value = {}
      answers.value = {}
      await loadPet()
      reactPet('complete')
      xpRewardAmount.value = submission.xpAwarded
      showXpReward.value = submission.xpAwarded > 0
    } finally {
      submitting.value = false
    }
  }

  function closeXpReward() {
    showXpReward.value = false
    reactPet('idle')
    navigateTo('/reader')
  }

  function getBadgeClass(type: string) {
    if (type === 'text') return 'bg-blue-100 text-blue-700 border-2 border-blue-200'
    if (type === 'mcq') return 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
    if (type === 'video') return 'bg-pink-100 text-pink-600 border-2 border-pink-200'
    return 'bg-gray-100 text-gray-500 border-2 border-gray-200'
  }
</script>

<template>
  <div :class="themeClass" class="min-h-screen px-4 pt-4 pb-32">
    <ReaderEquippedBanner />
    <ReaderDecorations />
    <ReaderEffects />
    <ProgressPet
      mode="form"
      :reaction="petReaction"
      :reaction-key="petReactionKey"
      :show-dialogue="!activeForm"
    />
    <p
      v-if="submissionError"
      role="alert"
      class="relative z-50 rounded-xl bg-red-50 p-4 text-red-700"
    >
      {{ submissionError }}
    </p>

    <!-- ── TOP BAR ── -->
    <header class="relative z-[200] mx-auto mb-8 flex max-w-4xl items-center justify-between px-2">
      <div class="flex items-center gap-3">
        <NuxtLink to="/reader" aria-label="Go to Reading Buddy home">
          <img src="/reader-logo.png" alt="Reading Huddle" class="h-20 w-20 object-contain" />
        </NuxtLink>
      </div>
      <div class="flex items-center gap-3">
        <!-- XP -->
        <div
          class="relative flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-white/90 px-4 py-2 shadow-xl backdrop-blur-md select-none"
          style="border-color: rgba(245, 158, 11, 0.3)"
          :class="
            xpClicked
              ? 'scale-90 transition-transform duration-100'
              : 'transition-transform duration-100'
          "
          @click="triggerXpClick"
        >
          <span class="text-lg" :class="xpClicked ? 'animate-star-spin' : ''">⭐️</span>
          <span class="font-heading font-bold text-amber-600">{{ stats.xp }}</span>
          <span
            v-for="c in burstCoins"
            :key="c.id"
            class="animate-coin-burst absolute text-sm"
            :style="`--tx:${c.tx}px;--ty:${c.ty}px;left:50%;top:50%;`"
            >⭐️</span
          >
        </div>
        <!-- Settings / Home -->
        <NuxtLink
          to="/reader/settings"
          class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-white bg-white/90 text-2xl shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
          style="text-decoration: none"
          >⚙️</NuxtLink
        >
      </div>
    </header>

    <!-- ── MAIN ── -->
    <main class="mx-auto min-h-[60vh] max-w-4xl">
      <!-- Loading state -->
      <div v-if="!dataLoaded" class="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <div class="animate-bounce text-6xl">📝</div>
        <p class="font-heading text-xl font-bold text-gray-400">Loading forms...</p>
      </div>

      <section v-else class="space-y-6">
        <div class="mb-2">
          <h2 class="font-heading mb-4 text-4xl font-bold" style="color: var(--brand-dark)">
            Daily Forms
          </h2>
        </div>

        <!-- ── FORMS LIST ── -->
        <div v-if="!activeForm && !selectedClass" class="grid gap-3">
          <form
            class="premium-card flex flex-wrap items-center gap-3 p-4"
            @submit.prevent="joinClass"
          >
            <label for="class-code" class="font-bold" style="color: var(--brand-dark)"
              >Join a class</label
            >
            <input
              id="class-code"
              v-model="joinToken"
              type="text"
              minlength="5"
              maxlength="5"
              autocomplete="off"
              placeholder="5-character code"
              class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-950 uppercase placeholder:text-gray-400"
              aria-describedby="class-join-status"
            />
            <button
              type="submit"
              :disabled="joiningClass || joinToken.length !== 5"
              class="btn-fun rounded-lg px-4 py-2 font-bold text-white disabled:opacity-50"
              style="background: var(--brand-indigo)"
            >
              {{ joiningClass ? 'Joining...' : 'Join' }}
            </button>
            <p
              id="class-join-status"
              v-if="joinMessage || joinError"
              class="w-full text-sm font-semibold"
              :class="joinError ? 'text-red-600' : 'text-green-700'"
            >
              {{ joinError || joinMessage }}
            </p>
          </form>
          <p
            v-if="FormGroup.classes.length === 0"
            class="py-8 text-center font-semibold text-gray-500"
          >
            Join a class with its code to see your class forms.
          </p>
          <h3 v-else class="font-heading mt-3 text-2xl font-bold" style="color: var(--brand-dark)">
            Choose a class
          </h3>
          <button
            v-for="classroom in FormGroup.classes"
            :key="classroom.id"
            type="button"
            class="premium-card flex items-center justify-between p-5 text-left transition-all hover:scale-[1.01]"
            @click="enterClass(classroom.id)"
          >
            <span class="font-heading text-xl font-bold" style="color: var(--brand-dark)">{{
              classroom.name
            }}</span>
            <span
              class="btn-fun rounded-xl px-5 py-2 font-bold text-white"
              style="background: var(--brand-indigo)"
              >Enter class →</span
            >
          </button>
        </div>

        <div v-else-if="!activeForm && selectedClass" class="grid gap-3">
          <div>
            <button
              type="button"
              class="text-sm font-bold text-gray-500 hover:text-gray-800"
              @click="returnToClasses"
            >
              ← Classes & join a class
            </button>
            <h3 class="font-heading mt-2 text-2xl font-bold" style="color: var(--brand-dark)">
              {{ selectedClass.name }}
            </h3>
          </div>
          <p
            v-if="FormGroup.forms.length === 0"
            class="py-8 text-center font-semibold text-gray-500"
          >
            No active forms for this class yet.
          </p>
          <div
            v-for="form in FormGroup.forms"
            :key="form.id"
            @click="!completedFormIds.includes(form.id) && startChallenge(form)"
            class="premium-card group flex items-center justify-between p-5 transition-all"
            :class="[
              completedFormIds.includes(form.id)
                ? 'cursor-default'
                : 'cursor-pointer hover:scale-[1.01]',
              completedFormIds.includes(form.id)
                ? ''
                : new Date(form.startDate) < new Date()
                  ? 'hover:!border-amber-400'
                  : '',
            ]"
            :style="
              completedFormIds.includes(form.id)
                ? 'border-color:rgba(45,212,191,0.4); background:rgba(45,212,191,0.05)'
                : new Date(form.startDate) < new Date()
                  ? 'border-color:#fcd34d; background:rgba(251,191,36,0.05)'
                  : ''
            "
          >
            <div class="flex items-center gap-5">
              <div
                class="font-heading flex h-14 w-14 flex-col items-center justify-center rounded-xl text-sm font-bold transition"
                :style="
                  completedFormIds.includes(form.id)
                    ? 'background:var(--brand-mint); color:white'
                    : new Date(form.startDate) < new Date()
                      ? 'background:#f59e0b; color:white'
                      : 'background:rgba(224,96,77,0.1); color:var(--brand-indigo)'
                "
              >
                <span class="text-[9px] leading-none uppercase">{{
                  new Date(form.startDate).toLocaleDateString('en-US', { weekday: 'short' })
                }}</span>
                <span class="text-lg leading-tight font-black">{{
                  new Date(form.startDate).getDate()
                }}</span>
              </div>
              <div>
                <h4 class="font-heading text-lg font-bold" style="color: var(--brand-dark)">
                  {{ form.title }}
                </h4>
                <div class="mt-0.5 flex items-center gap-2">
                  <p class="text-xs font-bold text-gray-400">
                    {{ new Date(form.startDate).toLocaleDateString('en-US', { weekday: 'long' }) }}
                    • {{ (FormGroup.formComponents[form.id] || []).length }} Steps
                  </p>
                  <span
                    v-if="completedFormIds.includes(form.id)"
                    class="rounded-full px-2 py-0.5 text-xs font-black"
                    style="color: var(--brand-mint); background: rgba(45, 212, 191, 0.15)"
                    >✓ Done</span
                  >
                </div>
              </div>
            </div>
            <div v-if="!completedFormIds.includes(form.id)">
              <button
                class="btn-fun rounded-xl px-5 py-2 text-sm font-bold text-white"
                :style="
                  new Date(form.startDate) < new Date()
                    ? 'background:#f59e0b'
                    : 'background:var(--brand-indigo)'
                "
              >
                Start
              </button>
            </div>
            <div v-else>
              <span class="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700"
                >Completed</span
              >
            </div>
          </div>
        </div>

        <!-- ── PRE-FORM: Ask ── -->
        <div v-else-if="activeForm && preFormStep === 'ask'" class="space-y-6">
          <div class="premium-card space-y-6 bg-white/60 p-10 text-center">
            <div
              class="mx-auto flex h-36 w-48 items-center justify-center rounded-[2rem] bg-gradient-to-br from-amber-100 via-orange-50 to-indigo-100 shadow-inner"
            >
              <svg
                class="h-24 w-32 text-indigo-600"
                viewBox="0 0 128 96"
                fill="none"
                role="img"
                aria-label="An open book"
              >
                <path
                  d="M64 24C51 13 34 12 13 18v52c21-6 38-5 51 6V24Z"
                  fill="#fff"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
                <path
                  d="M64 24c13-11 30-12 51-6v52c-21-6-38-5-51 6V24Z"
                  fill="#fff"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
                <path
                  d="M64 24v52M23 30c12-3 23-2 32 2M23 42c12-3 23-2 32 2M105 30c-12-3-23-2-32 2M105 42c-12-3-23-2-32 2"
                  stroke="#f59e0b"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <path
                  d="m18 13 3-6m90 6-3-6"
                  stroke="#f59e0b"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <h3 class="font-heading text-3xl font-bold" style="color: var(--brand-dark)">
              Before we start...
            </h3>
            <p class="text-xl font-medium text-gray-500">Do you already have a book to read?</p>
            <div
              class="mx-auto grid max-w-md grid-cols-1 gap-4 sm:grid-cols-2"
              :class="{ 'sm:grid-cols-1': !firstVideoUrl }"
            >
              <button
                @click="
                  hasOwnBook = true
                  preFormStep = null
                "
                class="btn-fun rounded-2xl py-5 text-xl font-bold text-white shadow-lg hover:scale-105"
                style="background: var(--brand-indigo)"
              >
                Yes, I have a book!
              </button>
              <button
                @click="preFormStep = 'no-book'"
                class="btn-fun rounded-2xl py-5 text-xl font-bold text-gray-900 shadow-lg hover:scale-105"
                style="background: var(--brand-gold)"
              >
                No, I need one
              </button>
            </div>
            <button
              @click="
                activeForm = null
                preFormStep = null
              "
              class="text-sm font-bold text-gray-400 transition hover:text-gray-700"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        <!-- ── PRE-FORM: No book (watch video) ── -->
        <div v-else-if="activeForm && preFormStep === 'no-book'" class="space-y-4">
          <div class="premium-card space-y-3 bg-white/60 p-5 text-center">
            <h3 class="font-heading text-xl font-bold" style="color: var(--brand-dark)">
              Let's read a story together!
            </h3>
            <p class="text-sm font-medium text-gray-500">
              Use this provided resource, then we'll do the form.
            </p>
            <div
              v-if="firstVideoContext"
              class="mx-auto max-w-2xl space-y-2 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-left"
            >
              <p
                class="font-heading text-xl leading-snug font-bold"
                style="color: var(--brand-dark)"
              >
                <span v-html="firstVideoContext"></span>
              </p>
              <p
                v-if="settings.language === 'es' && firstVideoContextEs"
                class="border-t border-amber-200 pt-2 text-base leading-snug text-gray-500 italic"
              >
                <span v-html="firstVideoContextEs"></span>
              </p>
            </div>
            <div
              class="mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-white shadow-lg"
            >
              <iframe
                v-if="firstVideoUrl"
                class="h-full w-full"
                :src="firstVideoUrl"
                frameborder="0"
                allow="
                  accelerometer;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                "
                allowfullscreen
              ></iframe>
            </div>
            <div class="flex items-center justify-center gap-4 pt-1">
              <button
                @click="preFormStep = 'ask'"
                class="text-sm font-bold text-gray-400 transition hover:text-gray-700"
              >
                ← Back
              </button>
              <button
                @click="preFormSkipToForm"
                class="btn-fun rounded-2xl px-10 py-3 text-lg font-bold text-white shadow-lg hover:scale-105"
                style="background: var(--brand-indigo)"
              >
                Continue to Form
              </button>
            </div>
          </div>
        </div>

        <!-- ── ACTIVE FORM QUESTIONS ── -->
        <div v-else-if="activeForm && !preFormStep" class="space-y-6">
          <div class="premium-card relative overflow-hidden bg-white/60 p-5">
            <!-- Progress bar -->
            <div class="absolute top-0 left-0 h-2 w-full bg-gray-100">
              <div
                class="h-full transition-all duration-500"
                style="background: var(--brand-indigo)"
                :style="`width:${((currentComponentID + 1) / currentFormComponents.length) * 100}%`"
              />
            </div>

            <div class="mt-2 mb-4 flex items-center justify-between">
              <div>
                <h3 class="font-heading text-2xl font-bold" style="color: var(--brand-dark)">
                  {{ activeForm?.title }}
                </h3>
                <p class="font-bold text-gray-400">
                  Step {{ Number(currentComponentID) + 1 }} of {{ currentFormComponents?.length }}
                </p>
              </div>
              <button
                @click="
                  activeForm = null
                  preFormStep = null
                "
                class="text-lg font-bold text-gray-400 hover:text-red-500"
              >
                Cancel
              </button>
            </div>

            <Transition name="step-fade" mode="out-in">
              <div :key="currentComponentID">
                <div v-if="currentComponent" class="space-y-3">
                  <!-- Type badge -->
                  <span
                    v-if="currentComponent.questionType !== 'video'"
                    class="inline-block rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase"
                    :class="getBadgeClass(currentComponent.questionType)"
                  >
                    {{ currentComponent.questionType }}
                  </span>

                  <!-- Context block -->
                  <div
                    v-if="currentComponent.questionType === 'context'"
                    class="space-y-2 rounded-2xl border border-amber-100 bg-amber-50 p-5"
                  >
                    <p
                      class="font-heading text-xl leading-snug font-bold"
                      style="color: var(--brand-dark)"
                    >
                      <span v-html="currentComponent.questionText"></span>
                    </p>
                    <!-- Spanish translation shown below English when language is set to Spanish -->
                    <p
                      v-if="
                        settings.language === 'es' &&
                        (currentComponent.questionOptions as any)?.textEs
                      "
                      class="border-t border-amber-200 pt-2 text-base leading-snug text-gray-500 italic"
                    >
                      <span v-html="(currentComponent.questionOptions as any).textEs"></span>
                    </p>
                  </div>

                  <!-- Video -->
                  <div v-else-if="currentComponent.questionType === 'video'" class="space-y-3">
                    <div
                      v-if="currentComponent.questionText"
                      class="space-y-2 rounded-2xl border border-amber-100 bg-amber-50 p-5"
                    >
                      <p
                        class="font-heading text-xl leading-snug font-bold"
                        style="color: var(--brand-dark)"
                      >
                        <span v-html="currentComponent.questionText"></span>
                      </p>
                      <p
                        v-if="
                          settings.language === 'es' &&
                          (currentComponent.questionOptions as any)?.textEs
                        "
                        class="border-t border-amber-200 pt-2 text-base leading-snug text-gray-500 italic"
                      >
                        <span v-html="(currentComponent.questionOptions as any).textEs"></span>
                      </p>
                    </div>
                    <div
                      class="mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-white shadow-lg"
                    >
                      <iframe
                        class="h-full w-full"
                        :src="embedURL((currentComponent.questionOptions as any)?.url)"
                        frameborder="0"
                        allow="
                          accelerometer;
                          clipboard-write;
                          encrypted-media;
                          gyroscope;
                          picture-in-picture;
                        "
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>

                  <!-- Text / MCQ question -->
                  <div v-else class="space-y-1">
                    <h4 class="font-heading text-xl font-bold" style="color: var(--brand-dark)">
                      <span v-html="currentComponent.questionText"></span>
                    </h4>
                    <!-- Spanish translation shown below English when language is set to Spanish -->
                    <p
                      v-if="
                        settings.language === 'es' &&
                        (currentComponent.questionOptions as any)?.textEs
                      "
                      class="text-base text-gray-500 italic"
                    >
                      <span v-html="(currentComponent.questionOptions as any).textEs"></span>
                    </p>
                  </div>

                  <!-- Input area -->
                  <div v-if="['text', 'mcq'].includes(currentComponent.questionType)" class="mt-6">
                    <!-- Not yet answered -->
                    <div v-if="!feedbackVisible[currentComponent.id]">
                      <textarea
                        v-if="currentComponent.questionType === 'text'"
                        v-model="answers[currentComponent.id]"
                        placeholder="Type your answer here..."
                        class="premium-card min-h-[120px] w-full bg-white p-6 text-gray-500 shadow-inner outline-none"
                      />
                      <!-- MCQ -->
                      <div v-else-if="currentComponent.questionType === 'mcq'" class="space-y-3">
                        <button
                          v-for="(choice, ci) in (currentComponent.questionOptions as any)?.choices"
                          :key="ci"
                          @click="answers[currentComponent.id] = String(ci)"
                          class="w-full rounded-2xl border-2 p-5 text-left text-lg font-bold transition-all"
                          :style="
                            answers[currentComponent.id] === String(ci)
                              ? 'border-color:var(--brand-indigo); background:rgba(224,96,77,0.1); color:var(--brand-indigo); transform:scale(1.02)'
                              : 'border-color:#f1f5f9; background:white; color:#374151'
                          "
                        >
                          <span
                            class="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-black"
                            :style="
                              answers[currentComponent.id] === String(ci)
                                ? 'background:var(--brand-indigo); color:white'
                                : 'background:#f1f5f9; color:#6b7280'
                            "
                            >{{ String.fromCharCode(65 + Number(ci)) }}</span
                          >
                          <span v-html="(choice as any).text"></span>
                        </button>
                      </div>

                      <button
                        @click="checkAnswer"
                        :disabled="!answers[currentComponent.id]"
                        class="btn-fun mt-6 w-full rounded-2xl py-4 text-xl font-bold text-white shadow-lg disabled:opacity-50"
                        style="background: var(--brand-indigo)"
                      >
                        Check Answer
                      </button>
                    </div>

                    <!-- Feedback -->
                    <div
                      v-else
                      class="animate-pop-bounce rounded-[2rem] border-2 p-6"
                      :style="
                        isCurrentComponentCorrect
                          ? 'background:rgba(45,212,191,0.1); border-color:rgba(45,212,191,0.3)'
                          : 'background:rgba(245,158,11,0.1); border-color:rgba(245,158,11,0.3)'
                      "
                    >
                      <div
                        class="mb-2 flex items-center gap-2 font-black tracking-widest uppercase"
                        :style="
                          isCurrentComponentCorrect
                            ? 'color:var(--brand-mint)'
                            : 'color:var(--brand-gold)'
                        "
                      >
                        {{ isCurrentComponentCorrect ? '✨ Great job!' : '💡 Great Try!' }}
                      </div>
                      <div class="space-y-2 font-medium text-gray-700">
                        <template v-if="feedbackReferenceText">
                          <p class="italic"><span v-html="feedbackReferenceText"></span></p>
                          <p
                            v-if="settings.language === 'es' && feedbackReferenceTextEs"
                            class="text-gray-500 italic"
                          >
                            <span v-html="feedbackReferenceTextEs"></span>
                          </p>
                        </template>
                        <div v-if="currentComponent.questionType === 'mcq'">
                          <p v-if="isCurrentComponentCorrect">
                            The correct answer was:
                            <span class="font-bold" v-html="correctAnswerText"></span>
                            Keep going! You're doing awesome!
                          </p>
                          <p v-else>
                            The correct answer was:
                            <span class="font-bold" v-html="correctAnswerText"></span> You'll get it
                            next time!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Navigation -->
                  <div class="mt-4 flex items-center justify-between">
                    <button
                      v-if="currentComponentID > 0"
                      @click="currentComponentID--"
                      class="text-lg font-bold text-gray-400 transition hover:text-gray-700"
                    >
                      ← Back
                    </button>
                    <div v-else />
                    <div class="flex-grow" />
                    <!-- Context / Video: always show Continue -->
                    <button
                      v-if="['context', 'video'].includes(currentComponent.questionType)"
                      @click="nextStep"
                      class="btn-fun rounded-2xl px-10 py-3 text-lg font-bold text-white shadow-lg"
                      style="background: var(--brand-dark)"
                    >
                      {{
                        currentComponentID < currentFormComponents.length - 1
                          ? 'Continue ➡️'
                          : 'Finish Challenge!'
                      }}
                    </button>
                    <!-- Text/MCQ after answered -->
                    <button
                      v-else-if="feedbackVisible[currentComponent.id]"
                      @click="nextStep"
                      class="btn-fun rounded-2xl px-10 py-3 text-lg font-bold text-white"
                      style="background: var(--brand-dark)"
                    >
                      {{
                        currentComponentID < currentFormComponents.length - 1
                          ? 'Next Step'
                          : 'Finish Challenge!'
                      }}
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </section>
    </main>

    <!-- ── LEFT ARROW ── -->
    <NuxtLink
      to="/reader"
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
      <span class="text-sm font-bold tracking-wide uppercase">Home</span>
    </NuxtLink>

    <Transition name="fade">
      <div
        v-if="showXpReward"
        role="dialog"
        aria-modal="true"
        aria-labelledby="xp-reward-title"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
        <div
          class="animate-shop-pop relative w-full max-w-sm rounded-[2.5rem] border-b-8 border-amber-400 bg-white p-8 text-center shadow-2xl"
        >
          <div class="animate-pop-bounce mb-4 text-7xl" aria-hidden="true">🌟</div>
          <p class="text-sm font-black tracking-widest text-amber-600 uppercase">
            Challenge complete!
          </p>
          <h2 id="xp-reward-title" class="font-heading mt-2 text-3xl font-black text-slate-800">
            You earned {{ xpRewardAmount }} XP!
          </h2>
          <p class="mt-3 text-gray-500">Great work! Keep your reading streak going.</p>
          <button
            @click="closeXpReward"
            class="btn-fun mt-6 rounded-2xl px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
            style="background: var(--brand-indigo)"
          >
            Back to Home
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
  @import './reader.css';
</style>
