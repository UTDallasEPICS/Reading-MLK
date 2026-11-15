<script setup lang="ts">
definePageMeta({
  ssr: false,
  layout: 'admin',
})

useHead({
  title: 'Admin Dashboard',
})

type DashboardStatistic = {
  label: string
  value: number | string
  detail: string
  icon: 'teacher' | 'group' | 'class' | 'student'
  positive: boolean
}

type Activity = {
  id: string
  title: string
  detail: string
  createdAt: string
}

type PendingApplication = {
  id: string
  name: string
  organization: string
  district: string
}

type RecentCoach = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

type DashboardData = {
  totalTeachers: number
  verifiedTeachers: number
  unverifiedTeachers: number
  totalStudyGroups: number
  totalStudents: number
  activeClasses: number
  pendingApplications: PendingApplication[]
  recentCoaches: RecentCoach[]
}

const dashboardData = ref<DashboardData | null>(null)
const loading = ref(true)
const loadError = ref('')

const recentActivity = computed<Activity[]>(() =>
  (dashboardData.value?.recentCoaches ?? []).map(coach => ({
    id: coach.id,
    title: `New coach: ${coach.name}`,
    detail: `${coach.role} profile | ${coach.email}`,
    createdAt: coach.createdAt,
  })),
)

const statistics = computed<DashboardStatistic[]>(() => [
  {
    label: 'Total Teachers',
    value: dashboardData.value?.totalTeachers ?? '--',
    detail: dashboardData.value
      ? `${dashboardData.value.verifiedTeachers} verified, ${dashboardData.value.unverifiedTeachers} pending`
      : loading.value ? 'Loading...' : 'Unavailable',
    icon: 'teacher',
    positive: false,
  },
  {
    label: 'Total Study Groups',
    value: dashboardData.value?.totalStudyGroups ?? '--',
    detail: 'Registered study groups',
    icon: 'group',
    positive: false,
  },
  {
    label: 'Active Classes',
    value: dashboardData.value?.activeClasses ?? '--',
    detail: 'Classes with students',
    icon: 'class',
    positive: false,
  },
  {
    label: 'Total Students',
    value: dashboardData.value?.totalStudents ?? '--',
    detail: 'Reader profiles',
    icon: 'student',
    positive: false,
  },
])

const pendingApplications = computed(() =>
  dashboardData.value?.pendingApplications ?? [],
)

