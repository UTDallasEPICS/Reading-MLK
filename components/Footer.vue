<template lang="pug">
.footer(class="flex p-6 bg-customBlue w-full sm:gap-36 shadow-lg")
    .container(class="container mx-auto")
      .footer-container(class="flex flex-col md:flex-row md:justify-between items-center space-y-6 md:space-y-0")
        .contact-section(class="flex flex-col items-center md:items-start text-center md:text-left")
          h3(class="text-2xl font-semibold mb-2 text-white") Contact Us
          h2(class="text-3xl font-bold mb-2 text-white") info@ReadingHuddle.com
        .social-media-container(class="flex space-x-4 mt-4 md:mt-0 gap-3")
          a(href="https://www.facebook.com/friendsofmlk/" target="_blank")
            img(src="/facebook.svg" alt="Facebook logo" class="w-8 h-8 transition-transform duration-300 transform hover:scale-110")
          a(href="https://www.instagram.com/friends_of_mlk/?igsh=MXdlNGNxNnoyazNuNA%3D%3D#" target="_blank")
            img(src="/instagram.svg" alt="Instagram logo" class="w-8 h-8 transition-transform duration-300 transform hover:scale-110 color-[#E4405F]")
          a(href="https://x.com/friendsofmlk" target="_blank")
            img(src="/x.svg" alt="X logo" class="w-8 h-8 transition-transform duration-300 transform hover:scale-110")

</template>