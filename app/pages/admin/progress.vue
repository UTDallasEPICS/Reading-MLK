<script setup lang="ts">
definePageMeta({ ssr: false, layout: 'admin' })

type ProgressRecord = {
  id: number
  studentId: number
  studentName: string
  formGroupId: number
  formGroupLabel: string
  formGroupStartDate: string
  formId: number
  formTitle: string
  dateCompleted: string
  dateCompletedYmd: string
}

type GroupedStudentRecord = {
  studentId: number
  studentName: string
  formsCompleted: number
  lastSubmitted: string
  lastSubmittedYmd: string
}

type MissingStudentRecord = {
  studentId: number
  studentName: string
  missingFormsCount: number
  missingForms: string[]
  lastSubmitted: string
  lastSubmittedYmd: string
}

type RecordSortKey = 'studentName' | 'formGroupLabel' | 'formTitle' | 'dateCompleted'
type GroupSortKey = 'studentName' | 'formsCompleted' | 'lastSubmitted'
type MissingSortKey = 'studentName' | 'missingFormsCount' | 'lastSubmitted'

type ApiResponse =
  | {
      mode: 'records'
      rows: ProgressRecord[]
      totalCount: number
      totalPages: number
      page: number
      pageSize: number
    }
  | {
      mode: 'grouped'
      rows: GroupedStudentRecord[]
      totalCount: number
      totalPages: number
      page: number
      pageSize: number
    }
  | {
      mode: 'missing'
      rows: MissingStudentRecord[]
      totalCount: number
      totalPages: number
      page: number
      pageSize: number
    }

// Reactive State Management
const searchStudent = ref('')
const selectedDate = ref('')
const selectedFormIds = ref<number[]>([])
const viewMode = ref<'completed' | 'missing'>('completed')
const groupByStudent = ref(false)

const recordSortKey = ref<RecordSortKey | null>(null)
const recordSortDirection = ref<'asc' | 'desc' | null>(null)

const groupedSortKey = ref<GroupSortKey | null>(null)
const groupedSortDirection = ref<'asc' | 'desc' | null>(null)

const missingSortKey = ref<MissingSortKey | null>(null)
const missingSortDirection = ref<'asc' | 'desc' | null>(null)

const currentPage = ref(1)
const pageSize = ref(10)

const loading = ref(false)

const visibleRecords = ref<ProgressRecord[]>([])
const visibleGroupedRecords = ref<GroupedStudentRecord[]>([])
const visibleMissingRecords = ref<MissingStudentRecord[]>([])

const totalCount = ref(0)
const totalPages = ref(1)

const allWeekRecords = ref<ProgressRecord[]>([])

const availableForms = computed(() => {
  const uniqueForms = new Map<number, { id: number; title: string }>()

  for (const record of allWeekRecords.value) {
    if (!uniqueForms.has(record.formId)) {
      uniqueForms.set(record.formId, {
        id: record.formId,
        title: record.formTitle,
      })
    }
  }

  return Array.from(uniqueForms.values()).sort((a, b) =>
    a.title.localeCompare(b.title)
  )
})

// User Interaction Handlers
function toggleFormSelection(formId: number) {
  if (selectedFormIds.value.includes(formId)) {
    selectedFormIds.value = selectedFormIds.value.filter((id) => id !== formId)
    return
  }

  selectedFormIds.value = [...selectedFormIds.value, formId]
}

function toggleRecordSort(key: RecordSortKey) {
  if (recordSortKey.value !== key) {
    recordSortKey.value = key
    recordSortDirection.value = 'asc'
    return
  }

  if (recordSortDirection.value === 'asc') {
    recordSortDirection.value = 'desc'
    return
  }

  recordSortKey.value = null
  recordSortDirection.value = null
}

function toggleGroupedSort(key: GroupSortKey) {
  if (groupedSortKey.value !== key) {
    groupedSortKey.value = key
    groupedSortDirection.value = 'asc'
    return
  }

  if (groupedSortDirection.value === 'asc') {
    groupedSortDirection.value = 'desc'
    return
  }

  groupedSortKey.value = null
  groupedSortDirection.value = null
}

function toggleMissingSort(key: MissingSortKey) {
  if (missingSortKey.value !== key) {
    missingSortKey.value = key
    missingSortDirection.value = 'asc'
    return
  }

  if (missingSortDirection.value === 'asc') {
    missingSortDirection.value = 'desc'
    return
  }

  missingSortKey.value = null
  missingSortDirection.value = null
}

