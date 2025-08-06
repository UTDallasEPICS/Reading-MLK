/**
 * Notes for the person who works on Registration next:
 * flow chart: 
 * user visits emailregister.vue, puts in their email and confirms it with a code
 * after code is verified, email is stored in a cookie variable and sent over to register.vue
 * user gets redirected to register.vue and chooses either student or parent form to fill out and submits
 * IF parent account is chosen, user is redirected to register-children.vue to register their children
 * that page creates child accounts that are linked to the parent account
 * after that, every user type gets redirected to the home page of the app with a screen that asks for a class code
 * 
 * user registration is functional, user verification is not functional (the code thing)
 * checked this with prisma studio
 */

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
            .account-types.grid.grid-cols-1.gap-6(class="md:grid-cols-2")
              
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
              label(for="username" class="text-lg font-semibold text-gray-800 mb-2") Username *
              input#username(
                v-model="data_UserProfile.username"
                type="text" 
                placeholder="Come up with a unique username, for example: johndoe1234." 
                required 
                class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
              )

            .form-element.flex.flex-col
              label(for="first_name" class="text-lg font-semibold text-gray-800 mb-2") First Name *
              input#first_name(
                v-model="data_UserProfile.first_name"
                type="text" 
                placeholder="Enter your first name." 
                required 
                class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
              )

            .form-element.flex.flex-col
              label(for="last_name" class="text-lg font-semibold text-gray-800 mb-2") Last Name *
              input#last_name(
                v-model="data_UserProfile.last_name"
                type="text" 
                placeholder="Enter your last name." 
                required 
                class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
              )

            .form-element.flex.flex-col
              label(for="preferred_name" class="text-lg font-semibold text-gray-800 mb-2") Preferred Name *
              input#preferred_name(
                v-model="data_UserProfile.preferred_name"
                type="text" 
                placeholder="Enter your preferred name." 
                required 
                class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
              )

            .form-element.flex.flex-col
              label(for="birth_date" class="text-lg font-semibold text-gray-800 mb-2") Date of Birth *
              input#birth_date(
              v-model="data_UserProfile.birth_date"
              type="date" 
              required 
              class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
              )

            .form-element.flex.flex-col
              label(for="gender" class="text-lg font-semibold text-gray-800 mb-2") Gender *
              select#gender(
                v-model="data_UserProfile.gender"
                required 
                class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
              )
                option(value="" disabled) Select gender
                option(value="Male") Male
                option(value="Female") Female
                option(value="Other") Other
                option(value="Prefer not to say") Prefer not to say
            
            // Student-specific fields
            template(v-if="selectedAccountType === 'student'")
              .form-element.flex.flex-col
                label(for="school-district" class="text-lg font-semibold text-gray-800 mb-2") School District *
                select#school-district(
                  v-model="selectedDistrict"
                  @change="onDistrictChange"
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
                  option(value="" disabled) Select a school district
                  option(v-for="district in schoolDistricts" :key="district.id" :value="district.id") {{ district.name }}
              
              .form-element.flex.flex-col(v-if="selectedDistrict && filteredSchools.length > 0")
                label(for="school-name" class="text-lg font-semibold text-gray-800 mb-2") School Name *
                select#school-name(
                  v-model="selectedSchool"
                  @change="onSchoolChange"
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
                  option(value="" disabled) Select a school
                  option(v-for="school in filteredSchools" :key="school.id" :value="school.id") {{ school.name }}

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
                  option(value="13") Level 13
                  option(value="14") Level 14
                  option(value="15") Level 15
                  option(value="16") Level 16
              
              .form-element.flex.flex-col
                label(for="preferred-language" class="text-lg font-semibold text-gray-800 mb-2") Preferred Language *
                select#preferred-language(
                  v-model="data_UserProfile.preferred_language"
                  required 
                  class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" 
                )
                  option(value="" disabled) Select preferred language

                  // list of top 10 languages spoken in the world
                  option(value="English") English
                  option(value="Spanish") Spanish
                  option(value="French") French
                  option(value="Chinese") Chinese
                  option(value="Hindi") Hindi
                  option(value="Arabic") Arabic
                  option(value="Russian") Russian
                  option(value="Urdu") Urdu
                  option(value="Bengali") Bengali
                  option(value="Portuguese") Portuguese
                  option(value="Other") Other
            
            // Parent-specific fields
            template(v-if="selectedAccountType === 'parent'")
              .form-element.flex.flex-col
                label(for="zip-code" class="text-lg font-semibold text-gray-800 mb-2") Zip Code *
                input#zip-code(
                  v-model="data_UserProfile.zipcode"
                  type="text" 
                  placeholder="Enter your zip code." 
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
// Track the selected account type and form submission state
const selectedAccountType = ref<string>('')
const isSubmitting = ref(false)

// Cascading dropdown variables
const selectedDistrict = ref('')
const selectedSchool = ref('')

// Sample data (where to find actual data...?)
const schoolDistricts = ref([
  { id: 1, name: "Dallas Independent School District" }
  // other school ISD's go here in the future...
])

const schools = ref([
  // Dallas ISD schools
  { id: 1, name: "Adams High School", districtId: 1 },
  { id: 2, name: "Adamson High School", districtId: 1 },
  { id: 3, name: "Seagoville High School", districtId: 1 },
])


const filteredSchools = computed(() => {
  if (!selectedDistrict.value) return []
  return schools.value.filter(school => school.districtId == selectedDistrict.value)
})


