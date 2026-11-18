export const petTypes = ['kangaroo', 'dragon', 'cat', 'panda', 'horse'] as const

export type PetType = (typeof petTypes)[number]
export type PetAction = 'feed' | 'water'

export const petNames: Record<PetType, string> = {
  kangaroo: 'Kangaroo',
  dragon: 'Dragon',
  cat: 'Cat',
  panda: 'Panda',
  horse: 'Horse',
}

export const petStageNames = ['Baby', 'Little', 'Young', 'Grown', 'Champion'] as const
export const petStageFormThresholds = [0, 3, 8, 15, 25] as const
export const petCareCosts: Record<PetAction, number> = { feed: 50, water: 25 }

export function isPetType(value: unknown): value is PetType {
  return typeof value === 'string' && petTypes.includes(value as PetType)
}

export function petStageForForms(completedForms: number) {
  let stage = 0
  for (let index = 0; index < petStageFormThresholds.length; index++) {
    if (completedForms >= petStageFormThresholds[index]) stage = index
  }
  return stage
}

export function nextPetStageAt(stage: number) {
  return petStageFormThresholds[stage + 1] ?? null
}