// Generic helper to generate sort arrows for column headers
function getSortIndicator(
  key: string,
  currentKey: string | null,
  currentDirection: 'asc' | 'desc' | null
) {
  if (currentKey !== key) return '↕'
  if (currentDirection === 'asc') return '↑'
  if (currentDirection === 'desc') return '↓'
  return '↕'
}

const activeSortKey = computed(() => {
  if (viewMode.value === 'missing') return missingSortKey.value
  return groupByStudent.value ? groupedSortKey.value : recordSortKey.value
})

const activeSortDirection = computed(() => {
  if (viewMode.value === 'missing') return missingSortDirection.value
  return groupByStudent.value ? groupedSortDirection.value : recordSortDirection.value
})

// API Data Fetching
async function loadWeekForms() {
  if (!selectedDate.value) {
    allWeekRecords.value = []
    return
  }

  const response = await $fetch<ApiResponse>('/api/admin/class-progress', {
    method: 'GET',
    query: {
      date: selectedDate.value,
      mode: 'completed',
      page: 1,
      pageSize: 1000,
    },
  })

  if (response.mode === 'records') {
    allWeekRecords.value = response.rows
  } else {
    allWeekRecords.value = []
  }
}

async function loadClassProgress() {
  loading.value = true

  try {
    const response = await $fetch<ApiResponse>('/api/admin/class-progress', {
      method: 'GET',
      query: {
        mode: viewMode.value,
        date: selectedDate.value || undefined,
        formIds: selectedFormIds.value.length > 0 ? selectedFormIds.value.join(',') : undefined,
        search: searchStudent.value.trim() || undefined,
        groupByStudent: viewMode.value === 'completed' && groupByStudent.value ? 'true' : 'false',
        sortKey: activeSortKey.value || undefined,
        sortDirection: activeSortDirection.value || undefined,
        page: currentPage.value,
        pageSize: pageSize.value,
      },
    })

    totalCount.value = response.totalCount
    totalPages.value = response.totalPages

    visibleRecords.value = []
    visibleGroupedRecords.value = []
    visibleMissingRecords.value = []

    if (response.mode === 'records') {
      visibleRecords.value = response.rows
    } else if (response.mode === 'grouped') {
      visibleGroupedRecords.value = response.rows
    } else {
      visibleMissingRecords.value = response.rows
    }
  } catch (error) {
    console.error('Failed to load class progress:', error)
    visibleRecords.value = []
    visibleGroupedRecords.value = []
    visibleMissingRecords.value = []
    totalCount.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

function escapeCsvValue(value: string | number) {
  const stringValue = String(value)
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csvContent = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// CSV Export Logic
async function exportCurrentTable() {
  try {
    const response = await $fetch<ApiResponse>('/api/admin/class-progress', {
      method: 'GET',
      query: {
        mode: viewMode.value,
        date: selectedDate.value || undefined,
        formIds: selectedFormIds.value.length > 0 ? selectedFormIds.value.join(',') : undefined,
        search: searchStudent.value.trim() || undefined,
        groupByStudent: viewMode.value === 'completed' && groupByStudent.value ? 'true' : 'false',
        sortKey: activeSortKey.value || undefined,
        sortDirection: activeSortDirection.value || undefined,
        page: 1,
        pageSize: 100000,
      },
    })

    if (response.mode === 'grouped') {
      const rows: Array<Array<string | number>> = [
        ['Student Name', 'Forms Completed', 'Last Submitted'],
        ...response.rows.map((record) => [
          record.studentName,
          record.formsCompleted,
          record.lastSubmitted,
        ]),
      ]

      downloadCsv('class-progress-grouped.csv', rows)
      return
    }

    if (response.mode === 'missing') {
      const rows: Array<Array<string | number>> = [
        ['Student Name', 'Missing Forms Count', 'Missing Forms', 'Last Submitted'],
        ...response.rows.map((record) => [
          record.studentName,
          record.missingFormsCount,
          record.missingForms.join('; '),
          record.lastSubmitted,
        ]),
      ]

      downloadCsv('class-progress-missing.csv', rows)
      return
    }

    const rows: Array<Array<string | number>> = [
      ['Student Name', 'Form Group / Week', 'Specific Form', 'Date Completed'],
      ...response.rows.map((record) => [
        record.studentName,
        record.formGroupLabel,
        record.formTitle,
        record.dateCompleted,
      ]),
    ]

    downloadCsv('class-progress-records.csv', rows)
  } catch (error) {
    console.error('Failed to export CSV:', error)
  }
}

watch(selectedDate, async () => {
  selectedFormIds.value = []
  currentPage.value = 1
  await loadWeekForms()
  await loadClassProgress()
})

watch(pageSize, async () => {
  currentPage.value = 1
  await loadClassProgress()
})

watch(
  [searchStudent, selectedFormIds, groupByStudent, viewMode],
  async () => {
    currentPage.value = 1
    if (selectedDate.value) {
      await loadWeekForms()
    }
    await loadClassProgress()
  },
  { deep: true }
)

watch(
  [
    recordSortKey,
    recordSortDirection,
    groupedSortKey,
    groupedSortDirection,
    missingSortKey,
    missingSortDirection,
  ],
  async () => {
    currentPage.value = 1
    await loadClassProgress()
  }
)

watch(currentPage, async () => {
  await loadClassProgress()
})

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal
  }
})

