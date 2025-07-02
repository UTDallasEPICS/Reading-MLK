<template lang="pug">
    .centered-container.flex.justify-center.items-center.my-10
      .form
        .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
          
          // Header section
          .form-header.text-center.bg-customBlue.p-6.rounded-t-lg.text-gray-100
            h2.text-4xl.font-medium.uppercase.tracking-wider Sign Up
            .heading-line.w-32.h-1.bg-green-400.my-2.mx-auto.rounded-sm
          
          // Account Type Selection (Step 1)
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
          
          // Dynamic Form Fields (Step 2)
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
                label(for="first-name" class="text-lg font-semibold text-gray-800 mb-2") First Name *
                input#first-name(
                  type="text" 
                  placeholder="Type your legal first name here." 
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
              
              .form-element.flex.flex-col
                label(for="last-name" class="text-lg font-semibold text-gray-800 mb-2") Last Name *
                input#last-name(
                  type="text" 
                  placeholder="Type your legal last name here." 
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
              
              .form-element.flex.flex-col
                label(for="username" class="text-lg font-semibold text-gray-800 mb-2") Username *
                input#username(
                  type="text" 
                  placeholder="Come up with a username and type it here." 
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
              
              .form-element.flex.flex-col
                label(for="preferredname" class="text-lg font-semibold text-gray-800 mb-2") Preferred Name
                input#preferredname(
                  type="text" 
                  placeholder="Type your preferred name here." 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
              
              // Student-specific fields
              template(v-if="selectedAccountType === 'student'")
                .form-element.flex.flex-col
                  label(for="student-id" class="text-lg font-semibold text-gray-800 mb-2") Student ID *
                  input#student-id(
                    type="text" 
                    placeholder="Enter your student ID number." 
                    required 
                    class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                  )
                
                .form-element.flex.flex-col
                  label(for="grade-level" class="text-lg font-semibold text-gray-800 mb-2") Grade Level *
                  select#grade-level(
                    required 
                    class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                  )
                    option(value="" disabled) Select your grade level
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
                  label(for="date-of-birth" class="text-lg font-semibold text-gray-800 mb-2") Date of Birth *
                  input#date-of-birth(
                    type="date" 
                    required 
                    class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                  )
              
              // Parent-specific fields
              template(v-if="selectedAccountType === 'parent'")
                .form-element.flex.flex-col
                  label(for="phone-number" class="text-lg font-semibold text-gray-800 mb-2") Phone Number *
                  input#phone-number(
                    type="tel" 
                    placeholder="Enter your phone number." 
                    required 
                    class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                  )
                
                .form-element.flex.flex-col
                  label(for="emergency-contact" class="text-lg font-semibold text-gray-800 mb-2") Emergency Contact
                  input#emergency-contact(
                    type="text" 
                    placeholder="Enter emergency contact name and phone." 
                    class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                  )
                
                .form-element.flex.flex-col
                  label(for="children-names" class="text-lg font-semibold text-gray-800 mb-2") Children's Names *
                  textarea#children-names(
                    placeholder="Enter the names of your children (one per line)." 
                    required 
                    rows="3"
                    class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                  )
              
              // Faculty-specific fields
              template(v-if="selectedAccountType === 'faculty'")
                .form-element.flex.flex-col
                  label(for="employee-id" class="text-lg font-semibold text-gray-800 mb-2") Employee ID *
                  input#employee-id(
                    type="text" 
                    placeholder="Enter your employee ID number." 
                    required 
                    class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                  )
                
                .form-element.flex.flex-col
                  label(for="position" class="text-lg font-semibold text-gray-800 mb-2") Position *
                  input#position(
                    type="text" 
                    placeholder="Enter your job title/position." 
                    required 
                    class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                  )
                
                .form-element.flex.flex-col
                  label(for="hire-date" class="text-lg font-semibold text-gray-800 mb-2") Hire Date *
                  input#hire-date(
                    type="date" 
                    required 
                    class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                  )
            
            // Submit Button
            .button-container.flex.justify-center.mt-8
              button(
                type="submit"
                @click="handleSubmit"
                class="submit-button px-8 py-3 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-lg font-semibold transition-all duration-300 ease-in-out hover:bg-[#1a1a2e] hover:transform hover:scale-105 shadow-lg"
              ) Create {{ selectedAccountType.charAt(0).toUpperCase() + selectedAccountType.slice(1) }} Account

</template>

<script setup lang="ts">
  const rhuser = useCookie<any>('rhuser')
  
  // Track the selected account type and form step
  const selectedAccountType = ref<string>('')
  
  // Define the form data with fields for all account types
  const data_UserProfile = ref({
    user_name: "",
    first_name: "",
    last_name: "",
    preferred_name: "",
    email: "",
    role: "",
    // Student-specific fields
    student_id: "",
    grade_level: "",
    date_of_birth: "",
    // Parent-specific fields
    phone_number: "",
    emergency_contact: "",
    children_names: "",
    // Faculty-specific fields
    employee_id: "",
    department: "",
    position: "",
    hire_date: ""
  })
  
  // Function to select account type and move to step 2
  const selectAccountType = (type: string) => {
    selectedAccountType.value = type
    data_UserProfile.value.role = type
    // Clear fields that don't apply to this account type
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
      student_id: "",
      grade_level: "",
      date_of_birth: "",
      phone_number: "",
      emergency_contact: "",
      children_names: "",
      employee_id: "",
      department: "",
      position: "",
      hire_date: ""
    }
  }

  // Function to validate required fields based on account type
  const validateRequiredFields = () => {
    const commonFields = ['first_name', 'last_name', 'email', 'user_name']
    
    // Check common required fields
    for (const field of commonFields) {
      if (!data_UserProfile.value[field as keyof typeof data_UserProfile.value]) {
        return false
      }
    }
    
    // Check account-specific required fields
    
    return true
  }
  
  // Handle the form submission
  const handleSubmit = async () => {
    // Log current form data for debugging purposes
    console.log("Submitting User Profile:", data_UserProfile.value)
    
    // Validate required fields
    if (!validateRequiredFields()) {
      alert("Please fill out all required fields before submitting the form.")
      return
    }
    
    try {
      await $fetch('/api/user/user', {
        method: "POST",
        body: {
          user: data_UserProfile.value,
        }
      })
      alert(`${selectedAccountType.value.charAt(0).toUpperCase() + selectedAccountType.value.slice(1)} account successfully created!`)
    } catch (error) {
      console.error('Error submitting user profile:', error)
      alert('Error creating account. Please try again.')
    }
  }
  </script>