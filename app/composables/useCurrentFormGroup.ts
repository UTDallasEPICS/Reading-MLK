import type { FormGroup, Form } from '~~/prisma/generated/client'

export interface CurrentFormGroupState {
  activeFormGroup: FormGroup | null
  forms: Form[]
}

export const useCurrentFormGroup = () => {
  const state = useState<CurrentFormGroupState>('currentFormGroupState', () => ({
    activeFormGroup: null,
    forms: []
  }))

  const loadActiveFormGroup = async () => {
    try {
      const formGroupAPIResponse = await $fetch<FormGroup | FormGroup[]>('/api/formgroup?active=true')

      // Handle if the API returns an array or single item
      const activeFg = Array.isArray(formGroupAPIResponse) ? formGroupAPIResponse[0] : formGroupAPIResponse

      if (activeFg) {
        state.value.activeFormGroup = activeFg

        try {
          const formsAPIResponse = await $fetch<Form[]>('/api/form', {
            query: { formGroup: activeFg.id }
          })

          state.value.forms = Array.isArray(formsAPIResponse) ? formsAPIResponse : []
        } catch (error) {
          console.error('Failed to load forms for active form group:', error)
          state.value.forms = []
        }
      } else {
        state.value.activeFormGroup = null
        state.value.forms = []
      }
    } catch (error) {
      console.error('Failed to load active form group:', error)
      state.value.activeFormGroup = null
      state.value.forms = []
    }
  }

  return {
    state,
    loadActiveFormGroup
  }
}
