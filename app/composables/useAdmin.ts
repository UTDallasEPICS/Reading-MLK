// composables/useAdmin.ts
// Place this at: app/composables/useAdmin.ts
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'

dayjs.extend(isoWeek)
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
    return dayjs(date).format('YYYY-MM-DD')
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
    const formDate = parseDateToYmd(form.startDate || form.weekStart || '')

    return {
      id: Number(form.id),
      weekStart: parseDateToYmd(form.weekStart || form.startDate || ''),
      day: form.day || 'Monday',
      title: form.title || `Form ${form.id}`,
      startDate: formDate,
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
  const historyKeywordQuery = useState('historyKeywordQuery', () => '')
  const historyAdvancedFiltersOpen = useState('historyAdvancedFiltersOpen', () => false)
  const historyStatusSelection = useState<Array<'published' | 'unpublished'>>('historyStatusSelection', () => ['published', 'unpublished'])
  const historyGroupStartDate = useState('historyGroupStartDate', () => '')
  const historyGroupEndDate = useState('historyGroupEndDate', () => '')
  const emptyFormPromptOpen = useState('emptyFormPromptOpen', () => false)
  const selectedFormDetails = useState<any | null>('selectedFormDetails', () => null)
  const publishSuccessInfo = useState<any | null>('publishSuccessInfo', () => null)

  const resetHistoryAdvancedFilters = () => {
    historyStatusSelection.value = ['published', 'unpublished']
    historyGroupStartDate.value = ''
    historyGroupEndDate.value = ''
  }
  const resetHistoryFilters = () => {
    historyKeywordQuery.value = ''
    historyWeekStart.value = ''
  }

  const toggleHistoryStatus = (value: 'published' | 'unpublished') => {
    if (historyStatusSelection.value.includes(value)) {
      historyStatusSelection.value = historyStatusSelection.value.filter((selected) => selected !== value)
      return
    }

    historyStatusSelection.value = [...historyStatusSelection.value, value]
  }

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return ''

    return dayjs.utc(dateStr).format('MMM D, YYYY')
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

      const normalizedKeyword = historyKeywordQuery.value.trim().toLowerCase()
      const searchableFields = [
        form.title,
        form.day,
        form.weekStart,
        form.date,
        form.status,
      ]

      for (const question of form.questions ?? []) {
        searchableFields.push(
          question.type,
          question.text,
          question.textEs,
          question.reference,
          question.referenceEs,
          question.url,
        )

        for (const choice of question.choices ?? []) {
          searchableFields.push(choice.text)
        }
      }

      const matchesKeyword =
        !normalizedKeyword || searchableFields.filter(Boolean).join(' ').toLowerCase().includes(normalizedKeyword)

      const matchesGroupStart =
        !historyGroupStartDate.value ||
        !form.startDate ||
        form.startDate >= historyGroupStartDate.value

      const matchesGroupEnd =
        !historyGroupEndDate.value ||
        !form.startDate ||
        form.startDate <= historyGroupEndDate.value

      return matchesStatus && matchesKeyword && matchesGroupStart && matchesGroupEnd
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

    const fallbackWeekStart = dayjs.utc(historyWeekStart.value).startOf('isoWeek').format('YYYY-MM-DD')
    const fallbackWeekEnd = dayjs.utc(fallbackWeekStart).endOf('isoWeek').format('YYYY-MM-DD')

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

  const persistForm = async (published: boolean) => {
    if (!formTitle.value)       { alert('Please enter a title!');           return false }
    if (!formDays.value.length) { alert('Please select at least one day!'); return false }

    const weekStart = dayjs.utc(formWeekStart.value || '').startOf('isoWeek').format('YYYY-MM-DD')
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

    if (editingFormId.value) {
      const targetDay = formDays.value[0] || 'Monday'
      const dayIndex = days.indexOf(targetDay)

      if (dayIndex === -1) {
        throw new Error('Invalid day selected for update')
      }

      const startDate = dayjs.utc(weekStart).add(dayIndex, 'day')

      await callFormApi('PUT', {}, {
        action: 'updateForm',
        id: editingFormId.value,
        startDate: startDate.format('YYYY-MM-DD'),
        published,
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

      if (published) {
        publishSuccessInfo.value = {
          title: formTitle.value,
          days: formDays.value,
          weekStart: dayjs.utc(weekStart).startOf('isoWeek').format('YYYY-MM-DD'),
          isUpdate: true,
          questionCount: questions.value.length,
        }
      }

      editingFormId.value = null
      builderSubTab.value = 'history'
      return true
    }

    const createdFormResponse = await callFormApi<any>('POST', {}, {
      action: 'createForm',
      startDate: weekStart || dayjs.utc().startOf('isoWeek').format('YYYY-MM-DD'),
      published,
      title: formTitle.value,
    })

    const createdForm = createdFormResponse?.data

    if (!createdForm?.id) {
      return false
    }

    const publishedDates: string[] = []

    if (published) {
      for (const day of formDays.value) {
        const dayIndex = days.indexOf(day)

        if (dayIndex === -1) {
          continue
        }

        const startDate = dayjs.utc(weekStart).add(dayIndex, 'day')
        publishedDates.push(dayjs.utc(weekStart).add(dayIndex, 'day').format('dddd, MMM D, YYYY'))

        await callFormApi('PUT', {}, {
          action: 'updateForm',
          id: createdForm.id,
          startDate: startDate.format('YYYY-MM-DD'),
          published: true,
          title: formTitle.value,
        })

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
    }

    await loadPublishedForms()

    if (published) {
      publishSuccessInfo.value = {
        title: formTitle.value,
        days: formDays.value,
        weekStart: dayjs.utc(weekStart).startOf('isoWeek').format('YYYY-MM-DD'),
        publishedDates,
        questionCount: questions.value.length,
        isUpdate: false,
      }
    }

    builderSubTab.value = 'history'
    return true
  }

  const publishForm = async () => {
    if (questions.value.length === 0) {
      emptyFormPromptOpen.value = true
      return
    }

    try {
      await persistForm(true)
    } catch (error) {
      console.error('Failed to publish form', error)
      alert('Failed to publish form. Please try again.')
    }
  }

  const saveEmptyFormDraft = async () => {
    try {
      await persistForm(false)
      emptyFormPromptOpen.value = false
    } catch (error) {
      console.error('Failed to save empty form', error)
      alert('Failed to save form. Please try again.')
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

  const deleteStoredForm = async (form: any, skipConfirm = false) => {
    const id = Number(form?.id)

    if (!Number.isInteger(id)) {
      return
    }

    if (!skipConfirm && !confirm(`Delete "${form.title}"? This cannot be undone.`)) {
      return
    }

    await callFormApi('DELETE', {}, {
      action: 'deleteForm',
      id,
    })

    if (selectedFormDetails.value?.id === id) {
      selectedFormDetails.value = null
    }

    if (editingFormId.value === id) {
      editingFormId.value = null
    }

    await loadPublishedForms()
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
    formWeekStart, formDays, historyWeekStart, historyKeywordQuery, historyAdvancedFiltersOpen,
    historyStatusSelection, historyGroupStartDate, historyGroupEndDate, emptyFormPromptOpen,
    toggleHistoryStatus, resetHistoryAdvancedFilters, resetHistoryFilters, formatDate, defaultQuestions,
    publishedForms, filteredPublishedForms,
    selectedFormDetails, viewFormDetails, publishSuccessInfo,
    draggedIdx, dragStart, onDrop,
    addQuestion, publishForm, saveEmptyFormDraft, editPublishedForm, toggleFormPublish, deleteStoredForm,
    loadPublishedForms,
    // progress
    students, searchStudent, sortStudent, filteredAndSortedStudents,
    // announcements
    announcementSubTab, announcements, newAnnouncement,
    announcementFilterWeek, filteredAnnouncements,
    isAnnouncementActive, addAnnouncement, deleteAnnouncement,
  }
}
