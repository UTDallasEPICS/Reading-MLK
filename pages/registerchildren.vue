<!-- 
parents register their children after making an account of their own
-->
<template lang="pug">
    .centered-container.flex.justify-center.items-center.my-10
      .form
        .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
          
          // Header section
          .form-header.text-center.bg-customBlue.p-6.rounded-t-lg.text-gray-100
            h2.text-4xl.font-medium.uppercase.tracking-wider Register Children
            .heading-line.w-32.h-1.bg-green-400.my-2.mx-auto.rounded-sm
          
          // Form fields
          .form-input.grid.gap-6.p-8.bg-white.rounded-b-lg
            
            // Children Already Registered Button
            .button-container(class="flex justify-center mt-5", v-if="children.length > 0")
              button(
                
                class="submit-button px-5 py-2.5 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-[#1a1a2e]") My Children are Already Registered. (Skip this step)

            // School Field
            .form-element.flex.flex-col
              label(for="school" class="text-lg font-semibold text-gray-800 mb-2" required) School
              input#school(type="text" placeholder="School" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
            
            // School District Field
            .form-element.flex.flex-col
              label(for="school-district" class="text-lg font-semibold text-gray-800 mb-2" required) School District
              input#school-district(type="text" placeholder="Last Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

            

            // Children Forms (max 10)
            .children-container.space-y-8
              .child-form(
                v-for="(child, index) in children" 
                :key="index"
                class="border border-gray-200 rounded-lg p-6 bg-gray-50 relative"
              )
                // Remove Child Button
                button(
                  type="button"
                  @click="removeChild(index)"
                  class="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full border-0 cursor-pointer text-sm transition-all duration-300 ease-in-out hover:bg-red-600 flex items-center justify-center"
                  v-if="children.length > 1"
                )
                
                // Child Header
                .child-header.mb-4
                  h3.text-xl.font-semibold.text-gray-800 Child {{ index + 1 }}
                
                // Child Fields Grid
                .child-fields(class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4")

                  
                  // First Name
                  .form-element.flex.flex-col
                    label(:for="`first-name-${index}`" class="text-sm font-semibold text-gray-800 mb-2") First Name *
                    input(
                      :id="`first-name-${index}`"
                      type="text" 
                      placeholder="First Name" 
                      required 
                      class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                    )
                  
                  // Last Name
                  .form-element.flex.flex-col
                    label(:for="`last-name-${index}`" class="text-sm font-semibold text-gray-800 mb-2") Last Name *
                    input(
                      :id="`last-name-${index}`"
                      type="text" 
                      placeholder="Last Name" 
                      required 
                      class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                    )
                  
                  // Preferred Name
                  .form-element.flex.flex-col
                    label(:for="`preferred-name-${index}`" class="text-sm font-semibold text-gray-800 mb-2") Preferred Name
                    input(
                      :id="`preferred-name-${index}`"
                      type="text" 
                      placeholder="Preferred Name" 
                      class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                    )
                  
                  // Birth Date Picker
                  .form-element.flex.flex-col
                    label(:for="`birth-date-${index}`" class="text-sm font-semibold text-gray-800 mb-2") Birth Date *
                    input(
                      :id="`birth-date-${index}`"
                      type="date" 
                      required 
                      class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                    )
                  
                  // Reading Level Options
                  .form-element.flex.flex-col
                    label(:for="`reading-level-${index}`" class="text-sm font-semibold text-gray-800 mb-2") Reading Level
                    select(
                      :id="`reading-level-${index}`"
                      class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                    )
                      option(value="") Select Reading Level
                      option(value="Pre-K") Pre-K
                      option(value="Kindergarten") Kindergarten
                      option(value="1st Grade") 1st Grade
                      option(value="2nd Grade") 2nd Grade
                      option(value="3rd Grade") 3rd Grade
                      option(value="4th Grade") 4th Grade
                      option(value="5th Grade") 5th Grade
                      option(value="6th Grade") 6th Grade
                      option(value="7th Grade") 7th Grade
                      option(value="8th Grade") 8th Grade
                      option(value="9th Grade") 9th Grade
                      option(value="10th Grade") 10th Grade
                      option(value="11th Grade") 11th Grade
                      option(value="12th Grade") 12th Grade
                  
                  // Grade Level Options
                  .form-element.flex.flex-col
                    label(:for="`grade-${index}`" class="text-sm font-semibold text-gray-800 mb-2") Grade *
                    select(
                      :id="`grade-${index}`"
                      required 
                      class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                    )
                      option(value="") Select Grade
                      option(value="Pre-K") Pre-K
                      option(value="Kindergarten") Kindergarten
                      option(value="1st Grade") 1st Grade
                      option(value="2nd Grade") 2nd Grade
                      option(value="3rd Grade") 3rd Grade
                      option(value="4th Grade") 4th Grade
                      option(value="5th Grade") 5th Grade
                      option(value="6th Grade") 6th Grade
                      option(value="7th Grade") 7th Grade
                      option(value="8th Grade") 8th Grade
                      option(value="9th Grade") 9th Grade
                      option(value="10th Grade") 10th Grade
                      option(value="11th Grade") 11th Grade
                      option(value="12th Grade") 12th Grade
                  
                  // Gender Picker
                  .form-element.flex.flex-col
                    label(:for="`gender-${index}`" class="text-sm font-semibold text-gray-800 mb-2") Gender *
                    select(
                      :id="`gender-${index}`"
                      required 
                      class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
                    )
                      option(value="") Select Gender
                      option(value="Male") Male
                      option(value="Female") Female
                      option(value="Non-binary") Non-binary
                      option(value="Prefer not to say") Prefer not to say

            // Add Child Button
            .add-child-section.mb-6.text-center(v-if="children.length < 10")
              button(
                type="button"
                @click="addChild"
                class="px-6 py-3 bg-green-600 text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-green-700"
              ) + Add Child



          // Submit Button
          .button-container(class="flex justify-center mt-5", v-if="children.length > 0")
            button(
              type="submit"
              @click="handleSubmit"
              class="submit-button px-5 py-2.5 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-[#1a1a2e]") Submit
  </template>
  <script setup lang="ts">
  const rhuser = useCookie<any>('rhuser')
  
  // Define the child interface
    interface Child {
      first_name: string
      last_name: string
      preferred_name: string
      birth_date: string
      reading_level: string
      grade: string
      gender: string
    }

// Initialize with one empty child
    const children = ref([
    {
        first_name: "",
        last_name: "",
        preferred_name: "",
        birth_date: "",
        reading_level: "",
        grade: "",
        gender: ""
    }
    ])

    // Add a new child (max 10)
    const addChild = () => {
        if (children.value.length < 10) {
            children.value.push({
            first_name: "",
            last_name: "",
            preferred_name: "",
            birth_date: "",
            reading_level: "",
            grade: "",
            gender: ""
        })
    }
    }

    //Remove a child
    const removeChild = (index: number) => {
        if (children.value.length > 1) {
            children.value.splice(index, 1);
        } else {
            alert("At least one child must be registered.");
        }
    }


// Handle the form submission
const handleSubmit = async() => {
  console.log("Submitting Children:", children.value);
  
  // For now, just show an alert
  alert("Form submitted!");
}
  </script>