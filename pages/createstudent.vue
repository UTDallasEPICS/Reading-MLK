<script setup lang="ts">
import { ref } from 'vue';

const studentProfile = ref({
    firstName: '',
    lastName: '',
    age: null,
    grade: null,
    readingLvl: null,
    birthDate: '',
    gender: '',
    schoolName: '',
    schoolDist: '',
    prefLang: ''
});

const createStudentProfile = async () => {
    try {
        const response = await fetch('/server/api/student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentProfile.value)
        });

        if (!response.ok) {
            throw new Error('Failed to create student profile.');
        }

        // Optionally, you can redirect the user to a success page or display a success message.
    } catch (error) {
        console.error('Error creating student profile:', error);
        // Optionally, you can display an error message to the user.
    }
};
</script>
<template lang="pug">
div
    h2.text-center.text-3xl.font-bold.mt-4(style="margin-top: 35px") Create Student Profile
    hr.rounded.center-text(style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px")
    //- Form to create student profile
    form.mt-10(@submit.prevent="createStudentProfile")
        //- First Name
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="first-name") First Name
            input(type="text" v-model="studentProfile.firstName" name="first-name" id="first-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Last Name
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="last-name") Last Name
            input(type="text" v-model="studentProfile.lastName" name="last-name" id="last-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Age
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="age") Age
            input(type="number" v-model="studentProfile.age" name="age" id="age" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Grade
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="grade") Grade
            input(type="number" v-model="studentProfile.grade" name="grade" id="grade" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Reading Level
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="reading-lvl") Reading Level
            input(type="number" v-model="studentProfile.readingLvl" name="reading-lvl" id="reading-lvl" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Birth Date
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="birth-date") Birth Date
            input(type="date" v-model="studentProfile.birthDate" name="birth-date" id="birth-date" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Gender
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="gender") Gender
            select(v-model="studentProfile.gender" name="gender" id="gender" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
                option(value="M") Male
                option(value="F") Female
                option(value="O") Other
        //- School Name
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="school-name") School Name
            input(type="text" v-model="studentProfile.schoolName" name="school-name" id="school-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- School District
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="school-district") School District
            input(type="text" v-model="studentProfile.schoolDist" name="school-district" id="school-district" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Preferred Language
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="pref-lang") Preferred Language
            select(v-model="studentProfile.prefLang" name="pref-lang" id="pref-lang" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
                option(value="English") English
                option(value="Spanish") Spanish
                option(value="Other") Other
        //- Submit Button
        div.flex.items-center.justify-end
            button(type="submit" class="rounded-md bg-blue-500 text-white px-3 py-2 font-semibold shadow-sm hover:bg-indigo-500 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-opacity-50 sm:text-lg") Create Student Profile

</template>