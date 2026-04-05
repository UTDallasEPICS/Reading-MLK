import type { FormGroup, Form } from '~~/prisma/generated/client'

export type CurrentFormGroupState = {
  activeFormGroup: FormGroup | null
  forms: Form[]
}

export const useCurrentFormGroup = () => {
  const FormGroup = useState<CurrentFormGroupState>('currentFormGroupState', () => ({
    activeFormGroup: null,
    forms: []
  }))

  const loadActiveFormGroup = async () => {
    try {
      const formGroupAPIResponse = await $fetch<FormGroup | FormGroup[]>('/api/formgroup?active=true')

      // Handle if the API returns an array or single item
      const activeFg = Array.isArray(formGroupAPIResponse) ? formGroupAPIResponse[0] : formGroupAPIResponse

      if (activeFg) {
        FormGroup.value.activeFormGroup = activeFg

        try {
          const formsAPIResponse = await $fetch<Form[]>('/api/form', {
            query: { formGroup: activeFg.id }
          })

          FormGroup.value.forms = Array.isArray(formsAPIResponse) ? formsAPIResponse : []
        } catch (error) {
          console.error('Failed to load forms for active form group:', error)
          FormGroup.value.forms = []
        }
      } else {
        FormGroup.value.activeFormGroup = null
        FormGroup.value.forms = []
      }
    } catch (error) {
      console.error('Failed to load active form group:', error)
      FormGroup.value.activeFormGroup = null
      FormGroup.value.forms = []
    }
  }

  const totalFormsInGroup = computed(() => FormGroup.value.forms.length)

  return {
    FormGroup,
    loadActiveFormGroup,
    totalFormsInGroup
  }
}