<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  coursePage: true
})

const route = useRoute()
const bookId = computed(() => route.params.id)

// Viewing mode: 'read', 'watch', or 'both'
const viewingMode = ref(null)

// Sample book data - later this should come from your database
const books = [
  {
    id: 0,
    title: 'A Bad Case of Stripes',
    author: 'David Shannon',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388199847i/31456.jpg',
    description: 'Camilla Cream loves lima beans, but she never eats them. Why? Because the other kids at her school don\'t like them. And Camilla is very worried about what other people think of her.',
    readContent: `
      <h2>A Bad Case of Stripes</h2>
      <p>Camilla Cream loved lima beans. But she never ate them. Why? Because the other kids in her school didn't like them. And Camilla Cream was very, very worried about what other people thought of her.</p>
      <p>Camilla had a closet full of gorgeous clothes. But she couldn't decide what to wear on the first day of school. She looked fabulous in everything she tried on. She was even wearing a cool new outfit she'd picked out the night before...</p>
      <p>But when she looked in the mirror that morning, Camilla screamed. She was covered from head to toe with bright, colorful stripes!</p>
    `,
    videoUrl: 'https://storylineonline.net/books/a-bad-case-of-stripes',
    youtubeId: 'lSm4EV05pXI',
  },
  {
    id: 1,
    title: 'Brave Irene',
    author: 'William Steig',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1431980916i/595868.jpg',
    description: 'Brave Irene is a dressmaker\'s daughter. One day, Irene volunteers to deliver a beautiful ball gown to the duchess in spite of a fierce snowstorm.',
    readContent: `
      <h2>Brave Irene</h2>
      <p>Mrs. Bobbin, the dressmaker, was tired and had a bad headache, but she still managed to sew the last stitches in the gown she was making.</p>
      <p>"It's the most beautiful dress in the world!" her daughter Irene said.</p>
      <p>Mrs. Bobbin had to deliver the gown to the duchess before the evening ball, but she felt too sick to go out in the cold...</p>
    `,
    videoUrl: 'https://storylineonline.net/books/brave-irene',
    youtubeId: 'D3QjTM5d0OU',
  },
  {
    id: 2,
    title: 'The Rainbow Fish',
    author: 'Marcus Pfister',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1568664149i/293584.jpg',
    description: 'The Rainbow Fish is an international best-seller and a modern classic. Eye-catching foil stamping, glittering on every page, offers instant child-appeal.',
    readContent: `
      <h2>The Rainbow Fish</h2>
      <p>A long way out in the deep blue sea there lived a fish. Not just an ordinary fish, but the most beautiful fish in the entire ocean.</p>
      <p>His scales were every shade of blue and green and purple, with sparkling silver scales among them. The other fish were amazed at his beauty.</p>
      <p>They called him Rainbow Fish. "Come on, Rainbow Fish," they would call. "Come and play with us!" But the Rainbow Fish would just glide past, proud and silent...</p>
    `,
    videoUrl: 'https://storylineonline.net/books/the-rainbow-fish',
    youtubeId: 'r9mXkBwdIxQ',
  },
  {
    id: 3,
    title: 'Chester\'s Way',
    author: 'Kevin Henkes',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388277024i/527586.jpg',
    description: 'Chester has his own way of doing things. His best friend Wilson does things just the same way. Then Lilly moves into the neighborhood.',
    readContent: `
      <h2>Chester's Way</h2>
      <p>Chester had his own way of doing things. He always cut his sandwiches diagonally. He always got out of bed on the same side. And he never left the house without double-knotting his shoes.</p>
      <p>"Chester has his own way of doing things," said Chester's mother.</p>
      <p>"That's one way to put it," said Chester's father. Chester's best friend Wilson was exactly the same...</p>
    `,
    videoUrl: 'https://storylineonline.net/books/chesters-way',
    youtubeId: 'HZE1M7VwHHU',
  },
  {
    id: 4,
    title: 'Carla\'s Sandwich',
    author: 'Debbie Herman',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348085691i/8228652.jpg',
    description: 'When her classmates make fun of Carla\'s unusual sandwiches, it takes a special teacher to show her that being different is something to celebrate.',
    readContent: `
      <h2>Carla's Sandwich</h2>
      <p>Carla liked lots of different things for lunch. But it wasn't a peanut butter and jelly sandwich. And it wasn't a bologna sandwich either.</p>
      <p>Carla's sandwiches were different. Very different. On Monday, Carla brought a sandwich with Swiss cheese, pineapple slices, and sliced pickles...</p>
    `,
    videoUrl: 'https://storylineonline.net/books/carlas-sandwich',
    youtubeId: 'wKBSVk2IJKw',
  },
  {
    id: 5,
    title: 'Turkey Trouble',
    author: 'Wendi Silvano',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386924677i/6469675.jpg',
    description: 'Turkey is in trouble. Bad trouble. The kind of trouble where it\'s almost Thanksgiving...and you\'re the main course.',
    readContent: `
      <h2>Turkey Trouble</h2>
      <p>Turkey was worried. Very worried. You see, it was almost Thanksgiving. And Turkey knew what that meant...</p>
      <p>"I have to get out of here!" said Turkey. "I need to find a disguise!" So Turkey went looking for ideas...</p>
    `,
    videoUrl: 'https://storylineonline.net/books/turkey-trouble',
    youtubeId: 'cBCmV9FAHug',
  },
]

