
<script lang="ts" setup>


const data_ParentProfile =ref( {
    firstName: "",
    lastName: "",
    birth_date: "",
    zipcode: "",
    phone_number: "",
    email: "", 
    social_media: "",
    avg_num_book: "",
    yearly_income: "",
    gender: "",
    martial_status: ""
});

const submitParent = async () => {
    const response = $fetch('/api/person', {
        method: "POST",
        body: data_ParentProfile.value
    })
}
</script>


<template lang = "pug">
Container 
        div 
            TitleDisplay Parent Registration Form
            br
            .py-4.grid(class="sm:grid-cols-3")
                Label First Name:
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='data_ParentProfile.first_name' placeholder="(user defined)" required)
            .py-4.grid(class="sm:grid-cols-3")
                Label Last Name:
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='data_ParentProfile.last_name' placeholder="(user defined)" required)
            .py-4.grid(class="sm:grid-cols-3")
                Label Birth Date: (Please give the year you were born)
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='data_ParentProfile.birth_date' placeholder="(user defined)" required)
            .py-4.grid(class="sm:grid-cols-3")
                Label Zipcode: (Please give five digit number for the zipcode area you reside in)
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='data_ParentProfile.zipcode' placeholder="(user defined)" required)
            .py-4.grid(class="sm:grid-cols-3") 
                Label Phone number: (Ex: 1234567899)
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='data_ParentProfile.phone_number' placeholder="(user defined)" required)
            .py-4.grid(class="sm:grid-cols-3")
                Label Email:
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='data_ParentProfile.Email' placeholder="(user defined)" required)
            .py-4.grid(class="sm:grid-cols-3")
                Label Social Media Handle: (***Not required***) (Please give either your Twitter(X) or Instagram social media handle)
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='data_ParentProfile.social_media' placeholder="(user defined)")
            .py-4.grid(class="sm:grid-cols-3")
                Label On average, how many books do you read per year to your child? (A guess is fine)
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='data_ParentProfile.avg_num_book' placeholder="(user defined)" required)
    
</template>