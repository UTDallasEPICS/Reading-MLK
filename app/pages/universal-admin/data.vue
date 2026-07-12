<script setup lang="ts">
definePageMeta({
  ssr: false,
  layout: 'universal-admin',
})

useHead({
  title: 'Universal Admin Data',
})

type DataTab = 'Posters' | 'Teachers' | 'Classes' | 'Students'

type EditableRecord = {
  type: DataTab
  data: Record<string, string | number | boolean>
}

const activeTab = ref<DataTab>('Teachers')
const searchQuery = ref('')
const editModalOpen = ref(false)
const selectedRecord = ref<EditableRecord | null>(null)

const tabs: DataTab[] = [
  'Posters',
  'Teachers',
  'Classes',
  'Students',
]

const posters = ref([
  {
    name: 'Ms. Smith English',
    role: 'Teacher',
    school: 'Lincoln High School',
    district: 'Metro District',
    forms: 42,
  },
  {
    name: 'Downtown Youth Center',
    role: 'Study Group',
    school: 'N/A',
    district: 'Suburban District',
    forms: 8,
  },
  {
    name: 'Reading Huddle Events',
    role: 'Other',
    school: 'N/A',
    district: 'Metro District',
    forms: 3,
  },
])

const teachers = ref([
  {
    name: 'Sarah Jenkins',
    school: 'Lincoln High School',
    district: 'Metro District',
    classes: 3,
    verified: true,
  },
  {
    name: 'David Ross',
    school: 'Independent Tutor',
    district: 'N/A',
    classes: 1,
    verified: false,
  },
  {
    name: 'Anita Patel',
    school: 'Jefferson Middle School',
    district: 'Metro District',
    classes: 4,
    verified: true,
  },
  {
    name: 'Michael Chen',
    school: 'Lincoln High School',
    district: 'Metro District',
    classes: 2,
    verified: true,
  },
])

const classes = ref([
  {
    name: 'Honors English 9',
    teacher: 'Sarah Jenkins',
    school: 'Lincoln High School',
    students: 28,
  },
  {
    name: 'AP Literature',
    teacher: 'Sarah Jenkins',
    school: 'Lincoln High School',
    students: 15,
  },
  {
    name: 'Reading Intervention',
    teacher: 'David Ross',
    school: 'Independent Tutor',
    students: 8,
  },
  {
    name: 'World History',
    teacher: 'Anita Patel',
    school: 'Jefferson Middle School',
    students: 32,
  },
])

const students = ref([
  {
    name: 'Ava Johnson',
    className: 'Honors English 9',
    teacher: 'Sarah Jenkins',
    readingLevel: 'Level B',
  },
  {
    name: 'Noah Williams',
    className: 'AP Literature',
    teacher: 'Sarah Jenkins',
    readingLevel: 'Level E',
  },
  {
    name: 'Mia Garcia',
    className: 'Reading Intervention',
    teacher: 'David Ross',
    readingLevel: 'Level A',
  },
  {
    name: 'Liam Brown',
    className: 'World History',
    teacher: 'Anita Patel',
    readingLevel: 'Level C',
  },
])

const normalizedSearch = computed(() =>
  searchQuery.value.trim().toLowerCase(),
)

const filteredPosters = computed(() =>
  posters.value.filter((poster) => {
    const searchable = [
      poster.name,
      poster.role,
      poster.school,
      poster.district,
    ]
      .join(' ')
      .toLowerCase()

    return searchable.includes(normalizedSearch.value)
  }),
)

const filteredTeachers = computed(() =>
  teachers.value.filter((teacher) => {
    const searchable = [
      teacher.name,
      teacher.school,
      teacher.district,
    ]
      .join(' ')
      .toLowerCase()

    return searchable.includes(normalizedSearch.value)
  }),
)

const filteredClasses = computed(() =>
  classes.value.filter((classroom) => {
    const searchable = [
      classroom.name,
      classroom.teacher,
      classroom.school,
    ]
      .join(' ')
      .toLowerCase()

    return searchable.includes(normalizedSearch.value)
  }),
)

const filteredStudents = computed(() =>
  students.value.filter((student) => {
    const searchable = [
      student.name,
      student.className,
      student.teacher,
      student.readingLevel,
    ]
      .join(' ')
      .toLowerCase()

    return searchable.includes(normalizedSearch.value)
  }),
)

