<template lang="pug">
  <div class="database-view">
    <div class="header">
      <h2 class="heading">Faculty</h2>
    </div>

    <div class="search-container">
      <h3>Search Faculty Database</h3>
      <div class="search-form">
        <div v-for="(header, index) in tableHeaders" :key="index" class="field">
          <label :for="header.id">{{ header.label }}</label>
          <input v-if="header.type !== 'checkbox'" :id="header.id" :placeholder="header.placeholder" class="search-input" />
          <input v-if="header.type === 'checkbox'" type="checkbox" :id="header.id" class="search-checkbox" />
        </div>
      </div>
    
      <div class="button-group">
        <button @click="performSearch" class="search-button">Search</button>
        <button @click="clearSearch" class="clear-button">Clear</button>
      </div>
      
    </div>

    <div class="table-container">
      <div class="table-wrapper">
        <table class="table">
          <thead class="table-head">
            <tr>
              <th v-for="header in h" :key="header" class="table-cell">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(u, index) in Faculties" :key="u.id" :class="['table-row', index % 2 === 0 ? 'bg-light' : 'bg-white']">
              <td class="table-cell">
                <svg v-if="u.dual_lang" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M15 9l-6 6M9 9l6 6"></path>
                </svg>
              </td>
              <td class="table-cell">{{ u.district }}</td>
              <td class="table-cell">{{ u.faculty_email }}</td>
              <td class="table-cell">{{ u.first_name }}</td>
              <td class="table-cell">{{ u.last_name }}</td>
              <td class="table-cell">{{ u.school_name }}</td>
              <td class="table-cell">{{ u.phone_number }}</td>
              <td class="table-cell">{{ u.department }}</td>
              <td class="table-cell">{{ u.grade }}</td>
              <td class="table-cell">
                <button v-if="!editButtonPressed" @click="goToEdit(u.id)" class="action-button edit-button">Edit</button>
              </td>
              <td class="table-cell">
                <button @click="removeFaculty(u.id)" class="action-button remove-button">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.database-view {
  font-family: Arial, sans-serif;
  background-color: #f0f4f8;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3748; /* Darker shade for contrast */
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem; /* Space between header and content below */
}

.heading {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f7fafc; /* Light text color */
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  margin: 0;
  position: relative;
}

.heading::after {
  content: '';
  display: block;
  width: 50%;
  height: 4px;
  background-color: #48bb78; /* Accent color */
  margin: 0.5rem auto 0;
  border-radius: 2px;
}

.search-container {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  /* background-color: black; */
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  justify-content: center;
  justify-items: center;
}

.search-container h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.search-form {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
  column-gap: 5rem;;
  margin-bottom: 1.5rem;
}


/* Style the labels for better visual hierarchy */
label {
  font-size: 1.125rem; /* Slightly larger font size for readability */
  font-weight: 600; /* Bold for emphasis */
  color: #2d3748; /* Dark color for better contrast against background */
  margin-bottom: 0.5rem; /* Adds space between label and input */
  transition: color 0.3s ease, transform 0.2s ease; /* Smooth transition for hover effects */
}

/* Add a subtle hover effect */
label:hover {
  color: #48bb78; /* Change to accent color on hover */
  transform: translateY(-2px); /* Slightly lift the label on hover for interactivity */
}

/* Input fields adjustments */
.search-input, .search-checkbox {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  width: 100%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Smooth input focus effect */
}

/* Adding focus effect for better user interaction */
.search-input:focus, .search-checkbox:focus {
  border-color: #48bb78; /* Accent color on focus */
  box-shadow: 0 0 5px rgba(72, 187, 120, 0.6); /* Soft glow on focus */
}

/* Adjust spacing for the fields */
.field {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 250px; /* Ensures input fields are not too wide */
  margin-bottom: 1.5rem; /* Adds space between fields */
}

.search-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  margin-top: 0.25rem;
}

.search-button, .clear-button {
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  border: none;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
}

.search-button {
  background-color: #48bb78;
}

.clear-button {
  background-color: #e53e3e;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.search-button:hover {
  background-color: #38a169;
}

.clear-button:hover {
  background-color: #c53030;
}

.table-container {
  margin-top: 2rem;
  padding: 20px;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.table {
  width: 100%;
  border-collapse: collapse; /* Updated from 'separate' for better alignment */
  font-size: 0.9rem;
  color: #333;
  background-color: #f7fafc;
}

.table-head {
  font-size: 0.875rem;
  color: #ffffff;
  background-color: #4a5568;
  text-transform: uppercase;
}

.table-cell {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: center; /* Updated to center-align all cells */
}

.table-row {
  background-color: #f7fafc;
  transition: background-color 0.2s;
}

.table-row:nth-child(even) {
  background-color: #e2e8f0;
}

.action-button {
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-button:focus-visible {
  outline: 2px solid #4a5568;
  outline-offset: 2px;
}

.edit-button {
  background-color: #48bb78;
}

.edit-button:hover {
  background-color: #38a169;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.remove-button {
  background-color: #e53e3e;
}

.remove-button:hover {
  background-color: #c53030;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}
</style>


<script setup lang="ts">
  import type { User } from "@prisma/client";
  import { ref } from "vue";

  const editButtonPressed = ref(false)

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
