<template lang="pug">
  // Loop through the studentForms array to create multiple forms
  div(v-for="(form, index) in studentForms" :key="index")
    .student-registration-form
      h2 Student Registration Form
      .form-container
        .form-element
          label(for="student_first_name") Enter Student First Name *
          input(type="text" v-model="form.firstName" placeholder="Student First Name" required)
        .form-element
          label(for="student_last_name") Enter Student Last Name *
          input(type="text" v-model="form.lastName" placeholder="Student Last Name" required)
        .form-element
          label(for="student_birth_date") Enter Student Birth Date *
          VueDatePicker(v-model="form.birthDate" name="student_birth_date" required)
        .form-element
          label(for="student_zipcode") Enter Student Zipcode *
          input(type="text" v-model="form.zipcode" placeholder="Student Zipcode" required)
      .button-container
        button.add-student-button(@click="addStudent") + Student
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

// Define a reactive array to hold student forms
const studentForms = ref([
  {
    firstName: '',
    lastName: '',
    birthDate: null, // Use null for dates
    zipcode: ''
  }
]);

// Method to add a new student form
const addStudent = () => {
  studentForms.value.push({
    firstName: '',
    lastName: '',
    birthDate: null, // Use null for dates
    zipcode: ''
  });
};
</script>

<style scoped>
.student-registration-form {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Add spacing between forms */
}

.form-element {
  margin-bottom: 15px;
}

label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007BFF;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.button-container {
  display: flex;
  justify-content: center;
}

.add-student-button {
  padding: 10px 20px;
  background-color: #122c4f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.add-student-button:hover {
  background-color: #0056b3;
}

.add-student-button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>