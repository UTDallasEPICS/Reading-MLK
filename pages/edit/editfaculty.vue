<template lang = "pug">
  div(class="content-center")
      <!-- Submission form for editing faculty profile -->
      .flex.flex-col.gap-5(class="content-center px-10")
        h2.text-center.text-3xl.font-bold.mt-6 Edit Faculty Profile
        hr.rounded.center-text(style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px")

        <!-- Form fields -->
        div(class="mt-10 w-3/5 mx-auto grid grid-cols-1 gap-y-8")
            div(class="")
                .py-4.grid(class="" )
                    Label First Name
                        Input(v-model='faculty.first_name' name="first_name" id="first_name" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label Last Name
                        Input(v-model='faculty.last_name' name="last_name" id="last_name" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label School District currently working in
                        Input(v-model='faculty.district' name="district_teach" id="district_teach" placeholder="(Ex: DISD)" required)
                .py-4.grid(class="" )
                    Label Faculty Email
                        Input(v-model='faculty.faculty_email' name="faculty_email" id="faculty_email" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label Do you teach a dual language class?
                        select(v-model="faculty.dual_lang" name="dual_lang" id="dual_lang" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500"  placeholder = "(Do you Teach a Bilingual Class)")
                            option(:value="false") Do you Teach a Bilingual Class
                            option(:value="true") Yes
                            option(:value="false") No
                .py-4.grid(class="" )
                    Label School Name
                        Input(v-model='faculty.school_name' name="school_name" id="school_name" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label Department
                        Input(v-model='faculty.department' name="department" id="department" placeholder="(Ex: English, Science, or Math)" required)
                .py-4.grid(class="" )
                    Label Phone number
                        Input(v-model='faculty.phone_number' name="phone_number" id="phone_number" placeholder="(Ex: 1234567891)" required)
                .py-4.grid(class="" )
                    Label Grade you teach
                        Input(v-model='faculty.grade' name="grade" id="grade" placeholder="(Ex: First, Second, or Pre-K)" required)
      .flex
           button(type="button" class="rounded mb-4 bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-60 mx-auto" @click="editFaculty(faculty)") Apply Edits
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
  console.log("editFaculty triggered");
  console.log("Edited Faculty Profile", editedFaculty);

  try {
    const response = await $fetch(`/api/faculty/${facultyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: editedFaculty,
    });

    console.log("Faculty profile edited successfully", response);
    await navigateTo(`/viewfaculty?id=${facultyId}`);
  } catch (error: any) {
    console.error("Error editing Faculty profile:", error?.data?.message || error);
  }
};

const save = async () => {
  const data = await $fetch<FacultyProfile>(`/api/faculty/${id.value}`, {
    method: 'PUT',
    body: faculty.value
  }).catch((error) => {
    console.log("Error: ", error.data.message);
  });

  console.log(data);

  if (data && (data as any).success) {
    await navigateTo('/faculty');
  }
};
</script>