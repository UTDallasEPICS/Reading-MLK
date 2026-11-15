<script setup lang="ts">
  definePageMeta({
    ssr: false,
    layout: 'admin',
  })

  useHead({
    title: 'Admin Data',
  })

  type DataTab = 'Coach' | 'Teachers' | 'Classes' | 'Students'

  type CoachRecord = {
    id: string
    name: string
    email: string
    tag: string
    verified: boolean
    school: string
    district: string
    zipcode: string
    classes: Array<{ id: string; name: string }>
    classCount: number
    studentCount: number
    formCount: number
  }

  type ClassRecord = {
    id: string
    name: string
    teachers: Array<{ id: string; name: string; tag: string; school: string }>
    schools: string[]
    students: Array<{ id: number; name: string; exp: number }>
    forms: Array<{
      id: number
      title: string
      published: boolean
      startDate: string
      endDate: string | null
      submissionCount: number
    }>
  }

  type StudentRecord = {
    id: number
    name: string
    exp: number
    classes: Array<{ id: string; name: string }>
    teachers: Array<{ id: string; name: string; tag: string; school: string }>
    schools: string[]
    submissions: Array<{ id: number; date: string; form: string }>
  }

  type AdminDataResponse = {
    schools: string[]
    coaches: CoachRecord[]
    teachers: CoachRecord[]
    classes: ClassRecord[]
    students: StudentRecord[]
    totalStudents: number
  }

  type DetailTarget =
    | { type: 'coach'; id: string }
    | { type: 'class'; id: string }
    | { type: 'student'; id: number }

  type CoachDetailTab = 'Profile' | 'Classes' | 'Students'
  type ClassDetailTab = 'Overview' | 'Students' | 'Forms'

  const {
    data: explorerData,
    pending,
    error,
  } = await useFetch<AdminDataResponse>('/api/admin/data')

  const activeTab = ref<DataTab>('Teachers')
  const searchQuery = ref('')
  const schoolFilter = ref('')
  const detailStack = ref<DetailTarget[]>([])
  const coachDetailTab = ref<CoachDetailTab>('Profile')
  const classDetailTab = ref<ClassDetailTab>('Overview')

  const coaches = computed(() => explorerData.value?.coaches ?? [])
  const teachers = computed(() => explorerData.value?.teachers ?? [])
  const classes = computed(() => explorerData.value?.classes ?? [])
  const students = computed(() => explorerData.value?.students ?? [])
  const schools = computed(() => explorerData.value?.schools ?? [])

  const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase())
  const currentDetail = computed(() => detailStack.value.at(-1) ?? null)
  const detailCoach = computed(() =>
    currentDetail.value?.type === 'coach'
      ? (coaches.value.find((coach) => coach.id === currentDetail.value?.id) ?? null)
      : null
  )
  const detailClass = computed(() =>
    currentDetail.value?.type === 'class'
      ? (classes.value.find((classroom) => classroom.id === currentDetail.value?.id) ?? null)
      : null
  )
  const detailStudent = computed(() =>
    currentDetail.value?.type === 'student'
      ? (students.value.find((student) => student.id === currentDetail.value?.id) ?? null)
      : null
  )

  const coachStudents = computed(() => {
    if (!detailCoach.value) {
      return []
    }

    return students.value.filter((student) =>
      student.teachers.some((teacher) => teacher.id === detailCoach.value?.id)
    )
  })

  const schoolFilteredStudents = computed(() =>
    schoolFilter.value
      ? students.value.filter((student) => student.schools.includes(schoolFilter.value))
      : students.value
  )

  const totalStudentCount = computed(() =>
    schoolFilter.value
      ? schoolFilteredStudents.value.length
      : (explorerData.value?.totalStudents ?? 0)
  )

  function matchesSearch(values: Array<string | number>) {
    return values.join(' ').toLowerCase().includes(normalizedSearch.value)
  }

  function matchesSchool(values: string[]) {
    return !schoolFilter.value || values.includes(schoolFilter.value)
  }

  function coachSchoolNames(coach: CoachRecord) {
    return coach.school ? [coach.school] : []
  }

  function classTeacherNames(classroom: ClassRecord) {
    return classroom.teachers.map((teacher) => teacher.name)
  }

  const filteredCoach = computed(() =>
    coaches.value.filter(
      (coach) =>
        matchesSchool(coachSchoolNames(coach)) &&
        matchesSearch([coach.name, coach.tag, coach.school, coach.district, coach.email])
    )
  )

  const filteredTeachers = computed(() =>
    teachers.value.filter(
      (teacher) =>
        matchesSchool(coachSchoolNames(teacher)) &&
        matchesSearch([teacher.name, teacher.school, teacher.district, teacher.email])
    )
  )

  const filteredClasses = computed(() =>
    classes.value.filter(
      (classroom) =>
        matchesSchool(classroom.schools) &&
        matchesSearch([classroom.name, ...classTeacherNames(classroom), ...classroom.schools])
    )
  )

  const filteredStudents = computed(() =>
    students.value.filter(
      (student) =>
        matchesSchool(student.schools) &&
        matchesSearch([
          student.name,
          ...student.classes.map((classroom) => classroom.name),
          ...student.teachers.map((teacher) => teacher.name),
        ])
    )
  )

  const currentRecordCount = computed(() => {
    if (activeTab.value === 'Coach') {
      return filteredCoach.value.length
    }

    if (activeTab.value === 'Teachers') {
      return filteredTeachers.value.length
    }

    if (activeTab.value === 'Classes') {
      return filteredClasses.value.length
    }

    return filteredStudents.value.length
  })

  const currentRecordsLabel = computed(() => {
    const label = getTabLabel(activeTab.value).toLowerCase()
    return `${currentRecordCount.value} ${label}`
  })

  const requestError = computed(() => error.value?.message ?? '')

  function roleLabel(tag: string) {
    const labels: Record<string, string> = {
      teacher: 'Teacher',
      teacher_denied: 'Teacher (Denied)',
      personal: 'Personal',
      studygroup: 'Study Group',
      other: 'Other',
    }

    return labels[tag] ?? tag
  }

  function changeTab(tab: DataTab) {
    activeTab.value = tab
    searchQuery.value = ''
  }

  function openCoachDetails(id: string) {
    coachDetailTab.value = 'Profile'
    detailStack.value = [{ type: 'coach', id }]
  }

  function openClassDetails(id: string) {
    classDetailTab.value = 'Overview'
    detailStack.value.push({ type: 'class', id })
  }

  function openStudentDetails(id: number) {
    detailStack.value.push({ type: 'student', id })
  }

  function goBackInDetails() {
    detailStack.value.pop()
  }

  function closeDetails() {
    detailStack.value = []
  }

  function formatDate(date: string | null) {
    if (!date) {
      return 'No end date'
    }

    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date))
  }

  function formatSubmissionDate(date: string) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date))
  }

  const tabs: DataTab[] = ['Coach', 'Teachers', 'Classes', 'Students']
  const coachDetailTabs: CoachDetailTab[] = ['Profile', 'Classes', 'Students']
  const classDetailTabs: ClassDetailTab[] = ['Overview', 'Students', 'Forms']

  function getTabLabel(tab: DataTab) {
    return tab === 'Coach' ? 'Reading Coach' : tab
  }
