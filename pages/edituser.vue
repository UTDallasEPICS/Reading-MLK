<template>
    <div class="content-center">
      <div class="container content-center" id="form" style="margin: 0 auto">
        <h2 class="text-center text-3xl font-bold mt-6">Edit Users</h2>
        <h3 class="text-center text-s font-bold">Edit volunteer and MTTP employee/admin info, and their permissions</h3>
        <hr class="rounded center-text" style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px">
        <div class="mt-10 grid grid-cols-1 gap-x-24 gap-y-8 sm:grid-cols-6 mx-40">
          <div class="sm:col-span-3 ml-28">
            <label for="user-name" class="block text-lg font-medium leading-6 text-gray-900">User Name</label>
            <div class="mt-2">
              <input v-model="user.user_name" type="text" name="user-name" id="user-name" autocomplete="username" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <div class="sm:col-span-3 mr-28">
            <label for="email" class="block text-lg font-medium leading-6 text-gray-900">Email</label>
            <div class="mt-2">
              <input v-model="user.email" type="text" name="email" id="email" autocomplete="email" class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
            </div>
          </div>
          <div class="sm:col-span-3 ml-28">
            <label for="role" class="block text-lg font-medium leading-6 text-gray-900">Role</label>
            <div class="mt-2">
              <select v-model="user.role" class="block w-full bg-gray-200 text-gray-700 border rounded-md py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white">
                <option disabled value="">Please select role</option>
                <option value="staff">staff</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
          <button type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-60 mx-72" @click.prevent="editUser(user)">Apply Edits</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { navigateTo } from '@roxi/routify';
  import { $fetch } from '@roxi/routify/runtime';
  const user = ref({
    id: null,
    user_name: null,
    email: null,
    role: null
  });
  
  let url = new URL(window.location.href);
  let queryParams = new URLSearchParams(url.search);
  let userId = Object.fromEntries(queryParams).id;
  
  (async () => {
    const users = await getUsers();
    const foundUser = users.find(u => u.id == userId);
    if (foundUser) {
      user.value = foundUser;
    }
  })();
  
  async function getUsers() {
    return await $fetch('/api/user');
  }
  
  async function editUser(editedUser) {
    try {
      const response = await $fetch(`/api/user/${editedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          user_name: editedUser.user_name,
          email: editedUser.email,
          role: editedUser.role
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        navigateTo('/admin');
      } else {
        console.error('Error updating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
  </script>
  