<script setup lang="ts">
import './universal-admin.css'

const router = useRouter()

const contexts = [
  {
    label: 'Admin',
    value: 'admin',
    route: '/universal-admin',
  },
  {
    label: 'English 9',
    value: 'english-9',
    route: '/admin',
  },
  {
    label: 'Reading Club',
    value: 'reading-club',
    route: '/admin',
  },
  {
    label: '+ Create New Class',
    value: 'create-class',
    route: '/universal-admin/create-class',
  },
]

const selectedContext = ref('admin')

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

async function changeContext() {
  const selected = contexts.find(
    context => context.value === selectedContext.value,
  )

  if (!selected) {
    return
  }

  await router.push(selected.route)
}
</script>

<template>
  <div class="portal-layout">
    <aside class="portal-sidebar">
      <div class="portal-sidebar-content">
        <NuxtLink
          to="/universal-admin"
          class="portal-logo"
        >
          <div class="portal-logo-icon">
            L
          </div>

          <div>
            <div class="portal-logo-title">
              Reading<span>Huddle</span>
            </div>

            <div class="portal-logo-subtitle">
              Universal Admin Portal
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
        <NuxtLink
          to="/auth"
          class="portal-logout"
        >
          ← Log out
        </NuxtLink>
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

        <div class="portal-context">
          <label for="portal-context">
            Managing
          </label>

          <select
            id="portal-context"
            v-model="selectedContext"
            @change="changeContext"
          >
            <option
              v-for="context in contexts"
              :key="context.value"
              :value="context.value"
            >
              {{ context.label }}
            </option>
          </select>
        </div>
      </header>

      <main class="portal-main">
        <slot />
      </main>
    </div>
  </div>
</template>