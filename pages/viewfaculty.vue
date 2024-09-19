<template>
    <div>
    <div>
      <h2 class="text-center text-3xl font-bold mt-4"  style="margin-top: 35px">View Database</h2>
      <br>
    </div>

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
          <tr class="h-9" v-for="(u) in students">            
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

            <td>
              <button id="editUserButton" class="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm
            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-indigo-600" v-if="!editButtonPressed" @click='goToEdit(u.id)'>Edit</button>
            </td>

            <!--Remove function-->
            <td>
              <button id="applyRemoveButton" class="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm
            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-indigo-600" @click="removeStudent(u.id)">Remove</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";

  const editButtonPressed = ref(false)

  /**
   * @desc adding data from an imported file to the student table
   * @param jsonData the data from a parsed file
   */
  const addDataToDatabase = async (jsonData) => {
  // Iterate through jsonData and add each record to the Prisma database
  for (const record of jsonData) {
    const newStudent = {
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

    // Use Prisma to add the new student to the database
    await $fetch('/api/faculty/faculty', {
      method: 'POST',
      body: newStudent,
    });
  }

  // Refresh the list of students after importing data
  students.value = await getStudents();
};
  
  const students = ref(null)
  const student = ref({
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
  
  students.value = await getStudents()

async function getStudents() {
    const studentList = await $fetch('/api/faculty/faculty', {
        method: 'GET',
    })
    students.value = studentList;
    return studentList;
}

async function goToEdit(studentId) {
  const editUrl = '/editfaculty?' + 'id=' + studentId
  navigateTo(editUrl)
}

const removeStudent = async (id) => {
    await $fetch('/api/faculty/faculty', {
        method: 'DELETE',
        body: { id },
    });
    students.value = await getStudents();
}



  
  const rhuser = useCookie('rhuser')
  const userRole = (rhuser.value.role)
  console.log(rhuser.role)
  const currid = parseInt(rhuser.value.id)

  </script>
