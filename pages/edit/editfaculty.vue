<template lang = "pug">
    div(class="text-center")
        .flex.flex-col.gap-5(class="text-center px-10")
            TitleDisplay Edit Faculty
            div(class = "text-center px-10 border-solid border border-gray-700 border-2")
            div(class="")
                .py-4.grid(class="" )
                    Label * First Name:
                        Input(v-model='faculty.first_name' name="first_name" id="first_name" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label * Last Name:
                        Input(v-model='faculty.last_name' name="last_name" id="last_name" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label * School District currently working in: 
                        Input(v-model='faculty.district' name="district_teach" id="district_teach" placeholder="(Ex: DISD)" required)
                .py-4.grid(class="" )
                    Label * Faculty Email:
                        Input(v-model='faculty.faculty_email' name="faculty_email" id="faculty_email" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label * Do you teach a dual language class?
                        select(v-model="faculty.dual_lang" name="dual_lang" id="dual_lang" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500"  placeholder = "(Do you Teach a Bilingual Class)")
                            option(:value="false") Do you Teach a Bilingual Class
                            option(:value="true") Yes
                            option(:value="false") No
                .py-4.grid(class="" )
                    Label * School Name:
                        Input(v-model='faculty.school_name' name="school_name" id="school_name" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label * Department:
                        Input(v-model='faculty.department' name="department" id="department" placeholder="(Ex: English, Science, or Math)" required)
                .py-4.grid(class="" )
                    Label * Phone number:
                        Input(v-model='faculty.phone_number' name="phone_number" id="phone_number" placeholder="(Ex: 1234567891)" required)
                .py-4.grid(class="" )
                    Label * Grade you teach:
                        Input(v-model='faculty.grade' name="grade" id="grade" placeholder="(Ex: First, Second, or Pre-K)" required)
        .flex.flex-col.gap-5(class="border-solid border border-gray-700 border-2")
        .flex-col.gap-5(class="py-2")
            Button.mx-auto.text-md(name="Submitt Faculty" @click= "editFaculty(faculty)" class="transition duration-500 bg-blue-500 hover:bg-green-400 rounded-lg px-2 py-2") Apply Edits
    </template>
    
<script setup lang='ts'>
import { ref, onMounted } from 'vue';
const rhuser = useCookie<any>('rhuser')
const userRole = rhuser.value.role
const faculties = ref(null)
const id = rhuser.value?.id;

interface FacultyProfile {
  id: number | null;
  district: string;
  dual_lang: boolean;
  faculty_email: string;
  first_name: string;
  last_name: string;
  school_name: string;
  phone_number: string;
  department: string;
  grade: string;
}

var faculty = ref<FacultyProfile>({
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

const uri = new URL(window.location.href)
const facultyId = (new URLSearchParams(uri.search)).get('id');

onMounted(async()=>{
  if (facultyId) {
    try {
      const fetchedFaculty = await getFaculty();
      faculty.value = fetchedFaculty;
    } catch (error) {
      console.error("Error fetching the faculty data: ", error);
    }
  }
});

// Fetch a faculty profile from the API
async function getFaculty(): Promise<FacultyProfile> {
  try {
    const response = await $fetch<FacultyProfile>(`/api/faculty/${facultyId}`);
    return response;
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    throw error;
  }
}

const editFaculty = async (editedFaculty: FacultyProfile) => {
  console.log("Edited Faculty Profile", editFaculty);
  console.log(editedFaculty)
  let faculty = null;
  try{
    faculty = await $fetch('/api/faculty/faculty', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        //JSON.stringify(editedFaculty)
        id: editedFaculty.id,
        district: editedFaculty.district,
        dual_lang: editedFaculty.dual_lang,
        faculty_email: editedFaculty.faculty_email,
        first_name: editedFaculty.first_name,
        last_name: editedFaculty.last_name,
        school_name: editedFaculty.school_name,
        phone_number: editedFaculty.phone_number,
        department: editedFaculty.department,
        grade: editedFaculty.grade,
      },
    });
    console.log("Faculty profile edited successfully");
  }catch(error){
    console.log('Error editing Faculty profile');
  }
  navigateTo('/viewfaculty')
}

const save = async() =>{
const data = await $fetch<FacultyProfile>('/api/faculty/', {
  method: 'PUT',
  body: ({...faculty.value, id: id.value as string})
}).catch((error)=>{
  console.log("Error: ",error.data.message);
});
console.log(data);
if (data && (data as any).success){
  await navigateTo('/parent');
}
}
</script>