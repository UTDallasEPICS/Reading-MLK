<template lang = "pug">
  div(class="content-center")
      <!-- Submission form for editing faculty profile -->
      .flex.flex-col.gap-5(class="content-center px-10")
        h2.text-center.text-3xl.font-bold.mt-6 Edit Faculty Profile
        hr.rounded.center-text(style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px")

        <!-- Form fields -->
        div(class="mt-10 w-3/5 mx-auto grid grid-cols-1 gap-y-8")
            div(class="")
                .py-4.grid(class="" )
                    Label Zipcode
                        Input(v-model='parent.zipcode' name="zipcode" id="zipcode" placeholder="(Ex: 12345)" required)
                .py-4.grid(class="" )
                    Label Yearly Income
                        Input(v-model='parent.yearly_income' name="yearly_income" id="yearly_income" placeholder="(Ex: 12345)" required)
                .py-4.grid(class="" )
                    Label Birth Date
                        Input(v-model='parent.birth_date' name="birth_date" type="Date" id="birth_date" placeholder="(Ex: 01/01/2000)" required)
                .py-4.grid(class="" )
                    Label Avg. Number of Books Read to Child
                        Input(v-model='parent.average_number_books' name="average_number_books" id="average_number_books" placeholder="(Ex: 1)" required)
                .py-4.grid(class="" )
                    Label Phone Number
                        Input(v-model='parent.phone_number' name="phone_number" id="phone_number" placeholder="(Ex: 1234567891)" required)
                .py-4.grid(class="" )
                    Label Gender
                        select(v-model="parent.gender" name="gender" id="gender" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500"  placeholder = "(Ex: Male, Female, or Other)" required)
                            option(:value="Male") Male
                            option(:value="Female") Female
                            option(:value="Other") Other
                .py-4.grid(class="" )
                    Label Marital Status
                        select(v-model="parent.marital_stat" name="marital_stat" id="marital_stat" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500"  placeholder = "(Ex: Single, Married, Divorced, or Widowed)" required)
                            option(:value="Single") Single
                            option(:value="Married") Married
                            option(:value="Divorced") Divorced
                            option(:value="Widowed") Widowed
                .py-4.grid(class="" )
                    Label First Name
                        Input(v-model='parent.first_name' name="first_name" id="first_name" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label Last Name
                        Input(v-model='parent.last_name' name="last_name" id="last_name" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label Email
                        Input(v-model='parent.email' name="email" id="email" placeholder="(user defined)" required)
                .py-4.grid(class="" )
                    Label Social Media
                        Input(v-model='parent.social_media' name="social_media" id="social_media" placeholder="(user defined)" required)
      .flex
            button(type="button" class="rounded mb-4 bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-60 mx-auto" @click="editFaculty(faculty)") Apply Edits
      </template>
      
<script setup lang="ts">
import { ref, onMounted } from 'vue';
const rhuser = useCookie<any>('rhuser')
const userRole = rhuser.value.role
const id = rhuser.value?.id;

interface ParentProfile {
  id: number | null;
  zipcode: number;
  yearly_income: string;
  birth_date: Date;
  average_number_books: number;
  phone_number: string;
  gender: string;
  marital_stat: string;
  first_name: string;
  last_name: string;
  email: string;
  social_media: string;
}

var parent = ref<ParentProfile>({
  id: null,
  zipcode: 0,
  yearly_income: "",
  birth_date: new Date(),
  average_number_books: 0,
  phone_number: "",
  gender: "",
  marital_stat: "",
  first_name: "",
  last_name: "",
  email: "",
  social_media: "",
});

// Fetch parent profile based on URL parameter
const uri = new URL(window.location.href)
const parentId = (new URLSearchParams(uri.search)).get('id')

onMounted(async()=>{
  if(parentId){
    try{
      const fetchedParent = await getParent();
      parent.value = fetchedParent;;
    } catch(error){
      console.error("Error fetching the parent data: ", error);
    }
  }
});

async function getParent(): Promise<ParentProfile> {
  try{
      const response= await $fetch<ParentProfile>(`/api/parent/${parentId}`);
      return response;
  } catch(error){
    console.error("Error fetching parent data: ", error);
    throw error;
  }
};

const editParent = async (editedParent: ParentProfile) => {
  console.log('Edited Parent Profile:', editParent);
  console.log(editedParent)
  let parent = null;
  try {
    parent = await $fetch('/api/parent/parent', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        //JSON.stringify(editedParent)
        id: editedParent.id,
        zipcode: editedParent.zipcode,
        yearly_income: editedParent.yearly_income,
        average_number_books: editedParent.average_number_books,
        phone_number: editedParent.phone_number,
        birth_date: editedParent.birth_date,
        gender: editedParent.gender,
        marital_stat: editedParent.marital_stat,
        first_name: editedParent.first_name,
        last_name: editedParent.last_name,
        email: editedParent.email,
        social_media: editedParent.social_media,
      },
    });
    console.log('Parent profile edited successfully');
  } catch (error) {
    console.log('Error editing parent profile:');
  }
  navigateTo('/viewparents')
};

const save = async () => {
const data = await $fetch<ParentProfile>('/api/parent', {
  method:'PUT',
  body: ({...parent.value, id: id.value as string})
}).catch((error)=>{
  console.log("Error: ",error.data.message);
});
console.log(data)
if(data && (data as any).success){
  await navigateTo('/parent')
}
}
</script>
