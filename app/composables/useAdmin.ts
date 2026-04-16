// composables/useAdmin.ts
// Place this at: app/composables/useAdmin.ts

export const useAdmin = () => {
  const callFormApi = async <T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', params: Record<string, unknown> = {}, body?: Record<string, unknown>): Promise<T> => {
    const queryString = method === 'GET' || method === 'DELETE'
      ? `?${new URLSearchParams(Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value)
          }

          return acc
        }, {} as Record<string, string>)).toString()}`
      : ''

    return await $fetch<T>(`/api/form${queryString}`, {
      method,
      body: method === 'GET' ? undefined : body,
    })
  }

  const parseDateToYmd = (value: string) => {
    if (!value) {
      return ''
    }

    const parsed = new Date(value)

    if (Number.isNaN(parsed.getTime())) {
      return ''
    }

    return parsed.toISOString().slice(0, 10)
  }

  const buildQuestionOptions = (question: any) => ({
    textEs: question.textEs ?? '',
    reference: question.reference ?? '',
    referenceEs: question.referenceEs ?? '',
    url: question.url ?? '',
    choices: Array.isArray(question.choices) ? question.choices : [],
  })

  const toApiQuestionText = (question: any, fallbackTitle: string) => {
    if (typeof question.text === 'string' && question.text.trim()) {
      return question.text.trim()
    }

    if (typeof question.reference === 'string' && question.reference.trim()) {
      return question.reference.trim()
    }

    if (typeof question.url === 'string' && question.url.trim()) {
      return `Video: ${question.url.trim()}`
    }

    return fallbackTitle || 'Untitled question'
  }

  const mapApiFormToUi = (form: any) => {
    const questionList = Array.isArray(form.questions) ? form.questions : []

    return {
      id: Number(form.id),
      weekStart: parseDateToYmd(form.weekStart || form.startDate || ''),
      day: form.day || 'Monday',
      title: form.title || `Form ${form.id}`,
      date: form.date || formatDate(form.startDate || ''),
      status: form.status || (form.published ? 'Active' : 'Unpublished'),
      questions: questionList.map((question: any, index: number) => ({
        id: Number(question.id ?? index + 1),
        type: question.type || question.questionType || 'text',
        text: question.text || question.questionText || '',
        textEs: question.questionOptions?.textEs || '',
        reference: question.questionOptions?.reference || '',
        referenceEs: question.questionOptions?.referenceEs || '',
        url: question.questionOptions?.url || '',
        choices: Array.isArray(question.questionOptions?.choices) ? question.questionOptions.choices : question.choices,
      })),
    }
  }

  // ── Builder state ──
  const builderSubTab  = useState<'history' | 'creation'>('builderSubTab', () => 'history')
  const formTitle      = useState('formTitle', () => '')
  const editingFormId  = useState<number | null>('editingFormId', () => null)
  const questions      = useState<any[]>('questions', () => [])

  // Week/day pickers — default to current Monday
  const todayDate  = new Date()
  const dayOff     = (todayDate.getDay() + 6) % 7
  const mon        = new Date(todayDate)
  mon.setDate(todayDate.getDate() - dayOff)
  const monStr     = mon.toISOString().split('T')[0]

  const formWeekStart    = useState('formWeekStart', () => monStr)
  const formDays         = useState<string[]>('formDays', () => ['Monday'])
  const historyWeekStart = useState('historyWeekStart', () => '')
  const historyStatusSelection = useState<Array<'published' | 'unpublished'>>('historyStatusSelection', () => ['published', 'unpublished'])
  const historyGroupStartDate = useState('historyGroupStartDate', () => '')
  const historyGroupEndDate = useState('historyGroupEndDate', () => '')
  const selectedFormDetails = useState<any | null>('selectedFormDetails', () => null)
  const formPublishDialog = useState<{
    visible: boolean
    title: string
    message: string
    days: string[]
  }>('formPublishDialog', () => ({
    visible: false,
    title: '',
    message: '',
    days: [],
  }))

  const formSaveDialog = useState<{
    visible: boolean
    mode: 'exact' | 'similar'
    title: string
    message: string
    existingForm: any | null
  }>('formSaveDialog', () => ({
    visible: false,
    mode: 'exact',
    title: '',
    message: '',
    existingForm: null,
  }))

  const pendingFormSave = useState<{
    shouldPublish: boolean
    plannedForms: Array<{
      day: string
      startDate: Date
    }>
    conflictIndex: number
    existingForm: any | null
  } | null>('pendingFormSave', () => null)

  const closeFormPublishDialog = () => {
    formPublishDialog.value = {
      visible: false,
      title: '',
      message: '',
      days: [],
    }
  }

  const closeFormSaveDialog = () => {
    formSaveDialog.value = {
      visible: false,
      mode: 'exact',
      title: '',
      message: '',
      existingForm: null,
    }
    pendingFormSave.value = null
  }

  const normalizeQuestionForComparison = (question: any) => ({
    type: String(question?.type ?? question?.questionType ?? '').trim(),
    text: String(question?.text ?? question?.questionText ?? '').trim(),
    textEs: String(question?.questionOptions?.textEs ?? question?.textEs ?? '').trim(),
    reference: String(question?.questionOptions?.reference ?? question?.reference ?? '').trim(),
    referenceEs: String(question?.questionOptions?.referenceEs ?? question?.referenceEs ?? '').trim(),
    url: String(question?.questionOptions?.url ?? question?.url ?? '').trim(),
    choices: Array.isArray(question?.questionOptions?.choices)
      ? question.questionOptions.choices.map((choice: any) => ({
          text: String(choice?.text ?? '').trim(),
          correct: Boolean(choice?.correct),
        }))
      : Array.isArray(question?.choices)
        ? question.choices.map((choice: any) => ({
            text: String(choice?.text ?? '').trim(),
            correct: Boolean(choice?.correct),
          }))
        : [],
  })

  const normalizeFormForComparison = (form: any) => ({
    id: Number(form?.id),
    title: String(form?.title ?? '').trim(),
    startDate: parseDateToYmd(String(form?.startDate ?? '')),
    endDate: parseDateToYmd(String(form?.endDate ?? '')),
    questions: Array.isArray(form?.questions)
      ? form.questions.map(normalizeQuestionForComparison)
      : [],
  })

  const deepEqualJson = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right)

  const countFormDifferences = (leftForm: any, rightForm: any) => {
    const left = normalizeFormForComparison(leftForm)
    const right = normalizeFormForComparison(rightForm)
    let differences = 0

    if (left.title !== right.title) differences++
    if (left.startDate !== right.startDate) differences++
    if (left.endDate !== right.endDate) differences++
    if (left.questions.length !== right.questions.length) differences++

    const maxQuestions = Math.max(left.questions.length, right.questions.length)

    for (let index = 0; index < maxQuestions; index++) {
      const leftQuestion = left.questions[index]
      const rightQuestion = right.questions[index]

      if (!leftQuestion || !rightQuestion) {
        continue
      }

      if (leftQuestion.type !== rightQuestion.type) differences++
      if (leftQuestion.text !== rightQuestion.text) differences++
      if (leftQuestion.textEs !== rightQuestion.textEs) differences++
      if (leftQuestion.reference !== rightQuestion.reference) differences++
      if (leftQuestion.referenceEs !== rightQuestion.referenceEs) differences++
      if (leftQuestion.url !== rightQuestion.url) differences++
      if (!deepEqualJson(leftQuestion.choices, rightQuestion.choices)) differences++
    }

    return differences
  }

  const buildQuestionPayload = (question: any) => ({
    textEs: question.textEs ?? '',
    reference: question.reference ?? '',
    referenceEs: question.referenceEs ?? '',
    url: question.url ?? '',
    choices: Array.isArray(question.choices) ? question.choices : [],
  })

  const updateExistingForm = async (formId: number, startDate: Date, published: boolean, title: string, formQuestions: any[]) => {
    const existingForm = publishedForms.value.find((form) => Number(form.id) === Number(formId))
    const existingComponentIds = new Set<number>(
      (existingForm?.questions ?? [])
        .map((question: any) => Number(question.id))
        .filter((questionId: number) => Number.isInteger(questionId) && questionId > 0)
    )

    await callFormApi('PUT', {}, {
      action: 'updateForm',
      id: formId,
      startDate: startDate.toISOString(),
      published,
      title,
    })

    for (let index = 0; index < formQuestions.length; index++) {
      const question = formQuestions[index]
      const numericQuestionId = Number(question.id)
      const isExistingComponent = Number.isInteger(numericQuestionId) && existingComponentIds.has(numericQuestionId)

      if (isExistingComponent) {
        await callFormApi('PUT', {}, {
          action: 'updateComponent',
          id: numericQuestionId,
          order: index,
          questionType: question.type,
          questionText: toApiQuestionText(question, title),
          questionOptions: buildQuestionPayload(question),
        })

        existingComponentIds.delete(numericQuestionId)
      } else {
        await callFormApi('POST', {}, {
          action: 'createComponent',
          form: formId,
          order: index,
          questionType: question.type,
          questionText: toApiQuestionText(question, title),
          questionOptions: buildQuestionPayload(question),
        })
      }
    }

    for (const removedId of existingComponentIds) {
      await callFormApi('DELETE', {}, {
        action: 'deleteComponent',
        id: removedId,
      })
    }
  }

  const createNewForm = async (startDate: Date, published: boolean, title: string, formQuestions: any[]) => {
    const createdFormResponse = await callFormApi<any>('POST', {}, {
      action: 'createForm',
      startDate: startDate.toISOString(),
      published,
      title,
    })

    const createdForm = createdFormResponse?.data

    if (!createdForm?.id) {
      return null
    }

    for (let index = 0; index < formQuestions.length; index++) {
      const question = formQuestions[index]

      await callFormApi('POST', {}, {
        action: 'createComponent',
        form: createdForm.id,
        order: index,
        questionType: question.type,
        questionText: toApiQuestionText(question, title),
        questionOptions: buildQuestionPayload(question),
      })
    }

    return createdForm
  }

  const comparePlannedFormAgainstExisting = (plannedForm: { startDate: Date }, existingForm: any) => {
    const candidate = {
      title: formTitle.value,
      startDate: plannedForm.startDate.toISOString(),
      endDate: '',
      questions: questions.value,
    }

    return countFormDifferences(candidate, existingForm)
  }

  const findMatchingExistingForm = async (plannedForm: { startDate: Date }) => {
    const allForms = await callFormApi<any[]>('GET', { action: 'listForms' })
    const normalizedAllForms = Array.isArray(allForms) ? allForms : []

    let exactMatch: any | null = null
    let similarMatch: any | null = null

    for (const form of normalizedAllForms) {
      if (editingFormId.value && Number(form.id) === Number(editingFormId.value)) {
        continue
      }

      const differenceCount = comparePlannedFormAgainstExisting(plannedForm, form)

      if (differenceCount === 0) {
        exactMatch = form
        break
      }

      if (differenceCount === 1 && !similarMatch) {
        similarMatch = form
      }
    }

    return { exactMatch, similarMatch }
  }

  const toggleHistoryStatus = (value: 'published' | 'unpublished') => {
    if (historyStatusSelection.value.includes(value)) {
      historyStatusSelection.value = historyStatusSelection.value.filter((selected) => selected !== value)
      return
    }

    historyStatusSelection.value = [...historyStatusSelection.value, value]
  }

  // ── Helpers ──
  const getCalculatedDate = (weekStartStr: string, dayName: string): string => {
    if (!weekStartStr) return ''
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    const idx  = days.indexOf(dayName)
    if (idx === -1) return ''
    const d = new Date(`${weekStartStr}T00:00:00Z`)
    d.setDate(d.getDate() + idx)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  
  }
  const getLastMonday = (dateStr: string) => {
    const d = new Date(`${dateStr}T00:00:00Z`)
    const daysSinceMonday = (d.getDay()) % 7
    d.setDate(d.getDate() - daysSinceMonday)
    return d.toISOString().slice(0, 10)
  }
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return ''
    return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const defaultQuestions = (): any[] => [
    { id: Date.now(),     type: 'video',   text: '', textEs: '', reference: '', referenceEs: '', url: '' },
    { id: Date.now() + 1, type: 'text',    text: '', textEs: '', reference: '', referenceEs: '', url: '' },
    { id: Date.now() + 2, type: 'mcq',     text: '', textEs: '', reference: '', referenceEs: '', url: '',
      choices: [
        { text: '', correct: true  },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false },
      ],
    },
  ]

  // ── Published forms ──
  const publishedForms = useState<any[]>('publishedForms', () => [])

  const filteredPublishedForms = computed(() =>
    publishedForms.value.filter((form) => {
      const statusKey: 'published' | 'unpublished' = form.status === 'Active' ? 'published' : 'unpublished'
      const matchesStatus = historyStatusSelection.value.includes(statusKey)

      const inRange = (value: string, start: string, end: string) =>
        !value || (!start || value >= start) && (!end || value <= end)

      const matchesDate = inRange(form.weekStart, historyGroupStartDate.value, historyGroupEndDate.value)

      return matchesStatus && matchesDate
    })
  )

  const loadPublishedForms = async () => {
    try {
      const forms = await callFormApi<any[]>('GET', {
        action: 'listForms',
        weeklyDate: historyWeekStart.value || undefined,
      })
      publishedForms.value = (forms ?? []).map(mapApiFormToUi)
    } catch (error) {
      console.error('Failed to load forms', error)
    }
  }

  const syncGroupRangeFromWeeklyDate = async () => {
    if (!historyWeekStart.value) {
      historyGroupStartDate.value = ''
      historyGroupEndDate.value = ''
      return
    }

    const fallbackWeekStart = getLastMonday(historyWeekStart.value)
    const fallbackEnd = new Date(`${fallbackWeekStart}T00:00:00Z`)
    fallbackEnd.setUTCDate(fallbackEnd.getUTCDate() + 6)
    const fallbackWeekEnd = fallbackEnd.toISOString().slice(0, 10)

    try {
      const result = await callFormApi<{
        found: boolean
        startDate: string | null
        endDate: string | null
      }>('GET', {
        action: 'resolveFormGroupRangeByDate',
        weeklyDate: historyWeekStart.value,
      })

      if (!result?.found) {
        historyGroupStartDate.value = fallbackWeekStart
        historyGroupEndDate.value = fallbackWeekEnd
        return
      }

      historyGroupStartDate.value = parseDateToYmd(result.startDate || '')
      historyGroupEndDate.value = parseDateToYmd(result.endDate || '') || fallbackWeekEnd
    } catch (error) {
      console.error('Failed to resolve form group range', error)
      historyGroupStartDate.value = fallbackWeekStart
      historyGroupEndDate.value = fallbackWeekEnd
    }
  }

  watch(
    historyWeekStart,
    async () => {
      await syncGroupRangeFromWeeklyDate()
      await loadPublishedForms()
    },
    { immediate: true }
  )

  // ── Drag-and-drop for question reorder ──
  const draggedIdx = useState<number | null>('draggedIdx', () => null)

  const dragStart = (e: DragEvent, index: number) => {
    draggedIdx.value = index
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = (_e: DragEvent, index: number) => {
    if (draggedIdx.value === null) return
    const dragged = questions.value[draggedIdx.value]
    questions.value.splice(draggedIdx.value, 1)
    questions.value.splice(index, 0, dragged)
    draggedIdx.value = null
  }

  // ── CRUD ──
  const addQuestion = (type: string) => {
    const q: any = { id: Date.now(), type, text: '', textEs: '', reference: '', referenceEs: '', url: '' }
    if (type === 'mcq') {
      q.choices = [
        { text: '', correct: true  },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false },
      ]
    }
    questions.value.push(q)
  }

  const saveForm = async (shouldPublish: boolean) => {
    if (!formTitle.value)       { alert('Please enter a title!');           return }
    if (!formDays.value.length) { alert('Please select at least one day!'); return }

    try {
      const weekStart = getLastMonday(formWeekStart.value || '')
      const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

      if (editingFormId.value) {
        const targetDay = formDays.value[0] || 'Monday'
        const dayIndex = days.indexOf(targetDay)

        if (dayIndex === -1) {
          throw new Error('Invalid day selected for update')
        }

        const startDate = new Date(`${weekStart}T00:00:00Z`)
        startDate.setUTCDate(startDate.getUTCDate() + dayIndex)

        await updateExistingForm(editingFormId.value, startDate, shouldPublish, formTitle.value, questions.value)

        await loadPublishedForms()
        editingFormId.value = null
        builderSubTab.value = 'history'

        if (shouldPublish) {
          formPublishDialog.value = {
            visible: true,
            title: 'Form Published',
            message: 'Your form has been published and is now visible to readers.',
            days: [targetDay],
          }
        } else {
          alert('Draft saved to form history.')
        }

        return
      }

      const plannedForms = formDays.value
        .map((day) => {
          const dayIndex = days.indexOf(day)

          if (dayIndex === -1) {
            return null
          }

          const startDate = new Date(`${weekStart}T00:00:00Z`)
          startDate.setUTCDate(startDate.getUTCDate() + dayIndex)

          return { day, startDate }
        })
        .filter((candidate): candidate is { day: string; startDate: Date } => Boolean(candidate))

      for (let index = 0; index < plannedForms.length; index++) {
        const plannedForm = plannedForms[index]
        const { exactMatch, similarMatch } = await findMatchingExistingForm(plannedForm)

        if (exactMatch) {
          formSaveDialog.value = {
            visible: true,
            mode: 'exact',
            title: 'Form Already Exists',
            message: 'A form with the same date and questions already exists. No new form was created.',
            existingForm: exactMatch,
          }
          return
        }

        if (similarMatch) {
          pendingFormSave.value = {
            shouldPublish,
            plannedForms,
            conflictIndex: index,
            existingForm: similarMatch,
          }

          formSaveDialog.value = {
            visible: true,
            mode: 'similar',
            title: 'Similar Form Found',
            message: 'There is a similar form already saved. Would you like to update it or make a new form?',
            existingForm: similarMatch,
          }

          return
        }
      }

      for (const day of formDays.value) {
        const dayIndex = days.indexOf(day)

        if (dayIndex === -1) {
          continue
        }

        const startDate = new Date(`${weekStart}T00:00:00Z`)
        startDate.setUTCDate(startDate.getUTCDate() + dayIndex)

        await createNewForm(startDate, shouldPublish, formTitle.value, questions.value)
      }

      await loadPublishedForms()
      builderSubTab.value = 'history'

      if (shouldPublish) {
        formPublishDialog.value = {
          visible: true,
          title: 'Forms Published',
          message: 'Your forms are now live and available for readers.',
          days: [...formDays.value],
        }
      } else {
        alert('Draft forms saved to history.')
      }
    } catch (error) {
      console.error('Failed to save form', error)
      alert('Failed to save form. Please try again.')
    }
  }

  const resolveFormSaveDialog = async (decision: 'update' | 'new') => {
    const pending = pendingFormSave.value

    if (!pending) {
      closeFormSaveDialog()
      return
    }

    try {
      const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
      const title = formTitle.value

      for (let index = 0; index < pending.plannedForms.length; index++) {
        const plannedForm = pending.plannedForms[index]

        if (index === pending.conflictIndex && decision === 'update' && pending.existingForm) {
          await updateExistingForm(
            Number(pending.existingForm.id),
            plannedForm.startDate,
            pending.shouldPublish,
            title,
            questions.value,
          )
          continue
        }

        await createNewForm(plannedForm.startDate, pending.shouldPublish, title, questions.value)
      }

      await loadPublishedForms()
      builderSubTab.value = 'history'

      if (pending.shouldPublish) {
        formPublishDialog.value = {
          visible: true,
          title: 'Forms Published',
          message: decision === 'update'
            ? 'The similar form was updated and published successfully.'
            : 'Your forms are now live and available for readers.',
          days: pending.plannedForms.map((plannedForm) => days[plannedForm.startDate.getDay() === 0 ? 6 : plannedForm.startDate.getDay() - 1]).filter(Boolean),
        }
      } else {
        alert(decision === 'update' ? 'Draft updated in history.' : 'Draft forms saved to history.')
      }
    } catch (error) {
      console.error('Failed to resolve duplicate form save', error)
      alert('Failed to save form. Please try again.')
    } finally {
      closeFormSaveDialog()
    }
  }

  const publishForm = async () => {
    await saveForm(true)
  }

  const saveDraftForm = async () => {
    await saveForm(false)
  }

  const editPublishedForm = (form: any) => {
    formTitle.value     = form.title
    formWeekStart.value = form.weekStart || formWeekStart.value
    formDays.value      = [form.day || 'Monday']
    questions.value     = JSON.parse(JSON.stringify(form.questions))
    editingFormId.value = form.id
    builderSubTab.value = 'creation'
    navigateTo('/admin/builder')
  }

  const toggleFormPublish = (form: any) => {
    form.status = form.status === 'Active' ? 'Unpublished' : 'Active'
  }

  const viewFormDetails = (form: any) => {
    selectedFormDetails.value = form
  }

  // ── Students / Progress ──
  const students = useState<any[]>('adminStudents', () => [
    { id: 1, name: 'Aiden Smith', initials: 'AS', email: 'aiden@school.edu', tickets: 12, streak: 4, lastActive: '2 hours ago' },
    { id: 2, name: 'Nevin Kumar', initials: 'NK', email: 'nevin@school.edu', tickets: 14, streak: 5, lastActive: 'Just now'     },
    { id: 3, name: 'Swarna Jay',  initials: 'SJ', email: 'swarna@school.edu',tickets: 8,  streak: 2, lastActive: 'Yesterday'   },
  ])

  const searchStudent = useState('searchStudent', () => '')
  const sortStudent   = useState('sortStudent',   () => 'tickets')

  const filteredAndSortedStudents = computed(() => {
    let res = students.value
    if (searchStudent.value) {
      const q = searchStudent.value.toLowerCase()
      res = res.filter(s => s.name.toLowerCase().includes(q))
    }
    return [...res].sort((a, b) => {
      if (sortStudent.value === 'tickets') return b.tickets - a.tickets
      if (sortStudent.value === 'streak')  return b.streak  - a.streak
      if (sortStudent.value === 'name')    return a.name.localeCompare(b.name)
      return 0
    })
  })

  // ── Raffle ──
  const raffleWinner      = useState<any | null>('raffleWinner',      () => null)
  const isSpinning        = useState<boolean>('isSpinning',           () => false)
  const raffleWeek        = useState('raffleWeek',        () => 'Feb 9 – Feb 15, 2026')
  const raffleSubmissions = useState('raffleSubmissions', () => 42)

  const spinRaffle = () => {
    isSpinning.value   = true
    raffleWinner.value = null
    setTimeout(() => {
      isSpinning.value   = false
      raffleWinner.value = students.value[Math.floor(Math.random() * students.value.length)]
    }, 2000)
  }

  // ── Announcements ──
  const announcementSubTab = useState<'creation' | 'history'>('announcementSubTab', () => 'creation')

  const announcements = useState<any[]>('announcements', () => [
    { id: 1, title: 'Summer Reading Challenge!', content: 'Log 20 books this month to win a Super Sage badge!', icon: '🌟', startDate: '2026-03-01', endDate: '2026-03-31', weekStart: '2026-03-02', day: 'Monday'    },
    { id: 2, title: 'New Badges Available',       content: 'Check the shop for new limited edition themes.',     icon: '🎉', startDate: '2026-03-05', endDate: '',           weekStart: '2026-03-02', day: 'Thursday'  },
    { id: 3, title: 'Friday Game Night',          content: 'Join us in the library for board games and snacks!', icon: '🎲', startDate: '2026-03-06', endDate: '',           weekStart: '2026-03-02', day: 'Friday'    },
    { id: 4, title: 'Week 10 Progress',           content: 'You are doing amazing! Keep up the streak.',         icon: '📈', startDate: '2026-03-09', endDate: '',           weekStart: '2026-03-09', day: 'Monday'    },
    { id: 5, title: 'Author Visit',               content: 'Virtual session this Wednesday at 10 AM.',           icon: '✍️', startDate: '2026-03-11', endDate: '',           weekStart: '2026-03-09', day: 'Wednesday' },
  ])

  const newAnnouncement = useState<any>('newAnnouncement', () => ({
    title: '', content: '', icon: '🌟',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '', weekStart: monStr, day: 'Monday',
  }))

  const announcementFilterWeek = useState('announcementFilterWeek', () => monStr)

  const filteredAnnouncements = computed(() =>
    announcements.value.filter(a =>
      !announcementFilterWeek.value || a.weekStart === announcementFilterWeek.value
    )
  )

  const isAnnouncementActive = (ann: any): boolean => {
    const now = new Date().toISOString().split('T')[0]
    if(!now) return false // in case of invalid date
    if (ann.startDate > now) return false
    if (ann.endDate && ann.endDate < now) return false
    return true
  }

  const addAnnouncement = () => {
    const na = newAnnouncement.value
    if (!na.title || !na.content) { alert('Please fill in title and message!'); return }
    announcements.value.push({ id: Date.now(), ...JSON.parse(JSON.stringify(na)) })
    newAnnouncement.value = {
      title: '', content: '', icon: '🌟',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '', weekStart: monStr, day: 'Monday',
    }
  }

  const deleteAnnouncement = (id: number) => {
    announcements.value = announcements.value.filter((a: any) => a.id !== id)
  }

  return {
    // builder
    builderSubTab, formTitle, editingFormId, questions,
    formWeekStart, formDays, historyWeekStart, historyStatusSelection, historyGroupStartDate, historyGroupEndDate, toggleHistoryStatus, getLastMonday,
    getCalculatedDate, formatDate, defaultQuestions,
    publishedForms, filteredPublishedForms,
    selectedFormDetails, viewFormDetails,
    formPublishDialog, closeFormPublishDialog,
    formSaveDialog, closeFormSaveDialog, resolveFormSaveDialog,
    draggedIdx, dragStart, onDrop,
    addQuestion, publishForm, saveDraftForm, editPublishedForm, toggleFormPublish,
    loadPublishedForms,
    // progress
    students, searchStudent, sortStudent, filteredAndSortedStudents,
    // raffle
    raffleWinner, isSpinning, raffleWeek, raffleSubmissions, spinRaffle,
    // announcements
    announcementSubTab, announcements, newAnnouncement,
    announcementFilterWeek, filteredAnnouncements,
    isAnnouncementActive, addAnnouncement, deleteAnnouncement,
  }
}
