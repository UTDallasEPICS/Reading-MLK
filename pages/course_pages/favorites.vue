<script setup>
import { ref } from 'vue'

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
  },
  {
    title: 'Rich People Problems',
    author: 'Kevin Kwan',
    image: '/richpeopleproblems.svg',
    bookmarked: false,
    favorited: true,
  },
  {
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    image: '/wherecrawdadssing.svg',
    bookmarked: true,
    favorited: true,
  },
  {
    title: 'Crazy Rich Asians',
    author: 'Kevin Kwan',
    image: '/crazyrichasians.svg',
    bookmarked: false,
    favorited: false,
  },
  {
    title: 'Rich People Problems',
    author: 'Kevin Kwan',
    image: '/richpeopleproblems.svg',
    bookmarked: false,
    favorited: false,
  },
  {
    title: 'Crazy Rich Asians',
    author: 'Kevin Kwan',
    image: '/crazyrichasians.svg',
    bookmarked: true,
    favorited: true,
  },
])

</script>

<template lang="pug">
.wrapper.flex.bg-white.min-h-screen
  .main-content.flex.flex-col.flex-1.items-center.justify-start.p-10
    .book-container.bg-books.p-8.rounded-lg.shadow-md
      .flex.mb-8
        input(
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="flex-1 px-4 py-2 rounded-l-md border border-gray-400"
        )
        button(
          class="px-6 py-2 bg-[#204D90] text-white font-medium rounded-r-md hover:bg-[#18396C] transition-all duration-300"
        ) Search

      .grid(class="grid grid-cols-1 md:grid-cols-2 gap-6")
        div(
          v-for="(book, index) in books"
          :key="index"
          class="bg-white p-4 shadow-md rounded-lg flex items-start gap-4 hover:shadow-lg transition-all duration-200"
        )
          NuxtLink(
            :to="`/books/${index}`"
            class="flex flex-1 gap-4"
          )
            img(:src="book.image" alt="cover" class="w-20 h-28 object-cover rounded")
            .flex-1
              h3.font-bold.text-lg {{ book.title }}
              p.text-sm.text-gray-600 by {{ book.author }}
              p.text-sm.text-gray-500.mt-2 book description snippet...

          .flex.flex-col.items-end.gap-4
            img(
              :src="book.bookmarked ? '/filledbookmark.svg' : '/emptybookmark.svg'"
              alt="bookmark icon"
              class="w-9 h-9 cursor-pointer"
              @click.stop="book.bookmarked = !book.bookmarked"
            )
            img(
              :src="book.favorited ? '/filledstar.svg' : '/emptystar.svg'"
              alt="star icon"
              class="w-9 h-9 cursor-pointer"
              @click.stop="book.favorited = !book.favorited"
            )
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
