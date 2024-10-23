<script lang = "ts" setup>

const props = defineProps<{modelValue:any}>()
const emit = defineEmits(["update:modelValue"])
const rhuser = useCookie<any>('rhuser')
const data_FacultyProfile = ref({     
  district: "",     
  dual_lang: false,      /// True if they are spanish or other language teacher with non-english kids, otherwise false to indicate they are english speaking teachers      
  faculty_email: "",  
  first_name: "",   
  last_name: "",    
  school_name: "",   
  phone_number: "",  
  department: "",    
  grade: "", 
  user_id: rhuser.value.id,
});

// Computed property for dual language (unchanged)
const dual_lang = computed({
  get() {
    return data_FacultyProfile.value.dual_lang ? true : false;
  },
  set(s) {
    data_FacultyProfile.value.dual_lang = Boolean(s);
    console.log(s);
  },
});

// Submit function for faculty form (unchanged)
const submitFaculty = async () => {
  const faculty = await $fetch("/api/faculty/faculty", {
    method: "POST",
    body: {
      faculty: data_FacultyProfile.value,
    },
  });
};
</script>

<!-- New Pug template starts here -->
<template lang="pug">
  div.min-h-screen.p-6.bg-gray-100.flex.items-center.justify-center
    div.container.max-w-screen-lg.mx-auto
      div
        div.bg-white.rounded.shadow-lg.p-4.px-4.md\:p-8.mb-6
          div.grid.gap-4.gap-y-2.text-sm.grid-cols-1.lg\:grid-cols-3
            div.text-gray-600
              p.font-medium.text-lg Faculty Registration Form
              p Please Enter Faculty Information

            div.lg\:col-span-2
              div.grid.gap-4.gap-y-2.text-sm.grid-cols-1.md\:grid-cols-5
                // First Name
                div.md\:col-span-5
                  label(for="first_name") First Name
                  Input(
                    v-model="data_FacultyProfile.first_name"
                    name="first_name"
                    id="first_name"
                    class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="(user defined)"
                    required
                  )

                // Last Name
                div.md\:col-span-5
                  label(for="last_name") Last Name
                  Input(
                    v-model="data_FacultyProfile.last_name"
                    name="last_name"
                    id="last_name"
                    class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="(user defined)"
                    required
                  )

                // School District
                div.md\:col-span-5
                  label(for="district") School District
                  Input(
                    v-model="data_FacultyProfile.district"
                    name="district"
                    id="district"
                    class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="(Ex: DISD)"
                    required
                  )

                // Faculty Email
                div.md\:col-span-5
                  label(for="faculty_email") Faculty Email
                  Input(
                    v-model="data_FacultyProfile.faculty_email"
                    name="faculty_email"
                    id="faculty_email"
                    class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="(user defined)"
                    required
                  )

                // School Name
                div.md\:col-span-5
                  label(for="school_name") School Name
                  Input(
                    v-model="data_FacultyProfile.school_name"
                    name="school_name"
                    id="school_name"
                    class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="(user defined)"
                    required
                  )

                // Department
                div.md\:col-span-5
                  label(for="department") Department
                  Input(
                    v-model="data_FacultyProfile.department"
                    name="department"
                    id="department"
                    class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="(Ex: English, Science, or Math)"
                    required
                  )

                // Phone Number
                div.md\:col-span-5
                  label(for="phone_number") Phone Number
                  Input(
                    v-model="data_FacultyProfile.phone_number"
                    name="phone_number"
                    id="phone_number"
                    class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="(Ex: 1234567891)"
                    required
                  )

                // Grade
                div.md\:col-span-5
                  label(for="grade") Grade
                  Input(
                    v-model="data_FacultyProfile.grade"
                    name="grade"
                    id="grade"
                    class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="(Ex: First, Second, or Pre-K)"
                    required
                  )

                // Dual Language Checkbox
                div.md\:col-span-5
                  div.inline-flex.items-center
                    input(
                      type="checkbox"
                      v-model="dual_lang"
                      name="billing_same"
                      id="billing_same"
                      class="form-checkbox"
                      placeholder="(Do you Teach a Bilingual Class)"
                      required
                    )
                    label(for="billing_same" class="ml-2") Do you teach a dual language class?

                // Submit Button
                div.md\:col-span-5.text-right
                  div.inline-flex.items-end
                    button.bg-blue-500.hover\:bg-blue-700.text-white.font-bold.py-2.px-4.rounded(
                      @click="submitFaculty()"
                    ) Submit
</template>

