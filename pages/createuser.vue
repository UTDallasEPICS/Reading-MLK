<template lang="pug">
div
  h2.text-center.text-3xl.font-bold.mt-4(style="margin-top: 35px") Create User Profile
  hr.rounded.center-text(style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px")
  //- Form to create user profile
  form.mt-10(@submit.prevent="createUserProfile")
    //- User Name
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="user-name") User Name
      input(type="text" v-model="userProfile.userName" name="user-name" id="user-name" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg" title="User name must contain at least one uppercase letter, one lowercase letter, and one number. Minimum length is 6 characters.")
    //- Email
    div.mt-4
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="email") Email
      input(type="email" v-model="userProfile.email" name="email" id="email" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Client CUID
    div.mt-4
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="client-cuid") Client CUID
      input(type="text" v-model="userProfile.clientCuid" name="client-cuid" id="client-cuid" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Role
    div.mt-4
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="role") Role
      input(type="text" v-model="userProfile.role" name="role" id="role" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Submit Button
    div.flex.items-center.justify-end.mt-6
      button(type="submit" class="rounded-md bg-blue-500 text-white px-3 py-2 font-semibold shadow-sm hover:bg-indigo-500 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-opacity-50 sm:text-lg") Create User Profile

</template>
  
  <script setup>
  import { ref } from 'vue';
  
  const userProfile = ref({
    userName: '',
    email: '',
    clientCuid: '',
    role: ''
  });
  
  const createUserProfile = async () => {
    try {
      const response = await fetch('/server/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userProfile.value)
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user profile.');
      }
  
      // Optionally, you can redirect the user to a success page or display a success message.
    } catch (error) {
      console.error('Error creating user profile:', error);
      // Optionally, you can display an error message to the user.
    }
  };
  </script>
  