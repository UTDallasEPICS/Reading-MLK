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
  description: '',
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
  },
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
    await refreshNuxtData()
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
  router.push('/coach')
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

      <form
        class="class-form"
        @submit.prevent="createClass"
      >
        <div class="form-grid">
          <label class="field field-wide">
            <span>Class name</span>

            <input
              v-model="form.name"
              type="text"
              placeholder="Enter a class name"
              required
            >
          </label>

          <label class="field">
            <span>Class type</span>

            <select v-model="form.type">
              <option value="Teacher">
                Teacher Classroom
              </option>

              <option value="Study Group">
                Study Group
              </option>

              <option value="Community Group">
                Community Group
              </option>

              <option value="Other">
                Other
              </option>
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
              >
            </label>

            <label class="field">
              <span>School district</span>

              <input
                v-model="form.district"
                type="text"
                placeholder="Enter a school district"
                required
              >
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
              >
            </label>
          </template>

          <label class="field field-wide">
            <span>Description</span>

            <textarea
              v-model="form.description"
              rows="5"
              placeholder="Briefly describe the class or group."
            />
          </label>
        </div>

        <div
          v-if="submissionError"
          class="error-message"
          role="alert"
        >
          {{ submissionError }}
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="cancel-button"
            @click="cancel"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="create-button"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Creating…' : 'Create Class' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.create-class-page {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-heading {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.page-heading h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.form-card {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgb(15 23 42 / 6%);
}

.form-introduction {
  padding: 1rem 1.25rem;
  background: #f1f5f9;
  border-bottom: 1px solid #dbe3ec;
}

.form-introduction h3 {
  margin: 0;
  color: #1e293b;
  font-size: 0.95rem;
}

.class-form {
  min-height: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  padding: 1.15rem 1.25rem;
  background: #f8fafc;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.4rem;
}

.field-wide {
  grid-column: 1 / -1;
}

.field span {
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.68rem 0.75rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  color: #1e293b;
  font: inherit;
  font-size: 0.78rem;
}

.field textarea {
  min-height: 7rem;
  resize: none;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #94a3b8;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 3px rgb(79 70 229 / 10%);
}

.error-message {
  padding: 0.65rem 0.75rem;
  margin-top: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #b91c1c;
  font-size: 0.72rem;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding-top: 1rem;
  margin-top: auto;
  border-top: 1px solid #dbe3ec;
}

.cancel-button,
.create-button {
  padding: 0.62rem 0.95rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
}

.cancel-button {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.create-button {
  background: #4f46e5;
  border: 1px solid #4f46e5;
  color: #ffffff;
}

.cancel-button:hover {
  background: #eef2f7;
}

.create-button:hover {
  background: #4338ca;
  border-color: #4338ca;
}

@media (max-width: 900px) {
  .create-class-page {
    height: auto;
    overflow: visible;
  }

  .form-card {
    height: auto;
  }

  .class-form {
    height: auto;
  }
}

@media (max-width: 650px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .field-wide {
    grid-column: auto;
  }
}
</style>
