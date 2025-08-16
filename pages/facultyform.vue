<template lang="pug">
  .centered-container(class="flex justify-center items-center my-[5vh]")
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
        .form-header(class="text-center bg-customBlue p-6 rounded-t-lg text-gray-100")
          h2(class="text-4xl font-medium uppercase tracking-wider") Faculty Registration Form
          .heading-line(class="w-32 h-1 bg-green-400 my-2 mx-auto rounded-sm")

        // ---------------- Faculty Profile Fields ----------------
        .form-input(class="grid gap-6 p-8 bg-white rounded-b-lg")
          // Faculty contact email (stored on FacultyProfile)
          .form-element(class="flex flex-col")
            label(for="faculty_email" class="text-lg font-semibold text-gray-800 mb-2") Faculty Contact Email
            input#faculty_email(
              type="email"
              placeholder="Email Address"
              required
              class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
              v-model="faculty.faculty_email"
            )

          .form-element(class="flex flex-col")
            label(for="phone-number" class="text-lg font-semibold text-gray-800 mb-2") Phone Number
            input#phone-number(
              type="tel"
              placeholder="Phone Number"
              required
              class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
              v-model="faculty.phone_number"
            )

          .form-element(class="flex flex-col")
            label(for="school-name" class="text-lg font-semibold text-gray-800 mb-2") School Name
            input#school-name(
              type="text"
              placeholder="School Name"
              required
              class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
              v-model="faculty.school_name"
            )

          .form-element(class="flex flex-col")
            label(for="school-district" class="text-lg font-semibold text-gray-800 mb-2") School District
            input#school-district(
              type="text"
              placeholder="School District"
              required
              class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
              v-model="faculty.district"
            )

          .form-element(class="flex flex-col")
            label(for="department-name" class="text-lg font-semibold text-gray-800 mb-2") Department Name
            input#department-name(
              type="text"
              placeholder="Department Name"
              required
              class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
              v-model="faculty.department"
            )

          .form-element(class="flex flex-col")
            label(for="grade" class="text-lg font-semibold text-gray-800 mb-2") Grade
            input#grade(
              type="text"
              placeholder="Grade"
              required
              class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
              v-model="faculty.grade"
            )

          .form-element(class="flex items-center gap-4")
            label(for="dual_lang_toggle" class="text-lg font-semibold text-gray-700 mb-0 transition-all duration-300 ease-in-out transform hover:text-teal-600") Dual Language?
            input#dual_lang_toggle(
              type="checkbox"
              v-model="faculty.dual_lang"
              class="appearance-none border border-gray-300 rounded-lg w-8 h-7 bg-transparent cursor-pointer checked:bg-customBlue checked:border-transparent focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md"
            )
            span(:class="{'text-teal-600': faculty.dual_lang, 'text-gray-700': !faculty.dual_lang}" class="text-lg font-semibold") {{ faculty.dual_lang ? "Yes" : "No" }}

        // ---------------- Link / Create User Section ----------------
        .form-input(class="grid gap-6 p-8 bg-white rounded-b-lg border-t border-gray-200")
          h3(class="text-2xl font-semibold text-gray-800") Link a User
          .flex.gap-6.items-center
            label(class="flex items-center gap-2")
              input(type="radio" name="userMode" :value="true" v-model="createNewUser")
              span Create new user
            label(class="flex items-center gap-2")
              input(type="radio" name="userMode" :value="false" v-model="createNewUser")
              span Link existing user

          // New-user fields
          .grid.gap-6(v-if="createNewUser")
            .form-element.flex.flex-col
              label(for="nu_user_name" class="text-lg font-semibold text-gray-800 mb-2") Username
              input#nu_user_name(
                type="text"
                placeholder="e.g. jsmith23"
                required
                class="p-3 text-base border border-gray-300 rounded-sm focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                v-model="newUser.user_name"
              )
            .form-element.flex.flex-col
              label(for="nu_first_name" class="text-lg font-semibold text-gray-800 mb-2") First Name
              input#nu_first_name(
                type="text"
                required
                class="p-3 text-base border border-gray-300 rounded-sm focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                v-model="newUser.first_name"
              )
            .form-element.flex.flex-col
              label(for="nu_last_name" class="text-lg font-semibold text-gray-800 mb-2") Last Name
              input#nu_last_name(
                type="text"
                required
                class="p-3 text-base border border-gray-300 rounded-sm focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                v-model="newUser.last_name"
              )
            .form-element.flex.flex-col
              label(for="nu_email" class="text-lg font-semibold text-gray-800 mb-2") User Login Email
              input#nu_email(
                type="email"
                placeholder="user@school.org"
                required
                class="p-3 text-base border border-gray-300 rounded-sm focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                v-model="newUser.email"
              )

          // Existing user id
          .grid.gap-6(v-else)
            .form-element.flex.flex-col
              label(for="existing_user_id" class="text-lg font-semibold text-gray-800 mb-2") Existing User ID
              input#existing_user_id(
                type="number"
                placeholder="Enter existing user_id"
                required
                class="p-3 text-base border border-gray-300 rounded-sm focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                v-model.number="existingUserId"
              )

        .button-container(class="flex justify-center mt-5")
          button(
            type="submit"
            @click.prevent="handleSubmit"
            class="submit-button px-5 py-3 bg-customBlue text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md"
          ) Submit
