import type { FormSubmission, SubmissionResponse } from '~~/prisma/generated/client'
import { useCurrentStudent } from './useCurrentStudent'
import { useCurrentFormGroup } from './useCurrentFormGroup'

type CreateSubmissionResponse = {
  created?: boolean
  submission?: FormSubmission
  error?: string
  message?: string
}

export const useCurrentStudentProgress = () => {
  const { student } = useCurrentStudent()
  const { FormGroup: formGroupState, totalFormsInGroup: totalFormsInGroup } = useCurrentFormGroup()

  //State to hold the student's submissions for the active form group
  const submissions = useState<FormSubmission[]>('currentStudentSubmissions', () => [])

  //Computed state for an array of completed form IDs within the active form group
  const completedFormIds = computed(() => {
    const activeFormIds = new Set(formGroupState.value.forms.map((f) => f.id))
    const completed = new Set<number>()
    submissions.value.forEach((sub) => {
      if (activeFormIds.has(sub.form)) {
        completed.add(sub.form)
      }
    })
    return Array.from(completed)
  })

  // Computed progress metrics
  const tickets = computed(() => completedFormIds.value.length)
  const isFormGroupCompleted = computed(() => {
    return totalFormsInGroup.value > 0 && tickets.value >= totalFormsInGroup.value
  })

  // Fetch student's progress (form submissions)
  const loadProgress = async () => {
    if (!student.value?.id) {
      submissions.value = []
      return
    }

    try {
      const response = await $fetch<FormSubmission[]>('/api/formSubmission', {
        query: { student: student.value.id }
      })
      submissions.value = Array.isArray(response) ? response : []
    } catch (error) {
      console.error('Failed to load student progress:', error)
      submissions.value = []
    }
  }

  // Log a new form submission to track progress
  const logFormSubmission = async (formId: number) => {
    if (!student.value?.id) {
      console.error('Cannot log form submission: No student is currently active.')
      return null
    }

    try {
      const response = await $fetch<CreateSubmissionResponse>('/api/formSubmission', {
        method: 'POST',
        body: {
          student: student.value.id,
          form: formId
        }
      })

      const newSubmission = response?.submission

      if (!newSubmission) {
        return null
      }

      // Update local state without needing a new fetch
      const alreadyTracked = submissions.value.some((submission) => submission.id === newSubmission.id)

      if (!alreadyTracked) {
        submissions.value = [...submissions.value, newSubmission]
      }

      return {
        submission: newSubmission,
        created: Boolean(response?.created),
      }
    } catch (error) {
      const apiError = error as { statusCode?: number; data?: { error?: string } }

      if (apiError?.statusCode === 409 || apiError?.data?.error === 'DUPLICATE_SUBMISSION') {
        await loadProgress()
        return {
          submission: null,
          created: false,
        }
      }

      console.error('Failed to log form submission:', error)
      return null
    }
  }

  const logSubmissionResponse = async (submissionID: number, formComponentID: number, response: string) => {
    if (!student.value?.id) {
      console.error('Cannot log form submission: No student is currently active.')
      return null
    }
  }

  return {
    submissions,
    completedFormIds,
    tickets,
    isFormGroupCompleted,
    loadProgress,
    logFormSubmission,
    logSubmissionResponse
  }
}
