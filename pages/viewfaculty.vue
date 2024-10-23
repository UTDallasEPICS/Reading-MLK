<template lang="pug">
  div
    div
      h2.text-center.text-3xl.font-bold.mt-4(style="margin-top: 35px") View Database
      br
  
    //- Table for the database display
    div.mt-4.mx-10
      .relative.overflow-x-auto.rounded-lg
        table.w-full.text-sm.text-center.text-gray-500.dark\\:text-gray-400
          thead.text-sm.text-gray-700.uppercase.bg-gray-50.dark\\:bg-gray-700.dark\\:text-gray-400
            tr.h-9
              th.px-6.py-3 District
              th.px-6.py-3 Dual Language
              th.px-6.py-3 Faculty Email
              th.px-6.py-3 First Name
              th.px-6.py-3 Last Name
              th.px-6.py-3 School Name
              th.px-6.py-3 Phone Number
              th.px-6.py-3 Department
              th.px-6.py-3 Grade
              th.px-6.py-3 Edit
              th.px-6.py-3 Remove
  
          tbody
            tr.h-9(v-for="(u) in students" :key="u.id")
              td {{ u.district }}
              td {{ u.dual_lang }}
              td {{ u.faculty_email }}
              td {{ u.first_name }}
              td {{ u.last_name }}
              td {{ u.school_name }}
              td {{ u.phone_number }}
              td {{ u.department }}
              td {{ u.grade }}
  
              td
                button#editUserButton.rounded-md.bg-indigo-600.px-3.py-2.text-xs.font-semibold.text-white.shadow-sm.hover\\:bg-indigo-500
                  .focus-visible\\:outline.focus-visible\\:outline-2.focus-visible\\:outline-offset-2.focus-visible\\:outline-indigo-600(
                    v-if="!editButtonPressed"
                    @click='goToEdit(u.id)'
                  ) Edit
  
              td
                button#applyRemoveButton.rounded-md.bg-indigo-600.px-3.py-2.text-xs.font-semibold.text-white.shadow-sm.hover\\:bg-indigo-500
                  .focus-visible\\:outline.focus-visible\\:outline-2.focus-visible\\:outline-offset-2.focus-visible\\:outline-indigo-600(
                    @click="removeStudent(u.id)"
                  ) Remove
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // State management
  const editButtonPressed = ref(false);
  
  // Student list state
  const students = ref(null);
  
  // Default student object structure
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
  });
  
  // Fetch students from the backend
  students.value = await getStudents();
  
  async function getStudents() {
    const studentList = await $fetch('/api/faculty/faculty', { method: 'GET' });
    students.value = studentList;
    return studentList;
  }
  
  // Add student data to the database from a JSON file
  const addDataToDatabase = async (jsonData) => {
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
  
      await $fetch('/api/faculty/faculty', {
        method: 'POST',
        body: newStudent,
      });
    }
    students.value = await getStudents();
  };
  
  // Navigate to edit page
  async function goToEdit(studentId) {
    const editUrl = '/editfaculty?' + 'id=' + studentId;
    navigateTo(editUrl);
  }
  
  // Remove a student from the database
  const removeStudent = async (id) => {
    await $fetch('/api/faculty/faculty', {
      method: 'DELETE',
      body: { id },
    });
    students.value = await getStudents();
  };
  
  const rhuser = useCookie('rhuser')
  const userRole = (rhuser.value.role)
  console.log(rhuser.role)
  const currid = parseInt(rhuser.value.id)

  </script>
  