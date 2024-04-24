
<script lang="ts" setup>


const data_ParentProfile = ref({
firstName: "",
lastName: "",
birth_date: "",
zipcode: "",
phone_number: "",
email: "", 
social_media: "",
avg_num_book: "",
yearly_income: "",
gender: "",
martial_status: ""
});

const data_StudentProfile = ref([{
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
Container( class=".bg-sky-400.p-8")
    flex.flex-col.gap-5 
        TitleDisplay Parent Registration Form
    flex.flex-col.gap-5
        .py-4.grid(class="sm:grid-cols-3")
            Label First Name:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.first_name' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Last Name:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.last_name' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Birth Date: (Please give the year you were born)
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.birth_date' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Zipcode: (Please give five digit number for the zipcode area you reside in)
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.zipcode' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3") 
            Label Phone number:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.phone_number' placeholder="(Ex:1234567899)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Email:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.Email' placeholder="(Ex:example12345@gmail.com)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label Password:
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.password' placeholder="(user defined)" required )
        .py-4.grid(class="sm:grid-cols-3")
            Label Social Media Handle: (Not required)
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.social_media' placeholder="(user defined)")
        .py-4.grid(class="sm:grid-cols-3")
            Label On average, how many books do you read per year to your child? (A guess is fine)
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Input(v-model='data_ParentProfile.avg_num_book' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            Label What is your marital status? (If you do not wish to answer or can't find an answer which matches your situation select Wish not to Disclose or Other respectively)
            .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                Dropdown(v-model="data_StudentProfile.martial_status" :options="['Married', 'Divorced', 'Single', 'Other', 'Wish not to Disclose']" ) Select Marital Status
    .flex.flex-col.gap-5
        TitleDisplay Child Registration Section
    flex.flex-col.gap-5
        ChildEntry(v-for="(child, index) in data_StudentProfile" v-model= "data_StudentProfile[index]" @remove="removeStudent(index)")   
        Button.mx-auto.text-md(name = "Add Child" @click="addStudent" class="transition duration-500 bg-sky-600 hover: bg-green-400") Add Student
        
        
.py-4.grid(class="sm:grid-cols-3")
    Button.mx-auto.text-md(name="Submitt accounts" @click= "submittAccounts" class="transition duration-500 bg-sky-600 hover: bg-green-400") Submitt
</template>