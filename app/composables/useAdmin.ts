// composables/useAdmin.ts
// Place this at: app/composables/useAdmin.ts

export const useAdmin = () => {
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
    const d = new Date(weekStartStr)
    d.setDate(d.getDate() + idx)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  
  }
  const getLastMonday = (dateStr: string) => {
    const d = new Date(`${dateStr}T00:00:00`)
    const daysSinceMonday = (d.getDay() + 6) % 7
    d.setDate(d.getDate() - daysSinceMonday)
    return d.toISOString().slice(0, 10)
  }
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
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
  const publishedForms = useState<any[]>('publishedForms', () => [
    {
      id: 1, weekStart: '2026-02-09', day: 'Monday', title: 'Kindness & Compassion',
      date: 'Feb 9, 2026', status: 'Active',
      questions: [
        { id: 101, type: 'context', text: 'Read the story of the Bell of Atri.',            textEs: 'Lee la historia de la Campana de Atri.',                reference: 'A story about justice and kindness to animals.', referenceEs: 'Una historia sobre la justicia y la bondad.' },
        { id: 102, type: 'video',   text: 'Watch this video on empathy',                    textEs: 'Mira este video sobre la empatía',                     url: 'https://www.youtube.com/embed/1Evwgu369Jw', reference: '', referenceEs: '' },
        { id: 103, type: 'text',    text: 'What did the horse do in the story?',            textEs: '¿Qué hizo el caballo en la historia?',                reference: 'He rang the bell to ask for justice.',           referenceEs: 'Tocó la campana para pedir justicia.' },
        { id: 104, type: 'mcq',     text: 'If there are 5 bells and 3 horses, how many?',   textEs: 'Si hay 5 campanas y 3 caballos, ¿cuántos en total?', reference: '8',                                            referenceEs: '8',
          choices: [{ text:'6',correct:false },{ text:'8',correct:true },{ text:'10',correct:false },{ text:'15',correct:false }] },
      ],
    },
    { id: 2, weekStart: '2026-02-09', day: 'Tuesday',   title: 'Honesty & Truth',       date: 'Feb 10, 2026', status: 'Active',      questions: [{ id: 201, type: 'text', text: 'Why tell the truth?', textEs: '¿Por qué decir la verdad?', reference: 'Truth builds trust.', referenceEs: 'La verdad genera confianza.', url: '' }] },
    { id: 3, weekStart: '2026-02-09', day: 'Wednesday', title: 'Courage & Bravery',     date: 'Feb 11, 2026', status: 'Active',      questions: [{ id: 301, type: 'text', text: 'Who is a brave person?', textEs: '¿Quién es valiente?', reference: 'Someone who faces fear.', referenceEs: 'Alguien que enfrenta el miedo.', url: '' }] },
    { id: 4, weekStart: '2026-02-16', day: 'Monday',    title: 'Patience & Persistence', date: 'Feb 16, 2026', status: 'Active',      questions: [{ id: 401, type: 'text', text: 'What is patience?', textEs: '¿Qué es la paciencia?', reference: 'Waiting without getting upset.', referenceEs: 'Esperar sin molestarse.', url: '' }] },
    { id: 5, weekStart: '2026-02-16', day: 'Friday',    title: 'Weekly Review',          date: 'Feb 20, 2026', status: 'Unpublished', questions: [{ id: 501, type: 'text', text: 'What did you learn?', textEs: '¿Qué aprendiste?', reference: 'Review of the week.', referenceEs: 'Resumen de la semana.', url: '' }] },
    { id: 6, weekStart: '2026-03-02', day: 'Monday',    title: 'Empathy in Action',      date: 'Mar 2, 2026',  status: 'Active',      questions: [{ id: 601, type: 'text', text: 'Help a friend.', textEs: 'Ayuda a un amigo.', reference: 'Show kindness.', referenceEs: 'Muestra bondad.', url: '' }] },
  ])

  const filteredPublishedForms = computed(() =>
    publishedForms.value.filter(f => !historyWeekStart.value || f.weekStart === historyWeekStart.value)
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

  const publishForm = () => {
    if (!formTitle.value)       { alert('Please enter a title!');           return }
    if (!formDays.value.length) { alert('Please select at least one day!'); return }

    formDays.value.forEach(day => {
      const calcDate   = getCalculatedDate(getLastMonday(formWeekStart.value || ''), day)
      const existingIdx = publishedForms.value.findIndex(
        f => f.weekStart === formWeekStart.value && f.day === day
      )
      const newForm = {
        id:        existingIdx !== -1 ? publishedForms.value[existingIdx].id : Date.now() + Math.random(),
        weekStart: formWeekStart.value,
        day,
        title:     formTitle.value,
        date:      calcDate,
        status:    'Active',
        questions: JSON.parse(JSON.stringify(questions.value)),
      }
      if (existingIdx !== -1) publishedForms.value[existingIdx] = newForm
      else                    publishedForms.value.unshift(newForm)
    })

    alert(`Published for: ${formDays.value.join(', ')}`)
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
