
<script lang="ts" setup>
const props = defineProps<{modelValue:Object}>()

const data_ParentProfile=ref({
firstName: "",
lastName: "",
birth_date: "",
zipcode: 0,
phone_number: 0,
email: "", 
social_media: "",
avg_num_book: "",
yearly_income: "",
gender: "",
martial_status: "",
});

const data_StudentProfile=ref([{
first_name: "",
last_name: "",
pref_name: "",
age: 0,
grade: 0,
reading_lvl: 0,
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
        age: 0,
        grade: 0,
        reading_lvl: 0,
        birth_date: "",
        gender: "",
        school_name: "",
        school_dist: "",
        pref_lang: ""
    })
}

const removeStudent = (index: number) => {
    data_StudentProfile.value.splice(index-1, 1);
}

const submittAccounts = async() =>{
    const parentResponse = await $fetch('/api/parent_submit', {
    method: "POST",
    body: {
        parent: data_ParentProfile.value,
        students: data_StudentProfile.value}
    });
    
};
</script>


<template lang = "pug">
Container
    .flex.flex-col.gap-5 
        TitleDisplay Parent Registration Form
        div(style = "border: 2px solid")
        .flex.flex-col.gap-5
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px")
            Label First Name:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.first_name' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px")
            Label Last Name:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.last_name' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px")
            Label Birth Date: (Please give the year you were born)
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.birth_date' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px")
            Label Zipcode: (Please give five digit number for the zipcode area you reside in)
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Inputnum(v-model='data_ParentProfile.zipcode' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px")
            Label Yearly Income: (optional)
            .col-md-9.mx-10(class="sm:col-span-2 sm:m-11")
                Dropdown(v-model="data_StudentProfile.yearly_income" :options=["", "10,000-20,000", "20,000-30,000", "30,000-40,000", "40,000-50,000", "50,000-60,000", "60,000+"] placeholder = "Select your income level") 
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px") 
            Label Phone number:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.phone_number' placeholder="(Ex:1234567899)" required)
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px")
            Label Email:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.Email' placeholder="(Ex:shell12345@gmail.com)" required)
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px")
            Label Password:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.password' placeholder="(user defined)" required )
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px")
            Label Social Media Handle: (Not required)
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.social_media' placeholder="(user defined)")
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px")
            Label On average, how many books do you read per year to your child? (A guess is fine)
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Inputnum(v-model='data_ParentProfile.avg_num_book' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3" style = "padding: 5px")
            Label What is your marital status? (If you do not wish to answer or can't find an answer which matches your situation select Wish not to Disclose or Other respectively)
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Dropdown(v-model="data_StudentProfile.martial_status" :options=["", "Married", "Divorced", "Single", "Other"] placeholder = "Select your Marital Status") 
    .flex.flex-col.gap-5
        TitleDisplay Register Child
            div(style = "border:2px solid ")
            p Please input your child(s) information down below (you do not have to put anything for the optional parts)
        div(v-for="(child, index) in data_StudentProfile" :key="index" style = "border:2px solid blue")
            Childentry(v-model="data_StudentProfile[index]" @remove="removeStudent(index)") 
        Button.mx-auto.text-md(name = "Add Child" @click="addStudent()" class='rounded-md bg-blue-500 hover:bg-green-400 text-black') Add Student
        p
    Button.mx-auto.text-md(name="Submitt accounts" @click="submittAccounts()" class='rounded-md bg-blue-500 hover:bg-green-400 text-black') Submit
</template>