const data_UserProfile = ref({
  // Fields that match User table
  email: "",
  first_name: "",
  last_name: "",
  preferred_name: "",
  gender: "",
  birth_date: "",
  
  // Fields for profile tables
  username: "", // for profile tables
  role: "", // to determine which profile to create
  
  // Student-specific fields (for StudentProfile)
  zipcode: "", // nullable in StudentProfile
  school_dist: "",
  school_name: "", 
  starting_reading_level: "",
  preferred_language: "",
  
  // Parent-specific fields (for ParentProfile) 
  // zipcode is shared with student
})

// Initialize email from cookie on mount
onMounted(() => {
  const emailCookie = useCookie('userEmail')
  const rhuser = useCookie<any>('rhuser')
  
  // Try to get email from either cookie
  if (emailCookie.value) {
    data_UserProfile.value.email = emailCookie.value
    console.log('Email loaded from userEmail cookie:', emailCookie.value)
  } else if (rhuser.value?.email) {
    data_UserProfile.value.email = rhuser.value.email
    console.log('Email loaded from rhuser cookie:', rhuser.value.email)
  } else {
    console.log('No email found in cookies - user may need to go through email verification')
  }
})

// Function to select account type
const selectAccountType = (type: string) => {
  selectedAccountType.value = type
  data_UserProfile.value.role = type
}

// Function to go back to account type selection
const goBack = () => {
  selectedAccountType.value = ''
  // Reset cascading dropdown selections
  selectedDistrict.value = ''
  selectedSchool.value = ''
  // Reset form data but keep email
  const email = data_UserProfile.value.email
  data_UserProfile.value = {
    email: email, // Keep email from cookie
    first_name: "",
    last_name: "",
    preferred_name: "",
    gender: "",
    birth_date: "",
    username: "",
    role: "",
    zipcode: "",
    school_dist: "",
    school_name: "",
    starting_reading_level: "",
    preferred_language: "",
  }
}

// Function called when district changes
const onDistrictChange = () => {
  // Reset school selection when district changes
  selectedSchool.value = ''
  // Update the form data with district name
  const districtName = schoolDistricts.value.find(d => d.id == selectedDistrict.value)?.name || ''
  data_UserProfile.value.school_dist = districtName
  // Clear school name since district changed
  data_UserProfile.value.school_name = ''
}

// Function called when school changes
const onSchoolChange = () => {
  // Update the form data with school name
  const schoolName = schools.value.find(s => s.id == selectedSchool.value)?.name || ''
  data_UserProfile.value.school_name = schoolName
}

// Function to validate required fields based on account type
const validateRequiredFields = () => {
  console.log('Form data:', data_UserProfile.value)
  console.log('Selected account type:', selectedAccountType.value)
  console.log('Selected district:', selectedDistrict.value)
  console.log('Selected school:', selectedSchool.value)
  
  const commonFields = ['first_name', 'last_name', 'preferred_name', 'email', 'username', 'birth_date', 'gender']
  
  // Check common required fields
  for (const field of commonFields) {
    const value = data_UserProfile.value[field as keyof typeof data_UserProfile.value]
    if (!value || value.toString().trim() === '') {
      console.log(`Missing required field: ${field}`)
      alert(`Please fill out the required field: ${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`)
      return false
    }
  }
  
  // Check account-specific required fields
  if (selectedAccountType.value === 'student') {
    const studentFields = ['starting_reading_level', 'preferred_language']
    for (const field of studentFields) {
      const value = data_UserProfile.value[field as keyof typeof data_UserProfile.value]
      if (!value || value.toString().trim() === '') {
        console.log(`Missing required student field: ${field}`)
        alert(`Please fill out the required field: ${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`)
        return false
      }
    }
    // Check if district and school are selected
    if (!selectedDistrict.value || selectedDistrict.value === '') {
      console.log('Missing school district')
      alert('Please select a school district')
      return false
    }
    if (!selectedSchool.value || selectedSchool.value === '') {
      console.log('Missing school selection')
      alert('Please select a school')
      return false
    }
    // Check if school district and name are properly set in form data
    if (!data_UserProfile.value.school_dist || data_UserProfile.value.school_dist.trim() === '') {
      console.log('School district not set in form data')
      alert('Please select a school district')
      return false
    }
    if (!data_UserProfile.value.school_name || data_UserProfile.value.school_name.trim() === '') {
      console.log('School name not set in form data')
      alert('Please select a school')
      return false
    }
  } else if (selectedAccountType.value === 'parent') {
    const parentFields = ['zipcode']
    for (const field of parentFields) {
      const value = data_UserProfile.value[field as keyof typeof data_UserProfile.value]
      if (!value || value.toString().trim() === '') {
        console.log(`Missing required parent field: ${field}`)
        alert(`Please fill out the required field: ${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`)
        return false
      }
    }
  }
  
  console.log('All validation checks passed')
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
    const response = await $fetch('/api/user/register', {
      method: "POST",
      body: {
        userData: {
          email: data_UserProfile.value.email,
          first_name: data_UserProfile.value.first_name,
          last_name: data_UserProfile.value.last_name,
          preferred_name: data_UserProfile.value.preferred_name,
          gender: data_UserProfile.value.gender,
          birth_date: new Date(data_UserProfile.value.birth_date).toISOString(),
        },
        profileData: {
          username: data_UserProfile.value.username,
          role: selectedAccountType.value,
          ...(selectedAccountType.value === 'student' ? {
            zipcode: data_UserProfile.value.zipcode || null,
            school_dist: data_UserProfile.value.school_dist,
            school_name: data_UserProfile.value.school_name,
            starting_reading_level: data_UserProfile.value.starting_reading_level,
            preferred_language: data_UserProfile.value.preferred_language,
          } : {}),
          ...(selectedAccountType.value === 'parent' ? {
            zipcode: data_UserProfile.value.zipcode,
          } : {})
        }
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