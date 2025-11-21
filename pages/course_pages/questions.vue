<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  coursePage: true
})

const questions = ref([])

// Example questions
/*const questions = ref([
  { id: 1, text: '[Question 1 here]' },
  { id: 2, text: '[Question 2 here]' },
  { id: 3, text: '[Question 3 here]' }
])*/

const currentIndex = ref(0)
const studentId = ref(Number(route.params.studentId)) //pull studentId from URL params
const quizId = ref(Number(route.params.quizId)) //pull quizId from URL params
const isLoading = ref(true)
const error = ref('')
onMounted(async () => {
  await loadQuestions()
})



async function loadQuestions() {
  try {
    isLoading.value = true
    error.value = ''

    //fetch questions from API 
    const response = await $fetch(`/api/quiz/questions`, {
      method: 'GET',
      params: { quizId: quizId.value } 
    })
    questions.value = response
    //initialize userAnswers array if empty
    if(userAnswers.value.length === 0) {
      userAnswers.value = Array(questions.value.length).fill('') 
    }
    //if there are existing answers, load them (may need another async function)
    try {
      //NOTE: Adjust the endpoint as necessary based on your API design
      const loadExistingAnswers = await $fetch(`/api/quiz/responses`, {
        method: 'GET',
        params: { 
          quiz_id: quizId.value,
          student_profile_id: studentId.value
        }
      })
      //fetching based off array
      /*loadExistingAnswers.forEach(answer => {
        const questionIndex = questions.value.findIndex(q => q.id === answer.questionId)
        if (questionIndex !== -1) {
          userAnswers.value[questionIndex] = answer.responseText
        }
      })*/
      //pulling responses based off a response object (done in responses.get.ts)
      if(loadExistingAnswers && loadExistingAnswers.FRAnswer) {
        loadExistingAnswers.FRAnswer.forEach(answer => {
          const questionIndex = questions.value.findIndex(q => q.id === answer.questionId)
          if (questionIndex !== -1) {
            userAnswers.value[questionIndex] = answer.responseText
          }
        })
      }
      //MCQ portion 
      if(loadExistingAnswers && loadExistingAnswers.MCAnswer) {
        loadExistingAnswers.MCAnswer.forEach(answer => {
          const questionIndex = questions.value.findIndex(q => q.id === answer.questionId)
          if (questionIndex !== -1) {
            userAnswers.value[questionIndex] = answer.selectedOption
          }
        })
      }
    }
    catch (error) {
      console.error('Error loading existing answers:', error)
      error.value = 'Failed to load existing answers.'
    }
  }
  catch (error) {
    console.error('Error loading quiz:', error)
    error.value = 'Failed to load quiz. Please try again later.'
  }
  finally{
    isLoading.value = false
  }
}

//Save answers to the database
async function saveAnswer(questionIndex){
  try { 
    const answer = userAnswers.value[questionIndex]
    const questionId = questions.value[questionIndex].id
    
    //check if it is a student
    if(!studentId.value){
      console.error('Student ID is missing. Cannot save answer.')
      error.value = 'Student ID is missing. Cannot save answer.'
      return
    }

    //send answer to API 
    await $fetch(`/api/quiz/answers`, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'}, 
      body: {
        quizId: quizId.value,
        questionId: questionId,
        responseText: answer,
        studentProfileId: studentId.value
      }
    })
  }
  catch (error) {
    console.error('Error saving answer:', error)
    error.value = 'Failed to save answer. Please try again.'
  }
}

//submit answers to the database
async function submitAnswers(){
  try {
    await saveAnswer(currentIndex.value) //save answer before submission
    //send all answers to API(NOTE: quizId may need to be adjusted based on the name used)
    await $fetch(`/api/quiz/submit`, { 
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: {
          quizId: quizId.value,
          studentProfileId: studentId.value,
        }
    })
    //redirect to course homepage after submission
    await navigateTo('/course_pages/coursehomepage') 
  } 
  catch (error) {
    console.error('Error submitting answers:', error)
    error.value = 'Failed to submit quiz. Try again.'
  }
}

const currentQuestion = computed(() => questions.value[currentIndex.value])
const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value === questions.value.length - 1)

//const userAnswers = ref(Array(questions.value.length).fill('')); // Initialize an array to store answers for each question
const userAnswers = ref([]); // Initialize an array to store answers for each question

const answeredQuestions = computed(() => {
  return userAnswers.value.filter((answer) => answer.trim() !== '').length;
});

async function nextQuestion() {
  if (!isLast.value) { 
    //save the answer before going to the next question
    await saveAnswer(currentIndex.value) 
    currentIndex.value++
  }
}

async function prevQuestion() {
  if (!isFirst.value) { 
    //save the answer before going to the previous question
    await saveAnswer(currentIndex.value)
    currentIndex.value--
  }
}

function submitQuestion() {
  alert('Answers submitted!')
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

        // Free Response Section
        .response-section.mb-6
            textarea#response(
              v-model="userAnswers[currentIndex]"
              class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Type your answer here..."
            )

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
