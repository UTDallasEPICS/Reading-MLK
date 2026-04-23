<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Student } from '~~/prisma/generated/client'
import { useCurrentStudent } from '~/composables/useCurrentStudent'

definePageMeta({ ssr: false })

const { setStudent, saveSettings } = useCurrentStudent()

// Applies a language preference saved to localStorage during the signup flow.
// This is needed because the Student record doesn't exist yet at signup time.
async function applySignupLanguageIfPresent() {
  if (!process.client) return
  const lang = localStorage.getItem('signupPreferredLanguage')
  if (!lang) return
  await saveSettings({ language: lang })
  localStorage.removeItem('signupPreferredLanguage')
}

const students = ref<Student[]>([])
const loadingStudents = ref(true)
const creating = ref(false)
const showCreateForm = ref(false)
const name = ref('')

const avatarChoices = ['🦊', '🐸', '🦋', '🐼', '🦁', '🐻', '🐯', '🐨']
const cardColors = [
  'from-orange-400 to-orange-500',
  'from-green-400 to-green-500',
  'from-purple-400 to-purple-500',
  'from-pink-400 to-pink-500',
  'from-blue-400 to-blue-500',
  'from-yellow-400 to-amber-500',
]

async function loadStudents() {
  loadingStudents.value = true

  try {
    const data = await $fetch<Student[]>('/api/student', {
      method: 'GET',
    })
    students.value = data
  } catch (error) {
    console.error('Failed to load students', error)
    students.value = []
  } finally {
    loadingStudents.value = false
  }
}

function getAvatar(index: number) {
  return avatarChoices[index % avatarChoices.length]
}

function getCardColor(index: number) {
  return cardColors[index % cardColors.length]
}

async function selectStudent(selectedStudent: Student) {
  setStudent(selectedStudent)
  // Apply any language preference captured at signup time
  await applySignupLanguageIfPresent()
  await navigateTo('/reader/home')
}

async function createStudent() {
  if (!name.value.trim()) return

  creating.value = true

  try {
    const newStudent = await $fetch<Student>('/api/student', {
      method: 'POST',
      body: {
        name: name.value.trim(),
      },
    })

    students.value.push(newStudent)
    setStudent(newStudent)
    // Apply any language preference captured at signup time
    await applySignupLanguageIfPresent()
    name.value = ''
    showCreateForm.value = false
    await navigateTo('/reader/home')
  } catch (error) {
    console.error('Failed to create student', error)
  } finally {
    creating.value = false
  }
}

const hasProfiles = computed(() => students.value.length > 0)

onMounted(() => {
  loadStudents()
})
</script>

<template>
  <div class="min-h-screen bg-[#f8f2ea] relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#f8e9df] via-[#f8f2ea] to-[#f6efe6]" />
    <div class="absolute inset-0 opacity-40 pointer-events-none">
      <div class="absolute top-20 left-20 w-40 h-40 bg-pink-100 rounded-full blur-3xl" />
      <div class="absolute bottom-16 right-20 w-52 h-52 bg-yellow-100 rounded-full blur-3xl" />
      <div class="absolute top-1/3 right-1/4 w-36 h-36 bg-orange-100 rounded-full blur-3xl" />
    </div>

    <div class="relative z-10 min-h-screen px-6 py-8">
      <main class="max-w-5xl mx-auto flex flex-col items-center text-center pt-8">
        <div class="text-5xl mb-4">👋</div>

        <h1 class="text-3xl sm:text-4xl font-black text-[#111827] mb-2">
          Who's Reading?
        </h1>

        <p class="text-sm sm:text-base font-black uppercase tracking-wider text-gray-400 mb-10">
          {{
            hasProfiles
              ? 'Select your profile to start your adventure!'
              : 'Create your first profile to start your adventure!'
          }}
        </p>

        <div v-if="loadingStudents" class="text-gray-500 text-base font-semibold">
          Loading profiles...
        </div>

        <template v-else>
          <div class="flex flex-wrap items-start justify-center gap-6 mb-8">
            <button
              v-for="(student, index) in students"
              :key="student.id"
              @click="selectStudent(student)"
              class="group flex flex-col items-center"
            >
              <div
                class="w-28 h-28 rounded-[2rem] bg-gradient-to-br shadow-lg flex items-center justify-center text-4xl transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
                :class="getCardColor(index)"
              >
                {{ getAvatar(index) }}
              </div>
              <span class="mt-3 text-xl font-black text-[#111827]">
                {{ student.name }}
              </span>
            </button>

            <button
              @click="showCreateForm = true"
              class="group flex flex-col items-center"
            >
              <div
                class="w-28 h-28 rounded-[2rem] border-4 border-dashed border-gray-200 bg-white/40 flex items-center justify-center text-5xl text-gray-400 transition-all duration-200 group-hover:bg-white/70 group-hover:border-gray-300 group-active:scale-95"
              >
                +
              </div>
              <span class="mt-3 text-xl font-black text-gray-300">
                Add New
              </span>
            </button>
          </div>

          <div
            v-if="showCreateForm || !hasProfiles"
            class="w-full max-w-lg bg-white/80 backdrop-blur rounded-[2rem] shadow-lg border border-white p-6"
          >
            <h2 class="text-2xl font-black text-[#111827] mb-5">
              {{ hasProfiles ? 'Add New Reader' : 'Create Child Profile' }}
            </h2>

            <input
              v-model="name"
              type="text"
              placeholder="Child name"
              class="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-lg text-gray-900 placeholder:text-gray-300 outline-none focus:border-[#7fb6ff]"
            />

            <div class="flex gap-3 mt-5">
              <button
                v-if="hasProfiles"
                @click="showCreateForm = false"
                class="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-base font-bold text-gray-500"
              >
                Cancel
              </button>

              <button
                @click="createStudent"
                :disabled="creating"
                class="flex-1 rounded-2xl bg-black px-5 py-3 text-base font-bold text-white disabled:opacity-50"
              >
                {{ creating ? 'Creating...' : 'Create Profile' }}
              </button>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>