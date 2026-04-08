import type { FormGroup, Form, FormComponent } from '~~/prisma/generated/client'

export type CurrentFormGroupState = {
  activeFormGroup: FormGroup | null
  forms: Form[]
  formComponents: Record<number, FormComponent[]>
}

export const useCurrentFormGroup = () => {
  const FormGroup = useState<CurrentFormGroupState>('currentFormGroupState', () => ({
    activeFormGroup: null,
    forms: [],
    formComponents: {}
  }))

  const loadFormComponents = async (formId: number) => {
    try {
      const componentsAPIResponse = await $fetch<FormComponent[]>('/api/formComponent', {
        query: { form: formId }
      })
      FormGroup.value.formComponents[formId] = Array.isArray(componentsAPIResponse) ? componentsAPIResponse : []
    } catch (error) {
      console.error(`Failed to load form components for form ${formId}:`, error)
      FormGroup.value.formComponents[formId] = []
    }
  }

  const loadActiveFormGroup = async () => {
    try {
      const formGroupAPIResponse = await $fetch<FormGroup | FormGroup[]>('/api/formGroup?active=true')

      // Handle if the API returns an array or single item
      const activeFg = Array.isArray(formGroupAPIResponse) ? formGroupAPIResponse[0] : formGroupAPIResponse

      if (activeFg) {
        FormGroup.value.activeFormGroup = activeFg

        try {
          const formsAPIResponse = await $fetch<Form[]>('/api/form', {
            query: { formGroup: activeFg.id, published: true }
          })

          FormGroup.value.forms = Array.isArray(formsAPIResponse) ? formsAPIResponse : []

          // Load form components for each form in parallel
          FormGroup.value.formComponents = {}
          await Promise.all(
            FormGroup.value.forms.map(form => loadFormComponents(form.id))
          )
        } catch (error) {
          console.error('Failed to load forms for active form group:', error)
          FormGroup.value.forms = []
          FormGroup.value.formComponents = {}
        }
      } else {
        FormGroup.value.activeFormGroup = null
        FormGroup.value.forms = []
        FormGroup.value.formComponents = {}
      }
    } catch (error) {
      console.error('Failed to load active form group:', error)
      FormGroup.value.activeFormGroup = null
      FormGroup.value.forms = []
      FormGroup.value.formComponents = {}
    }
  }

  const totalFormsInGroup = computed(() => FormGroup.value.forms.length)

  return {
    FormGroup,
    loadActiveFormGroup,
    loadFormComponents,
    totalFormsInGroup
  }
}