<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

definePageMeta({
  ssr: false,
  layout: 'admin',
})

useHead({ title: 'Create Admin' })

const name = ref('')
const email = ref('')
const isCheckingAccess = ref(true)
const isSubmitting = ref(false)
const changingPrivilegeFor = ref<string | null>(null)
const canCreateAdmins = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')
const admins = ref<Array<{ id: string; name: string; email: string; isMaster: boolean }>>([])

async function loadAdmins() {
  try {
    const access = await $fetch<{
      canCreateAdmins: boolean
      admins: Array<{ id: string; name: string; email: string; isMaster: boolean }>
    }>('/api/admin/admins')
    canCreateAdmins.value = access.canCreateAdmins
    admins.value = access.admins
    if (!access.canCreateAdmins) await navigateTo('/admin')
  } catch (error) {
    console.error('Failed to check admin creation access', error)
    statusType.value = 'error'
    statusMessage.value = 'Could not load admin management. Please try again.'
  } finally {
    isCheckingAccess.value = false
  }
}

onMounted(loadAdmins)

async function submit() {
  isSubmitting.value = true
  statusMessage.value = ''
  email.value = email.value.trim().toLowerCase()

  try {
    await $fetch('/api/admin/admins', {
      method: 'POST',
      body: { name: name.value, email: email.value },
    })

    await loadAdmins()
    const { error } = await authClient.signIn.magicLink({
      email: email.value,
      callbackURL: '/admin',
    })

    name.value = ''
    email.value = ''
    statusType.value = error ? 'error' : 'success'
    statusMessage.value = error
      ? 'Admin created, but a sign-in link could not be sent. They can request one at /auth.'
      : 'Admin created. A sign-in link was sent to their email.'
  } catch (error) {
    console.error('Failed to create admin', error)
    const fetchError = error as { data?: { statusMessage?: string } }
    statusType.value = 'error'
    statusMessage.value = fetchError.data?.statusMessage ?? 'Could not create the admin account.'
  } finally {
    isSubmitting.value = false
  }
}

async function removeAdminPrivilege(admin: { id: string; name: string }) {
  if (!window.confirm(`Change ${admin.name}'s role from admin to coach? They will be signed out.`)) return

  changingPrivilegeFor.value = admin.id
  statusMessage.value = ''

  try {
    await $fetch('/api/admin/admins', {
      method: 'PATCH',
      body: { id: admin.id },
    })
    admins.value = admins.value.filter((entry) => entry.id !== admin.id)
    statusType.value = 'success'
    statusMessage.value = `${admin.name} is now a coach.`
  } catch (error) {
    console.error('Failed to remove admin privilege', error)
    const fetchError = error as { data?: { statusMessage?: string } }
    statusType.value = 'error'
    statusMessage.value = fetchError.data?.statusMessage ?? 'Could not remove admin privileges.'
  } finally {
    changingPrivilegeFor.value = null
  }
}
</script>

<template>
  <div class="admin-management">
    <section class="create-admin-panel">
      <header>
        <h2>Create Admin</h2>
        <p>Create an administrator account and send its sign-in link.</p>
      </header>

      <form v-if="canCreateAdmins && !isCheckingAccess" class="create-admin-form" @submit.prevent="submit">
        <label>
          <span>Name</span>
          <input v-model="name" required maxlength="100" autocomplete="name">
        </label>

        <label>
          <span>Email</span>
          <input v-model="email" required type="email" autocomplete="email">
        </label>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating…' : 'Create Admin' }}
        </button>
      </form>

      <p v-if="isCheckingAccess" role="status">Checking access…</p>
      <p v-if="statusMessage" class="form-status" :class="statusType" role="status">
        {{ statusMessage }}
      </p>
    </section>

    <aside v-if="canCreateAdmins && !isCheckingAccess" class="admin-list-panel">
      <header>
        <h2>Admin Accounts</h2>
        <p>{{ admins.length }} {{ admins.length === 1 ? 'admin' : 'admins' }}</p>
      </header>

      <ul v-if="admins.length" class="admin-list">
        <li v-for="admin in admins" :key="admin.id" class="admin-list-item">
          <div class="admin-information">
            <strong>{{ admin.name }}</strong>
            <span>{{ admin.email }}</span>
          </div>
          <span v-if="admin.isMaster" class="master-badge">
            Master
          </span>
          <button
            v-else
            type="button"
            class="remove-admin-button"
            :disabled="changingPrivilegeFor === admin.id"
            @click="removeAdminPrivilege(admin)"
          >
            {{ changingPrivilegeFor === admin.id ? 'Changing…' : 'Make Coach' }}
          </button>
        </li>
      </ul>
      <p v-else class="empty-admins">No admin accounts found.</p>
    </aside>
  </div>
</template>

<style scoped>
.admin-management {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 1fr);
  gap: 1rem;
}

.create-admin-panel,
.admin-list-panel {
  min-width: 0;
  padding: 1.5rem;
  background: #fff;
  border: 1px solid #dbe3ec;
  border-radius: 0.75rem;
}

.create-admin-panel h2,
.admin-list-panel h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

.create-admin-panel header p,
.admin-list-panel header p {
  margin: 0.35rem 0 1.25rem;
  color: #64748b;
  font-size: 0.875rem;
}

.create-admin-form {
  display: grid;
  gap: 1rem;
}

label {
  display: grid;
  gap: 0.35rem;
  color: #334155;
  font-size: 0.875rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.45rem;
  color: #0f172a;
}

button {
  justify-self: start;
  padding: 0.65rem 1rem;
  background: #4f46e5;
  border: 0;
  border-radius: 0.45rem;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.form-status {
  margin: 0;
  font-size: 0.875rem;
}

.form-status.success {
  color: #047857;
}

.form-status.error {
  color: #b91c1c;
}

.admin-list {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.admin-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.admin-information {
  min-width: 0;
  display: grid;
  gap: 0.2rem;
}

.admin-information strong {
  color: #1e293b;
  font-size: 0.875rem;
}

.admin-information span {
  overflow-wrap: anywhere;
  color: #64748b;
  font-size: 0.8rem;
}

.master-badge {
  flex-shrink: 0;
  padding: 0.25rem 0.5rem;
  background: #eef2ff;
  border-radius: 999px;
  color: #4338ca;
  font-size: 0.75rem;
  font-weight: 700;
}

.remove-admin-button {
  flex-shrink: 0;
  padding: 0.45rem 0.6rem;
  background: #fff;
  border: 1px solid #fecaca;
  border-radius: 0.4rem;
  color: #b91c1c;
  font-size: 0.75rem;
}

.empty-admins {
  color: #64748b;
  font-size: 0.875rem;
}

@media (max-width: 800px) {
  .admin-management {
    grid-template-columns: 1fr;
  }
}
</style>
