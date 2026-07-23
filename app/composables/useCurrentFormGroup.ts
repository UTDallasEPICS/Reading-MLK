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
      const activeFormGroups = await $fetch<FormGroup[]>('/api/formGroup?active=true')
      const activeFg = activeFormGroups[0]

      if (activeFg) {
        FormGroup.value.activeFormGroup = activeFg

        try {
          const formResponses = await Promise.all(
            activeFormGroups.map((formGroup) =>
              $fetch<Form[]>('/api/form', {
                query: { action: 'getOnlyActiveFormsinGroup', formGroup: formGroup.id }
              })
            )
          )

          FormGroup.value.forms = formResponses.flat()

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
