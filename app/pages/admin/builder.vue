<script setup lang="ts">
definePageMeta({ ssr: false, layout: "admin" })

const builderSectionRef = ref<HTMLElement | null>(null)

const {
  builderSubTab, formTitle, editingFormId, questions,
  formWeekStart, formDays, historyWeekStart, historyStatusSelection, historyGroupStartDate, historyGroupEndDate, toggleHistoryStatus, getLastMonday,
  getCalculatedDate, formatDate, defaultQuestions,
  filteredPublishedForms, selectedFormDetails, viewFormDetails, formPublishDialog, closeFormPublishDialog,
  draggedIdx, dragStart, onDrop,
  addQuestion, publishForm, saveDraftForm, editPublishedForm, toggleFormPublish, loadPublishedForms,
} = useAdmin()

const previewDates = computed(() => {
  if (!formDays.value.length) return []
  const weekStart = getLastMonday(formWeekStart.value || '')
  if (!weekStart) return []
  return formDays.value.map(day => `${day}: ${getCalculatedDate(weekStart, day)}`)
})

const questionTypeLabel = (type: string) => {
  if (type === 'text') return 'Discussion'
  if (type === 'mcq') return 'Multiple Choice'
  if (type === 'video') return 'Video'
  if (type === 'context') return 'Context'
  return type
}

const isPointerDown = ref(false)
const dragMode = ref<'add' | 'remove' | null>(null)
const visitedInThisDrag = ref<Set<string>>(new Set())

const addDay = (day: string) => {
  if (!formDays.value.includes(day)) formDays.value.push(day)
}

const removeDay = (day: string) => {
  if (formDays.value.includes(day)) {
    formDays.value = formDays.value.filter((d: string) => d !== day)
  }
}

const toggleDaySingle = (day: string) => {
  if (formDays.value.includes(day)) removeDay(day)
  else addDay(day)
}

const applyDayByMode = (day: string) => {
  if (dragMode.value === 'add') addDay(day)
  if (dragMode.value === 'remove') removeDay(day)
}

const startDayDrag = (day: string) => {
  isPointerDown.value = true
  dragMode.value = formDays.value.includes(day) ? 'remove' : 'add'
  visitedInThisDrag.value.clear()
  applyDayByMode(day)
  visitedInThisDrag.value.add(day)
}

const continueDayDrag = (day: string) => {
  if (!isPointerDown.value || !dragMode.value) return
  if (visitedInThisDrag.value.has(day)) return
  applyDayByMode(day)
  visitedInThisDrag.value.add(day)
}

