<template lang="pug"> 
  .database-view(class="bg-gray-100 p-5 font-sans")
    .header(class="flex flex-col justify-center items-center bg-gray-700 p-6 rounded-lg shadow-lg mb-8") 
      h2(class="text-4xl font-bold text-gray-100 uppercase tracking-wide mb-2 relative") Parent
      .heading-line(class="block w-16 h-1 bg-teal-400 my-2 mx-auto rounded relative")
    .search-container(class="mb-6 p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center")
      h3.text-2xl.font-semibold.mb-6.text-center Search Parent Database 
      .search-form.flex.flex-wrap.gap-8.mb-6.justify-center
        .field(v-for="(header, index) in tableHeaders" :key="index" class="flex flex-col w-full max-w-xs mb-6")
          label(class="text-lg font-semibold text-gray-700 mb-2 transition-all duration-300 ease-in-out transform hover:text-teal-600") {{ header.label }}
          input(v-if="header.type !== 'checkbox'" :id="header.id" v-model="filters[header.id]" @change="keyfield=header.id" :placeholder="header.placeholder" class="p-3 text-base border border-gray-300 rounded-md w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500")
      .button-group.flex.justify-center.gap-4.mt-6
        button(@click="performSearch" class="clear-button p-3 px-5 text-base font-semibold text-white bg-teal-500 rounded-lg transition-colors duration-300 hover:bg-teal-600 focus:outline-none") Search
        button(@click="clearSearch" class="clear-button p-3 px-5 text-base font-semibold text-white bg-red-500 rounded-lg transition-colors duration-300 hover:bg-red-600 focus:outline-none") Clear
    .table-wrapper.overflow-x-auto.rounded-lg.shadow-lg
      table.table.w-full.border-collapse.text-sm.text-gray-800.bg-gray-50
        thead.table-head.text-xs.text-white.bg-gray-700.uppercase
          tr
            th(v-for="header in h" :key="header" class="table-cell p-3 border-b border-gray-200 text-center") {{ header }}
        tbody
          tr(v-for="(u, index) in Parents" :key="u.id" :class="['table-row', index % 2 === 0 ? 'bg-gray-100' : 'bg-white', 'hover:shadow-lg', 'hover:scale-[0.99]', 'transition-transform', 'duration-200']") 
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ u.zipcode }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ u.yearly_income }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ new Date(u.birth_date).toLocaleString("en-US", {year: "numeric", month: "long", day: "numeric",}) }}
            //- td(class="table-cell p-3 border-b border-gray-200 text-center") {{ u.average_number_books }} // in review
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ u.phone_number }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ u.gender }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ u.marital_stat }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ u.User.first_name }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ u.User.last_name }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ u.User.email }}
            td(class="table-cell p-3 border-b border-gray-200 text-center") {{ u.social_media }}
            td(class="table-cell p-3 border-b border-gray-200 text-center")
              button(v-if="!editButtonPressed" @click="goToEdit(u.id)" class="action-button edit-button rounded-md py-2 px-4 text-xs font-semibold text-white cursor-pointer bg-teal-500 hover:bg-teal-600 focus:outline-none transition-all") Edit
            td(class="table-cell p-3 border-b border-gray-200 text-center")
              button(@click="removeParent(u.id)" class="action-button remove-button rounded-md py-2 px-4 text-xs font-semibold text-white cursor-pointer bg-red-500 hover:bg-red-600 focus:outline-none transition-all" ) Remove
</template>



