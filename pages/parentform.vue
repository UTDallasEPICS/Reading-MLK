<template lang="pug">
  .centered-container(style="display: flex; justify-content: center; align-items: center; margin: 40px;")
    .form
      .form-container(style="padding: 20px; padding-top: 10px;background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); max-width: 500px; width: 100%;")
        .form-header(style="text-align: center;")
          h2 Parent Registration Form
        .form-input(style="display: grid; gap: 10px;")
          //- First Name
          .form-element(style="display: flex; flex-direction: column;")
            label(for="first_name" style="font-size: 16px; font-weight: 500; color: #333;") 
              Enter Parent First Name
              span(style="color: red;")  *
            input(type="text" id="first_name" v-model="data_ParentProfile.first_name" placeholder="Parent First Name" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;")
        
          //- Last Name
          .form-element(style="display: flex; flex-direction: column;")
            label(for="last_name" style="font-size: 16px; font-weight: 500; color: #333;") 
              Enter Parent Last Name
              span(style="color: red;")  *
            input(type="text" id="last_name" v-model="data_ParentProfile.last_name" placeholder="Parent Last Name" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;")
        
          //- Birth Date
          .form-element(style="display: flex; flex-direction: column;")
            label(for="birth_date" style="font-size: 16px; font-weight: 500; color: #333;") 
              Enter Parent Birth Date
              span(style="color: red;")  *
            VueDatePicker(v-model="data_ParentProfile.birth_date" name="birth_date" id="birth_date" required :enable-time-picker="false")
        
          //- Zipcode
          .form-element(style="display: flex; flex-direction: column;")
            label(for="zipcode" style="font-size: 16px; font-weight: 500; color: #333;") 
              Enter Parent Zipcode
              span(style="color: red;")  *
            input(type="text" id="zipcode" v-model="data_ParentProfile.zipcode" placeholder="Parent Zipcode" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;")
        
          //- Yearly Income
          .form-element(style="display: flex; flex-direction: column;")
            label(for="yearly_income" style="font-size: 16px; font-weight: 500; color: #333;") 
              Enter Parent Yearly Income
              span(style="color: red;")  *
            input(type="text" id="yearly_income" v-model="data_ParentProfile.yearly_income" placeholder="Parent Yearly Income" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;")
        
          //- Phone Number
          .form-element(style="display: flex; flex-direction: column;")
            label(for="phone_number" style="font-size: 16px; font-weight: 500; color: #333;") 
              Enter Parent Phone Number
              span(style="color: red;")  *
            input(type="text" id="phone_number" v-model="data_ParentProfile.phone_number" placeholder="Parent Phone Number" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;")
        
          //- Private Email
          .form-element(style="display: flex; flex-direction: column;")
            label(for="email" style="font-size: 16px; font-weight: 500; color: #333;") 
              Enter Parent Private Email
              span(style="color: red;")  *
            input(type="text" id="email" v-model="data_ParentProfile.email" placeholder="Parent Private Email" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;")
        
          //- Social Media
          .form-element(style="display: flex; flex-direction: column;")
            label(for="social_media" style="font-size: 16px; font-weight: 500; color: #333;") 
              Enter Parent Twitter Handle
              span(style="color: red;")  *
            input(type="text" id="social_media" v-model="data_ParentProfile.social_media" placeholder="Parent Twitter Handle" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;")
        
          //- Average Number of Books read
          .form-element(style="display: flex; flex-direction: column;")
            label(for="average_number_books" style="font-size: 16px; font-weight: 500; color: #333;") On average, how many books a year does your child read (a guess is fine)?
              span(style="color: red;")  *
            input(type="text" id="average_number_books" v-model="data_ParentProfile.average_number_books" placeholder="Enter # of books" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;")
        
          //- Marital Status
          .form-element(style="display: flex; flex-direction: column;")
            label(for="marital_stat" style="font-size: 16px; font-weight: 500; color: #333;") Enter Parent Marital Status
              span(style="color: red;") *
            input(type="text" id="marital_stat" v-model="data_ParentProfile.marital_stat" placeholder="Parent Marital Status" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;")
        
        //- Recursive call
        studentform()
        
        //- Submit Button
        .button-container(style="display: flex; justify-content: center; margin-top: 20px;")
          button(type="button" class="submit-button" 
            style="padding: 10px 20px; background-color: #122c4f; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;"
            @mouseover="this.style.backgroundColor='#0056b3'" 
            @mouseleave="this.style.backgroundColor='#122c4f'"
            @click="submitAccounts") Submit
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import studentform from "./studentform.vue"
const props = defineProps<{ modelValue: Object }>()
const rhuser = useCookie<any>('rhuser')
const client_cuid = rhuser.value?.client_cuid || "0";

const showStudentForm = ref(false);

const data_ParentProfile = ref({
    first_name: null,
    last_name: null,
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
    const parentResponse = await $fetch('/parent_submit', {
        method: "POST",
        body: {
            parent: data_ParentProfile.value,
            students: data_StudentProfile.value
        }
    });

};

</script>