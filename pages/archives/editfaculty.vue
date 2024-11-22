<template lang="pug">
  .centered-container(class="flex justify-center items-center my-10")
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
        .form-header(class="text-center bg-customBlue p-6 rounded-t-lg text-gray-100")
          h2(class="text-4xl font-medium uppercase tracking-wider") Edit Faculty
          .heading-line(class="w-32 h-1 bg-green-400 my-2 mx-auto rounded-sm")
        .form-input(class="grid gap-6 p-8 bg-white rounded-b-lg")
          
          .form-element(class="flex flex-col")
            label(for="first-name" class="text-lg font-semibold text-gray-800 mb-2") First Name
            input(v-model='data_FacultyProfile.first_name' name="first_name" id="first-name" placeholder="(user defined)" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
          
          .form-element(class="flex flex-col")
            label(for="last-name" class="text-lg font-semibold text-gray-800 mb-2") Last Name
            input(v-model='data_FacultyProfile.last_name' name="last_name" id="last-name" placeholder="(user defined)" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
          
          .form-element(class="flex flex-col")
            label(for="district" class="text-lg font-semibold text-gray-800 mb-2") School District currently working in
            input(v-model='data_FacultyProfile.district' name="district_teach" id="district" placeholder="(Ex: DISD)" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="faculty-email" class="text-lg font-semibold text-gray-800 mb-2") Faculty Email
            input(v-model='data_FacultyProfile.faculty_email' name="faculty_email" id="faculty-email" placeholder="(user defined)" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="dual-lang" class="text-lg font-semibold text-gray-800 mb-2") Do you teach a dual language class?
            select(v-model="data_FacultyProfile.dual_lang" name="dual_lang" id="dual-lang" class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
              option(:value="false") Do you Teach a Bilingual Class
              option(:value="true") Yes
              option(:value="false") No

          .form-element(class="flex flex-col")
            label(for="school-name" class="text-lg font-semibold text-gray-800 mb-2") School Name
            input(v-model='data_FacultyProfile.school_name' name="school_name" id="school-name" placeholder="(user defined)" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="department" class="text-lg font-semibold text-gray-800 mb-2") Department
            input(v-model='data_FacultyProfile.department' name="department" id="department" placeholder="(Ex: English, Science, or Math)" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="phone-number" class="text-lg font-semibold text-gray-800 mb-2") Phone Number
            input(v-model='data_FacultyProfile.phone_number' name="phone_number" id="phone-number" placeholder="(Ex: 1234567891)" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")

          .form-element(class="flex flex-col")
            label(for="grade" class="text-lg font-semibold text-gray-800 mb-2") Grade you teach
            input(v-model='data_FacultyProfile.grade' name="grade" id="grade" placeholder="(Ex: First, Second, or Pre-K)" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
        
        .button-container(class="flex justify-center mt-5")
          button(name="submit" @click="editFaculty(data_FacultyProfile)" class="submit-button px-5 py-2.5 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-[#1a1a2e]") Apply Edits
</template>


<!-- <script setup>
const rhuser = useCookie('rhuser')
const userRole = rhuser.value.role
const data_FacultyProfiles = ref(null)
var data_FacultyProfile = ref({
  id: null,
  district: "",     
  dual_lang: false, 
  faculty_email: "",  
  first_name: "",   
  last_name: "",    
  school_name: "",   
  phone_number: "",  
  department: "",    
  grade: "",
});



const url = new URL(window.location.href);
const queryParams = new URLSearchParams(url.search);
const FacultyProfileId = queryParams.get('id');

async function getFaculty() {
   // Fixed for baseline functionality, horrible example though
   // useFetch, not fetch
   const response = await fetch(`/api/faculty/${FacultyProfileId}`)
   const data = await response.json();
   return data;
}

data_FacultyProfile.value = await getFaculty();


async function editFaculty(editedFaculty) {
  console.log("test")
  let data_FacultyProfile = null
  console.log(editedFaculty)
  if(editedFaculty)
    data_FacultyProfile = await $fetch('/api/faculty/faculty', {
      method: 'PUT',
      body: {
        id: parseInt(editedFaculty.id),
        district: editedFaculty.district,
        dual_lang: editedFaculty.dual_lang,
        faculty_email: editedFaculty.faculty_email,
        first_name: editedFaculty.first_name,
        last_name: editedFaculty.last_name,
        school_name: editedFaculty.school_name,
        phone_number: editedFaculty.phone_number,
        department: editedFaculty.department,
        grade: editedFaculty.grade,
        user_id: editedFaculty.user_id,
      }
    })
  navigateTo('/viewfaculty')
  if(data_FacultyProfile)   data_FacultyProfiles.value = await getFaculty()
}



</script> -->

<script setup>
import { ref, onMounted } from 'vue'
const rhuser = useCookie('rhuser')
const userRole = rhuser.value.role
const data_FacultyProfiles = ref(null)
var data_FacultyProfile = ref({
  id: null,
  district: "",     
  dual_lang: null, 
  faculty_email: "",  
  first_name: "",   
  last_name: "",    
  school_name: "",   
  phone_number: "",  
  department: "",    
  grade: "",
});

// Define FacultyProfileId after the component is mounted
let FacultyProfileId = null;

onMounted(() => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const queryParams = new URLSearchParams(url.search);
    FacultyProfileId = queryParams.get('id');
    if (FacultyProfileId) {
      getFaculty();
    }
  }
});

async function getFaculty() {
  if (FacultyProfileId) {
    const response = await fetch(`/api/faculty/${FacultyProfileId}`);
    const data = await response.json();
    data_FacultyProfile.value = data;
    data_FacultyProfile.value.first_name = data.Faculty.user_name;
    data_FacultyProfile.value.last_name = data.Faculty.user_name;
    // console.log("THIS WASSUP", data);
    // console.log(data_FacultyProfile.value);
  }
}

async function editFaculty(editedFaculty) {
  let data_FacultyProfile = null
  if(editedFaculty)
    data_FacultyProfile = await $fetch('/api/faculty/faculty', {
      method: 'PUT',
      body: {
        id: parseInt(editedFaculty.id),
        district: editedFaculty.district,
        dual_lang: editedFaculty.dual_lang,
        faculty_email: editedFaculty.faculty_email,
        first_name: editedFaculty.Faculty.first_name,
        last_name: editedFaculty.Faculty.last_name,
        school_name: editedFaculty.school_name,
        phone_number: editedFaculty.phone_number,
        department: editedFaculty.department,
        grade: editedFaculty.grade,
        user_id: editedFaculty.user_id,
      }
    })
  navigateTo('/viewfaculty')
  if(data_FacultyProfile) data_FacultyProfiles.value = await getFaculty()
}
</script>
