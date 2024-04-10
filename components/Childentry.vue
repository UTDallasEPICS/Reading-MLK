<script lang="ts" setup>


const data_StudentProfile = ref ([{
    first_name: "",
    last_name: "",
    pref_name: "",
    age: "",
    grade: "",
    reading_lvl: "",
    birth_date: "",
    gender: "",
    school_name: "",
    school_dist: "",
    pref_lang: ""

}]);


const addStudent = () => {
     data_StudentProfile.value.push({
    first_name: "",
    last_name: "",
    pref_name: "",
    age: "",
    grade: "",
    reading_lvl: "",
    birth_date: "",
    gender: "",
    school_name: "",
    school_dist: "",
    pref_lang: ""
    })
}
</script>

<template lang = "pug">
Container
        div 
            TitleDisplay Register Child 
            p Please input your child(s) information down below (you do not have to put anything for the optional parts)
            br
            .py-4.grid(class="sm: col-span")
                Label First Name: 
                .col-md-9.mx-10(class="sm:grid-cols-3")
                    Input(v-model='data_StudentProfile.first_name' placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                Label Last Name: 
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='data_StudentProfile.last_name' placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                Label What is your child's preferred name?
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='data_StudentProfile.pref_name' placeholder="(user defined)" required) 
            .py-4.grid(class="sm: col-span")
                Label What is the age of the child?
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='data_StudentProfile.age' placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                Label What is the current grade level of the child?
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='data_StudentProfile.grade' placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                label What is the current readling level of the child? (give in a scale of 0 to 10)
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='data_StudentProfile.reading_lvl' placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                label Birth date of child: 
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='data_StudentProfile.birth_date' placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                label Gender:
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Dropdown(v-model="data_StudentProfile.gender" :options="['Male', 'Female', 'Wish not to Disclose']" required)
            .py-4.grid(class="sm: col-span")
                Label School Name:
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='data_StudentProfile.school_name' placeholder="(ex: SunnyVale Elementary)" required)
            .py-4.grid(class="sm: col-span")
                Label School District:
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='data_StudentProfile.school_dist' placeholder="(ex: SISD)" required)
</template>