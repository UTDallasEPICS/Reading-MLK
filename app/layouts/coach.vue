<!-- layouts/coach.vue -->
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
          <button @click="navigateTo('/coach')"               class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/coach' }">Dashboard</button>
          <button @click="navigateTo('/coach/builder')"       class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/coach/builder' }">Form Builder</button>
          <button @click="navigateTo('/coach/progress')"      class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/coach/progress' }">Class Progress</button>
          <button @click="navigateTo('/coach/raffle')"        class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/coach/raffle' }">Raffle System</button>
          <button @click="navigateTo('/coach/announcements')" class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/coach/announcements' }">Announcements</button>
        </nav>
      </div>

      <div class="rh-sidebar-footer">
        <NuxtLink to="/" class="rh-back-link">← Back to Portal</NuxtLink>
        <button class="rh-logout-link" @click="logout">⎋ Logout</button>
      </div>
    </aside>

    <div class="rh-main">
      <slot />
    </div>
  </div>
</template>

<style>
@import './coach.css';
</style>
