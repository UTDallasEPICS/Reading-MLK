<script lang = "ts" setup>

const props = defineProps<{modelValue:any}>()
const emit = defineEmits(["update:modelValue"])
const cvuser = useCookie<any>('cvuser')
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
  user_id: cvuser.value.id,
});
const dual_lang = computed({
  get() {
    return data_FacultyProfile.value.dual_lang ? true : false
  },
  set(s) {
    data_FacultyProfile.value.dual_lang =Boolean(s)
    console.log(s)
  }
})
const submitFaculty = async () =>{
    const faculty = $fetch('/api/faculty/faculty',{
        method: "POST",
        body: {
            faculty: data_FacultyProfile.value
        }
    })
}
</script>


<template lang = "pug">
<div class="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
  <div class="container max-w-screen-lg mx-auto">
    <div>

      <div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
          <div class="text-gray-600">
            <p class="font-medium text-lg">Faculty Registration Form</p>
            <p>Please Enter Faculty Information</p>
          </div>

          <div class="lg:col-span-2">
            <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
              <div class="md:col-span-5">
                <label for="full_name">First Name</label>
                Input(v-model='data_FacultyProfile.first_name' name="first_name" id="first_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
              </div>

              <div class="md:col-span-5">
                <label for="email">Last Name</label>
                Input(v-model='data_FacultyProfile.last_name' name="last_name" id="last_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
              </div>

              <div class="md:col-span-5">
                <label for="address">School District</label>
                Input(v-model='data_FacultyProfile.district' name="school_dist_teach" id="school_dist_teach" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(Ex: DISD)" required)
              </div>

              <div class="md:col-span-5">
                <label for="city">Faculty Email</label>
                Input(v-model='data_FacultyProfile.faculty_email' name="faculty_email" id="faculty_email" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
              </div>


              <div class="md:col-span-5">
                <label for="city">School Name</label>
                Input(v-model='data_FacultyProfile.school_name' name="school_name" id="school_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
              </div>

              <div class="md:col-span-5">
                <label for="city">Department</label>
                Input(v-model='data_FacultyProfile.department' name="department" id="department" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(Ex: English, Science, or Math)" required)
              </div>

              <div class="md:col-span-5">
                <label for="zipcode">Phone Number</label>
                Input(v-model='data_FacultyProfile.phone_number' name="phone_number" id="phone_number" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(Ex: 1234567891)" required)
              </div>

              <div class="md:col-span-5">
                <label for="zipcode">Grade</label>
                Input(v-model='data_FacultyProfile.grade' name="grade" id="grade" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(Ex: First, Second, or Pre-K)" required)
              </div>


              <div class="md:col-span-5">
                <div class="inline-flex items-center">
                  <input type="checkbox" v-model="dual_lang" name="billing_same" id="billing_same" class="form-checkbox" placeholder = "(Do you Teach a Bilingual Class)" required/>
                  <label for="billing_same" class="ml-2">Do you teach a dual language class?</label>
                </div>
              </div>
      
              <div class="md:col-span-5 text-right">
                <div class="inline-flex items-end">
                  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click= "submitFaculty()">Submit</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
