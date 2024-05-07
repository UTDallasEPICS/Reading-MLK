<template>
    <div class="content-center">
      <!-- Submission form for editing faculty profiles -->
      <div class="container content-center" id="form" style="margin: 0 auto">
        <h2 class="text-center text-3xl font-bold mt-6">Edit Faculty Profile</h2>
        <hr class="rounded center-text" style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px">
        
        <!-- Form fields -->
        <div class="mt-10 grid grid-cols-1 gap-x-24 gap-y-8 sm:grid-cols-6 mx-40">
          <!-- First Name -->
          <div class="sm:col-span-3 ml-28">
            <label for="first-name" class="block text-lg font-medium leading-6 text-gray-900">First Name</label>
            <div class="mt-2">
              <input v-model="facultyProfile.firstName" type="text" name="first-name" id="first-name" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- Last Name -->
          <div class="sm:col-span-3 mr-28">
            <label for="last-name" class="block text-lg font-medium leading-6 text-gray-900">Last Name</label>
            <div class="mt-2">
              <input v-model="facultyProfile.lastName" type="text" name="last-name" id="last-name" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- District -->
          <div class="sm:col-span-3 ml-28">
            <label for="district" class="block text-lg font-medium leading-6 text-gray-900">District</label>
            <div class="mt-2">
              <input v-model="facultyProfile.district" type="text" name="district" id="district" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- Faculty Email -->
          <div class="sm:col-span-3 mr-28">
            <label for="faculty-email" class="block text-lg font-medium leading-6 text-gray-900">Faculty Email</label>
            <div class="mt-2">
              <input v-model="facultyProfile.facultyEmail" type="email" name="faculty-email" id="faculty-email" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- Phone Number -->
          <div class="sm:col-span-3 ml-28">
            <label for="phone-number" class="block text-lg font-medium leading-6 text-gray-900">Phone Number</label>
            <div class="mt-2">
              <input v-model="facultyProfile.phoneNumber" type="text" name="phone-number" id="phone-number" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- Department -->
          <div class="sm:col-span-3 mr-28">
            <label for="department" class="block text-lg font-medium leading-6 text-gray-900">Department</label>
            <div class="mt-2">
              <input v-model="facultyProfile.department" type="text" name="department" id="department" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- School Name -->
          <div class="sm:col-span-3 ml-28">
            <label for="school-name" class="block text-lg font-medium leading-6 text-gray-900">School Name</label>
            <div class="mt-2">
              <input v-model="facultyProfile.schoolName" type="text" name="school-name" id="school-name" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- Dual Language -->
          <div class="sm:col-span-3 mr-28">
            <label for="dual-language" class="block text-lg font-medium leading-6 text-gray-900">Dual Language</label>
            <div class="mt-2">
              <input v-model="facultyProfile.dualLang" type="checkbox" name="dual-language" id="dual-language" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            </div>
          </div>
          <!-- Grade -->
          <div class="sm:col-span-3 ml-28">
            <label for="grade" class="block text-lg font-medium leading-6 text-gray-900">Grade</label>
            <div class="mt-2">
              <input v-model="facultyProfile.grade" type="text" name="grade" id="grade" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- Submit Button -->
          <button type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-60 mx-72" @click.prevent="editFacultyProfile(facultyProfile)">Apply Edits</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface FacultyProfile {
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    district: string | null;
    dualLang: boolean | null;
    facultyEmail: string | null;
    phoneNumber: string | null;
    department: string | null;
    schoolName: string | null;
    grade: string | null;
  }
  
  const facultyProfile = ref<FacultyProfile>({
    id: null,
    firstName: null,
    lastName: null,
    district: null,
    dualLang: null,
    facultyEmail: null,
    phoneNumber: null,
    department: null,
    schoolName: null,
    grade: null
  });
  
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const profileId = queryParams.get('id');
  
  const getFacultyProfile = async () => {
    const response = await fetch(`/api/faculty-profile/${profileId}`);
    const data = await response.json();
    return data;
  };
  
  facultyProfile.value = await getFacultyProfile();
  
  /**
  *   @desc Edit faculty profile information
  *   @param editedProfile Object containing edited faculty profile information
  */
  const editFacultyProfile = async (editedProfile: FacultyProfile) => {
    console.log('Edited Faculty Profile:', editedProfile);
    let response = null;
    try {
      response = await fetch('/api/faculty-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedProfile)
      });
  
      if (!response.ok) {
        throw new Error('Failed to edit faculty profile.');
      }
  
      console.log('Faculty profile edited successfully');
      // Optionally, you can redirect the user to a success page or display a success message.
    } catch (error) {
      console.error('Error editing faculty profile:', error);
      // Optionally, you can display an error message to the user.
    }
  };
  </script>
  