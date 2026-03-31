<!-- layouts/admin.vue -->
<script setup lang="ts">
const route = useRoute()
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
          <button @click="navigateTo('/admin')"               class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/admin' }">Dashboard</button>
          <button @click="navigateTo('/admin/builder')"       class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/admin/builder' }">Form Builder</button>
          <button @click="navigateTo('/admin/progress')"      class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/admin/progress' }">Class Progress</button>
          <button @click="navigateTo('/admin/raffle')"        class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/admin/raffle' }">Raffle System</button>
          <button @click="navigateTo('/admin/announcements')" class="rh-nav-btn" :class="{ 'rh-nav-active': route.path === '/admin/announcements' }">Announcements</button>
        </nav>
      </div>

      <div class="rh-sidebar-footer">
        <NuxtLink to="/" class="rh-back-link">← Back to Portal</NuxtLink>
      </div>
    </aside>

    <div class="rh-main">
      <slot />
    </div>
  </div>
</template>

<style>
@import './admin.css';
</style>