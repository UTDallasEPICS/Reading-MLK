<template lang="pug">
  .centered-container.flex.justify-center.items-center.my-10
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")

        // Header section
        .form-header.text-center.bg-customBlue.p-6.rounded-t-lg.text-gray-100
          h2.text-4xl.font-medium.uppercase.tracking-wider New User Sign Up
          .heading-line.w-32.h-1.bg-green-400.my-2.mx-auto.rounded-sm

          
        
        .info-box.bg-gray-100.border.border-gray-300.rounded-lg.p-4.mb-6
          h1.text-2xl.font-semibold.text-gray-800.text-center Please type in your email, and hit the "Send" button. Check your email for a code from readinghuddle@gmail.com, and type in the code below to register your account.
        // Form fields
        .form-input.grid.gap-6.p-8.bg-white.rounded-b-lg

          // Email Field
          .form-element.flex.flex-col
            label(for="email" class="text-lg font-semibold text-gray-800 mb-2 text-center" required) My Email
            input#email(type="email" placeholder="Type your email address here." required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500" v-model="data_UserProfile.email")
          
        // Send Code Button
        .button-container(class="flex justify-center mt-5")
          button(
            type="button"
            class="submit-button px-5 py-2.5 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-[#1a1a2e]"
            @click="handleClick") Send


        transition(name="slide-down")
        .additional-content(v-if="showCode" class="mt-8 pt-8 border-t border-gray-200")
          .form-element.flex.flex-col.mb-4
            label(class="text-lg font-semibold text-gray-800 mb-2 text-center") Verification Code
            .div(class="flex justify-center gap-2")
              input(
              v-for="index in 6"
              :key="index"
              v-model="otpDigits[index - 1]"
              type="text"
              maxlength="1"
              class="w-12 h-12 text-center text-lg border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500"
              )
          .button-container(class="flex justify-center mt-5")
            button(
              type="button"
              class="submit-button px-5 py-2.5 bg-green-600 text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-green-700"
              @click="handleSubmit") Register
          


            
</template>
<script setup lang="ts">
import { ref, computed } from "vue";

const otpDigits = ref(["", "", "", "", "", ""]);

const otpCode = computed(() => otpDigits.value.join(""));

const rhuser = useCookie<any>("rhuser");

// Define the form data
const data_UserProfile = ref({
  user_name: "",
  first_name: "",
  last_name: "",
  preferred_name: "",
  email: "",
  role: "Parent",
});

// Define the reactive variable for conditional rendering
const showCode = ref(false);

//mailer request POST
const handleSendEmail = async () => {
  try {
    console.log("handleSendEmail called");
    console.log("Sending email to:", data_UserProfile.value.email);

    const result = await $fetch("/api/mailer", {
      method: "POST",
      body: { to: data_UserProfile.value.email },
    });

    alert(result.message || "Email sent!");
  } catch (err) {
    console.error("Error sending email:", err);
    alert("Email could not be sent.");
  }
};

const handleClick = () => {
  console.log("HANDLECLICK CALLED");
  showCode.value = true;
  handleSendEmail();
};

// Handle the form submission
// const handleSubmit = async () => {
//   console.log("handle submit called");

//   if (otpCode.value.length < 6) {
//     alert("Please enter the full 6-digit OTP.");
//     return;
//   }

//   const result = await $fetch("/api/verifyotp", {
//     method: "POST",
//     body: {
//       email: data_UserProfile.value.email,
//       code: otpCode.value,
//     },
//   });

//   console.log("OTP verified:", result);

// Log current form data for debugging purposes
// console.log("Submitting User Profile:", data_UserProfile.value);

// // Ensure all required fields are filled out
// if (!data_UserProfile.value.role) {
//   console.log("myrole: " + data_UserProfile.value.role);
//   alert("Please fill out all required fields before submitting the form.");
//   return;
// }

// // console.log("myroleout: "+ data_UserProfile.value.role);

// try {
//   await $fetch("/api/user/user", {
//     method: "POST",
//     body: {
//       user: data_UserProfile.value,
//     },
//   });
//   alert("User successfully registered in the system.");
//   // Show additional content after successful registration
//   //showAdditionalContent.value = true;
// } catch (error) {
//   console.error("Error submitting user profile:", error);
// }
// };

const handleSubmit = async () => {
  if (otpCode.value.length < 6) {
    alert("Please enter the full 6-digit OTP.");
    return;
  }

  try {
    const result = await $fetch("/api/verifyotp", {
      method: "POST",
      body: {
        email: data_UserProfile.value.email,
        code: otpCode.value,
      },
    });

    console.log("OTP verified:", result);
    alert(result.message || "OTP verified successfully! 🎉");
  } catch (error: any) {
    console.error("OTP verification failed:", error);
    alert(error?.data?.statusMessage || "Incorrect OTP. Please try again.");
  }
};
</script>
