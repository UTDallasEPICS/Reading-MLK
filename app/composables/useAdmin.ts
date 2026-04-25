// composables/useAdmin.ts
// Place this at: app/composables/useAdmin.ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
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

  const parseLocalDate = (value: string) => {
    if (!value) return null

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!match) return null

    const [, year, month, day] = match
    const parsed = new Date(Number(year), Number(month) - 1, Number(day))

    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const formatYmdLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const parseDateToYmd = (value: string) => {
    const parsed = parseLocalDate(value)

    if (parsed) {
      return formatYmdLocal(parsed)
    }

    const fallback = new Date(value)
    if (Number.isNaN(fallback.getTime())) {
      return ''
    }

    return formatYmdLocal(fallback)
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
  const todayDate = new Date()
  const dayOff = (todayDate.getDay() + 6) % 7
  const mon = new Date(todayDate)
  mon.setDate(todayDate.getDate() - dayOff)
  const monStr = formatYmdLocal(mon)

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

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const idx = days.indexOf(dayName)
    if (idx === -1) return ''

    const base = parseLocalDate(weekStartStr)
    if (!base) return ''

    const d = new Date(base)
    d.setDate(base.getDate() + idx)

    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }
  const getLastMonday = (date: string | Date) => {
    const d = new Date(typeof date === 'string' ? `${date}T00:00:00Z` : date)
    const daysSinceMonday = (d.getDay()) % 7
    d.setDate(d.getDate() - daysSinceMonday)
    return d.toISOString().slice(0, 10)
  }

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return ''

    const parsed = parseLocalDate(dateStr)
    if (!parsed) return ''

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
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
    const fallbackWeekEnd = dayjs.utc(fallbackWeekStart).add(6, 'day').format('YYYY-MM-DD')

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

        const startDate = parseLocalDate(weekStart)
        if (!startDate) throw new Error('Invalid week start date')
        startDate.setDate(startDate.getDate() + dayIndex)

        await callFormApi('PUT', {}, {
          action: 'updateForm',
          id: editingFormId.value,
          startDate: formatYmdLocal(startDate),
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

        const startDate = parseLocalDate(weekStart)
        if (!startDate) {
          continue
        }

        startDate.setDate(startDate.getDate() + dayIndex)

          const createdFormResponse = await callFormApi<any>('POST', {}, {
            action: 'createForm',
            startDate: formatYmdLocal(startDate),
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
    // announcements
    announcementSubTab, announcements, newAnnouncement,
    announcementFilterWeek, filteredAnnouncements,
    isAnnouncementActive, addAnnouncement, deleteAnnouncement,
  }
}
