<script setup lang="ts">
definePageMeta({ ssr: false, layout: false })

// ─── Inline all state here so there are ZERO external dependencies ───
const { createApp } = await import('vue').catch(() => ({ createApp: null }))

// Week helpers
const today     = new Date()
const dayOffset = (today.getDay() + 6) % 7
const monday    = new Date(today)
monday.setDate(today.getDate() - dayOffset)
const mondayStr = monday.toISOString().split('T')[0]

const getCalculatedDate = (weekStartStr: string, dayName: string): string => {
  if (!weekStartStr) return ''
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const idx  = days.indexOf(dayName)
  if (idx === -1) return ''
  const d = new Date(weekStartStr + 'T00:00:00')
  d.setDate(d.getDate() + idx)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function defaultQuestions(): any[] {
  const t = Date.now()
  return [
    { id: t,   type: 'video',   text: '', textEs: '', reference: '', referenceEs: '', url: '' },
    { id: t+1, type: 'text',    text: '', textEs: '', reference: '', referenceEs: '', url: '' },
    { id: t+2, type: 'mcq',     text: '', textEs: '', reference: '', referenceEs: '', url: '',
      choices: [{text:'',correct:true},{text:'',correct:false},{text:'',correct:false},{text:'',correct:false}] },
  ]
}

// ─── State ───
const adminTab           = useState('adminTab',           () => 'builder')
const builderSubTab      = useState('builderSubTab',      () => 'history')
const announcementSubTab = useState('announcementSubTab', () => 'creation')

const formTitle          = useState('formTitle',     () => '')
const formDueDate        = useState('formDueDate',   () => '')
const editingFormId      = useState<any>('editingFormId',  () => null)
const questions          = useState<any[]>('questions', () => defaultQuestions())
const formWeekStart      = useState('formWeekStart', () => mondayStr)
const formDays           = useState<string[]>('formDays', () => ['Monday'])
const historyWeekStart   = useState('historyWeekStart', () => '')
const selectedFormDetails = useState<any>('selectedFormDetails', () => null)
const draggedItemIndex   = useState<any>('draggedItemIndex', () => null)

const currentCalculatedDate = computed(() =>
  getCalculatedDate(formWeekStart.value || 'Monday', formDays.value[0] || 'Monday')
)

const publishedForms = useState<any[]>('publishedForms', () => [
  { id:1,  weekStart:'2026-02-09', day:'Monday',    title:'Kindness & Compassion',  date:'Feb 9, 2026',  status:'Active',
    questions:[
      {id:101,type:'context',text:'Read the story of the Bell of Atri.',textEs:'Lee la historia de la Campana de Atri.',reference:'A story about justice and kindness to animals.',referenceEs:'Una historia sobre la justicia y la bondad con los animales.',url:''},
      {id:102,type:'video',text:'Watch this video on empathy',textEs:'Mira este video sobre la empatía',url:'https://www.youtube.com/embed/1Evwgu369Jw',reference:'',referenceEs:''},
      {id:103,type:'text',text:'What did the horse do in the story?',textEs:'¿Qué hizo el caballo en la historia?',reference:'He rang the bell to ask for justice.',referenceEs:'Tocó la campana para pedir justicia.',url:''},
      {id:104,type:'mcq',text:'If there are 5 bells and 3 horses, how many items in total?',textEs:'Si hay 5 campanas y 3 caballos, ¿cuántos artículos en total?',reference:'8',referenceEs:'8',url:'',
        choices:[{text:'6',correct:false},{text:'8',correct:true},{text:'10',correct:false},{text:'15',correct:false}]},
    ]},
  {id:2, weekStart:'2026-02-09',day:'Tuesday',  title:'Honesty & Truth',       date:'Feb 10, 2026',status:'Active',      questions:[{id:201,type:'text',text:'Why tell the truth?',textEs:'¿Por qué decir la verdad?',reference:'Truth builds trust.',referenceEs:'La verdad genera confianza.',url:''}]},
  {id:3, weekStart:'2026-02-09',day:'Wednesday',title:'Courage & Bravery',     date:'Feb 11, 2026',status:'Active',      questions:[{id:301,type:'text',text:'Who is a brave person?',textEs:'¿Quién es una persona valiente?',reference:'Someone who faces fear.',referenceEs:'Alguien que enfrenta el miedo.',url:''}]},
  {id:7, weekStart:'2026-02-09',day:'Thursday', title:'Fairness & Justice',    date:'Feb 12, 2026',status:'Active',      questions:[{id:701,type:'text',text:'What does fairness mean?',textEs:'¿Qué significa la justicia?',reference:'Treating everyone with respect.',referenceEs:'Tratar a todos con respeto.',url:''}]},
  {id:8, weekStart:'2026-02-09',day:'Friday',   title:'Community Spirit',      date:'Feb 13, 2026',status:'Active',      questions:[{id:801,type:'text',text:'How can you help your neighbors?',textEs:'¿Cómo puedes ayudar a tus vecinos?',reference:'Working together.',referenceEs:'Trabajando juntos.',url:''}]},
  {id:4, weekStart:'2026-02-16',day:'Monday',   title:'Patience & Persistence',date:'Feb 16, 2026',status:'Active',      questions:[{id:401,type:'text',text:'What is patience?',textEs:'¿Qué es la paciencia?',reference:'Waiting without getting upset.',referenceEs:'Esperar sin molestarse.',url:''}]},
  {id:9, weekStart:'2026-02-16',day:'Tuesday',  title:'Self-Discipline',       date:'Feb 17, 2026',status:'Active',      questions:[{id:901,type:'text',text:'What is self-control?',textEs:'¿Qué es el autocontrol?',reference:'Managing your impulses.',referenceEs:'Controlar tus impulsos.',url:''}]},
  {id:10,weekStart:'2026-02-16',day:'Wednesday',title:'Generosity & Sharing',  date:'Feb 18, 2026',status:'Active',      questions:[{id:1001,type:'text',text:'Why share with others?',textEs:'¿Por qué compartir con los demás?',reference:'It makes everyone happy.',referenceEs:'Hace felices a todos.',url:''}]},
  {id:5, weekStart:'2026-02-16',day:'Friday',   title:'Weekly Review',         date:'Feb 20, 2026',status:'Unpublished', questions:[{id:501,type:'text',text:'What did you learn?',textEs:'¿Qué aprendiste?',reference:'Review of the week.',referenceEs:'Resumen de la semana.',url:''}]},
  {id:6, weekStart:'2026-03-02',day:'Monday',   title:'Empathy in Action',     date:'Mar 2, 2026', status:'Active',      questions:[{id:601,type:'text',text:'Help a friend.',textEs:'Ayuda a un amigo.',reference:'Show kindness.',referenceEs:'Muestra bondad.',url:''}]},
  {id:11,weekStart:'2026-03-02',day:'Tuesday',  title:'Resourcefulness',       date:'Mar 3, 2026', status:'Active',      questions:[{id:1101,type:'text',text:'Using what you have.',textEs:'Usando lo que tienes.',reference:'Creativity in problem solving.',referenceEs:'Creatividad en la resolución de problemas.',url:''}]},
])

const filteredPublishedForms = computed(() =>
  publishedForms.value.filter((f:any) => !historyWeekStart.value || f.weekStart === historyWeekStart.value)
)

const students = useState<any[]>('adminStudents', () => [
  {id:1, name:'Aiden Smith', initials:'AS', email:'aiden@school.edu', tickets:12, streak:4, lastActive:'2 hours ago'},
  {id:2, name:'Nevin Kumar', initials:'NK', email:'nevin@school.edu', tickets:14, streak:5, lastActive:'Just now'},
  {id:3, name:'Swarna Jay',  initials:'SJ', email:'swarna@school.edu',tickets:8,  streak:2, lastActive:'Yesterday'},
])
const searchStudent = useState('searchStudent', () => '')
const sortStudent   = useState('sortStudent',   () => 'tickets')
const filteredAndSortedStudents = computed(() => {
  let r = students.value
  if (searchStudent.value) { const q = searchStudent.value.toLowerCase(); r = r.filter((s:any) => s.name.toLowerCase().includes(q)) }
  return [...r].sort((a:any,b:any) => {
    if (sortStudent.value==='tickets') return b.tickets-a.tickets
    if (sortStudent.value==='streak')  return b.streak-a.streak
    if (sortStudent.value==='name')    return a.name.localeCompare(b.name)
    return 0
  })
})

const raffleWinner      = useState<any>('raffleWinner',  () => null)
const isSpinning        = useState('isSpinning',         () => false)
const raffleWeek        = useState('raffleWeek',         () => 'Feb 9 - Feb 15, 2025')
const raffleSubmissions = useState('raffleSubmissions',  () => 42)
const spinRaffle = () => {
  isSpinning.value = true; raffleWinner.value = null
  setTimeout(() => {
    isSpinning.value = false
    raffleWinner.value = students.value[Math.floor(Math.random() * students.value.length)]
  }, 2000)
}

const announcements = useState<any[]>('announcements', () => [
  {id:1,title:'Summer Reading Challenge!',content:'Log 20 books this month to win a special Super Sage badge!',icon:'🌟',startDate:'2026-03-01',endDate:'2026-03-31',weekStart:'2026-03-02',day:'Monday'},
  {id:2,title:'New Badges Available',     content:'Check out the shop for new limited edition themes.',       icon:'🎉',startDate:'2026-03-05',endDate:'',           weekStart:'2026-03-02',day:'Thursday'},
  {id:3,title:'Friday Game Night',        content:'Join us in the library for board games and snacks!',       icon:'🎲',startDate:'2026-03-06',endDate:'',           weekStart:'2026-03-02',day:'Friday'},
  {id:4,title:'Week 10 Progress',         content:'You are doing amazing! Keep up the reading streak.',       icon:'📈',startDate:'2026-03-09',endDate:'',           weekStart:'2026-03-09',day:'Monday'},
  {id:5,title:'Author Visit: J.K. Rowling',content:'Virtual session this Wednesday at 10 AM.',              icon:'✍️',startDate:'2026-03-11',endDate:'',           weekStart:'2026-03-09',day:'Wednesday'},
])
const newAnnouncement = useState<any>('newAnnouncement', () => ({
  title:'', content:'', icon:'🌟',
  startDate: new Date().toISOString().split('T')[0],
  endDate:'', weekStart: mondayStr, day:'Monday',
}))
const announcementFilterWeek = useState('announcementFilterWeek', () => mondayStr)
const filteredAnnouncements = computed(() =>
  announcements.value.filter((a:any) => !announcementFilterWeek.value || a.weekStart === announcementFilterWeek.value)
)
const isAnnouncementActive = (ann: any): boolean => {
  const now = currentCalculatedDate.value || new Date().toISOString().split('T')[0]
  if(!now) return false
  if (ann.startDate > now) return false
  if (ann.endDate && ann.endDate < now) return false
  return true
}
const addAnnouncement = () => {
  const na = newAnnouncement.value
  if (!na.title || !na.content) { alert('Please fill in title and message!'); return }
  announcements.value.push({ id: Date.now(), title:na.title, content:na.content, icon:na.icon, startDate:na.startDate, endDate:na.endDate, weekStart:na.weekStart, day:na.day })
  newAnnouncement.value = { title:'', content:'', icon:'🌟', startDate:new Date().toISOString().split('T')[0], endDate:'', weekStart:mondayStr, day:'Monday' }
}
const deleteAnnouncement = (id: number) => {
  announcements.value = announcements.value.filter((a:any) => a.id !== id)
}

// ─── Builder actions ───
const dragStart = (e: DragEvent, index: number) => {
  draggedItemIndex.value = index
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}
const onDrop = (_e: DragEvent, index: number) => {
  if (draggedItemIndex.value === null) return
  const item = questions.value[draggedItemIndex.value]
  questions.value.splice(draggedItemIndex.value, 1)
  questions.value.splice(index, 0, item)
  draggedItemIndex.value = null
}
const addQuestion = (type: string) => {
  const q: any = { id: Date.now(), type, text:'', textEs:'', reference:'', referenceEs:'', url:'' }
  if (type === 'mcq') q.choices = [{text:'',correct:true},{text:'',correct:false},{text:'',correct:false},{text:'',correct:false}]
  questions.value.push(q)
}
const publishForm = () => {
  if (!formTitle.value)        { alert('Please enter a title!');           return }
  if (!formDays.value.length)  { alert('Please select at least one day!'); return }
  formDays.value.forEach((day:string) => {
    const calcDate    = getCalculatedDate(formWeekStart.value || 'Monday', day)
    const existingIdx = publishedForms.value.findIndex((f:any) => f.weekStart === formWeekStart.value && f.day === day)
    const newForm     = {
      id:        existingIdx !== -1 ? publishedForms.value[existingIdx].id : Date.now() + Math.random(),
      weekStart: formWeekStart.value, day, title: formTitle.value,
      date: calcDate, status: 'Active',
      questions: JSON.parse(JSON.stringify(questions.value)),
    }
    if (existingIdx !== -1) publishedForms.value[existingIdx] = newForm
    else                    publishedForms.value.unshift(newForm)
  })
  alert(`Published for: ${formDays.value.join(', ')}`)
}
const editPublishedForm = (form: any) => {
  formTitle.value     = form.title
  formDueDate.value   = form.dueDate || ''
  formWeekStart.value = form.weekStart || formWeekStart.value
  formDays.value      = [form.day || 'Monday']
  questions.value     = JSON.parse(JSON.stringify(form.questions))
  editingFormId.value = form.id
  builderSubTab.value = 'creation'
  adminTab.value      = 'builder'
}
const toggleFormPublish = (form: any) => {
  form.status = form.status === 'Active' ? 'Unpublished' : 'Active'
}
const viewFormDetails = (form: any) => { selectedFormDetails.value = form }
</script>

<template>
  <div class="rh-admin-wrap">

    <!-- ══════════ SIDEBAR ══════════ -->
    <aside class="rh-sidebar">
      <div class="rh-sidebar-inner">
        <!-- Logo -->
        <div class="rh-logo">
          <div class="rh-logo-icon">L</div>
          <div>
            <div class="rh-logo-name">Reading<span class="rh-logo-accent">Huddle</span></div>
            <div class="rh-logo-sub">Admin Portal</div>
          </div>
        </div>

        <p class="rh-nav-label">Admin Tools</p>
        <nav class="rh-nav">
          <button @click="adminTab = 'builder'"       class="rh-nav-btn" :class="{ 'rh-nav-active': adminTab === 'builder' }">Form Builder</button>
          <button @click="adminTab = 'progress'"      class="rh-nav-btn" :class="{ 'rh-nav-active': adminTab === 'progress' }">Class Progress</button>
          <button @click="adminTab = 'raffle'"        class="rh-nav-btn" :class="{ 'rh-nav-active': adminTab === 'raffle' }">Raffle System</button>
          <button @click="adminTab = 'announcements'" class="rh-nav-btn" :class="{ 'rh-nav-active': adminTab === 'announcements' }">Announcements</button>
        </nav>
      </div>

      <div class="rh-sidebar-footer">
        <NuxtLink to="/" class="rh-back-link">← Back to Portal</NuxtLink>
      </div>
    </aside>

    <!-- ══════════ MAIN ══════════ -->
    <div class="rh-main">

      <!-- FORM DETAILS MODAL -->
      <Transition name="rh-fade">
        <div v-if="selectedFormDetails" class="rh-modal-backdrop">
          <div class="rh-modal-overlay" @click="selectedFormDetails = null" />
          <div class="rh-modal-box">
            <div class="rh-modal-head">
              <div>
                <h3 class="rh-modal-title">{{ selectedFormDetails.title }}</h3>
                <p class="rh-modal-meta">{{ selectedFormDetails.day }} · {{ selectedFormDetails.date }}</p>
              </div>
              <button class="rh-modal-close" @click="selectedFormDetails = null">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="rh-modal-body">
              <div v-for="(q, index) in selectedFormDetails.questions" :key="q.id" class="rh-modal-step">
                <span class="rh-step-badge">Step {{ Number(index) + 1 }} · {{ q.type }}</span>
                <p class="rh-step-text">{{ q.text }}</p>
                <p v-if="q.textEs" class="rh-step-es">{{ q.textEs }}</p>
                <div v-if="q.reference" class="rh-step-ref">
                  <p class="rh-step-ref-label">Answer / Reference</p>
                  <p class="rh-step-ref-val">{{ q.reference }}</p>
                </div>
                <div v-if="q.choices" class="rh-step-choices">
                  <div v-for="c in q.choices" :key="c.text" class="rh-step-choice" :class="{ 'rh-correct': c.correct }">{{ c.text }}</div>
                </div>
                <div v-if="q.url" class="rh-step-url">
                  <p class="rh-step-ref-label">Video URL</p>
                  <code>{{ q.url }}</code>
                </div>
              </div>
            </div>
            <div class="rh-modal-foot">
              <button class="rh-btn-dark" @click="selectedFormDetails = null">Close Details</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ════════ TAB: FORM BUILDER ════════ -->
      <div v-if="adminTab === 'builder'" class="rh-tab-content">

        <!-- CREATION SUB-TAB -->
        <div v-if="builderSubTab === 'creation'" class="rh-space-y-6">
          <div class="rh-creation-bar">
            <h3 class="rh-creation-title">{{ editingFormId ? ' Editing Form' : ' Build New Form' }}</h3>
            <div class="rh-flex-gap">
              <button v-if="editingFormId"
                @click="editingFormId = null; formTitle = ''; formDueDate = ''; questions = defaultQuestions(); builderSubTab = 'history'"
                class="rh-btn-ghost">Cancel</button>
              <button v-else
                @click="formTitle = ''; formDueDate = ''; questions = defaultQuestions(); builderSubTab = 'history'"
                class="rh-btn-ghost">Discard</button>
              <button @click="publishForm" class="rh-btn-indigo">{{ editingFormId ? ' Update Form' : ' Publish Form' }}</button>
            </div>
          </div>

          <!-- Week & Day -->
          <div class="rh-card">
            <div class="rh-week-row">
              <div>
                <p class="rh-tiny-label" style="color:#818cf8">Selected Week</p>
                <h4 class="rh-week-title">{{ formWeekStart ? 'Week of ' + formatDate(formWeekStart) : 'Select a week' }}</h4>
              </div>
              <div>
                <label class="rh-tiny-label">Change Week Starting (Mon)</label>
                <input v-model="formWeekStart" type="date" class="rh-input" />
              </div>
            </div>

            <div>
              <label class="rh-tiny-label" style="margin-bottom:12px;display:block">Day(s) of Week (Multi-select)</label>
              <div class="rh-day-pills">
                <button
                  v-for="day in ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']" :key="day"
                  @click="formDays.includes(day) ? formDays = formDays.filter((d:string) => d !== day) : formDays.push(day)"
                  class="rh-day-pill" :class="{ 'rh-day-active': formDays.includes(day) }">{{ day }}</button>
              </div>
              <p style="font-size:10px;color:#9ca3af;margin-top:8px;font-style:italic">* Selecting multiple days will publish a copy of this form for each selected day.</p>
            </div>

            <div class="rh-title-row">
              <div style="flex:1">
                <label class="rh-tiny-label" style="margin-bottom:8px;display:block">Form Title</label>
                <input v-model="formTitle" type="text" placeholder="e.g. Kindness & Math Challenge" class="rh-title-input" />
              </div>
              <div class="rh-preview-date">
                <span class="rh-tiny-label" style="color:#818cf8;display:block;margin-bottom:4px">Preview Date</span>
                <span style="font-size:18px;font-weight:500;color:#4338ca">
                  {{ formDays.length > 0 ? getCalculatedDate(formWeekStart || 'Monday', formDays[0] || 'Monday') : 'Select a day' }}{{ formDays.length > 1 ? ' ...' : '' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Add question buttons -->
          <div class="rh-q-btns">
            <button @click="addQuestion('text')"    class="rh-q-btn rh-q-btn-blue">+ Discussion</button>
            <button @click="addQuestion('mcq')"     class="rh-q-btn rh-q-btn-gray">+ Multiple Choice</button>
            <button @click="addQuestion('video')"   class="rh-q-btn rh-q-btn-gray">+ Video Embed</button>
            <button @click="addQuestion('context')" class="rh-q-btn rh-q-btn-gray2">+ Context Block</button>
          </div>

          <!-- Question list -->
          <div class="rh-space-y-6">
            <div v-if="questions.length === 0" class="rh-empty">No questions yet. Add one above!</div>

            <div v-for="(q, index) in questions" :key="q.id"
              draggable="true" @dragstart="dragStart($event, index)" @dragover.prevent @drop="onDrop($event, index)"
              class="rh-q-card">
              <div class="rh-q-drag-handle">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>
              </div>
              <button @click.stop="questions.splice(index, 1)" class="rh-q-remove">✕</button>

              <div style="margin-left:28px;margin-bottom:16px">
                <span class="rh-q-badge" :class="{
                  'rh-badge-blue':  q.type === 'text',
                  'rh-badge-green': q.type === 'mcq',
                  'rh-badge-red':   q.type === 'video',
                  'rh-badge-gray':  q.type === 'context',
                }">{{ q.type === 'text' ? 'Discussion' : q.type === 'mcq' ? 'Multiple Choice' : q.type === 'video' ? 'Video' : 'Context' }}</span>
              </div>

              <div style="margin-left:28px" class="rh-space-y-4">
                <!-- text / mcq fields -->
                <div v-if="['text','mcq'].includes(q.type)">
                  <div class="rh-grid-2">
                    <div>
                      <label class="rh-tiny-label">Question (English)</label>
                      <input v-model="q.text" type="text" placeholder="Enter question in English..." class="rh-field-input" />
                    </div>
                    <div>
                      <label class="rh-tiny-label">Question (Spanish)</label>
                      <input v-model="q.textEs" type="text" placeholder="Ingrese pregunta en Español..." class="rh-field-input" />
                    </div>
                  </div>
                  <div class="rh-grid-2" style="margin-top:16px">
                    <div>
                      <label class="rh-tiny-label">Reference (English)</label>
                      <textarea v-model="q.reference" rows="2" placeholder="Correct answer..." class="rh-field-input" style="resize:none" />
                    </div>
                    <div>
                      <label class="rh-tiny-label">Reference (Spanish)</label>
                      <textarea v-model="q.referenceEs" rows="2" placeholder="Respuesta correcta..." class="rh-field-input" style="resize:none" />
                    </div>
                  </div>
                </div>

                <!-- MCQ choices -->
                <div v-if="q.type === 'mcq'" style="margin-top:16px" class="rh-space-y-3">
                  <label class="rh-tiny-label">Answer Choices</label>
                  <div v-for="(choice, ci) in q.choices" :key="ci" class="rh-choice-row">
                    <span class="rh-choice-letter" :class="{ 'rh-choice-correct': choice.correct }">{{ String.fromCharCode(65 + Number(ci)) }}</span>
                    <input v-model="choice.text" type="text" :placeholder="'Choice ' + String.fromCharCode(65 + Number(ci)) + '...'" class="rh-field-input" style="flex:1" />
                    <button @click="q.choices.forEach((c:any) => c.correct = false); choice.correct = true"
                      class="rh-set-correct" :class="{ 'rh-set-correct-active': choice.correct }">
                      {{ choice.correct ? '✓ Correct' : 'Set Correct' }}
                    </button>
                    <button @click="q.choices.splice(ci, 1)" class="rh-q-remove" style="position:static">✕</button>
                  </div>
                  <button @click="q.choices.push({ text: '', correct: false })" class="rh-add-choice">+ Add Choice</button>
                </div>

                <!-- Video -->
                <div v-if="q.type === 'video'">
                  <label class="rh-tiny-label">YouTube URL</label>
                  <input v-model="q.url" type="text" placeholder="https://youtu.be/..." class="rh-field-input" />
                </div>

                <!-- Context -->
                <div v-if="q.type === 'context'">
                  <div class="rh-grid-2">
                    <div>
                      <label class="rh-tiny-label">Context (English)</label>
                      <textarea v-model="q.text" rows="3" placeholder="Read this paragraph first..." class="rh-field-input" style="resize:none" />
                    </div>
                    <div>
                      <label class="rh-tiny-label">Context (Spanish)</label>
                      <textarea v-model="q.textEs" rows="3" placeholder="Lea este párrafo primero..." class="rh-field-input" style="resize:none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- HISTORY SUB-TAB -->
        <div v-if="builderSubTab === 'history'" class="rh-space-y-4">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h3 style="font-size:2rem;font-weight:500;color:#111827">Published Curriculums History</h3>
            <button @click="builderSubTab = 'creation'; editingFormId = null; formTitle = ''; questions = defaultQuestions()" class="rh-btn-indigo">+ Create New Form</button>
          </div>

          <div class="rh-card">
            <label class="rh-tiny-label" style="margin-bottom:12px;display:block">Filter by Week Starting</label>
            <input v-model="historyWeekStart" type="date" class="rh-input" style="max-width:300px" />
          </div>

          <div class="rh-space-y-3">
            <div v-for="form in filteredPublishedForms" :key="form.id"
              class="rh-form-row" :class="{ 'rh-unpublished': form.status === 'Unpublished' }">
              <div class="rh-week-badge">
                <span style="font-size:9px;font-weight:500;text-transform:uppercase;line-height:1;margin-bottom:4px">Week Of</span>
                <span v-if="form.weekStart" style="font-size:11px;font-weight:500;text-align:center;line-height:1.3">{{ form.weekStart }}</span>
                <span class="rh-day-badge">{{ form.day || 'Daily' }}</span>
              </div>
              <div style="flex:1">
                <h4 style="font-weight:500;font-size:1.2rem;color:#1f2937">{{ form.title }}</h4>
                <p style="font-size:14px;color:#9ca3af;font-weight:500">
                  Calculated Date: <span style="color:#4b5563">{{ form.date }}</span> · {{ form.questions.length }} steps
                </p>
              </div>
              <div class="rh-form-actions">
                <span class="rh-status-pill" :class="form.status === 'Active' ? 'rh-active' : 'rh-inactive'">{{ form.status }}</span>
                <button @click="viewFormDetails(form)"  class="rh-btn-sm-indigo">Details</button>
                <button @click="editPublishedForm(form)" class="rh-btn-sm-indigo">Edit</button>
                <button @click="toggleFormPublish(form)" class="rh-btn-sm" :class="form.status === 'Active' ? 'rh-btn-sm-danger' : 'rh-btn-sm-success'">
                  {{ form.status === 'Active' ? 'Unpublish' : 'Republish' }}
                </button>
              </div>
            </div>
            <div v-if="filteredPublishedForms.length === 0" class="rh-empty" style="padding:80px 0">No published forms found for this week/day.</div>
          </div>
        </div>
      </div>

      <!-- ════════ TAB: CLASS PROGRESS ════════ -->
      <div v-if="adminTab === 'progress'" class="rh-tab-content">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;margin-bottom:2rem;gap:1rem">
          <h2 style="font-size:2.25rem;font-weight:500;color:#111827">Class Progress</h2>
          <div style="display:flex;gap:1rem">
            <div style="position:relative">
              <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af">🔍</span>
              <input v-model="searchStudent" type="text" placeholder="Search student..."
                style="padding:8px 16px 8px 36px;border:2px solid #f1f5f9;border-radius:8px;font-size:14px;font-weight:500;outline:none;width:256px" />
            </div>
            <select v-model="sortStudent" style="padding:8px 16px;border:2px solid #f1f5f9;border-radius:8px;font-size:14px;font-weight:500;color:#4b5563;background:white;outline:none">
              <option value="tickets">Sort by Tickets</option>
              <option value="streak">Sort by Streak</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
        <div style="background:white;border-radius:8px;box-shadow:0 10px 25px rgba(148,163,184,0.2);border:1px solid #e5e7eb;overflow:hidden">
          <table style="width:100%;border-collapse:collapse;text-align:left">
            <thead style="background:#f9fafb;border-bottom:1px solid #e5e7eb">
              <tr>
                <th class="rh-th">Student</th>
                <th class="rh-th">Tickets</th>
                <th class="rh-th">Weekly Streak</th>
                <th class="rh-th">Last Active</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in filteredAndSortedStudents" :key="s.id" class="rh-tr">
                <td class="rh-td" style="display:flex;align-items:center;gap:12px;font-weight:500;color:#1f2937">
                  <div class="rh-avatar">{{ s.initials }}</div>{{ s.name }}
                </td>
                <td class="rh-td"><span class="rh-badge-pill">{{ s.tickets }}</span></td>
                <td class="rh-td"><span class="rh-badge-pill">🔥 {{ s.streak }}</span></td>
                <td class="rh-td" style="color:#6b7280;font-size:14px">{{ s.lastActive }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ════════ TAB: RAFFLE ════════ -->
      <div v-if="adminTab === 'raffle'" class="rh-tab-content" style="text-align:center">
        <h2 style="font-size:3rem;font-weight:500;color:#111827;margin-bottom:4px">Weekly Raffle</h2>
        <p style="font-size:1.25rem;font-weight:500;color:#4f46e5;margin-bottom:24px">Spinning for: {{ raffleWeek }}</p>

        <div class="rh-raffle-card">
          <!-- Idle -->
          <div v-if="!raffleWinner && !isSpinning">
            <div style="font-size:6rem;margin-bottom:32px;cursor:pointer;display:inline-block;transition:transform 0.3s"
              @mouseover="($event.target as HTMLElement).style.transform='rotate(12deg)'"
              @mouseleave="($event.target as HTMLElement).style.transform=''"
              @click="spinRaffle">🎟️</div>
            <div style="margin-bottom:32px">
              <p style="color:#9ca3af;font-weight:500;text-transform:uppercase;letter-spacing:.1em;font-size:14px;margin-bottom:4px">Total Entries</p>
              <p style="font-size:2.5rem;font-weight:500;color:#111827">{{ raffleSubmissions }}</p>
            </div>
            <button @click="spinRaffle" class="rh-spin-btn">SPIN IT!</button>
          </div>
          <!-- Spinning -->
          <div v-else-if="isSpinning" style="padding:40px 0">
            <div class="rh-spin-emoji">🎟️</div>
            <h3 style="font-size:2rem;font-weight:500;color:#4f46e5">Spinning...</h3>
          </div>
          <!-- Winner -->
          <div v-else style="padding:24px 0">
            <div class="rh-bounce-emoji">🥳</div>
            <h2 style="font-size:2.5rem;font-weight:500;color:#111827;margin-bottom:8px">Winner!</h2>
            <p style="font-size:2rem;font-weight:500;color:#4f46e5">{{ raffleWinner.name }}</p>
            <p style="font-size:1.125rem;color:#9ca3af;font-weight:500;margin-bottom:24px;font-style:italic">{{ raffleWinner.email }}</p>
            <button @click="raffleWinner = null" style="background:none;border:none;color:#9ca3af;font-weight:500;text-decoration:underline;cursor:pointer;font-size:1rem">Start Over</button>
          </div>
        </div>
      </div>

      <!-- ════════ TAB: ANNOUNCEMENTS ════════ -->
      <div v-if="adminTab === 'announcements'" class="rh-tab-content rh-space-y-4">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem">
          <div>
            <h2 style="font-size:1.875rem;font-weight:500;color:#111827">Announcements</h2>
            <p style="color:#6b7280;font-weight:500;margin-top:4px">Direct communication with your students</p>
          </div>
          <div class="rh-subtab-switch">
            <button @click="announcementSubTab = 'creation'" class="rh-subtab-btn" :class="{ 'rh-subtab-active': announcementSubTab === 'creation' }">Post Announcement</button>
            <button @click="announcementSubTab = 'history'"  class="rh-subtab-btn" :class="{ 'rh-subtab-active': announcementSubTab === 'history' }">Announcement History</button>
          </div>
        </div>

        <!-- POST -->
        <div v-if="announcementSubTab === 'creation'" class="rh-space-y-4">
          <div class="rh-ann-grid">
            <div class="rh-card rh-space-y-5">
              <div>
                <label class="rh-tiny-label" style="margin-bottom:12px;display:block">Announcement Title</label>
                <div style="display:flex;gap:8px">
                  <input v-model="newAnnouncement.title" type="text" placeholder="e.g., Book Fair Next Week!" class="rh-field-input" style="flex:1" />
                  <select v-model="newAnnouncement.icon" class="rh-field-input" style="width:90px">
                    <option value="⚠️">Alert</option><option value="🌟">Star</option><option value="🎉">Party</option>
                    <option value="🔔">Bell</option><option value="📅">Date</option><option value="🍎">Apple</option>
                    <option value="📖">Book</option><option value="🏆">Trophy</option>
                  </select>
                </div>
              </div>
              <div class="rh-grid-2">
                <div>
                  <label class="rh-tiny-label" style="font-style:italic;margin-bottom:12px;display:block">Publish From</label>
                  <input v-model="newAnnouncement.startDate" type="date" class="rh-field-input" />
                </div>
                <div>
                  <label class="rh-tiny-label" style="margin-bottom:12px;display:block">Till Date (Optional)</label>
                  <div style="position:relative">
                    <input v-model="newAnnouncement.endDate" type="date" class="rh-field-input" />
                    <button v-if="newAnnouncement.endDate" @click="newAnnouncement.endDate = ''"
                      style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#d1d5db;cursor:pointer">✕</button>
                  </div>
                </div>
              </div>
              <div>
                <label class="rh-tiny-label" style="margin-bottom:12px;display:block">Message Content</label>
                <textarea v-model="newAnnouncement.content" rows="4" placeholder="What would you like to share with your students?"
                  class="rh-field-input" style="resize:none;width:100%" />
              </div>
              <button @click="addAnnouncement" class="rh-btn-post">Post Announcement</button>
            </div>

            <!-- Live Preview -->
            <div class="rh-preview-panel">
              <h4 style="font-size:11px;font-weight:500;color:#818cf8;text-transform:uppercase;letter-spacing:.1em;text-align:center;margin-bottom:24px">Live Student Preview</h4>
              <div class="rh-preview-card">
                <div class="rh-preview-icon">{{ newAnnouncement.icon }}</div>
                <div style="flex:1;margin-top:4px">
                  <h4 style="font-size:1.2rem;font-weight:700;color:#1f2937;margin-bottom:8px">{{ newAnnouncement.title || 'Your Title Here' }}</h4>
                  <span style="display:inline-block;padding:4px 12px;background:#f3f4f6;color:#374151;border-radius:9999px;font-size:10px;font-weight:700;text-transform:uppercase;margin-bottom:12px">
                    {{ newAnnouncement.startDate || 'Start Date' }} {{ newAnnouncement.endDate ? 'to ' + newAnnouncement.endDate : '(Ongoing)' }}
                  </span>
                  <p style="color:#6b7280;font-weight:500;line-height:1.6">{{ newAnnouncement.content || 'Your message will appear here...' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- HISTORY -->
        <div v-if="announcementSubTab === 'history'" class="rh-space-y-4">
          <div style="background:rgba(238,242,255,0.5);padding:20px;border-radius:8px;border:1px solid #e0e7ff;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;justify-content:center">
            <div>
              <label style="display:block;font-size:10px;font-weight:500;color:#818cf8;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">View Week Starting</label>
              <input v-model="announcementFilterWeek" type="date"
                style="font-size:14px;font-weight:500;color:#3730a3;border:2px solid #c7d2fe;border-radius:8px;padding:8px 16px;outline:none;background:white" />
            </div>
          </div>

          <div class="rh-space-y-3">
            <div v-for="ann in filteredAnnouncements" :key="ann.id"
              class="rh-ann-item" :class="isAnnouncementActive(ann) ? 'rh-ann-active' : 'rh-ann-expired'">
              <div class="rh-ann-icon" :class="isAnnouncementActive(ann) ? 'rh-ann-icon-active' : 'rh-ann-icon-expired'">{{ ann.icon }}</div>
              <div style="flex:1;margin-top:4px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
                  <h4 style="font-size:1.2rem;font-weight:700" :style="isAnnouncementActive(ann) ? 'color:#1f2937' : 'color:#6b7280'">{{ ann.title }}</h4>
                  <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;margin-left:16px">
                    <span v-if="isAnnouncementActive(ann)"  class="rh-ann-pill rh-ann-pill-green">Active</span>
                    <span v-else                            class="rh-ann-pill rh-ann-pill-gray">Expired</span>
                    <span class="rh-ann-pill rh-ann-pill-neutral">{{ ann.day }}</span>
                    <span class="rh-ann-pill rh-ann-pill-neutral">{{ ann.startDate }} {{ ann.endDate ? 'to ' + ann.endDate : '(Ongoing)' }}</span>
                    <button @click="deleteAnnouncement(ann.id)" style="background:none;border:none;color:#fca5a5;cursor:pointer;font-size:1rem;margin-left:8px" class="hover-red">✕</button>
                  </div>
                </div>
                <p style="font-weight:500;line-height:1.6" :style="isAnnouncementActive(ann) ? 'color:#4b5563' : 'color:#9ca3af'">{{ ann.content }}</p>
              </div>
            </div>
            <div v-if="filteredAnnouncements.length === 0" class="rh-empty" style="padding:80px 0">
              <span style="font-size:3rem;display:block;margin-bottom:16px">🏜️</span>
              No announcements found for this filter.
              <br><button @click="announcementFilterWeek = ''" style="margin-top:16px;background:none;border:none;color:#6366f1;font-weight:500;font-size:12px;text-transform:uppercase;cursor:pointer;text-decoration:underline">Clear all filters</button>
            </div>
          </div>
        </div>
      </div>

    </div><!-- end rh-main -->
  </div><!-- end rh-admin-wrap -->
</template>

<style>
@import './styles/index.css';
</style>
