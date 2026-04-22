import type { Student, FormGroup, Form, FormSubmission } from  '~~/prisma/generated/client'
export const useRaffleSpin = async () => {

  const raffleWeekStart = ref(new Date())
  
  const raffleFormGroup = ref<FormGroup | null>(null)
  const raffleForms = ref<Form[]>([])
  const raffleSubmissions = ref<FormSubmission[]>([])
  const raffleWinner  = ref<Student | null>(null)

  const loadRaffleFormGroup = async () => {
    raffleFormGroup.value = await useFetch<FormGroup>(() => `/api/raffle/formGroup`, {method: 'GET'})
  }

  const loadRaffleForms = async () => {
    if (!raffleFormGroup.value) return
    raffleForms.value = await useFetch<Form[]>(() => `/api/raffle/forms/${raffleFormGroup.value.id}`, {method: 'GET'})
  }

  const loadRaffleSubmissions = async () => {
    if (!raffleFormGroup.value) return
    raffleSubmissions.value = await useFetch<FormSubmission[]>(() => `/api/raffle/submissions/${raffleFormGroup.value.id}`, {method: 'GET'})
  }

  const loadRaffleWinner = async () => {
    raffleWinner.value = await useFetch<Student>(() => `/api/student/${raffleFormGroup.value?.raffleWinner}`, {method: 'GET'})
  }

  const loadRaffleData = async () => {
    try { await loadRaffleFormGroup() } catch (error) { console.error('Error loading raffle form group:', error) }
    try { await loadRaffleForms() } catch (error) { console.error('Error loading raffle forms:', error) }
    try { await loadRaffleSubmissions() } catch (error) { console.error('Error loading raffle submissions:', error) }
    try { await loadRaffleWinner() } catch (error) { console.error('Error loading raffle winner:', error) }
  }


  const isSpinning = ref(false)

  const spinRaffle = async () => {
  }

  return {
    raffleWinner,
    isSpinning,
    raffleFormGroup,
    raffleForms,
    raffleSubmissions,
    raffleWeekStart,
    spinRaffle
  }
}