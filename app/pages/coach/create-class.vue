<script setup lang="ts">
definePageMeta({
  ssr: false,
  layout: 'coach',
})

useHead({
  title: 'Create New Class',
})

const router = useRouter()

const form = reactive({
  name: '',
  type: 'Teacher',
  school: '',
  district: '',
  zipcode: '',
})

const isSubmitting = ref(false)
const submissionError = ref('')
const selectedClassToken = useCookie<string | null>('selected-class-token', {
  sameSite: 'lax',
})

const isTeacherClassroom = computed(() => form.type === 'Teacher')

watch(
  () => form.type,
  (newType) => {
    if (newType !== 'Teacher') {
      form.school = ''
      form.district = ''
      form.zipcode = ''
    }
  }
)

async function createClass() {
  submissionError.value = ''
  isSubmitting.value = true

  try {
    const classroom = await $fetch<{ joinToken: string; name: string }>('/api/admin/classes', {
      method: 'POST',
      body: form,
    })

    selectedClassToken.value = classroom.joinToken
    await refreshNuxtData('admin-classes')
    await router.push({
      path: '/coach',
      query: { class: classroom.joinToken },
    })
  } catch (error) {
    submissionError.value =
      error instanceof Error ? error.message : 'The class could not be created. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function cancel() {
  router.push('/admin')
}
</script>

<template>
  <div class="create-class-page">
    <section class="page-heading">
      <h2>Create New Class</h2>
    </section>

    <section class="form-card">
      <div class="form-introduction">
        <h3>Class Information</h3>
      </div>

      <form class="class-form" @submit.prevent="createClass">
        <div class="form-grid">
          <label class="field field-wide">
            <span>Class name</span>

            <input v-model="form.name" type="text" placeholder="Enter a class name" required />
          </label>

          <label class="field">
            <span>Class type</span>

            <select v-model="form.type">
              <option value="Teacher">Teacher Classroom</option>

              <option value="Study Group">Study Group</option>

              <option value="Community Group">Community Group</option>

              <option value="Other">Other</option>
            </select>
          </label>

          <template v-if="isTeacherClassroom">
            <label class="field">
              <span>School</span>

              <input
                v-model="form.school"
                type="text"
                placeholder="Enter a school or organization"
                required
              />
            </label>

            <label class="field">
              <span>School district</span>

              <input
                v-model="form.district"
                type="text"
                placeholder="Enter a school district"
                required
              />
            </label>

            <label class="field">
              <span>ZIP code</span>

              <input
                v-model="form.zipcode"
                type="text"
                inputmode="numeric"
                maxlength="10"
                placeholder="Enter a ZIP code"
                required
              />
            </label>
          </template>
        </div>

        <div v-if="submissionError" class="error-message" role="alert">
          {{ submissionError }}
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" @click="cancel">Cancel</button>

          <button type="submit" class="create-button" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating…' : 'Create Class' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped src="./create-class.css"></style>
