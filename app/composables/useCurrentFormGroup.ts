import type { FormGroup, Form, FormComponent } from '~~/prisma/generated/client'

export type CurrentFormGroupState = {
  classes: { id: string; name: string }[]
  selectedClassId: string | null
  activeFormGroup: FormGroup | null
  forms: Form[]
  formComponents: Record<number, FormComponent[]>
}

export const useCurrentFormGroup = () => {
  const { student } = useCurrentStudent()
  const FormGroup = useState<CurrentFormGroupState>('currentFormGroupState', () => ({
    classes: [],
    selectedClassId: null,
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

  const loadActiveFormGroup = async (classId: string | null = null) => {
    if (!student.value?.id) {
      FormGroup.value.classes = []
      FormGroup.value.selectedClassId = null
      FormGroup.value.activeFormGroup = null
      FormGroup.value.forms = []
      FormGroup.value.formComponents = {}
      return
    }

    try {
      const data = await $fetch<{
        classes: { id: string; name: string }[]
        selectedClassId: string | null
        activeFormGroup: FormGroup | null
        forms: Form[]
        formComponents: Record<number, FormComponent[]>
      }>(`/api/student/${student.value.id}/forms`, {
        query: classId ? { classId } : undefined,
      })

      FormGroup.value.classes = data.classes
      FormGroup.value.selectedClassId = data.selectedClassId
      FormGroup.value.activeFormGroup = data.activeFormGroup
      FormGroup.value.forms = data.forms
      FormGroup.value.formComponents = data.formComponents
    } catch (error) {
      console.error('Failed to load active form group:', error)
      FormGroup.value.classes = []
      FormGroup.value.selectedClassId = null
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