<script setup lang="ts">
  import type { User, ParentProfile } from "@prisma/client";
  import { ref } from "vue";

  const editButtonPressed = ref(false)  
  const searchButtonHover = ref("#48bb78")
  const clearButtonHover = ref("#e53e3e")

  const keyfield = ref("zipcode");
  const searchTerm = ref("");
  const filters = ref<ParentProfile & Partial<User>>({
    zipcode: "",
    yearly_income: "",
    birth_date: null,
    average_number_books: 0,
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender: "",
    marital_stat: "",
    social_media: "",
    id: 0,
    user_id: 0
  });

  const tableHeaders = [
        { id: 'zipcode', label: 'Zip Code', placeholder: 'Zip Code', type: 'string' },
        { id: 'yearly_income', label: 'Yearly Income', placeholder: 'Yearly Income', type: 'string' },
        { id: 'birth_date', label: 'Birth Date', placeholder: 'Birth Date', type: new Date() },
        // { id: 'average_number_books', label: 'Avg. # of Books', placeholder: 'Avg. # of Books', type: 5 }, // in review
        { id: 'phone_number', label: 'Phone Number', placeholder: 'Phone Number', type: 'string' },
        { id: 'gender', label: 'Gender', placeholder: 'Gender', type: 'string' },
        { id: 'marital_stat', label: 'Marital Status', placeholder: 'Marital Status', type: 'string' },
        { id: 'first_name', label: 'First Name', placeholder: 'First Name', type: 'string' },
        { id: 'last_name', label: 'Last Name', placeholder: 'Last Name', type: 'string' },
        { id: 'email', label: 'Email', placeholder: 'Email', type: 'string' },
        { id: 'social_media', label: 'Social Media', placeholder: 'Social Media', type: 'string' },
      ];

  const h = [
    "Zip Code", "Yearly Income", "Birth Date", 
    // "Avg. # of Books", // in review
    "Phone Number", "Gender", "Marital Status", "First Name", "Last Name", "Email", "Social Media", "Edit", "Remove"
  ]
  
  const addDataToDatabase = async (jsonData: any) => {

  for (const record of jsonData) {
    const newParent = {
        zipcode: record['zipcode'],     
        yearly_income: record['yearly_income'],
        birth_date: record['birth_date'],
        average_number_books: record['average_number_books'],     
        first_name: record['first_name'],   
        last_name: record['last_name'],
        email: record['email'],    
        phone_number: record['phone_number'],  
        gender: record['gender'],    
        marital_stat: record['marital_stat'],
        social_media: record['social_media'], 
    };

    // Use Prisma to add the new parent to the database
    await $fetch('/api/parent/parent', {
      method: 'POST',
      body: newParent,
    });
  }
  };

  type Parent = {
    id: number,
    zipcode: string,     
    yearly_income: string, 
    birth_date: Date,
    average_number_books: number,     
    first_name: string,   
    last_name: string,
    email: string,    
    phone_number: string,  
    gender: string,    
    marital_stat: string,
    social_media: string,
  }
    
  const Parents = ref<Parent[]>([])
  const ParentObject = ref({
    zipcode: "",     
    yearly_income: "", 
    birth_date: null,  
    average_number_books: 0,   
    first_name: "",   
    last_name: "",
    email: "",    
    phone_number: "",  
    gender: "",     
    marital_stat: "",
    social_media: "",
  })

  await getParents()
    
  async function getParents() {
    const { data: parentList } = await useFetch('/api/parent', {
          method: 'GET',
      })
      Parents.value = parentList.value as unknown as Parent[];
      return parentList;
  }

  async function goToEdit(parentId: number) {
    console.log(parentId)
    const editUrl = '/edit/editparent?' + 'id=' + parentId
    navigateTo(editUrl)
  }

  const removeParent = async (id: number) => {
      await $fetch('/api/parent/parent', {
          method: 'DELETE',
          body: { id },
      });
    //  Parents.value = await getParents();
  } 

  const performSearch = async () => {
    const searchQuery: Record<string, string | Date | number> = {};

    Object.entries(filters.value).forEach(([key, value]) => {
      // Only include non-null, non-empty values in the search query
      if (value !== "" && value !== null && value !== 0 && value !== undefined) {
        // For birth_date, only include if it's a valid date
        if (key === "birth_date") {
          if (value instanceof Date && !isNaN(value.getTime())) {
            searchQuery[key] = value;
          }
        } else {
          searchQuery[key] = value;
        }
      }
    });

    try {
      const result = await $fetch('/api/parent/search', {
        method: 'GET',
        query: {
          searchQuery: JSON.stringify(searchQuery),
          key: keyfield.value
        },
      });

      if (result?.data) {
        Parents.value = result.data as unknown as Parent[];
      } else {
        Parents.value = [];
      }
    } catch (error) {
      console.error("Error performing search:", error);
      Parents.value = [];
    }
  }

  const clearSearch = () => {
    ParentObject.value = {
      zipcode: "",
      yearly_income: "",
      birth_date: null,
      average_number_books: 0,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      gender: "",
      marital_stat: "",
      social_media: "",
    };
  };
  const rhuser = useCookie<User>('rhuser')
  const userRole = (rhuser.value?.role)
  console.log(rhuser.value.role)
  const currid = (rhuser.value?.id)

</script>