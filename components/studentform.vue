<script lang="ts" setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import type { StudentProfile } from '@prisma/client';
import { Studentform } from '#components';
const props = defineProps<{ modelValue: StudentProfile }>()
const emit = defineEmits(["update:modelValue"])
const rhuser = useCookie<any>('rhuser') // might need to delete

const value = computed({  // recieves wtv you put in the string box
    get(){
        return props.modelValue
    },
    set(v: StudentProfile[]){
        emit("update:modelValue", v)
    },
})

const studentForms = ref <StudentProfile[]> ([])

// const studentForms = ref([
//   {
//     age: 0,
//     grade: 1,
//     reading_lvl: 0,
//     firstName: '',
//     lastName: '',
//     birthDate: null, // Use null for dates
//     zipcode: '',
//     gender: '',
//     school_name: '',  /// asssume that all the school names will be elementary schools so we should ask them to give the name of the school 
//     school_dist: '',  /// example format should be GISD (garland independent school district)
//     pref_lang: '', /// drop down option for either english, spanish(espanol), or other (only temporary until we can get more info on what languages they speak)  
//   }
// ]);

const addStudent = () => {
  studentForms.value.push({
    id: 0,
    age: 0,
    grade: 1,
    reading_lvl: 0,
    first_name: '',
    last_name: '',
    birth_date: null, // Use null for dates
    gender: '',
    school_name: '',  /// asssume that all the school names will be elementary schools so we should ask them to give the name of the school 
    school_dist: '',  /// example format should be GISD (garland independent school district)
    pref_lang: '', /// drop down option for either english, spanish(espanol), or other (only temporary until we can get more info on what languages they speak)  
  });
};

// Method to remove the last student form
const removeStudent = (index:number) => {
  if (studentForms.value.length > 1) {
    studentForms.value.splice(index,1);
  }
};

// Computed property to check if "Add Student" button should be disabled
const isAddStudentDisabled = computed(() => {
  return studentForms.value.length > 0;
});

</script>

<template lang="pug">
  div(v-for="(form, index) in value " :key="index" class="bg-gray-100 rounded-lg shadow-lg p-8 mx-auto mb-8 max-w-4xl w-full"
  )
    .form-header(class="text-center bg-customBlue p-6 rounded-t-lg text-gray-100")
      h2(class="text-4xl font-medium uppercase tracking-wider") Student \#{{index+1}} Registration
      .heading-line(class="w-32 h-1 bg-green-400 my-2 mx-auto rounded-sm")

    .form-input(class="grid p-8 bg-gray-100 rounded-b-lg")
      //- age
      div(class="flex flex-col mb-5")
        label(for="student_age" class="text-lg font-semibold text-gray-800 mb-2") Age
        input(type="number" v-model="form.age" placeholder="Student Age" 
               required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" id="student_age")


      //- School Name
      div(class="flex flex-col mb-5")
        label(for="student_school_name" class="text-lg font-semibold text-gray-800 mb-2") School Name
        input(type="text" v-model="form.school_name" placeholder="School Name" 
               required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" id="student_school_name")

      //- School District
      div(class="flex flex-col mb-5")
        label(for="student_school_district" class="text-lg font-semibold text-gray-800 mb-2") School District
        input(type="text" v-model="form.firstName" placeholder="School District" 
               required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" id="student_school_district")

      //- Preferred Languauge
      div(class="flex flex-col mb-5")
        label(for="student_pref_lang" class="text-lg font-semibold text-gray-800 mb-2") Preferred Languauge
        input(type="text" v-model="form.pref_lang" placeholder="Preferred Language" 
               required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" id="student_pref_lang")

      //- First Name
      div(class="flex flex-col mb-5")
        label(for="student_first_name" class="text-lg font-semibold text-gray-800 mb-2") First Name
        input(type="text" v-model="form.firstName" placeholder="Student First Name" 
               required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" id="student_first_name")

      //- Last Name
      div(class="flex flex-col mb-5")
        label(for="student_last_name" class="text-lg font-semibold text-gray-800 mb-2") Last Name
        input(type="text" v-model="form.lastName" placeholder="Student Last Name" 
               required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" id="student_last_name")

      //- Gender (dropdown selection)
      div(class="flex flex-col mb-5")
        label(for="student_gender" class="text-lg font-semibold text-gray-800 mb-2") Gender
        select(v-model="form.gender" required class="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg" id="student_gender")
          option(value="" selected disabled) Select Gender
          option(value="M") Male
          option(value="F") Female

      //- Birth Date (calendar)
      div(class="flex flex-col mb-5")
        label(for="student_birth_date" class="text-lg font-semibold text-gray-800 mb-2") Birth Date
        VueDatePicker(v-model="form.birthDate" name="student_birth_date" required 
                      class="w-full border-none text-lg transition-colors duration-300 focus:border-blue-500" id="student_birth_date" placeholder="Birth Date" :enable-time-picker="false")

      //- Grade (dropdown selection)
      div(class="flex flex-col mb-5")
        label(for="student_grade" class="text-lg font-semibold text-gray-800 mb-2") Grade
        select(v-model="form.grade" required class="w-full px-4 py-3 border border-gray-300 rounded-lg font-inherit" id="student_grade")
          option(value="" disabled selected) Select Grade
          option(v-for="grade in 10" :key="grade" :value="grade") {{ grade }}

      //- Reading Level (dropdown selection)
      div(class="flex flex-col mb-5")
        label(for="student_reading_level" class="text-lg font-semibold text-gray-800 mb-2") Reading Level
        select(v-model="form.readingLevel" required class="w-full px-4 py-3 border border-gray-300 rounded-lg" id="student_reading_level")
          option(value="" disabled selected) Select Reading Level
          option(v-for="rLevel in 10" :key="rLevel" :value="rLevel") {{ rLevel }}

      //- Zipcode (allow only numbers)
      div(class="flex flex-col mb-5")
        label(for="student_zipcode" class="text-lg font-semibold text-gray-800 mb-2") Zipcode
        input(type="number" v-model="form.zipcode" placeholder="Student Zipcode" 
               required class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors duration-300 focus:border-blue-500" id="student_zipcode")

    .button-container(class="flex justify-center gap-5 mt-4")
      button(v-if="studentForms.length == (index+1)" @click="addStudent" :disabled="index+1 != studentForms.length" 
             class="px-6 py-3 bg-[#122c4f] text-white rounded-lg cursor-pointer font-semibold text-lg transition-all duration-300 ease-in-out hover:bg-[#1a1a2e]") + Student
      button(v-if="studentForms.length > 1" @click="removeStudent(index)" 
             class="px-6 py-3 bg-[#122c4f] text-white rounded-lg cursor-pointer font-semibold text-lg hover:bg-[#1a1a2e]") - Student
</template>