<script setup lang="ts">
definePageMeta({ ssr: false })

const form = reactive({
  purpose: '',
  school: '',
  district: '',
  zipcode: '',
})
const isSubmitting = ref(false)
const submissionError = ref('')
const isTeacher = computed(() => form.purpose === 'teacher')

async function submit() {
  submissionError.value = ''
  isSubmitting.value = true

  try {
    await $fetch('/api/coach/profile', {
      method: 'POST',
      body: form,
    })
    await navigateTo('/coach')
  } catch (error: any) {
    submissionError.value = error?.data?.statusMessage || 'Your coach account could not be set up.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="onboarding-page">
    <section class="onboarding-card">
      <p class="eyebrow">Reading Coach Setup</p>
      <h1>What is the purpose of your account?</h1>

      <form @submit.prevent="submit">
        <div class="purpose-options">
          <label :class="{ selected: form.purpose === 'teacher' }">
            <input v-model="form.purpose" type="radio" value="teacher" required>
            <strong>Teacher</strong>
          </label>

          <label :class="{ selected: form.purpose === 'studygroup' }">
            <input v-model="form.purpose" type="radio" value="studygroup" required>
            <strong>Study Group</strong>
          </label>

          <label :class="{ selected: form.purpose === 'other' }">
            <input v-model="form.purpose" type="radio" value="other" required>
            <strong>Other</strong>
          </label>
        </div>

        <div v-if="isTeacher" class="teacher-fields">
          <p>Your information will be sent to an administrator for teacher verification.</p>

          <label>
            <span>School</span>
            <input v-model="form.school" required maxlength="160" placeholder="School name">
          </label>

          <label>
            <span>School district</span>
            <input v-model="form.district" required maxlength="160" placeholder="District name">
          </label>

          <label>
            <span>ZIP code</span>
            <input v-model="form.zipcode" required inputmode="numeric" maxlength="10" pattern="\d{5}(-\d{4})?" placeholder="12345">
          </label>
        </div>

        <p v-if="submissionError" class="error-message" role="alert">{{ submissionError }}</p>

        <button type="submit" :disabled="isSubmitting || !form.purpose">
          {{ isSubmitting ? 'Saving...' : 'Continue' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.onboarding-page { min-height:100vh; display:grid; place-items:center; padding:2rem; background:linear-gradient(135deg, #faefe5, #f7eee6 55%, #fff4da); color:#172033; }
.onboarding-card { width:min(48rem, 100%); padding:2.75rem; background:#fff; border-top:7px solid #f0a446; border-radius:1.5rem; box-shadow:0 20px 60px rgb(80 60 40 / 14%); }
.eyebrow { margin:0 0 .5rem; color:#5b5fe8; font-size:.75rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
h1 { margin:0; font-size:2.25rem; line-height:1.15; }
.purpose-options { display:grid; grid-template-columns:repeat(3, 1fr); gap:.85rem; margin-top:2rem; }
.purpose-options label { position:relative; display:grid; min-height:4.5rem; place-items:center; padding:1rem; border:2px solid #d9dcf8; border-radius:1rem; background:#fff; cursor:pointer; transition:border-color .15s, background .15s, transform .15s; }
.purpose-options label:hover { border-color:#f0a446; transform:translateY(-2px); }
.purpose-options label.selected { border-color:#5b5fe8; background:#eef0ff; color:#393dc4; }
.purpose-options input { position:absolute; width:1px; height:1px; opacity:0; }
.teacher-fields { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1.25rem; }
.teacher-fields p { grid-column:1 / -1; margin:0; padding:.85rem 1rem; border:1px solid #fde68a; border-radius:.75rem; background:#fffbeb; color:#92400e; }
.teacher-fields label { display:flex; flex-direction:column; gap:.4rem; font-weight:700; }
.teacher-fields label:last-child { grid-column:1 / -1; }
.teacher-fields input { padding:.8rem .9rem; border:1px solid #cbd5e1; border-radius:.7rem; font:inherit; outline:none; }
.teacher-fields input:focus { border-color:#5b5fe8; box-shadow:0 0 0 3px rgb(91 95 232 / 12%); }
.error-message { color:#b91c1c; font-weight:600; }
button { width:100%; margin-top:1.5rem; padding:.95rem; border:0; border-radius:.75rem; background:linear-gradient(90deg, #5b5fe8, #7867dd 55%, #f0a446); color:#fff; font:inherit; font-weight:800; cursor:pointer; box-shadow:0 10px 24px rgb(91 95 232 / 22%); }
button:disabled { opacity:.7; cursor:not-allowed; }
@media (max-width:640px) { .onboarding-card { padding:1.5rem; } .purpose-options, .teacher-fields { grid-template-columns:1fr; } .teacher-fields label:last-child { grid-column:auto; } }
</style>
