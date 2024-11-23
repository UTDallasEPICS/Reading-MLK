<template lang = "pug">
    div(class="text-center")
        .flex.flex-col.gap-5(class="text-center px-10")
            TitleDisplay Edit Faculty
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
            Button.mx-auto.text-md(name="Submitt Faculty" @click= "editFaculty(data_FacultyProfile)" class="transition duration-500 bg-blue-500 hover:bg-green-400 rounded-lg px-2 py-2") Apply Edits
    </template>
    
    <script setup lang='ts'>
    import { ref, onMounted } from 'vue';
    const rhuser = useCookie<any>('rhuser')
    const userRole = rhuser.value.role
    const data_FacultyProfile = ref(null)
    const client_cuid = rhuser.value?.client_cuid || "0";
    
    interface FacultyProfile {
      id: number;
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
    
    const faculty = ref<FacultyProfile>({
      id: 0,
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
    const facultyId = new URLSearchParams(window.location.search).get('id');
    onMounted(async()=>{
        faculty.value = await getFaculty();
    });
    
    async function getFaculty() {
      const response = await $fetch(`/api/faculty/${facultyId}`);
      const data = await response.json();
      return data;
    }
    
    faculty.value = await getFaculty()
    
    const editFaculty = async (editedFaculty: FacultyProfile) => {
      console.log("Edited Faculty Profile", editFaculty);
      console.log(editedFaculty)
      try{
        const response = await fetch('/api/faculty', {
          method: 'PUT',
          headers: {
            'Content-Type:': 'application/json'
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
      if(data_FacultyProfile)   data_FacultyProfile.value = await getFaculty()
      navigateTo('/viewfaculty')
    }
    
    const save = async() =>{
    const data = await $fetch('/api/faculty/', {
      method: (client_cuid.value as string) !== "0" ? 'PUT' : 'POST',
      body: ({...faculty.value, client_cuid: client_cuid.value as string})
    }).catch((error)=>{
      console.log("Error: ",error.data.message);
    });
    console.log(data);
    if (data && (data as any).success){
      await navigateTo('/parent');
    }
    }
    </script>