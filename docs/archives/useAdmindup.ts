// composables/useAdmin.ts
export const useAdmin = () => {
  const formTitle = useState('formTitle', () => '')
  const editingFormId = useState<number | null>('editingFormId', () => null)
  const questions = useState<any[]>('questions', () => [])

  const publishedForms = useState('publishedForms', () => [
    {
      id: 1,
      week: 4,
      title: 'Kindness & Compassion',
      date: 'Feb 12, 2024',
      status: 'Active',
      questions: [
        { id: 101, type: 'context', text: 'Read the story of the Bell of Atri.', textEs: 'Lee la historia de la Campana de Atri.', reference: 'A story about justice and kindness to animals.', referenceEs: 'Una historia sobre la justicia y la bondad con los animales.' },
        { id: 102, type: 'video', text: 'Watch this video on empathy', textEs: 'Mira este video sobre la empatía', url: 'https://www.youtube.com/embed/1Evwgu369Jw' },
        { id: 103, type: 'text', text: 'What did the horse do in the story?', textEs: '¿Qué hizo el caballo en la historia?', reference: 'He rang the bell to ask for justice.', referenceEs: 'Tocó la campana para pedir justicia.' },
        { id: 104, type: 'math', text: 'If there are 5 bells and 3 horses, how many items in total?', textEs: 'Si hay 5 campanas y 3 caballos, ¿cuántos artículos en total?', reference: '8' }
      ]
    }
  ])

  const students = useState('students', () => [
    { id: 1, name: 'Aiden Smith', initials: 'AS', books: 12, streak: 4, lastActive: '2 hours ago' },
    { id: 2, name: 'Nevin Kumar', initials: 'NK', books: 14, streak: 5, lastActive: 'Just now' },
    { id: 3, name: 'Swarna Jay', initials: 'SJ', books: 8, streak: 2, lastActive: 'Yesterday' }
  ])

  const raffleWinner = useState<any>('raffleWinner', () => null)
  const isSpinning = useState('isSpinning', () => false)

  const addQuestion = (type: string) => {
    const q: any = {
      id: Date.now(),
      type,
      text: '',
      textEs: '',
      reference: '',
      referenceEs: '',
      url: ''
    }
    if (type === 'mcq') {
      q.choices = [
        { text: '', correct: true },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false }
      ]
    }
    questions.value.push(q)
  }

  const publishForm = () => {
    if (!formTitle.value) return alert('Please enter a title!')
    const editingId = editingFormId.value
    if (editingId) {
      const idx = publishedForms.value.findIndex((f: any) => f.id === editingId)
      if (idx !== -1) {
        publishedForms.value[idx].title = formTitle.value
        publishedForms.value[idx].questions = [...questions.value]
      }
      editingFormId.value = null
    } else {
      publishedForms.value.push({
        id: Date.now(),
        week: publishedForms.value.length + 1,
        title: formTitle.value,
        date: new Date().toLocaleDateString(),
        status: 'Active',
        questions: [...questions.value]
      })
    }
    formTitle.value = ''
    questions.value = []
    alert(editingId ? 'Form Updated! ✅' : 'Form Published! 🚀')
  }

  const editPublishedForm = (form: any) => {
    formTitle.value = form.title
    questions.value = JSON.parse(JSON.stringify(form.questions))
    editingFormId.value = form.id
    navigateTo('/admin/builder')
  }

  const toggleFormPublish = (form: any) => {
    form.status = form.status === 'Active' ? 'Unpublished' : 'Active'
  }

  const spinRaffle = () => {
    isSpinning.value = true
    raffleWinner.value = null
    setTimeout(() => {
      isSpinning.value = false
      raffleWinner.value = students.value[Math.floor(Math.random() * students.value.length)]
    }, 2000)
  }

  return {
    formTitle, editingFormId, questions, publishedForms,
    students, raffleWinner, isSpinning,
    addQuestion, publishForm, editPublishedForm, toggleFormPublish, spinRaffle
  }
}
