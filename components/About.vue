<template lang="pug">
    div( class="max-w-[900px] bg-[#fdd487] rounded-lg p-4 mx-auto shadow-lg font-[system-ui] w-full mx-auto")
        // h2.text-4xl.lg:text-7xl.font-extrabold.text-gray-800 About Us
        h2.text-center.text-4xl.font-bold.mt-4(class = "mt-[10px] text-[3rem] items-center") About Us
        hr.rounded.center-text( class="rounded mx-auto mt-[7px] border-t-[7px] border-[#122C4F] w-full")
        div.mt-8(class = "flex flex-row items-center font-[system-ui]")
            img(src="https://media.istockphoto.com/id/1397843796/photo/shot-of-a-group-of-kids-reading-a-book-outside.jpg?s=612x612&w=0&k=20&c=VSI7oX0jIfmEZm4C-RJgz_t2frI9otsZIqHHapOoCS0=" alt="Non-profit image" class="w-[60%] max-w-[600px] rounded-lg shadow-lg")

            div(class= "text-lg flex-1 ml-12 font-[system-ui]")
                p.mb-4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum scelerisque malesuada. In luctus nunc massa, sed auctor ante condimentum et. Nunc in vestibulum ante, ut aliquet eros. Suspendisse congue ultrices pharetra. Vivamus non ex accumsan, elementum diam et, laoreet nulla. Sed auctor felis a justo finibus, nec congue lectus ultrices.
                p Nunc egestas ipsum sit amet erat blandit, et fringilla nulla egestas. Sed et ornare lacus.

        div(class=" flex justify-around mt-8 border-t border-gray-300 pt-4 text-left text-base font-medium font-[system-ui]")
            button(type="button" @click="activeTab = 'contact'" :class="buttonClasses('contact')") Contact
            button(type="button" @click="activeTab = 'location'" :class="buttonClasses('location')") Location
            button(type="button" @click="activeTab = 'feedback'" :class="buttonClasses('feedback')") Feedback
        //- Tab Content Section
        div.mt-6.p-4.bg-gray-100.rounded-lg(class="text-left text-base font-medium font-[system-ui] ")
            //- Contact Tab Content
            div(v-if="activeTab === 'contact'")
                p.text-lg Email: info@ReadingHuddle.com
                p.text-lg Phone: (214) 219-0096

            //- Location Tab Content
            div(v-if="activeTab === 'location'")
                p.text-lg Address: MLK Community Center Box 225431, Dallas, TX
                p.text-lg Description

            //- Feedback Tab Content
            div(v-if="activeTab === 'feedback'")
                p.text-lg Leave Feedback Here!
</template>

<script lang="ts">
const activeTab = ref('contact'); 

const buttonClasses = (tab_name: string) => {
  return ['py-2 px-6 rounded-lg font-bold transition-colors duration-300', activeTab.value=== tab_name ? 'bg-[#2e629a] text-white' : 'bg-white text-black hover:bg-[#2e629a] hover:text-white',]
};
</script>