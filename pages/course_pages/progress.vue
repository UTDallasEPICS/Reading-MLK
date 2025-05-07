<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'; // Import RouterLink

// Type definitions
interface Genre {
  label: string
  value: number
  name: string
}

interface ClassGoal {
  grade: string
  progress: number
  booksRead: number
}

interface TeacherComment {
  id: number
  teacherName: string
  avatar: string
  comment: string
  daysAgo?: number // Optional property for days ago
}

// Meta
definePageMeta({
  coursePage: true
})

// Reactive data
const participationPoints = ref<number>(2450)
const achievementPoints = ref<number>(349)
const progressPercent = ref<number>(15)
const totalBooksRead = ref<number>(70)
const totalGoal = ref<number>(220)

const genreData = ref<Genre[]>([
  { label: 'S', value: 14, name: 'Sci-Fi' },
  { label: 'F', value: 8, name: 'Fantasy' },
  { label: 'H', value: 12, name: 'History' },
  { label: 'T', value: 4, name: 'Thriller' },
  { label: 'CF', value: 10, name: 'Contemporary Fiction' },
  { label: 'B', value: 6, name: 'Biography' }
])

const classGoals = ref<ClassGoal[]>([
  { grade: '4th Grade', progress: 65, booksRead: 650 },
  { grade: '6th Grade', progress: 50, booksRead: 500 },
  { grade: '7th Grade', progress: 30, booksRead: 300 }
])

const teacherComments = ref<TeacherComment[]>([
  {
    id: 1,
    teacherName: 'Ms. More',
    avatar: 'https://i.pravatar.cc/40?img=1',
    comment: 'Wonderful summary! Beautifully written and love the exuberant vocabulary utilized in the description of the characters',
    daysAgo: 1
  },
  {
    id: 2,
    teacherName: 'Mr. Henry',
    avatar: "https://i.pravatar.cc/40?img=2",
    comment: "Excellent work! Your summary is exceptionally well-written, demonstrating a deep understanding of the characters and their development. Your choice of vocabulary is particularly striking—your use of vivid and expressive language brings the descriptions to life, making the characters feel dynamic and real. The precision with which you capture their traits, motivations, and relationships adds depth to your analysis",
    daysAgo: 3
  }
])

// Computed properties
const sortedGenres = computed<Genre[]>(() => {
  return [...genreData.value].sort((a, b) => b.value - a.value).slice(0, 3)
})

const progressPath = computed<string>(() => {
  return calculateArcPath(progressPercent.value)
})

const booksReadPath = computed<string>(() => {
  const percent = Math.min(totalBooksRead.value / totalGoal.value * 100, 100)
  return calculateArcPath(percent)
})

// Utility function
function calculateArcPath(percent: number): string {
  const angle = (Math.min(Math.max(percent, 0), 100) / 100) * 180
  const radius = 90
  const centerX = 100
  const centerY = 100
  const toRadians = (deg: number) => (Math.PI / 180) * deg
  const x = centerX + radius * Math.cos(toRadians(180 - angle))
  const y = centerY - radius * Math.sin(toRadians(angle))
  const largeArc = angle > 180 ? 1 : 0
  return `M10,100 A90,90 0 ${largeArc},1 ${x},${y}`
}
</script>

