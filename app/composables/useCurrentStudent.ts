import type { Student } from '~~/prisma/generated/client'

export type StudentSettings = {
  dyslexiaFont: boolean
  language: string
  fontSize: number
}

export const useCurrentStudent = () => {
  const student = useState<Student | null>('currentStudent', () => null)

  const settings = computed<StudentSettings>(() => {
    const raw = (student.value?.settings as Partial<StudentSettings>) || {}

    return {
      dyslexiaFont: Boolean(raw.dyslexiaFont),
      language: raw.language || 'en',
      fontSize: Number(raw.fontSize) || 1,
    }
  })
  
  const setStudent = (newStudent: Student | null) => {
    student.value = newStudent

    if (process.client) {
      if (newStudent?.id) {
        localStorage.setItem('currentStudentId', String(newStudent.id))
      } else {
        localStorage.removeItem('currentStudentId')
      }
    }
  }

  const loadStudent = async (id: number) => {
    try {
      student.value = await $fetch<Student>(`/api/student/${id}`)

      if (process.client) {
        localStorage.setItem('currentStudentId', String(id))
      }
    } catch (e) {
      console.error('Failed to load student', e)
    }
  }

  const restoreStudent = async () => {
    if (!process.client) return

    const savedId = localStorage.getItem('currentStudentId')
    if (!savedId) return

    const parsedId = Number(savedId)
    if (Number.isNaN(parsedId)) return

    if (student.value?.id === parsedId) return

    await loadStudent(parsedId)
  }

  const clearStudent = () => {
    student.value = null

    if (process.client) {
      localStorage.removeItem('currentStudentId')
    }
  }

  const saveSettings = async (newSettings: Partial<StudentSettings>) => {
    if (!student.value?.id) return

    const updatedSettings = { ...settings.value, ...newSettings }

    try {
      const updatedStudent = await $fetch<Student>(`/api/student/${student.value.id}`, {
        method: 'PUT',
        body: {
          settings: updatedSettings
        }
      })

      // Update the global state with the response, automatically passing it to pages like Home.vue
      student.value = updatedStudent
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  // Update student XP and persist to DB
  const updateExp = async (amount: number) => {
    if (!student.value?.id) return

    const newExp = (student.value.exp || 0) + amount

    try {
      const updatedStudent = await $fetch<Student>(`/api/student/${student.value.id}`, {
        method: 'PUT',
        body: {
          exp: newExp
        }
      })
      student.value = updatedStudent
    } catch (error) {
      console.error('Failed to update student XP:', error)
    }
  }

  return {
    student,
    settings,
    saveSettings,
    updateExp,
    setStudent,
    loadStudent,
    restoreStudent,
    clearStudent
  }
}