
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
div
    .flex.gap-5
        .flex.flex-col.gap-5.margin-auto(class="w-1/2 text-center")
            TitleDisplay Parent Registration Form
            div(class="border border-gray-700")
            div(class="border border-gray-700 rounded-lg px-10")
                .py-4.grid(class="" )
                    Label * First Name:
                        Input(type="text" v-model='data_ParentProfile.first_name' name="first_name" id="first_name" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label * Last Name:
                        Input(type="text" v-model='data_ParentProfile.last_name' name="last_name" id="last_name" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label * Birth Date:
                        Input(type="date" v-model='data_ParentProfile.birth_date' name="birth_date" id="birth_date" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label * Zipcode: 
                        Inputnum(type="number" v-model='data_ParentProfile.zipcode' name="zipcode" id="zipcode" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label Yearly Income:
                        select(v-model="data_StudentProfile.yearly_income"  name="yearly_income" id="yearly_income" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500" placeholder = "Select your income level")
                            option(value='') Select your income level
                            option(value='$10,000-$20,000') $10,000-$20,000
                            option(value='$20,000-$30,000') $20,000-$30,000
                            option(value='$30,000-$40,000') $30,000-$40,000
                            option(value='$40,000-$50,000') $40,000-$50,000
                            option(vlaue='$50,000-$60,000') $50,000-$60,000
                            option(value='$60,000+') $60,000+
                .py-4.grid(class="" ) 
                    Label * Phone number:
                        Input(type="text" v-model='data_ParentProfile.phone_number' name="phone_number" id="phone_number" placeholder="(Ex:1234567899)" required)
                .py-4.grid(class="" )
                    Label * Email:
                        Input(type="text" v-model='data_ParentProfile.Email' name="email" id="email" placeholder="(Ex:shell12345@gmail.com)" required)
                .py-4.grid(class="" )
                    Label * Password:
                        Input(type="text" v-model='data_ParentProfile.password' name="password" id="password" placeholder="(user defined)" required )
                .py-4.grid(class="" )
                    Label Social Media Handle:
                        Input(type="text" v-model='data_ParentProfile.social_media' name="social_media_handle" id="social_media_handle" placeholder="(user defined)")
                .py-4.grid(class="" )
                    Label * On average, how many books do you read per year to your child? (A guess is fine)
                        Inputnum(type="number" v-model='data_ParentProfile.avg_num_book' name="avg_num_books" id="avg_num_books" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label What is your marital status?
                        select(v-model="data_StudentProfile.martial_status" name='marital_stat' id="marital_stat" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500" placeholder = "Select your Marital Status")
                            option(value='') Select your Marital Status 
                            option(value='Married') Married
                            option(value='Single') Single
                            option(value='Divorced') Divorced
                            option(value='Other') Other
        .flex.flex-col.gap-5
            TitleDisplay Register Child
                div(class="border border-gray-700")
                p Please input your child(s) information down below (you do not have to put anything for the optional parts)
            div(v-for="(child, index) in data_StudentProfile" :key="index" class="border border-gray-700 rounded-lg")
                Childentry(v-model="data_StudentProfile[index]" @remove="removeStudent(index)")
            .flex.flex-col.gap-5(class="") 
            Button.mx-auto.text-md(name = "Add Child" @click="addStudent()" class='bg-sky-400 hover:bg-sky-400 text-black border border-sky-400 rounded-lg ') Add Student
    .flex.flex-col.gap-5(class="text-center border border-gray-700 text-center")
    .flex.gap-5(class="object-center	")
        Button.mx-auto.text-md(name="Submitt accounts" @click="submittAccounts()" class='bg-green-400 hover:bg-green-400 text-black rounded-lg ') Submit
</template>