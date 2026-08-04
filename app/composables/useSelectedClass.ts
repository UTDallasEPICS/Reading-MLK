export const useSelectedClass = () => {
  const route = useRoute()
  const storedClassId = useCookie<string | null>('selected-class-token', {
    sameSite: 'lax',
  })

  const classId = computed(() => {
    const queryClassId = route.query.class
    const normalizedQueryClassId = Array.isArray(queryClassId) ? queryClassId[0] : queryClassId

    return normalizedQueryClassId || storedClassId.value || null
  })

  return {
    classId,
    storedClassId,
  }
}
