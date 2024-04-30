<script setup lang="ts">
import { ref } from 'vue';
import { useCookie } from "@vue-composable/cookie";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cvuser = useCookie('cvuser');

type UserProfile = {
    id: number,
    user_name: string,
    email: string,
    role: string,
};

const user = ref<UserProfile>({
    id: 0,
    user_name: "",
    email: "",
    role: ""
});

const updateUser = async () => {
    try {
        const response = await fetch(`/server/api/user/${user.value.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user.value)
        });

        if (!response.ok) {
            throw new Error('Failed to update user.');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
};
</script>

<template lang="pug">
div
    h2.text-center.text-3xl.font-bold.mt-4(style="margin-top: 35px") Edit User Profile
    hr.rounded.center-text(style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px")
    //- Form to edit user profile
    form.mt-10.grid.grid-cols-1.gap-x-6.gap-y-8(sm:grid-cols-2).mx-16(@submit.prevent="updateUser")
        //- First Name
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="first-name") First Name
            input(type="text" v-model="user.user_name" name="first-name" id="first-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Last Name
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="last-name") Last Name
            input(type="text" v-model="user.email" name="last-name" id="last-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Email
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="email") Email
            input(type="email" v-model="user.email" name="email" id="email" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
        //- Role
        div
            label.block.text-lg.font-medium.leading-6.text-gray-900(for="role") Role
            select(v-model="user.role" name="role" id="role" class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg")
                option(value="staff") Staff
                option(value="admin") Admin
        //- Submit Button
        div.flex.items-center.justify-end
            button(type="submit" class="rounded-md bg-blue-500 text-white px-3 py-2 font-semibold shadow-sm hover:bg-indigo-500 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-opacity-50 sm:text-lg") Save Changes
</template>
