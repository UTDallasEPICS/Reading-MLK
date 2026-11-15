<script setup lang="ts">
  definePageMeta({ ssr: false, layout: 'coach' })

  type ClassOption = {
    joinToken: string
    name: string
  }

  type ClassStudent = {
    id: number
    name: string
    exp: number
  }

  type StudentDetails = {
    id: number
    name: string
    experience: number
    className: string
    submissions: Array<{
      id: number
      form: string
      submittedAt: string
    }>
  }

  const { publishedForms, students, studentsLoading, studentsError } = useCoach()
  const { classId } = useSelectedClass()
  const {
    data: classOptions,
    pending: classesLoading,
    error: classesError,
  } = await useFetch<ClassOption[]>('/api/admin/classes', {
    default: () => [],
  })

  const selectedStudent = ref<ClassStudent | null>(null)
  const studentDetails = ref<StudentDetails | null>(null)
  const studentDetailsLoading = ref(false)
  const studentDetailsError = ref('')

  const hasFiveCharacterCode = computed(() => /^[A-Z0-9]{5}$/.test(classId.value || ''))
  const selectedClass = computed(() =>
    classOptions.value.find((classroom) => classroom.joinToken === classId.value)
  )

  const activeForms = computed(
    () => publishedForms.value.filter((f: any) => f.status === 'Active').length
  )

  // Fetch the real active-announcement count from the database.
  // Using ?active=true applies the same postDate/expiryDate filter the reader home uses,
  // so the number here always matches what students actually see.
  const activeAnnouncementsData = ref<any[]>([])

  const refreshAnnouncements = async () => {
    if (!classId.value) {
      activeAnnouncementsData.value = []
      return
    }

    activeAnnouncementsData.value = await $fetch<any[]>('/api/announcement', {
      query: { active: true, classId: classId.value },
    })
  }

  const activeAnnouncements = computed(() => activeAnnouncementsData.value?.length ?? 0)

  async function openStudentDetails(student: ClassStudent) {
    if (!classId.value) {
      return
    }

    selectedStudent.value = student
    studentDetails.value = null
    studentDetailsError.value = ''
    studentDetailsLoading.value = true

    try {
      studentDetails.value = await $fetch<StudentDetails>(
        `/api/coach/class-students/${student.id}`,
        { query: { classId: classId.value } }
      )
    } catch (error) {
      studentDetailsError.value =
        error instanceof Error ? error.message : 'Could not load student details.'
    } finally {
      studentDetailsLoading.value = false
    }
  }

  function closeStudentDetails() {
    selectedStudent.value = null
    studentDetails.value = null
    studentDetailsError.value = ''
  }

  function formatSubmissionDate(date: string) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date))
  }

  watch(classId, refreshAnnouncements, { immediate: true })
  watch(classId, closeStudentDetails)
</script>