const currentBook = computed(() => {
  return books.find(book => book.id === parseInt(bookId.value)) || books[0]
})

const selectMode = (mode) => {
  viewingMode.value = mode
}

const goBack = () => {
  window.history.back()
}
</script>

<template lang="pug">
.wrapper.flex.bg-white.min-h-screen
  .main-content.flex.flex-col.flex-1.p-10
    //- Back button
    button.back-btn.mb-6.px-4.py-2.bg-gray-200.rounded.hover_bg-gray-300.transition(
      @click="goBack"
    ) ← Back to Library

    //- Book header
    .book-header.flex.gap-6.mb-8
      img.book-cover(:src="currentBook.image" alt="Book cover" class="w-40 h-56 object-cover rounded shadow-lg")
      .book-info.flex-1
        h1.text-4xl.font-bold.mb-2 {{ currentBook.title }}
        p.text-xl.text-gray-600.mb-4 by {{ currentBook.author }}
        p.text-gray-700 {{ currentBook.description }}

    //- Mode selection buttons (shown if no mode selected)
    .mode-selection.mb-8(v-if="!viewingMode")
      h2.text-2xl.font-semibold.mb-4 How would you like to experience this book?
      .flex.gap-4.flex-wrap
        button.mode-btn.px-12.py-6.bg-blue-600.text-white.rounded-lg.hover_bg-blue-700.transition.font-semibold.text-xl(
          @click="selectMode('read')"
        ) 📖 Read Book
        
        button.mode-btn.px-12.py-6.bg-purple-600.text-white.rounded-lg.hover_bg-purple-700.transition.font-semibold.text-xl(
          @click="selectMode('watch')"
        ) 🎥 Watch Book
        
        button.mode-btn.px-12.py-6.bg-green-600.text-white.rounded-lg.hover_bg-green-700.transition.font-semibold.text-xl(
          @click="selectMode('both')"
        ) 📚 Read and Watch Book

    //- Content display based on selected mode
    .content-container(v-if="viewingMode")
      //- Change mode button
      button.change-mode-btn.mb-4.px-4.py-2.bg-gray-200.rounded.hover_bg-gray-300.transition(
        @click="viewingMode = null"
      ) ← Change Viewing Mode

      //- Read mode
      .read-content.bg-gray-50.p-8.rounded-lg.shadow(v-if="viewingMode === 'read'")
        h2.text-3xl.font-bold.mb-6 Reading: {{ currentBook.title }}
        .prose.max-w-none(v-html="currentBook.readContent")

      //- Watch mode
      .watch-content.bg-gray-50.p-8.rounded-lg.shadow(v-if="viewingMode === 'watch'")
        h2.text-3xl.font-bold.mb-6 Watching: {{ currentBook.title }}
        .video-container.aspect-video
          iframe.w-full.h-full.rounded(
            :src="`https://www.youtube-nocookie.com/embed/${currentBook.youtubeId}?autoplay=1&rel=0`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          )
        .mt-4.text-center
          p.text-sm.text-gray-600 Video not loading? 
            a.text-blue-600.hover_underline(:href="currentBook.videoUrl" target="_blank") Watch on Storyline Online

      //- Read and Watch mode (both)
      .both-content(v-if="viewingMode === 'both'")
        h2.text-3xl.font-bold.mb-6 Reading & Watching: {{ currentBook.title }}
        
        .both-layout
          //- Video on left (fixed height)
          .video-section.bg-gray-50.p-6.rounded-lg.shadow
            h3.text-xl.font-semibold.mb-4 📺 Video
            .video-container
              iframe.w-full.h-full.rounded(
                :src="`https://www.youtube-nocookie.com/embed/${currentBook.youtubeId}?rel=0`"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              )
            .mt-2.text-center
              p.text-xs.text-gray-600 Not loading? 
                a.text-blue-600.hover_underline(:href="currentBook.videoUrl" target="_blank") Watch here
          
          //- Reading content on right (scrollable)
          .read-section.bg-gray-50.p-6.rounded-lg.shadow
            h3.text-xl.font-semibold.mb-4 📖 Text
            .prose.max-w-none(v-html="currentBook.readContent")
</template>

<style scoped>
.main-content {
  max-width: 1400px;
  margin: 0 auto;
}

.book-cover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.mode-btn {
  font-size: 1.25rem;
  min-width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mode-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.back-btn,
.change-mode-btn {
  font-weight: 500;
}

.prose {
  line-height: 1.8;
  color: #333;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.prose p {
  margin-bottom: 1rem;
}

/* Both mode layout */
.both-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.video-section {
  position: sticky;
  top: 1rem;
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.read-section {
  min-height: 600px;
}

/* Responsive: stack on mobile */
@media (max-width: 1024px) {
  .both-layout {
    grid-template-columns: 1fr;
  }
  
  .video-section {
    position: static;
  }
}
</style>
