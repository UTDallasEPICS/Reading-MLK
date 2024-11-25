<template lang="pug">
  .database-view(class="bg-gray-100 p-5 font-sans")
    .header(class="flex flex-col justify-center items-center bg-gray-700 p-6 rounded-lg shadow-lg mb-8")
      h2(class="text-4xl font-bold text-gray-100 uppercase tracking-wide mb-2 relative") Faculty
      .heading-line(class="block w-16 h-1 bg-teal-400 my-2 mx-auto rounded relative")
    .search-container(class="mb-6 p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center")
      h3.text-2xl.font-semibold.mb-6.text-center Search Faculty Database
      .search-form.flex.flex-wrap.gap-8.mb-6.justify-center
        .field(v-for="(header, index) in tableHeaders" :key="index" class="flex flex-col w-full max-w-xs mb-6")
          label(v-if="header.type !== 'checkbox'" class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600") {{ header.label }}
          input(v-if="header.type !== 'checkbox'" :id="header.id" :placeholder="header.placeholder" class="p-3 text-base border border-gray-300 rounded-md w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500")
          div(v-if="header.type === 'checkbox'" class="flex flex-col justify-center align-items-center")
            label(v-if="header.type === 'checkbox'" class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600") {{ header.label }}
            div(v-if="header.type === 'checkbox'" class="flex flex-col gap-5 justify-center align-items-center")
              div(v-if="header.type === 'checkbox'" class="flex flex-row gap-5 my-2")
                div(v-if="header.type === 'checkbox'" class="flex flex-row gap-5 justify-center align-items-center")
                input(v-if="header.type === 'checkbox'" type="checkbox" :id="header.id + '-toggle'" :name="header.id" v-model="selectedOption" class="appearance-none border border-gray-300 rounded-lg w-8 h-7 bg-transparent cursor-pointer checked:bg-customBlue checked:border-transparent focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md")
                label(for="header.id + '-toggle'" :class="{'text-teal-600': selectedOption, 'text-gray-700': !selectedOption}" class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600") {{ selectedOption ? "Yes" : "No" }}
      .button-group.flex.justify-center.gap-4.mt-6
        button(@click="performSearch" class="clear-button px-5 py-3 text-base font-semibold text-white rounded-lg bg-teal-500 hover:bg-teal-600 focus:outline-none transition-all") Search
        button(@click="clearSearch" class="clear-button px-5 py-3 text-base font-semibold text-white rounded-lg bg-red-500 hover:bg-red-600 focus:outline-none transition-all") Clear
    .table-wrapper.overflow-x-auto.rounded-lg.shadow-lg
      table.table.w-full.border-collapse.text-sm.text-gray-800.bg-gray-50
        thead.table-head.text-xs.text-white.bg-gray-700.uppercase
          tr
            th(v-for="header in h" :key="header" class="table-cell py-3 border-b border-gray-200 text-center") {{ header }}
        tbody
          tr(v-for="(u, index) in Faculties" :key="u.id" :class="['table-row', index % 2 === 0 ? 'bg-gray-100' : 'bg-white', 'hover:shadow-lg', 'hover:scale-[1.02]', 'transition-transform', 'duration-200']")
            td.table-cell.py-3.grid.place-items-center
              svg(v-if="u.dual_lang" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle")
                circle(cx="12" cy="12" r="10")
                path(d="M9 12l2 2 4-4")
              svg(v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle")
                circle(cx="12" cy="12" r="10")
                path(d="M15 9l-6 6M9 9l6 6")
            td.table-cell.py-3.text-center {{ u.district }} 
            td.table-cell.py-3.text-center {{ u.faculty_email }}
            td.table-cell.py-3.text-center {{ u.Faculty.first_name }}
            td.table-cell.py-3.text-center {{ u.Faculty.last_name }}
            td.table-cell.py-3.text-center {{ u.school_name }}
            td.table-cell.py-3.text-center {{ u.phone_number }}
            td.table-cell.py-3.text-center {{ u.department }}
            td.table-cell.py-3.text-center {{ u.grade }}
            td.table-cell.py-3.text-center
              button(v-if="!editButtonPressed" @click="goToEdit(u.id)" class="action-button edit-button rounded-md py-2 px-4 text-xs font-semibold text-white cursor-pointer bg-teal-500 hover:bg-teal-600 focus:outline-none transition-all") Edit
            td.table-cell.py-3.text-center
              button(@click="removeFaculty(u.id)" class="action-button remove-button rounded-md py-2 px-4 text-xs font-semibold text-white cursor-pointer bg-red-500 hover:bg-red-600 focus:outline-none transition-all") Remove
</template>


<script setup lang="ts">
  import type { User } from "@prisma/client";
  import { ref } from "vue";
  

  const editButtonPressed = ref(false);
  const selectedOption = ref(false); // Initialize with a default value, e.g., 'no'

  const tableHeaders = [
        { id: 'district', label: 'District', placeholder: 'District', type: 'text' },
        { id: 'email', label: 'Email', placeholder: 'Email', type: 'text' },
        { id: 'firstName', label: 'First Name', placeholder: 'First Name', type: 'text' },
        { id: 'lastName', label: 'Last Name', placeholder: 'Last Name', type: 'text' },
        { id: 'schoolName', label: 'School Name', placeholder: 'School Name', type: 'text' },
        { id: 'phone', label: 'Phone', placeholder: 'Phone', type: 'text' },
        { id: 'department', label: 'Department Name', placeholder: 'Department Name', type: 'text' },
        { id: 'grade', label: 'Grade', placeholder: 'Grade', type: 'text' },
        { id: 'dualLanguage', label: 'Dual Language', type: 'checkbox' }
      ];

  const h = [
    "Dual Language", "District", "Email", "First Name", "Last Name", "School Name", "Phone Number", "Department", "Grade", "Edit", "Remove"
  ];

  const addDataToDatabase = async (jsonData: any) => {
  // Iterate through jsonData and add each record to the Prisma database
  for (const record of jsonData) {
    const newFaculty = {
        district: record['district'],     
        dual_lang: record['dual_lang'],
        faculty_email: record['faculty_email'],  
        first_name: record['first_name'],   
        last_name: record['last_name'],    
        school_name: record['school_name'],   
        phone_number: record['phone_number'],  
        department: record['department'],    
        grade: record['grade'], 
    };

    // Use Prisma to add the new Faculty to the database
    await $fetch('/api/faculty/faculty', {
      method: 'POST',
      body: newFaculty,
    });
  }

  // Refresh the list of Faculties after importing data
  // Faculties.value = await getFaculties();
};
  type Faculty = {
    id: number,
    district: string,     
    dual_lang: boolean, 
    faculty_email: string,  
    first_name: string,   
    last_name: string,    
    school_name: string,   
    phone_number: string,  
    department: string,    
    grade: string,
  }
  const Faculties = ref<Faculty[]>([])
  const FacultyObject = ref({
    district: "",     
    dual_lang: false, 
    faculty_email: "",  
    first_name: "",   
    last_name: "",    
    school_name: "",   
    phone_number: "",  
    department: "",    
    grade: "",
  })
  
  await getFaculties()

  async function getFaculties() {
    const { data: FacultyList } = await useFetch('/api/faculty', {
          method: 'GET',
      })
      Faculties.value = FacultyList.value as unknown as Faculty[];
      return FacultyList;
  }

  async function goToEdit(FacultyId: number) {
    const editUrl = '/edit/editfaculty?' + 'id=' + FacultyId
    await navigateTo(editUrl)
  }

  const removeFaculty = async (id: number) => {
      await $fetch('/api/faculty/faculty', {
          method: 'DELETE',
          body: { id },
      });
    //  Faculties.value = await getFaculties();
  }

  const performSearch = () => {}

  const clearSearch = () => {
  // Clear FacultyObject and reset Faculties list
  FacultyObject.value = {
    district: "",     
    dual_lang: false, 
    faculty_email: "",  
    first_name: "",   
    last_name: "",    
    school_name: "",   
    phone_number: "",  
    department: "",    
    grade: "",
  };
}

  const rhuser = useCookie<User>('rhuser')
  const userRole = (rhuser.value?.role)
  console.log(rhuser.value.role)
  const currid = (rhuser.value?.id)

</script>
