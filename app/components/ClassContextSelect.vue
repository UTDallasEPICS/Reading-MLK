<script setup lang="ts">
import { authClient } from '../utils/auth-client'

type ClassOption = {
  joinToken: string
  name: string
}

const route = useRoute()
const router = useRouter()
const selectedClassToken = useCookie<string | null>('selected-class-token', {
  sameSite: 'lax',
})
const { data: session } = await authClient.useSession(useFetch)

const { data: classes, status: classesStatus } = await useFetch<ClassOption[]>(
  '/api/admin/classes',
  {
    key: 'admin-classes',
    default: () => [],
  }
)

function getRouteClassToken() {
  const classQuery = route.query.class
  return Array.isArray(classQuery) ? classQuery[0] : classQuery
}

function getCurrentContext() {
  if (route.path === '/coach/create-class') {
    return 'create-class'
  }

  if (route.path.startsWith('/coach')) {
    const classToken = getRouteClassToken() || selectedClassToken.value
    return classToken ? `class:${classToken}` : 'admin'
  }

  return 'admin'
}

const selectedContext = ref(getCurrentContext())
const isRedirecting = ref(false)
const canAccessUniversalAdmin = computed(() => session.value?.user?.role === 'admin')
const canManageClasses = computed(
  () => session.value?.user?.role === 'admin' || session.value?.user?.role === 'coach'
)

watch(
  () => [route.path, route.query.class, selectedClassToken.value],
  () => {
    selectedContext.value = getCurrentContext()
  }
)

watch(
  [
    classesStatus,
    () => classes.value.length,
    () => route.path,
    () => route.query.class,
    () => selectedClassToken.value,
    canAccessUniversalAdmin,
    canManageClasses,
  ],
  async () => {
    if (!canManageClasses.value || isRedirecting.value) {
      return
    }

    isRedirecting.value = true

    try {
      if (classesStatus.value !== 'success') {
        return
      }

      if (
        !canAccessUniversalAdmin.value &&
        classes.value.length === 0 &&
        route.path !== '/coach/create-class'
      ) {
        selectedClassToken.value = null
        await router.replace('/coach/create-class')
        return
      }

      if (route.path.startsWith('/coach')) {
        const classToken = getRouteClassToken() || selectedClassToken.value
        const classExists = classes.value.some((classroom) => classroom.joinToken === classToken)

        if (!classToken || !classExists) {
          selectedClassToken.value = null

          if (canAccessUniversalAdmin.value) {
            await router.replace('/admin')
            return
          }

          const firstClass = classes.value[0]

          if (firstClass) {
            selectedClassToken.value = firstClass.joinToken
            await router.replace({
              path: '/coach',
              query: { class: firstClass.joinToken },
            })
          }
        }
      }
    } finally {
      isRedirecting.value = false
    }
  },
  { immediate: true }
)

async function changeContext() {
  if (selectedContext.value === 'admin') {
    if (!canAccessUniversalAdmin.value) {
      selectedContext.value = getCurrentContext()
      return
    }

    selectedClassToken.value = null
    await router.push('/admin')
    return
  }

  if (selectedContext.value === 'create-class') {
    await router.push('/coach/create-class')
    return
  }

  const classToken = selectedContext.value.replace(/^class:/, '')
  selectedClassToken.value = classToken
  await router.push({
    path: '/coach',
    query: { class: classToken },
  })
}
</script>

<template>
  <div class="class-context-select">
    <label for="class-context">Managing</label>

    <select id="class-context" v-model="selectedContext" @change="changeContext">
      <option v-if="canAccessUniversalAdmin" value="admin">Admin</option>

      <option v-if="classesStatus === 'pending'" disabled>Loading classes…</option>

      <option v-for="classroom in classes" :key="classroom.joinToken" :value="`class:${classroom.joinToken}`">
        {{ classroom.name }}
      </option>

      <option value="create-class">+ Create New Class</option>
    </select>
  </div>
</template>

<style scoped src="./ClassContextSelect.css"></style>
