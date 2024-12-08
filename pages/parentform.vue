<template lang="pug"> 
  .centered-container(class="flex justify-center items-center my-[5vh]")
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
        .form-header(class="text-center bg-customBlue p-6 rounded-t-lg text-gray-100")
          h2(class="text-4xl font-medium uppercase tracking-wider") Parent Registration Form
          .heading-line(class="w-32 h-1 bg-green-400 my-2 mx-auto rounded-sm")
        .form-input(class="grid gap-6 p-8 bg-white rounded-b-lg")
          
          // Birth Date
          .form-element(class="flex flex-col")
            label(for="birth_date" class="text-lg font-semibold text-gray-800 mb-2")
              Enter Birth Date
              span(class="text-red-500") 
            VueDatePicker(v-model="data_ParentProfile.birth_date" name="birth_date" id="birth_date" required :enable-time-picker="false")
            
          
          div(class="flex flex-col mb-5")
            label(for="student_gender" class="text-lg font-semibold text-gray-800 mb-2") Gender
            select(v-model="data_ParentProfile.gender" required class="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg" id="student_gender")
              option(value="" selected disabled) Select Gender
              option(value="M") Male
              option(value="F") Female

          // Zipcode
          .form-element(class="flex flex-col")
            label(for="zipcode" class="text-lg font-semibold text-gray-800 mb-2")
              Enter Zipcode
              span(class="text-red-500") 
            input(type="text" id="zipcode" v-model="data_ParentProfile.zipcode" placeholder="Parent Zipcode" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" @focus="this.style.borderColor='#007BFF'" @blur="this.style.borderColor='#ccc'")

          // Yearly Income
          .form-element(class="flex flex-col")
            label(for="yearly_income" class="text-lg font-semibold text-gray-800 mb-2")
              Enter Yearly Income
              span(class="text-red-500") 
            input(type="text" id="yearly_income" v-model="data_ParentProfile.yearly_income" placeholder="Parent Yearly Income" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" @focus="this.style.borderColor='#007BFF'" @blur="this.style.borderColor='#ccc'")

          // Phone Number
          .form-element(class="flex flex-col")
            label(for="phone_number" class="text-lg font-semibold text-gray-800 mb-2")
              Enter Phone Number
              span(class="text-red-500") 
            input(type="text" id="phone_number" v-model="data_ParentProfile.phone_number" placeholder="Parent Phone Number" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" @focus="this.style.borderColor='#007BFF'" @blur="this.style.borderColor='#ccc'")

          // Private Email
          .form-element(class="flex flex-col")
            label(for="email" class="text-lg font-semibold text-gray-800 mb-2")
              Enter Email
              span(class="text-red-500") 
            input(type="email" id="email" v-model="data_ParentProfile.email" placeholder="Parent Email" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" @focus="this.style.borderColor='#007BFF'" @blur="this.style.borderColor='#ccc'")

          // Social Media
          .form-element(class="flex flex-col")
            label(for="social_media" class="text-lg font-semibold text-gray-800 mb-2")
              Enter Twitter Handle
              span(class="text-red-500") 
            input(type="text" id="social_media" v-model="data_ParentProfile.social_media" placeholder="Parent Twitter Handle" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" @focus="this.style.borderColor='#007BFF'" @blur="this.style.borderColor='#ccc'")

          // Average Number of Books read
          .form-element(class="flex flex-col")
            label(for="average_number_books" class="text-lg font-semibold text-gray-800 mb-2")
              Enter On average, how many books a year does your child read (a guess is fine)?
              span(class="text-red-500") 
            input(type="text" id="average_number_books" v-model="data_ParentProfile.average_number_books" placeholder="Enter # of books" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" @focus="this.style.borderColor='#007BFF'" @blur="this.style.borderColor='#ccc'")

          // Marital Status
          .form-element(class="flex flex-col")
            label(for="marital_stat" class="text-lg font-semibold text-gray-800 mb-2")
              Enter Marital Status
              span(class="text-red-500") 
            input(type="text" id="marital_stat" v-model="data_ParentProfile.marital_stat" placeholder="Parent Marital Status" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" @focus="this.style.borderColor='#007BFF'" @blur="this.style.borderColor='#ccc'")

        studentform()
        .button-container(class="flex justify-center mt-5")
          button(type="submit" class="submit-button p-3 px-6 bg-customBlue text-white rounded-lg cursor-pointer text-lg transition-all ease-in-out" @click="submitAccounts") Submit
</template>



<script lang="ts" setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import studentform from "./studentform.vue"
const props = defineProps<{ modelValue: Object }>()
const rhuser = useCookie<any>('rhuser')

const showStudentForm = ref(false);

const data_ParentProfile = ref({
    birth_date: null,
    zipcode: null,
    phone_number: null,
    email: null,
    social_media: null,
    average_number_books: null,
    yearly_income: null,
    gender: null,
    marital_stat: null,
    user_id: rhuser.value.id,
});

const data_StudentProfile = ref([{
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

const toggleStudentForm = () => {
    showStudentForm.value = !showStudentForm.value;
    // if (showStudentForm.value) {
        addStudent;
        console.log('adding stu')
        console.log(data_StudentProfile)
    // }
};

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
    data_StudentProfile.value.splice(index - 1, 1);
}

const submitAccounts = async () => {
    const parentResponse = await $fetch('/api/parent_submit', {
        method: "POST",
        body: {
            parent: data_ParentProfile.value,
            students: data_StudentProfile.value
        }
    });

};

</script>