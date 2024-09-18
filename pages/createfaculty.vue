<script setup lang="ts">
import { ref } from 'vue';

const facultyProfile = ref({
    district: '',
    dualLang: false,
    facultyEmail: '',
    firstName: '',
    lastName: '',
    schoolName: '',
    phoneNumber: '',
    department: '',
    grade: ''
});

const createFacultyProfile = async () => {
    try {
        const response = await fetch('/server/api/faculty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(facultyProfile.value)
        });

        if (!response.ok) {
            throw new Error('Failed to create faculty profile.');
        }

        // Optionally, you can redirect the user to a success page or display a success message.
    } catch (error) {
        console.error('Error creating faculty profile:', error);
        // Optionally, you can display an error message to the user.
    }
};
</script>

<template lang="pug">
div
    h2.text-center.text-3xl.font-bold.mt-4(style="margin-top: 35px") Create Faculty Profile
    hr.rounded.center-text(style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px")
    //- Form to create faculty profile
    form.mt-10(@submit.prevent="createFacultyProfile")
        //- District
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="district") District
            input(type="text" v-model="facultyProfile.district" name="district" id="district" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Dual Language
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="dual-lang") Dual Language
            select(v-model="facultyProfile.dualLang" name="dual-lang" id="dual-lang" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
                option(value="Yes") Yes
                option(value="No") No     
        //- Faculty Email
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="faculty-email") Faculty Email
            input(type="email" v-model="facultyProfile.facultyEmail" name="faculty-email" id="faculty-email" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- First Name
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="first-name") First Name
            input(type="text" v-model="facultyProfile.firstName" name="first-name" id="first-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Last Name
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="last-name") Last Name
            input(type="text" v-model="facultyProfile.lastName" name="last-name" id="last-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- School Name
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="school-name") School Name
            input(type="text" v-model="facultyProfile.schoolName" name="school-name" id="school-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Phone Number
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="phone-number") Phone Number
            input(type="text" v-model="facultyProfile.phoneNumber" name="phone-number" id="phone-number" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Department
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="department") Department
            input(type="text" v-model="facultyProfile.department" name="department" id="department" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Grade
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="grade") Grade
            input(type="text" v-model="facultyProfile.grade" name="grade" id="grade" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Submit Button
        div.flex.items-center.justify-end
            button(type="submit" class="rounded-md bg-blue-500 text-white px-3 py-2 font-semibold shadow-sm hover:bg-indigo-500 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-opacity-50 sm:text-lg") Create Faculty Profile

</template>
