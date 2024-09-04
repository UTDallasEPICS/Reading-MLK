<template>
    <div class="content-center">
      <!-- Submission form for editing users -->
      <div class="container content-center" id="form" style="margin: 0 auto">
        <h2 class="text-center text-3xl font-bold mt-6">Edit User</h2>
        <hr class="rounded center-text" style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px">
        
        <!-- Form fields -->
        <div class="mt-10 grid grid-cols-1 gap-x-24 gap-y-8 sm:grid-cols-6 mx-40">
          <!-- User Name -->
          <div class="sm:col-span-3 ml-28">
            <label for="user-name" class="block text-lg font-medium leading-6 text-gray-900">User Name</label>
            <div class="mt-2">
              <input v-model="user.userName" type="text" name="user-name" id="user-name" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- Email -->
          <div class="sm:col-span-3 mr-28">
            <label for="email" class="block text-lg font-medium leading-6 text-gray-900">Email</label>
            <div class="mt-2">
              <input v-model="user.email" type="email" name="email" id="email" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- Client Cuid -->
          <div class="sm:col-span-3 ml-28">
            <label for="client-cuid" class="block text-lg font-medium leading-6 text-gray-900">Client Cuid</label>
            <div class="mt-2">
              <input v-model="user.clientCuid" type="text" name="client-cuid" id="client-cuid" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <!-- Role -->
          <div class="sm:col-span-3 mr-28">
            <label for="role" class="block text-lg font-medium leading-6 text-gray-900">Role</label>
            <div class="mt-2">
              <select v-model="user.role" name="role" id="role" class="block w-full bg-gray-200 text-gray-700 border rounded-md py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white">
                <option disabled value="">Please select role</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <!-- Submit Button -->
          <button type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-60 mx-72" @click.prevent="editUser(user)">Apply Edits</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface User {
    id: number | null;
    userName: string | null;
    email: string | null;
    clientCuid: string | null;
    role: string | null;
  }
  
  const user = ref<User>({
    id: null,
    userName: null,
    email: null,
    clientCuid: null,
    role: null
  });
  
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const userId = queryParams.get('id');
  
  const getUser = async () => {
    const response = await fetch(`/api/user/${userId}`);
    const data = await response.json();
    return data;
  };
  
  user.value = await getUser();
  
  /**
  *   @desc Edit user information
  *   @param editedUser Object containing edited user information
  */
  const editUser = async (editedUser: User) => {
    console.log('Edited User:', editedUser);
    let response = null;
    try {
      response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });
  
      if (!response.ok) {
        throw new Error('Failed to edit user.');
      }
  
      console.log('User edited successfully');
      // Optionally, you can redirect the user to a success page or display a success message.
    } catch (error) {
      console.error('Error editing user:', error);
      // Optionally, you can display an error message to the user.
    }
  };
  </script>
  