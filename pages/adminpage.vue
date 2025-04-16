<script setup lang="ts">
const parentfirstname = ref('');
const parentlastname = ref('');
const parent = ref('');
const searched = ref(false);

interface parentInfoInterface {
    id: number, 
    zipcode: number, 
    yearly_income: number, 
    birth_date: Date, 
    average_number_books: number, 
    password: number, 
    phone_number: string, 
    gender: string, 
    marital_stat: string, 
    first_name: string, 
    last_name: string, 
    email: string, 
    social_media : string

}

const parentInfo = reactive({
    id: '', 
    zipcode: '', 
    yearly_income: '', 
    birth_date: '', 
    average_number_books: '', 
    password: '', 
    phone_number: '', 
    gender: '', 
    marital_stat: '', 
    first_name: '', 
    last_name: '', 
    email: '', 
    social_media : ''

})

const handleQuery = async (event: { preventDefault: () => void; }) => {



  //const { id, zipcode, yearly_income, birth_date, average_number_books, password, phone_number, gender, marital_stat, first_name, last_name, email, social_media }= parentInfo
  parentInfo.first_name = parentfirstname.value
  parentInfo.last_name = parentlastname.value
  //console.log(parentInfo)
  const paramStr = "first_name=${parentfirstname.value}&last_name=${parentlastname.value}";
  //const res = fetch('http://localhost:8080/server/api/search-parent?' + new URLSearchParams(paramStr).toString()
  const res = await fetch('http://localhost:8080/server/api/search-parent?' + new URLSearchParams(paramStr).toString())
    .then((res) => res.text())
  /*
  , {
    method: "POST",
    /*
    headers: {"Content-Type"  : "application/x-www-form-urlencoded" ,
    'Access-Control-Allow-Origin' : '*'
    },
    //mode: "no-cors",
    */
   
    /*
    body: {
        id: parentInfo.value.id,
        zipcode: parentInfo.value.zipcode,
        yearly_income: parentInfo.value.yearly_income,
        birth_date: parentInfo.value.birth_date,
        average_number_books: parentInfo.value.average_number_books,
        password: parentInfo.value.password,
        phone_number: parentInfo.value.phone_number,
        gender: parentInfo.value.gender,
        marital_stat: parentInfo.value.marital_stat,
        first_name: parentInfo.value.first_name,
        last_name: parentInfo.value.last_name,
        email: parentInfo.value.email,
        social_media: parentInfo.value.social_media
    }
    */

  //})
  
  /*
  if (!res.data) {
    throw createError({ statusCode: 400, statusMessage: 'Oops, something went wrong' })
  }
  console.log(parentInfo)
  */
  //const responseData = await res; // Parse the response body as JSON
    console.log(res);
};
/*
const handleQuery = async () => {

    
  
    try {
        const response = await fetch('http://localhost:5432/server/api/search-parent', {
            method: 'POST', // or 'POST' if needed
            // Add any necessary headers or body here
        });

        if (!response.ok) {
            console.log("error")
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Destructure the data object
        const { id, zipcode, yearly_income, birth_date, average_number_books, password, phone_number, gender, marital_stat, first_name, last_name, email, social_media } = data;

        // Log the destructured variables
        console.log('ID:', id);
        console.log('Zipcode:', zipcode);
        console.log('Yearly Income:', yearly_income);
        console.log('Birth Date:', birth_date);
        console.log('Average Number of Books:', average_number_books);
        console.log('Password:', password);
        console.log('Phone Number:', phone_number);
        console.log('Gender:', gender);
        console.log('Marital Status:', marital_stat);
        console.log('First Name:', first_name);
        console.log('Last Name:', last_name);
        console.log('Email:', email);
        console.log('Social Media:', social_media);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors gracefully
    }
};
*/
</script>

<template lang = "pug">

<meta name="referrer" content="no-referrer">

Container  
    div
        TitleDisplay Admin Page
    div.table-container
        table(class = "border-collapse w-full")
            td(class ="border border-black p-8px text-center")
                TitleDisplay Number of users:
            td(class ="border border-black p-8px text-center")
                TitleDisplay Number of parents:
            td(class ="border border-black p-8px text-center")
                TitleDisplay Number of children:
            td(class ="border border-black p-8px text-center")
                TitleDisplay Number of Teachers:
    div(class = "flex flex-row mt-0 flex-nowrap justify-start content-start gap-2.5")
        div(class = "items-start ml-0 mt-2 mb-24")
            Label(class = "items-start ml-0 mt-2 mb-24") Search by parent name:
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='parentfirstname' placeholder="(first)" required)
                    .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='parentlastname' placeholder="(last)" required)
            SubmitQueryButton(class = "items-start ml-0 mt-2 mb-24" :parentfirstname="parentfirstname" :parentlastname="parentlastname" @submit="handleQuery") 
            DisplayAllButton(class = "items-start ml-0 mt-2 mb-24" :parentfirstname="parentfirstname" :parentlastname="parentlastname" @submit="handleQuery")
        div(class = "items-start ml-0 mt-2 mb-24")
            Label Search by child name:
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='childfirstname' placeholder="(first)" required)
                    .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='childlastname' placeholder="(last)" required)
            SubmitQueryButton(class = "items-start ml-0 mt-2 mb-24" :childfirstname="childfirstname" :childlastname="childlastname" @submit="handleChildQuery")
            DisplayAllButton(class = "items-start ml-0 mt-2 mb-24" :parentfirstname="parentfirstname" :parentlastname="parentlastname" @submit="handleQuery")
        div(class = "items-start ml-0 mt-2 mb-24")
            Label Search by Teacher name:
                .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='childfirstname' placeholder="(first)" required)
                    .col-md-9.mx-10(class="sm:col-span-2 sm:mr-11")
                    Input(v-model='childlastname' placeholder="(last)" required)
            SubmitQueryButton(class = "items-start ml-0 mt-2 mb-24" :childfirstname="childfirstname" :childlastname="childlastname" @submit="handleChildQuery")
            DisplayAllButton(class = "items-start ml-0 mt-2 mb-24" :parentfirstname="parentfirstname" :parentlastname="parentlastname" @submit="handleQuery")
    div(class = "flex flex-row mt-0 flex-nowrap justify-start content-start gap-2.5")
        DownloadExcelButton(class = "items-start ml-0 mt-2 mb-24" :parentfirstname="parentfirstname" :parentlastname="parentlastname" @submit="handleQuery")
        
       
            

           

</template>
