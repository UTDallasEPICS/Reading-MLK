<template lang="pug">
  .centered-container(style="display: flex; justify-content: center; align-items: center; margin: 40px")
    .form
      .form-container(style="padding: 30px; padding-top: 15px; background-color: #f9f9f9; border-radius: 15px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%;")
        .form-header(style="text-align: center; margin-bottom: 20px;")
          h2(style="font-size: 24px; color: #122c4f; font-weight: 600;") Faculty Registration Form
        .form-input(style="display: grid; gap: 15px;")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter Faculty First Name 
              span(style="color: red;")  *
            input(type="text" id="textbox" placeholder="Faculty First Name" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter the Faculty's Last Name
              span(style="color: red;")  *          
            input(type="text" id="textbox" placeholder="Faculty Last Name" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter the Faculty's User Name
              span(style="color: red;")  *          
            input(type="text" id="textbox" placeholder="Faculty User Name" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter the Faculty's Preferred Name
              span(style="color: red;")  *
            input(type="text" id="textbox" placeholder="Faculty Preferred Name" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter the Faculty's Email
              span(style="color: red;")  *
            input(type="text" id="textbox" placeholder="Faculty Email" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter the Faculty's Private Email
              span(style="color: red;")  *          
            input(type="text" id="textbox" placeholder="Faculty Private Email" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter the Faculty's School Name
              span(style="color: red;")  *          
            input(type="text" id="textbox" placeholder="Faculty School Name" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter the Faculty's School District
              span(style="color: red;")  *
            input(type="text" id="textbox" placeholder="Faculty School District" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter the Faculty's Department Name
              span(style="color: red;")  *
            input(type="text" id="textbox" placeholder="Faculty Department Name" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter the Faculty's Phone Number
              span(style="color: red;")  *
            input(type="text" id="textbox" placeholder="Faculty Phone Number" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter the Faculty's Phone Number
              span(style="color: red;")  *
            input(type="text" id="textbox" placeholder="Faculty Phone Number" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 5px;").required Enter Grade (use comma to separate multiple grades)
              span(style="color: red;")  *
            input(type="text" id="textbox" placeholder="Faculty Phone Number" required style="padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; outline: none; transition: all 0.3s ease;" @focus="this.style.borderColor='#007BFF'"
              @blur="this.style.borderColor='#ccc'")
          .form-element(style="display: flex; flex-direction: column;")
            .checkbox(style="display: flex; align-items: center;")
              input(type="checkbox" id="dual_lang" name="dual_lang" value="true" style="width: 20px; height: 20px; margin-right: 10px; cursor: pointer;" @hover="this.style.borderColor='#007BFF'" @focus="this.style.outline=none; this.style.boxShadow='0 0 5px 2px rgba(0, 123, 255, 0.5);'")
              label(for="dual_lang" style="font-size: 16px; font-weight: 600; color: #333;") Dual Language Teacher?
          .button-container(style="display: flex; justify-content: center; margin-top: 20px;")
            button(type="submit" class="submit-button" style="padding: 10px 20px; backgroundColor: #122c4f; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; cursor: pointer; transition: all 0.3s ease;"
              ) Submit
</template>

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