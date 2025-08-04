<template lang="pug">
  .database-view(class="bg-gray-100 p-5 font-sans")
    .header(class="flex flex-col justify-center items-center bg-yellow-500 p-6 rounded-lg shadow-lg mb-8")
      h2(class="text-4xl font-bold text-gray-100 uppercase tracking-wide mb-2 relative") Assignments
      .heading-line(class="block w-16 h-1 bg-gray-700 my-2 mx-auto rounded relative")
    .search-container(class="mb-6 p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center")
      h3.text-2xl.font-semibold.mb-6.text-center Search Assignments
      .search-form.flex.flex-wrap.gap-8.mb-6.justify-center
        .field(v-for="(header, index) in tableHeaders" :key="index" class="flex flex-col w-full max-w-xs mb-6")
          label(v-if="header.type !== 'checkbox'" class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600") {{ header.label }}
          input(v-if="header.type !== 'checkbox'" :id="header.id" v-model="filters[header.id]" @change="keyfield=header.id" :placeholder="header.placeholder" class="p-3 text-base border border-gray-300 rounded-md w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500")
          div(v-if="header.type === 'checkbox'" class="flex flex-col justify-center align-items-center")
            label(v-if="header.type === 'checkbox'" class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600") {{ header.label }}
            div(v-if="header.type === 'checkbox'" class="flex flex-col gap-5 justify-center align-items-center")
              div(v-if="header.type === 'checkbox'" class="flex flex-row gap-5 my-2")
                div(v-if="header.type === 'checkbox'" class="flex flex-row gap-5 justify-center align-items-center")
                input(v-if="header.type === 'checkbox'" type="checkbox" :id="header.id + '-toggle'" :name="header.id" v-model="selectedOption" class="appearance-none border border-gray-300 rounded-lg w-8 h-7 bg-transparent cursor-pointer checked:bg-customBlue checked:border-transparent focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md")
                label(for="header.id + '-toggle'" :class="{'text-teal-600': selectedOption, 'text-gray-700': !selectedOption}" class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600") {{ selectedOption ? "Submitted" : "All" }}
      .button-group.flex.justify-center.gap-4.mt-6
        button(@click="performSearch" class="clear-button px-5 py-3 text-base font-semibold text-white rounded-lg bg-teal-500 hover:bg-teal-600 focus:outline-none transition-all") Search
        button(@click="clearSearch" class="clear-button px-5 py-3 text-base font-semibold text-white rounded-lg bg-red-500 hover:bg-red-600 focus:outline-none transition-all") Clear
    .table-wrapper.overflow-x-auto.rounded-lg.shadow-lg
      table.table.w-full.border-collapse.text-sm.text-gray-800.bg-gray-50
        thead.table-head.text-xs.text-white.bg-yellow-500.uppercase
          tr
            th(v-for="header in h" :key="header" class="table-cell py-3 border-b border-gray-200 text-center") {{ header }}
        tbody
          tr(v-for="(row, index) in assignmentRows" :key="row.id" :class="['table-row', index % 2 === 0 ? 'bg-gray-100' : 'bg-white', 'hover:shadow-lg', 'hover:scale-[0.99]', 'transition-transform', 'duration-200']")
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ row.id }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ row.class_name }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ row.assignment_name }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ row.first_name}}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ row.last_name }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ row.submitted }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ row.grade }}
            td(class="table-cell p-3 border-b border-gray-200 text-center")
              button(v-if="!editButtonPressed" @click="goToEdit(row.id)" class="action-button edit-button rounded-md py-2 px-4 text-xs font-semibold text-white cursor-pointer bg-teal-500 hover:bg-teal-600 focus:outline-none transition-all") Edit
            td(class="table-cell p-3 border-b border-gray-200 text-center")
              button(@click="removeAssignments(row.id)" class="action-button remove-button rounded-md py-2 px-4 text-xs font-semibold text-white cursor-pointer bg-red-500 hover:bg-red-600 focus:outline-none transition-all") Remove
</template>


<script setup lang="ts">
  const Assignments = ref<Quiz[]>([]);
  import type { Quiz, User } from "@prisma/client";
  import { ref } from "vue";
  

  const editButtonPressed = ref(false);
  const selectedOption = ref(false); // Initialize with a default value, e.g., 'no'
  const keyfield = ref("district");
  const searchTerm = ref("");
  const filters = ref<Quiz & Partial<User>>({
    id: 0,
  });

  const tableHeaders = [
        { id: 'first_name', label: 'First Name', placeholder: 'First Name', type: 'text' },
        { id: 'last_name', label: 'Last Name', placeholder: 'Last Name', type: 'text' },
        { id: 'class_id', label: 'Class ID', placeholder: 'Class ID', type: 'text' },
        { id: 'assignment', label: 'Assignment Name', placeholder: 'Assignment', type: 'text' },
        { id: 'submission_type', label: 'Submitted', type: 'checkbox' }
      ];

  const h = [
    "Quiz ID", "Class", "Assignments", "First Name", "Last Name", "Submitted", "Grade", "Edit", "Remove"
  ];
  
  //await getAssignments()

  const assignmentRows = computed(() => {
    const rows: any[] = [];
    for (const assignment of Assignments.value) {
      const classes = assignment.AssignmentToClass?.length ? assignment.AssignmentToClass : [null];
      const students = assignment.AssignmentToStudent?.length ? assignment.AssignmentToStudent : [null];

      for (const ac of classes) {
        for (const as of students) {
          rows.push({
            id: assignment.id,
            class_name: ac?.Class?.class_name || 'N/A',
            assignment_name: assignment.name,
            first_name: as?.Student?.first_name || 'N/A',
            last_name: as?.Student?.last_name || 'N/A',
            submitted: assignment.submitted ? 'Yes' : 'No',
            grade: assignment.grade || 100,
          })
        }
      }
    }
    return rows;
  });

  async function getAssignments() {
    const { data: AssignmentList } = await useFetch('/api/assignments/search');
      Assignments.value = AssignmentList.value ?? [];
      return AssignmentList;
  }

  const performSearch = async () => {
    try {
      const { data: AssignmentList } = await useFetch('/api/assignments/search');
      Assignments.value = AssignmentList.value?.data as Quiz[] ?? [];
      console.log("Search results:", Assignments.value);
    } catch (error) {
      console.error("Error performing search:", error);
      Assignments.value = [];
    }
  }

  const clearSearch = () => {
    Assignments.value = [];
  }

  const rhuser = useCookie<User>('rhuser')
  const userRole = (rhuser.value?.role)
  console.log(rhuser.value.role)
  const currid = (rhuser.value?.id)

</script>
