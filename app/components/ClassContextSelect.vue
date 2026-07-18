<script setup lang="ts">
import { authClient } from '../utils/auth-client'

type ClassOption = {
  id: string
  name: string
}

const route = useRoute()
const router = useRouter()
const selectedClassId = useCookie<string | null>('selected-class-id', {
  sameSite: 'lax',
})
const { data: session } = await authClient.useSession(useFetch)

const { data: classes, status: classesStatus } = await useFetch<ClassOption[]>(
  '/api/universal-admin/classes',
  {
    key: 'universal-admin-classes',
    default: () => [],
  }
)

function getRouteClassId() {
  const classQuery = route.query.class
  return Array.isArray(classQuery) ? classQuery[0] : classQuery
}

function getCurrentContext() {
  if (route.path === '/universal-admin/create-class') {
    return 'create-class'
  }

  if (route.path.startsWith('/admin')) {
    const classId = getRouteClassId() || selectedClassId.value
    return classId ? `class:${classId}` : 'admin'
  }

  return 'admin'
}

const selectedContext = ref(getCurrentContext())
const isRedirecting = ref(false)
const canAccessUniversalAdmin = computed(() => session.value?.user?.role === 'admin')
const canManageClasses = computed(
  () => session.value?.user?.role === 'admin' || session.value?.user?.role === 'poster'
)

watch(
  () => [route.path, route.query.class, selectedClassId.value],
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
    () => selectedClassId.value,
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

      if (classes.value.length === 0 && route.path !== '/universal-admin/create-class') {
        selectedClassId.value = null
        await router.replace('/universal-admin/create-class')
        return
      }

      if (route.path.startsWith('/admin')) {
        const classId = getRouteClassId() || selectedClassId.value
        const classExists = classes.value.some((classroom) => classroom.id === classId)

        if (!classId || !classExists) {
          selectedClassId.value = null

          if (canAccessUniversalAdmin.value) {
            await router.replace('/universal-admin')
            return
          }

          const firstClass = classes.value[0]

          if (firstClass) {
            selectedClassId.value = firstClass.id
            await router.replace({
              path: '/admin',
              query: { class: firstClass.id },
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

    selectedClassId.value = null
    await router.push('/universal-admin')
    return
  }

  if (selectedContext.value === 'create-class') {
    await router.push('/universal-admin/create-class')
    return
  }

  const classId = selectedContext.value.replace(/^class:/, '')
  selectedClassId.value = classId
  await router.push({
    path: '/admin',
    query: { class: classId },
  })
}
</script>

<template>
  <div class="class-context-select">
    <label for="class-context">Managing</label>

    <select id="class-context" v-model="selectedContext" @change="changeContext">
      <option v-if="canAccessUniversalAdmin" value="admin">Admin</option>

      <option v-if="classesStatus === 'pending'" disabled>Loading classes…</option>

      <option v-for="classroom in classes" :key="classroom.id" :value="`class:${classroom.id}`">
        {{ classroom.name }}
      </option>

      <option value="create-class">+ Create New Class</option>
    </select>
  </div>
</template>

<style scoped>
.class-context-select {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

label {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

select {
  min-width: 15rem;
  padding: 0.7rem 0.9rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.65rem;
  color: #1e293b;
  cursor: pointer;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
}

select:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 3px rgb(79 70 229 / 12%);
}

@media (max-width: 800px) {
  .class-context-select {
    width: 100%;
  }

  select {
    min-width: 0;
    flex: 1;
  }
}
</style>
