<template>
    <CVContainer>
      <div class="well well-sm">
        <TitleComp>Edit Student</TitleComp>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>Age</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVInput v-model="student.age" type="number" placeholder="Age" required></CVInput>
          </div>
        </div>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>Grade</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVInput v-model="student.grade" type="number" placeholder="Grade" required></CVInput>
          </div>
        </div>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>Reading Level</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVInput v-model="student.reading_lvl" type="number" placeholder="Reading Level" required></CVInput>
          </div>
        </div>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>Birth Date</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVInput v-model="student.birth_date" type="date" placeholder="Birth Date" required></CVInput>
          </div>
        </div>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>Gender</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVSelect v-model="student.gender" :options="genderOptions" placeholder="Select Gender"></CVSelect>
          </div>
        </div>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>School Name</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVInput v-model="student.school_name" type="text" placeholder="School Name" required></CVInput>
          </div>
        </div>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>School District</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVInput v-model="student.school_dist" type="text" placeholder="School District" required></CVInput>
          </div>
        </div>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>Preferred Language</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVSelect v-model="student.pref_lang" :options="prefLangOptions" placeholder="Select Preferred Language"></CVSelect>
          </div>
        </div>
        <div class="col-md-10 py-2">
          <ActionButton @click="updateStudent" class="transition duration-300 bg-orange-999 hover:bg-green-600">Update Student</ActionButton>
        </div>
        <div class="py-4 grid sm:grid-cols-3" v-if="errorInPage" style="color: red">
          <CVLabel>Error updating student.</CVLabel>
        </div>
      </div>
    </CVContainer>
  </template>
  
  <script setup lang="ts">
  import type { StudentProfile } from '@/types.d.ts';
  import { ref } from 'vue';
  import { useCookie } from "@vue-composable/cookie";
  
  const cvuser = useCookie('cvuser');
  const student = ref<StudentProfile>({
      age: 0,
      grade: 0,
      reading_lvl: 0,
      birth_date: new Date(),
      gender: "",
      school_name: "",
      school_dist: "",
      pref_lang: "",
  });
  
  const errorInPage = ref(false);
  
  const updateStudent = async () => {
    if (cvuser.value?.user_role === "advocate" || cvuser.value?.user_role === "admin") {
      try {
        const response = await fetch(`/api/student/${student.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cvuser.value.token}`
          },
          body: JSON.stringify(student.value)
        });
        
        if (!response.ok) {
          throw new Error('Failed to update student.');
        }
  
        errorInPage.value = false;
      } catch (error) {
        console.error('Error updating student:', error);
        errorInPage.value = true;
      }
    }
  };
  </script>
  
  <style scoped>
  
  </style>
  