</template>


<script lang="ts" setup>
import { ref, computed } from 'vue'

// UI state: choose how to link the faculty profile
// true  -> create a new user
// false -> connect to an existing user (you provide user_id)
const createNewUser = ref(true)

// Form data for the faculty profile itself
const faculty = ref({
  faculty_email: '',
  phone_number: '',
  school_name: '',
  district: '',
  department: '',
  grade: '',
  dual_lang: false,
})

// NEW USER fields (used when createNewUser = true)
const newUser = ref({
  user_name: '',
  first_name: '',
  last_name: '',
  email: '', // login email for the new user (NOT faculty_email)
})

// EXISTING USER id (used when createNewUser = false)
const existingUserId = ref<number | null>(null)

// Basic required checks for the profile side
const profileValid = computed(() =>
  faculty.value.faculty_email &&
  faculty.value.phone_number &&
  faculty.value.school_name &&
  faculty.value.district &&
  faculty.value.department &&
  faculty.value.grade
)

// Basic required checks for whichever user branch is chosen
const userBranchValid = computed(() => {
  if (createNewUser.value) {
    const u = newUser.value
    return u.user_name && u.first_name && u.last_name && u.email
  } else {
    return Number.isFinite(existingUserId.value as number)
  }
})

const handleSubmit = async () => {
  if (!profileValid.value) {
    alert('Please fill out all required profile fields.')
    return
  }
  if (!userBranchValid.value) {
    alert(
      createNewUser.value
        ? 'Please provide user_name, first_name, last_name, and email for the new user.'
        : 'Please select or enter a valid existing user ID.'
    )
    return
  }

  // Build the payload for exactly one branch
  const payload: Record<string, any> = {
    // faculty profile fields
    ...faculty.value,
  }

  if (createNewUser.value) {
    // create a new user in the backend
    Object.assign(payload, {
      user_name: newUser.value.user_name,
      first_name: newUser.value.first_name,
      last_name: newUser.value.last_name,
      email: newUser.value.email,
    })
  } else {
    // connect to an existing user
    payload.user_id = Number(existingUserId.value)
  }

  try {
    const res = await $fetch('/api/faculty/faculty', {
      method: 'POST',
      body: payload,
    })
    console.log('Created faculty:', res)
    alert('Faculty successfully registered in the system.')
    // Optionally clear the form here
  } catch (err: any) {
    console.error('Error submitting faculty form:', err)
    alert(err?.data?.statusMessage || 'Failed to register faculty. Please try again later.')
  }
}
</script>