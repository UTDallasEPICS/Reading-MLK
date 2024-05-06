<script lang = "ts" setup>

const props = defineProps<{modelValue:any}>()
const emit = defineEmits(["update:modelValue"])

const data_FacultyProfile = ref({          
  school_dist: "",     
  dual_lang: false,      /// True if they are spanish or other language teacher with non-english kids, otherwise false to indicate they are english speaking teachers      
  faculty_email: "",  
  first_name: "",   
  last_name: "",    
  school_name: "",   
  phone_number: "",  
  department: "",    
  grade: "", 
});

const submitFaculty = async () =>{
    const faculty = $fetch('/api/faculty_submit',{
        method: "POST",
        body: {
            faculty: data_FacultyProfile.value
        }
    })
}
</script>


<template lang = "pug">
div
    .flex.flex-col.gap-5
        TitleDisplay Faculty Registration Form
        div(style = "border: 2px solid")
        .py-4.grid(class="sm:grid-cols-3" )
            Label * First Name:
                Input(v-model='data_FacultyProfile.first_name' name="first_name" id="first_name" placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3" )
            Label * Last Name:
                Input(v-model='data_FacultyProfile.last_name' name="last_name" id="last_name" placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3" )
            Label * School District currently working in: 
                Input(v-model='data_FacultyProfile.school_dist' name="school_dist_teach" id="school_dist_teach" placeholder="(Ex: DISD)" required)
        .py-4.grid(class="sm:grid-cols-3" )
            Label * Faculty Email:
                Input(v-model='data_FacultyProfile.faculty_email' name="faculty_email" id="faculty_email" placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3" )
            Label * Do you teach a dual language class?
                select(v-model="data_FacultyProfile.dual_lang" name="dual_lang" id="dual_lang" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500"  placeholder = "Do you Teach a Bilingual Class")
                    option(value='') Do you Teach a Bilingual Class
                    option(value=true) Yes
                    option(value=false) No
        .py-4.grid(class="sm:grid-cols-3" )
            Label * School Name:
                Input(v-model='data_FacultyProfile.school_name' name="school_name" id="school_name" placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3" )
            Label * Department:
                Input(v-model='data_FacultyProfile.department' name="department" id="department" placeholder="(Ex: English, Science, or Math)" required)
        .py-4.grid(class="sm:grid-cols-3" )
            Label * Phone number:
                Input(v-model='data_FacultyProfile.phone_number' name="phone_number" id="phone_number" placeholder="(Ex: 1234567891)" required)
        .py-4.grid(class="sm:grid-cols-3" )
            Label * Grade you teach:
                Input(v-model='data_FacultyProfile.grade' name="grade" id="grade" placeholder="Ex: First, Second, or Pre-K" required)
    div(style = "border: 2px solid")
    .flex.flex-col.gap-5(class="sm: col-span" )
    Button.mx-auto.text-md(name="Submitt Faculty" @click= "submittFaculty()" class="transition duration-500 bg-blue-500 hover: bg-green-400 rounded-lg ") Submitt
    .flex.flex-col.gap-5(class="sm: col-span" style = "padding: 5px;")
</template>