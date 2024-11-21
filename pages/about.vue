<!-- <template lang="pug">
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
</style> -->

<!-- <template lang="pug"> 
    div.about-container
        h2.text-center.text-4xl.font-bold.mt-4 About Us
        hr.rounded.center-text(style="border-top: 7px solid #122C4F; width: 80%; margin: 1rem auto;")

        div.about-content
            img(src="https://media.istockphoto.com/id/1397843796/photo/shot-of-a-group-of-kids-reading-a-book-outside.jpg?s=612x612&w=0&k=20&c=VSI7oX0jIfmEZm4C-RJgz_t2frI9otsZIqHHapOoCS0=" alt="Non-profit image" class="image-left")

            div.text-container
                p.mb-4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum scelerisque malesuada. In luctus nunc massa, sed auctor ante condimentum et. Nunc in vestibulum ante, ut aliquet eros. Suspendisse congue ultrices pharetra. Vivamus non ex accumsan, elementum diam et, laoreet nulla. Sed auctor felis a justo finibus, nec congue lectus ultrices.
                p Nunc egestas ipsum sit amet erat blandit, et fringilla nulla egestas. Sed et ornare lacus.

        div.tabs-container
            button(type="button" @click="activeTab = 'contact'" :class="['tab-btn', { 'active': activeTab === 'contact' } ]") Contact
            button(type="button" @click="activeTab = 'location'" :class="['tab-btn', { 'active': activeTab === 'location' } ]") Location
            button(type="button" @click="activeTab = 'feedback'" :class="['tab-btn', { 'active': activeTab === 'feedback' } ]") Feedback

        div.tab-content
            div(v-if="activeTab === 'contact'")
                p.text-lg Email: info@ReadingHuddle.com
                p.text-lg Phone: (214) 219-0096

            div(v-if="activeTab === 'location'")
                p.text-lg Address: MLK Community Center Box 225431, Dallas, TX
                p.text-lg Description

            div(v-if="activeTab === 'feedback'")
                p.text-lg Leave Feedback Here!
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
        border-radius: 12px; 
        padding: 2rem;
        margin: 0 auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-family: 'Helvetica Neue', sans-serif;
    }

    .about-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2rem;
    }

    .image-left {
        width: 50%; 
        max-width: 400px; 
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .text-container {
        font-size: 1.125rem;
        line-height: 1.8;
        flex: 1;
        margin-left: 2rem;
        color: #333;
    }

    .tab-btn {
        font-size: 1.125rem;
        cursor: pointer;
        background-color: white; 
        color: #333;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        transition: all 0.3s ease;
        font-weight: bold;
        margin: 0 1rem;
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
        padding: 1.5rem;
        background-color: #f5f5f5;
        border-radius: 8px;
        margin-top: 1.5rem;
    }
</style>
 -->

 <!-- 
 <template lang="pug">
    div.about-container
        h2.text-center.text-4xl.font-extrabold.mt-8 About Us
        hr.center-text(style="border-top: 3px solid #122C4F; width: 80%; margin: 20px auto;")

        div.about-content
            img(src="https://media.istockphoto.com/id/1397843796/photo/shot-of-a-group-of-kids-reading-a-book-outside.jpg?s=612x612&w=0&k=20&c=VSI7oX0jIfmEZm4C-RJgz_t2frI9otsZIqHHapOoCS0=" alt="Non-profit image" class="image-left")

            div.text-container
                p.mb-6 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum scelerisque malesuada. In luctus nunc massa, sed auctor ante condimentum et. Nunc in vestibulum ante, ut aliquet eros. Suspendisse congue ultrices pharetra. Vivamus non ex accumsan, elementum diam et, laoreet nulla. Sed auctor felis a justo finibus, nec congue lectus ultrices.
                p Nunc egestas ipsum sit amet erat blandit, et fringilla nulla egestas. Sed et ornare lacus.

        div.tabs-container.flex.justify-center.mt-8
            button(type="button" @click="activeTab = 'contact'" :class="['tab-btn', { 'active': activeTab === 'contact' } ]") Contact
            button(type="button" @click="activeTab = 'location'" :class="['tab-btn', { 'active': activeTab === 'location' } ]") Location
            button(type="button" @click="activeTab = 'feedback'" :class="['tab-btn', { 'active': activeTab === 'feedback' } ]") Feedback

        div.tab-content
            div(v-if="activeTab === 'contact'")
                p.text-lg Email: info@ReadingHuddle.com
                p.text-lg Phone: (214) 219-0096

            div(v-if="activeTab === 'location'")
                p.text-lg Address: MLK Community Center Box 225431, Dallas, TX
                p.text-lg Description

            div(v-if="activeTab === 'feedback'")
                p.text-lg Leave Feedback Here!
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
    /* General Container */
    .about-container {
        max-width: 900px;
        background-color: #fdd487;
        border-radius: 20px;
        padding: 2rem;
        margin: 30px auto;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        font-family: 'Roboto', sans-serif;
        overflow: hidden;
    }

    /* Title Styling */
    h2 {
        font-size: 3rem;
        color: #122C4F;
        margin-bottom: 10px;
    }

    /* Horizontal Line Styling */
    hr {
        border-top: 5px solid #122C4F;
        width: 70%;
        margin: 1rem auto;
    }

    /* About Content Layout */
    .about-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2rem;
        gap: 2rem;
    }

    .image-left {
        width: 50%;
        max-width: 480px;
        border-radius: 15px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
    }

    .image-left:hover {
        transform: scale(1.05);
    }

    .text-container {
        flex: 1;
        font-size: 1.125rem;
        color: #333;
        line-height: 1.6;
    }

    .text-container p {
        margin-bottom: 1.2rem;
    }

    /* Tab Button Styling */
    .tab-btn {
        font-size: 1.125rem;
        background-color: #fff;
        color: #333;
        padding: 0.75rem 1.25rem;
        border-radius: 25px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        margin: 0 15px;
        font-weight: 500;
    }

    .tab-btn:hover {
        background-color: #2e629a;
        color: #fff;
        transform: translateY(-2px);
    }

    .tab-btn.active {
        background-color: #2e629a;
        color: #fff;
    }

    /* Tab Content Styling */
    .tab-content {
        font-size: 1.125rem;
        font-weight: 500;
        text-align: left;
        padding: 2rem;
        background-color: #f4f7fb;
        border-radius: 12px;
        margin-top: 2rem;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    }

    /* Responsive Design for Smaller Screens */
    @media (max-width: 768px) {
        .about-container {
            padding: 1.5rem;
        }

        .about-content {
            flex-direction: column;
            align-items: center;
        }

        .image-left {
            width: 80%;
            max-width: 350px;
            margin-bottom: 2rem;
        }

        .tabs-container {
            flex-direction: column;
        }

        .tab-btn {
            margin: 10px 0;
            width: 100%;
            text-align: center;
        }
    }