const currentRecordCount = computed(() => {
  if (activeTab.value === 'Posters') {
    return filteredPosters.value.length
  }

  if (activeTab.value === 'Teachers') {
    return filteredTeachers.value.length
  }

  if (activeTab.value === 'Classes') {
    return filteredClasses.value.length
  }

  return filteredStudents.value.length
})

function changeTab(tab: DataTab) {
  activeTab.value = tab
  searchQuery.value = ''
}

function openEditModal(
  type: DataTab,
  data: Record<string, string | number | boolean>,
) {
  selectedRecord.value = {
    type,
    data: { ...data },
  }

  editModalOpen.value = true
}

function closeEditModal() {
  editModalOpen.value = false
  selectedRecord.value = null
}

function saveEdit() {
  if (!selectedRecord.value) {
    return
  }

  const { type, data } = selectedRecord.value

  if (type === 'Posters') {
    const index = posters.value.findIndex(
      poster => poster.name === data.name,
    )

    if (index !== -1) {
      posters.value[index] = {
        name: String(data.name),
        role: String(data.role),
        school: String(data.school),
        district: String(data.district),
        forms: Number(data.forms),
      }
    }
  }

  if (type === 'Teachers') {
    const index = teachers.value.findIndex(
      teacher => teacher.name === data.name,
    )

    if (index !== -1) {
      teachers.value[index] = {
        name: String(data.name),
        school: String(data.school),
        district: String(data.district),
        classes: Number(data.classes),
        verified: Boolean(data.verified),
      }
    }
  }

  if (type === 'Classes') {
    const index = classes.value.findIndex(
      classroom => classroom.name === data.name,
    )

    if (index !== -1) {
      classes.value[index] = {
        name: String(data.name),
        teacher: String(data.teacher),
        school: String(data.school),
        students: Number(data.students),
      }
    }
  }

  if (type === 'Students') {
    const index = students.value.findIndex(
      student => student.name === data.name,
    )

    if (index !== -1) {
      students.value[index] = {
        name: String(data.name),
        className: String(data.className),
        teacher: String(data.teacher),
        readingLevel: String(data.readingLevel),
      }
    }
  }

  closeEditModal()
}
</script>

