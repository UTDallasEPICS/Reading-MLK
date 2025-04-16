<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';

definePageMeta({
  coursePage: true
})

const router = useRouter();

// Example multiple choice quiz questions
const questions = ref([
  { id: 1,
    text: '[Question 1 here]',
    choices: ['Choice A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Choice A',
    selectedAnswer: '',
    hasInteracted: false
   },
   { id: 2,
    text: '[Question 2 here]',
    choices: ['Choice A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Choice C',
    selectedAnswer: '',
    hasInteracted: false
   },
   { id: 3,
    text: '[Question 3 here]',
    choices: ['Choice A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Choice D',
    selectedAnswer: '',
    hasInteracted: false
   }
])

const currentIndex = ref(0)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value === questions.value.length - 1)

function handleAnswerSelection(choice) {
  console.log("First", choice);
  questions.value[currentIndex.value].selectedAnswer = choice;
  questions.value[currentIndex.value].hasInteracted = true;
  console.log("Second");
}

const answeredQuestions = computed(() => {
  console.log(questions.value);
  return questions.value.filter(q => q.hasInteracted).length;
});


function nextQuestion() {
  if (!isLast.value) currentIndex.value++
}

function prevQuestion() {
  if (!isFirst.value) currentIndex.value--
}

function submitQuestion() {
  alert('Quiz submitted!');
}
</script>

<template lang="pug">
.wrapper.flex.bg-white.min-h-screen
  // Sidebar handled globally via app.vue

  .main-content.flex.flex-col.items-center.justify-content-center.p-10.w-full

    // Progress display
    .question-progress.py-2.w-full.flex.justify-end.mb-4
      span.bg-customQuestionLightGray.p-3.text-lg.font-semibold.text-gray-700 {{ answeredQuestions }} / {{ questions.length }} questions

    // Containers
    .question-bg-gray.bg-customQuestionGray.p-8.w-full(style="height: 70vh;")
      .question-bg-white.bg-white.p-8.h-full.flex.flex-col.justify-self

        // Question Section
        .question-section.mb-6
            h2.text-xl.font-semibold.text-gray-800.mb-2 Question {{ currentIndex + 1 }}
            p.text-lg.text-gray-700 {{ currentQuestion.text }}

        // Multiple Choice Section
        .choices-section.mb-6
          .choice(
            v-for="(choice, index) in currentQuestion.choices"
            :key="index"
          )
            input(
              type="radio"
              :id="`choice-${currentQuestion.id}-${index}`"
              :value="choice"
              v-model="currentQuestion.selectedAnswer"
              class="mr-2"
              @change="handleAnswerSelection(choice)"
            )
            label(:for="`choice-${currentQuestion.id}-${index}`") {{ choice }}

        // Navigation Section (Previous, Next, Submit)
        .controls.flex.justify-between.items-center.mt-auto
            button(
            @click="prevQuestion"
            v-if="!isFirst"
            class="px-8 py-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all text-lg"
            ) Previous

            .flex.gap-4.ml-auto
                button(
                @click="nextQuestion"
                v-if="!isLast"
                class="px-8 py-4 bg-customBlue text-white rounded-lg hover:bg-blue-700 transition-all text-lg"
                ) Next

                router-link(
                to="coursehomepage"
                @click="submitQuestion"
                v-if="isLast"
                class="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-lg"
                ) Submit

</template>
