<template lang="pug">
  .database-view(style="font-family: Arial, sans-serif; background-color: #f0f4f8; padding: 20px;")
    .header(style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #2d3748; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); margin-bottom: 2rem;") 
      h2(style="font-size: 2.5rem; font-weight: 700; color: #f7fafc; text-transform: uppercase; letter-spacing: 0.1rem; margin: 0; position: relative;"
        ) Parent
      .heading-line(style="content: ''; display: block; width: 5%; height: 4px; background-color: #48bb78; margin: 0.5rem auto 0; border-radius: 2px;")

    .search-container(style="margin-bottom: 1.5rem; padding: 1.5rem; background-color: #ffffff; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); justify-content: center; justify-items: center;")
      h3(style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;") Search Parent Database 
      .search-form(style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 2rem; column-gap: 5rem; margin-bottom: 1.5rem;")
        .field(v-for="(header, index) in tableHeaders" :key="index" :style="{'display': 'flex', 'flex-direction': 'column', 'width': '100%', 'max-width': '250px', 'margin-bottom': '1.5rem'}")
          label(style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem; transition: color 0.3s ease, transform 0.2s ease;") {{header.label}}
          input(v-if="header.type !== 'checkbox'" :id="header.id" :placeholder="header.placeholder" :style="{'padding': '0.75rem', 'font-size': '1rem', 'border': '1px solid #ccc', 'border-radius': '0.25rem', 'width': '100%', 'transition': 'border-color 0.3s ease, box-shadow 0.3s ease;'}")
          input(v-if="header.type === 'checkbox'" type="checkbox" :id="header.id" :style="{'padding': '0.75rem', 'font-size': '1rem', 'border': '1px solid #ccc', 'border-radius': '0.25rem', 'width': '10%', 'transition': 'border-color 0.3s ease, box-shadow 0.3s ease;'}")
      .button-group(style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;")
        button(@click="performSearch" class="clear-button" :style="{padding: '0.75rem 1.25rem', fontSize: '1rem', fontWeight: '600', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '0.375rem', backgroundColor: searchButtonHover, transition: 'background-color 0.3s'}"
          @mouseover="searchButtonHover = '#38a169'"
          @mouseleave="searchButtonHover = '#48bb78'"
        ) Search
        button(@click="clearSearch" class="clear-button" :style="{padding: '0.75rem 1.25rem', fontSize: '1rem', fontWeight: '600', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '0.375rem', backgroundColor: clearButtonHover, transition: 'background-color 0.3s'}"
          @mouseover="clearButtonHover = '#c53030'"
          @mouseleave="clearButtonHover = '#e53e3e'"
        ) Clear

    .table-container(style="margin-top: 2rem; padding: 20px;")
      .table-wrapper(style="overflow-x: auto; border-radius: 0.5rem; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);")
        table(class="table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem; color: #333; background-color: #f7fafc;")
          thead(class="table-head" style="font-size: 0.875rem; color: #ffffff; background-color: #4a5568; text-transform: uppercase;")
            tr
              th(v-for="header in h" :key="header" class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ header }}
          
          tbody
            tr(v-for="(u, index) in Parents" :key="u.id" :class="['table-row', index % 2 === 0 ? 'bg-light' : 'bg-white']")
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.zipcode }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.yearly_income}}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.birth_date }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.average_number_books }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.phone_number }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.gender }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.marital_stat }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.first_name }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.last_name }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.email }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") {{ u.social_media }}
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;") 
                button( v-if="!editButtonPressed" @click="goToEdit(u.id)" class="action-button edit-button" style="border-radius: 0.375rem; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 600; color: #ffffff; border: none; cursor: pointer; background-color: #48bb78;"
                  ) Edit
              td(class="table-cell" style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;")
                button(@click="removeFaculty(u.id)" class="action-button remove-button" style="border-radius: 0.375rem; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 600; color: #ffffff; border: none; cursor: pointer; background-color: #e53e3e;"
                  ) Remove
      
    
</template>

<script setup lang="ts">
  import type { User } from "@prisma/client";
  import { ref } from "vue";

  const editButtonPressed = ref(false)  
  const searchButtonHover = ref("#48bb78")
  const clearButtonHover = ref("#e53e3e")

  const tableHeaders = [
        { id: 'zipcode', label: 'Zip Code', placeholder: 'Zip Code', type: 'text' },
        { id: 'yearlyIncome', label: 'Yearly Income', placeholder: 'Yearly Income', type: 'text' },
        { id: 'birthDate', label: 'Birth Date', placeholder: 'Birth Date', type: 'text' },
        { id: 'avgBookNum', label: 'Avg. # of Books', placeholder: 'Avg. # of Books', type: 'text' },
        { id: 'phone', label: 'Phone Number', placeholder: 'Phone Number', type: 'text' },
        { id: 'gender', label: 'Gender', placeholder: 'Gender', type: 'text' },
        { id: 'maritalStat', label: 'Marital Status', placeholder: 'Marital Status', type: 'text' },
        { id: 'firstname', label: 'First Name', placeholder: 'First Name', type: 'text' },
        { id: 'lastname', label: 'Last Name', placeholder: 'Last Name', type: 'text' },
        { id: 'email', label: 'Email', placeholder: 'Email', type: 'text' },
        { id: 'socialmedia', label: 'Social Media', placeholder: 'Social Media', type: 'text' },
      ];

  const h = [
    "Zip Code", "Yearly Income", "Birth Date", "Avg. # of Books", "Phone Number", "Gender", "Marital Status", "First Name", "Last Name", "Email", "Social Media", "Edit", "Remove"
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
    birth_date: new Date(),  
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
    const editUrl = '/archives/editparent?' + 'id=' + parentId
    navigateTo(editUrl)
  }

  const removeParent = async (id: number) => {
      await $fetch('/api/parent/parent', {
          method: 'DELETE',
          body: { id },
      });
    //  Parents.value = await getParents();
  } 

  const performSearch = () => {}
  const clearSearch = () => {
    ParentObject.value = {
      zipcode: "",
      yearly_income: "",
      birth_date: new Date(),
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