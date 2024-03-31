<template lang = "pug">
MLKContainer 
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
                Label Email:
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='data_ParentProfile.Email' placeholder="(user defined)" required)
            .py-4.grid(class="sm:grid-cols-3")
                Label Zipcode: (Please give five digit number for the zipcode area you reside in)




    
    
    
    
    
</template>