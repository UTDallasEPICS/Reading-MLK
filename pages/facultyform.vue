<script lang = "ts" setup>

const props = defineProps<{modelValue:any}>()
const emit = defineEmits(["update:modelValue"])
const cvuser = useCookie<any>('cvuser')
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
  user_id: cvuser.value?.id,
});
const dual_lang = computed({
  get() {
    return data_FacultyProfile.value.dual_lang ? "true" : ''
  },
  set(s: string) {
    data_FacultyProfile.value.dual_lang =Boolean(s)
    console.log(s)
  }
})
const submitFaculty = async () =>{
    const faculty = $fetch('/api/faculty/faculty',{
        method: "POST",
        body: {
            faculty: data_FacultyProfile.value
        }
    })
}
</script>


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
                    Input(v-model='data_FacultyProfile.district' name="school_dist_teach" id="school_dist_teach" placeholder="(Ex: DISD)" required)
            .py-4.grid(class="" )
                Label * Faculty Email:
                    Input(v-model='data_FacultyProfile.faculty_email' name="faculty_email" id="faculty_email" placeholder="(user defined)" required)
            .py-4.grid(class="" )
                Label * Do you teach a dual language class?
                    Input(type="checkbox" v-model="dual_lang" name="dual_lang" id="dual_lang" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500"  placeholder = "(Do you Teach a Bilingual Class)" required)
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
        Button.mx-auto.text-md(name="Submitt Faculty" @click= "submitFaculty()" class="transition duration-500 bg-blue-500 hover: bg-green-400 rounded-lg px-2 py-2") Submit
</template>