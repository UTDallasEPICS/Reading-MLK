<template>
<div class="content-center">
  <!-- Submission form for editing parent profile -->
  <div class="container content-center" id="form" style="margin: 0 auto">
    <h2 class="text-center text-3xl font-bold mt-6">Edit Parent Profile</h2>
    <hr class="rounded center-text" style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px">
    
    <!-- Form fields -->
    <div class="mt-10 grid grid-cols-1 gap-x-24 gap-y-8 sm:grid-cols-6 mx-40">
      <!-- Zipcode -->
      <div class="sm:col-span-3 ml-28">
        <label for="zipcode" class="block text-lg font-medium leading-6 text-gray-900">Zipcode</label>
        <div class="mt-2">
          <input v-model="parent.zipcode" type="number" name="zipcode" id="zipcode" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
        </div>
      </div>
      <!-- Yearly Income -->
      <div class="sm:col-span-3 mr-28">
        <label for="yearly-income" class="block text-lg font-medium leading-6 text-gray-900">Yearly Income</label>
        <div class="mt-2">
          <input v-model="parent.yearlyIncome" type="text" name="yearly-income" id="yearly-income" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
        </div>
      </div>
      <!-- Birth Date -->
      <div class="sm:col-span-3 ml-28">
        <label for="birth-date" class="block text-lg font-medium leading-6 text-gray-900">Birth Date</label>
        <div class="mt-2">
          <input v-model="parent.birthDate" type="date" name="birth-date" id="birth-date" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
        </div>
      </div>
      <!-- Average Number of Books Read to Child -->
      <div class="sm:col-span-3 mr-28">
        <label for="average_number_books" class="block text-lg font-medium leading-6 text-gray-900">Avg. Number of Books Read to Child</label>
        <div class="mt-2">
          <input v-model="parent.avgNumBook" type="number" name="average_number_books" id="average_number_books" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
        </div>
      </div>
      <!-- Phone Number -->
      <div class="sm:col-span-3 mr-28">
        <label for="phone-number" class="block text-lg font-medium leading-6 text-gray-900">Phone Number</label>
        <div class="mt-2">
          <input v-model="parent.phoneNumber" type="tel" name="phone-number" id="phone-number" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
        </div>
      </div>
      <!-- Gender -->
      <div class="sm:col-span-3 ml-28">
        <label for="gender" class="block text-lg font-medium leading-6 text-gray-900">Gender</label>
        <div class="mt-2">
          <select v-model="parent.gender" name="gender" id="gender" class="block w-full bg-gray-200 text-gray-700 border rounded-md py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white">
            <option disabled value="">Please select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <!-- Marital Status -->
      <div class="sm:col-span-3 mr-28">
        <label for="marital-status" class="block text-lg font-medium leading-6 text-gray-900">Marital Status</label>
        <div class="mt-2">
          <select v-model="parent.maritalStatus" name="marital-status" id="marital-status" class="block w-full bg-gray-200 text-gray-700 border rounded-md py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white">
            <option disabled value="">Please select marital status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
      </div>
      <!-- First Name -->
      <div class="sm:col-span-3 ml-28">
        <label for="first-name" class="block text-lg font-medium leading-6 text-gray-900">First Name</label>
        <div class="mt-2">
          <input v-model="parent.firstName" type="text" name="first-name" id="first-name" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
        </div>
      </div>
      <!-- Last Name -->
      <div class="sm:col-span-3 mr-28">
        <label for="last-name" class="block text-lg font-medium leading-6 text-gray-900">Last Name</label>
        <div class="mt-2">
          <input v-model="parent.lastName" type="text" name="last-name" id="last-name" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
        </div>
      </div>
      <!-- Email -->
      <div class="sm:col-span-3 ml-28">
        <label for="email" class="block text-lg font-medium leading-6 text-gray-900">Email</label>
        <div class="mt-2">
          <input v-model="parent.email" type="email" name="email" id="email" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
        </div>
      </div>
      <!-- Social Media -->
      <div class="sm:col-span-3 mr-28">
        <label for="social-media" class="block text-lg font-medium leading-6 text-gray-900">Social Media</label>
        <div class="mt-2">
          <input v-model="parent.socialMedia" type="text" name="social-media" id="social-media" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
        </div>
      </div>
      <!-- Submit Button -->
      <button type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-60 mx-72" @click.prevent="editParent(parent)">Apply Edits</button>
    </div>
  </div>
</div>
</template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  const rhuser = useCookie<any>('rhuser')
  const client_cuid = rhuser.value?.client_cuid || "0";

  interface ParentProfile {
    id: number | null;
    zipcode: number | null;
    yearlyIncome: string | null;
    birthDate: string | null;
    avgNumBook: number | null;
    phoneNumber: string | null;
    gender: string | null;
    maritalStatus: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    socialMedia: string | null;
  }
  
  const parent = ref<ParentProfile>({
    id: 0,
    zipcode: 0,
    yearlyIncome: "",
    birthDate: "",
    avgNumBook: 0,
    phoneNumber: "",
    gender: "",
    maritalStatus: "",
    firstName: "",
    lastName: "",
    email: "",
    socialMedia: ""
  });
  
  // Fetch parent profile based on URL parameter
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const parentId = queryParams.get('id');
  
  const getParent = async () => {
    const response = await $fetch(`/api/parent/${parentId}`);
    const data = await response.json();
    return data;
  };
  
  parent.value = await getParent();
  
  /**
  *   @desc Edit parent profile information
  *   @param editedParent Object containing edited parent profile information
  */
  const editParent = async (editedParent: ParentProfile) => {
    console.log('Edited Parent Profile:', editedParent);
    let response = null;
    try {
      response = await fetch('/api/parent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedParent)
      });
  
      if (!response.ok) {
        throw new Error('Failed to edit parent profile.');
      }
      console.log('Parent profile edited successfully');
    } catch (error) {
      console.error('Error editing parent profile:', error);
    }
    if(parent) parent.value = await getParent()
    navigateTo('/viewparent')
  };

  const save = async () => {
  const data = await $fetch('/api/parent', {
    method: (client_cuid.value as string) !== "0" ? 'PUT' : 'POST',
    body: ({...parent.value, client_cuid: client_cuid.value as string})
  }).catch((error)=>{
    console.log("Error: ",error.data.message);
  });
  console.log(data)
  if(data && (data as any).success){
    await navigateTo('/parent')
  }
}
  </script>
  