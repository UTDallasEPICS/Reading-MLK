import type { Student } from '~~/prisma/generated/client'
import { isPetType, type PetType } from '~~/shared/pet'

export type StudentSettings = {
  theme: string
  activeAnimations: string[]
  activeBanner: string | null
  activeStickers: string[]
  dyslexiaFont: boolean
  language: 'en' | 'es'
  pet: { type: PetType; fedAt?: string; wateredAt?: string }
}

const normalizeLanguage = (value: unknown): 'en' | 'es' => {
  const language = String(value || '')
    .trim()
    .toLowerCase()

  return ['es', 'spanish'].includes(language) ? 'es' : 'en'
}

const readerThemes = [
  'light',
  'dark',
  'blue',
  'sepia',
  'sunset',
  'ocean',
  'forest',
  'candy',
  'fire',
  'ice',
]

export const useCurrentStudent = () => {
  const student = useState<Student | null>('currentStudent', () => null)

  const settings = computed<StudentSettings>(() => {
    const raw = (student.value?.settings as Partial<StudentSettings>) || {}

    return {
      activeAnimations: Array.isArray(raw.activeAnimations) ? raw.activeAnimations : [],
      activeBanner: typeof raw.activeBanner === 'string' ? raw.activeBanner : null,
      activeStickers: Array.isArray(raw.activeStickers) ? raw.activeStickers : [],
      dyslexiaFont: Boolean(raw.dyslexiaFont),
      language: normalizeLanguage(raw.language),
      pet: {
        type: isPetType(raw.pet?.type) ? raw.pet.type : 'cat',
        ...(typeof raw.pet?.fedAt === 'string' ? { fedAt: raw.pet.fedAt } : {}),
        ...(typeof raw.pet?.wateredAt === 'string' ? { wateredAt: raw.pet.wateredAt } : {}),
      },
      theme: readerThemes.includes(String(raw.theme)) ? String(raw.theme) : 'light',
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
    } catch (e: any) {
      console.error('Failed to load student', e)

      if (e.status == 404) {
        clearStudent()
        return
      }
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
          settings: updatedSettings,
        },
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
    saveSettings,
    setStudent,
    loadStudent,
    restoreStudent,
    clearStudent,
  }
}
