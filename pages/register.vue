<template lang="pug">
  .centered-container.flex.justify-center.items-center.my-10
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
        
        // Header section
        .form-header.text-center.bg-customBlue.p-6.rounded-t-lg.text-gray-100
          h2.text-4xl.font-medium.uppercase.tracking-wider Sign Up
          .heading-line.w-32.h-1.bg-green-400.my-2.mx-auto.rounded-sm
        
        // Account Type Selection
        .form-input.p-8.bg-white.rounded-b-lg(v-if="!selectedAccountType")
          .account-type-selection.text-center
            h3.text-2xl.font-semibold.text-gray-800.mb-8 I am a...
            .account-types.grid.grid-cols-1.gap-6(class="md:grid-cols-3")
              
              // Student Account Type
              .account-type-card(
                @click="selectAccountType('student')"
                class="p-6 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:transform hover:scale-105"
              )
                  .icon.text-6xl.mb-6.flex.justify-center.items-center 🧑‍🎓
                  h4.text-2xl.font-semibold.text-gray-800.mb-2.text-center Student
              // Parent Account Type
              .account-type-card(
                @click="selectAccountType('parent')"
                class="p-6 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:transform hover:scale-105"
              )
                .icon.text-6xl.mb-6.flex.justify-center.items-center 🧑‍🧒‍🧒
                h4.text-2xl.font-semibold.text-gray-800.mb-2.text-center Parent
              
              // Faculty Account Type
              .account-type-card(
                @click="selectAccountType('faculty')"
                class="p-6 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:transform hover:scale-105"
              )
                .icon.text-6xl.mb-6.flex.justify-center.items-center 👨‍🏫
                h4.text-2xl.font-semibold.text-gray-800.mb-2.text-center Teacher
        
        // Dynamic Form Fields
        .form-input.p-8.bg-white.rounded-b-lg(v-if="selectedAccountType")
          
          // Back button and selected type indicator
          .flex.justify-between.items-center.mb-6
            button(
              @click="goBack"
              class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            )
              span ← Back
            .selected-type.text-lg.font-semibold.text-gray-700
              span Creating {{ selectedAccountType.charAt(0).toUpperCase() + selectedAccountType.slice(1) }} Account
          
          .grid.gap-6
            
            // Common fields for all account types
            .form-element.flex.flex-col
              label(for="date-of-birth" class="text-lg font-semibold text-gray-800 mb-2") Date of Birth *
              input#date-of-birth(
              v-model="data_UserProfile.date_of_birth"
              type="date" 
              required 
              class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
              )
            
            // Student and Teacher specific fields
            template(v-if="selectedAccountType === 'student' || selectedAccountType === 'faculty'")
              .form-element.flex.flex-col
                label(for="school-district" class="text-lg font-semibold text-gray-800 mb-2") School District *
                input#school-district(
                  v-model="data_UserProfile.school_dist"
                  type="text" 
                  placeholder="Enter your school district." 
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
              
              .form-element.flex.flex-col
                label(for="school-name" class="text-lg font-semibold text-gray-800 mb-2") School Name *
                input#school-name(
                  v-model="data_UserProfile.school_name"
                  type="text" 
                  placeholder="Enter your school name." 
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
            
            // Student-specific fields
            template(v-if="selectedAccountType === 'student'")
              .form-element.flex.flex-col
                label(for="grade-level" class="text-lg font-semibold text-gray-800 mb-2") Starting Reading Level *
                select#grade-level(
                  v-model="data_UserProfile.starting_reading_level"
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
                  option(value="" disabled) Select reading level
                  option(value="Pre-K") Pre-K
                  option(value="K") Kindergarten
                  option(value="1") 1st Grade
                  option(value="2") 2nd Grade
                  option(value="3") 3rd Grade
                  option(value="4") 4th Grade
                  option(value="5") 5th Grade
                  option(value="6") 6th Grade
                  option(value="7") 7th Grade
                  option(value="8") 8th Grade
                  option(value="9") 9th Grade
                  option(value="10") 10th Grade
                  option(value="11") 11th Grade
                  option(value="12") 12th Grade
              
              .form-element.flex.flex-col
                label(for="preferred-language" class="text-lg font-semibold text-gray-800 mb-2") Preferred Language *
                select#preferred-language(
                  v-model="data_UserProfile.preferred_language"
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
                  option(value="" disabled) Select preferred language
                  option(value="English") English
                  option(value="Spanish") Spanish
                  option(value="French") French
                  option(value="Other") Other
            
            // Parent-specific fields
            template(v-if="selectedAccountType === 'parent'")
              .form-element.flex.flex-col
                label(for="phone-number" class="text-lg font-semibold text-gray-800 mb-2") Phone Number *
                input#phone-number(
                  v-model="data_UserProfile.phone_number"
                  type="tel" 
                  placeholder="Enter your phone number." 
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
              
              .form-element.flex.flex-col
                label(for="emergency-contact" class="text-lg font-semibold text-gray-800 mb-2") Emergency Contact
                input#emergency-contact(
                  v-model="data_UserProfile.emergency_contact"
                  type="text" 
                  placeholder="Enter emergency contact name and phone." 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )

              .form-element.flex.flex-col
                label(for="zip-code" class="text-lg font-semibold text-gray-800 mb-2") Zip Code
                input#emergency-contact(
                  v-model="data_UserProfile.zipcode"
                  type="text" 
                  placeholder="Enter the zipcode of your current living space." 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
            
            // Faculty-specific fields
            template(v-if="selectedAccountType === 'faculty'")
              .form-element.flex.flex-col
                label(for="employee-id" class="text-lg font-semibold text-gray-800 mb-2") Employee ID *
                input#employee-id(
                  v-model="data_UserProfile.employee_id"
                  type="text" 
                  placeholder="Enter your employee ID number." 
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
              
              .form-element.flex.flex-col
                label(for="position" class="text-lg font-semibold text-gray-800 mb-2") Position *
                input#position(
                  v-model="data_UserProfile.position"
                  type="text" 
                  placeholder="Enter your job title/position." 
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
              
              .form-element.flex.flex-col
                label(for="hire-date" class="text-lg font-semibold text-gray-800 mb-2") Hire Date *
                input#hire-date(
                  v-model="data_UserProfile.hire_date"
                  type="date" 
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
          
          // Submit Button
          .button-container.flex.justify-center.mt-8
            button(
              type="submit"
              @click="handleSubmit"
              :disabled="isSubmitting"
              class="submit-button px-8 py-3 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-lg font-semibold transition-all duration-300 ease-in-out hover:bg-[#1a1a2e] hover:transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            ) {{ isSubmitting ? 'Creating...' : `Create ${selectedAccountType.charAt(0).toUpperCase() + selectedAccountType.slice(1)} Account` }}

</template>

<script setup lang="ts">
const rhuser = useCookie<any>('rhuser')

// Track the selected account type and form submission state
const selectedAccountType = ref<string>('')
const isSubmitting = ref(false)

// Define the form data with fields for all account types
const data_UserProfile = ref({
  user_name: "",
  first_name: "",
  last_name: "",
  preferred_name: "",
  email: "",
  role: "",
  gender: "",
  zipcode: "",
  school_dist: "",
  school_name: "",
  // Student-specific fields
  starting_reading_level: "",
  preferred_language: "",
  date_of_birth: "",
  // Parent-specific fields
  phone_number: "",
  emergency_contact: "",
  // Faculty-specific fields
  employee_id: "",
  position: "",
  hire_date: ""
})

// Function to select account type
const selectAccountType = (type: string) => {
  selectedAccountType.value = type
  data_UserProfile.value.role = type
}

// Function to go back to account type selection
const goBack = () => {
  selectedAccountType.value = ''
  // Reset form data
  data_UserProfile.value = {
    user_name: "",
    first_name: "",
    last_name: "",
    preferred_name: "",
    email: "",
    role: "",
    gender: "",
    zipcode: "",
    school_dist: "",
    school_name: "",
    starting_reading_level: "",
    preferred_language: "",
    date_of_birth: "",
    phone_number: "",
    emergency_contact: "",
    employee_id: "",
    position: "",
    hire_date: ""
  }
}

// Function to validate required fields based on account type
const validateRequiredFields = () => {
  const commonFields = ['first_name', 'last_name', 'email', 'user_name', 'zipcode']
  
  // Check common required fields
  for (const field of commonFields) {
    if (!data_UserProfile.value[field as keyof typeof data_UserProfile.value]) {
      return false
    }
  }
  
  // Check account-specific required fields
  if (selectedAccountType.value === 'student') {
    const studentFields = ['school_dist', 'school_name', 'starting_reading_level', 'preferred_language', 'date_of_birth']
    for (const field of studentFields) {
      if (!data_UserProfile.value[field as keyof typeof data_UserProfile.value]) {
        return false
      }
    }
  } else if (selectedAccountType.value === 'parent') {
    const parentFields = ['phone_number']
    for (const field of parentFields) {
      if (!data_UserProfile.value[field as keyof typeof data_UserProfile.value]) {
        return false
      }
    }
  } else if (selectedAccountType.value === 'faculty') {
    const facultyFields = ['school_dist', 'school_name', 'employee_id', 'position', 'hire_date']
    for (const field of facultyFields) {
      if (!data_UserProfile.value[field as keyof typeof data_UserProfile.value]) {
        return false
      }
    }
  }
  
  return true
}

// Handle the form submission
const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  // Validate required fields
  if (!validateRequiredFields()) {
    alert("Please fill out all required fields before submitting the form.")
    return
  }
  
  isSubmitting.value = true
  
  try {
    const response = await $fetch('/api/user/user', {
      method: "POST",
      body: {
        user: data_UserProfile.value,
      }
    })
    
    console.log('Response:', response)
    alert(`${selectedAccountType.value.charAt(0).toUpperCase() + selectedAccountType.value.slice(1)} account successfully created!`)
    
    // If parent, redirect to children registration
    if (selectedAccountType.value === 'parent') {
      // Navigate to children registration page
      await navigateTo('/register-children')
    } else {
      // Navigate to dashboard or login
      await navigateTo('/dashboard')
    }
    
  } catch (error) {
    console.error('Error submitting user profile:', error)
    alert('Error creating account. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>