</style>
 -->

 <template lang="pug">
    div.about-container(style="margin-top: 11vh")
        h2.text-center.text-4xl.font-extrabold.mt-8 About Us
        hr.center-text(style="border-top: 3px solid #122C4F; width: 80%; margin: 20px auto;")

        div.about-content
            img(src="https://media.istockphoto.com/id/1397843796/photo/shot-of-a-group-of-kids-reading-a-book-outside.jpg?s=612x612&w=0&k=20&c=VSI7oX0jIfmEZm4C-RJgz_t2frI9otsZIqHHapOoCS0=" alt="Non-profit image" class="image-left")

            div.text-container
                p.mb-6 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum scelerisque malesuada. In luctus nunc massa, sed auctor ante condimentum et. Nunc in vestibulum ante, ut aliquet eros. Suspendisse congue ultrices pharetra. Vivamus non ex accumsan, elementum diam et, laoreet nulla. Sed auctor felis a justo finibus, nec congue lectus ultrices.
                p Nunc egestas ipsum sit amet erat blandit, et fringilla nulla egestas. Sed et ornare lacus.

        div.tabs-container.flex.justify-center.mt-8
            button(type="button" @click="activeTab = 'contact'" :class="['tab-btn', { 'active': activeTab === 'contact' } ]") Contact
            button(type="button" @click="activeTab = 'location'" :class="['tab-btn', { 'active': activeTab === 'location' } ]") Location
            button(type="button" @click="activeTab = 'feedback'" :class="['tab-btn', { 'active': activeTab === 'feedback' } ]") Feedback

        div.tab-content
            div(v-if="activeTab === 'contact'" class="tab-content-active")
                p.text-lg Email: info@ReadingHuddle.com
                p.text-lg Phone: (214) 219-0096

            div(v-if="activeTab === 'location'" class="tab-content-active")
                p.text-lg Address: MLK Community Center Box 225431, Dallas, TX
                p.text-lg Description

            div(v-if="activeTab === 'feedback'" class="tab-content-active")
                p.text-lg Leave Feedback Here!
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
    /* General Container */
    .about-container {
        max-width: 900px;
        background-color: #fdd487;
        border-radius: 20px;
        padding: 2rem;
        margin: 30px auto;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        font-family: 'Roboto', sans-serif;
        overflow: hidden;
        position: relative;
    }

    /* Title Styling */
    h2 {
        font-size: 3rem;
        color: #122C4F;
        margin-bottom: 10px;
        transition: transform 0.3s ease;
    }

    h2:hover {
        transform: scale(1.1);
    }

    /* Horizontal Line Styling */
    hr {
        border-top: 5px solid #122C4F;
        width: 70%;
        margin: 1rem auto;
        transition: width 0.3s ease;
    }

    hr:hover {
        width: 80%;
    }

    /* About Content Layout */
    .about-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2rem;
        gap: 2rem;
        opacity: 0;
        animation: fadeIn 1s forwards;
    }

    .image-left {
        width: 50%;
        max-width: 480px;
        border-radius: 15px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
    }

    .image-left:hover {
        transform: scale(1.05);
    }

    .text-container {
        flex: 1;
        font-size: 1.125rem;
        color: #333;
        line-height: 1.6;
    }

    .text-container p {
        margin-bottom: 1.2rem;
    }

    /* Tab Button Styling */
    .tab-btn {
        font-size: 1.125rem;
        background-color: #fff;
        color: #333;
        padding: 0.75rem 1.25rem;
        border-radius: 25px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        margin: 0 15px;
        font-weight: 500;
        position: relative;
    }

    .tab-btn::before {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0%;
        height: 3px;
        background-color: #122C4F;
        transition: width 0.3s ease;
    }

    .tab-btn:hover {
        background-color: #2e629a;
        color: #fff;
        transform: translateY(-2px);
    }

    .tab-btn.active {
        background-color: #2e629a;
        color: #fff;
        font-weight: bold;
    }

    .tab-btn.active::before {
        width: 100%;
    }

    /* Tab Content Styling */
    .tab-content {
        font-size: 1.125rem;
        font-weight: 500;
        text-align: left;
        padding: 2rem;
        background-color: #f4f7fb;
        border-radius: 12px;
        margin-top: 2rem;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        opacity: 0;
        transform: translateY(20px);
        animation: slideIn 0.5s forwards;
    }

    .tab-content-active {
        animation: fadeInContent 0.6s ease forwards;
    }

    /* Responsive Design for Smaller Screens */
    @media (max-width: 768px) {
        .about-container {
            padding: 1.5rem;
        }

        .about-content {
            flex-direction: column;
            align-items: center;
        }

        .image-left {
            width: 80%;
            max-width: 350px;
            margin-bottom: 2rem;
        }

        .tabs-container {
            flex-direction: column;
        }

        .tab-btn {
            margin: 10px 0;
            width: 100%;
            text-align: center;
        }
    }

    /* Keyframe Animations */
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeInContent {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideIn {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>
