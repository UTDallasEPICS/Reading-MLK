<template lang="pug">
.database-view.bg-gray-100.p-5.font-sans
  // Header
  .header.flex.flex-col.items-center.bg-gray-700.p-6.rounded-lg.shadow-lg.mb-8
    h2.text-4xl.font-bold.text-gray-100.uppercase.tracking-wide.mb-2.relative Faculty
    .heading-line.block.w-16.h-1.bg-teal-400.my-2.mx-auto.rounded.relative

  // Search
  .search-container.mb-6.p-6.bg-white.rounded-lg.shadow-md.flex.flex-col.items-center
    h3.text-2xl.font-semibold.mb-6.text-center Search Faculty Database

    // Search form
    .search-form.flex.flex-wrap.gap-8.mb-6.justify-center
      .field.flex.flex-col.w-full.max-w-xs.mb-6(
        v-for="(header, index) in tableHeaders"
        :key="index"
      )
        // Text inputs
        label(
          v-if="header.type !== 'checkbox'"
          class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600"
        ) {{ header.label }}
        input(
          v-if="header.type !== 'checkbox'"
          :id="header.id"
          v-model="filters[header.id]"
          @change="keyfield = header.id"
          :placeholder="header.placeholder"
          class="p-3 text-base border border-gray-300 rounded-md w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        )

        // Checkbox input (dual_lang)
        div(v-if="header.type === 'checkbox'" class="flex flex-col items-center")
          label(class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600") {{ header.label }}
          .flex.flex-row.gap-5.my-2.items-center
            input(
              type="checkbox"
              :id="header.id + '-toggle'"
              :name="header.id"
              v-model="selectedOption"
              class="appearance-none border border-gray-300 rounded-lg w-8 h-7 bg-transparent cursor-pointer checked:bg-customBlue checked:border-transparent focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md"
            )
            label(
              :for="header.id + '-toggle'"
              :class="{'text-teal-600': selectedOption, 'text-gray-700': !selectedOption}"
              class="text-lg font-semibold transition-all duration-300 ease-in-out transform"
            ) {{ selectedOption ? 'Yes' : 'No' }}

    // Search actions
    .button-group.flex.justify-center.gap-4.mt-6
      button(
        @click="performSearch"
        class="px-5 py-3 text-base font-semibold text-white rounded-lg bg-teal-500 hover:bg-teal-600 transition-all"
      ) Search
      button(
        @click.prevent="clearSearch"
        class="px-5 py-3 text-base font-semibold text-white rounded-lg bg-red-500 hover:bg-red-600 transition-all"
      ) Clear

  // Table
  .table-wrapper.overflow-x-auto.rounded-lg.shadow-lg
    table.w-full.border-collapse.text-sm.text-gray-800.bg-gray-50
      thead.text-xs.text-white.bg-gray-700.uppercase
        tr
          th.table-cell.py-3.border-b.border-gray-200.text-center(
            v-for="header in h"
            :key="header"
          ) {{ header }}
      tbody
        tr(
          v-for="(u, index) in Faculties"
          :key="u.id"
          :class="[index % 2 === 0 ? 'bg-gray-100' : 'bg-white', 'hover:shadow-lg', 'hover:scale-[0.99]', 'transition-transform', 'duration-200']"
        )
          // dual_lang icon
          td.table-cell.p-3.border-b.border-gray-200.text-center
            svg(
              v-if="u.dual_lang"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-check-circle"
            )
              circle(cx="12" cy="12" r="10")
              path(d="M9 12l2 2 4-4")
            svg(
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-x-circle"
            )
              circle(cx="12" cy="12" r="10")
              path(d="M15 9l-6 6M9 9l6 6")

          // data cells
          td.table-cell.p-3.border-b.border-gray-200.text-center {{ u.district }}
          td.table-cell.p-3.border-b.border-gray-200.text-center {{ u.faculty_email }}
          td.table-cell.p-3.border-b.border-gray-200.text-center {{ u.Faculty.first_name }}
          td.table-cell.p-3.border-b.border-gray-200.text-center {{ u.Faculty.last_name }}
          td.table-cell.p-3.border-b.border-gray-200.text-center {{ u.school_name }}
          td.table-cell.p-3.border-b.border-gray-200.text-center {{ u.phone_number }}
          td.table-cell.p-3.border-b.border-gray-200.text-center {{ u.department }}
          td.table-cell.p-3.border-b.border-gray-200.text-center {{ u.grade }}

          // edit
          td.table-cell.p-3.border-b.border-gray-200.text-center
            button(
              v-if="!editButtonPressed"
              @click="goToEdit(u.id)"
              class="rounded-md py-2 px-4 text-xs font-semibold text-white bg-teal-500 hover:bg-teal-600 transition-all"
            ) Edit

          // remove
          td.table-cell.p-3.border-b.border-gray-200.text-center
            button(
              @click="removeFaculty(u.id)"
              class="rounded-md py-2 px-4 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-all"
            ) Remove
</template>

<script setup lang="ts">
import type { FacultyProfile, User } from '@prisma/client'
import { ref, computed } from 'vue'

/**
 * Row shape used by the table.
 * Prisma returns FacultyProfile with nested Faculty (User) when included on the API.
 */
type FacultyRow = {
  id: number
  district: string
  dual_lang: boolean
  faculty_email: string
  first_name: string
  last_name: string
  school_name: string
  phone_number: string
  department: string
  grade: string
  Faculty?: { id?: number; first_name?: string; last_name?: string; email?: string; role?: string }
}

/** Toggle for showing edit buttons (kept for compatibility with your template) */
const editButtonPressed = ref(false)

/** Build a clean default filter object so we can reset easily. */
function makeDefaultFilters(): FacultyProfile & Partial<User> {
  return {
    district: '',
    dual_lang: false,
    faculty_email: '',
    first_name: '',
    last_name: '',
    school_name: '',
    phone_number: '',
    department: '',
    grade: '',
    id: 0,
    user_id: 0
  }
}

/** Current search filters (inputs bind to this). */
const filters = ref<FacultyProfile & Partial<User>>(makeDefaultFilters())

/** Which field triggered search last (kept for your /search API compatibility). */
const keyfield = ref<'district'|'faculty_email'|'first_name'|'last_name'|'school_name'|'phone_number'|'department'|'grade'>('district')

/** Dual-language checkbox state. If false we omit it from query so it doesn't filter. */
const selectedOption = ref(false)

/** Column configs used by the template. */
const tableHeaders = [
  { id: 'district',      label: 'District',        placeholder: 'District',        type: 'text' },
  { id: 'faculty_email', label: 'Email',           placeholder: 'Email',           type: 'text' },
  { id: 'first_name',    label: 'First Name',      placeholder: 'First Name',      type: 'text' },
  { id: 'last_name',     label: 'Last Name',       placeholder: 'Last Name',       type: 'text' },
  { id: 'school_name',   label: 'School Name',     placeholder: 'School Name',     type: 'text' },
  { id: 'phone_number',  label: 'Phone',           placeholder: 'Phone',           type: 'text' },
  { id: 'department',    label: 'Department Name', placeholder: 'Department Name', type: 'text' },
  { id: 'grade',         label: 'Grade',           placeholder: 'Grade',           type: 'text' },
  { id: 'dual_lang',     label: 'Dual Language',                                    type: 'checkbox' }
] as const

/** Table header labels. */
const h = [
  'Dual Language','District','Email','First Name','Last Name',
  'School Name','Phone Number','Department','Grade','Edit','Remove'
]

/** Table data. */
const Faculties = ref<FacultyRow[]>([])

/** Whether any search filter is active (used to decide how to refresh after delete). */
const isSearchActive = computed(() => {
  const f: any = filters.value
  const textKeys = ['district','faculty_email','first_name','last_name','school_name','phone_number','department','grade']
  const hasText = textKeys.some(k => f[k] && String(f[k]).trim() !== '')
  return hasText || selectedOption.value === true
})

/** Fetch full list. */
async function getFaculties() {
  const { data } = await useFetch('/api/faculty', { method: 'GET' })
  Faculties.value = (data.value as unknown as FacultyRow[]) ?? []
}

/** Run server-side search using current filters. */
async function performSearch() {
  const query: Record<string, string | boolean> = {}

  // include text filters that have values
  Object.entries(filters.value).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      query[key] = value as string | boolean
    }
  })

  // include dual_lang filter only when explicitly on (true)
  if (selectedOption.value === true) {
    query['dual_lang'] = true
  }

  try {
    const result = await $fetch<{ data?: FacultyRow[] }>('/api/faculty/search', {
      method: 'GET',
      query: {
        searchQuery: JSON.stringify(query),
        key: keyfield.value
      }
    })
    Faculties.value = result.data ?? []
  } catch (error) {
    console.error('Error performing search:', error)
    // keep current list on error
  }
}

/** Clear search inputs and reload full list. */
async function clearSearch() {
  filters.value = makeDefaultFilters()
  selectedOption.value = false
  keyfield.value = 'district'
  await getFaculties()
}

/** Navigate to edit page (kept as-is). */
async function goToEdit(FacultyId: number) {
  await navigateTo('/edit/editfaculty?id=' + FacultyId)
}

/** Delete a faculty profile by id, then refresh appropriately. */
async function removeFaculty(id: number) {
  if (!id) { alert('Missing faculty profile id'); return }
  if (!confirm('Remove this faculty? This cannot be undone.')) return

  try {
    await $fetch(`/api/faculty/${id}`, { method: 'DELETE' })
    if (isSearchActive.value) await performSearch()
    else await getFaculties()
  } catch (err: any) {
    console.error('Delete failed:', err)
    alert(err?.data?.statusMessage || 'Failed to remove faculty.')
  }
}

/** Initial load. */
await getFaculties()

/** Optional cookie references you had previously. */
const rhuser = useCookie<User>('rhuser')
const userRole = rhuser.value?.role
const currid = rhuser.value?.id
</script>
