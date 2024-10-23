<template lang="pug">

  .view-container
    .view-header
      .h1 Faculty

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


