<template lang="pug">
    .centered-container
      .form-container
        .form-header
          h2 Parent Registration Form
        .form-input
          .form-element
            label(for="textbox").required Enter Parent First Name
            input(type="text" id="textbox" placeholder="Parent First Name" required)
          .form-element
            label(for="textbox").required Enter Parent Last Name
            input(type="text" id="textbox" placeholder="Parent Last Name" required)
          .form-element
            label(for="textbox").required Enter Parent Birth Date
            VueDatePicker(v-model="data_ParentProfile.birth_date" name="birth_date" id="birth_date" required)
          .form-element
            label(for="textbox").required Enter Parent Zipcode
            input(type="text" id="textbox" placeholder="Parent Zipcode" required)
          .form-element
            label(for="textbox").required Enter Parent Yearly Income
            input(type="text" id="textbox" placeholder="Parent Yearly Income" required)
          .form-element
            label(for="textbox").required Enter Parent Phone Number
            input(type="text" id="textbox" placeholder="Parent Phone Number" required)
          .form-element
            label(for="textbox").required Enter Parent Private Email
            input(type="text" id="textbox" placeholder="Parent Private Email" required)
          .form-element
            label(for="textbox").required Enter Parent Twitter Handle
            input(type="text" id="textbox" placeholder="Parent Twitter Handle" required)
          .form-element
            label(for="textbox").required On average, how many books a year do you read to your child (a guess is fine)
            input(type="text" id="textbox" placeholder="Enter # of books" required)
          .form-element
            label(for="textbox").required Enter Parent Marital Status
            input(type="text" id="textbox" placeholder="Parent Marital Status" required)
        studentform()

        .button-container
            button(type="button" class="submit-button") Submit
            
  </template>


<style scoped>
.centered-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px;
}

.form-container {
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    max-width: 500px;
    width: 100%;
}

.form-header {
    text-align: center;
}

.form-input {
    display: grid;
    gap: 10px;
}

.form-element {
    display: flex;
    flex-direction: column;
}

input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.checkbox {
    display: flex;
    align-items: center;
}

input[type="checkbox"] {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    cursor: pointer;
}

label {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

input[type="checkbox"]:hover {
    border-color: #007BFF;
}

input[type="checkbox"]:focus {
    outline: none;
    box-shadow: 0 0 5px 2px rgba(0, 123, 255, 0.5);
}

.required::after {
    content: " *";
    color: red;
    font-weight: bold;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.submit-button {
    padding: 10px 20px;
    background-color: #122c4f;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.submit-button:hover {
    background-color: #0056b3;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import studentform from "./studentform.vue"
const props = defineProps<{ modelValue: Object }>()
const rhuser = useCookie<any>('rhuser')

const showStudentForm = ref(false);

const toggleStudentForm = () => {
    showStudentForm.value = !showStudentForm.value;
    // if (showStudentForm.value) {
        addStudent;
        console.log('adding stu')
    // }
};

const data_ParentProfile = ref({
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

const submittAccounts = async () => {
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