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
.admin-home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-card {
  background: linear-gradient(135deg, #e2e8f0, #f8fafc);
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 1.5rem;
}

.eyebrow {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
  margin: 0 0 0.25rem;
}

h1 {
  margin: 0;
  font-size: 2rem;
  color: #0f172a;
}

.subtext {
  margin: 0.6rem 0 1rem;
  color: #334155;
}

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.primary-btn,
.ghost-btn {
  text-decoration: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
}

.primary-btn {
  background: #1d4ed8;
  color: #ffffff;
}

.ghost-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}

.stats-grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
}

.stat-label {
  margin: 0;
  color: #64748b;
  font-size: 0.85rem;
}

.stat-value {
  margin: 0.3rem 0 0;
  font-size: 1.8rem;
  color: #0f172a;
  font-weight: 700;
}
</style>
