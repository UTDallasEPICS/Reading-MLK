<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function viewBook(index) {
  router.push(`/books/${index}`)
}

definePageMeta({
  coursePage: true
})

const searchQuery = ref('')
const books = ref([
  {
    title: 'All The Light We Cannot See',
    author: 'Anthony Doerr',
    image: '/allthelightwecannotsee.svg',
    bookmarked: true,
    favorited: false,
    genericpoints: 100,
    participationpoints: 500,
    bookdescription: 'A story of a blind French girl and a German boy during WWII.',
  },
  {
    title: 'Rich People Problems',
    author: 'Kevin Kwan',
    image: '/richpeopleproblems.svg',
    bookmarked: false,
    favorited: true,
    genericpoints: 100,
    participationpoints: 500,
    bookdescription: 'A story of a blind French girl and a German boy during WWII.',
  },
  {
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    image: '/wherecrawdadssing.svg',
    bookmarked: true,
    favorited: true,
    genericpoints: 100,
    participationpoints: 500,
    bookdescription: 'A story of a blind French girl and a German boy during WWII.',
  },
  {
    title: 'Crazy Rich Asians',
    author: 'Kevin Kwan',
    image: '/crazyrichasians.svg',
    bookmarked: false,
    favorited: false,
    genericpoints: 100,
    participationpoints: 500,
    bookdescription: 'A story of a blind French girl and a German boy during WWII.',
  },
  {
    title: 'Rich People Problems',
    author: 'Kevin Kwan',
    image: '/richpeopleproblems.svg',
    bookmarked: false,
    favorited: false,
    genericpoints: 100,
    participationpoints: 500,
    bookdescription: 'A story of a blind French girl and a German boy during WWII.',
  },
  {
    title: 'Crazy Rich Asians',
    author: 'Kevin Kwan',
    image: '/crazyrichasians.svg',
    bookmarked: true,
    favorited: true,
    genericpoints: 100,
    participationpoints: 500,
    bookdescription: 'A story of a blind French girl and a German boy during WWII.',
  },
])

</script>

<template lang="pug">
.wrapper.flex.bg-white.min-h-screen
  .main-content.flex.flex-col.flex-1.items-center.justify-start.p-10
    .book-container.bg-books.pt-2.px-4.rounded-lg.shadow-md
      .flex.mb-8

      h1.text-4xl.font-bold.text-gray-800.mb-1 Recently Read
      p.text-lg.text-gray-500.mb-6 Jump back in!


      .grid(class="grid grid-cols-1 md:grid-cols-1 gap-6")
        div(
          v-for="(book, index) in books"
          :key="index"
          class="bg-white p-4 shadow-md rounded-lg flex items-start gap-4 hover:shadow-lg transition-all duration-200"
        )
          NuxtLink(
            :to="`/books/${index}`"
            class="flex flex-1 gap-6"
          )
            img(:src="book.image" alt="cover" class="w-24 h-36 object-cover rounded-lg")
            .flex.flex-col.justify-between
              h3.text-xl.font-semibold {{ book.title }}
              p.text-sm.text-gray-500 By {{ book.author }}
              p.text-sm.text-gray-500.mt-2 {{book.bookdescription}}

      .grid(class="grid md:grid-cols-1 gap-6")
        div(
          v-for="(book, index) in books"
          :key="index"
          class="bg-white p-4 shadow-md rounded-lg flex items-start gap-4 hover:shadow-lg transition-all duration-200"
        )
          NuxtLink(
            :to="`/books/${index}`"
            class="flex flex-1 gap-6"
          )
            img(:src="book.image" alt="cover" class="w-24 h-36 object-cover rounded-lg")
            .flex.flex-col.justify-between
              h3.text-xl.font-semibold {{ book.title }} ||  {{ book.author }}
              p.text-l.text-gray-500.mt-2 Generic Points: {{book.genericpoints}}
              p.text-l.text-gray-500.mt-2 Participation Points: {{book.participationpoints}}
          button(
            class="mt-4 bg-[#204D90] text-white text-base px-6 py-2 rounded hover:bg-[#18396C] transition-all duration-300"
            @click="viewBook(index)"
          ) View

           
</template>

<style scoped>
.main-content {
  min-height: 100vh;
}

.bg-books {
  background-color: #B4B3AC;
}

.book-container {
  width: 100%;
  max-width: 95rem;
}
</style>
