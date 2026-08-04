<script setup lang="ts">
definePageMeta({ ssr: false, layout: 'coach' })

const {
  publishedForms,
  students,
} = useCoach()
const { classId } = useSelectedClass()

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
