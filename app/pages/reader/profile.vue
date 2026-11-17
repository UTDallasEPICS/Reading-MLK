<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import type { Student } from '~~/prisma/generated/client'
  import { useCurrentStudent } from '~/composables/useCurrentStudent'
  import { isPetType, petNames, petTypes, type PetType } from '~~/shared/pet'

  definePageMeta({ ssr: false })

  const { setStudent, saveSettings } = useCurrentStudent()

  const students = ref<Student[]>([])
  const loadingStudents = ref(true)
  const creating = ref(false)
  const showCreateForm = ref(false)
  const name = ref('')
  const selectedPet = ref<PetType>('kangaroo')
  //Language preference for new student
  const newStudentLanguage = ref<'en' | 'es'>('en')

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

  function getCardColor(index: number) {
    return cardColors[index % cardColors.length]
  }

  function getStudentPet(selectedStudent: Student): PetType {
    const settings = selectedStudent.settings as { pet?: { type?: unknown } } | null
    return isPetType(settings?.pet?.type) ? settings.pet.type : 'cat'
  }

  async function selectStudent(selectedStudent: Student) {
    setStudent(selectedStudent)
    await navigateTo('/reader')
  }

  async function createStudent() {
    if (!name.value.trim()) return

    creating.value = true

    try {
      const newStudent = await $fetch<Student>('/api/student', {
        method: 'POST',
        body: {
          name: name.value.trim(),
          petType: selectedPet.value,
        },
      })

      students.value.push(newStudent)
      setStudent(newStudent)
      //Save chosen language
      await saveSettings({ language: newStudentLanguage.value })
      name.value = ''
      newStudentLanguage.value = 'en'
      selectedPet.value = 'kangaroo'
      showCreateForm.value = false
      await navigateTo('/reader')
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
  <div class="relative min-h-screen overflow-hidden bg-[#f8f2ea]">
    <div class="absolute inset-0 bg-gradient-to-b from-[#f8e9df] via-[#f8f2ea] to-[#f6efe6]" />
    <div class="pointer-events-none absolute inset-0 opacity-40">
      <div class="absolute top-20 left-20 h-40 w-40 rounded-full bg-pink-100 blur-3xl" />
      <div class="absolute right-20 bottom-16 h-52 w-52 rounded-full bg-yellow-100 blur-3xl" />
      <div class="absolute top-1/3 right-1/4 h-36 w-36 rounded-full bg-orange-100 blur-3xl" />
    </div>

    <div class="relative z-10 min-h-screen px-6 py-8">
      <main class="mx-auto flex max-w-5xl flex-col items-center pt-8 text-center">
        <h1 class="mb-2 text-3xl font-black text-[#111827] sm:text-4xl">Who's Reading?</h1>

        <p class="mb-10 text-sm font-black tracking-wider text-gray-400 uppercase sm:text-base">
          {{
            hasProfiles
              ? 'Select your profile to start your adventure!'
              : 'Create your first profile to start your adventure!'
          }}
        </p>

        <div v-if="loadingStudents" class="text-base font-semibold text-gray-500">
          Loading profiles...
        </div>

        <template v-else>
          <div class="mb-8 flex flex-wrap items-start justify-center gap-6">
            <button
              v-for="(student, index) in students"
              :key="student.id"
              @click="selectStudent(student)"
              class="group flex flex-col items-center"
            >
              <div
                class="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br p-2 shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
                :class="getCardColor(index)"
              >
                <PetSprite
                  :type="getStudentPet(student)"
                  :stage="0"
                  :alt="`${student.name}'s ${petNames[getStudentPet(student)]}`"
                />
              </div>
              <span class="mt-3 text-xl font-black text-[#111827]">
                {{ student.name }}
              </span>
            </button>

            <button @click="showCreateForm = true" class="group flex flex-col items-center">
              <div
                class="flex h-28 w-28 items-center justify-center rounded-[2rem] border-4 border-dashed border-gray-200 bg-white/40 text-5xl text-gray-400 transition-all duration-200 group-hover:border-gray-300 group-hover:bg-white/70 group-active:scale-95"
              >
                +
              </div>
              <span class="mt-3 text-xl font-black text-gray-300"> Add New </span>
            </button>
          </div>

          <div
            v-if="showCreateForm || !hasProfiles"
            class="w-full max-w-4xl rounded-[2rem] border border-white bg-white/80 p-6 shadow-lg backdrop-blur sm:p-8"
          >
            <h2 class="mb-5 text-2xl font-black text-[#111827]">
              {{ hasProfiles ? 'Add New Reader' : 'Create Child Profile' }}
            </h2>

            <div class="grid items-stretch gap-8 md:grid-cols-[1fr_20rem]">
              <div class="text-left">
                <input
                  v-model="name"
                  type="text"
                  placeholder="Child name"
                  class="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-lg text-gray-900 outline-none placeholder:text-gray-300 focus:border-[#7fb6ff]"
                />

                <div class="mt-5 space-y-2">
                  <p class="text-sm font-bold tracking-widest text-gray-400 uppercase">
                    Choose a progress pet
                  </p>
                  <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <button
                      v-for="petType in petTypes"
                      :key="petType"
                      type="button"
                      @click="selectedPet = petType"
                      class="rounded-xl border-2 bg-white px-4 py-3 text-sm font-black transition-all"
                      :class="
                        selectedPet === petType
                          ? 'border-[#6b6ee8] bg-[#eef0fb] text-[#6b6ee8] shadow-md'
                          : 'border-gray-200 text-gray-500 hover:border-[#6b6ee8]/50'
                      "
                      :aria-pressed="selectedPet === petType"
                    >
                      {{ petNames[petType] }}
                    </button>
                  </div>
                </div>

                <!--Language preferance selection-->
                <div class="mt-5 space-y-2">
                  <p class="text-sm font-bold tracking-widest text-gray-400 uppercase">
                    Language / Idioma
                  </p>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      @click="newStudentLanguage = 'en'"
                      :class="[
                        'flex h-12 items-center justify-center gap-2 rounded-2xl border-2 text-base font-bold transition-all',
                        newStudentLanguage === 'en'
                          ? 'border-[#6b6ee8] bg-[#eef0fb] text-[#6b6ee8] shadow-md'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-[#6b6ee8]/50',
                      ]"
                    >
                      <span class="text-lg">🇺🇸</span> English
                    </button>
                    <button
                      type="button"
                      @click="newStudentLanguage = 'es'"
                      :class="[
                        'flex h-12 items-center justify-center gap-2 rounded-2xl border-2 text-base font-bold transition-all',
                        newStudentLanguage === 'es'
                          ? 'border-[#6b6ee8] bg-[#eef0fb] text-[#6b6ee8] shadow-md'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-[#6b6ee8]/50',
                      ]"
                    >
                      <span class="text-lg">🇪🇸</span> Español
                    </button>
                  </div>
                </div>

                <div class="mt-6 flex gap-3">
                  <button
                    v-if="hasProfiles"
                    @click="showCreateForm = false"
                    class="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-base font-bold text-gray-500"
                  >
                    Cancel
                  </button>

                  <button
                    @click="createStudent"
                    :disabled="creating || !name.trim()"
                    class="flex-1 rounded-2xl bg-black px-5 py-3 text-base font-bold text-white disabled:opacity-50"
                  >
                    {{ creating ? 'Creating...' : 'Create Profile' }}
                  </button>
                </div>
              </div>

              <div
                class="order-first flex min-h-72 flex-col items-center justify-end overflow-hidden rounded-[2rem] bg-gradient-to-b from-indigo-50 via-amber-50 to-orange-100 p-4 md:order-none"
              >
                <div class="h-64 w-full">
                  <PetSprite
                    :type="selectedPet"
                    :stage="0"
                    :alt="`Baby ${petNames[selectedPet]}`"
                  />
                </div>
                <p class="mt-1 text-lg font-black text-[#111827]">
                  Baby {{ petNames[selectedPet] }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>