onMounted(async () => {
  await loadClassProgress()
})
</script>

<template>
  <div class="progress-wrap">
    <div class="progress-header">
      <h2 class="progress-title">Class Progress</h2>

      <div class="progress-controls">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchStudent"
            type="text"
            placeholder="Search student..."
            class="search-input"
          />
        </div>

        <input
          v-model="selectedDate"
          type="date"
          class="sort-select"
        />

        <button
          type="button"
          class="sort-select"
          @click="exportCurrentTable"
        >
          Export CSV
        </button>
      </div>
    </div>

    <div
      class="table-card"
      style="margin-bottom: 1rem;"
    >
      <div style="padding: 1rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        <button
          type="button"
          @click="viewMode = 'completed'"
          :class="viewMode === 'completed' ? 'view-btn active' : 'view-btn inactive'"
        >
          Completed
        </button>

        <button
          type="button"
          @click="viewMode = 'missing'"
          :class="viewMode === 'missing' ? 'view-btn active' : 'view-btn inactive'"
        >
          Missing
        </button>
      </div>
    </div>

    <div
      v-if="selectedDate"
      class="table-card"
      style="margin-bottom: 1rem;"
    >
      <div style="padding: 1rem;">
        <div style="font-weight: 700; margin-bottom: 0.75rem;">
          Filter by Form
        </div>

        <div v-if="availableForms.length === 0" style="color: #6b7280;">
          No forms found for that week.
        </div>

        <div
          v-else
          style="display: flex; flex-wrap: wrap; gap: 0.5rem;"
        >
          <button
            v-for="form in availableForms"
            :key="form.id"
            @click="toggleFormSelection(form.id)"
            type="button"
            :class="selectedFormIds.includes(form.id) ? 'view-btn active form-btn' : 'view-btn inactive form-btn'"
          >
            {{ form.title }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="viewMode === 'completed'"
      class="table-card"
      style="margin-bottom: 1rem;"
    >
      <div style="padding: 1rem; display: flex; align-items: center; gap: 0.5rem;">
        <input
          id="group-by-student"
          v-model="groupByStudent"
          type="checkbox"
        />
        <label for="group-by-student" style="font-weight: 600;">
          Group by Student
        </label>
      </div>
    </div>

    <div
      v-if="viewMode === 'missing' && !selectedDate"
      class="table-card"
      style="margin-bottom: 1rem;"
    >
      <div style="padding: 1rem; color: #6b7280; font-weight: 500;">
        Select a date to view missing students.
      </div>
    </div>

    <div class="table-card">
      <table v-if="viewMode === 'completed' && !groupByStudent" class="progress-table">
        <thead>
          <tr>
            <th @click="toggleRecordSort('studentName')" class="cursor-pointer select-none">
              Student Name {{ getSortIndicator('studentName', recordSortKey, recordSortDirection) }}
            </th>
            <th @click="toggleRecordSort('formGroupLabel')" class="cursor-pointer select-none">
              Form Group / Week {{ getSortIndicator('formGroupLabel', recordSortKey, recordSortDirection) }}
            </th>
            <th @click="toggleRecordSort('formTitle')" class="cursor-pointer select-none">
              Specific Form {{ getSortIndicator('formTitle', recordSortKey, recordSortDirection) }}
            </th>
            <th @click="toggleRecordSort('dateCompleted')" class="cursor-pointer select-none">
              Date Completed {{ getSortIndicator('dateCompleted', recordSortKey, recordSortDirection) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && visibleRecords.length === 0">
            <td colspan="4" style="text-align: center; padding: 1rem; color: #6b7280;">
              No submissions found.
            </td>
          </tr>

          <tr v-if="loading">
            <td colspan="4" style="text-align: center; padding: 1rem; color: #6b7280;">
              Loading...
            </td>
          </tr>

          <tr v-for="record in visibleRecords" :key="record.id">
            <td>
              <div class="student-cell">
                <div class="student-avatar">
                  {{ record.studentName.slice(0, 2).toUpperCase() }}
                </div>
                <span>{{ record.studentName }}</span>
              </div>
            </td>
            <td>{{ record.formGroupLabel }}</td>
            <td>{{ record.formTitle }}</td>
            <td class="last-active">{{ record.dateCompleted }}</td>
          </tr>
        </tbody>
      </table>

      <table v-else-if="viewMode === 'completed' && groupByStudent" class="progress-table">
        <thead>
          <tr>
            <th @click="toggleGroupedSort('studentName')" class="cursor-pointer select-none">
              Student Name {{ getSortIndicator('studentName', groupedSortKey, groupedSortDirection) }}
            </th>
            <th @click="toggleGroupedSort('formsCompleted')" class="cursor-pointer select-none">
              Forms Completed {{ getSortIndicator('formsCompleted', groupedSortKey, groupedSortDirection) }}
            </th>
            <th @click="toggleGroupedSort('lastSubmitted')" class="cursor-pointer select-none">
              Last Submitted {{ getSortIndicator('lastSubmitted', groupedSortKey, groupedSortDirection) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && visibleGroupedRecords.length === 0">
            <td colspan="3" style="text-align: center; padding: 1rem; color: #6b7280;">
              No submissions found.
            </td>
          </tr>

          <tr v-if="loading">
            <td colspan="3" style="text-align: center; padding: 1rem; color: #6b7280;">
              Loading...
            </td>
          </tr>

          <tr v-for="record in visibleGroupedRecords" :key="record.studentId">
            <td>
              <div class="student-cell">
                <div class="student-avatar">
                  {{ record.studentName.slice(0, 2).toUpperCase() }}
                </div>
                <span>{{ record.studentName }}</span>
              </div>
            </td>
            <td>{{ record.formsCompleted }}</td>
            <td class="last-active">{{ record.lastSubmitted }}</td>
          </tr>
        </tbody>
      </table>

      <table v-else class="progress-table">
        <thead>
          <tr>
            <th @click="toggleMissingSort('studentName')" class="cursor-pointer select-none">
              Student Name {{ getSortIndicator('studentName', missingSortKey, missingSortDirection) }}
            </th>
            <th @click="toggleMissingSort('missingFormsCount')" class="cursor-pointer select-none">
              Missing Forms Count {{ getSortIndicator('missingFormsCount', missingSortKey, missingSortDirection) }}
            </th>
            <th>
              Missing Forms
            </th>
            <th @click="toggleMissingSort('lastSubmitted')" class="cursor-pointer select-none">
              Last Submitted {{ getSortIndicator('lastSubmitted', missingSortKey, missingSortDirection) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && visibleMissingRecords.length === 0">
            <td colspan="4" style="text-align: center; padding: 1rem; color: #6b7280;">
              No missing students found.
            </td>
          </tr>

          <tr v-if="loading">
            <td colspan="4" style="text-align: center; padding: 1rem; color: #6b7280;">
              Loading...
            </td>
          </tr>

          <tr v-for="record in visibleMissingRecords" :key="record.studentId">
            <td>
              <div class="student-cell">
                <div class="student-avatar">
                  {{ record.studentName.slice(0, 2).toUpperCase() }}
                </div>
                <span>{{ record.studentName }}</span>
              </div>
            </td>
            <td>{{ record.missingFormsCount }}</td>
            <td>{{ record.missingForms.join(', ') }}</td>
            <td class="last-active">{{ record.lastSubmitted || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="table-card"
      style="margin-top: 1rem;"
    >
      <div
        style="padding: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;"
      >
        <div style="color: #6b7280; font-weight: 500;">
          Page {{ currentPage }} of {{ totalPages }} • {{ totalCount }} total
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <label for="page-size" style="font-weight: 600;">Rows per page</label>
          <select
            id="page-size"
            v-model.number="pageSize"
            class="sort-select"
            style="min-width: 90px;"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>

          <button
            type="button"
            class="sort-select"
            :disabled="currentPage === 1 || loading"
            @click="goToPreviousPage"
          >
            Previous
          </button>

          <button
            type="button"
            class="sort-select"
            :disabled="currentPage === totalPages || loading"
            @click="goToNextPage"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './styles/progress.css';

/* Abstracted view button styles to clean up template HTML */
.view-btn {
  padding: 0.5rem 0.9rem;
  border-radius: 9999px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.view-btn.form-btn {
  padding: 0.5rem 0.75rem;
}

.view-btn.active {
  border: 1px solid #4f46e5;
  background: #eef2ff;
  color: #3730a3;
  font-weight: 700;
}

.view-btn.form-btn.active {
  font-weight: 600;
}

.view-btn.inactive {
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
}
</style>