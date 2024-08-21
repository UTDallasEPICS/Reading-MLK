<template>
    <div>
    <div>
      <h2 class="text-center text-3xl font-bold mt-4"  style="margin-top: 35px">View Database</h2>
      <br>
    </div>

    <!--table for the database display-->
    <div class="mt-4 mx-10">
      <div class="relative overflow-x-auto rounded-lg">
        <table class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
          <thead class="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr class="h-9">
            <th scope="col" class="px-6 py-3">Zip Code</th>
            <th scope="col" class="px-6 py-3">Yearly Income</th>
            <th scope="col" class="px-6 py-3">Birth Date</th>
            <th scope="col" class="px-6 py-3">Average Number of Books</th>
            <th scope="col" class="px-6 py-3">Password</th>
            <th scope="col" class="px-6 py-3">Phone Number</th>
            <th scope="col" class="px-6 py-3">Gender</th>
            <th scope="col" class="px-6 py-3">Marital Status</th>
            <th scope="col" class="px-6 py-3">First Name</th>
            <th scope="col" class="px-6 py-3">Last Name</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Social Media</th>
            <th scope="col" class="px-6 py-3">Edit</th>
            <th scope="col" class="px-6 py-3">Remove</th>
          </tr>
          </thead>
          <tbody>
          <tr class="h-9" v-for="(u) in parents">            
            <td>
              <div>{{ u.zipcode }}</div>
            </td>
            <td>
              <div>{{ u.yearly_income }}</div>
            </td>
            <td>
              <div>{{ u.birth_date }}</div>
            </td>
            <td>
              <div>{{ u.avg_num_book }}</div>
            </td>
            <td>
              <div>{{ u.password }}</div>
            </td>
            <td>
              <div>{{ u.phone_number }}</div>
            </td>
            <td>
              <div>{{ u.gender }}</div>
            </td>
            <td>
              <div>{{ u.marital_stat }}</div>
            </td>
            <td>
              <div>{{ u.first_name }}</div>
            </td>
            <td>
              <div>{{ u.last_name }}</div>
            </td>
            <td>
              <div>{{ u.email }}</div>
            </td>
            <td>
              <div>{{ u.social_media }}</div>
            </td>

            <td>
              <button id="editUserButton" class="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm
            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-indigo-600" v-if="!editButtonPressed" @click='goToEdit(u.id)'>Edit</button>
            </td>

            <!--Remove function-->
            <td>
              <button id="applyRemoveButton" class="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm
            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-indigo-600" @click="removeParent(u.id)">Remove</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";

  const editButtonPressed = ref(false)
  
  const parents = ref(null)
  
  parents.value = await getParents()

async function getParents() {
    const parentList = await $fetch('/api/parent/parent', {
        method: 'GET',
    })
    parents.value = parentList;
    return parentList;
}

async function goToEdit(parentId) {
  const editUrl = '/editparent?' + 'id=' + parentId
  navigateTo(editUrl)
}

const removeParent = async (id) => {
    await $fetch('/api/parent/parent', {
        method: 'DELETE',
        body: { id },
    });
    parents.value = await getParents();
}



  
  const cvuser = useCookie('cvuser')
  const userRole = (cvuser.value.role)
  console.log(cvuser.role)
  const currid = parseInt(cvuser.value.id)

  </script>
