<script setup>
import { ref } from 'vue'

definePageMeta({
  coursePage: true
})

const searchQuery = ref('')
const books = ref([
  {
    id: 0,
    title: 'Winnie-the-Pooh',
    author: 'A. A. Milne',
  image: '/gutenberg/67098-illus4.jpg',
    gutenbergUrl: 'https://www.gutenberg.org/cache/epub/67098/pg67098-images.html',
    bookmarked: false,
    favorited: false,
  },
  {
    id: 1,
    title: 'The Tale of Peter Rabbit',
    author: 'Beatrix Potter',
  image: '/gutenberg/14838-peter04.jpg',
    gutenbergUrl: 'https://www.gutenberg.org/cache/epub/14838/pg14838-images.html',
    bookmarked: false,
    favorited: false,
  },
  {
    id: 2,
    title: "Humpty Dumpty (Denslow)",
    author: 'W. W. Denslow',
  image: '/gutenberg/25883-cover.jpg',
    gutenbergUrl: 'https://www.gutenberg.org/cache/epub/25883/pg25883-images.html',
    bookmarked: false,
    favorited: false,
  },
  {
    id: 3,
    title: 'The Little Red Hen',
    author: 'Florence White Williams',
  image: '/gutenberg/18735-cover.jpg',
    gutenbergUrl: 'https://www.gutenberg.org/cache/epub/18735/pg18735-images.html',
    bookmarked: false,
    favorited: false,
  },
  {
    id: 4,
    title: 'The Aesop for Children',
    author: 'Aesop (retold / illustrated)',
  image: '/gutenberg/19994-frontis.jpg',
    gutenbergUrl: 'https://www.gutenberg.org/cache/epub/19994/pg19994-images.html',
    bookmarked: false,
    favorited: false,
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
          v-for="book in books"
          :key="book.id"
          class="bg-white p-4 shadow-md rounded-lg flex items-start gap-4 hover:shadow-lg transition-all duration-200"
        )
          NuxtLink(
            :to="`/books/${book.id}`"
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
