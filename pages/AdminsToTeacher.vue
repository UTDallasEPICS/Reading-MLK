<template>
    <CVContainer>
      <div class="well well-sm">
        <TitleComp>Edit Teacher</TitleComp>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>District</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVInput v-model="teacher.district" type="text" placeholder="District" required></CVInput>
          </div>
        </div>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>Dual Language</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVSelect v-model="teacher.dual_lang" :options="dualLangOptions" placeholder="Select Dual Language"></CVSelect>
          </div>
        </div>
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel>Email</CVLabel>
          <div class="col-md-8 mx-9 sm:col-span-2 sm:mr-11">
            <CVInput v-model="teacher.faculty_email" type="email" placeholder="Email" required></CVInput>
          </div>
        </div>
        <div class="col-md-10 py-2">
          <ActionButton @click="updateTeacher" class="transition duration-300 bg-orange-999 hover:bg-green-600">Update Teacher</ActionButton>
        </div>
        <div class="py-4 grid sm:grid-cols-3" v-if="errorInPage" style="color: red">
          <CVLabel>Error updating teacher.</CVLabel>
        </div>
      </div>
    </CVContainer>
  </template>
  
  <script setup lang="ts">
  import type { FacultyProfile } from '@/types.d.ts';
  import { ref } from 'vue';
  import { useCookie } from "@vue-composable/cookie";

  const cvuser = useCookie('cvuser');
  const teacher = ref<FacultyProfile>({
      district: "",
      dual_lang: false,
      faculty_email: ""
  });

  const errorInPage = ref(false);

  const dualLangOptions = [
    { value: false, label: 'English' },
    { value: true, label: 'Spanish' },
  ];

  const updateTeacher = async () => {
    if (cvuser.value?.user_role === "advocate" || cvuser.value?.user_role === "admin") {
      try {
        const response = await fetch(`/api/teacher/${teacher.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cvuser.value.token}`
          },
          body: JSON.stringify(teacher.value)
        });

        if (!response.ok) {
          throw new Error('Failed to update teacher.');
        }

        errorInPage.value = false;
      } catch (error) {
        console.error('Error updating teacher:', error);
        errorInPage.value = true;
      }
    }
  };
</script>

  
  <style scoped>
  
  </style>
  