<script setup lang="ts">
import type { User, StudentProfile } from '@/types.d.ts'
import { ref } from 'vue'
import { useCookie } from "@vue-composable/cookie";
const cvuser = useCookie('cvuser');
const cvuser2 = useCookie<User>('cvuser')

const data_child = ref<StudentProfile>({
    age: 0,
    grade: 0,
    reading_lvl: 0,
    birth_date: new Date(),
    gender: "",
    school_name: "",
    school_dist: "",
    pref_lang: "",
    // Add more fields as per your schema
})

const errorInPage = ref(false);

const addChild = async () => {
  if(cvuser2.value?.user_role === "advocate" || cvuser2.value?.user_role === "admin") {
    try {
      const response = await fetch('/api/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cvuser.value.token}`
        },
        body: JSON.stringify(data_child.value)
      })
      if (!response.ok) {
        throw new Error('Failed to add child.')
      }
      // Reset form fields after successful addition
      data_child.value = {
        age: 0,
        grade: 0,
        reading_lvl: 0,
        birth_date: new Date(),
        gender: "",
        school_name: "",
        school_dist: "",
        pref_lang: ""
      }
      errorInPage.value = false;
    } catch (error) {
      console.error('Error adding child:', error)
      errorInPage.value = true;
    }
  }
}
</script>

<template>
  <CVContainer>
    <div class="well well-sm">
      <TitleComp>Add Child</TitleComp>
      <!-- Form fields for child profile -->
      <!-- Add more fields as per your schema -->
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel>Age</CVLabel>
        <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
          <CVInput v-model="data_child.age" type="number" placeholder="Age" required></CVInput>
        </div>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel>Grade</CVLabel>
        <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
          <CVInput v-model="data_child.grade" type="number" placeholder="Grade" required></CVInput>
        </div>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel>Reading Level</CVLabel>
        <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
          <CVInput v-model="data_child.reading_lvl" type="number" placeholder="Reading Level" required></CVInput>
        </div>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel>Birth Date</CVLabel>
        <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
          <CVInput v-model="data_child.birth_date" type="date" placeholder="Birth Date" required></CVInput>
        </div>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel>Gender</CVLabel>
        <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
          <CVSelect v-model="data_child.gender" :options="genderOptions" placeholder="Select Gender"></CVSelect>
        </div>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel>School Name</CVLabel>
        <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
          <CVInput v-model="data_child.school_name" type="text" placeholder="School Name" required></CVInput>
        </div>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel>School District</CVLabel>
        <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
          <CVInput v-model="data_child.school_dist" type="text" placeholder="School District" required></CVInput>
        </div>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel>Preferred Language</CVLabel>
        <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
          <CVSelect v-model="data_child.pref_lang" :options="prefLangOptions" placeholder="Select Preferred Language"></CVSelect>
        </div>
      </div>
      <!-- More form fields for other child profile attributes -->
      
      <!-- Button to submit the form -->
      <div class="col-md-10 py-2">
        <ActionButton @click="addChild" class="transition duration-300 bg-orange-999 hover:bg-green-600">Add Child</ActionButton>
      </div>

      <!-- Error message display -->
      <div class="py-4 grid sm:grid-cols-3" v-if="errorInPage" style="color: red">
        <CVLabel>Error adding child.</CVLabel>
      </div>
    </div>
  </CVContainer>
</template>

<style scoped>
/* Add your custom styles here */
</style>
