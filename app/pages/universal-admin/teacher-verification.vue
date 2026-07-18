<script setup lang="ts">
definePageMeta({
  ssr: false,
  layout: 'universal-admin',
})

useHead({
  title: 'Teacher Verification',
})

type VerificationStatus = 'Pending' | 'Approved' | 'Denied'

type TeacherApplication = {
  id: number
  name: string
  email: string
  role: string
  school: string
  district: string
  zipcode: string
  requestedAt: string
  status: VerificationStatus
}

const applications = ref<TeacherApplication[]>([])

const searchQuery = ref('')
const roleFilter = ref('All')
const statusFilter = ref<VerificationStatus | 'All'>('Pending')

const selectedApplication = ref<TeacherApplication | null>(null)
const modalOpen = ref(false)

const filteredApplications = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return applications.value.filter((application) => {
    const matchesSearch = [
      application.name,
      application.email,
      application.school,
      application.district,
      application.zipcode,
      application.role,
    ]
      .join(' ')
      .toLowerCase()
      .includes(query)

    const matchesRole =
      roleFilter.value === 'All' ||
      application.role === roleFilter.value

    const matchesStatus =
      statusFilter.value === 'All' ||
      application.status === statusFilter.value

    return matchesSearch && matchesRole && matchesStatus
  })
})

const pendingCount = computed(() =>
  applications.value.filter(
    application => application.status === 'Pending',
  ).length,
)

function openApplication(application: TeacherApplication) {
  selectedApplication.value = { ...application }
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  selectedApplication.value = null
}

function updateStatus(status: VerificationStatus) {
  if (!selectedApplication.value) {
    return
  }

  const application = applications.value.find(
    item => item.id === selectedApplication.value?.id,
  )

  if (!application) {
    return
  }

  application.status = status
  closeModal()
}

function saveApplicationChanges() {
  if (!selectedApplication.value) {
    return
  }

  const index = applications.value.findIndex(
    application => application.id === selectedApplication.value?.id,
  )

  if (index === -1) {
    return
  }

  applications.value[index] = {
    ...selectedApplication.value,
  }

  closeModal()
}
</script>

