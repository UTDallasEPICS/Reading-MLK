<script>
export default {
    data() {
        return {
            activeTab: 'contact'
        }
    }
}
</script>

<template lang="pug">
    .about-container(class="flex flex-col items-center justify-center bg-white overflow-y-hidden")
        // Container
        .section-container(class="relative w-full h-[200px]")
            // Background Image
            img(class="absolute inset-0 w-full h-full object-cover" src="/children_playing.jpg" alt="Background")
  
            // Page Header
            .page-header(class="absolute inset-0 flex items-end justify-center mb-9")
                h1(class="text-6xl font-bold text-white uppercase tracking-wide") About Us
        div(class="flex flex-row justify-center bg-white w-full py-14")
            // Vision Section
            .vision-card(class="relative flex flex-col justify-center items-center bg-[#FFCD98] rounded-lg shadow-lg animate-fadeIn m-4 w-[25vw]")
                h3(class="text-3xl lg:text-4xl font-bold text-customBlue uppercase tracking-wide mb-4") Our Vision
                p(class="text-lg sm:text-xl px-4 sm:px-6 font-medium text-customBlue text-center leading-relaxed")
                    | At Reading Huddle, our vision is to create a world where every child has access to literacy resources and inspiring role models. 
                    | By championing early education, we aim to bridge gaps and create opportunities for every child to thrive.

            
            // Values Section
            .values-card(class="relative flex flex-col items-center bg-white rounded-lg shadow-lg border border-[4px] border-customBlue animate-fadeIn m-4 p-4")
                h2(class="text-4xl font-bold text-gray-800 uppercase mb-8 tracking-wide") Our Core Values
                .values-grid(class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8")
                    
                    // Value Item - Passion
                    .value-item(class="flex flex-col items-center p-6 bg-customBlue rounded-lg shadow-lg transition-transform hover:scale-105")
                        i(class="fa fa-heart text-4xl text-red-500 mb-4")
                        h3(class="text-xl font-semibold text-white") Passion
                        p(class="text-gray-100 text-center") Empowering families with a love for reading.

                    // Value Item - Community
                    .value-item(class="flex flex-col items-center p-6 bg-[#FFCD98] rounded-lg shadow-lg transition-transform hover:scale-105")
                        i(class="fa fa-users text-4xl text-blue-500 mb-4")
                        h3(class="text-xl font-semibold text-gray-800") Community
                        p(class="text-gray-600 text-center") Fostering connections that inspire growth.
                    
                    // Value Item - Education
                    .value-item(class="flex flex-col items-center p-6 bg-customBlue rounded-lg shadow-lg transition-transform hover:scale-105")
                        i(class="fa fa-book text-4xl text-yellow-500 mb-4")
                        h3(class="text-xl font-semibold text-white") Education
                        p(class="text-gray-100 text-center") Building lifelong learners through literacy.

        // Team Section
        .team-container(id="team" class="flex flex-col items-center w-full py-12 px-6 bg-[#FFCD98] animate-fadeIn")
            h2(class="text-4xl font-bold text-customBlue uppercase mb-8 tracking-wide") Meet Our Team
            .team-grid(class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8")
                .team-member(class="flex flex-col items-center p-6 bg-customBlue rounded-lg shadow-lg border border-[4px] border-customBlue transition-transform hover:scale-105")
                    img(src="/children_playing.jpg" alt="Team Member 2" class="w-32 h-32 rounded-full object-cover mb-4")
                    h3(class="text-xl font-semibold text-white") John Doe
                    p(class="text-white text-center") Visionary Founder with a passion for childhood literacy and storytelling.
                .team-member(class="flex flex-col items-center p-6 bg-customBlue rounded-lg shadow-lg border border-[4px] border-customBlue transition-transform hover:scale-105")
                    img(src="/children_playing.jpg" alt="Team Member 2" class="w-32 h-32 rounded-full object-cover mb-4")
                    h3(class="text-xl font-semibold text-white") Jane Smith
                    p(class="text-white text-center") Educator and literacy advocate connecting communities.
                .team-member(class="flex flex-col items-center p-6 bg-customBlue rounded-lg shadow-lg border border-[4px] border-customBlue transition-transform hover:scale-105")
                    img(src="/children_playing.jpg" alt="Team Member 2" class="w-32 h-32 rounded-full object-cover mb-4")
                    h3(class="text-xl font-semibold text-white") Mark Lee
                    p(class="text-white text-center") Developer behind innovative storytelling solutions.

        div(class="flex flex-row gap-5 py-[5vh] mx-[3vw]")
            // Feedback Section
            .feedback-container(class="flex flex-col w-[25vw] items-center py-12 px-6 bg-[#FFCD98] shadow-xl rounded-lg animate-fadeIn")
                h2(class="text-4xl font-bold text-customBlue uppercase mb-3 tracking-wide") Feedback
                p(class="text-lg text-center text-gray-700 mb-2 ") We'd love to hear your thoughts and suggestions.
                form(class="flex flex-col w-full max-w-md space-y-6")
                    input(type="text" placeholder="Your Name" class="p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-customBlue")
                    input(type="email" placeholder="Your Email" class="p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-customBlue")
                    textarea(placeholder="Your Message" class="p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-customBlue h-32")
                    button(type="submit" class="px-6 py-3 bg-customBlue text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition") Submit Feedback
                //- form(class="flex flex-col w-full max-w-md space-y-6")
                //-     input(type="text" placeholder="Your Name" class="p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-customBlue")
                //-     textarea(placeholder="Your Feedback" class="p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-customBlue h-52")
                //-     button(type="submit" class="px-6 py-3 bg-customBlue text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition") Submit Feedback

            // Location Section
            .location-container(class="flex flex-col items-center w-[40vw] py-12 px-6 bg-customBlue/5 animate-fadeIn border shadow-xl rounded-xl border-[4px] border-customBlue")
                h2(class="text-4xl font-bold text-customBlue uppercase mb-8 tracking-wide") Our Location
                .address-container(class="flex baseline-center space-x-4 text-center")
                    svg(
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-8 h-8 text-red-500"
                    )
                        path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C8.686 2 6 4.686 6 8c0 2.84 3.6 7.44 5.325 9.513a1.74 1.74 0 002.35 0C14.4 15.44 18 10.84 18 8c0-3.314-2.686-6-6-6zM12 11a3 3 0 100-6 3 3 0 000 6z")
                    //- p(class="text-lg text-gray-700") MLK Community Center Box 225431, Dallas, TX
                    p(class="text-lg text-center text-gray-700 mb-6")
                        span(class="font-bold") 2922 Martin Luther King Jr Blvd, Dallas, TX, 75215.

                // Google Map Embed
                .map-container(class="w-[90%] h-64 mt-6 rounded-lg shadow-lg")
                    iframe(
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1342.8068406611763!2d-96.81201827573116!3d32.718019378323336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e990044de52ad%3A0x6d8b12b63ce3a2cb!2sMartin%20Luther%20King%20Community%20Center!5e0!3m2!1sen!2sus!4v1697898782086!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    )

            // Contact Us Section
            .contact-container(class="flex flex-col w-[25vw] items-center py-12 px-6 bg-[#FFCD98] shadow-xl rounded-lg animate-fadeIn")
                h2(class="text-4xl font-bold text-customBlue uppercase mb-3 tracking-wide") Contact Us
                p(class="text-lg text-center text-gray-700 mb-2 ") We'd love to get in touch with you!
                form(class="flex flex-col w-full max-w-md space-y-6")
                    input(type="text" placeholder="Your Name" class="p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-customBlue")
                    input(type="email" placeholder="Your Email" class="p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-customBlue")
                    textarea(placeholder="Your Message" class="p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-customBlue h-32")
                    button(type="submit" class="px-6 py-3 bg-customBlue text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition") Send Message

        
</template>
