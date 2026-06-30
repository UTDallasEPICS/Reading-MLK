import type { FormGroup, Form, FormComponent } from '~~/prisma/generated/client'
import dayjs from 'dayjs'

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

  const loadActiveFormGroup = async () => {
    try {
      const formGroupAPIResponse = await $fetch<FormGroup | FormGroup[]>('/api/formGroup?active=true')

      const activeFg = Array.isArray(formGroupAPIResponse) ? formGroupAPIResponse[0] : formGroupAPIResponse

      if (activeFg) {
        FormGroup.value.activeFormGroup = activeFg

        try {
          const formsAPIResponse = await useFetch('/api/form/list', {
            method: 'GET',
            query: { published: 1, formGroup: activeFg.id }
          })
          
          FormGroup.value.formComponents = {}
          FormGroup.value.forms = []
          
          if (formsAPIResponse.data.value) {
            FormGroup.value.formComponents = {}
            FormGroup.value.forms = formsAPIResponse.data.value.map((form) => {
              const {Components, FormGroup: _removedFormGroupField, startDate, endDate, ...restOfForm} = form
           
              FormGroup.value.formComponents[form.id] = Components ?? []

              return {
                ...restOfForm,
                startDate: dayjs(startDate).toDate(),
                endDate: endDate ? dayjs(endDate).toDate() : null,
              }
            })
          }
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
    totalFormsInGroup
  }
}