<script lang = "ts" setup>

const data_FacultyProfile = ref({          
  district: "",     
  dual_lang: false,      /// True if they are spanish or other language teacher with non-english kids, otherwise false to indicate they are english speaking teachers      
  faculty_email: "",  
  first_name: "",   
  last_name: "",    
  school_name: "",   
  phone_number: "",  
  department: "",    
  grade: "" 
});

const submitFaculty = async () =>{
    const response = $fetch('/api/person',{
        method: "POST",
        body: data_FacultyProfile.value
    })
}
</script>


<template lang = "pug">
MLKContainer 
    .flex.flex-col.gap-5 
        TitleDisplay Faculty Registration Form
        br
        .py-4.grid(class="sm:grid-cols-3")
            Label First Name:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_FacultyProfile.first_name' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Last Name:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_FacultyProfile.last_name' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label School District currently working in: 
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_FacultyProfile.school_dist' placeholder="(Ex: DISD)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Faculty Email:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_FacultyProfile.faculty_email' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Do you teach a dual language class?
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Dropdown(v-model="data_StudentProfile.dual_lang" :options="[true, false]" required) 
        .py-4.grid(class="sm:grid-cols-3")
            Label School Name:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_FacultyProfile.school_name' placeholder="user defined" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Department:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_FacultyProfile.department' placeholder="(Ex: English, Science, or Math)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Phone number:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_FacultyProfile.phone_number' placeholder="(Ex: 1234567891)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Grade you teach:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_FacultyProfile.grade' placeholder="Ex: First, Second, or Pre-K" required)
    flex.flex-col.gap-5 

    Button.mx-auto.text-md(name="Submitt Faculty" @click= "submittFaculty" class="transition duration-500 bg-sky-600 hover: bg-green-400") Submitt


</template>