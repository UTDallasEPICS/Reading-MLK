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
        
        //- .divider-horizontal(class="w-[60vw] border-t-[10px] border-gray-400")



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

  </template>
  