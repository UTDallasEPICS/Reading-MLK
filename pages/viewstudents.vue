<script lang="ts" setup>
import { ref, computed } from 'vue'; // imported computed
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

const studentForms = ref <StudentProfile[]> ([
  //{
  //  id: 0,
  //  age: 0,
  //  grade: 1,
  //  reading_lvl: 0,
  //  first_name: '',
  //  last_name: '',
  //  birth_date: null, // Use null for dates
  //  gender: '',
  //  school_name: '',  /// asssume that all the school names will be elementary schools so we should ask them to give the name of the school 
  //  school_dist: '',  /// example format should be GISD (garland independent school district)
  //  pref_lang: '', /// drop down option for either english, spanish(espanol), or other (only temporary until we can get more info on what languages they speak)  
  //}
])

const searchFilters = ref<Partial<StudentProfile>>({
  first_name: '',
  last_name: '',
  school_name: '',
  school_dist: '',
  gender: '',
  birth_date: null,
  grade: undefined,
  reading_lvl: undefined
})

const searchResults = ref<StudentProfile[]>([])

const keyfield = ref<string>('first_name')

const performSearch = async () => {
  try {
    // choose which field to search on; set keyfield from your UI (e.g. 'first_name')
    const keyToSearch = keyfield.value ?? 'first_name';

    // server expects `searchQuery` (JSON string) and `key`
    const res = await $fetch('/api/student/search', {
      method: 'GET',
      query: {
        searchQuery: JSON.stringify(searchFilters.value),
        key: keyToSearch
      }
    })

    // server returns { data: [...] }
    searchResults.value = (res && (res.data ?? res)) as StudentProfile[] || [];
  } catch (error) {
    console.error('Error performing search:', error);
    searchResults.value = [];
  }
}

const clearFilters = () => {
  searchFilters.value = {
    first_name: '',
  last_name: '',
  school_name: '',
  school_dist: '',
  gender: '',
  birth_date: null,
  grade: undefined,
  reading_lvl: undefined
  }
  searchResults.value = []
}

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

//const addStudent = () => {
//  studentForms.value.push({
//    id: 0,
//    age: 0,
//    grade: 1,
//    reading_lvl: 0,
//    first_name: '',
//    last_name: '',
//    birth_date: null, // Use null for dates
//    gender: '',
//    school_name: '',  /// asssume that all the school names will be elementary schools so we should ask them to give the name of the school 
//    school_dist: '',  /// example format should be GISD (garland independent school district)
//    pref_lang: '', /// drop down option for either english, spanish(espanol), or other (only temporary until we can get more info on what languages they speak)  
//  });
//};

// Method to remove the last student form
//const removeStudent = (index:number) => {
//  if (studentForms.value.length > 1) {
//    studentForms.value.splice(index,1);
//  }
//};

// Computed property to check if "Add Student" button should be disabled
//const isAddStudentDisabled = computed(() => {
//  return studentForms.value.length > 0;
//});

</script>

<template lang="pug">
div(class="bg-gray-100 rounded-lg shadow-lg p-8 mx-auto mb-8 max-w-4xl w-full")
  .form-header(class="text-center bg-customBlue p-6 rounded-t-lg text-gray-100")
    h2(class="text-4xl font-medium uppercase tracking-wider") Student Search
    .heading-line(class="w-32 h-1 bg-green-400 my-2 mx-auto rounded-sm")

  .form-input(class="grid p-8 bg-gray-100 rounded-b-lg")
    //- Field selector (key)
    .field(class="flex items-center gap-4 mb-4")
      label(for="search_key" class="text-lg font-semibold") Search Field:
      select(id="search_key" v-model="keyfield" class="p-2 border rounded")
        option(value="first_name") First Name
        option(value="last_name") Last Name
        option(value="school_name") School
        option(value="school_dist") District
        option(value="grade") Grade
        option(value="reading_lvl") Reading Level
        option(value="gender") Gender

    //- Input for the selected field
    .field(class="flex flex-col mb-5")
      label(class="text-lg font-semibold mb-2") Search Value
      input(type="text" v-model="searchFilters[keyfield]" placeholder="Enter search value" class="p-3 border rounded")

    .button-container(class="flex justify-center gap-5 mt-4")
      button(@click="performSearch" class="px-6 py-3 bg-[#122c4f] text-white rounded-lg font-semibold") Search
      button(@click="clearFilters" class="px-6 py-3 bg-gray-300 rounded-lg") Clear

//- Results area
div(class="mx-auto max-w-4xl mt-6")
  div(v-if="searchResults.length === 0" class="text-center text-gray-500") No results
  div(v-else)
    div(v-for="(student, idx) in searchResults" :key="student.id" class="p-4 mb-3 border rounded")
      div.font-semibold {{ student.User?.first_name ?? student.first_name }} {{ student.User?.last_name ?? student.last_name }}
      div.text-sm.text-gray-600 {{ student.school_name }} — Grade: {{ student.grade }} — Reading level: {{ student.reading_lvl }}
      //- add edit/view links (optional)
      //a(:href=`/edit/editsudent?id=${student.id}`) Edit
</template>