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
      const isActive = form.status === 'Active'
      const matchesPublished = historyStatusSelection.value.includes('published') && isActive
      const matchesUnpublished = historyStatusSelection.value.includes('unpublished') && !isActive
      const matchesStatus = matchesPublished || matchesUnpublished

      const matchesGroupStart =
        !historyGroupStartDate.value ||
        !form.weekStart ||
        form.weekStart >= historyGroupStartDate.value

      const matchesGroupEnd =
        !historyGroupEndDate.value ||
        !form.weekStart ||
        form.weekStart <= historyGroupEndDate.value

      return matchesStatus && matchesGroupStart && matchesGroupEnd
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

  const publishForm = async () => {
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

        await callFormApi('PUT', {}, {
          action: 'updateForm',
          id: editingFormId.value,
          startDate: startDate.toISOString(),
          published: true,
          title: formTitle.value,
        })

        const existingForm = publishedForms.value.find((form) => Number(form.id) === Number(editingFormId.value))
        const existingComponentIds = new Set<number>(
          (existingForm?.questions ?? [])
            .map((question: any) => Number(question.id))
            .filter((questionId: number) => Number.isInteger(questionId) && questionId > 0)
        )

        for (let index = 0; index < questions.value.length; index++) {
          const question = questions.value[index]
          const numericQuestionId = Number(question.id)
          const isExistingComponent = Number.isInteger(numericQuestionId) && existingComponentIds.has(numericQuestionId)

          if (isExistingComponent) {
            await callFormApi('PUT', {}, {
              action: 'updateComponent',
              id: numericQuestionId,
              order: index,
              questionType: question.type,
              questionText: toApiQuestionText(question, formTitle.value),
              questionOptions: buildQuestionOptions(question),
            })

            existingComponentIds.delete(numericQuestionId)
          } else {
            await callFormApi('POST', {}, {
              action: 'createComponent',
              form: editingFormId.value,
              order: index,
              questionType: question.type,
              questionText: toApiQuestionText(question, formTitle.value),
              questionOptions: buildQuestionOptions(question),
            })
          }
        }

        for (const removedId of existingComponentIds) {
          await callFormApi('DELETE', {}, {
            action: 'deleteComponent',
            id: removedId,
          })
        }

        await loadPublishedForms()
        editingFormId.value = null
        builderSubTab.value = 'history'
        alert('Form updated successfully')
        return
      }

      for (const day of formDays.value) {
        const dayIndex = days.indexOf(day)

        if (dayIndex === -1) {
          continue
        }

        const startDate = new Date(`${weekStart}T00:00:00Z`)
        startDate.setUTCDate(startDate.getUTCDate() + dayIndex)

        const createdFormResponse = await callFormApi<any>('POST', {}, {
          action: 'createForm',
          startDate: startDate.toISOString(),
          published: true,
          title: formTitle.value,
        })

        const createdForm = createdFormResponse?.data

        if (!createdForm?.id) {
          continue
        }

        for (let index = 0; index < questions.value.length; index++) {
          const question = questions.value[index]

          await callFormApi('POST', {}, {
            action: 'createComponent',
            form: createdForm.id,
            order: index,
            questionType: question.type,
            questionText: toApiQuestionText(question, formTitle.value),
            questionOptions: buildQuestionOptions(question),
          })
        }
      }

      await loadPublishedForms()
      alert(`Published for: ${formDays.value.join(', ')}`)
    } catch (error) {
      console.error('Failed to publish form', error)
      alert('Failed to publish form. Please try again.')
    }
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
  const students = useState<any[]>('adminStudents', () => [])


  const searchStudent = useState('searchStudent', () => '')
  const sortStudent   = useState('sortStudent',   () => 'total submissions')

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
  const raffleWinner            = useState<any | null>('raffleWinner', () => null)
  const isSpinning              = useState<boolean>('isSpinning', () => false)
  const raffleFormGroups        = useState<any[]>('raffleFormGroups', () => [])
  const raffleSelectedGroupId   = useState<number | null>('raffleSelectedGroupId', () => null)
  const raffleSubmissionsList   = useState<any[]>('raffleSubmissionsList', () => [])
  const raffleSubmissions       = useState<number>('raffleSubmissions', () => 0)
  const raffleCalendarOpen      = useState<boolean>('raffleCalendarOpen', () => false)
  const raffleLoading           = useState<boolean>('raffleLoading', () => false)
  const rafflePreviousWinner    = useState<any | null>('rafflePreviousWinner', () => null)

  const raffleSelectedGroup = computed(() =>
    raffleFormGroups.value.find((g: any) => g.id === raffleSelectedGroupId.value) ?? null
  )

  const raffleWeekLabel = computed(() => {
    const group = raffleSelectedGroup.value
    if (!group) return 'No week selected'
    const start = new Date(group.startDate)
    const end = group.endDate ? new Date(group.endDate) : null
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return end ? `${fmt(start)} – ${fmt(end)}` : `Week of ${fmt(start)}`
  })

  const loadRaffleFormGroups = async () => {
    try {
      const groups = await callFormApi<any[]>('GET', { action: 'listFormGroups' })
      raffleFormGroups.value = (groups ?? []).map((g: any) => ({
        id: g.id,
        startDate: g.startDate,
        endDate: g.endDate,
        raffleWinner: g.raffleWinner,
        raffleWinnerStudent: g.raffleWinnerStudent,
      }))

      // Auto-select the most recent form group
      if (raffleFormGroups.value.length > 0 && raffleSelectedGroupId.value === null) {
        raffleSelectedGroupId.value = raffleFormGroups.value[0].id
      }
    } catch (error) {
      console.error('Failed to load raffle form groups', error)
    }
  }

  const loadRaffleSubmissions = async () => {
    if (!raffleSelectedGroupId.value) {
      raffleSubmissionsList.value = []
      raffleSubmissions.value = 0
      return
    }

    raffleLoading.value = true
    try {
      const result = await callFormApi<{ submissions: any[]; totalEntries: number }>('GET', {
        action: 'getFormGroupSubmissions',
        formGroupId: raffleSelectedGroupId.value,
      })
      raffleSubmissionsList.value = result?.submissions ?? []
      raffleSubmissions.value = result?.totalEntries ?? 0

      // Check if this group already has a winner
      const group = raffleSelectedGroup.value
      if (group?.raffleWinnerStudent) {
        rafflePreviousWinner.value = group.raffleWinnerStudent
      } else {
        rafflePreviousWinner.value = null
      }
    } catch (error) {
      console.error('Failed to load raffle submissions', error)
      raffleSubmissionsList.value = []
      raffleSubmissions.value = 0
    } finally {
      raffleLoading.value = false
    }
  }

  const selectRaffleGroupByDate = (dateStr: string) => {
    if (!dateStr) return
    const target = new Date(`${dateStr}T00:00:00Z`)

    const match = raffleFormGroups.value.find((g: any) => {
      const start = new Date(g.startDate)
      const end = g.endDate ? new Date(g.endDate) : new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
      return target >= start && target <= end
    })

    if (match) {
      raffleSelectedGroupId.value = match.id
      raffleWinner.value = null
    }
    raffleCalendarOpen.value = false
  }

  watch(raffleSelectedGroupId, async () => {
    raffleWinner.value = null
    await loadRaffleSubmissions()
  })

  const spinRaffle = () => {
    if (raffleSubmissionsList.value.length === 0) {
      alert('No submissions found for this week!')
      return
    }

    isSpinning.value   = true
    raffleWinner.value = null

    setTimeout(async () => {
      const randomIdx = Math.floor(Math.random() * raffleSubmissionsList.value.length)
      const winning = raffleSubmissionsList.value[randomIdx]
      raffleWinner.value = {
        name: winning.studentName,
        studentId: winning.studentId,
        formTitle: winning.formTitle,
        submissionDate: winning.submissionDate,
      }
      isSpinning.value = false

      // Persist the winner to the form group
      try {
        await callFormApi('PUT', {}, {
          action: 'updateFormGroup',
          id: raffleSelectedGroupId.value,
          raffleWinner: winning.studentId,
        })
      } catch (error) {
        console.error('Failed to save raffle winner', error)
      }
    }, 2400)
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
    draggedIdx, dragStart, onDrop,
    addQuestion, publishForm, editPublishedForm, toggleFormPublish,
    loadPublishedForms,
    // progress
    students, searchStudent, sortStudent, filteredAndSortedStudents,
    // raffle
    raffleWinner, isSpinning, raffleSubmissions, spinRaffle,
    raffleFormGroups, raffleSelectedGroupId, raffleSelectedGroup, raffleWeekLabel,
    raffleSubmissionsList, raffleCalendarOpen, raffleLoading, rafflePreviousWinner,
    loadRaffleFormGroups, loadRaffleSubmissions, selectRaffleGroupByDate,
    // announcements
    announcementSubTab, announcements, newAnnouncement,
    announcementFilterWeek, filteredAnnouncements,
    isAnnouncementActive, addAnnouncement, deleteAnnouncement,
  }
}
