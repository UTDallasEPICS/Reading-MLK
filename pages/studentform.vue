<template lang="pug">
  div(v-for="(form, index) in studentForms" :key="index" 
      class="student-registration-form" 
      style="background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); padding: 10px 0px; margin: 30px;")
    h2(class="student-registration-header" 
       style="text-align: center; color: #333;") Student \#{{index+1}} Registration
    div(class="form-container" 
       style="display: flex; flex-direction: column; gap: 15px; /*padding: 0px 10%; padding-bottom: 20px;*/")
      //- First Name
      div(class="form-element" style="padding:0px 20px;")
        label(for="student_first_name" class="label" 
               style="font-size: 16px; font-weight: 500; color: #333;") 
               .required 
               Enter Student First Name
               span(style="color: red;")  *
        input(type="text" v-model="form.firstName" placeholder="Student First Name" 
               required 
               class="input"
               id="student_first_name" 
               style="width: 100%; padding:10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; transition: border-color 0.3s ease; box-sizing: border-box; height: 40px;"
               @focus="this.style.borderColor='#007BFF'" 
               @blur="this.style.borderColor='#ccc'") 
      
      //- Last Name
      div(class="form-element" style="padding:0px 20px;")
        label(for="student_last_name" class="label" 
               style="font-size: 16px; font-weight: 500; color: #333;")
               .required 
               Enter Student Last Name
               span(style="color: red;")  *
        input(type="text" v-model="form.lastName" placeholder="Student Last Name" 
               required 
               class="input"
               id="student_last_name" 
               style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; transition: border-color 0.3s ease; box-sizing: border-box; height: 40px;"
               @focus="this.style.borderColor='#007BFF'" 
               @blur="this.style.borderColor='#ccc'")
      
      //- Gender (dropdown selection)
      div(class="form-element" style="padding:0px 20px;")
        label(for="student_gender" class="label" 
               style="font-size: 16px; font-weight: 500; color: #333;") 
               .required
               Enter Student Gender 
               span(style="color: red;")  *
        select(v-model="form.gender" placeholder="Select Gender"
               required 
               class="input" 
               id="student_gender"
               style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;")
          option(value="" disabled selected) Select Gender
          option(value="M") Male
          option(value="F") Female
      
      //- Birth Date (calendar)
      div(class="form-element" style="padding:0px 20px;")
        label(for="student_birth_date" class="label" 
               style="font-size: 16px; font-weight: 500; color: #333;") 
               .required 
               Enter Student Birth Date
               span(style="color: red;")  *
        VueDatePicker(v-model="form.birthDate" name="student_birth_date" 
                      required 
                      class="input"
                      id="student_birth_date"
                      style="width: 100%; border: none; font-size: 16px; transition: border-color 0.3s ease;"
                      @focus="this.style.borderColor='#007BFF'" 
                      @blur="this.style.borderColor='#ccc'"
                      :enable-time-picker="false")
      
      //- Grade (dropdown selection)
      div(class="form-element" style="padding:0px 20px;")
        label(for="student_grade" class="label" 
               style="font-size: 16px; font-weight: 500; color: #333;") 
               .required
               Enter Student Grade
               span(style="color: red;")  *
        select(type="number" v-model="form.grade"
               required 
               class="input" 
               id="student_grade"
               style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;")
          option(value="" disabled selected) Select Grade
          option(v-for="grade in 10" :key="grade" :value="grade") {{ grade }}
      
      //- Reading Level (dropdown selection)
      div(class="form-element" style="padding:0px 20px;")
        label(for="student_reading_level" class="label" 
               style="font-size: 16px; font-weight: 500; color: #333;") 
               .required
               Enter Student Reading Level
               span(style="color: red;")  *
        select(type="number" v-model="form.readingLevel"
               required 
               class="input" 
               id="student_reading_level"
               style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;")
          option(value="" disabled selected) Select Reading Level
          option(v-for="rLevel in 10" :key="rLevel" :value="rLevel") {{ rLevel }}
      
      //- Zipcode (allow only numbers)
      div(class="form-element" style="padding:0px 20px;")
        label(for="student_zipcode" class="label" 
               style="font-size: 16px; font-weight: 500; color: #333;") 
               .required 
               Enter Student Zipcode
               span(style="color: red;")  *
        input(type="number" v-model="form.zipcode" placeholder="Student Zipcode" 
               required 
               class="input" 
               style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; transition: border-color 0.3s ease; box-sizing: border-box;"
               @focus="this.style.borderColor='#007BFF'" 
               @blur="this.style.borderColor='#ccc'")
      
      //- submit & add student buttons
      div(class="button-container" style="display: flex; justify-content: center; gap: 20px;")
        button(v-if="studentForms.length == (index+1)" @click="addStudent" :disabled="index+1 != studentForms.length" class="button" style="padding: 10px 20px; background-color:#122c4f; cursor: index + 1 != studentForms.length ? 'not-allowed' : 'pointer'; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 10px;") + Student
        button(v-if="studentForms.length > 1" @click="removeStudent(index)" class="button" style="padding: 10px 20px; background-color: #122c4f; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 10px; transition: background-color 0.3s ease;") - Student

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const studentForms = ref([
  {
    firstName: '',
    lastName: '',
    birthDate: null, // Use null for dates
    zipcode: ''
  }
]);

const addStudent = () => {
  studentForms.value.push({
    firstName: '',
    lastName: '',
    birthDate: null, // Use null for dates
    zipcode: ''
  });
};

// Method to remove the last student form
const removeStudent = (index:number) => {
  if (studentForms.value.length > 1) {
    studentForms.value.splice(index,1);
  }
};

// Computed property to check if "Add Student" button should be disabled
const isAddStudentDisabled = computed(() => {
  return studentForms.value.length > 0;
});

</script>