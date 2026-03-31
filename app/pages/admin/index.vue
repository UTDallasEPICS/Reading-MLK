<script setup lang="ts">
definePageMeta({ ssr: false, layout: 'admin' })

const {
  publishedForms,
  students,
  announcements,
  isAnnouncementActive,
} = useAdmin()

const activeForms = computed(
  () => publishedForms.value.filter((f: any) => f.status === 'Active').length
)

const activeAnnouncements = computed(
  () => announcements.value.filter((a: any) => isAnnouncementActive(a)).length
)
</script>

<template>
  <section class="admin-home">
    <header class="welcome-card">
      <p class="eyebrow">Welcome</p>
      <h1>ReadingHuddle Admin</h1>
      <p class="subtext">Use the left sidebar to manage forms, track progress, run raffles, and post announcements.</p>
      <div class="actions">
        <NuxtLink to="/admin/builder" class="primary-btn">Open Form Builder</NuxtLink>
        <NuxtLink to="/admin/progress" class="ghost-btn">View Class Progress</NuxtLink>
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
