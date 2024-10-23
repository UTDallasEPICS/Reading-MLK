<template lang="pug">
  div
    div
      h2.text-center.text-3xl.font-bold.mt-4(style="margin-top: 35px") View Database
      br
  
    //- Table for database display
    div.mt-4.mx-10
      .relative.overflow-x-auto.rounded-lg
        table.w-full.text-sm.text-center.text-gray-500.dark\\:text-gray-400
          thead.text-sm.text-gray-700.uppercase.bg-gray-50.dark\\:bg-gray-700.dark\\:text-gray-400
            tr.h-9
              th.px-6.py-3 Zip Code
              th.px-6.py-3 Yearly Income
              th.px-6.py-3 Birth Date
              th.px-6.py-3 Average Number of Books
              th.px-6.py-3 Password
              th.px-6.py-3 Phone Number
              th.px-6.py-3 Gender
              th.px-6.py-3 Marital Status
              th.px-6.py-3 First Name
              th.px-6.py-3 Last Name
              th.px-6.py-3 Email
              th.px-6.py-3 Social Media
              th.px-6.py-3 Edit
              th.px-6.py-3 Remove
  
          tbody
            tr.h-9(v-for="u in parents" :key="u.id")
              td {{ u.zipcode }}
              td {{ u.yearly_income }}
              td {{ u.birth_date }}
              td {{ u.avg_num_book }}
              td {{ u.password }}
              td {{ u.phone_number }}
              td {{ u.gender }}
              td {{ u.marital_stat }}
              td {{ u.first_name }}
              td {{ u.last_name }}
              td {{ u.email }}
              td {{ u.social_media }}
  
              td
                button#editUserButton.rounded-md.bg-indigo-600.px-3.py-2.text-xs.font-semibold.text-white.shadow-sm.hover\\:bg-indigo-500
                  .focus-visible\\:outline.focus-visible\\:outline-2.focus-visible\\:outline-offset-2.focus-visible\\:outline-indigo-600(
                    v-if="!editButtonPressed"
                    @click="goToEdit(u.id)"
                  ) Edit
  
              td
                button#applyRemoveButton.rounded-md.bg-indigo-600.px-3.py-2.text-xs.font-semibold.text-white.shadow-sm.hover\\:bg-indigo-500
                  .focus-visible\\:outline.focus-visible\\:outline-2.focus-visible\\:outline-offset-2.focus-visible\\:outline-indigo-600(
                    @click="removeParent(u.id)"
                  ) Remove
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // State management
  const editButtonPressed = ref(false);
  const parents = ref(null);
  
  // Fetching parent data from API
  parents.value = await getParents();
  
  async function getParents() {
    const parentList = await $fetch("/api/parent/parent", { method: "GET" });
    parents.value = parentList;
    return parentList;
  }
  
  // Navigate to edit page
  async function goToEdit(parentId) {
    const editUrl = "/editparent?" + "id=" + parentId;
    navigateTo(editUrl);
  }
  
  // Remove parent from the database
  const removeParent = async (id) => {
    await $fetch("/api/parent/parent", {
      method: "DELETE",
      body: { id },
    });
    parents.value = await getParents();
  };
  
  const rhuser = useCookie('rhuser')
  const userRole = (rhuser.value.role)
  console.log(rhuser.role)
  const currid = parseInt(rhuser.value.id)

  </script>
  