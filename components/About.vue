<template lang="pug">
    div.about-container(class="max-w-[900px] bg-[#fdd487] rounded-lg p-4 mx-auto shadow-lg font-sans")
        h2.text-center.text-4xl.font-bold.mt-4 About Us
        hr.rounded.center-text(class="border-t-8 border-[#122C4F] w-full mx-auto mt-2")

        div.about-content.flex.items-center.mt-8
            img(src="https://media.istockphoto.com/id/1397843796/photo/shot-of-a-group-of-kids-reading-a-book-outside.jpg?s=612x612&w=0&k=20&c=VSI7oX0jIfmEZm4C-RJgz_t2frI9otsZIqHHapOoCS0=" alt="Non-profit image" class="w-3/5 max-w-[600px] rounded-lg shadow-lg")

            div.text-container.ml-12.text-lg.flex-1
                p.mb-4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum scelerisque malesuada. In luctus nunc massa, sed auctor ante condimentum et. Nunc in vestibulum ante, ut aliquet eros. Suspendisse congue ultrices pharetra. Vivamus non ex accumsan, elementum diam et, laoreet nulla. Sed auctor felis a justo finibus, nec congue lectus ultrices.
                p Nunc egestas ipsum sit amet erat blandit, et fringilla nulla egestas. Sed et ornare lacus.

        div.tabs-container.flex.justify-around.mt-8.border-t.border-gray-300.pt-4
            button(type="button" @click="activeTab = 'contact'" :class="['tab-btn', { 'active': activeTab === 'contact' } ]" class="text-lg cursor-pointer bg-white text-black py-2 px-6 rounded-lg transition duration-300 font-bold hover:bg-[#2e629a] hover:text-white active:bg-[#2e629a] active:text-white") Contact
            button(type="button" @click="activeTab = 'location'" :class="['tab-btn', { 'active': activeTab === 'location' } ]" class="text-lg cursor-pointer bg-white text-black py-2 px-6 rounded-lg transition duration-300 font-bold hover:bg-[#2e629a] hover:text-white active:bg-[#2e629a] active:text-white") Location
            button(type="button" @click="activeTab = 'feedback'" :class="['tab-btn', { 'active': activeTab === 'feedback' } ]" class="text-lg cursor-pointer bg-white text-black py-2 px-6 rounded-lg transition duration-300 font-bold hover:bg-[#2e629a] hover:text-white active:bg-[#2e629a] active:text-white") Feedback

        //- Tab Content Section
        div.tab-content.mt-6.p-4.bg-gray-100.rounded-lg
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

<script lang="ts" setup>
import { ref } from "vue";

const activeTab = ref("contact");
</script>