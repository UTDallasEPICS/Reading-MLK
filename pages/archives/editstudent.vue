<template>
<div class="content-center">
    <!-- Submission form for new users -->
    <div class="container content-center" id="form" style="margin: 0 auto">
      <h2 class="text-center text-3xl font-bold mt-6">Edit Student</h2>
      <hr class="rounded center-text" style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px">
      
      <!-- Form fields -->
      <div class="mt-10 grid grid-cols-1 gap-x-24 gap-y-8 sm:grid-cols-6 mx-40">
        <!-- First Name -->
        <div class="sm:col-span-3 ml-28">
          <label for="first-name" class="block text-lg font-medium leading-6 text-gray-900">First Name</label>
          <div class="mt-2">
            <input v-model="student.firstName" type="text" name="first-name" id="first-name" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
          </div>
        </div>
        <!-- Last Name -->
        <div class="sm:col-span-3 mr-28">
          <label for="last-name" class="block text-lg font-medium leading-6 text-gray-900">Last Name</label>
          <div class="mt-2">
            <input v-model="student.lastName" type="text" name="last-name" id="last-name" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
          </div>
        </div>
        <!-- Age -->
        <div class="sm:col-span-3 ml-28">
          <label for="age" class="block text-lg font-medium leading-6 text-gray-900">Age</label>
          <div class="mt-2">
            <input v-model="student.age" type="number" name="age" id="age" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
          </div>
        </div>
        <!-- Grade -->
        <div class="sm:col-span-3 mr-28">
          <label for="grade" class="block text-lg font-medium leading-6 text-gray-900">Grade</label>
          <div class="mt-2">
            <input v-model="student.grade" type="number" name="grade" id="grade" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
          </div>
        </div>
        <!-- Reading Level -->
        <div class="sm:col-span-3 ml-28">
          <label for="reading-lvl" class="block text-lg font-medium leading-6 text-gray-900">Reading Level</label>
          <div class="mt-2">
            <input v-model="student.readingLvl" type="number" name="reading-lvl" id="reading-lvl" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
          </div>
        </div>
        <!-- Birth Date -->
        <div class="sm:col-span-3 mr-28">
          <label for="birth-date" class="block text-lg font-medium leading-6 text-gray-900">Birth Date</label>
          <div class="mt-2">
            <input v-model="student.birthDate" type="date" name="birth-date" id="birth-date" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
          </div>
        </div>
        <!-- Gender -->
        <div class="sm:col-span-3 ml-28">
          <label for="gender" class="block text-lg font-medium leading-6 text-gray-900">Gender</label>
          <div class="mt-2">
            <select v-model="student.gender" name="gender" id="gender" class="block w-full bg-gray-200 text-gray-700 border rounded-md py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white">
              <option disabled value="">Please select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
        </div>
        <!-- School Name -->
        <div class="sm:col-span-3 mr-28">
          <label for="school-name" class="block text-lg font-medium leading-6 text-gray-900">School Name</label>
          <div class="mt-2">
            <input v-model="student.schoolName" type="text" name="school-name" id="school-name" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
          </div>
        </div>
        <!-- School District -->
        <div class="sm:col-span-3 ml-28">
          <label for="school-district" class="block text-lg font-medium leading-6 text-gray-900">School District</label>
          <div class="mt-2">
            <input v-model="student.schoolDist" type="text" name="school-district" id="school-district" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
          </div>
        </div>
        <!-- Preferred Language -->
        <div class="sm:col-span-3 mr-28">
          <label for="pref-lang" class="block text-lg font-medium leading-6 text-gray-900">Preferred Language</label>
          <div class="mt-2">
            <select v-model="student.prefLang" name="pref-lang" id="pref-lang" class="block w-full bg-gray-200 text-gray-700 border rounded-md py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white">
              <option disabled value="">Please select preferred language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <!-- Submit Button -->
        <button type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-60 mx-72" @click.prevent="editStudent(student)">Apply Edits</button>
      </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const rhuser = useCookie<any>('rhuser')
const id = rhuser.value?.id || "0";

const student = ref({
  id: null,
  firstName: null,
  lastName: null,
  age: null,
  grade: null,
  readingLvl: null,
  birthDate: null,
  gender: null,
  schoolName: null,
  schoolDist: null,
  prefLang: null
});

let url = new URL(window.location.href);
let queryParams = new URLSearchParams(url.search);
let studentId = Object.fromEntries(queryParams).id;

const getStudent = async () => {
  const response = await fetch(`/api/student/${studentId}`);
  const data = await response.json();
  return data;
};

student.value = await getStudent();

/**
*   @desc Edit student information
*   @param editedStudent Object containing edited student information
*/
const editStudent = async (editedStudent: any) => {
  console.log('Edited Student:', editedStudent);
  let response = null;
  try {
    response = await fetch('/api/student', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedStudent)
    });

    if (!response.ok) {
      throw new Error('Failed to edit student.');
    }

    console.log('Student edited successfully');
    // Optionally, you can redirect the user to a success page or display a success message.
  } catch (error) {
    console.error('Error editing student:', error);
    // Optionally, you can display an error message to the user.
  }
  if(student)   student.value = await getStudent()
};

const save = async() =>{
  const data = await $fetch('/api/student',{
    method: (id.value as string) !== '0' ? 'PUT' : 'POST',
    body: ({...student.value, id: id.value as string})
  }).catch((error)=>{
    console.log("Error: ", error.message)
  });
  console.log(data)
  if(data && (data as any).success){
    await navigateTo('/student')
  }
}
</script>
