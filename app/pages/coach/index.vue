<script setup lang="ts">
definePageMeta({ ssr: false, layout: 'coach' })

const {
  publishedForms,
  students,
} = useCoach()
const { classId } = useSelectedClass()
const route = useRoute()
const router = useRouter()
const selectedClassToken = useCookie<string | null>('selected-class-token', {
  sameSite: 'lax',
})
const copiedCode = ref(false)
const codeError = ref('')
const regeneratingCode = ref(false)

const hasFiveCharacterCode = computed(() => /^[A-Z0-9]{5}$/.test(classId.value || ''))

async function copyClassCode() {
  if (!classId.value) return

  try {
    await navigator.clipboard.writeText(classId.value)
    copiedCode.value = true
    setTimeout(() => { copiedCode.value = false }, 2000)
  } catch {
    codeError.value = 'Copy failed. Select the code to copy it.'
  }
}

async function regenerateClassCode() {
  if (!classId.value || regeneratingCode.value) return

  regeneratingCode.value = true
  codeError.value = ''

  try {
    const classroom = await $fetch<{ joinToken: string }>('/api/admin/classes/regenerate-code', {
      method: 'POST',
      body: { classToken: classId.value },
    })
    selectedClassToken.value = classroom.joinToken
    await router.replace({ path: route.path, query: { ...route.query, class: classroom.joinToken } })
    await refreshNuxtData()
  } catch (error: any) {
    codeError.value = error.data?.statusMessage || 'Could not generate a class code'
  } finally {
    regeneratingCode.value = false
  }
}

const activeForms = computed(
  () => publishedForms.value.filter((f: any) => f.status === 'Active').length
)

// Fetch the real active-announcement count from the database.
// Using ?active=true applies the same postDate/expiryDate filter the reader home uses,
// so the number here always matches what students actually see.
const activeAnnouncementsData = ref<any[]>([])

const refreshAnnouncements = async () => {
  if (!classId.value) {
    activeAnnouncementsData.value = []
    return
  }

  activeAnnouncementsData.value = await $fetch<any[]>('/api/announcement', {
    query: { active: true, classId: classId.value },
  })
}

const activeAnnouncements = computed(
  () => activeAnnouncementsData.value?.length ?? 0
)

watch(classId, refreshAnnouncements, { immediate: true })
</script>

<template>
  <section class="coach-home">
    <header class="welcome-card">
      <p class="eyebrow">Welcome</p>
      <h1>Reading Coach</h1>
      <p class="subtext">Use the left sidebar to manage forms, track progress, run raffles, and post announcements.</p>
      <div class="actions">
        <NuxtLink to="/coach/builder" class="primary-btn">Open Form Builder</NuxtLink>
        <NuxtLink to="/coach/progress" class="ghost-btn">View Class Progress</NuxtLink>
      </div>
    </header>

    <article v-if="classId" class="stat-card">
      <p class="stat-label">Student join code</p>
      <div class="mt-2 flex flex-wrap items-center justify-between gap-4">
        <p class="break-all font-mono text-2xl font-bold text-slate-900">
          {{ hasFiveCharacterCode ? classId : 'Code update required' }}
        </p>
        <button v-if="hasFiveCharacterCode" type="button" class="ghost-btn" @click="copyClassCode">
          {{ copiedCode ? 'Copied' : 'Copy code' }}
        </button>
        <button v-else type="button" class="ghost-btn disabled:opacity-50" :disabled="regeneratingCode" @click="regenerateClassCode">
          {{ regeneratingCode ? 'Generating...' : 'Generate 5-character code' }}
        </button>
      </div>
      <p v-if="codeError" class="mt-2 text-sm text-red-700">{{ codeError }}</p>
    </article>

    <div class="stats-grid">
      <article class="stat-card">
        <p class="stat-label">Published Forms</p>
        <p class="stat-value">{{ publishedForms.length }}</p>
      </article>
      <article class="stat-card">
        <p class="stat-label">Active Forms</p>
        <p class="stat-value">{{ activeForms }}</p>
      </article>
      <article class="stat-card">
        <p class="stat-label">Students</p>
        <p class="stat-value">{{ students.length }}</p>
      </article>
      <article class="stat-card">
        <p class="stat-label">Active Announcements</p>
        <p class="stat-value">{{ activeAnnouncements }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
@import './styles/index.css';

</style>
