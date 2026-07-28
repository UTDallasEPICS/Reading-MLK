import { useCurrentStudent } from './useCurrentStudent'

export type ClassForm = {
  id: number
  order: number
  startDate: string
  endDate: string | null
  published: boolean
  formGroup: number
  title: string
  completed: boolean
}

export type ClassFormGroup = {
  id: number
  startDate: string
  endDate: string | null
  forms: ClassForm[]
}

export type StudentClass = {
  id: string
  joinToken: string
  name: string
  isFriendsOfMLK: boolean
  activeFormGroups: ClassFormGroup[]
  ticketCount: number
}

const MLK_CLASS_NAME = 'Friends of MLK'

export const useStudentClasses = () => {
  const { student } = useCurrentStudent()

  const classes = useState<StudentClass[]>('studentClasses', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch all classes for the active student, sorted alphabetically
   * with Friends of MLK always pinned to the bottom.
   */
  const loadClasses = async () => {
    if (!student.value?.id) {
      classes.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const raw = await $fetch<StudentClass[]>('/api/reader/classes', {
        query: { studentId: student.value.id },
      })

      classes.value = [...raw].sort((a, b) => {
        if (a.isFriendsOfMLK) return 1
        if (b.isFriendsOfMLK) return -1
        return a.name.localeCompare(b.name)
      })
    } catch (e: any) {
      console.error('Failed to load student classes:', e)
      error.value = e?.statusMessage ?? 'Failed to load classes'
      classes.value = []
    } finally {
      loading.value = false
    }
  }

  /** Grand total of raffle tickets across all classes */
  const totalTickets = computed(() =>
    classes.value.reduce((sum, cls) => sum + cls.ticketCount, 0)
  )

  /** Total active forms across all classes */
  const totalActiveForms = computed(() =>
    classes.value.reduce(
      (sum, cls) =>
        sum + cls.activeFormGroups.reduce((s2, fg) => s2 + fg.forms.length, 0),
      0
    )
  )

  /**
   * Mark a form as completed locally so the UI updates instantly without
   * waiting for a full reload.
   */
  const markFormCompleted = (formId: number) => {
    for (const cls of classes.value) {
      for (const fg of cls.activeFormGroups) {
        const form = fg.forms.find((f) => f.id === formId)
        if (form && !form.completed) {
          form.completed = true
          cls.ticketCount++
          return
        }
      }
    }
  }

  return {
    classes,
    loading,
    error,
    loadClasses,
    totalTickets,
    totalActiveForms,
    markFormCompleted,
  }
}
