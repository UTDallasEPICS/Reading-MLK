import type { Student, FormGroup, Form, FormSubmission } from '~~/prisma/generated/client'
export const useRaffleSpin = () => {

  const raffleWeekStart = ref<Date | string>(new Date())

  const raffleFormGroup = ref<FormGroup | null>(null)
  const raffleForms = ref<Form[]>([])
  const raffleSubmissions = ref<FormSubmission[]>([])
  const raffleWinner = ref<Student | null>(null)
  const spinCount = ref(0)

  const loadRaffleFormGroup = async () => {
    const val = raffleWeekStart.value
    const dateStr = val instanceof Date ? val.toISOString().split('T')[0] : String(val).split('T')[0]
    const data = await $fetch<FormGroup>(`/api/formGroup?date=${dateStr}`, { method: 'GET' })
    raffleFormGroup.value = data || null
  }

  const loadRaffleForms = async () => {
    if (!raffleFormGroup.value) {
      raffleForms.value = []
      return
    }
    const data = await $fetch<Form[]>(`/api/form?action=listForms&formGroup=${raffleFormGroup.value.id}`, { method: 'GET' })
    raffleForms.value = data || []
  }

  const loadRaffleSubmissions = async () => {
    if (!raffleFormGroup.value) {
      raffleSubmissions.value = []
      return
    }
    const data = await $fetch<FormSubmission[]>(`/api/formSubmission?formGroup=${raffleFormGroup.value.id}`, { method: 'GET' })
    raffleSubmissions.value = data || []
  }

  const loadRaffleWinner = async () => {
    const fg = raffleFormGroup.value as any
    if (fg?.RaffleWinner) {
      raffleWinner.value = fg.RaffleWinner
    } else {
      raffleWinner.value = null
    }
  }

  const loadRaffleData = async () => {
    try { await loadRaffleFormGroup() } catch (error) { console.error('Error loading raffle form group:', error) }
    try { await loadRaffleForms() } catch (error) { console.error('Error loading raffle forms:', error) }
    try { await loadRaffleSubmissions() } catch (error) { console.error('Error loading raffle submissions:', error) }
    try { await loadRaffleWinner() } catch (error) { console.error('Error loading raffle winner:', error) }
  }

  const spinRaffle = async () => {
    if (!raffleFormGroup.value || !raffleSubmissions.value || raffleSubmissions.value.length === 0) return


    const randomIndex = Math.floor(Math.random() * raffleSubmissions.value.length)
    const winningSubmission = raffleSubmissions.value[randomIndex] as FormSubmission
    const studentId = winningSubmission.student

    try {
      await $fetch(`/api/formGroup`, {
        method: 'PUT',
        body: {
          id: raffleFormGroup.value.id,
          raffleWinner: studentId
        }
      })
      await loadRaffleData()
      spinCount.value++
    } catch (e) {
      console.error("Error setting winner", e)
    }
  }

  return {
    raffleWinner,
    raffleFormGroup,
    raffleForms,
    raffleSubmissions,
    raffleWeekStart,
    spinRaffle,
    loadRaffleData,
    spinCount
  }
}