<template>
  <div class="verification-page">
    <section class="page-heading">
      <h2>Teacher Verification</h2>

      <span class="pending-summary">
        {{ pendingCount }} pending
      </span>
    </section>

    <section class="verification-card">
      <div class="toolbar">
        <div class="search-field">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>

          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search applications..."
          >
        </div>

        <select
          v-model="roleFilter"
          class="filter-select"
        >
          <option value="All">All Roles</option>
          <option value="Teacher">Teacher</option>
          <option value="Study Group">Study Group</option>
          <option value="Other">Other</option>
        </select>

        <select
          v-model="statusFilter"
          class="filter-select"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Denied">Denied</option>
        </select>
      </div>

      <div class="application-list">
        <article
          v-for="application in filteredApplications"
          :key="application.id"
          class="application-row"
        >
          <div class="application-avatar">
            {{ application.name.charAt(0) }}
          </div>

          <div class="application-primary">
            <strong>{{ application.name }}</strong>
            <span>{{ application.email }}</span>
          </div>

          <div class="application-detail">
            <span class="detail-label">Role</span>

            <span
              class="role-badge"
              :class="{
                teacher: application.role === 'Teacher',
                group: application.role === 'Study Group',
                other: application.role === 'Other',
              }"
            >
              {{ application.role }}
            </span>
          </div>

          <div class="application-detail">
            <span class="detail-label">Organization</span>
            <strong>{{ application.school }}</strong>
          </div>

          <div class="application-detail">
            <span class="detail-label">District</span>
            <span>{{ application.district }}</span>
          </div>

          <div class="application-detail">
            <span class="detail-label">Requested</span>
            <span>{{ application.requestedAt }}</span>
          </div>

          <div class="application-status">
            <span
              class="status-badge"
              :class="{
                approved: application.status === 'Approved',
                denied: application.status === 'Denied',
              }"
            >
              {{ application.status }}
            </span>
          </div>

          <button
            type="button"
            class="review-button"
            @click="openApplication(application)"
          >
            Review
          </button>
        </article>

        <div
          v-if="filteredApplications.length === 0"
          class="empty-state"
        >
          No matching teacher applications found.
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="modalOpen && selectedApplication"
        class="modal-backdrop"
      >
        <section
          class="review-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <div class="modal-header">
            <div>
              <h2 id="review-modal-title">
                Review Application
              </h2>

              <p>
                Confirm the applicant's information before approving access.
              </p>
            </div>

            <button
              type="button"
              class="close-button"
              aria-label="Close review modal"
              @click="closeModal"
            >
              ×
            </button>
          </div>

          <div class="applicant-summary">
            <div class="large-avatar">
              {{ selectedApplication.name.charAt(0) }}
            </div>

            <div>
              <strong>{{ selectedApplication.name }}</strong>
              <span>{{ selectedApplication.email }}</span>
            </div>

            <span
              class="status-badge"
              :class="{
                approved: selectedApplication.status === 'Approved',
                denied: selectedApplication.status === 'Denied',
              }"
            >
              {{ selectedApplication.status }}
            </span>
          </div>

          <div class="modal-fields">
            <label>
              <span>Name</span>
              <input v-model="selectedApplication.name" type="text">
            </label>

            <label>
              <span>Email</span>
              <input v-model="selectedApplication.email" type="email">
            </label>

            <label>
              <span>Role</span>

              <select v-model="selectedApplication.role">
                <option value="Teacher">Teacher</option>
                <option value="Study Group">Study Group</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              <span>School or organization</span>
              <input v-model="selectedApplication.school" type="text">
            </label>

            <label>
              <span>District</span>
              <input v-model="selectedApplication.district" type="text">
            </label>

            <label>
              <span>ZIP code</span>
              <input v-model="selectedApplication.zipcode" type="text">
            </label>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="deny-button"
              @click="updateStatus('Denied')"
            >
              Deny
            </button>

            <button
              type="button"
              class="secondary-button"
              @click="saveApplicationChanges"
            >
              Save Edits
            </button>

            <button
              type="button"
              class="approve-button"
              @click="updateStatus('Approved')"
            >
              Approve
            </button>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.verification-page {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.page-heading h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

.pending-summary {
  padding: 0.38rem 0.7rem;
  background: #fef3c7;
  border-radius: 999px;
  color: #b45309;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.verification-card {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #dbe3ec;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgb(15 23 42 / 7%);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #dbe3ec;
}

.search-field {
  min-width: 16rem;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.58rem 0.78rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
}

.search-field:focus-within {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgb(79 70 229 / 10%);
}

.search-field svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  fill: none;
  stroke: #64748b;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.search-field input {
  width: 100%;
  padding: 0;
  background: transparent;
  border: 0;
  color: #334155;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  outline: none;
}

.search-field input::placeholder {
  color: #64748b;
  opacity: 1;
}

.filter-select {
  min-width: 10rem;
  padding: 0.6rem 0.75rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  color: #334155;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
}

.filter-select:focus {
  border-color: #4f46e5;
  outline: none;
}

.application-list {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  padding: 0.4rem 1rem 1rem;
}

.application-row {
  display: grid;
  grid-template-columns:
    auto
    minmax(10rem, 1.2fr)
    minmax(6rem, 0.7fr)
    minmax(9rem, 1fr)
    minmax(7rem, 0.8fr)
    minmax(6rem, 0.6fr)
    auto
    auto;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid #dbe3ec;
}

.application-avatar,
.large-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #eef2ff;
  border-radius: 50%;
  color: #4f46e5;
  font-weight: 700;
}

.application-avatar {
  width: 2.25rem;
  height: 2.25rem;
  font-size: 0.76rem;
}

