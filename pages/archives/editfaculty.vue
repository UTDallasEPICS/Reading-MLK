<template lang = "pug">
div(class="text-center")
    .flex.flex-col.gap-5(class="text-center px-10")
        TitleDisplay Faculty Registration Form
        div(class = "text-center px-10 border-solid border border-gray-700 border-2")
        div(class="")
            .py-4.grid(class="" )
                Label * First Name:
                    Input(v-model='data_FacultyProfile.first_name' name="first_name" id="first_name" placeholder="(user defined)" required)
            .py-4.grid(class="" )
                Label * Last Name:
                    Input(v-model='data_FacultyProfile.last_name' name="last_name" id="last_name" placeholder="(user defined)" required)
            .py-4.grid(class="" )
                Label * School District currently working in: 
                    Input(v-model='data_FacultyProfile.district' name="district_teach" id="district_teach" placeholder="(Ex: DISD)" required)
            .py-4.grid(class="" )
                Label * Faculty Email:
                    Input(v-model='data_FacultyProfile.faculty_email' name="faculty_email" id="faculty_email" placeholder="(user defined)" required)
            .py-4.grid(class="" )
                Label * Do you teach a dual language class?
                    select(v-model="data_FacultyProfile.dual_lang" name="dual_lang" id="dual_lang" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500"  placeholder = "(Do you Teach a Bilingual Class)")
                        option(:value="false") Do you Teach a Bilingual Class
                        option(:value="true") Yes
                        option(:value="false") No
            .py-4.grid(class="" )
                Label * School Name:
                    Input(v-model='data_FacultyProfile.school_name' name="school_name" id="school_name" placeholder="(user defined)" required)
            .py-4.grid(class="" )
                Label * Department:
                    Input(v-model='data_FacultyProfile.department' name="department" id="department" placeholder="(Ex: English, Science, or Math)" required)
            .py-4.grid(class="" )
                Label * Phone number:
                    Input(v-model='data_FacultyProfile.phone_number' name="phone_number" id="phone_number" placeholder="(Ex: 1234567891)" required)
            .py-4.grid(class="" )
                Label * Grade you teach:
                    Input(v-model='data_FacultyProfile.grade' name="grade" id="grade" placeholder="(Ex: First, Second, or Pre-K)" required)
    .flex.flex-col.gap-5(class="border-solid border border-gray-700 border-2")
    .flex-col.gap-5(class="py-2")
        Button.mx-auto.text-md(name="Submitt Faculty" @click= "editFaculty(data_FacultyProfile)" class="transition duration-500 bg-blue-500 hover: bg-green-400 rounded-lg px-2 py-2") Apply Edits
</template>

<script setup lang='ts'>
import { ref } from 'vue';
const rhuser = useCookie<any>('rhuser')
const userRole = rhuser.value.role
const data_FacultyProfile = ref(null)
const client_cuid = rhuser.value?.client_cuid || "0";

interface FacultyProfile {
  id: number | null;
  district: number | null;
  dual_lang: boolean | null;
  faculty_email: string | null;
  first_name: string | null;
  last_name: string | null;
  school_name: string | null;
  phone_number: number | null;
  department: string | null;
  grade: string | null;
}

const faculty = ref<FacultyProfile>({
  id: null,
  district: null,     
  dual_lang: false, 
  faculty_email: null,  
  first_name: null,   
  last_name: null,    
  school_name: null,   
  phone_number: null,  
  department: null,    
  grade: null,
});

const url = new URL(window.location.href)
const queryParams = new URLSearchParams(url.search)
const facultyId = queryParams.get('id');
let data_FacultyProfileId = Object.fromEntries(queryParams).id

async function getFaculty() {
  const response = await $fetch(`/api/faculty/${facultyId}`);
  const data = await response.json();
  return data;
}

faculty.value = await getFaculty()

const editFaculty = async (editedFaculty: FacultyProfile) => {
  console.log("Edited Faculty Profile", editFaculty);
  let response = null
  console.log(editedFaculty)
  try{
    response = await fetch('/api/faculty', {
      method: 'PUT',
      headers: {
        'Content Type:' : 'application/json'
      },
      body: JSON.stringify(editedFaculty)
    });

    if (!response.ok){
      throw new Error('Failed to edit the faculty profile');
    }
    console.log("Faculty profile edited successfully");
  }catch(error){
    console.log('Error editing Faculty profile');
  }
  navigateTo('/viewfaculty')
  if(data_FacultyProfile)   data_FacultyProfile.value = await getFaculty()
}

const save = async() =>{
const data = await $fetch('/api/faculty/', {
  method: (client_cuid.value as string) !== "0" ? 'PUT' : 'POST',
})
}

</script>
