import type { Student, Form, FormGroup, FormSubmission } from '~~/prisma/generated/client'
export type StudentSettings = {
  dyslexiaFont: boolean
  language: string
  fontSize: number
}

export const useCurrentStudent = () => {
  // useState creates global state shared across all components and pages without needing constant API fetches
  const student = useState<Student | null>('currentStudent', () => null)

  // Computes guaranteed fallback settings from the active student
  const settings = computed<StudentSettings>(() => {
    const raw = student.value?.settings as Partial<StudentSettings> || {}
    return {
      dyslexiaFont: Boolean(raw.dyslexiaFont),
      language: raw.language || 'en',
      fontSize: Number(raw.fontSize) || 1,
    }
  })
  
  // Fetch a student directly from the DB by ID
  const loadStudent = async (id: number) => {
    try {
      student.value = await $fetch<Student>(`/api/student/${id}`)
    } catch (e) {
      console.error("Failed to load student", e)
    }
  }

  // Save the new settings to the DB and instantly update the sitewide global state
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

  return {
    student,
    settings,
    loadStudent,
    saveSettings
  }
}