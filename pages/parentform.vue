<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type { StudentProfile } from '@prisma/client'

const rhuser = useCookie<any>('rhuser')
const showStudentForm = ref(false)

const studentForms = ref<StudentProfile[]>([{
  id: 0, age: 0, grade: 1, reading_lvl: 0, first_name: '', last_name: '', birth_date: null, gender: '',
  school_name: '', school_dist: '', pref_lang: ''
}])

const data_ParentProfile = ref({
  first_name: '', last_name: '',
  birth_date: null as any,
  zipcode: '',
  phone_number: '',
  email: '',
  social_media: '',
  average_number_books: '',
  yearly_income: '',
  gender: '',
  marital_stat: '',
  user_id: rhuser.value?.id || 0,
})

const addStudent = () => {
  studentForms.value.push({
    id: 0, age: 0, grade: 1, reading_lvl: 0, first_name: '', last_name: '', birth_date: null, gender: '',
    school_name: '', school_dist: '', pref_lang: ''
  } as any)
}

const submitAccounts = async () => {
  await $fetch('/api/parent_submit', {
    method: 'POST',
    body: { parent: data_ParentProfile.value, students: studentForms.value }
  })
  alert('Parent registered.')
}
</script>

<template lang="pug">
div(class="centered-container flex justify-center items-center my-20")
  .form
    .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
      .form-header.text-center.bg-customBlue.p-6.rounded-t-lg.text-gray-100
        h2.text-4xl.font-medium.uppercase.tracking-wider Parent Registration Form
        .heading-line.w-32.h-1.bg-green-400.my-2.mx-auto.rounded-sm
      .form-input.grid.gap-6.p-8.bg-white.rounded-b-lg
        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 First Name
          input.p-3.text-base.border.border-gray-300.rounded-sm(v-model="data_ParentProfile.first_name" required)
        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 Last Name
          input.p-3.text-base.border.border-gray-300.rounded-sm(v-model="data_ParentProfile.last_name" required)

        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 Enter Birth Date
          VueDatePicker(v-model="data_ParentProfile.birth_date" :enable-time-picker="false" class="p-3 text-base border border-gray-300 rounded-sm")

        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 Gender
          select.p-3.text-base.border.border-gray-300.rounded-sm(v-model="data_ParentProfile.gender" required)
            option(value="" disabled selected) Select Gender
            option(value="M") Male
            option(value="F") Female

        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 Zipcode
          input.p-3.text-base.border.border-gray-300.rounded-sm(v-model="data_ParentProfile.zipcode" required)

        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 Yearly Income
          input.p-3.text-base.border.border-gray-300.rounded-sm(v-model="data_ParentProfile.yearly_income" required)

        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 Phone Number
          input.p-3.text-base.border.border-gray-300.rounded-sm(v-model="data_ParentProfile.phone_number" required)

        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 Email
          input.p-3.text-base.border.border-gray-300.rounded-sm(type="email" v-model="data_ParentProfile.email" required)

        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 Twitter Handle
          input.p-3.text-base.border.border-gray-300.rounded-sm(v-model="data_ParentProfile.social_media")

        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 Avg. Books/Year
          input.p-3.text-base.border.border-gray-300.rounded-sm(v-model="data_ParentProfile.average_number_books")

        .form-element.flex.flex-col
          label.text-lg.font-semibold.text-gray-800.mb-2 Marital Status
          input.p-3.text-base.border.border-gray-300.rounded-sm(v-model="data_ParentProfile.marital_stat")

      //- student sub-form (if you use a component, keep yours)
      .p-6
        button.bg-gray-700.text-white.rounded-md.py-2.px-4(@click="addStudent") + Add Student

      .button-container.flex.justify-center.mt-5
        button(type="submit" @click="submitAccounts" class="submit-button p-3 px-6 bg-customBlue text-white rounded-lg cursor-pointer text-lg") Submit
</template>
