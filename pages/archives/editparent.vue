<template lang="pug">
  .centered-container(class="flex justify-center items-center my-10")
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
        .form-header(class="text-center bg-customBlue p-6 rounded-t-lg text-gray-100")
          h2(class="text-4xl font-medium uppercase tracking-wider") Edit Parent Profile
          .heading-line(class="w-32 h-1 bg-green-400 my-2 mx-auto rounded-sm")
        .form-input(class="grid gap-6 p-8 bg-white rounded-b-lg")
          // Form fields
          .form-element(class="flex flex-col")
            label(for="zipcode" class="text-lg font-semibold text-gray-800 mb-2") Zipcode
            input#zipcode(type="number" v-model="parent.zipcode" placeholder="Zipcode" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="yearly-income" class="text-lg font-semibold text-gray-800 mb-2") Yearly Income
            input#yearly-income(type="text" v-model="parent.yearlyIncome" placeholder="Yearly Income" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="birth-date" class="text-lg font-semibold text-gray-800 mb-2") Birth Date
            input#birth-date(type="date" v-model="parent.birthDate" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="average_number_books" class="text-lg font-semibold text-gray-800 mb-2") Avg. Number of Books Read to Child
            input#average_number_books(type="number" v-model="parent.avgNumBook" placeholder="Avg. Books" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="password" class="text-lg font-semibold text-gray-800 mb-2") Password
            input#password(type="password" v-model="parent.password" placeholder="Password" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="phone-number" class="text-lg font-semibold text-gray-800 mb-2") Phone Number
            input#phone-number(type="tel" v-model="parent.phoneNumber" placeholder="Phone Number" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="gender" class="text-lg font-semibold text-gray-800 mb-2") Gender
            select#gender(v-model="parent.gender" class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
              option(disabled value="") Please select gender
              option(value="Male") Male
              option(value="Female") Female
              option(value="Other") Other

          .form-element(class="flex flex-col")
            label(for="marital-status" class="text-lg font-semibold text-gray-800 mb-2") Marital Status
            select#marital-status(v-model="parent.maritalStatus" class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
              option(disabled value="") Please select marital status
              option(value="Single") Single
              option(value="Married") Married
              option(value="Divorced") Divorced
              option(value="Widowed") Widowed

          .form-element(class="flex flex-col")
            label(for="first-name" class="text-lg font-semibold text-gray-800 mb-2") First Name
            input#first-name(type="text" v-model="parent.firstName" placeholder="First Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="last-name" class="text-lg font-semibold text-gray-800 mb-2") Last Name
            input#last-name(type="text" v-model="parent.lastName" placeholder="Last Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="email" class="text-lg font-semibold text-gray-800 mb-2") Email
            input#email(type="email" v-model="parent.email" placeholder="Email Address" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

        .button-container(class="flex justify-center mt-5")
          button(type="submit" class="submit-button px-5 py-2.5 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-[#1a1a2e]") Submit
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';

var parent = ref({
  id: null,
  zipcode: null,
  yearlyIncome: null,
  birthDate: null,
  avgNumBook: null,
  password: null,
  phoneNumber: null,
  gender: null,
  maritalStatus: null,
  firstName: null,
  lastName: null,
  email: null,
  socialMedia: null
});

const url = new URL(window.location.href);
const queryParams = new URLSearchParams(url.search);
const parentId = queryParams.get('id');

const getParent = async () => {
  const response = await fetch(`/api/parent/${parentId}`);
  const data = await response.json();
  return data;
};

onMounted(async () => {
  const data = await getParent();
});

const editParent = async (editedParent) => {
  console.log('Edited Parent Profile:', editedParent);
  try {
    const response = await fetch('/api/parent', {
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
};

</script>