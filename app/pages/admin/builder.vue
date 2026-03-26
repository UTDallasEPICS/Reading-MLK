<script setup lang="ts">
definePageMeta({ ssr: false })

const {
  builderSubTab, formTitle, editingFormId, questions,
  formWeekStart, formDays, historyWeekStart,
  getCalculatedDate, formatDate, defaultQuestions,
  filteredPublishedForms, selectedFormDetails, viewFormDetails,
  draggedIdx, dragStart, onDrop,
  addQuestion, publishForm, editPublishedForm, toggleFormPublish,
} = useAdmin()
</script>

<template>
  <div class="builder-wrap">

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
              <span class="step-badge">Step {{ idx + 1 }} · {{ q.type }}</span>
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
    <div v-if="builderSubTab === 'creation'" class="creation-wrap">

      <!-- Top bar -->
      <div class="creation-topbar">
        <h3 class="creation-title">{{ editingFormId ? 'Editing Form' : 'Build New Form' }}</h3>
        <div class="flex gap-2">
          <button
            v-if="editingFormId"
            class="btn-ghost"
            @click="editingFormId = null; formTitle = ''; formDays = ['Monday']; questions = defaultQuestions(); builderSubTab = 'history'"
          >Cancel</button>
          <button
            v-else
            class="btn-ghost"
            @click="formTitle = ''; formDays = ['Monday']; questions = defaultQuestions(); builderSubTab = 'history'"
          >Discard</button>
          <button class="btn-indigo" @click="publishForm">
            {{ editingFormId ? 'Update Form' : 'Publish Form' }}
          </button>
        </div>
      </div>

      <!-- Week & Day card -->
      <div class="section-card">

        <!-- Week row -->
        <div class="week-row">
          <div>
            <p class="field-hint">Selected Week</p>
            <h4 class="week-label">{{ formWeekStart ? 'Week of ' + formatDate(formWeekStart) : 'Select a week' }}</h4>
          </div>
          <div>
            <label class="field-label">Change Week Starting (Mon)</label>
            <input v-model="formWeekStart" type="date" class="input-base" />
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
              @click="formDays.includes(day)
                ? formDays = formDays.filter((d: string) => d !== day)
                : formDays.push(day)"
            >{{ day }}</button>
          </div>
          <p class="field-note">* Selecting multiple days will publish a copy of this form for each selected day.</p>
        </div>

        <!-- Title + preview date -->
        <div class="title-row">
          <div class="flex-grow">
            <label class="field-label">Form Title</label>
            <input v-model="formTitle" type="text" placeholder="e.g. Kindness & Math Challenge" class="input-title" />
          </div>
          <div class="preview-date-box">
            <span class="field-hint">Preview Date</span>
            <span class="preview-date-val">
              {{ formDays.length > 0 ? getCalculatedDate(formWeekStart, formDays[0]) : 'Select a day' }}{{ formDays.length > 1 ? ' ...' : '' }}
            </span>
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
          draggable="true"
          @dragstart="dragStart($event, index)"
          @dragover.prevent
          @drop="onDrop($event, index)"
        >
          <!-- Drag handle -->
          <div class="drag-handle">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
          </div>

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
                  <input v-model="q.text" type="text" placeholder="Enter question in English..." class="input-field" />
                </div>
                <div>
                  <label class="field-label">Question (Spanish)</label>
                  <input v-model="q.textEs" type="text" placeholder="Ingrese pregunta en Español..." class="input-field" />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="field-label">Reference (English)</label>
                  <textarea v-model="q.reference" rows="2" placeholder="Correct answer..." class="textarea-field" />
                </div>
                <div>
                  <label class="field-label">Reference (Spanish)</label>
                  <textarea v-model="q.referenceEs" rows="2" placeholder="Respuesta correcta..." class="textarea-field" />
                </div>
              </div>
            </div>

            <!-- MCQ Choices -->
            <div v-if="q.type === 'mcq'" class="space-y-3">
              <label class="field-label">Answer Choices</label>
              <div v-for="(choice, ci) in q.choices" :key="ci" class="flex items-center gap-3">
                <span class="choice-letter" :class="choice.correct ? 'correct' : ''">
                  {{ String.fromCharCode(65 + ci) }}
                </span>
                <input v-model="choice.text" type="text" :placeholder="'Choice ' + String.fromCharCode(65 + ci) + '...'" class="input-field flex-grow" />
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
              <input v-model="q.url" type="text" placeholder="https://youtu.be/..." class="input-field" />
            </div>

            <!-- Context block -->
            <div v-if="q.type === 'context'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="field-label">Context (English)</label>
                <textarea v-model="q.text" rows="3" placeholder="Read this paragraph first..." class="textarea-field" />
              </div>
              <div>
                <label class="field-label">Context (Spanish)</label>
                <textarea v-model="q.textEs" rows="3" placeholder="Lea este párrafo primero..." class="textarea-field" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!--  HISTORY SUB-TAB                           -->
    <!-- ══════════════════════════════════════════ -->
    <div v-if="builderSubTab === 'history'" class="history-wrap">

      <div class="history-header">
        <h3 class="history-title">Published Curriculums History</h3>
        <button
          class="btn-indigo"
          @click="builderSubTab = 'creation'; editingFormId = null; formTitle = ''; questions = defaultQuestions()"
        >+ Create New Form</button>
      </div>

      <!-- Week filter -->
      <div class="section-card">
        <label class="field-label">Filter by Week Starting</label>
        <input v-model="historyWeekStart" type="date" class="input-base max-w-xs" />
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
              · {{ form.questions.length }} steps
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
          No published forms found for this week/day.
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Layout ── */
.builder-wrap   { max-width: 56rem; margin: 0 auto; }
.creation-wrap  { display: flex; flex-direction: column; gap: 1.5rem; }
.history-wrap   { display: flex; flex-direction: column; gap: 1rem; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center; padding: 1.5rem;
}
.modal-overlay  { position: absolute; inset: 0; background: rgba(15,23,42,0.4); backdrop-filter: blur(4px); }
.modal-box {
  position: relative; background: white; width: 100%; max-width: 42rem;
  border-radius: 1rem; box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  display: flex; flex-direction: column; max-height: 90vh;
  border-bottom: 8px solid #6366f1; overflow: hidden;
}
.modal-header {
  padding: 1.5rem; background: #eef2ff; border-bottom: 1px solid #e0e7ff;
  display: flex; justify-content: space-between; align-items: center;
}
.modal-title  { font-size: 1.5rem; font-weight: 900; color: #111827; }
.modal-meta   { font-size: 0.75rem; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.25rem; }
.modal-close  {
  width: 3rem; height: 3rem; border-radius: 0.5rem; background: white;
  color: #9ca3af; display: flex; align-items: center; justify-content: center;
  border: none; cursor: pointer; transition: all 0.15s;
}
.modal-close:hover { color: #111827; transform: scale(1.1); }
.modal-body   { padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; }
.modal-footer { padding: 1.5rem; background: #f9fafb; border-top: 1px solid #f3f4f6; display: flex; justify-content: flex-end; }
.modal-step   { padding: 1.5rem; border-radius: 0.75rem; border: 2px solid #f9fafb; background: rgba(249,250,251,0.5); display: flex; flex-direction: column; gap: 0.75rem; }
.step-badge   { display: inline-block; background: white; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.625rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #6366f1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid rgba(99,102,241,0.1); width: fit-content; }
.step-text    { font-size: 1.125rem; font-weight: 700; color: #111827; line-height: 1.4; }
.step-text-es { font-size: 1rem; color: #6b7280; font-style: italic; font-weight: 500; }
.step-ref     { margin-top: 0.5rem; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid #f3f4f6; }
.step-ref-label { font-size: 0.625rem; font-weight: 900; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem; }
.step-ref-val { font-size: 0.875rem; font-weight: 700; color: #6366f1; }
.step-choices { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.75rem; }
.step-choice  { padding: 0.75rem; border-radius: 0.5rem; border: 2px solid #f3f4f6; font-size: 0.875rem; font-weight: 700; background: white; color: #9ca3af; opacity: 0.6; }
.step-choice.correct { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; opacity: 1; }
.step-url     { margin-top: 0.75rem; }
.step-code    { font-size: 0.75rem; background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.375rem; color: #6b7280; word-break: break-all; }

/* ── Buttons ── */
.btn-dark    { padding: 1rem 2rem; border-radius: 0.75rem; font-weight: 700; font-size: 1.125rem; background: #111827; color: white; border: none; cursor: pointer; transition: all 0.15s; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
.btn-dark:hover { background: black; }
.btn-ghost   { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 500; background: white; border: 2px solid #e5e7eb; color: #6b7280; cursor: pointer; transition: background 0.15s; }
.btn-ghost:hover { background: #f9fafb; }
.btn-indigo  { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 500; background: #4f46e5; color: white; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(99,102,241,0.3); transition: background 0.15s; }
.btn-indigo:hover { background: #4338ca; }
.btn-indigo:active { transform: scale(0.97); }

/* ── Creation top bar ── */
.creation-topbar {
  display: flex; justify-content: space-between; align-items: center;
  background: #eef2ff; padding: 1.5rem; border-radius: 0.75rem;
  border: 1px solid #e0e7ff; font-style: italic;
}
.creation-title { font-size: 1.25rem; font-weight: 500; color: #3730a3; }

/* ── Cards ── */
.section-card { background: white; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); display: flex; flex-direction: column; gap: 1rem; }

/* ── Week row ── */
.week-row { display: flex; flex-direction: column; gap: 1rem; background: rgba(238,242,255,0.5); padding: 1rem; border-radius: 0.75rem; border: 1px solid rgba(224,231,255,0.5); }
@media (min-width: 768px) { .week-row { flex-direction: row; justify-content: space-between; align-items: center; } }
.week-label { font-size: 1.125rem; font-weight: 500; color: #1e1b4b; }

/* ── Day pills ── */
.day-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.day-pill  { padding: 0.5rem 1rem; border-radius: 0.75rem; font-weight: 500; font-size: 0.875rem; border: 2px solid transparent; transition: all 0.15s; background: #f8fafc; color: #94a3b8; cursor: pointer; }
.day-pill.active { background: #e0e7ff; color: #4338ca; border-color: #a5b4fc; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); }
.day-pill:hover:not(.active) { background: #f1f5f9; }

/* ── Title row ── */
.title-row { display: flex; flex-direction: column; gap: 1.5rem; padding-top: 1rem; border-top: 1px solid #f8fafc; }
@media (min-width: 768px) { .title-row { flex-direction: row; align-items: center; justify-content: space-between; } }
.preview-date-box { background: #eef2ff; padding: 1rem 1.5rem; border-radius: 0.75rem; text-align: center; min-width: 200px; }
.preview-date-val { display: block; font-size: 1.125rem; font-weight: 500; color: #4338ca; margin-top: 0.25rem; }

/* ── Inputs ── */
.field-label { display: block; font-size: 0.75rem; font-weight: 500; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
.field-hint  { font-size: 0.625rem; font-weight: 500; color: #818cf8; text-transform: uppercase; letter-spacing: 0.1em; }
.field-note  { font-size: 0.625rem; color: #9ca3af; margin-top: 0.5rem; font-style: italic; }
.input-base  { width: 100%; font-size: 1rem; font-weight: 500; color: #1f2937; border: 2px solid #f1f5f9; border-radius: 0.75rem; padding: 0.5rem 1rem; outline: none; transition: border-color 0.15s; background: white; }
.input-base:focus { border-color: #6366f1; }
.input-title { width: 100%; font-size: 1.5rem; font-weight: 500; color: #1f2937; border: none; border-bottom: 2px solid #f1f5f9; outline: none; transition: border-color 0.15s; padding: 0.5rem 0; background: transparent; }
.input-title:focus { border-bottom-color: #6366f1; }
.input-field { font-weight: 500; color: #1f2937; border: 2px solid #f8fafc; background: #f8fafc; border-radius: 0.75rem; padding: 0.75rem 1rem; outline: none; transition: all 0.15s; font-size: 1rem; width: 100%; }
.input-field:focus { background: white; border-color: #c7d2fe; }
.textarea-field { width: 100%; color: #374151; border: 2px solid #f8fafc; background: #f8fafc; border-radius: 0.75rem; padding: 0.75rem 1rem; outline: none; transition: all 0.15s; resize: none; font-size: 0.875rem; }
.textarea-field:focus { background: white; border-color: #c7d2fe; }

/* ── Add question buttons ── */
.q-type-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
.q-type-btn  { flex: 1; font-weight: 500; padding: 1rem; border-radius: 0.75rem; border: 1px dashed; transition: all 0.15s; cursor: pointer; min-width: 140px; }
.q-type-btn.blue  { background: #eff6ff; color: #4f46e5; border-color: #bfdbfe; }
.q-type-btn.blue:hover  { background: #dbeafe; }
.q-type-btn.green { background: white;   color: #6b7280; border-color: #e5e7eb; }
.q-type-btn.green:hover { background: #ecfdf5; }
.q-type-btn.red   { background: white;   color: #6b7280; border-color: #e5e7eb; }
.q-type-btn.red:hover   { background: #fef2f2; }
.q-type-btn.gray  { background: #f9fafb; color: #4b5563; border-color: #e5e7eb; }
.q-type-btn.gray:hover  { background: #f3f4f6; }

/* ── Question cards ── */
.q-list  { display: flex; flex-direction: column; gap: 1.5rem; }
.q-empty { text-align: center; padding: 3rem; color: #9ca3af; border: 4px dashed #f3f4f6; border-radius: 0.75rem; }
.q-card  { background: white; border: 2px solid #f3f4f6; border-radius: 0.75rem; padding: 1.5rem; position: relative; cursor: move; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: border-color 0.15s; }
.q-card:hover { border-color: #e0e7ff; }
.drag-handle { position: absolute; top: 1rem; left: 1rem; color: #d1d5db; }
.q-card:hover .drag-handle { color: #818cf8; }
.q-remove { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #d1d5db; cursor: pointer; font-size: 1.125rem; transition: color 0.15s; }
.q-remove:hover { color: #ef4444; }
.q-remove-inline { background: none; border: none; color: #d1d5db; cursor: pointer; font-size: 1.125rem; transition: color 0.15s; flex-shrink: 0; }
.q-remove-inline:hover { color: #ef4444; }

/* ── Question type badge ── */
.q-badge { font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.25rem 0.75rem; border-radius: 9999px; }
.q-badge.blue  { background: #dbeafe; color: #4338ca; }
.q-badge.green { background: #d1fae5; color: #065f46; }
.q-badge.red   { background: #fee2e2; color: #991b1b; }
.q-badge.gray  { background: #f3f4f6; color: #374151; }

/* ── MCQ ── */
.choice-letter { width: 2rem; height: 2rem; border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.875rem; flex-shrink: 0; background: #f3f4f6; color: #6b7280; }
.choice-letter.correct { background: #10b981; color: white; }
.btn-correct { padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-weight: 500; font-size: 0.75rem; border: none; cursor: pointer; transition: all 0.15s; flex-shrink: 0; background: #f3f4f6; color: #9ca3af; }
.btn-correct:hover { background: #d1fae5; color: #059669; }
.btn-correct.active { background: #10b981; color: white; }
.btn-add-choice { width: 100%; padding: 0.75rem; border: 2px dashed #a7f3d0; color: #10b981; font-weight: 500; border-radius: 0.75rem; background: transparent; cursor: pointer; transition: background 0.15s; }
.btn-add-choice:hover { background: #ecfdf5; }

/* ── History ── */
.history-header { display: flex; justify-content: space-between; align-items: center; }
.history-title  { font-size: 2.25rem; font-weight: 500; color: #111827; }
.form-row {
  background: white; padding: 1.25rem 1.5rem; border-radius: 1.5rem;
  border: 1px solid #e2e8f0; display: flex; align-items: center;
  gap: 1.25rem; transition: all 0.2s;
}
.form-row:hover { border-color: #a5b4fc; box-shadow: 0 2px 8px rgba(99,102,241,0.08); }
.form-row-title { font-weight: 500; font-size: 1.25rem; color: #1f2937; }
.form-row-meta  { font-size: 0.875rem; color: #9ca3af; font-weight: 500; }
.form-row-actions { display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0; }
.week-badge {
  background: #eef2ff; color: #4338ca; padding: 0.75rem;
  border-radius: 0.75rem; display: flex; flex-direction: column;
  align-items: center; justify-content: center; min-width: 90px;
  border: 1px solid #e0e7ff; flex-shrink: 0;
}
.week-badge-label { font-size: 0.5625rem; font-weight: 500; text-transform: uppercase; line-height: 1; margin-bottom: 0.25rem; }
.week-badge-date  { font-size: 0.75rem; font-weight: 500; text-align: center; line-height: 1.25; margin-bottom: 0.25rem; }
.week-badge-day   { font-size: 0.75rem; font-weight: 500; text-transform: uppercase; background: #4f46e5; color: white; padding: 0.125rem 0.5rem; border-radius: 0.5rem; margin-top: 0.25rem; }
.status-pill { font-size: 0.625rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; padding: 0.375rem 0.75rem; border-radius: 9999px; }
.status-pill.active   { background: #dcfce7; color: #15803d; }
.status-pill.inactive { background: #f3f4f6; color: #6b7280; }
.btn-sm-indigo { font-size: 0.875rem; font-weight: 500; padding: 0.75rem 1.25rem; border-radius: 0.75rem; background: #eef2ff; color: #4f46e5; border: none; cursor: pointer; transition: background 0.15s; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.btn-sm-indigo:hover { background: #e0e7ff; }
.btn-sm { font-size: 0.875rem; font-weight: 500; padding: 0.75rem 1.25rem; border-radius: 0.75rem; border: none; cursor: pointer; transition: background 0.15s; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.btn-sm.danger  { background: white; color: #6b7280; }
.btn-sm.danger:hover  { background: #fef2f2; color: #ef4444; }
.btn-sm.success { background: #f0fdf4; color: #16a34a; }
.btn-sm.success:hover { background: #dcfce7; }

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

/* ── Flex utilities ── */
.flex-grow { flex: 1; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.ml-6 { margin-left: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mt-4 { margin-top: 1rem; }
.inline-block { display: inline-block; }
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: 1fr; }
@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: 1fr 1fr; }
}
.max-w-xs { max-width: 20rem; }
.text-gray-600 { color: #4b5563; }
.opacity-60 { opacity: 0.6; }
</style>
