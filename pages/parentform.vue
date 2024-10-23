
<script lang="ts" setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
const props = defineProps<{modelValue:Object}>()
const rhuser = useCookie<any>('rhuser')
const data_ParentProfile=ref({
first_name: "",
last_name: "",
birth_date: "",
zipcode: 0,
phone_number: 0,
email: "", 
social_media: "",
average_number_books: "",
yearly_income: "",
gender: "",
marital_stat: "",
user_id: rhuser.value.id,
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
pref_lang: "",
user_id: rhuser.value.id,

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
        pref_lang: "",
        user_id: rhuser.value.id,
    })
}

const removeStudent = (index: number) => {
    data_StudentProfile.value.splice(index-1, 1);
}

const submittAccounts = async() =>{
    console.log("Testinggg")
    const parentResponse = await $fetch('/api/parent_submit', {
    method: "POST",
    body: {
        parent: data_ParentProfile.value,
        students: data_StudentProfile.value
    }
    });
    
};
</script>


<template lang = "pug">
.min-h-screen.p-6.bg-gray-100.flex.items-center.justify-center
    .container.max-w-screen-lg.mx-auto
        div
            .bg-white.rounded.shadow-lg.p-4.px-4(class=".md.p-8.mb-6")
                .grid.gap-4.gap-y-2.text-sm.grid-cols-1.lg(class="grid-cols-3")
                    .text-gray-600
                        p.font-medium.text-lg Parent Registration Form
                        p Please Enter Parent Information
                    .lg(class="col-span-2")
                        .grid.gap-4.gap-y-2.text-sm.grid-cols-1(class="md.grid-cols-5")
                            div(class="col-span-5")
                                label(for="full_name") First Name
                                Input(v-model="data_ParentProfile.first_name" name="first_name" id="first_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
                            div(class="col-span-5")
                                label(for="email") Last Name
                                Input(v-model="data_ParentProfile.last_name" name="last_name" id="last_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
                            div(class="col-span-5")
                                label(for="email") Birth Date
                                VueDatePicker(v-model="data_ParentProfile.birth_date" name="birth_date" id="birth_date" required)
                            div(class="col-span-5")
                                label(for="email") Zipcode
                                InputNum(type="text" v-model="data_ParentProfile.zipcode" name="zipcode" id="zipcode" placeholder="(user defined)" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" required)
                            div(class="col-span-5")
                                label(for="email") Yearly Income
                                select(v-model="data_StudentProfile.yearly_income" name="yearly_income" id="yearly_income" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder = "(Select your income level)") option(value=") Select your income level option(value="$10,000-$20,000") $10,000-$20,000 option(value="$20,000-$30,000") $20,000-$30,000 option(value="$30,000-$40,000") $30,000-$40,000 option(value="$40,000-$50,000") $40,000-$50,000 option(value="$50,000-$60,000") $50,000-$60,000 option(value="$60,000+") $60,000+
                            div(class="col-span-5")
                                label(for="email") Phone Number
                                Input(type="text" v-model="data_ParentProfile.phone_number" name="phone_number" id="phone_number" placeholder="(Ex:1234567899)" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" required)
                            div(class="col-span-5")
                                label(for="email") Email
                                Input(type="text" v-model="data_ParentProfile.email" name="email" id="email" placeholder="(Ex:shell12345@gmail.com)" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" required)
                            div(class="col-span-5")
                                label(for="address") Password
                                Input(type="text" v-model="data_ParentProfile.password" name="password" id="password" placeholder="(user defined)" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" required )
                            div(class="col-span-5")
                                label(for="city") Social Media Handle
                                Input(type="text" v-model="data_ParentProfile.social_media" name="social_media_handle" id="social_media_handle" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)")
                            div(class="col-span-5")
                                label(for="city") On average how many books a year do you read to your child (a guess is fine)
                                InputNum(type="number" v-model="data_ParentProfile.average_number_books" name="average_number_books" id="average_number_books" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
                            div(class="col-span-5")
                                label(for="city") What is your marital status
                                select(v-model="data_StudentProfile.marital_stat" name="marital_stat" id="marital_stat" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder = "(Select your Marital Status)") option(value=") Select your Marital Status option(value="Married") Married option(value="Single") Single option(value="Divorced") Divorced option(value="Other") Other .flex.flex-col.gap-5(class="text-center")

Childentry(v-for="(child, index) in data_StudentProfile" :key="index" v-model="data_StudentProfile[index]" @remove="removeStudent(index)")
Button.mx-auto.text-md(name = "Add Child" @click="addStudent()" class='bg-sky-400 hover:bg-sky-400 text-black border border-sky-400 rounded-lg px-2 py-2') Add Student
.flex.flex-col.gap-5(class="text-center border border-gray-700 text-center")



.flex.gap-5(class="object-center py-2")
    Button.mx-auto.text-md(name="Submitt accounts" @click="submittAccounts()" class='bg-green-400 hover:bg-green-400 text-black rounded-lg px-2 py-2') Submit
</template>