async function loadDashboard() {
  loading.value = true
  loadError.value = ''

  try {
    dashboardData.value = await $fetch<DashboardData>('/api/admin/dashboard')
  } catch {
    loadError.value = 'Dashboard data could not be loaded. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<template>
  <div class="dashboard-page">
    <section class="dashboard-heading">
      <h2>Platform Overview</h2>
    </section>

    <p
      v-if="loadError"
      class="dashboard-error"
      role="alert"
    >
      {{ loadError }}
      <button type="button" @click="loadDashboard">
        Retry
      </button>
    </p>

    <section class="statistics-grid">
      <article
        v-for="statistic in statistics"
        :key="statistic.label"
        class="statistic-card"
      >
        <div class="statistic-card-header">
          <div class="statistic-icon">
            <svg
              v-if="statistic.icon === 'group'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="3" />
              <circle cx="16" cy="8" r="3" />
              <path d="M2.5 20a5.5 5.5 0 0 1 11 0" />
              <path d="M10.5 20a5.5 5.5 0 0 1 11 0" />
            </svg>

            <svg
              v-else-if="statistic.icon === 'class'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="5" y="3" width="14" height="18" rx="1" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>

            <svg
              v-else
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
          </div>

          <span
            class="statistic-detail"
            :class="{ positive: statistic.positive }"
          >
            {{ statistic.detail }}
          </span>
        </div>

        <strong class="statistic-value">
          {{ statistic.value }}
        </strong>

        <span class="statistic-label">
          {{ statistic.label }}
        </span>
      </article>

    </section>

    <section class="content-grid">
      <article class="dashboard-card activity-card">
        <div class="card-heading">
          <div>
            <h3>Recent Activity</h3>
            <p>Recently joined coach profiles.</p>
          </div>

          <NuxtLink
            to="/admin/data"
            class="text-link"
          >
            View all
          </NuxtLink>
        </div>

        <div class="activity-list">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="activity-row"
          >
            <span class="activity-dot" />

            <div class="activity-information">
              <strong>{{ activity.title }}</strong>
              <span>{{ activity.detail }}</span>
            </div>

            <time :datetime="activity.createdAt">
              {{ new Date(activity.createdAt).toLocaleDateString() }}
            </time>
          </div>

          <div
            v-if="loading && recentActivity.length === 0"
            class="dashboard-empty-state"
          >
            Loading recent coaches...
          </div>

          <div
            v-else-if="!loadError && recentActivity.length === 0"
            class="dashboard-empty-state"
          >
            No coach profiles are available yet.
          </div>
        </div>
      </article>

      <article class="dashboard-card verification-card">
        <div class="card-heading">
          <div>
            <h3>Pending Verification</h3>
            <p>
              {{ pendingApplications.length }}
              teacher {{ pendingApplications.length === 1 ? 'application' : 'applications' }} awaiting review.
            </p>
          </div>

          <span class="pending-count">
            {{ pendingApplications.length }}
          </span>
        </div>

        <div class="application-list">
          <div
            v-for="application in pendingApplications"
            :key="application.id"
            class="application-row"
          >
            <div class="application-initial">
              {{ application.name.charAt(0) }}
            </div>

            <div class="application-information">
              <strong>{{ application.name }}</strong>
              <span>
                {{ application.organization || 'Organization not provided' }}
                <template v-if="application.district">, {{ application.district }}</template>
              </span>
            </div>
          </div>

          <div
            v-if="loading"
            class="dashboard-empty-state"
          >
            Loading pending applications...
          </div>

          <div
            v-else-if="!loadError && pendingApplications.length === 0"
            class="dashboard-empty-state"
          >
            No pending applications are available.
          </div>
        </div>

        <NuxtLink
          to="/admin/teacher-verification"
          class="review-link"
        >
          Review applications
        </NuxtLink>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard-page {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.dashboard-heading h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
  margin-bottom: 0.85rem;
}

.dashboard-empty-state {
  padding: 2rem 1rem;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 500;
  text-align: center;
}

.dashboard-error {
  padding: 0.65rem 0.85rem;
  margin: 0 0 0.85rem;
  background: #fee2e2;
  border-radius: 0.5rem;
  color: #b91c1c;
  font-size: 0.78rem;
}

.dashboard-error button {
  padding: 0;
  margin-left: 0.4rem;
  background: none;
  border: 0;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  text-decoration: underline;
}

.statistic-card {
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #dbe3ec;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgb(15 23 42 / 7%);
}

.statistic-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.statistic-icon {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
  border-radius: 0.55rem;
  color: #4f46e5;
}

.statistic-icon svg {
  width: 1.15rem;
  height: 1.15rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.statistic-detail {
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
  text-align: right;
}

.statistic-detail.positive {
  color: #059669;
}

.statistic-value {
  display: block;
  color: #0f172a;
  font-size: 1.9rem;
  line-height: 1;
}

.statistic-label {
  display: block;
  margin-top: 0.4rem;
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.content-grid {
  min-height: 0;
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(16rem, 1fr);
  gap: 0.85rem;
}

.dashboard-card {
  background: #ffffff;
  border: 1px solid #dbe3ec;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgb(15 23 42 / 7%);
}

.activity-card,
.verification-card {
  min-height: 0;
  overflow-y: auto;
  padding: 1rem;
}

.card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.card-heading h3 {
  margin: 0;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 600;
}

.card-heading p {
  margin: 0.15rem 0 0;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 500;
}

.text-link {
  color: #4f46e5;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
}

.activity-list,
.application-list {
  margin-top: 0.65rem;
}

.activity-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0;
  border-top: 1px solid #e2e8f0;
}

.activity-dot {
  width: 0.45rem;
  height: 0.45rem;
  background: #6366f1;
  border-radius: 50%;
}

.activity-information,
.application-information {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
}

.activity-information strong,
.application-information strong {
  color: #334155;
  font-size: 0.78rem;
  font-weight: 700;
}

.activity-information span,
.application-information span {
  overflow: hidden;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-row time {
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.pending-count {
  min-width: 1.6rem;
  padding: 0.22rem 0.4rem;
  background: #fee2e2;
  border-radius: 999px;
  color: #b91c1c;
  font-size: 0.7rem;
  font-weight: 700;
  text-align: center;
}

.application-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0;
  border-top: 1px solid #e2e8f0;
}

.application-initial {
  width: 1.85rem;
  height: 1.85rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
  border-radius: 50%;
  color: #4f46e5;
  font-size: 0.7rem;
  font-weight: 700;
}

.review-link {
  display: block;
  padding: 0.6rem;
  margin-top: 0.55rem;
  background: #e7eafe;
  border-radius: 0.45rem;
  color: #4338ca;
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}

.review-link:hover {
  background: #dfe3fc;
}

@media (max-width: 1050px) {
  .statistics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .dashboard-page {
    height: auto;
    overflow: visible;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .activity-card,
  .verification-card {
    overflow: visible;
  }
}

@media (max-width: 550px) {
  .statistics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
