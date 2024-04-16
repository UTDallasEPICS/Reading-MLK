<template>
    <div class="content-center">
        <div class="container content-center" id="form" style="margin: 0 auto">
            <h2 class="text-center text-3xl font-bold mt-6">Edit Users</h2>
            <h3 class="text-center text-s font-bold">Edit the staff and teachers info as the admin and their permissions
            </h3>
            <hr class="rounded center-text"
                style="border-top: 7px solid #122C4F; width: 65%; margin: 0 auto; margin-top: 7px">
            <div class="mt-10 grid grid-cols-1 gap-x-24 gap-y-8 sm:grid-cols-6 mx-40">

                <div class="sm:col-span-3 ml-28">
                    <label for="user-name" class="block text-lg font-medium leading-6 text-gray-900">User Name</label>
                    <div class="mt-2">
                        <input v-model="user.user_name" type="text" name="user-name" id="user-name"
                            autocomplete="given-name"
                            class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
                    </div>
                </div>

                <div class="sm:col-span-3 ml-28">
                    <label for="email" class="block text-lg font-medium leading-6 text-gray-900">Email</label>
                    <div class="mt-2">
                        <input v-model="user.email" type="text" name="email" id="email" autocomplete="email" class="block w-full
              rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
                    </div>
                </div>
                <div class="sm:col-span-3 ml-28">
                    <label for="client_cuid" class="block text-lg font-medium leading-6 text-gray-900">Custom UserName</label>
                    <div class="mt-2">
                        <input v-model="user.client_cuid" type="text" name="cuid" id="cuid" autocomplete="cuid" class="block w-full
              rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const users = ref(null)

var user = ref({
    id: null,
    user_name: null,
    email: null,
    client_cuid: null,
    role: null,
})


user.value = await getUsers()
let url = new URL(window.location.href)
let queryParams = new URLSearchParams(url.search)
let userId = Object.fromEntries(queryParams).id

  for (let i = 0; i < users.value.length; i++) {
      if (users.value[i].id == userId) {
        user = {
        id: users.value[i].id,
        user_name: users.value[i].user_name,
        email: users.value[i].email,
        client_cuid: users.value[i].client_cuid,
        role: users.value[i].role,
        }
      }
  }


  async function getUsers() {
  return await $fetch('/api/user')
  }


  async function editUser(editedUser) {
    console.log(editedUser)
  let user = null
  
  console.log('editedUser: ', editedUser)
  
    if(editedUser)
      user = await $fetch('/api/user', {
        method: 'PUT',
        body: {
          id: parseInt(editedUser.id),
          user_name: editedUser.user_name,
          email: editedUser.email,
          client_cuid: editedUser.client_cuid,
          role: editedUser.role
        }
      })
    navigateTo('/admin')
  if(user)   users.value = await getUsers()
  }
</script>