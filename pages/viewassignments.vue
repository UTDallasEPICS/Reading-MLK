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
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ row.submittedAt }}
            td(class="table-cell p-3 border-b border-gray-200 text-center")
              button(v-if="!editButtonPressed" @click="goToEdit(row.id)" class="action-button edit-button rounded-md py-2 px-4 text-xs font-semibold text-white cursor-pointer bg-teal-500 hover:bg-teal-600 focus:outline-none transition-all") Edit
            td(class="table-cell p-3 border-b border-gray-200 text-center")
              button(@click="removeAssignments(row.id)" class="action-button remove-button rounded-md py-2 px-4 text-xs font-semibold text-white cursor-pointer bg-red-500 hover:bg-red-600 focus:outline-none transition-all") Remove
</template>


<script setup lang="ts">
  const Assignments = ref<QuizWithResponses[]>([]);
  import type { Quiz, User, QuizResponse } from "@prisma/client";
  import { ref } from "vue";

  type QuizWithResponses = Quiz & {
    responses: QuizResponse[];
    AssignmentToStudent: { Student: User | null }[];
    AssignmentToClass: { Class: { class_name: string } | null }[];
  };

  type AssignmentFilters = {
    first_name?: string;
    last_name?: string;
    class_name?: string;
    assignment_name?: string;
    submittedAt?: string;
    submission_type?: boolean;
  };
  

  const editButtonPressed = ref(false);
  const selectedOption = ref(false); // Initialize with a default value, e.g., 'no'
  const keyfield = ref("district");
  const searchTerm = ref("");
  const filters = ref<AssignmentFilters>({
    first_name: '',
    last_name: '',
    class_name: '',
    assignment_name: '',
    submittedAt: '',
    submission_type: false,
  });

  const tableHeaders = [
        { id: 'first_name', label: 'First Name', placeholder: 'First Name', type: 'text' },
        { id: 'last_name', label: 'Last Name', placeholder: 'Last Name', type: 'text' },
        { id: 'class_name', label: 'Class Name', placeholder: 'Class Name', type: 'text' },
        { id: 'assignment_name', label: 'Assignment Name', placeholder: 'Assignment', type: 'text' },
        { id: 'submission_type', label: 'Submitted', type: 'checkbox' },
        { id: 'submittedAt', label: 'Date', placeholder: 'YYYY-MM-DD', type: 'text'}
      ];

  const h = [
    "Quiz ID", "Class", "Assignments", "First Name", "Last Name", "Submitted", "Grade", "Date", "Edit", "Remove"
  ];
  
  //await getAssignments()

  const assignmentRows = computed(() => {
    const rows: any[] = [];
    for (const assignment of Assignments.value) {
      //Filters out for assignment names
      if (filters.value.assignment_name && !assignment.name?.toLowerCase().startsWith(filters.value.assignment_name.toLowerCase())) {
        continue;
      }

      //If the submitted button is pressed, filter out assignments that are not submitted, and vice versa.
      if (selectedOption.value && !assignment.submitted) {
        continue;
      }

      let classes = assignment.AssignmentToClass?.length ? assignment.AssignmentToClass : [null];
      let students = assignment.AssignmentToStudent?.length ? assignment.AssignmentToStudent : [null];

      //Filter students if a first_name filter is applied
      if (filters.value.first_name) {
        students = students.filter(as => as?.Student?.first_name?.toLowerCase().startsWith(filters.value.first_name.toLowerCase()));
      }
      //Filter students if a last_name filter is applied
      if (filters.value.last_name) {
        students = students.filter(as => as?.Student?.last_name?.toLowerCase().startsWith(filters.value.last_name.toLowerCase()));
      }

      //Filter assignments if a name filter is applied
      if (filters.value.class_name) {
        classes = classes.filter(ac => ac?.Class?.class_name?.toLowerCase().startsWith(filters.value.class_name.toLowerCase()));
      }

      //Pushes the filtered results into the rows array
      for (const ac of classes) {
        for (const as of students) {

          const response = assignment.responses?.find(
          r => Number(r.studentProfileId) === Number(as?.Student?.id)
          );

          // const submittedDate = response?.submittedAt
          //  ? response.submittedAt.toISOString().split("T")[0]
          //  : null;

          const submittedDate = response?.submittedAt
            ? new Date(response.submittedAt).toISOString().split("T")[0]
            : assignment.submitted ? '(submitted)' : 'N/A';

          if (filters.value.submittedAt && (!submittedDate || !submittedDate.startsWith(filters.value.submittedAt)))
            continue;
          
          // debugging
          console.log("Responses array:", assignment.responses);

          rows.push({
            id: assignment.id,
            class_name: ac?.Class?.class_name || 'N/A',
            assignment_name: assignment.name,
            first_name: as?.Student?.first_name || 'N/A',
            last_name: as?.Student?.last_name || 'N/A',
            submitted: assignment.submitted ? 'Yes' : 'No',
            grade: assignment.grade || 100,
            submittedAt: submittedDate,
          })
        }
      }
    }
    return rows;
  });

  async function getAssignments() {
    const { data: AssignmentList } = await useFetch('/api/assignments/search');
      Assignments.value = AssignmentList.value?.data ?? [];
      return AssignmentList;
  }

  const performSearch = async () => {
    const searchQuery: Record<string | number, string | number | boolean> = {};
    //Populates the searchQuery object with the filters applied
    if (filters.value.first_name) searchQuery.first_name = filters.value.first_name;
    if (filters.value.last_name) searchQuery.last_name = filters.value.last_name;
    if (filters.value.class_name) searchQuery.class_name = filters.value.class_name;
    if (filters.value.assignment_name) searchQuery.assignment_name = filters.value.assignment_name;
    if (filters.value.submittedAt) searchQuery.submittedAt = filters.value.submittedAt;

    //If no fields are filled, fetch all
    if (Object.keys(searchQuery).length === 0) {
      await getAssignments();
      return;
    }

    //Otherwise, filter
    const { data: AssignmentList } = await useFetch('/api/assignments/search', {
      method: 'GET',
      query: {
        searchQuery: JSON.stringify(searchQuery),
      },
    });

    Assignments.value = AssignmentList.value?.data as Quiz[] ?? [];
  };

  const clearSearch = () => {
    Assignments.value = [];
    filters.value = {
      first_name: '',
      last_name: '',
      class_name: '',
      assignment_name: '',
      submittedAt: '',
      submission_type: false,
    };
  }

  async function removeAssignments(id: number) {
  try {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    // Call delete API
    await $fetch('/api/assignments/delete', {
      method: 'POST',
      body: { id },
    });

    // Remove deleted assignment locally
    Assignments.value = Assignments.value.filter(a => a.id !== id);

    // If any filters are active, re-run the search so results include `responses`
    const hasFilters = Object.keys(filters.value).some((k) => {
      const v = (filters.value as any)[k];
      return v !== undefined && v !== null && v !== '' && v !== false;
    });

    if (hasFilters) {
      await performSearch(); // reapply filters and fetch from /api/assignments/search
    } else {
      await getAssignments(); // fetch all via the same endpoint that includes responses
    }
  } catch (err) {
    console.error("Failed to delete assignment:", err);
    alert("Delete failed");
  }
}

  const rhuser = useCookie<User>('rhuser')
  const userRole = (rhuser.value?.role)
  console.log(rhuser.value.role)
  const currid = (rhuser.value?.id)

</script>

