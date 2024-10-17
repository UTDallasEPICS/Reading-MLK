<template lang="pug">
  .centered-container
    .form-container
      .form-header
        h2 Faculty Registration Form
      .form-input
        .form-element
          label(for="textbox").required Enter the Faculty's First Name
          input(type="text" id="textbox" placeholder="Faculty First Name" required)
        .form-element
          label(for="textbox").required Enter the Faculty's Last Name
          input(type="text" id="textbox" placeholder="Faculty Last Name" required)
        .form-element
          label(for="textbox").required Enter the Faculty's User Name
          input(type="text" id="textbox" placeholder="Faculty User Name" required)
        .form-element
          label(for="textbox").required Enter the Faculty's Preferred Name
          input(type="text" id="textbox" placeholder="Faculty Preferred Name" required)
        .form-element
          label(for="textbox").required Enter the Faculty's Email
          input(type="text" id="textbox" placeholder="Faculty Email" required)
        .form-element
          label(for="textbox").required Enter the Faculty's Private Email
          input(type="text" id="textbox" placeholder="Faculty Private Email" required)
        .form-element
          label(for="textbox").required Enter the Faculty's School Name
          input(type="text" id="textbox" placeholder="Faculty School Name" required)
        .form-element
          label(for="textbox").required Enter the Faculty's School District
          input(type="text" id="textbox" placeholder="Faculty School District" required)
        .form-element
          label(for="textbox").required Enter the Faculty's Department Name
          input(type="text" id="textbox" placeholder="Faculty Department Name" required)
        .form-element
          label(for="textbox").required Enter the Faculty's Phone Number
          input(type="text" id="textbox" placeholder="Faculty Phone Number" required)
        .form-element
          label(for="textbox").required Enter the Faculty's Phone Number
          input(type="text" id="textbox" placeholder="Faculty Phone Number" required)
        .form-element
          label(for="textbox").required Enter Grade (use comma to separate multiple grades)
          input(type="text" id="textbox" placeholder="Faculty Phone Number" required)
        .form-element
          .checkbox
            input(type="checkbox" id="dual_lang" name="dual_lang" value="true")
            label(for="dual_lang") Dual Language Teacher? 
</template>


<style scoped>
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  max-width: 500px;
  width: 100%;
}

.form-header {
  text-align: center;
}

.form-input {
  display: grid;
  gap: 10px;
}

.form-element {
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.checkbox {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
}

label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

input[type="checkbox"]:hover {
  border-color: #007BFF;
}

input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 5px 2px rgba(0, 123, 255, 0.5);
}

/* Style for the required field asterisk */
.required::after {
  content: " *";
  color: red;
  font-weight: bold;
}
</style>

<script lang="ts" setup>

const props = defineProps<{ modelValue: any }>()
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
const dual_lang = computed({
  get() {
    return data_FacultyProfile.value.dual_lang ? true : false
  },
  set(s) {
    data_FacultyProfile.value.dual_lang = Boolean(s)
    console.log(s)
  }
})
const submitFaculty = async () => {
  const faculty = $fetch('/api/faculty/faculty', {
    method: "POST",
    body: {
      faculty: data_FacultyProfile.value
    }
  })
}
</script>