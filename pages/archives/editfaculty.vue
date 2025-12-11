<template lang="pug">
div(class="text-center")
    .flex.flex-col.gap-5(class="text-center px-10")
        TitleDisplay Edit Faculty
        div(class="text-center px-10 border-solid border border-gray-700 border-2")

        div
            .py-4.grid
                Label * First Name:
                    Input(v-model='data_FacultyProfile.first_name' name="first_name" id="first_name" required)

            .py-4.grid
                Label * Last Name:
                    Input(v-model='data_FacultyProfile.last_name' name="last_name" id="last_name" required)

            .py-4.grid
                Label * School District currently working in:
                    Input(v-model='data_FacultyProfile.district' name="district_teach" id="district_teach" placeholder="(Ex: DISD)" required)

            .py-4.grid
                Label * Faculty Email:
                    Input(v-model='data_FacultyProfile.faculty_email' name="faculty_email" id="faculty_email" required)

            .py-4.grid
                Label * Do you teach a dual language class?
                    select(v-model="data_FacultyProfile.dual_lang" name="dual_lang" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500")
                        option(:value="false") Do you Teach a Bilingual Class
                        option(:value="true") Yes
                        option(:value="false") No

            .py-4.grid
                Label * School Name:
                    Input(v-model='data_FacultyProfile.school_name' name="school_name" id="school_name" required)

            .py-4.grid
                Label * Department:
                    Input(v-model='data_FacultyProfile.department' name="department" id="department" placeholder="(Ex: English, Science, Math)" required)

            .py-4.grid
                Label * Phone number:
                    Input(v-model='data_FacultyProfile.phone_number' name="phone_number" id="phone_number" placeholder="(Ex: 1234567891)" required)

            .py-4.grid
                Label * Grade you teach:
                    Input(v-model='data_FacultyProfile.grade' name="grade" id="grade" required)

    .flex.flex-col.gap-5(class="border-solid border border-gray-700 border-2 py-4")

    // ---------------------------------------------------
    // 🔥 Only Admin OR Faculty can edit — button hidden for Parent/Student
    // ---------------------------------------------------
    Button.mx-auto.text-md(
        v-if="userRole === 'admin' || userRole === 'faculty'"
        @click="editFaculty(data_FacultyProfile)"
        class="transition duration-500 bg-blue-500 hover:bg-green-400 rounded-lg px-4 py-2"
    ) Apply Edits
</template>

<style scoped>
.input {
  @apply w-full px-4 py-2 border rounded-md;
}
.select {
  @apply w-full px-4 py-2 border rounded-md;
}
.btn {
  @apply w-full py-2 text-white font-semibold bg-blue-500 hover:bg-blue-700 rounded-md;
}
</style>

<script setup>
const rhuser = useCookie("rhuser");
const userRole = rhuser.value?.role; // ⬅ role comes from cookie

const data_FacultyProfiles = ref(null);

var data_FacultyProfile = ref({
  id: null,
  district: "",
  dual_lang: false,
  faculty_email: "",
  first_name: "",
  last_name: "",
  school_name: "",
  phone_number: "",
  department: "",
  grade: "",
  user_id: null,
});

const url = new URL(window.location.href);
const queryParams = new URLSearchParams(url.search);
const FacultyProfileId = queryParams.get("id");

async function getFaculty() {
  const response = await fetch(`/api/faculty/${FacultyProfileId}`);
  return await response.json();
}

data_FacultyProfile.value = await getFaculty();

// --------------------------------------------------
// 🔥 Save Edit (backend permissions already protect)
// --------------------------------------------------
async function editFaculty(editedFaculty) {
  if (!editedFaculty) return;

  const data_FacultyProfile = await $fetch("/api/faculty/faculty", {
    method: "PUT",
    body: {
      id: parseInt(editedFaculty.id),
      district: editedFaculty.district,
      dual_lang: editedFaculty.dual_lang,
      faculty_email: editedFaculty.faculty_email,
      first_name: editedFaculty.first_name,
      last_name: editedFaculty.last_name,
      school_name: editedFaculty.school_name,
      phone_number: editedFaculty.phone_number,
      department: editedFaculty.department,
      grade: editedFaculty.grade,
      user_id: editedFaculty.user_id,
    },
  });

  navigateTo("/viewfaculty");
  data_FacultyProfiles.value = await getFaculty();
}
</script>