<template>
  <section class="coach-home">
    <header class="welcome-card">
      <p class="eyebrow">Welcome</p>
      <h1>Reading Coach</h1>
      <p class="subtext">
        Browse your classes and students, track reading progress, and manage forms and
        announcements.
      </p>
      <div class="actions">
        <NuxtLink to="/coach/builder" class="primary-btn">Open Form Builder</NuxtLink>
        <NuxtLink
          :to="{ path: '/coach/progress', query: classId ? { class: classId } : {} }"
          class="ghost-btn"
        >
          View Class Progress
        </NuxtLink>
      </div>
    </header>

    <article v-if="classId" class="stat-card">
      <p class="stat-label">Student join code</p>
      <div class="mt-2 flex flex-wrap items-center justify-between gap-4">
        <p class="font-mono text-2xl font-bold break-all text-slate-900">
          {{ hasFiveCharacterCode ? classId : 'Code update required' }}
        </p>
      </div>
    </article>

    <section class="class-browser">
      <div class="section-heading">
        <div>
          <h2>My Classes</h2>
          <p>Choose a class to view its students and progress.</p>
        </div>
        <span v-if="selectedClass" class="selected-class-label">
          Managing {{ selectedClass.name }}
        </span>
      </div>

      <p v-if="classesLoading" class="section-message" role="status">Loading classes...</p>
      <p v-else-if="classesError" class="section-message error-message" role="alert">
        Could not load classes: {{ classesError.message }}
      </p>
      <p v-else-if="classOptions.length === 0" class="section-message">
        No classes are available for this account.
      </p>
      <div v-else class="class-grid">
        <NuxtLink
          v-for="classroom in classOptions"
          :key="classroom.joinToken"
          :to="{ path: '/coach', query: { class: classroom.joinToken } }"
          class="class-link"
          :class="{ active: classId === classroom.joinToken }"
        >
          <span class="class-link-label">Class</span>
          <strong>{{ classroom.name }}</strong>
          <span>{{ classId === classroom.joinToken ? 'Currently selected' : 'Open class →' }}</span>
        </NuxtLink>
      </div>
    </section>

    <div class="stats-grid">
      <article class="stat-card">
        <p class="stat-label">Published Forms</p>
        <p class="stat-value">{{ publishedForms.length }}</p>
      </article>
      <article class="stat-card">
        <p class="stat-label">Active Forms</p>
        <p class="stat-value">{{ activeForms }}</p>
      </article>
      <a
        v-if="classId"
        class="stat-card student-stat-card"
        href="#class-roster"
        aria-label="Jump to the selected class student roster"
      >
        <p class="stat-label">Students</p>
        <p class="stat-value">{{ students.length }}</p>
        <span>View roster →</span>
      </a>
      <article v-else class="stat-card">
        <p class="stat-label">Students</p>
        <p class="stat-value">{{ students.length }}</p>
      </article>
      <article class="stat-card">
        <p class="stat-label">Active Announcements</p>
        <p class="stat-value">{{ activeAnnouncements }}</p>
      </article>
    </div>

    <section v-if="classId" id="class-roster" class="roster-card">
      <div class="section-heading">
        <div>
          <h2>{{ selectedClass?.name || 'Selected class' }} students</h2>
          <p>Select a student's name to review their class activity.</p>
        </div>
        <NuxtLink
          :to="{ path: '/coach/progress', query: { class: classId } }"
          class="roster-progress-link"
        >
          View full progress
        </NuxtLink>
      </div>

      <p v-if="studentsLoading" class="section-message" role="status">Loading students...</p>
      <p v-else-if="studentsError" class="section-message error-message" role="alert">
        Could not load students: {{ studentsError }}
      </p>
      <p v-else-if="students.length === 0" class="section-message">
        No students are enrolled in this class yet.
      </p>
      <div v-else class="roster-list">
        <button
          v-for="student in students"
          :key="student.id"
          type="button"
          class="roster-student"
          @click="openStudentDetails(student)"
        >
          <span class="student-initials">{{ student.initials }}</span>
          <span class="student-information">
            <strong>{{ student.name }}</strong>
            <span>{{ student.exp }} experience</span>
          </span>
          <span class="student-open-label">View details →</span>
        </button>
      </div>
    </section>
  </section>

  <Teleport to="body">
    <div v-if="selectedStudent" class="student-detail-backdrop" @click.self="closeStudentDetails">
      <section
        class="student-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-detail-title"
      >
        <header class="student-detail-header">
          <div>
            <p class="eyebrow">Student in {{ studentDetails?.className || selectedClass?.name }}</p>
            <h2 id="student-detail-title">{{ studentDetails?.name || selectedStudent.name }}</h2>
          </div>
          <button
            type="button"
            class="student-detail-close"
            aria-label="Close student details"
            @click="closeStudentDetails"
          >
            ×
          </button>
        </header>

        <p v-if="studentDetailsLoading" class="section-message" role="status">
          Loading student details...
        </p>
        <p v-else-if="studentDetailsError" class="section-message error-message" role="alert">
          Could not load student details: {{ studentDetailsError }}
        </p>
        <div v-else-if="studentDetails" class="student-detail-content">
          <div class="student-detail-stats">
            <div>
              <span>Class</span>
              <strong>{{ studentDetails.className }}</strong>
            </div>
            <div>
              <span>Experience</span>
              <strong>{{ studentDetails.experience }}</strong>
            </div>
            <div>
              <span>Form submissions</span>
              <strong>{{ studentDetails.submissions.length }}</strong>
            </div>
          </div>

          <h3>Recent form submissions</h3>
          <div v-if="studentDetails.submissions.length" class="submission-list">
            <article
              v-for="submission in studentDetails.submissions"
              :key="submission.id"
              class="submission-row"
            >
              <strong>{{ submission.form }}</strong>
              <span>{{ formatSubmissionDate(submission.submittedAt) }}</span>
            </article>
          </div>
          <p v-else class="section-message">No form submissions are available for this class.</p>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
  @import './styles/index.css';

  .class-browser,
  .roster-card {
    padding: 1.25rem;
    margin-top: 1rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
  }

  .section-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .section-heading h2 {
    margin: 0;
    color: #0f172a;
    font-size: 1.1rem;
  }

  .section-heading p {
    margin: 0.25rem 0 0;
    color: #64748b;
    font-size: 0.8rem;
  }

  .selected-class-label,
  .class-link-label {
    color: #64748b;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .class-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 0.75rem;
  }

  .class-link {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.65rem;
    color: #475569;
    text-decoration: none;
  }

  .class-link:hover,
  .class-link.active {
    background: #eef2ff;
    border-color: #a5b4fc;
  }

  .class-link strong {
    color: #1e293b;
    font-size: 0.95rem;
  }

  .class-link > span:last-child {
    color: #4f46e5;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .section-message {
    margin: 0;
    padding: 1rem;
    color: #64748b;
    font-size: 0.8rem;
    text-align: center;
  }

  .error-message {
    color: #b91c1c;
  }

  .student-stat-card {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  .student-stat-card > span {
    display: inline-block;
    margin-top: 0.5rem;
    color: #4f46e5;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .student-stat-card:hover {
    border-color: #a5b4fc;
  }

  .roster-progress-link {
    color: #4f46e5;
    font-size: 0.76rem;
    font-weight: 700;
    text-decoration: none;
  }

  .roster-list {
    display: grid;
    gap: 0.5rem;
  }

  .roster-student {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.6rem;
    cursor: pointer;
    text-align: left;
  }

  .roster-student:hover {
    background: #f8fafc;
    border-color: #c7d2fe;
  }

  .student-initials {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    flex: 0 0 auto;
    background: #eef2ff;
    border-radius: 50%;
    color: #4338ca;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .student-information {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.15rem;
  }

  .student-information strong {
    color: #1e293b;
    font-size: 0.82rem;
  }

  .student-information span,
  .student-open-label {
    color: #64748b;
    font-size: 0.72rem;
  }

  .student-open-label {
    color: #4f46e5;
    font-weight: 700;
  }

  .student-detail-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: rgb(15 23 42 / 45%);
  }

  .student-detail-modal {
    width: 100%;
    max-width: 38rem;
    max-height: calc(100vh - 3rem);
    overflow: auto;
    padding: 1.25rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.85rem;
    box-shadow: 0 20px 50px rgb(15 23 42 / 18%);
  }

  .student-detail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .student-detail-header .eyebrow {
    margin-bottom: 0.3rem;
  }

  .student-detail-header h2 {
    margin: 0;
    color: #1e293b;
    font-size: 1.15rem;
  }

  .student-detail-close {
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: 0;
    border-radius: 0.4rem;
    color: #64748b;
    cursor: pointer;
    font-size: 1.3rem;
  }

  .student-detail-close:hover {
    background: #f1f5f9;
  }

  .student-detail-content {
    padding-top: 1rem;
  }

  .student-detail-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.65rem;
  }

  .student-detail-stats > div {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.55rem;
  }

  .student-detail-stats span,
  .submission-row span {
    color: #64748b;
    font-size: 0.7rem;
  }

  .student-detail-stats strong,
  .submission-row strong {
    color: #1e293b;
    font-size: 0.8rem;
  }

  .student-detail-content h3 {
    margin: 1.2rem 0 0.65rem;
    color: #1e293b;
    font-size: 0.85rem;
  }

  .submission-list {
    display: grid;
    gap: 0.5rem;
  }

  .submission-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.55rem;
  }

  @media (max-width: 600px) {
    .coach-home {
      padding: 1rem;
    }

    .section-heading {
      flex-direction: column;
    }

    .student-detail-stats {
      grid-template-columns: 1fr;
    }

    .submission-row {
      flex-direction: column;
      gap: 0.25rem;
    }
  }
</style>
