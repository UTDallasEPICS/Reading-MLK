import type { PetType } from '~~/shared/pet'

export type ProgressPetState = {
  type: PetType
  completedForms: number
  stage: number
  stageName: string
  nextStageAt: number | null
  hunger: number
  thirst: number
  xp: number
}

export const useProgressPet = () => {
  const { student } = useCurrentStudent()
  const pet = useState<ProgressPetState | null>('progressPet', () => null)
  const loading = useState('progressPetLoading', () => false)

  const loadPet = async () => {
    const studentId = student.value?.id
    if (!studentId) {
      pet.value = null
      return null
    }
    loading.value = true
    try {
      const loadedPet = await $fetch<ProgressPetState>(`/api/student/${studentId}/pet`)
      if (student.value?.id !== studentId) return pet.value
      pet.value = loadedPet
      student.value = { ...student.value, exp: loadedPet.xp }
      return loadedPet
    } finally {
      loading.value = false
    }
  }

  const careForPet = async (action: 'feed' | 'water') => {
    if (!student.value?.id) return null
    pet.value = await $fetch<ProgressPetState>(`/api/student/${student.value.id}/pet`, {
      method: 'POST',
      body: { action },
    })
    if (student.value) student.value = { ...student.value, exp: pet.value.xp }
    return pet.value
  }

  return { pet, loading, loadPet, careForPet }
}
