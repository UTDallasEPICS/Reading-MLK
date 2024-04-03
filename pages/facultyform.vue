<script lang = "ts" setup>

const data_FacultyProfile =ref( {

});

const submitFaculty = async () =>{
    
}

</script>


<template lang = "pug">
MLKContainer 
    div 
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






</template>