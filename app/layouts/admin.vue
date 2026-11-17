<script setup lang="ts">
import './admin.css'

const canCreateAdmins = ref(false)

const navigation = computed(() => {
  const items = [
    {
      label: 'Dashboard',
      route: '/admin',
    },
    {
      label: 'Data',
      route: '/admin/data',
    },
    {
      label: 'Teacher Verification',
      route: '/admin/teacher-verification',
    },
  ]

  if (canCreateAdmins.value) {
    items.push({ label: 'Create Admin', route: '/admin/create-admin' })
  }

  return items
})

onMounted(async () => {
  try {
    const access = await $fetch<{ canCreateAdmins: boolean }>('/api/admin/admins')
    canCreateAdmins.value = access.canCreateAdmins
  } catch (error) {
    console.error('Failed to check admin creation access', error)
  }
})

</script>

<template>
  <div class="portal-layout">
    <aside class="portal-sidebar">
      <div class="portal-sidebar-content">
        <NuxtLink to="/admin" class="portal-logo">
          <img src="/logo.png" alt="Reading Huddle" class="portal-logo-icon" />

          <div>
            <div class="portal-logo-title">
              Reading<span>Huddle</span>
            </div>

            <div class="portal-logo-subtitle">
              Admin Portal
            </div>
          </div>
        </NuxtLink>

        <p class="portal-nav-label">
          Navigation
        </p>

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
          <p class="portal-header-label">
            Reading Huddle
          </p>

          <h1 class="portal-header-title">
            Administration
          </h1>
        </div>

        <ClassContextSelect />
      </header>

      <main class="portal-main">
        <slot />
      </main>
    </div>
  </div>
</template>
