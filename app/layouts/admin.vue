<!-- layouts/admin.vue -->
<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

const route = useRoute()

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

const selectedClassId = useCookie<string | null>('selected-class-id', {
  sameSite: 'lax',
})

const routeClassId = computed(() => {
  const classQuery = route.query.class
  return Array.isArray(classQuery) ? classQuery[0] : classQuery
})

watchEffect(() => {
  if (routeClassId.value) {
    selectedClassId.value = routeClassId.value
  }
})

function navigateWithinClass(path: string) {
  const classId = routeClassId.value || selectedClassId.value

  return navigateTo({
    path,
    query: classId ? { class: classId } : {},
  })
}
</script>

<template>
  <div class="rh-admin-wrap">
    <aside class="rh-sidebar">
      <div class="rh-sidebar-inner">
        <div class="rh-logo">
          <div class="rh-logo-icon">L</div>
          <div>
            <div class="rh-logo-name">Reading<span class="rh-logo-accent">Huddle</span></div>
            <div class="rh-logo-sub">Admin Portal</div>
          </div>
        </div>

        <p class="rh-nav-label">Admin Tools</p>
        <nav class="rh-nav">
          <button
            @click="navigateWithinClass('/admin')"
            class="rh-nav-btn"
            :class="{ 'rh-nav-active': route.path === '/admin' }"
          >
            Dashboard
          </button>
          <button
            @click="navigateWithinClass('/admin/builder')"
            class="rh-nav-btn"
            :class="{ 'rh-nav-active': route.path === '/admin/builder' }"
          >
            Form Builder
          </button>
          <button
            @click="navigateWithinClass('/admin/progress')"
            class="rh-nav-btn"
            :class="{ 'rh-nav-active': route.path === '/admin/progress' }"
          >
            Class Progress
          </button>
          <button
            @click="navigateWithinClass('/admin/raffle')"
            class="rh-nav-btn"
            :class="{ 'rh-nav-active': route.path === '/admin/raffle' }"
          >
            Raffle System
          </button>
          <button
            @click="navigateWithinClass('/admin/announcements')"
            class="rh-nav-btn"
            :class="{ 'rh-nav-active': route.path === '/admin/announcements' }"
          >
            Announcements
          </button>
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
          <h1 class="rh-header-title">Administration</h1>
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
@import './admin.css';
</style>
