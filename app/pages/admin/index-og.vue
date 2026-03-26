<script setup lang="ts">
definePageMeta({ ssr: false })
const route = useRoute()
</script>

<template>
  <div class="admin-shell">

    <!-- ── SIDEBAR ── -->
    <aside class="admin-sidebar">

      <!-- Logo -->
      <div class="admin-logo-row">
        <div class="admin-logo-icon">L</div>
        <div>
          <div class="admin-logo-text">Reading<span class="admin-logo-accent">Huddle</span></div>
          <div class="admin-logo-sub">Admin Portal</div>
        </div>
      </div>

      <!-- Nav -->
      <div class="admin-nav-section">
        <p class="admin-nav-label">Admin Tools</p>
        <nav class="admin-nav">
          <NuxtLink
            to="/admin/builder"
            class="admin-nav-item"
            :class="route.path === '/admin/builder' ? 'active' : ''"
          >Form Builder</NuxtLink>

          <NuxtLink
            to="/admin/progress"
            class="admin-nav-item"
            :class="route.path === '/admin/progress' ? 'active' : ''"
          >Class Progress</NuxtLink>

          <NuxtLink
            to="/admin/raffle"
            class="admin-nav-item"
            :class="route.path === '/admin/raffle' ? 'active' : ''"
          >Raffle System</NuxtLink>

          <NuxtLink
            to="/admin/announcements"
            class="admin-nav-item"
            :class="route.path === '/admin/announcements' ? 'active' : ''"
          >Announcements</NuxtLink>
        </nav>
      </div>

      <!-- Footer -->
      <div class="admin-sidebar-footer">
        <NuxtLink to="/" class="admin-back-link">← Back to Portal</NuxtLink>
      </div>
    </aside>

    <!-- ── MAIN AREA ── -->
    <div class="admin-main">

      <!-- Welcome screen — only on /admin exactly -->
      <div v-if="route.path === '/admin'" class="admin-welcome">
        <div class="text-7xl mb-4">🏫</div>
        <h1 class="text-4xl font-medium text-gray-900 mb-2">Welcome, Admin!</h1>
        <p class="text-gray-500 font-medium text-lg mb-8">Pick a tool from the sidebar to get started.</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full">
          <NuxtLink to="/admin/builder"       class="admin-welcome-card"><div class="text-3xl mb-2">📝</div><div class="font-medium text-gray-700 text-sm">Form Builder</div></NuxtLink>
          <NuxtLink to="/admin/progress"      class="admin-welcome-card"><div class="text-3xl mb-2">📊</div><div class="font-medium text-gray-700 text-sm">Class Progress</div></NuxtLink>
          <NuxtLink to="/admin/raffle"        class="admin-welcome-card"><div class="text-3xl mb-2">🎟️</div><div class="font-medium text-gray-700 text-sm">Raffle System</div></NuxtLink>
          <NuxtLink to="/admin/announcements" class="admin-welcome-card"><div class="text-3xl mb-2">📢</div><div class="font-medium text-gray-700 text-sm">Announcements</div></NuxtLink>
        </div>
      </div>

      <!-- Child pages -->
      <NuxtPage v-else />
    </div>

  </div>
</template>

<style scoped>
/* ── Shell ── */
.admin-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f8fafc;
  color: #1e293b;
  font-family: 'Quicksand', system-ui, sans-serif;
}

/* ── Sidebar ── */
.admin-sidebar {
  width: 18rem;
  flex-shrink: 0;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  overflow-y: auto;
}

.admin-logo-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.5rem;
  margin-bottom: 2rem;
}

.admin-logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: #4f46e5;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.admin-logo-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: #0f172a;
  line-height: 1;
}

.admin-logo-accent { color: #4f46e5; }

.admin-logo-sub {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #2dd4bf;
  margin-top: 0.2rem;
}

.admin-nav-section { padding: 0 1.5rem; margin-bottom: 2rem; }

.admin-nav-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.admin-nav { display: flex; flex-direction: column; gap: 0.25rem; }

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-weight: 500;
  border-radius: 0 0.75rem 0.75rem 0;
  transition: all 0.15s;
  border-left: 4px solid transparent;
  color: #64748b;
  text-decoration: none;
  cursor: pointer;
}

.admin-nav-item:hover { background: #f8fafc; }

.admin-nav-item.active {
  background: #eef2ff;
  color: #4338ca;
  border-left-color: #4f46e5;
  font-weight: 600;
}

.admin-sidebar-footer {
  margin-top: auto;
  padding: 1.5rem;
}

.admin-back-link {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s;
}
.admin-back-link:hover { color: #64748b; }

/* ── Main ── */
.admin-main {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
}

/* ── Welcome ── */
.admin-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
}

.admin-welcome-card {
  background: white;
  border-radius: 1rem;
  border: 2px solid #e2e8f0;
  padding: 1.5rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
}
.admin-welcome-card:hover {
  border-color: #a5b4fc;
  box-shadow: 0 4px 12px rgba(99,102,241,0.1);
}
</style>
