<template lang="pug">
.footer(class="flex justify-center items-center p-6 sm:p-8 rounded-2xl bg-[#FFCD98] w-[95vw] sm:gap-36 shadow-lg mt-14")
    //- .footer(class="bg-[#FFCD98] text-gray-900 py-8 mt-10 w-full")
    .container(class="container mx-auto px-4")
      .footer-container(class="flex flex-col md:flex-row md:justify-between items-center space-y-6 md:space-y-0")
        .contact-section(class="flex flex-col items-center md:items-start text-center md:text-left")
          h3(class="text-2xl font-semibold mb-2") Contact Us
          h2(class="text-3xl font-bold mb-2 text-black") info@ReadingHuddle.com
        .social-media-container(class="flex space-x-4 mt-4 md:mt-0")
          a(href="https://facebook.com" target="_blank")
            img(src="/facebook.png" alt="Facebook logo" class="w-8 h-8 transition-transform duration-300 transform hover:scale-110")
          a(href="https://instagram.com" target="_blank")
            img(src="/instagram.png" alt="Instagram logo" class="w-8 h-8 transition-transform duration-300 transform hover:scale-110")
          a(href="https://twitter.com" target="_blank")
            img(src="/twitter.png" alt="Twitter logo" class="w-8 h-8 transition-transform duration-300 transform hover:scale-110")

</template>