<template lang="pug">
  .database-view(style="font-family: Arial, sans-serif; background-color: #f0f4f8; padding: 20px;")
    .header(style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #2d3748; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); margin-bottom: 2rem;") 
      h2(style="font-size: 2.5rem; font-weight: 700; color: #f7fafc; text-transform: uppercase; letter-spacing: 0.1rem; margin: 0; position: relative;"
      ) Faculty
      .heading-line(style="content: ''; display: block; width: 5%; height: 4px; background-color: #48bb78; margin: 0.5rem auto 0; border-radius: 2px;")
    .search-container(style="margin-bottom: 1.5rem; padding: 1.5rem; background-color: #ffffff; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); justify-content: center; justify-items: center;")
      h3(style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;") Search Faculty Database 
      .search-form(style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 2rem; column-gap: 5rem; margin-bottom: 1.5rem;")
        .field(v-for="(header, index) in tableHeaders" :key="index" :style="{'display': 'flex', 'flex-direction': 'column', 'width': '100%', 'max-width': '250px', 'margin-bottom': '1.5rem'}")
          label(style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem; transition: color 0.3s ease, transform 0.2s ease;") {{header.label}}
          input(v-if="header.type !== 'checkbox'" :id="header.id" :placeholder="header.placeholder" :style="{'padding': '0.75rem', 'font-size': '1rem', 'border': '1px solid #ccc', 'border-radius': '0.25rem', 'width': '100%', 'transition': 'border-color 0.3s ease, box-shadow 0.3s ease;'}")
          input(v-if="header.type === 'checkbox'" type="checkbox" :id="header.id" :style="{'padding': '0.75rem', 'font-size': '1rem', 'border': '1px solid #ccc', 'border-radius': '0.25rem', 'width': '10%', 'transition': 'border-color 0.3s ease, box-shadow 0.3s ease;'}")
      .button-group(style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;")
        button(@click="performSearch" class="clear-button" :style="{padding: '0.75rem 1.25rem', fontSize: '1rem', fontWeight: '600', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '0.375rem', backgroundColor: searchButtonHover, transition: 'background-color 0.3s'}"
          @mouseover="searchButtonHover = '#38a169'"
          @mouseleave="searchButtonHover = '#48bb78'"
        ) Search
        button(@click="clearSearch" class="clear-button" :style="{padding: '0.75rem 1.25rem', fontSize: '1rem', fontWeight: '600', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '0.375rem', backgroundColor: clearButtonHover, transition: 'background-color 0.3s'}"
          @mouseover="clearButtonHover = '#c53030'"
          @mouseleave="clearButtonHover = '#e53e3e'"
        ) Clear
    .table-container(style="margin-top: 2rem; padding: 20px;")
      .table-wrapper(style="overflow-x: auto; border-radius: 0.5rem; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);")
        table(class="table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem; color: #333; background-color: #f7fafc;")
          thead(class="table-head" style="font-size: 0.875rem; color: #ffffff; background-color: #4a5568; text-transform: uppercase;")
            tr
              th( v-for="header in h" :key="header" class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ header }}
          tbody
            tr(v-for="(u, index) in Faculties" :key="u.id" :class="['table-row', index % 2 === 0 ? 'bg-light' : 'bg-white']")
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;")
                svg(v-if="u.dual_lang" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle")
                  circle(cx="12" cy="12" r="10")
                  path(d="M9 12l2 2 4-4")
                svg(v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle")
                  circle(cx="12" cy="12" r="10")
                  path(d="M15 9l-6 6M9 9l6 6")      
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.district }} 
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.faculty_email }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.first_name }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.last_name }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.school_name }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.phone_number }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.department }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.grade }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;")
                button( v-if="!editButtonPressed" @click="goToEdit(u.id)" class="action-button edit-button" style="border-radius: 0.375rem; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 600; color: #ffffff; border: none; cursor: pointer; background-color: #48bb78;"
                ) Edit
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;")
                button(@click="removeFaculty(u.id)" class="action-button remove-button" style="border-radius: 0.375rem; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 600; color: #ffffff; border: none; cursor: pointer; background-color: #e53e3e;"
                ) Remove
</template>

<script setup lang="ts">
  import type { User } from "@prisma/client";
  import { ref } from "vue";

  const editButtonPressed = ref(false)
  const searchButtonHover = ref("#48bb78")
  const clearButtonHover = ref("#e53e3e")

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
      console.log(FacultyList.value)
      return FacultyList;
  }

  async function goToEdit(FacultyId: number) {
    const editUrl = '/archives/editfaculty?' + 'id=' + FacultyId
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
