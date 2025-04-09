<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  coursePage: true
})

// Example quiz questions
const questions = ref([
  { id: 1, text: '[Question 1 here]' },
  { id: 2, text: '[Question 2 here]' },
  { id: 3, text: '[Question 3 here]' }
])

const currentIndex = ref(0)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value === questions.value.length - 1)

const userAnswers = ref(Array(questions.value.length).fill('')); // Initialize an array to store answers for each question

const answeredQuestions = computed(() => {
  return userAnswers.value.filter((answer) => answer.trim() !== '').length;
});

function nextQuestion() {
  if (!isLast.value) currentIndex.value++
}

function prevQuestion() {
  if (!isFirst.value) currentIndex.value--
}

function submitQuiz() {
  alert('Quiz submitted!')
}
</script>

<template lang="pug">
.wrapper.flex.bg-white.min-h-screen
  // Sidebar handled globally via app.vue

  .main-content.flex.flex-col.items-center.justify-content-center.p-10.w-full

    // Progress display
    .w-full.flex.justify-end.mb-4
      p.text-lg.font-semibold.text-gray-700 {{ answeredQuestions }} / {{ questions.length }} questions

    // Containers
    .quiz-bg-gray.bg-customQuizGray.p-8.w-full(style="height: 70vh;")
      .quiz-bg-white.bg-white.p-8.h-full
      
        // Question Section
        .question-section.mb-6
            h2.text-xl.font-semibold.text-gray-800.mb-2 Question {{ currentIndex + 1 }}
            p.text-lg.text-gray-700 {{ currentQuestion.text }}

        // Free Response Section
        .response-section.mb-6
            textarea#response(
              v-model="userAnswers[currentIndex]"
              class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Type your answer here..."
            )

        // Navigation Section (Previous, Next, Submit)
        .controls.flex.justify-between.items-center
            button(
            @click="prevQuestion"
            v-if="!isFirst"
            class="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
            ) Previous

            button(
            @click="nextQuestion"
             v-if="!isLast"
            class="px-5 py-2 bg-customBlue text-white rounded-lg hover:bg-blue-700 transition-all"
            ) Next

            router-link(
            to="coursehomepage"
            @click="submitQuiz"
            v-if="isLast"
            class="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            ) Submit

</template>
