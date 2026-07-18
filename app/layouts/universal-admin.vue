<script setup lang="ts">
import './universal-admin.css'

const navigation = [
  {
    label: 'Dashboard',
    route: '/universal-admin',
  },
  {
    label: 'Data',
    route: '/universal-admin/data',
  },
  {
    label: 'Teacher Verification',
    route: '/universal-admin/teacher-verification',
  },
]
</script>

<template>
  <div class="portal-layout">
    <aside class="portal-sidebar">
      <div class="portal-sidebar-content">
        <NuxtLink to="/universal-admin" class="portal-logo">
          <div class="portal-logo-icon">L</div>

          <div>
            <div class="portal-logo-title">Reading<span>Huddle</span></div>

            <div class="portal-logo-subtitle">Universal Admin Portal</div>
          </div>
        </NuxtLink>

        <p class="portal-nav-label">Navigation</p>

        <nav class="portal-navigation">
          <NuxtLink
            v-for="item in navigation"
            :key="item.route"
            :to="item.route"
            class="portal-nav-link"
            exact-active-class="portal-nav-link-active"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>

      <div class="portal-sidebar-footer">
        <LogoutButton class="portal-logout">← Log out</LogoutButton>
      </div>
    </aside>

    <div class="portal-workspace">
      <header class="portal-header">
        <div>
          <p class="portal-header-label">Reading Huddle</p>

          <h1 class="portal-header-title">Administration</h1>
        </div>

        <ClassContextSelect />
      </header>

      <main class="portal-main">
        <slot />
      </main>
    </div>
  </div>
</template>
