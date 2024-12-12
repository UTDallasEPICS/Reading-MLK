<template lang="pug">
  .centered-container.flex.justify-center.items-center.my-10
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
        
        // Header section
        .form-header.text-center.bg-customBlue.p-6.rounded-t-lg.text-gray-100
          h2.text-4xl.font-medium.uppercase.tracking-wider Sign Up
          .heading-line.w-32.h-1.bg-green-400.my-2.mx-auto.rounded-sm
        
        // Form fields
        .form-input.grid.gap-6.p-8.bg-white.rounded-b-lg
          
          // First Name Field
          .form-element.flex.flex-col
            label(for="first-name" class="text-lg font-semibold text-gray-800 mb-2" required) First Name
            input#first-name(type="text" placeholder="First Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_UserProfile.first_name")
          
          // Last Name Field
          .form-element.flex.flex-col
            label(for="last-name" class="text-lg font-semibold text-gray-800 mb-2" required) Last Name
            input#last-name(type="text" placeholder="Last Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_UserProfile.last_name")
          
          // Username Field
          .form-element.flex.flex-col
            label(for="username" class="text-lg font-semibold text-gray-800 mb-2" required) User Name
            input#username(type="text" placeholder="User Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_UserProfile.user_name")
          
          // Preferred Field
          .form-element.flex.flex-col
            label(for="preferredname" class="text-lg font-semibold text-gray-800 mb-2" optional) Preferred Name
            input#preferredname(type="text" placeholder="Preferred Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_UserProfile.preferred_name")
          
          // Email Field
          .form-element.flex.flex-col
            label(for="email" class="text-lg font-semibold text-gray-800 mb-2" required) Email
            input#email(type="text" placeholder="Email" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_UserProfile.email")
          
          // Assigned Role
          .div(class="flex items-center justify-center  flex-col space-y-3") 
            label(class="block text-xl font-semibold") Assign role as
            .div(class="flex items-baseline space-x-12") 
              .radio-button-group(class="flex items-center space-x-8")
                .radio-button(class="flex items-center space-x-4")
                  input(type="radio" id="dual_lang_faculty" name="dual_lang_group" value="faculty" v-model="data_UserProfile.role" class="appearance-none border border-gray-300 rounded-lg w-8 h-7 bg-transparent cursor-pointer checked:bg-customBlue checked:border-transparent focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md")
                  label(for="dual_lang_faculty" class="text-lg font-medium text-gray-700 hover:text-teal-600") Faculty
                .radio-button(class="flex items-center space-x-4")
                  input(type="radio" id="dual_lang_faculty" name="dual_lang_group" value="parent" v-model="data_UserProfile.role" class="appearance-none border border-gray-300 rounded-lg w-8 h-7 bg-transparent cursor-pointer checked:bg-customBlue checked:border-transparent focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md")
                  label(for="dual_lang_parent" class="text-lg font-medium text-gray-700 hover:text-teal-600") Parent
        // Submit Button
        .button-container(class="flex justify-center mt-5")
          button(
            type="submit"
            @click="handleSubmit"
            class="submit-button px-5 py-2.5 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-[#1a1a2e]") Submit
</template>
<script setup lang="ts">
const rhuser = useCookie<any>('rhuser')

// Define the form data
const data_UserProfile = ref({
  user_name: "df",
  first_name: "df",
  last_name: "df",
  preferred_name: "df",
  email: "df",
  role: "Parent",
})

// Handle the form submission
const handleSubmit = async() => {
  // Log current form data for debugging purposes
  console.log("Submitting User Profile:", data_UserProfile.value);

  // Ensure all required fields are filled out
  if (!data_UserProfile.value.role) {
    console.log("myrole: "+ data_UserProfile.value.role);
        alert("Please fill out all required fields before submitting the form.");
        return;
  }

  // console.log("myroleout: "+ data_UserProfile.value.role);

  try {
    await $fetch('/api/user/user', {
    method: "POST",
    body: {
      user: data_UserProfile.value,
    }
    });
    alert("User successfully registered in the system.");
  } catch(error) {
    console.error('Error submitting user profile:', error);

  }

}
</script>