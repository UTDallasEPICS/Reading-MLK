<template lang="pug">
    div.about-container(style="width: 100%; margin: 0 auto")
        // h2.text-4xl.lg:text-7xl.font-extrabold.text-gray-800 About Us
        h2.text-center.text-4xl.font-bold.mt-4(style="margin-top:10px; font-size: 3rem; text-align: center") About Us
        hr.rounded.center-text(style="border-top: 7px solid #122C4F; width: 100%; margin: 0 auto; margin-top: 7px")

        div.about-content.flex.items-center.mt-8
            img(src="https://media.istockphoto.com/id/1397843796/photo/shot-of-a-group-of-kids-reading-a-book-outside.jpg?s=612x612&w=0&k=20&c=VSI7oX0jIfmEZm4C-RJgz_t2frI9otsZIqHHapOoCS0=" alt="Non-profit image" class="image-left rounded-lg shadow-lg")

            div.text-container.ml-12.text-lg
                p.mb-4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum scelerisque malesuada. In luctus nunc massa, sed auctor ante condimentum et. Nunc in vestibulum ante, ut aliquet eros. Suspendisse congue ultrices pharetra. Vivamus non ex accumsan, elementum diam et, laoreet nulla. Sed auctor felis a justo finibus, nec congue lectus ultrices.
                p Nunc egestas ipsum sit amet erat blandit, et fringilla nulla egestas. Sed et ornare lacus.

        div.tabs-container.flex.justify-around.mt-8.border-t.border-gray-300.pt-4
            button(type="button" @click="activeTab = 'contact'" :class="['tab-btn', { 'active': activeTab === 'contact' } ]") Contact
            button(type="button" @click="activeTab = 'location'" :class="['tab-btn', { 'active': activeTab === 'location' } ]") Location
            button(type="button" @click="activeTab = 'feedback'" :class="['tab-btn', { 'active': activeTab === 'feedback' } ]") Feedback

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
                p.text-lg Leave Feeback Here!
</template>

<script>
export default {
    data() {
        return {
            activeTab: 'contact'
        }
    }
}
</script>

<style scoped>
    .about-container {
        max-width: 900px;
        background-color: #fdd487;
        border-radius: 10px; 
        padding: 1rem;
        margin: 0 auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        font-family: system-ui; 
    }
    .about-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: system-ui;
    }
    .image-left {
        width: 60%; 
        max-width: 600px; 
    }
    .text-container {
        font-size: large;
        flex: 1;
        margin-left: 3rem;
        font-family: system-ui;
    }
    .tab-btn {
        font-size: 1rem;
        cursor: pointer;
        background-color: white; /* Fixed */
        color: black;
        padding: 0.5rem 1.5rem;
        border-radius: 8px;
        transition: background-color 0.3s;
        font-family: system-ui;
        font-weight: bold;
    }
    .tab-btn:hover {
        background-color: #2e629a;
        color: white;
    }
    .tab-btn.active {
        background-color: #2e629a;
        color: white;
    }
    .tab-content {
        font-size: 1rem;
        font-weight: 500;
        text-align: left;
        font-family: system-ui;
    }
</style>