</script>

<template>
  <div class="data-page">
    <section class="page-heading">
      <div>
        <h2>Universal Data Explorer</h2>
        <span class="record-summary">{{ currentRecordsLabel }}</span>
      </div>

      <div class="student-total" aria-live="polite">
        <strong>{{ totalStudentCount }}</strong>
        <span>{{ schoolFilter || 'All schools' }} · total students</span>
      </div>
    </section>

    <section class="data-card">
      <div class="tab-navigation">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          class="tab-button"
          :class="{ active: activeTab === tab }"
          @click="changeTab(tab)"
        >
          {{ getTabLabel(tab) }}
        </button>
      </div>

      <div class="toolbar">
        <div class="search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>

          <input
            v-model="searchQuery"
            type="search"
            :placeholder="`Search ${getTabLabel(activeTab).toLowerCase()}...`"
          />
        </div>

        <label class="school-filter">
          <span>School</span>
          <select v-model="schoolFilter" class="filter-select">
            <option value="">All Schools</option>
            <option v-for="school in schools" :key="school" :value="school">
              {{ school }}
            </option>
          </select>
        </label>
      </div>

      <div v-if="pending" class="empty-state" role="status">Loading admin data...</div>

      <div v-else-if="requestError" class="empty-state error-state" role="alert">
        Could not load admin data: {{ requestError }}
      </div>

      <div v-else class="table-wrapper">
        <table v-if="activeTab === 'Coach'">
          <thead>
            <tr>
              <th>Reading Coach Name</th>
              <th>Role</th>
              <th>School</th>
              <th>District</th>
              <th>Classes</th>
              <th>Students</th>
              <th>Forms</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="coach in filteredCoach" :key="coach.id">
              <td>
                <button class="name-link" type="button" @click="openCoachDetails(coach.id)">
                  {{ coach.name }}
                </button>
              </td>
              <td>
                <span
                  class="status-badge"
                  :class="{
                    teacher: coach.tag === 'teacher',
                    group: coach.tag === 'studygroup',
                    other: coach.tag !== 'teacher' && coach.tag !== 'studygroup',
                  }"
                >
                  {{ roleLabel(coach.tag) }}
                </span>
              </td>
              <td>{{ coach.school || '—' }}</td>
              <td>{{ coach.district || '—' }}</td>
              <td>{{ coach.classCount }}</td>
              <td>{{ coach.studentCount }}</td>
              <td>{{ coach.formCount }}</td>
            </tr>
          </tbody>
        </table>

        <table v-else-if="activeTab === 'Teachers'">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>School</th>
              <th>District</th>
              <th>Classes</th>
              <th>Students</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="teacher in filteredTeachers" :key="teacher.id">
              <td>
                <button class="name-link" type="button" @click="openCoachDetails(teacher.id)">
                  {{ teacher.name }}
                </button>
              </td>
              <td>{{ teacher.school || '—' }}</td>
              <td>{{ teacher.district || '—' }}</td>
              <td>{{ teacher.classCount }}</td>
              <td>{{ teacher.studentCount }}</td>
              <td>
                <span class="verification-badge" :class="{ pending: !teacher.verified }">
                  {{ teacher.verified ? 'Verified' : 'Pending' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-else-if="activeTab === 'Classes'">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Teacher / Coach</th>
              <th>School</th>
              <th>Students</th>
              <th>Forms</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="classroom in filteredClasses" :key="classroom.id">
              <td>
                <button class="name-link" type="button" @click="openClassDetails(classroom.id)">
                  {{ classroom.name }}
                </button>
              </td>
              <td>
                <button
                  v-for="teacher in classroom.teachers"
                  :key="teacher.id"
                  class="inline-name-link"
                  type="button"
                  @click="openCoachDetails(teacher.id)"
                >
                  {{ teacher.name }}
                </button>
                <span v-if="classroom.teachers.length === 0">—</span>
              </td>
              <td>{{ classroom.schools.join(', ') || '—' }}</td>
              <td>{{ classroom.students.length }}</td>
              <td>{{ classroom.forms.length }}</td>
            </tr>
          </tbody>
        </table>

        <table v-else>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Class</th>
              <th>Teacher / Coach</th>
              <th>Experience</th>
              <th>Submissions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id">
              <td>
                <button class="name-link" type="button" @click="openStudentDetails(student.id)">
                  {{ student.name }}
                </button>
              </td>
              <td>
                <button
                  v-for="classroom in student.classes"
                  :key="classroom.id"
                  class="inline-name-link"
                  type="button"
                  @click="openClassDetails(classroom.id)"
                >
                  {{ classroom.name }}
                </button>
                <span v-if="student.classes.length === 0">—</span>
              </td>
              <td>
                <button
                  v-for="teacher in student.teachers"
                  :key="teacher.id"
                  class="inline-name-link"
                  type="button"
                  @click="openCoachDetails(teacher.id)"
                >
                  {{ teacher.name }}
                </button>
                <span v-if="student.teachers.length === 0">—</span>
              </td>
              <td>{{ student.exp }}</td>
              <td>{{ student.submissions.length }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="currentRecordCount === 0" class="empty-state">
          No records match your search and school filters.
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="currentDetail" class="modal-backdrop" @click.self="closeDetails">
        <section
          class="detail-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
        >
          <div class="modal-header">
            <div>
              <button
                v-if="detailStack.length > 1"
                class="back-button"
                type="button"
                @click="goBackInDetails"
              >
                ← Back
              </button>
              <h2 id="detail-modal-title">
                {{ detailCoach?.name || detailClass?.name || detailStudent?.name }}
              </h2>
              <p v-if="detailCoach">{{ roleLabel(detailCoach.tag) }} · {{ detailCoach.email }}</p>
              <p v-else-if="detailClass">Class details</p>
              <p v-else-if="detailStudent">Student details</p>
            </div>

            <button
              type="button"
              class="close-button"
              aria-label="Close details"
              @click="closeDetails"
            >
              ×
            </button>
          </div>

          <template v-if="detailCoach">
            <nav class="detail-tabs" aria-label="Teacher or coach details">
              <button
                v-for="tab in coachDetailTabs"
                :key="tab"
                type="button"
                :class="{ active: coachDetailTab === tab }"
                @click="coachDetailTab = tab"
              >
                {{ tab }}
              </button>
            </nav>

            <div v-if="coachDetailTab === 'Profile'" class="detail-content detail-grid">
              <div>
                <span>School</span><strong>{{ detailCoach.school || '—' }}</strong>
              </div>
              <div>
                <span>District</span><strong>{{ detailCoach.district || '—' }}</strong>
              </div>
              <div>
                <span>Zip code</span><strong>{{ detailCoach.zipcode || '—' }}</strong>
              </div>
              <div>
                <span>Verification</span
                ><strong>{{ detailCoach.verified ? 'Verified' : 'Pending' }}</strong>
              </div>
              <div>
                <span>Classes</span><strong>{{ detailCoach.classCount }}</strong>
              </div>
              <div>
                <span>Students</span><strong>{{ detailCoach.studentCount }}</strong>
              </div>
              <div>
                <span>Forms</span><strong>{{ detailCoach.formCount }}</strong>
              </div>
            </div>

            <div v-else-if="coachDetailTab === 'Classes'" class="detail-content detail-list">
              <button
                v-for="classroom in detailCoach.classes"
                :key="classroom.id"
                class="detail-row detail-row-button"
                type="button"
                @click="openClassDetails(classroom.id)"
              >
                <strong>{{ classroom.name }}</strong>
                <span
                  >{{
                    classes.find((item) => item.id === classroom.id)?.students.length ?? 0
                  }}
                  students</span
                >
                <span>View details →</span>
              </button>
              <p v-if="detailCoach.classes.length === 0" class="empty-state">
                No classes are linked to this account.
              </p>
            </div>

            <div v-else class="detail-content detail-list">
              <button
                v-for="student in coachStudents"
                :key="student.id"
                class="detail-row detail-row-button"
                type="button"
                @click="openStudentDetails(student.id)"
              >
                <strong>{{ student.name }}</strong>
                <span>{{
                  student.classes.map((classroom) => classroom.name).join(', ') || 'No class'
                }}</span>
                <span>View details →</span>
              </button>
              <p v-if="coachStudents.length === 0" class="empty-state">
                No students are linked to this account.
              </p>
            </div>
          </template>

          <template v-else-if="detailClass">
            <nav class="detail-tabs" aria-label="Class details">
              <button
                v-for="tab in classDetailTabs"
                :key="tab"
                type="button"
                :class="{ active: classDetailTab === tab }"
                @click="classDetailTab = tab"
              >
                {{ tab }}
              </button>
            </nav>

            <div v-if="classDetailTab === 'Overview'" class="detail-content detail-grid">
              <div>
                <span>School</span><strong>{{ detailClass.schools.join(', ') || '—' }}</strong>
              </div>
              <div>
                <span>Students</span><strong>{{ detailClass.students.length }}</strong>
              </div>
              <div>
                <span>Forms</span><strong>{{ detailClass.forms.length }}</strong>
              </div>
              <div class="detail-wide">
                <span>Teachers and reading coaches</span>
                <button
                  v-for="teacher in detailClass.teachers"
                  :key="teacher.id"
                  class="inline-name-link"
                  type="button"
                  @click="openCoachDetails(teacher.id)"
                >
                  {{ teacher.name }}
                </button>
                <strong v-if="detailClass.teachers.length === 0">None assigned</strong>
              </div>
            </div>

            <div v-else-if="classDetailTab === 'Students'" class="detail-content detail-list">
              <button
                v-for="student in detailClass.students"
                :key="student.id"
                class="detail-row detail-row-button"
                type="button"
                @click="openStudentDetails(student.id)"
              >
                <strong>{{ student.name }}</strong>
                <span>{{ student.exp }} experience</span>
                <span>View details →</span>
              </button>
              <p v-if="detailClass.students.length === 0" class="empty-state">
                No students are enrolled in this class.
              </p>
            </div>

            <div v-else class="detail-content detail-list">
              <article v-for="form in detailClass.forms" :key="form.id" class="detail-row">
                <strong>{{ form.title }}</strong>
                <span
                  >{{ form.published ? 'Published' : 'Draft' }} ·
                  {{ form.submissionCount }} submissions</span
                >
                <span>{{ formatDate(form.startDate) }} – {{ formatDate(form.endDate) }}</span>
              </article>
              <p v-if="detailClass.forms.length === 0" class="empty-state">
                No forms are linked to this class.
              </p>
            </div>
          </template>

          <div v-else-if="detailStudent" class="detail-content student-detail">
            <div class="detail-grid">
              <div>
                <span>Experience</span><strong>{{ detailStudent.exp }}</strong>
              </div>
              <div>
                <span>School</span><strong>{{ detailStudent.schools.join(', ') || '—' }}</strong>
              </div>
              <div>
                <span>Form submissions</span><strong>{{ detailStudent.submissions.length }}</strong>
              </div>
            </div>

            <h3>Classes</h3>
            <div class="detail-list">
              <button
                v-for="classroom in detailStudent.classes"
                :key="classroom.id"
                class="detail-row detail-row-button"
                type="button"
                @click="openClassDetails(classroom.id)"
              >
                <strong>{{ classroom.name }}</strong>
                <span>View class details →</span>
              </button>
              <p v-if="detailStudent.classes.length === 0" class="empty-state">
                This student is not assigned to a class.
              </p>
            </div>

            <h3>Recent form submissions</h3>
            <div class="detail-list">
              <article
                v-for="submission in detailStudent.submissions"
                :key="submission.id"
                class="detail-row"
              >
                <strong>{{ submission.form }}</strong>
                <span>{{ formatSubmissionDate(submission.date) }}</span>
              </article>
              <p v-if="detailStudent.submissions.length === 0" class="empty-state">
                No form submissions are available.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
  .data-page {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .page-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .page-heading h2 {
    margin: 0;
    color: #1e293b;
    font-size: 1.25rem;
  }

  .student-total {
    display: flex;
    align-items: baseline;
    gap: 0.55rem;
    padding: 0.65rem 0.85rem;
    background: #eef2ff;
    border: 1px solid #e0e7ff;
    border-radius: 0.65rem;
    color: #4338ca;
  }

  .student-total strong {
    font-size: 1.25rem;
  }

  .student-total span {
    font-size: 0.72rem;
    font-weight: 700;
  }

  .record-summary {
    display: block;
    margin-top: 0.25rem;
    color: #64748b;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .data-card {
    min-height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgb(15 23 42 / 5%);
  }

  .tab-navigation {
    display: flex;
    gap: 0.35rem;
    padding: 1rem 1rem 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .tab-button {
    padding: 0.55rem 0.9rem;
    background: transparent;
    border: 0;
    border-radius: 0.5rem;
    color: #64748b;
    cursor: pointer;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 700;
  }

  .tab-button:hover {
    background: #f8fafc;
    color: #334155;
  }

  .tab-button.active {
    background: #eef2ff;
    color: #4338ca;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .school-filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .search-field {
    min-width: 16rem;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.55rem 0.75rem;
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
    stroke: #94a3b8;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }

  .search-field input {
    width: 100%;
    padding: 0;
    background: transparent;
    border: 0;
    color: #1e293b;
    font: inherit;
    font-size: 0.78rem;
    outline: none;
  }

  .filter-select {
    min-width: 10rem;
    padding: 0.58rem 0.7rem;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    color: #475569;
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .filter-select:focus {
    border-color: #4f46e5;
    outline: none;
  }

  .table-wrapper {
    min-height: 0;
    flex: 1;
    overflow: auto;
    padding: 0 1rem 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.85rem 0.75rem;
    border-bottom: 1px solid #e2e8f0;
    text-align: left;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #ffffff;
    color: #64748b;
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  td {
    color: #475569;
    font-size: 0.76rem;
  }

  td strong {
    color: #1e293b;
  }

  tbody tr:hover {
    background: #f8fafc;
  }

  .status-badge,
  .verification-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.28rem 0.5rem;
    border-radius: 999px;
    font-size: 0.65rem;
    font-weight: 700;
  }

  .status-badge.teacher {
    background: #eef2ff;
    color: #4338ca;
  }

  .status-badge.group {
    background: #dcfce7;
    color: #15803d;
  }

  .status-badge.other {
    background: #f1f5f9;
    color: #475569;
  }

  .name-link,
  .inline-name-link {
    padding: 0;
    background: transparent;
    border: 0;
    color: #4338ca;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
    text-align: left;
  }

  .name-link:hover,
  .inline-name-link:hover {
    color: #312e81;
    text-decoration: underline;
  }

  .inline-name-link {
    display: block;
    margin: 0.15rem 0;
    font-size: 0.74rem;
  }

  .verification-badge {
    background: #dcfce7;
    color: #15803d;
  }

  .verification-badge.pending {
    background: #fef3c7;
    color: #b45309;
  }

  .empty-state {
    padding: 3rem 1rem;
    color: #94a3b8;
    font-size: 0.82rem;
    text-align: center;
  }

  .error-state {
    color: #b91c1c;
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

  .detail-modal {
    width: 100%;
    max-width: 46rem;
    max-height: calc(100vh - 3rem);
    overflow-y: auto;
    padding: 1.25rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.85rem;
    box-shadow: 0 20px 50px rgb(15 23 42 / 18%);
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .back-button {
    padding: 0 0 0.35rem;
    background: none;
    border: 0;
    color: #4f46e5;
    cursor: pointer;
    font: inherit;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .modal-header h2 {
    margin: 0;
    color: #1e293b;
    font-size: 1.05rem;
  }

  .modal-header p {
    margin: 0.25rem 0 0;
    color: #94a3b8;
    font-size: 0.75rem;
  }

  .detail-tabs {
    display: flex;
    gap: 0.35rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .detail-tabs button {
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: 0;
    border-radius: 0.45rem;
    color: #64748b;
    cursor: pointer;
    font: inherit;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .detail-tabs button.active {
    background: #eef2ff;
    color: #4338ca;
  }

  .detail-content {
    max-height: min(60vh, 34rem);
    overflow: auto;
    padding: 1rem 0 0;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .detail-grid > div {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.55rem;
  }

  .detail-grid span,
  .detail-row span {
    color: #64748b;
    font-size: 0.7rem;
  }

  .detail-grid strong,
  .detail-row strong {
    color: #1e293b;
    font-size: 0.8rem;
  }

  .detail-grid .detail-wide {
    grid-column: 1 / -1;
  }

  .detail-list {
    display: grid;
    gap: 0.5rem;
  }

  .detail-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 0.75rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.55rem;
  }

  .detail-row-button {
    width: 100%;
    cursor: pointer;
    text-align: left;
  }

  .detail-row-button:hover {
    background: #f8fafc;
    border-color: #c7d2fe;
  }

  .student-detail h3 {
    margin: 1.2rem 0 0;
    color: #1e293b;
    font-size: 0.85rem;
  }

  .student-detail .detail-list {
    padding-top: 0.5rem;
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

  @media (max-width: 900px) {
    .data-page {
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

    .school-filter {
      align-items: stretch;
      flex-direction: column;
    }

    .data-card {
      height: auto;
      overflow: visible;
    }

    .table-wrapper {
      height: auto;
      overflow-x: auto;
    }
  }

  @media (max-width: 550px) {
    .page-heading {
      align-items: flex-start;
      flex-direction: column;
    }

    .detail-grid {
      grid-template-columns: 1fr;
    }

    .detail-grid .detail-wide {
      grid-column: auto;
    }
  }
</style>
