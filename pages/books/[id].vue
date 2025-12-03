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

// Sample book data - replaced with the five Gutenberg books; lazy-load full HTML on demand
const books = ref([
  {
    id: 0,
    title: 'Winnie-the-Pooh',
    author: 'A. A. Milne',
  image: '/gutenberg/67098-illus4.jpg',
    description: 'Classic stories of Winnie-the-Pooh and his friends in the Hundred Acre Wood.',
    readContent: `
      <h2>Winnie-the-Pooh — Chapter I</h2>
      <p>One day when he was out walking, he came to an open place in the middle of the forest, and in the middle of this place was a large oak-tree, and, from the top of the tree, there came a loud buzzing-noise.</p>
      <p>Winnie-the-Pooh sat down at the foot of the tree, put his head between his paws and began to think.</p>
    `,
    gutenbergUrl: 'https://www.gutenberg.org/cache/epub/67098/pg67098-images.html',
    youtubeId: '',
    loading: false,
    fullLoaded: false,
  },
  {
    id: 1,
    title: 'The Tale of Peter Rabbit',
    author: 'Beatrix Potter',
  image: '/gutenberg/14838-peter04.jpg',
    description: 'The classic story of Peter Rabbit and his misadventures in Mr. McGregor\'s garden.',
    readContent: `
      <h2>The Tale of Peter Rabbit — Opening</h2>
      <p>Once upon a time there were four little Rabbits, and their names were—Flopsy, Mopsy, Cotton-tail, and Peter.</p>
    `,
    gutenbergUrl: 'https://www.gutenberg.org/cache/epub/14838/pg14838-images.html',
    youtubeId: '',
    loading: false,
    fullLoaded: false,
  },
  {
    id: 2,
    title: "Humpty Dumpty (Denslow)",
    author: 'W. W. Denslow',
  image: '/gutenberg/25883-cover.jpg',
    description: 'Denslow\'s illustrated Humpty Dumpty and related picture-book tales.',
    readContent: `
      <h2>Humpty Dumpty — Opening</h2>
      <p>Humpty-Dumpty was a smooth, round little chap, with a winning smile, and a great golden heart in his broad breast.</p>
    `,
    gutenbergUrl: 'https://www.gutenberg.org/cache/epub/25883/pg25883-images.html',
    youtubeId: '',
    loading: false,
    fullLoaded: false,
  },
  {
    id: 3,
    title: 'The Little Red Hen',
    author: 'Florence White Williams',
  image: '/gutenberg/18735-cover.jpg',
    description: 'An illustrated retelling of the Little Red Hen and her determination to do the work herself.',
    readContent: `
      <h2>The Little Red Hen — Opening</h2>
      <p>Little Red Hen lived in a barnyard. She spent almost all of her time walking about the barnyard in her picketty-pecketty fashion, scratching everywhere for worms.</p>
    `,
    gutenbergUrl: 'https://www.gutenberg.org/cache/epub/18735/pg18735-images.html',
    youtubeId: '',
    loading: false,
    fullLoaded: false,
  },
  {
    id: 4,
    title: 'The Aesop for Children',
    author: 'Aesop (retold / illustrated)',
  image: '/gutenberg/19994-frontis.jpg',
    description: 'A collection of short fables with morals.',
    readContent: `
      <h2>The Aesop for Children — Selected Fables</h2>
      <p>Selected opening fables and summaries.</p>
    `,
    gutenbergUrl: 'https://www.gutenberg.org/cache/epub/19994/pg19994-images.html',
    youtubeId: '',
    loading: false,
    fullLoaded: false,
  },
])

const currentBook = computed(() => {
  return books.value.find(book => book.id === parseInt(bookId.value)) || books.value[0]
})

// Select viewing mode; when entering Read or Both, lazy-load the full Gutenberg HTML
const selectMode = async (mode) => {
  viewingMode.value = mode
  if ((mode === 'read' || mode === 'both') && currentBook.value && !currentBook.value.fullLoaded && !currentBook.value.loading) {
    await loadFullText(currentBook.value)
  }
}

const goBack = () => {
  window.history.back()
}

// Fetch full HTML from our server endpoint and sanitize it before inserting.
// Uses dynamic import of DOMPurify so import happens only in the browser.
const loadFullText = async (book) => {
  if (!book || book.fullLoaded) return
  try {
    book.loading = true
    const src = encodeURIComponent(book.gutenbergUrl)
    const res = await fetch(`/api/gutenberg?src=${src}`)
    if (!res.ok) throw new Error('Failed to fetch full text')
    const data = await res.json()
    const raw = data && data.html ? data.html : ''

    // dynamic import DOMPurify on client only
    let clean = raw
    try {
      const DOMPurifyModule = await import('dompurify')
      const DOMPurify = DOMPurifyModule && (DOMPurifyModule.default || DOMPurifyModule)
      if (DOMPurify && typeof DOMPurify.sanitize === 'function') {
        clean = DOMPurify.sanitize(raw)
      }
    } catch (e) {
      // if sanitization fails for any reason, fall back to raw (not ideal)
      console.warn('DOMPurify import failed, inserting raw HTML', e)
    }

    const footer = `<p class="pg-license text-xs text-gray-600 mt-6">Full text from <a href="${book.gutenbergUrl}" target="_blank" rel="noopener">Project Gutenberg</a>. See their terms on the source page.</p>`
    book.readContent = clean + footer
    book.fullLoaded = true
  } catch (err) {
    book.readContent = (book.readContent || '') + `<p class="text-sm text-red-600 mt-4">Could not load full text: ${err.message}</p>`
  } finally {
    book.loading = false
  }
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
            template(v-if="currentBook.youtubeId")
              iframe.w-full.h-full.rounded(
                :src="`https://www.youtube-nocookie.com/embed/${currentBook.youtubeId}?autoplay=1&rel=0`"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              )
            template(v-else)
              .no-video.p-6.text-center
                p.text-lg No video available for this book.
                p.mt-2
                  a.text-blue-600.hover_underline(:href="currentBook.gutenbergUrl" target="_blank") Open the book on Gutenberg

      //- Read and Watch mode (both)
      .both-content(v-if="viewingMode === 'both'")
        h2.text-3xl.font-bold.mb-6 Reading & Watching: {{ currentBook.title }}
        
        .both-layout
          //- Video on left (fixed height)
          .video-section.bg-gray-50.p-6.rounded-lg.shadow
            h3.text-xl.font-semibold.mb-4 📺 Video
            .video-container
              template(v-if="currentBook.youtubeId")
                iframe.w-full.h-full.rounded(
                  :src="`https://www.youtube-nocookie.com/embed/${currentBook.youtubeId}?rel=0`"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                )
              template(v-else)
                .no-video.p-6.text-center
                  p.text-lg No video available for this book.
                  p.mt-2
                    a.text-blue-600.hover_underline(:href="currentBook.gutenbergUrl" target="_blank") Open the book on Gutenberg
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
