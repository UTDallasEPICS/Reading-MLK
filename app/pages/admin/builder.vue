<script setup lang="ts">
definePageMeta({ ssr: false })

const { formTitle, editingFormId, questions, publishedForms, addQuestion, publishForm, editPublishedForm, toggleFormPublish } = useAdmin()
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8">

    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-4xl font-bold text-gray-900">Daily Form Builder</h2>
        <p class="text-gray-500 mt-1">Create custom curriculum for your students.</p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="editingFormId"
          @click="editingFormId = null; formTitle = ''; questions = []"
          class="px-6 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          @click="publishForm"
          class="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg transition active:scale-95"
        >
          {{ editingFormId ? '✅ Update Form' : '🚀 Publish Week' }}
        </button>
      </div>
    </div>

    <!-- Title Input -->
    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Form Title</label>
      <input
        v-model="formTitle"
        type="text"
        placeholder="e.g. Week 4: Kindness & Math"
        class="w-full text-2xl font-bold text-gray-800 border-b-2 border-gray-100 focus:border-purple-400 focus:outline-none transition py-2"
      />
    </div>

    <!-- Add Question Buttons -->
    <div class="flex gap-3 flex-wrap">
      <button @click="addQuestion('text')"    class="flex-1 bg-blue-50 text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-100 transition border border-dashed border-blue-200 min-w-[130px]">+ Discussion</button>
      <button @click="addQuestion('mcq')"     class="flex-1 bg-emerald-50 text-emerald-600 font-bold py-4 rounded-2xl hover:bg-emerald-100 transition border border-dashed border-emerald-200 min-w-[130px]">+ Multiple Choice</button>
      <button @click="addQuestion('video')"   class="flex-1 bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-100 transition border border-dashed border-red-200 min-w-[130px]">+ Video Embed</button>
      <button @click="addQuestion('context')" class="flex-1 bg-gray-50 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-100 transition border border-dashed border-gray-200 min-w-[130px]">+ Context Block</button>
    </div>

    <!-- Questions List -->
    <div class="space-y-4">
      <div
        v-if="questions.length === 0"
        class="text-center py-12 text-gray-400 border-4 border-dashed border-gray-100 rounded-3xl"
      >
        No questions yet. Add one above!
      </div>

      <div
        v-for="(q, index) in questions"
        :key="q.id"
        class="bg-white border-2 border-gray-100 rounded-2xl p-6 relative hover:border-purple-100 transition shadow-sm"
      >
        <button @click="questions.splice(index, 1)" class="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition text-lg">✕</button>

        <!-- Type badge -->
        <span class="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block"
          :class="{
            'bg-blue-100 text-blue-700': q.type === 'text',
            'bg-emerald-100 text-emerald-700': q.type === 'mcq',
            'bg-red-100 text-red-700': q.type === 'video',
            'bg-gray-100 text-gray-700': q.type === 'context'
          }">
          {{ q.type === 'text' ? '🗣️ Discussion' : q.type === 'mcq' ? '📋 Multiple Choice' : q.type === 'video' ? '📺 Video' : '📄 Context' }}
        </span>

        <!-- Text  / MCQ fields -->
        <div v-if="['text', 'mcq'].includes(q.type)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Question (English)</label>
              <input v-model="q.text" type="text" placeholder="Enter question in English..."
                class="w-full font-bold text-gray-800 border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-purple-200 focus:outline-none transition" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Question (Spanish)</label>
              <input v-model="q.textEs" type="text" placeholder="Ingrese pregunta en Español..."
                class="w-full font-bold text-gray-800 border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-purple-200 focus:outline-none transition" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Reference (English)</label>
              <textarea v-model="q.reference" rows="2" placeholder="Correct answer..."
                class="w-full text-sm text-gray-600 border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-purple-200 focus:outline-none transition" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Reference (Spanish)</label>
              <textarea v-model="q.referenceEs" rows="2" placeholder="Respuesta correcta..."
                class="w-full text-sm text-gray-600 border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-purple-200 focus:outline-none transition" />
            </div>
          </div>
        </div>

        <!-- MCQ Choices -->
        <div v-if="q.type === 'mcq'" class="mt-4 space-y-3">
          <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Answer Choices</label>
          <div v-for="(choice, ci) in q.choices" :key="ci" class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
              :class="choice.correct ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'">
              {{ String.fromCharCode(65 + ci) }}
            </span>
            <input v-model="choice.text" type="text" :placeholder="'Choice ' + String.fromCharCode(65 + ci) + '...'"
              class="flex-grow font-bold text-gray-800 border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-purple-200 focus:outline-none transition" />
            <button
              @click="q.choices.forEach((c: any) => c.correct = false); choice.correct = true"
              :class="['px-3 py-2 rounded-lg font-bold text-xs transition', choice.correct ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600']">
              {{ choice.correct ? '✓ Correct' : 'Set Correct' }}
            </button>
            <button @click="q.choices.splice(ci, 1)" class="text-gray-300 hover:text-red-500 transition text-lg">✕</button>
          </div>
          <button @click="q.choices.push({ text: '', correct: false })"
            class="w-full py-3 border-2 border-dashed border-emerald-200 text-emerald-500 font-bold rounded-xl hover:bg-emerald-50 transition">
            + Add Choice
          </button>
        </div>

        <!-- Video URL -->
        <div v-if="q.type === 'video'">
          <label class="block text-xs font-bold text-gray-400 uppercase mb-1">YouTube URL</label>
          <input v-model="q.url" type="text" placeholder="https://youtu.be/..."
            class="w-full font-bold text-gray-800 border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-purple-200 focus:outline-none transition" />
        </div>

        <!-- Context Block -->
        <div v-if="q.type === 'context'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Context (English)</label>
            <textarea v-model="q.text" rows="3" placeholder="Read this paragraph first..."
              class="w-full text-gray-800 border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-purple-200 focus:outline-none transition" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Context (Spanish)</label>
            <textarea v-model="q.textEs" rows="3" placeholder="Lea este párrafo primero..."
              class="w-full text-gray-800 border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-purple-200 focus:outline-none transition" />
          </div>
        </div>
      </div>
    </div>

    <!-- Published Forms -->
    <div class="mt-12">
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Published Curriculums</h3>
      <div class="space-y-3">
        <div
          v-for="form in publishedForms"
          :key="form.id"
          class="bg-white p-6 rounded-2xl border border-gray-200 flex justify-between items-center hover:border-purple-200 transition"
          :class="{ 'opacity-60': form.status === 'Unpublished' }"
        >
          <div>
            <h4 class="font-bold text-lg text-gray-800">{{ form.title }}</h4>
            <p class="text-sm text-gray-400">Published: {{ form.date }} · {{ form.questions.length }} questions</p>
          </div>
          <div class="flex gap-2 items-center">
            <span class="text-sm font-bold px-3 py-1 rounded-full"
              :class="form.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
              {{ form.status }}
            </span>
            <button @click="editPublishedForm(form)"
              class="text-sm font-bold px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
              ✏️ Edit
            </button>
            <button @click="toggleFormPublish(form)"
              :class="['text-sm font-bold px-4 py-2 rounded-xl transition', form.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100']">
              {{ form.status === 'Active' ? '⏸ Unpublish' : '▶ Republish' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