<template>
  <div class="data-page">
    <section class="page-heading">
        <h2>Universal Data Explorer</h2>

        <span class="record-summary">
            {{ currentRecordCount }}
            {{ activeTab.toLowerCase() }}
        </span>
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
          {{ tab }}
        </button>
      </div>

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
            :placeholder="`Search ${activeTab.toLowerCase()}...`"
          >
        </div>

        <select class="filter-select">
          <option>All Schools</option>
          <option>Lincoln High School</option>
          <option>Jefferson Middle School</option>
          <option>Independent Tutor</option>
        </select>

        <select
          v-if="activeTab === 'Posters' || activeTab === 'Teachers'"
          class="filter-select"
        >
          <option>All Roles</option>
          <option>Teacher</option>
          <option>Study Group</option>
          <option>Other</option>
        </select>
      </div>

      <div class="table-wrapper">
        <table v-if="activeTab === 'Posters'">
          <thead>
            <tr>
              <th>Poster Name</th>
              <th>Role</th>
              <th>School</th>
              <th>District</th>
              <th>Forms Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="poster in filteredPosters"
              :key="poster.name"
            >
              <td>
                <strong>{{ poster.name }}</strong>
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="{
                    teacher: poster.role === 'Teacher',
                    group: poster.role === 'Study Group',
                    other: poster.role === 'Other',
                  }"
                >
                  {{ poster.role }}
                </span>
              </td>

              <td>{{ poster.school }}</td>
              <td>{{ poster.district }}</td>
              <td>{{ poster.forms }}</td>

              <td>
                <button
                  type="button"
                  class="edit-button"
                  @click="openEditModal('Posters', poster)"
                >
                  Edit
                </button>
              </td>
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="teacher in filteredTeachers"
              :key="teacher.name"
            >
              <td>
                <strong>{{ teacher.name }}</strong>
              </td>

              <td>{{ teacher.school }}</td>
              <td>{{ teacher.district }}</td>
              <td>{{ teacher.classes }}</td>

              <td>
                <span
                  class="verification-badge"
                  :class="{ pending: !teacher.verified }"
                >
                  {{ teacher.verified ? 'Verified' : 'Pending' }}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  class="edit-button"
                  @click="openEditModal('Teachers', teacher)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-else-if="activeTab === 'Classes'">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Teacher</th>
              <th>School</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="classroom in filteredClasses"
              :key="classroom.name"
            >
              <td>
                <strong>{{ classroom.name }}</strong>
              </td>

              <td>{{ classroom.teacher }}</td>
              <td>{{ classroom.school }}</td>
              <td>{{ classroom.students }}</td>

              <td>
                <button
                  type="button"
                  class="edit-button"
                  @click="openEditModal('Classes', classroom)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-else>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Class</th>
              <th>Teacher</th>
              <th>Reading Level</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="student in filteredStudents"
              :key="student.name"
            >
              <td>
                <strong>{{ student.name }}</strong>
              </td>

              <td>{{ student.className }}</td>
              <td>{{ student.teacher }}</td>
              <td>{{ student.readingLevel }}</td>

              <td>
                <button
                  type="button"
                  class="edit-button"
                  @click="openEditModal('Students', student)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="currentRecordCount === 0"
          class="empty-state"
        >
          No matching records found.
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="editModalOpen && selectedRecord"
        class="modal-backdrop"
        @click.self="closeEditModal"
      >
        <section
          class="edit-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div class="modal-header">
            <div>
              <h2 id="edit-modal-title">
                Edit {{ selectedRecord.type.slice(0, -1) }}
              </h2>

              <p>
                Update the selected record. These changes are currently
                stored only in the page UI.
              </p>
            </div>

            <button
              type="button"
              class="close-button"
              aria-label="Close edit modal"
              @click="closeEditModal"
            >
              ×
            </button>
          </div>

          <div class="modal-fields">
            <label
              v-for="(_, key) in selectedRecord.data"
              :key="String(key)"
            >
              <span>
                {{
                  String(key)
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, character => character.toUpperCase())
                }}
              </span>

              <select
                v-if="typeof selectedRecord.data[key] === 'boolean'"
                v-model="selectedRecord.data[key]"
              >
                <option :value="true">
                  Verified
                </option>

                <option :value="false">
                  Pending
                </option>
              </select>

              <select
                v-else-if="key === 'role'"
                v-model="selectedRecord.data[key]"
              >
                <option value="Teacher">
                  Teacher
                </option>

                <option value="Study Group">
                  Study Group
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              <input
                v-else
                v-model="selectedRecord.data[key]"
                :type="
                  typeof selectedRecord.data[key] === 'number'
                    ? 'number'
                    : 'text'
                "
              >
            </label>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="secondary-button"
              @click="closeEditModal"
            >
              Cancel
            </button>

            <button
              type="button"
              class="primary-button"
              @click="saveEdit"
            >
              Save Changes
            </button>
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
  max-width: 72rem;
  margin: 0 auto;
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
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.data-card {
  height: calc(100% - 3.5rem);
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
  height: calc(100% - 7.8rem);
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

.verification-badge {
  background: #dcfce7;
  color: #15803d;
}

.verification-badge.pending {
  background: #fef3c7;
  color: #b45309;
}

.edit-button {
  padding: 0.4rem 0.7rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.45rem;
  color: #4f46e5;
  cursor: pointer;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 700;
}

.edit-button:hover {
  background: #eef2ff;
  border-color: #a5b4fc;
}

.empty-state {
  padding: 3rem 1rem;
  color: #94a3b8;
  font-size: 0.82rem;
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

.edit-modal {
  width: 100%;
  max-width: 34rem;
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

.modal-fields {
  display: grid;
  gap: 1rem;
  padding: 1rem 0;
}

.modal-fields label {
  display: grid;
  gap: 0.4rem;
}

.modal-fields label span {
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
}

.modal-fields input,
.modal-fields select {
  width: 100%;
  padding: 0.65rem 0.75rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  color: #1e293b;
  font: inherit;
  font-size: 0.78rem;
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
  border-top: 1px solid #e2e8f0;
}

.secondary-button,
.primary-button {
  padding: 0.6rem 0.9rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
}

.secondary-button {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.primary-button {
  background: #4f46e5;
  border: 1px solid #4f46e5;
  color: #ffffff;
}

.secondary-button:hover {
  background: #f8fafc;
}

.primary-button:hover {
  background: #4338ca;
  border-color: #4338ca;
}

@media (max-width: 900px) {
  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .search-field,
  .filter-select {
    width: 100%;
    min-width: 0;
  }

  .data-card {
    height: auto;
  }

  .table-wrapper {
    height: auto;
    overflow-x: auto;
  }
}
</style>