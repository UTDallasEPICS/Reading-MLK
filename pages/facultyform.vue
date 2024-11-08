<!-- <template lang="pug">
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
</template> -->

<!-- <template lang="pug">
  .centered-container(style="display: flex; justify-content: center; align-items: center; margin: 40px")
    .form
      .form-container(style="padding: 30px; padding-top: 15px; background-color: #ffffff; border-radius: 0.5rem; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%; font-family: Arial, sans-serif;")
        .form-header(style="text-align: center; margin-bottom: 20px; background-color: #2d3748; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);")
          h2(style="font-size: 2.5rem; font-weight: 700; color: #f7fafc; text-transform: uppercase; letter-spacing: 0.1rem; margin: 0;") Faculty Registration Form
        .form-input(style="display: grid; gap: 1.5rem; padding-top: 1.5rem;")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Enter Faculty First Name
              span(style="color: red;") *
            input(type="text" id="textbox" placeholder="Faculty First Name" required style="padding: 0.75rem; border: 1px solid #ccc; border-radius: 0.25rem; font-size: 1rem; transition: border-color 0.3s ease; outline: none;")
          .form-element(style="display: flex; flex-direction: column;")
            label(for="textbox" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Enter Faculty Last Name
              span(style="color: red;") *
            input(type="text" id="textbox" placeholder="Faculty Last Name" required style="padding: 0.75rem; border: 1px solid #ccc; border-radius: 0.25rem; font-size: 1rem; transition: border-color 0.3s ease; outline: none;")
          // Add additional form elements following the same style structure

        .button-group(style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;")
          button(@click="submitForm" class="submit-button" style="padding: 0.75rem 1.25rem; font-size: 1rem; font-weight: 600; color: #ffffff; border: none; cursor: pointer; border-radius: 0.375rem; background-color: #48bb78; transition: background-color 0.3s;"
            @mouseover="this.style.backgroundColor='#38a169'"
            @mouseleave="this.style.backgroundColor='#48bb78'"
          ) Submit
          button(@click="clearForm" class="clear-button" style="padding: 0.75rem 1.25rem; font-size: 1rem; font-weight: 600; color: #ffffff; border: none; cursor: pointer; border-radius: 0.375rem; background-color: #e53e3e; transition: background-color 0.3s;"
            @mouseover="this.style.backgroundColor='#c53030'"
            @mouseleave="this.style.backgroundColor='#e53e3e'"
          ) Clear
</template> -->

<!-- <template lang="pug">
  .form-view(style="font-family: Arial, sans-serif; background-color: #f0f4f8; padding: 20px;")
    .form-header(style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #2d3748; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); margin-bottom: 2rem;")
      h2(style="font-size: 2.5rem; font-weight: 700; color: #f7fafc; text-transform: uppercase; letter-spacing: 0.1rem; margin: 0; position: relative;") New Entry Form
      .heading-line(style="content: ''; display: block; width: 5%; height: 4px; background-color: #48bb78; margin: 0.5rem auto 0; border-radius: 2px;")
    .form-container(style="padding: 1.5rem; background-color: #ffffff; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);")
      h3(style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;") Enter Details
      form.form-fields(style="display: flex; flex-direction: column; gap: 1.5rem;")
        .field(style="display: flex; flex-direction: column; max-width: 400px; margin: auto;")
          label(for="name" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem; transition: color 0.3s ease, transform 0.2s ease;") Name
          input#name(type="text" placeholder="Enter full name" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; width: 100%; transition: border-color 0.3s ease, box-shadow 0.3s ease;")

        .field(style="display: flex; flex-direction: column; max-width: 400px; margin: auto;")
          label(for="email" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem; transition: color 0.3s ease, transform 0.2s ease;") Email
          input#email(type="email" placeholder="Enter email address" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; width: 100%; transition: border-color 0.3s ease, box-shadow 0.3s ease;")

        .field(style="display: flex; flex-direction: column; max-width: 400px; margin: auto;")
          label(for="phone" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem; transition: color 0.3s ease, transform 0.2s ease;") Phone
          input#phone(type="text" placeholder="Enter phone number" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; width: 100%; transition: border-color 0.3s ease, box-shadow 0.3s ease;")

        .field(style="display: flex; flex-direction: column; max-width: 400px; margin: auto;")
          label(for="comments" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem; transition: color 0.3s ease, transform 0.2s ease;") Comments
          textarea#comments(placeholder="Additional comments" rows="4" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; width: 100%; transition: border-color 0.3s ease, box-shadow 0.3s ease;")

        .button-group(style="display: flex; justify-content: center; margin-top: 1.5rem;")
          button(type="submit" class="submit-button" style="padding: 0.75rem 1.25rem; font-size: 1rem; font-weight: 600; color: #ffffff; border: none; cursor: pointer; border-radius: 0.375rem; background-color: #48bb78; transition: background-color 0.3s;"
            @mouseover="buttonHover = '#38a169'"
            @mouseleave="buttonHover = '#48bb78'"
          ) Submit
</template> -->

<!-- <template lang="pug">
  .form-container(style="font-family: Arial, sans-serif; background-color: #f0f4f8; padding: 20px; display: flex; justify-content: center; align-items: center;")
    .form-wrapper(style="width: 100%; max-width: 600px; background-color: #ffffff; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);")
      .form-header(style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #2d3748; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;")
        h2(style="font-size: 2rem; font-weight: 700; color: #f7fafc; text-transform: uppercase; letter-spacing: 0.05rem; margin: 0;") Form Title
        .heading-line(style="content: ''; display: block; width: 4rem; height: 3px; background-color: #48bb78; margin: 0.5rem 0 0; border-radius: 2px;")
      .form-body
        form(style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;")
          .field(style="display: flex; flex-direction: column; width: 100%; max-width: 100%; margin-bottom: 1rem;")
            label(style="font-size: 1rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Name
            input(type="text" placeholder="Enter name" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;")
          .field(style="display: flex; flex-direction: column; width: 100%; max-width: 100%; margin-bottom: 1rem;")
            label(style="font-size: 1rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Email
            input(type="email" placeholder="Enter email" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;")
          .field(style="display: flex; flex-direction: column; width: 100%; max-width: 100%; margin-bottom: 1rem;")
            label(style="font-size: 1rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Password
            input(type="password" placeholder="Enter password" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;")
          .button-group(style="display: flex; justify-content: space-between; margin-top: 1.5rem;")
            button(type="submit" style="padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: 600; color: #ffffff; border: none; cursor: pointer; border-radius: 0.375rem; background-color: #48bb78; transition: background-color 0.3s ease;" 
              @mouseover="buttonHover = '#38a169'" 
              @mouseleave="buttonHover = '#48bb78'"
            ) Submit
            button(type="reset" style="padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: 600; color: #ffffff; border: none; cursor: pointer; border-radius: 0.375rem; background-color: #e53e3e; transition: background-color 0.3s ease;"
              @mouseover="resetButtonHover = '#c53030'"
              @mouseleave="resetButtonHover = '#e53e3e'"
            ) Clear
</template> -->

<!-- <template lang="pug">
  .form-view(style="font-family: Arial, sans-serif; background-color: #f0f4f8; padding: 20px; max-width: 800px; margin: auto; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);")
    .header(style="text-align: center; background-color: #2d3748; padding: 1.5rem; border-radius: 0.5rem 0.5rem 0 0; color: #f7fafc;")
      h2(style="font-size: 2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1rem;") New Faculty Registration
      .heading-line(style="content: ''; display: block; width: 50px; height: 4px; background-color: #48bb78; margin: 0.5rem auto; border-radius: 2px;")

    form.form-container(style="padding: 2rem; background-color: #ffffff; border-radius: 0 0 0.5rem 0.5rem;")
      .form-group(style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 1rem;")
        // First Name Field
        .field
          label(for="first-name" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") First Name
          input#first-name(type="text" placeholder="Enter first name" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; width: 100%; transition: border-color 0.3s ease, box-shadow 0.3s ease;")

        // Last Name Field
        .field
          label(for="last-name" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Last Name
          input#last-name(type="text" placeholder="Enter last name" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; width: 100%; transition: border-color 0.3s ease, box-shadow 0.3s ease;")

        // Email Field
        .field
          label(for="email" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Email
          input#email(type="email" placeholder="Enter email address" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; width: 100%; transition: border-color 0.3s ease, box-shadow 0.3s ease;")

        // Phone Number Field
        .field
          label(for="phone-number" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Phone Number
          input#phone-number(type="tel" placeholder="Enter phone number" style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; width: 100%; transition: border-color 0.3s ease, box-shadow 0.3s ease;")

        // Department Field
        .field
          label(for="department" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Department
          select#department(style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; width: 100%; transition: border-color 0.3s ease, box-shadow 0.3s ease;")
            option(value="") Select department
            option(value="math") Math
            option(value="science") Science
            option(value="arts") Arts

        // Dual Language Checkbox
        .field(style="display: flex; align-items: center; gap: 0.75rem;")
          input#dual-lang(type="checkbox" style="width: auto;")
          label(for="dual-lang" style="font-size: 1.125rem; font-weight: 600; color: #2d3748;") Dual Language

      // Button Group
      .button-group(style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;")
        button(type="submit" style="padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: 600; color: #ffffff; background-color: #48bb78; border: none; border-radius: 0.375rem; cursor: pointer; transition: background-color 0.3s; &:hover {background-color: #38a169;}") Submit
        button(type="reset" style="padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: 600; color: #ffffff; background-color: #e53e3e; border: none; border-radius: 0.375rem; cursor: pointer; transition: background-color 0.3s; &:hover {background-color: #c53030;}") Reset
</template> -->

<template lang="pug">
  .centered-container(style="display: flex; justify-content: center; align-items: center; margin: 40px")
    .form
      .form-container(style="padding: 2rem; background-color: #ffffff; border-radius: 0.5rem; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); max-width: 700px; width: 100%;")
        .form-header(style="text-align: center; background-color: #2d3748; padding: 1.5rem; border-radius: 0.5rem 0.5rem 0 0; color: #f7fafc;")
          h2(style="font-size: 2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1rem;") Faculty Registration Form
          .heading-line(style="width: 10vw; height: 4px; background-color: #48bb78; margin: 0.5rem auto; border-radius: 2px;")
        .form-input(style="display: grid; gap: 1.5rem; padding: 2rem; background-color: #ffffff; border-radius: 0 0 0.5rem 0.5rem;")

          // Form fields
          .form-element(style="display: flex; flex-direction: column;")
            label(for="first-name" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") First Name
            input#first-name(type="text" placeholder="Enter first name" required style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;" @focus="this.style.borderColor='#007BFF'")
          
          .form-element(style="display: flex; flex-direction: column;")
            label(for="last-name" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Last Name
            input#last-name(type="text" placeholder="Enter last name" required style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;" @focus="this.style.borderColor='#007BFF'")
          
          .form-element(style="display: flex; flex-direction: column;")
            label(for="user-name" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") User Name
            input#user-name(type="text" placeholder="Enter user name" required style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;" @focus="this.style.borderColor='#007BFF'")

          .form-element(style="display: flex; flex-direction: column;")
            label(for="preferred-name" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Preferred Name
            input#preferred-name(type="text" placeholder="Enter Preferred name" required style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;" @focus="this.style.borderColor='#007BFF'")

          .form-element(style="display: flex; flex-direction: column;")
            label(for="email" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Email
            input#email(type="email" placeholder="Enter email address" required style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;" @focus="this.style.borderColor='#007BFF'")
          
          .form-element(style="display: flex; flex-direction: column;")
            label(for="phone-number" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Phone Number
            input#phone-number(type="tel" placeholder="Enter phone number" required style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;" @focus="this.style.borderColor='#007BFF'")

          .form-element(style="display: flex; flex-direction: column;")
            label(for="school-name" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") School Name
            input#school-name(type="text" placeholder="Enter School name" required style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;" @focus="this.style.borderColor='#007BFF'")

          .form-element(style="display: flex; flex-direction: column;")
            label(for="school-district" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") School District
            input#school-district(type="text" placeholder="Enter School District" required style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;" @focus="this.style.borderColor='#007BFF'")
          
          .form-element(style="display: flex; flex-direction: column;")
            label(for="department-name" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Department Name
            input#department-name(type="text" placeholder="Enter Department Name" required style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; transition: border-color 0.3s ease, box-shadow 0.3s ease;" @focus="this.style.borderColor='#007BFF'")

          //- .form-element(style="display: flex; flex-direction: column;")
          //-   label(for="department" style="font-size: 1.125rem; font-weight: 600; color: #2d3748; margin-bottom: 0.5rem;") Department
          //-   select#department(style="padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; width: 100%; transition: border-color 0.3s ease, box-shadow 0.3s ease;")
          //-     option(value="") Select Department
          //-     option(value="math") Mathematics
          //-     option(value="science") Science
          //-     option(value="english") English

          .checkbox(style="display: flex; align-items: center; margin-top: 1rem;")
            input(type="checkbox" id="dual_lang" name="dual_lang" value="true" style="width: 20px; height: 20px; margin-right: 10px; cursor: pointer;" @focus="this.style.boxShadow='0 0 5px 2px rgba(0, 123, 255, 0.5);'")
            label(for="dual_lang" style="font-size: 1.125rem; font-weight: 600; color: #2d3748;") Dual Language Teacher?

        .button-container(style="display: flex; justify-content: center; margin-top: 20px;")
          button(type="submit" class="submit-button" style="padding: 10px 20px; background-color: #122c4f; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; transition: all 0.3s ease;" @hover="this.style.backgroundColor='#1a1a2e'") Submit
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