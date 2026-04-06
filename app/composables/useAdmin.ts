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
  const selectedFormDetails = useState<any | null>('selectedFormDetails', () => null)

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
    console.log ("get day:", d.getDay(), "daysSinceMonday:", daysSinceMonday)
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
    publishedForms.value.filter(f => !historyWeekStart.value || f.weekStart === historyWeekStart.value)
  )

  const loadPublishedForms = async () => {
    try {
      const forms = await callFormApi<any[]>('GET', { action: 'listForms' })
      publishedForms.value = (forms ?? []).map(mapApiFormToUi)
    } catch (error) {
      console.error('Failed to load forms', error)
    }
  }

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
    formWeekStart, formDays, historyWeekStart, getLastMonday,
    getCalculatedDate, formatDate, defaultQuestions,
    publishedForms, filteredPublishedForms,
    selectedFormDetails, viewFormDetails,
    draggedIdx, dragStart, onDrop,
    addQuestion, publishForm, editPublishedForm, toggleFormPublish,
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
