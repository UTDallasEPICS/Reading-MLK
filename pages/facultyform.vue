<template lang="pug">
  .centered-container(class="flex justify-center items-center my-[12vh]")
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
        .form-header(class="text-center bg-customBlue p-6 rounded-t-lg text-gray-100")
          h2(class="text-4xl font-medium uppercase tracking-wider") Faculty Registration Form
          .heading-line(class="w-32 h-1 bg-green-400 my-2 mx-auto rounded-sm")
        .form-input(class="grid gap-6 p-8 bg-white rounded-b-lg")
          // Form fields
          .form-element(class="flex flex-col")
            label(for="first-name" class="text-lg font-semibold text-gray-800 mb-2") First Name
            input#first-name(type="text" placeholder="First Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
          
          .form-element(class="flex flex-col")
            label(for="last-name" class="text-lg font-semibold text-gray-800 mb-2") Last Name
            input#last-name(type="text" placeholder="Last Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
          
          .form-element(class="flex flex-col")
            label(for="user-name" class="text-lg font-semibold text-gray-800 mb-2") User Name
            input#user-name(type="text" placeholder="User Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="preferred-name" class="text-lg font-semibold text-gray-800 mb-2") Preferred Name
            input#preferred-name(type="text" placeholder="Preferred Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="email" class="text-lg font-semibold text-gray-800 mb-2") Email
            input#email(type="email" placeholder="Email Address" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
          
          .form-element(class="flex flex-col")
            label(for="phone-number" class="text-lg font-semibold text-gray-800 mb-2") Phone Number
            input#phone-number(type="tel" placeholder="Phone Number" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="school-name" class="text-lg font-semibold text-gray-800 mb-2") School Name
            input#school-name(type="text" placeholder="School Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="school-district" class="text-lg font-semibold text-gray-800 mb-2") School District
            input#school-district(type="text" placeholder="School District" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
          
          .form-element(class="flex flex-col")
            label(for="department-name" class="text-lg font-semibold text-gray-800 mb-2") Department Name
            input#department-name(type="text" placeholder="Department Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex justify-left items-center")
            label(class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600") Dual Language?
            div(class="flex flex-col gap-5 justify-center align-items-center")
              div(class="flex flex-row gap-5 my-2")
                div(class="flex flex-row gap-5 justify-center align-items-center")
                input(type="checkbox" :id="dual_lang + '-toggle'" :name="dual_lang" v-model="selectedOption" class="appearance-none border border-gray-300 rounded-lg w-8 h-7 bg-transparent cursor-pointer checked:bg-customBlue checked:border-transparent focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md")
                label(for="dual_lang + '-toggle'" :class="{'text-teal-600': selectedOption, 'text-gray-700': !selectedOption}" class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600") {{ selectedOption ? "Yes" : "No" }}

        .button-container(class="flex justify-center mt-5")
          button(type="submit" class="submit-button px-5 py-2.5 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-[#1a1a2e]") Submit
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: any }>()
const emit = defineEmits(["update:modelValue"])
const selectedOption = ref(false);
const rhuser = useCookie<any>('rhuser')
const data_FacultyProfile = ref({
  district: "",
  dual_lang: false,      /// True if they are spanish or other language teacher with non-english kids, otherwise false to indicate they are english speaking teachers      
  faculty_email: "",
  first_name: "",
  last_name: "",
  school_name: "",
  phone_number: "",
  department: "",
  grade: "",
  user_id: rhuser.value.id,
});
const dual_lang = computed({
  get() {
    return data_FacultyProfile.value.dual_lang ? true : false
  },
  set(s) {
    data_FacultyProfile.value.dual_lang = Boolean(s)
    console.log(s)
  }
})
const submitFaculty = async () => {
  const faculty = $fetch('/api/faculty/faculty', {
    method: "POST",
    body: {
      faculty: data_FacultyProfile.value
    }
  })
}
</script>