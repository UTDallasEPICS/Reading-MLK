<script setup lang="ts">
import {ref} from 'vue';

const parentProfile=ref({
firstName: "",
lastName: "",
birth_date: "",
zipcode: 0,
phone_number: 0,
email: "", 
social_media: "",
average_number_books: "",
yearly_income: "",
gender: "",
martial_status: "",
});

const createParentProfile = async () => {
    try {
        const response = await fetch('/server/api/parent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parentProfile.value)
        });

        if (!response.ok) {
            throw new Error('Failed to create parent profile.');
        }

        // Optionally, you can redirect the user to a success page or display a success message.
    } catch (error) {
        console.error('Error creating parent profile:', error);
        // Optionally, you can display an error message to the user.
    }
};
</script>
<template lang="pug">
div
    h2.text-center.text-3xl.font-bold.mt-4(style="margin-top: 35px") Create Parent Profile
    hr.rounded.center-text(style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px")
    //- Form to create student profile
    form.mt-10(@submit.prevent="createParentProfile")
        //- Zipcode
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="zipcode") Zipcode
            input(type="number" v-model="parentProfile.zipcode" name="zipcode" id="zipcode" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Yearly Income
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="yearly-income") Yearly Income
            input(type="text" v-model="parentProfile.yearlyIncome" name="yearly-income" id="yearly-income" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Birth Date
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="birth-date") Birth Date
            input(type="date" v-model="parentProfile.birthDate" name="birth-date" id="birth-date" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Average Number of Books
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="average_number_books") Average Number of Books
            input(type="number" v-model="parentProfile.avgNumBooks" name="average_number_books" id="average_number_books" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Password
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="password") Password
            input(type="password" v-model="parentProfile.password" name="password" id="password" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Phone Number
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="phone-number") Phone Number
            input(type="text" v-model="parentProfile.phoneNumber" name="phone-number" id="phone-number" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Gender
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="gender") Gender
            select(v-model="parentProfile.gender" name="gender" id="gender" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
                option(value="M") Male
                option(value="F") Female
                option(value="O") Other
        //- Marital Status
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="marital-status") Marital Status
            select(v-model="parentProfile.maritalStatus" name="marital-status" id="marital-status" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
                option(value="Single") Single
                option(value="Married") Married
                option(value="Divorced") Divorced
                option(value="Widowed") Widowed
        //- First Name
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="first-name") First Name
            input(type="text" v-model="parentProfile.firstName" name="first-name" id="first-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Last Name
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="last-name") Last Name
            input(type="text" v-model="parentProfile.lastName" name="last-name" id="last-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Email
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="email") Email
            input(type="email" v-model="parentProfile.email" name="email" id="email" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Social Media
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="social-media") Social Media
            input(type="text" v-model="parentProfile.socialMedia" name="social-media" id="social-media" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Submit Button
        div.flex.items-center.justify-end
            button(type="submit" class="rounded-md bg-blue-500 text-white px-3 py-2 font-semibold shadow-sm hover:bg-indigo-500 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-opacity-50 sm:text-lg") Create Parent Profile
</template>