<template lang="pug">
div(class="flex bg-white min-h-screen")
  div(class="flex flex-col items-center justify-center p-10 w-full")
    div(class="py-8 px-16 w-full rounded-md bg-[#B4B3AC]")
      div(class="flex justify-between flex-wrap gap-6")
      

        // Score Box
        div(class="bg-white shadow p-6 rounded-md w-80 h-72 flex-shrink-0")
          div(class="text-xs font-semibold text-gray-600 mb-1 text-center") Your Score
          div(class="h-px bg-gray-300 mb-2")
          div(class="flex justify-around h-full")
            div(class="text-center flex flex-col justify-center h-full")
              div(class="text-3xl font-bold") {{ participationPoints.toLocaleString() }}
              div(class="pt-2 text-xs text-gray-600") Participation Points
            div(class="w-px bg-gray-300 h-40 self-center")
            div(class="text-center flex flex-col justify-center h-full")
              div(class="text-3xl font-bold") {{ achievementPoints.toLocaleString() }}
              div(class="pt-2 text-xs text-gray-600") Achievement Points

        // Progress Graph
        .progress-graph-box.bg-white.shadow.p-6.rounded-md.flex.flex-col.items-center.text-center.w-.h-72.flex-shrink-0
          .text-xs.font-semibold.text-gray-600.mb-2
          svg(viewBox="0 0 200 100" width="150" height="100")
            // Background arc
            path(
              d="M10,100 A90,90 0 0,1 190,100"
              stroke="#e5e7eb"
              stroke-width="8"
              fill="none"
            )
            // Orange progress arc
            path(
              :d="progressPath"
              stroke="#f97316"
              stroke-width="8"
              fill="none"
            )

          // Text sections
          div(class="text-xs font-bold text-black mt-2 text-center w-3/4") Need Improvement
          div(class="text-xs text-gray-600 mt-1 text-center w-3/4") Here are some tips on how to improve your score
        
        // Top Genres
        div(class="bg-white shadow p-6 rounded-md flex flex-col items-center w-[350px] h-72 flex-shrink-0")
          div(class="text-xs font-bold text-gray-600 mb-4 text-center") Top Genres
          div(class="flex items-end justify-center gap-1 h-32 mb-4")
            div(
              v-for="genre in genreData"
              :key="genre.label"
              class="flex flex-col items-center"
            )
              div(
                class="rounded-t-md w-6"
                :style="`height: ${genre.value * 4}px; background-color: #7f1d1d`"
              )
              div(class="text-xs text-gray-600 mt-1") {{ genre.label }}
          div(class="w-full h-px bg-gray-300 my-2")
          div(class="flex flex-col gap-2 text-sm text-gray-700 font-medium w-full")
            div(
              v-for="g in sortedGenres"
              :key="g.label"
              class="flex justify-between"
            )
              span {{ g.name }}
              span(class="font-semibold") {{ g.value }} books

        // Class Goals
        div(class="bg-white shadow p-8 rounded-md w-full max-w-2xl h-74 flex-shrink-0")
          div(class="text-lg font-semibold text-gray-800 mb-4 text-center") Class Goals
          div(
            v-for="goal in classGoals"
            :key="goal.grade"
            class="mb-5"
          )
            div(class="w-full bg-blue-900 h-6 rounded mb-1")
              div(
                class="bg-blue-600 h-6 rounded"
                :style="`width: ${goal.progress}%`"
              )
            div(class="flex justify-between text-sm")
              span(class="text-gray-900") {{ goal.grade }}
              span(class="text-gray-900") {{ goal.booksRead.toLocaleString() }}/1,000 Books Read

        // Total Books Read
        div(class="bg-white shadow p-6 rounded-md flex flex-col items-center w-[350px] h-72 flex-shrink-0")
          div(class="text-lg font-semibold text-gray-600 mb-2") Total Books Read
          svg(viewBox="0 0 200 100" width="200" height="100")
            path(
              d="M10,100 A90,90 0 0,1 190,100"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              class="text-gray-200"
            )
            path(
              :d="booksReadPath"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              class="text-emerald-500"
            )
          div(class="text-3xl font-bold mt-3") {{ totalBooksRead.toLocaleString() }}
          div(class="text-xs text-gray-600") {{ (totalGoal - totalBooksRead).toLocaleString() }} more to go!

    // Teacher Comments
    div(class="p-8 w-full rounded-md mt-8 bg-[#B4B3AC]")
      div(class="flex justify-between items-center mb-6")
        h2(class="text-xl font-semibold text-white") Recent Teacher Comments
        router-link(to="/all-comments" class="text-black italic text-sm") Read More
      div(class="space-y-4")
        div(
          v-for="comment in teacherComments"
          :key="comment.id"
          class="bg-white shadow p-4 rounded-md flex justify-between items-start"
        )
          div(class="flex items-start")
            img(
              :src="comment.avatar"
              class="rounded-full w-10 h-10 mr-3"
            )
            div(class="flex flex-col")
              span(class="text-lg font-semibold text-gray-800") {{ comment.teacherName }}
              p(class="text-sm text-gray-700 mt-1 w-4/5") {{ comment.comment }}
          div(class="flex flex-col items-end justify-between")
            span(class="text-xs text-gray-400 italic") {{ comment.daysAgo }} days ago
            button(
              class="bg-blue-500 text-white text-sm px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-colors"
            ) View
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

/* Enhanced progress bars */
.progress-bar {
  background-color: #1e3a8a;
}

.progress-fill {
  background-color: #2563eb;
  transition: width 0.3s ease;
}

/* Better shadow for cards */
.bg-white.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Hover effects for interactive elements */
.view-button {
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #3b82f6;
  }
}
</style>