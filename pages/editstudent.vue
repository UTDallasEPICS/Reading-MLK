<script setup lang="ts">

import { ref } from 'vue';
import { useCookie } from "@vue-composable/cookie";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const cvuser = useCookie('cvuser');
type StudentProfile = {
    id: number,
    age: number,
    grade: number,
    reading_lvl: number,
    birth_date: Date,
    gender: string,
    school_name: string,
    school_dist: string,
    pref_lang: string,
    first_name: string,
    last_name: string,
    pref_name: string,
};
const student = ref<StudentProfile>({
    id: 0,
    age: 0,
    grade: 0,
    reading_lvl: 0,
    birth_date: new Date(),
    gender: "",
    school_name: "",
    school_dist: "",
    pref_lang: "",
    first_name: "",
    last_name: "",
    pref_name: ""
});
const updateStudent = async () => {
    try {
      const response = await fetch(`/api/student/${student.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student.value)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update student.');
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
};

</script>


<template lang="pug">
div
  h2.text-center.text-3xl.font-bold.mt-4(style="margin-top: 35px") Edit Student Profile
  hr.rounded.center-text(style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px")
  //- Form to edit student profile
  form.mt-10.grid.grid-cols-1.gap-x-6.gap-y-8(sm:grid-cols-2).mx-16(@submit.prevent="submitForm")
    //- First Name
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="first-name") First Name
      input(type="text" v-model="student.firstName" name="first-name" id="first-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Last Name
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="last-name") Last Name
      input(type="text" v-model="student.lastName" name="last-name" id="last-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Preferred Name
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="pref-name") Preferred Name
      input(type="text" v-model="student.prefName" name="pref-name" id="pref-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Age
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="age") Age
      input(type="number" v-model="student.age" name="age" id="age" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Grade
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="grade") Grade
      input(type="number" v-model="student.grade" name="grade" id="grade" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Reading Level
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="reading-lvl") Reading Level
      input(type="number" v-model="student.readingLvl" name="reading-lvl" id="reading-lvl" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Birth Date
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="birth-date") Birth Date
      input(type="date" v-model="student.birthDate" name="birth-date" id="birth-date" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Gender
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="gender") Gender
      select(v-model="student.gender" name="gender" id="gender" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        option(value="M") Male
        option(value="F") Female
        option(value="O") Other
    //- School Name
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="school-name") School Name
      input(type="text" v-model="student.schoolName" name="school-name" id="school-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- School District
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="school-district") School District
      input(type="text" v-model="student.schoolDist" name="school-district" id="school-district" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
    //- Preferred Language
    div
      label.block.text-lg.font-medium.leading-6.text-gray-900(for="pref-lang") Preferred Language
      select(v-model="student.prefLang" name="pref-lang" id="pref-lang" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        option(value="English") English
        option(value="Spanish") Spanish
        option(value="Other") Other
    //- Submit Button
    div.flex.items-center.justify-end
      button(type="submit" class="rounded-md bg-blue-500 text-white px-3 py-2 font-semibold shadow-sm hover:bg-indigo-500 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-opacity-50 sm:text-lg") Save Changes


</template>
