<!-- layouts/coach.vue -->
<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

const route = useRoute()
const selectedClassToken = useCookie<string | null>('selected-class-token', {
  sameSite: 'lax',
})

const routeClassToken = computed(() => {
  const classQuery = route.query.class
  return Array.isArray(classQuery) ? classQuery[0] : classQuery
})

watchEffect(() => {
  if (routeClassToken.value) {
    selectedClassToken.value = routeClassToken.value
  }
})

function navigateWithinClass(path: string) {
  const classToken = routeClassToken.value || selectedClassToken.value

  return navigateTo({
    path,
    query: classToken ? { class: classToken } : {},
  })
}

async function logout() {
  const confirmed = confirm('Are you sure you want to log out?')
  if (!confirmed) return

  try {
    await authClient.signOut()
    window.location.href = '/auth'
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <div class="rh-coach-wrap">
    <aside class="rh-sidebar">
      <div class="rh-sidebar-inner">
        <div class="rh-logo">
          <div class="rh-logo-icon">L</div>
          <div>
            <div class="rh-logo-name">Reading<span class="rh-logo-accent">Huddle</span></div>
            <div class="rh-logo-sub">Reading Coach Portal</div>
          </div>
        </div>

        <p class="rh-nav-label">Reading Coach Tools</p>
        <nav class="rh-nav">
          <button @click="navigateWithinClass('/coach')"               class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/coach' }">Dashboard</button>
          <button @click="navigateWithinClass('/coach/builder')"       class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/coach/builder' }">Form Builder</button>
          <button @click="navigateWithinClass('/coach/progress')"      class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/coach/progress' }">Class Progress</button>
          <button @click="navigateWithinClass('/coach/raffle')"        class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/coach/raffle' }">Raffle System</button>
          <button @click="navigateWithinClass('/coach/announcements')" class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/coach/announcements' }">Announcements</button>
        </nav>
      </div>

      <div class="rh-sidebar-footer">
        <NuxtLink to="/" class="rh-back-link">← Back to Portal</NuxtLink>
        <button class="rh-logout-link" @click="logout">⎋ Logout</button>
      </div>
    </aside>

    <div class="rh-workspace">
      <header class="rh-header">
        <div>
          <p class="rh-header-label">Reading Huddle</p>
          <h1 class="rh-header-title">Reading Coach</h1>
        </div>

        <ClassContextSelect />
      </header>

      <div class="rh-main">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
@import './coach.css';
</style>
