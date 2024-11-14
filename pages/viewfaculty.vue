<template lang="pug">
    <!--table for the database display-->
    <div class="mt-4 mx-10">
      <div class="relative overflow-x-auto rounded-lg">
        <table class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
          <thead class="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr class="h-9">
            <th scope="col" class="px-6 py-3">District</th>
            <th scope="col" class="px-6 py-3">Dual Language</th>
            <th scope="col" class="px-6 py-3">Faculty Email</th>
            <th scope="col" class="px-6 py-3">First Name</th>
            <th scope="col" class="px-6 py-3">Last Name</th>
            <th scope="col" class="px-6 py-3">School Name</th>
            <th scope="col" class="px-6 py-3">Phone Number</th>
            <th scope="col" class="px-6 py-3">Department</th>
            <th scope="col" class="px-6 py-3">Grade</th>
            <th scope="col" class="px-6 py-3">Edit</th>
            <th scope="col" class="px-6 py-3">Remove</th>
          </tr>
          </thead>
          <tbody>
          <tr class="h-9" v-for="(u) in Faculties">            
            <td>
              <div>{{ u.district }}</div>
            </td>
            <td>
              <div>{{ u.dual_lang }}</div>
            </td>
            <td>
              <div>{{ u.faculty_email }}</div>
            </td>
            <td>
              <div>{{ u.first_name }}</div>
            </td>
            <td>
              <div>{{ u.last_name }}</div>
            </td>
            <td>
              <div>{{ u.school_name }}</div>
            </td>
            <td>
              <div>{{ u.phone_number }}</div>
            </td>
            <td>
              <div>{{ u.department }}</div>
            </td>
            <td>
              <div>{{ u.grade }}</div>
            </td>


</template>
  
  <script setup lang="ts">
  import type { User } from "@prisma/client";
  import { ref } from "vue";

  const editButtonPressed = ref(false)

  /**
   * @desc adding data from an imported file to the Faculty table
   * @param jsonData the data from a parsed file
   */
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
    const editUrl = '/editfaculty?' + 'id=' + FacultyId
    await navigateTo(editUrl)
  }

  const removeStudent = async (id: number) => {
      await $fetch('/api/faculty/faculty', {
          method: 'DELETE',
          body: { id },
      });
    //  Faculties.value = await getFaculties();
  }



  
  const rhuser = useCookie<User>('rhuser')
  const userRole = (rhuser.value?.role)
  console.log(rhuser.value.role)
  const currid = (rhuser.value?.id)

  </script>


