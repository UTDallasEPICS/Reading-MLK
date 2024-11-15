<template lang="pug">
  .centered-container.flex.justify-center.items-center.my-10
    .form
      .form-container(class="p-8 bg-white rounded-lg shadow-lg max-w-4xl w-full min-w-[900px]")
        
        // Header section
        .form-header.text-center.bg-customBlue.p-6.rounded-t-lg.text-gray-100
          h2.text-4xl.font-medium.uppercase.tracking-wider Sign Up
          .heading-line.w-32.h-1.bg-green-400.my-2.mx-auto.rounded-sm
        
        // Form fields
        .form-input.grid.gap-6.p-8.bg-white.rounded-b-lg
          
          // First Name Field
          .form-element.flex.flex-col
            label(for="first-name" class="text-lg font-semibold text-gray-800 mb-2") First Name
            input#first-name(type="text" placeholder="First Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
          
          // Last Name Field
          .form-element.flex.flex-col
            label(for="last-name" class="text-lg font-semibold text-gray-800 mb-2") Last Name
            input#last-name(type="text" placeholder="Last Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
          
          // Username Field
          .form-element.flex.flex-col
            label(for="username" class="text-lg font-semibold text-gray-800 mb-2") User Name
            input#username(type="text" placeholder="User Name" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
          
          // Password Field
          .form-element.flex.flex-col
            label(for="password" class="text-lg font-semibold text-gray-800 mb-2") Password
            input#password(type="password" placeholder="Password" required class="p-3 text-base border border-gray-300 rounded-sm transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-customBlue-500")
          
          .div(class="flex flex-col space-y-6") 
            label(class="block text-xl font-semibold") Sign me up as a ...
            .div(class="flex flex-row space-x-12") 
              .radio-button-group(class="flex items-center space-x-8")
                .radio-button(class="flex items-center space-x-4")
                  input(type="radio" id="dual_lang_faculty" name="dual_lang_group" value="faculty" class="h-6 w-6 text-indigo-600 focus:ring-indigo-500")
                  label(for="dual_lang_faculty" class="text-lg font-medium text-gray-700 hover:text-indigo-600") Faculty
                .radio-button(class="flex items-center space-x-4")
                  input(type="radio" id="dual_lang_parent" name="dual_lang_group" value="parent" class="h-6 w-6 text-indigo-600 focus:ring-indigo-500")
                  label(for="dual_lang_parent" class="text-lg font-medium text-gray-700 hover:text-indigo-600") Parent


          //.div(class="flex flex-col space-y-6") 
            label(class="block text-lg font-semibold") I am a ...
            .div(class="flex flex-row space-x-10") 
              .radio-button-group(class="flex items-center space-x-6")
                .radio-button(class="flex items-center space-x-2")
                  input(type="radio" id="dual_lang_faculty" name="dual_lang_group" value="faculty" class="h-5 w-5 text-indigo-600 focus:ring-indigo-500")
                  label(for="dual_lang_faculty" class="text-sm font-medium text-gray-700 hover:text-indigo-600") Faculty
                .radio-button(class="flex items-center space-x-2")
                  input(type="radio" id="dual_lang_parent" name="dual_lang_group" value="parent" class="h-5 w-5 text-indigo-600 focus:ring-indigo-500")
                  label(for="dual_lang_parent" class="text-sm font-medium text-gray-700 hover:text-indigo-600") Parent


          

        // Submit Button
        .button-container(class="flex justify-center mt-5")
          button(type="submit" class="submit-button px-5 py-2.5 bg-[#122c4f] text-white border-0 rounded-lg cursor-pointer text-base transition-all duration-300 ease-in-out hover:bg-[#1a1a2e]") Submit
</template>
