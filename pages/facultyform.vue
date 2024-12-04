

<template lang="pug">
  .centered-container(class="flex justify-center items-center my-10")
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
        .form-header(class="text-center bg-customBlue p-6 rounded-t-lg text-gray-100")
          h2(class="text-4xl font-medium uppercase tracking-wider") Faculty Registration Form
          .heading-line(class="w-32 h-1 bg-green-400 my-2 mx-auto rounded-sm")
        .form-input(class="grid gap-6 p-8 bg-white rounded-b-lg")
          // Form fields
          
          .form-element(class="flex flex-col")
            label(for="email" class="text-lg font-semibold text-gray-800 mb-2") Email
            input#email(type="email" placeholder="Email Address" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_FacultyProfile.faculty_email")
          .form-element(class="flex flex-col")
            label(for="phone-number" class="text-lg font-semibold text-gray-800 mb-2") Phone Number
            input#phone-number(type="tel" placeholder="Phone Number" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_FacultyProfile.phone_number")
          .form-element(class="flex flex-col")
            label(for="school-name" class="text-lg font-semibold text-gray-800 mb-2") School Name
            input#school-name(type="text" placeholder="School Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_FacultyProfile.school_name")
          .form-element(class="flex flex-col")
            label(for="school-district" class="text-lg font-semibold text-gray-800 mb-2") School District
            input#school-district(type="text" placeholder="School District" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_FacultyProfile.district")
          .form-element(class="flex flex-col")
            label(for="department-name" class="text-lg font-semibold text-gray-800 mb-2") Department Name
            input#department-name(type="text" placeholder="Department Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_FacultyProfile.department")
          .form-element(class="flex flex-col")
            label(for="grade" class="text-lg font-semibold text-gray-800 mb-2") Grade
            input#grade(type="text" placeholder="Grade" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_FacultyProfile.grade")
          .checkbox(class="flex items-center mt-4")
            input(type="checkbox" id="dual_lang" name="dual_lang" value="true" class="w-5 h-5 mr-2 cursor-pointer" v-model="data_FacultyProfile.dual_lang")
            label(for="dual_lang" class="text-lg font-semibold text-gray-800") Dual Language Teacher?
        .button-container(class="flex justify-center mt-5")
          button(
            type="submit" 
            @click="handleSubmit"
            class="submit-button px-5 py-3 bg-customBlue text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md"
          ) Submit
          
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useCookie } from '#imports'

const rhuser = useCookie<any>('rhuser')

// Define the form data
const data_FacultyProfile = ref({
  faculty_email: "",
  phone_number: "",
  school_name: "",
  district: "",
  department: "",
  grade: "",
  dual_lang: false,
  user_id: rhuser.value?.id ?? null,
});

// Handle the form submission
const handleSubmit = async () => {
  // Log current form data for debugging purposes
  console.log("Submitting Faculty Profile:", data_FacultyProfile.value);

  // Ensure all required fields are filled out
  if (!data_FacultyProfile.value.faculty_email ||
      !data_FacultyProfile.value.phone_number ||
      !data_FacultyProfile.value.school_name ||
      !data_FacultyProfile.value.district ||
      !data_FacultyProfile.value.department ||
      !data_FacultyProfile.value.grade) {
    alert("Please fill out all required fields before submitting the form.");
    return;
  }
  
  
    await $fetch('/api/faculty/faculty', {
      method: "POST",
      body: {
        faculty: data_FacultyProfile.value,
      }
    });
    alert("Faculty successfully registered in the system.");
   /*catch (error) {
    console.error("Error submitting faculty form:", error);
    alert("Failed to register faculty. Please try again later.");
  } */
}
</script>
