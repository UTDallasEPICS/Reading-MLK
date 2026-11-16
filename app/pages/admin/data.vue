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
  submissions: Array<{ id: number; date: string; form: string; classId: string }>
}

type AdminDataResponse = {
  schools: string[]
  coaches: CoachRecord[]
  teachers: CoachRecord[]
  classes: ClassRecord[]
  students: StudentRecord[]
  totalStudents: number
}

const {
  data: explorerData,
  pending,
  error,
} = useFetch<AdminDataResponse>('/api/admin/data')

const activeTab = ref<DataTab>('Teachers')
const searchQuery = ref('')
const schoolFilter = ref('')
const selectedCoachId = ref<string | null>(null)
const selectedClassId = ref<string | null>(null)
const selectedStudentId = ref<number | null>(null)
const studentDetailsPanel = ref<HTMLElement | null>(null)

const coaches = computed(() => explorerData.value?.coaches ?? [])
const teachers = computed(() => explorerData.value?.teachers ?? [])
const classes = computed(() => explorerData.value?.classes ?? [])
const students = computed(() => explorerData.value?.students ?? [])
const schools = computed(() => explorerData.value?.schools ?? [])

const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase())
const selectedCoach = computed(() => coaches.value.find(coach => coach.id === selectedCoachId.value))
const selectedClass = computed(() => classes.value.find(classroom => classroom.id === selectedClassId.value))
const selectedStudent = computed(() => students.value.find(student => student.id === selectedStudentId.value))

const scopedStudents = computed(() => students.value.filter(student =>
  (!selectedCoachId.value || student.teachers.some(coach => coach.id === selectedCoachId.value)) &&
  (!selectedClassId.value || student.classes.some(classroom => classroom.id === selectedClassId.value))
))

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
      (!selectedCoachId.value || classroom.teachers.some(coach => coach.id === selectedCoachId.value)) &&
      matchesSchool(classroom.schools) &&
      matchesSearch([classroom.name, ...classTeacherNames(classroom), ...classroom.schools])
  )
)

const filteredStudents = computed(() =>
  scopedStudents.value.filter(
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
  selectedCoachId.value = null
  selectedClassId.value = null
  selectedStudentId.value = null
}

function openCoachDetails(id: string) {
  changeTab('Classes')
  schoolFilter.value = ''
  selectedCoachId.value = id
}

function openClassDetails(id: string) {
  const coachId = selectedCoachId.value
  changeTab('Students')
  schoolFilter.value = ''
  selectedClassId.value = id
  if (classes.value.find(classroom => classroom.id === id)?.teachers.some(coach => coach.id === coachId)) {
    selectedCoachId.value = coachId
  }
}

async function openStudentDetails(id: number) {
  selectedStudentId.value = selectedStudentId.value === id ? null : id
  await nextTick()
  studentDetailsPanel.value?.scrollIntoView({ block: 'nearest' })
}

function studentSubmissions(student: StudentRecord) {
  return selectedClassId.value
    ? student.submissions.filter(submission => submission.classId === selectedClassId.value)
    : student.submissions
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

      <div v-if="selectedCoach || selectedClass" class="drilldown-context">
        <span>Showing {{ activeTab.toLowerCase() }} for</span>
        <button v-if="selectedCoach" type="button" class="name-link" @click="openCoachDetails(selectedCoach.id)">
          {{ selectedCoach.name }}
        </button>
        <span v-if="selectedCoach && selectedClass">→</span>
        <strong v-if="selectedClass">{{ selectedClass.name }}</strong>
        <button type="button" class="name-link" @click="changeTab(activeTab)">Show all {{ activeTab.toLowerCase() }}</button>
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
              <td>{{ studentSubmissions(student).length }}</td>
            </tr>
          </tbody>
        </table>

        <section v-if="activeTab === 'Classes' && selectedCoach" class="inline-details">
          <h3>{{ selectedCoach.name }}</h3>
          <p>{{ roleLabel(selectedCoach.tag) }} · {{ selectedCoach.email }}</p>
          <p>{{ selectedCoach.school || 'No school provided' }} · {{ selectedCoach.district || 'No district provided' }} · {{ selectedCoach.zipcode || 'No ZIP code provided' }}</p>
          <p>{{ selectedCoach.classCount }} classes · {{ selectedCoach.studentCount }} students · {{ selectedCoach.formCount }} forms</p>
          <p v-if="selectedCoach.tag === 'teacher' || selectedCoach.tag === 'teacher_denied'">
            Verification: {{ selectedCoach.tag === 'teacher_denied' ? 'Denied' : selectedCoach.verified ? 'Verified' : 'Pending' }}
          </p>
        </section>

        <section v-if="activeTab === 'Students' && selectedClass" class="inline-details">
          <h3>{{ selectedClass.name }} forms</h3>
          <div class="detail-list">
            <article v-for="form in selectedClass.forms" :key="form.id" class="detail-row">
              <strong>{{ form.title }}</strong>
              <span>{{ form.published ? 'Published' : 'Draft' }} · {{ form.submissionCount }} submissions</span>
              <span>{{ formatDate(form.startDate) }} – {{ formatDate(form.endDate) }}</span>
            </article>
            <p v-if="selectedClass.forms.length === 0">No forms are linked to this class.</p>
          </div>
        </section>

        <section v-if="activeTab === 'Students' && selectedStudent" ref="studentDetailsPanel" class="inline-details">
          <h3>{{ selectedStudent.name }} — submissions</h3>
          <button type="button" class="name-link" @click="selectedStudentId = null">Close student details</button>
          <div class="detail-list">
            <article v-for="submission in studentSubmissions(selectedStudent)" :key="submission.id" class="detail-row">
              <strong>{{ submission.form }}</strong>
              <span>{{ formatSubmissionDate(submission.date) }}</span>
            </article>
            <p v-if="studentSubmissions(selectedStudent).length === 0">No form submissions are available.</p>
          </div>
        </section>

        <div v-if="currentRecordCount === 0" class="empty-state">
          No records match your search and school filters.
        </div>
      </div>
    </section>


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

.drilldown-context {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  padding: 0.8rem 1rem;
  background: #eef2ff;
  color: #475569;
  font-size: 0.8rem;
}

.inline-details {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #475569;
  font-size: 0.8rem;
}

.inline-details h3 { margin: 0 0 0.5rem; }
.detail-list { display: grid; gap: 0.5rem; margin-top: 0.75rem; }
.detail-row { display: grid; gap: 0.25rem; padding: 0.75rem; background: #f8fafc; }

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

}
</style>