.large-avatar {
  width: 2.75rem;
  height: 2.75rem;
  font-size: 0.9rem;
}

.application-primary,
.application-detail,
.applicant-summary > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
}

.application-primary strong,
.application-detail strong,
.applicant-summary strong {
  overflow: hidden;
  color: #1e293b;
  font-size: 0.8rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.application-primary span,
.application-detail span,
.applicant-summary span {
  overflow: hidden;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-label {
  color: #475569 !important;
  font-size: 0.68rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.role-badge,
.status-badge {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
}

.role-badge.teacher {
  background: #eef2ff;
  color: #4338ca;
}

.role-badge.group {
  background: #dcfce7;
  color: #15803d;
}

.role-badge.other {
  background: #f1f5f9;
  color: #475569;
}

.status-badge {
  background: #fef3c7;
  color: #b45309;
}

.status-badge.approved {
  background: #dcfce7;
  color: #15803d;
}

.status-badge.denied {
  background: #fee2e2;
  color: #b91c1c;
}

.review-button {
  padding: 0.45rem 0.75rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.45rem;
  color: #4f46e5;
  cursor: pointer;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
}

.review-button:hover {
  background: #eef2ff;
  border-color: #a5b4fc;
}

.empty-state {
  padding: 3rem 1rem;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 500;
  text-align: center;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgb(15 23 42 / 45%);
}

.review-modal {
  width: 100%;
  max-width: 38rem;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  padding: 1.25rem;
  background: #ffffff;
  border: 1px solid #dbe3ec;
  border-radius: 0.85rem;
  box-shadow: 0 20px 50px rgb(15 23 42 / 18%);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dbe3ec;
}

.modal-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.05rem;
}

.modal-header p {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 500;
}

.close-button {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  background: transparent;
  border: 0;
  border-radius: 0.4rem;
  color: #64748b;
  cursor: pointer;
  font-size: 1.3rem;
}

.close-button:hover {
  background: #f1f5f9;
}

.applicant-summary {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
  border-bottom: 1px solid #dbe3ec;
}

.modal-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding: 1rem 0;
}

.modal-fields label {
  display: grid;
  gap: 0.4rem;
}

.modal-fields label span {
  color: #475569;
  font-size: 0.74rem;
  font-weight: 700;
}

.modal-fields input,
.modal-fields select {
  width: 100%;
  padding: 0.67rem 0.78rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  color: #1e293b;
  font: inherit;
  font-size: 0.8rem;
}

.modal-fields input:focus,
.modal-fields select:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 3px rgb(79 70 229 / 10%);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding-top: 1rem;
  border-top: 1px solid #dbe3ec;
}

.deny-button,
.secondary-button,
.approve-button {
  padding: 0.62rem 0.95rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 700;
}

.deny-button {
  margin-right: auto;
  background: #ffffff;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.secondary-button {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.approve-button {
  background: #4f46e5;
  border: 1px solid #4f46e5;
  color: #ffffff;
}

.deny-button:hover {
  background: #fef2f2;
}

.secondary-button:hover {
  background: #f8fafc;
}

.approve-button:hover {
  background: #4338ca;
  border-color: #4338ca;
}

@media (max-width: 1050px) {
  .application-row {
    grid-template-columns:
      auto
      minmax(10rem, 1fr)
      minmax(6rem, 0.6fr)
      minmax(9rem, 0.8fr)
      minmax(7rem, 0.7fr)
      auto
      auto;
  }

  .application-row > :nth-child(6) {
    display: none;
  }
}

@media (max-width: 850px) {
  .verification-page {
    height: auto;
    overflow: visible;
  }

  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .search-field,
  .filter-select {
    width: 100%;
    min-width: 0;
  }

  .application-row {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .verification-card {
    overflow: visible;
  }

  .application-list {
    overflow: visible;
  }

  .application-detail,
  .application-status {
    display: none;
  }

  .modal-fields {
    grid-template-columns: 1fr;
  }
}
</style>