const endDayDrag = () => {
  isPointerDown.value = false
  dragMode.value = null
  visitedInThisDrag.value.clear()
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

const handleBuilderEnter = (event: KeyboardEvent) => {
  const currentTarget = event.target as HTMLElement | null

  if (!currentTarget || !builderSectionRef.value) {
    return
  }

  const focusables = Array.from(
    builderSectionRef.value.querySelectorAll<HTMLElement>('[data-builder-field="true"]')
  )
  const currentIndex = focusables.indexOf(currentTarget)

  if (currentIndex === -1) {
    return
  }

  const nextField = focusables[currentIndex + 1]

  if (nextField) {
    nextField.focus()
    if ('select' in nextField && typeof nextField.select === 'function') {
      nextField.select()
    }
    return
  }

  publishForm()
}

onMounted(() => {
  loadPublishedForms()
  window.addEventListener('pointerup', endDayDrag)
  window.addEventListener('pointercancel', endDayDrag)
  window.addEventListener('blur', endDayDrag)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerup', endDayDrag)
  window.removeEventListener('pointercancel', endDayDrag)
  window.removeEventListener('blur', endDayDrag)
})


</script>

<template>
  <div class="builder-wrap">

    <!-- Publish success dialog -->
    <Transition name="fade">
      <div v-if="formPublishDialog.visible" class="publish-dialog-backdrop">
        <div class="publish-dialog-overlay" @click="closeFormPublishDialog" />
        <div class="publish-dialog-box" role="dialog" aria-modal="true" aria-label="Form published">
          <div class="publish-dialog-icon-wrap">
            <span class="publish-dialog-icon">✓</span>
          </div>
          <h3 class="publish-dialog-title">{{ formPublishDialog.title }}</h3>
          <p class="publish-dialog-message">{{ formPublishDialog.message }}</p>
          <p v-if="formPublishDialog.days.length" class="publish-dialog-days">
            {{ formPublishDialog.days.join(' • ') }}
          </p>
          <button class="btn-indigo publish-dialog-btn" @click="closeFormPublishDialog">
            Continue
          </button>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════ -->
    <!--  FORM DETAILS MODAL                        -->
    <!-- ══════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="selectedFormDetails" class="modal-backdrop">
        <div class="modal-overlay" @click="selectedFormDetails = null" />
        <div class="modal-box">

          <div class="modal-header">
            <div>
              <h3 class="modal-title">{{ selectedFormDetails.title }}</h3>
              <p class="modal-meta">{{ selectedFormDetails.day }} · {{ selectedFormDetails.date }}</p>
            </div>
            <button class="modal-close" @click="selectedFormDetails = null">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div v-for="(q, idx) in selectedFormDetails.questions" :key="q.id" class="modal-step">
              <span class="step-badge">Step {{ Number(idx) + 1 }} · {{ q.type }}</span>
              <p class="step-text">{{ q.text }}</p>
              <p v-if="q.textEs" class="step-text-es">{{ q.textEs }}</p>
              <div v-if="q.reference" class="step-ref">
                <p class="step-ref-label">Answer / Reference</p>
                <p class="step-ref-val">{{ q.reference }}</p>
              </div>
              <div v-if="q.choices" class="step-choices">
                <div v-for="c in q.choices" :key="c.text"
                  class="step-choice"
                  :class="c.correct ? 'correct' : ''">{{ c.text }}</div>
              </div>
              <div v-if="q.url" class="step-url">
                <p class="step-ref-label">Video URL</p>
                <code class="step-code">{{ q.url }}</code>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-dark" @click="selectedFormDetails = null">Close Details</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════ -->
    <!--  CREATION SUB-TAB                          -->
    <!-- ══════════════════════════════════════════ -->
    <div v-if="builderSubTab === 'creation'" ref="builderSectionRef" class="creation-wrap">

      <!-- Top bar -->
      <div class="history-header">
        <h3 class="history-title">{{ editingFormId ? 'Editing Form' : 'Build New Form' }}</h3>
        <button class="btn-indigo" @click="builderSubTab = 'history';">
          {{ "Forms History" }}
          </button>
      </div>

      <div class="creation-content">
        <div class="creation-main">
      <!-- Week & Day card -->
      <div class="section-card">

        <!-- Week row -->
        <div class="week-row">
          <div>
            <p class="field-hint">Selected Week</p>
            <h4 class="week-label">{{ formWeekStart ? 'Week of ' + getLastMonday(formWeekStart) : 'Select a week' }}</h4>
          </div>
          <div>
            <label class="field-label">Change Week Starting (Mon)</label>
            <input v-model="formWeekStart" type="date" class="input-base" data-builder-field="true"  @keydown.enter.prevent="handleBuilderEnter" />
          </div>
        </div>

        <!-- Day multi-select -->
        <div>
          <label class="field-label">Day(s) of Week (Multi-select)</label>
          <div class="day-pills">
            <button
              v-for="day in ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']"
              :key="day"
              class="day-pill"
              :class="formDays.includes(day) ? 'active' : ''"
              @pointerdown.prevent="startDayDrag(day)"
              @pointerenter="continueDayDrag(day)"
              @keydown.enter.prevent="toggleDaySingle(day)"
              @keydown.space.prevent="toggleDaySingle(day)"
            >{{ day }}</button>
          </div>
          <p class="field-note">* Selecting multiple days will publish a copy of this form for each selected day.</p>
        </div>

        <!-- Title + preview date -->
        <div class="title-row">
          <div class="flex-grow">
            <label class="field-label">Form Title</label>
            <input v-model="formTitle" type="text" placeholder="e.g. Kindness & Math Challenge" class="input-title" data-builder-field="true" @keydown.enter.prevent="handleBuilderEnter" />
          </div>
          <div class="preview-date-box">
            <span class="field-hint">Preview Date</span>
            <span v-if="previewDates.length === 0" class="preview-date-val">Select a day</span>
            <div v-else class="preview-date-list">
              <span v-for="item in previewDates" :key="item" class="preview-date-val">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add question buttons -->
      <div class="q-type-btns">
        <button @click="addQuestion('text')"    class="q-type-btn blue">+ Discussion</button>
        <button @click="addQuestion('mcq')"     class="q-type-btn green">+ Multiple Choice</button>
        <button @click="addQuestion('video')"   class="q-type-btn red">+ Video Embed</button>
        <button @click="addQuestion('context')" class="q-type-btn gray">+ Context Block</button>
      </div>

      <!-- Question list -->
      <div class="q-list">
        <div v-if="questions.length === 0" class="q-empty">No questions yet. Add one above!</div>

        <div
          v-for="(q, index) in questions"
          :key="q.id"
          class="q-card"
        >
          <button class="q-remove" @click.stop="questions.splice(index, 1)">✕</button>

          <!-- Type badge -->
          <span class="q-badge ml-6 mb-4 inline-block"
            :class="{
              'blue':  q.type === 'text',
              'green': q.type === 'mcq',
              'red':   q.type === 'video',
              'gray':  q.type === 'context',
            }">
            {{ q.type === 'text' ? 'Discussion' : q.type === 'mcq' ? 'Multiple Choice' : q.type === 'video' ? 'Video' : 'Context' }}
          </span>

          <div class="ml-6 space-y-4">
            <!-- Text / MCQ fields -->
            <div v-if="['text','mcq'].includes(q.type)">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="field-label">Question (English)</label>
                  <input v-model="q.text" type="text" placeholder="Enter question in English..." class="input-field" data-builder-field="true" @keydown.enter.prevent="handleBuilderEnter" />
                </div>
                <div>
                  <label class="field-label">Question (Spanish)</label>
                  <input v-model="q.textEs" type="text" placeholder="Ingrese pregunta en Español..." class="input-field" data-builder-field="true" @keydown.enter.prevent="handleBuilderEnter" />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="field-label">Reference (English)</label>
                  <textarea v-model="q.reference" rows="2" placeholder="Correct answer..." class="textarea-field" data-builder-field="true" @keydown.enter.prevent="handleBuilderEnter" />
                </div>
                <div>
                  <label class="field-label">Reference (Spanish)</label>
                  <textarea v-model="q.referenceEs" rows="2" placeholder="Respuesta correcta..." class="textarea-field" data-builder-field="true" @keydown.enter.prevent="handleBuilderEnter" />
                </div>
              </div>
            </div>

            <!-- MCQ Choices -->
            <div v-if="q.type === 'mcq'" class="space-y-3">
              <label class="field-label">Answer Choices</label>
              <div v-for="(choice, ci) in q.choices" :key="ci" class="flex items-center gap-3">
                <span class="choice-letter" :class="choice.correct ? 'correct' : ''">
                  {{ String.fromCharCode(65 + Number(ci)) }}
                </span>
                <input v-model="choice.text" type="text" :placeholder="'Choice ' + String.fromCharCode(65 + Number(ci)) + '...'" class="input-field flex-grow" data-builder-field="true" @keydown.enter.prevent="handleBuilderEnter" />
                <button
                  class="btn-correct"
                  :class="choice.correct ? 'active' : ''"
                  @click="q.choices.forEach((c: any) => c.correct = false); choice.correct = true"
                >{{ choice.correct ? '✓ Correct' : 'Set Correct' }}</button>
                <button class="q-remove-inline" @click="q.choices.splice(ci, 1)">✕</button>
              </div>
              <button class="btn-add-choice" @click="q.choices.push({ text: '', correct: false })">+ Add Choice</button>
            </div>

            <!-- Video URL -->
            <div v-if="q.type === 'video'">
              <label class="field-label">YouTube URL</label>
              <input v-model="q.url" type="text" placeholder="https://youtu.be/..." class="input-field" data-builder-field="true" @keydown.enter.prevent="handleBuilderEnter" />
            </div>

            <!-- Context block -->
            <div v-if="q.type === 'context'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="field-label">Context (English)</label>
                <textarea v-model="q.text" rows="3" placeholder="Read this paragraph first..." class="textarea-field" data-builder-field="true" @keydown.enter.prevent="handleBuilderEnter" />
              </div>
              <div>
                <label class="field-label">Context (Spanish)</label>
                <textarea v-model="q.textEs" rows="3" placeholder="Lea este párrafo primero..." class="textarea-field" data-builder-field="true" @keydown.enter.prevent="handleBuilderEnter" />
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>

        <aside class="preview-panel">
          <h4 class="preview-title">Form Structure Preview</h4>
          <p class="preview-subtitle">Drag items here to reorder questions in the form.</p>

          <button
            v-if="editingFormId"
            class="btn-ghost preview-cancel-btn"
            @click="editingFormId = null; formTitle = ''; formDays = ['Monday']; questions = defaultQuestions(); builderSubTab = 'history'"
          >Cancel</button>
          <button
            v-else
            class="btn-ghost preview-cancel-btn"
            @click="formTitle = ''; formDays = ['Monday']; questions = defaultQuestions(); builderSubTab = 'history'"
          >Discard</button>
          <button class="btn-indigo preview-cancel-btn" @click="publishForm">
            {{ editingFormId ? 'Update Form' : 'Publish Form' }}
          </button>
          <button class="btn-ghost preview-cancel-btn" @click="saveDraftForm">
            {{ editingFormId ? 'Save As Draft' : 'Save Draft' }}
          </button>

          <div class="preview-list">
            <div v-if="questions.length === 0" class="preview-empty">No questions to preview yet.</div>

            <div
              v-for="(q, index) in questions"
              :key="`preview-${q.id}`"
              class="preview-item"
              draggable="true"
              @dragstart="dragStart($event, index)"
              @dragover.prevent
              @drop="onDrop($event, index)"
            >
              <div class="preview-item-content">
                <span class="preview-index">Question {{ Number(index) + 1 }}</span>
                <span class="preview-type">{{ questionTypeLabel(q.type) }}</span>
              </div>
              <button class="preview-item-delete" @click.stop="removeQuestion(index)">✕</button>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!--  HISTORY SUB-TAB                           -->
    <!-- ══════════════════════════════════════════ -->
    <div v-if="builderSubTab === 'history'" class="history-wrap">

      <div class="history-header">
        <h3 class="history-title">Forms History</h3>
        <button
          class="btn-indigo"
          @click="builderSubTab = 'creation'; editingFormId = null; formTitle = ''; questions = defaultQuestions()"
        >+ Create New Form</button>
      </div>

      <!-- Filters -->
      <div class="section-card">
        <div class="history-filters-grid">
          <div>
            <label class="field-label">Weekly Date (Find Matching Form Group)</label>
            <input v-model="historyWeekStart" type="date" class="input-base" />
          </div>

          <div>
            <label class="field-label">Status</label>
            <div class="status-filter-btns">
              <button
                class="status-filter-btn"
                :class="historyStatusSelection.includes('published') ? 'active' : ''"
                @click="toggleHistoryStatus('published')"
              >Published</button>
              <button
                class="status-filter-btn"
                :class="historyStatusSelection.includes('unpublished') ? 'active' : ''"
                @click="toggleHistoryStatus('unpublished')"
              >Unpublished</button>
            </div>
          </div>

          <div>
            <label class="field-label">Form Group Start (From)</label>
            <input v-model="historyGroupStartDate" type="date" class="input-base" />
          </div>

          <div>
            <label class="field-label">Form Group Start (To)</label>
            <input v-model="historyGroupEndDate" type="date" class="input-base" />
          </div>
        </div>
      </div>

      <!-- Form rows -->
      <div class="space-y-3">
        <div
          v-for="form in filteredPublishedForms" :key="form.id"
          class="form-row"
          :class="form.status === 'Unpublished' ? 'opacity-60' : ''"
        >
          <!-- Week/day badge -->
          <div class="week-badge">
            <span class="week-badge-label">Week Of</span>
            <span v-if="form.weekStart" class="week-badge-date">{{ form.weekStart }}</span>
            <span class="week-badge-day">{{ form.day || 'Daily' }}</span>
          </div>

          <div class="flex-grow">
            <h4 class="form-row-title">{{ form.title }}</h4>
            <p class="form-row-meta">
              Calculated Date: <span class="text-gray-600">{{ form.date }}</span>
              · {{ form.questions.length }} questions
            </p>
          </div>

          <div class="form-row-actions">
            <span class="status-pill" :class="form.status === 'Active' ? 'active' : 'inactive'">{{ form.status }}</span>
            <button class="btn-sm-indigo" @click="viewFormDetails(form)">Details</button>
            <button class="btn-sm-indigo" @click="editPublishedForm(form)">Edit</button>
            <button
              class="btn-sm"
              :class="form.status === 'Active' ? 'danger' : 'success'"
              @click="toggleFormPublish(form)"
            >{{ form.status === 'Active' ? 'Unpublish' : 'Republish' }}</button>
          </div>
        </div>

        <div v-if="filteredPublishedForms.length === 0" class="q-empty">
          No forms found for the selected filters.
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import './styles/builder.css';
</style>
