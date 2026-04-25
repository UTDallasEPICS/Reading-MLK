<script setup lang="ts">
definePageMeta({ ssr: false, layout: "admin" })

//Import watch to see when tab switches between history and create
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

//Props receive array of existing announcements
const props = defineProps({
  announcements: {
    type: Array,
    default: () => []
  }
})


const emit = defineEmits(['add', 'delete'])
const subTab = ref('creation')
const todayStr = new Date().toISOString().split('T')[0]

//Current announcement form being created
const form = reactive({
  title: '',
  content: '',
  icon: '🌟',
  startDate: todayStr,
  endDate: ''
})

//Emoji picker state
const showEmojiPicker = ref(false)
const emojiTriggerRef = ref<HTMLElement | null>(null)
const pickerContainerRef = ref<HTMLElement | null>(null)
let pickerInstance: any = null

function onEmojiSelect(emoji: any) {
  form.icon = emoji.native
  showEmojiPicker.value = false
}

function onDocumentClick(e: MouseEvent) {
  if (emojiTriggerRef.value && !emojiTriggerRef.value.contains(e.target as Node)) {
    showEmojiPicker.value = false
  }
}
watch(showEmojiPicker, (open) => {
  if (open) {
    document.addEventListener('mousedown', onDocumentClick)
    
    // Initialize picker lazily the first time it opens
    if (!pickerInstance && pickerContainerRef.value) {
      pickerInstance = new Picker({
        data,
        onEmojiSelect: onEmojiSelect,
        theme: 'light'
      })
      pickerContainerRef.value.appendChild(pickerInstance as any)
    }
  } else {
    document.removeEventListener('mousedown', onDocumentClick)
  }
})
onUnmounted(() => document.removeEventListener('mousedown', onDocumentClick))

//Announcement history storage
const allAnnouncements = ref<any[]>([])

//Loading state
const historyLoading = ref(false)

//Error state
const historyError = ref<string | null>(null)

//Parses announcements based on format, used to be string, now JSON object
function parseContent (raw: any): { icon: string; title: string; body: string } {
  //New records: Prisma already returned a proper object
  if (raw && typeof raw === 'object') return raw as { icon: string; title: string; body: string }
  //Legacy records: raw is a JSON string — parse it back to an object
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as { icon: string; title: string; body: string } }
    catch { return { icon: '📢', title: raw, body: '' } }  // malformed — show string as title
  }
  return { icon: '📢', title: '', body: '' }
}

//Checks if announcement is active
function isActive (ann: any) {
  const now = new Date()

  //Not yet published
  if (new Date(ann.postDate) > now) return false

  //Already expired
  if (ann.expiryDate && new Date(ann.expiryDate) < now) return false

  return true
}

//Converts an ISO 8601 date string into a human-readable short date, null if no date given
function fmtDate (iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

//Computed list that re-filters allAnnouncements every time the underlying data changes
const activeAnnouncements = computed(() => allAnnouncements.value.filter(isActive))

//Computed list that shows inactive/expired announcements
const inactiveAnnouncements = computed(() => allAnnouncements.value.filter(a => !isActive(a)))

//Asynchronously fetches all announcement records from the API endpoint. On success it populates 
//`allAnnouncements`, which automatically causes both computed lists to re-evaluate. On failure it 
//stores the error message in `historyError` for display. The `historyLoading` flag wraps the 
//entire request so the template can show a spinner during the fetch.
async function loadHistory () {
  historyLoading.value = true
  historyError.value = null
  try {
    // $fetch is Nuxt's HTTP utility (wraps native fetch with nice error handling).
    allAnnouncements.value = await $fetch('/api/announcement')
  } catch (e: any) {
    //Capture the error message; fall back to a generic string if none exists
    historyError.value = e?.message ?? 'Failed to load announcements.'
  } finally {
    // Always turn off the loading flag, even if the request failed
    historyLoading.value = false
  }
}

//Watcher, triggers fetch on tab switch
watch(subTab, (tab) => { if (tab === 'history') loadHistory() })

//Deletes an announcement
async function deleteAnnouncement (id: number) {
  //Show confirmation dialog before deleting
  if (!confirm('Are you sure you want to permanently delete this announcement?')) return

  try {
    //Sends DELETE request and removes the record from the local `allAnnouncements` array
    await $fetch(`/api/announcement/${id}`, { method: 'DELETE' })

    //Find the deleted record's index in the reactive array and remove it.
    const idx = allAnnouncements.value.findIndex(a => a.id === id)
    if (idx !== -1) allAnnouncements.value.splice(idx, 1)
  } catch (e: any) {
    //Surface the server's error message if available, otherwise show a generic fallback so the admin knows the operation did not succeed.
    alert(e?.data?.error ?? 'Failed to delete announcement. Please try again.')
  }
}

//Handles form submission and uploads announcement data to the database
async function postAnnouncement () {
  //Validate required fields
  if (!form.title.trim() || !form.content.trim()) {
    alert('Please fill in title and message!')
    return
  }

  try {
    //Format dates
    const postDate = new Date(form.startDate!).toISOString()
    const expiryDate = form.endDate ? new Date(form.endDate).toISOString() : null

    //Build a plain JSON object for the `content` field
    const content = {
      icon: form.icon,
      title: form.title,
      body: form.content
    }

    //Post to database
    const newAnn = await $fetch('/api/announcement', {
      method: 'POST',
      body: {
        content,
        postDate,
        expiryDate,
        author: null //Hardcoded author based on current functionality
      }
    })

    //Emit event to parent component
    emit('add', {
      title: form.title,
      content: form.content,
      icon: form.icon,
      startDate: form.startDate,
      endDate: form.endDate,
      weekStart: '',
      day: ''
    })

    //Reset form fields after successful submission
    form.title = ''
    form.content = ''
    form.icon = '🌟'
    form.startDate = todayStr
    form.endDate = ''
  } catch (e) {
    console.error('Failed to post announcement:', e)
    alert('Failed to post announcement. Please try again.')
  }
}
</script>




<template>
  <div class="flex min-h-screen bg-gray-50">


    <!-- ── Main content — pushed right of the fixed sidebar ── -->
    <main class="ml-6 flex-1 p-8">
      <div class="space-y-4 animate-fade-in">

        <!-- Header Section and Tab Controls -->
        <!-- Controls whether to display the form to create new announcements or view past records -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-3xl font-medium text-gray-900 flex items-center gap-3">
              Announcements
            </h2>
            <p class="text-gray-500 font-medium mt-1">Direct communication with your students</p>
          </div>

          <div class="flex bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 shadow-inner">
            <button
              @click="subTab = 'creation'"
              :class="[
                'px-6 py-2.5 rounded-lg font-medium transition-all duration-300',
                subTab === 'creation' ? 'bg-white text-indigo-800 shadow-md' : 'text-indigo-400 hover:text-indigo-600'
              ]"
            >
              Post Announcement
            </button>
            <button
              @click="subTab = 'history'"
              :class="[
                'px-6 py-2.5 rounded-lg font-medium transition-all duration-300',
                subTab === 'history' ? 'bg-white text-indigo-800 shadow-md' : 'text-indigo-400 hover:text-indigo-600'
              ]"
            >
              Current/Past Announcements
            </button>
          </div>
        </div>

        <!-- ══ POST ANNOUNCEMENT ══ -->
        <div v-if="subTab === 'creation'" class="space-y-4 animate-fade-in">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

            <!-- Announcement Creation Form -->
            <!-- Collects all user input for title, icon selection, active dates, and text body -->
            <div class="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-5">
              <div class="grid grid-cols-1 gap-5">

                <!-- Title + Icon -->
                <div>
                  <label class="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    Announcement Title
                  </label>
                  <div class="flex gap-2">
                    <input
                      v-model="form.title"
                      type="text"
                      placeholder="e.g., Book Fair Next Week!"
                      class="flex-grow text-lg font-medium text-gray-800 border-2 border-gray-50 rounded-lg px-5 py-3 focus:border-indigo-500 focus:outline-none transition"
                    />
                    <!-- Emoji picker trigger + emoji-mart popup -->
                    <div class="relative shrink-0" ref="emojiTriggerRef">
                      <!-- Trigger: displays selected emoji, toggles picker -->
                      <button
                        type="button"
                        @click.stop="showEmojiPicker = !showEmojiPicker"
                        class="w-14 h-14 text-2xl flex items-center justify-center rounded-lg border-2 border-gray-100 hover:border-indigo-300 transition bg-white shadow-sm"
                        title="Choose emoji"
                      >{{ form.icon }}</button>

                      <!-- emoji-mart Picker popup -->
                      <div
                        v-show="showEmojiPicker"
                        class="absolute top-full mt-2 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden"
                        @mousedown.stop
                      >
                        <div ref="pickerContainerRef"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Dates -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 italic">
                      Publish From
                    </label>
                    <input
                      v-model="form.startDate"
                      type="date"
                      class="w-full text-sm font-medium text-gray-800 border-2 border-gray-50 rounded-lg px-5 py-3 focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                      Till Date (Optional)
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.endDate"
                        type="date"
                        class="w-full text-sm font-medium text-gray-800 border-2 border-gray-50 rounded-lg px-5 py-3 focus:border-indigo-500 focus:outline-none transition"
                      />
                      <button
                        v-if="form.endDate"
                        @click="form.endDate = ''"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-400"
                      >✕</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Message Content -->
              <div>
                <label class="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                  Message Content
                </label>
                <textarea
                  v-model="form.content"
                  rows="4"
                  placeholder="eg., Attend the book fair to broaden your reading!"
                  class="w-full text-lg font-medium text-gray-800 border-2 border-gray-50 rounded-lg px-5 py-4 focus:border-indigo-500 focus:outline-none transition resize-none"
                ></textarea>
              </div>

              <!-- Submit -->
              <div class="flex justify-center pt-4">
                <button
                  @click="postAnnouncement"
                  class="w-full py-4 bg-indigo-600 text-white rounded-lg font-medium text-xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-200"
                >
                  Post Announcement
                </button>
              </div>
            </div>

            <!-- Live Preview Feature -->
            <!-- Provides a real-time visualization of what the announcement will look like to students -->
            <div class="bg-indigo-50/30 p-8 rounded-lg border-2 border-dashed border-indigo-100 flex flex-col justify-center">
              <h4 class="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-6 text-center">
                Live Student Preview
              </h4>
              <div class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl flex gap-6 items-start">
                <div class="p-4 bg-indigo-50 rounded-2xl text-4xl shrink-0 border border-indigo-100 shadow-sm flex items-center justify-center min-w-[80px] min-h-[80px]">
                  {{ form.icon }}
                </div>
                <div class="flex-grow mt-1">
                  <div class="flex flex-col gap-1 mb-3">
                    <h4 class="text-xl font-bold text-gray-800">
                      {{ form.title || 'Your Title Here' }}
                    </h4>
                    <div class="flex gap-2 items-center">
                      <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {{ form.startDate || 'Start Date' }}
                        {{ form.endDate ? 'to ' + form.endDate : '(Ongoing)' }}
                      </span>
                    </div>
                  </div>
                  <p class="text-gray-500 font-medium leading-relaxed">
                    {{ form.content || 'Your message will appear here...' }}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

 
        <!-- ══ ANNOUNCEMENT HISTORY VIEWER -->
        <div v-if="subTab === 'history'" class="space-y-6 animate-fade-in">

          <!-- Loading State -->
          <div v-if="historyLoading" class="flex flex-col items-center justify-center py-20 gap-3 text-indigo-400">
            <svg class="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span class="font-medium text-sm uppercase tracking-widest">Loading announcements…</span>
          </div>

          <!-- Error State -->
          <div v-else-if="historyError" class="py-16 text-center bg-red-50 rounded-xl border border-red-100">
            <p class="text-red-500 font-medium">{{ historyError }}</p>
            <button @click="loadHistory" class="mt-3 text-indigo-500 text-sm font-medium hover:underline">Retry</button>
          </div>

          <!-- Loaded State -->
          <template v-else>

            <!-- Active Announcements Section -->
            <section>
              <!-- Section header: green label + animated dot + count badge -->
              <h3 class="text-xs font-bold uppercase tracking-widest text-green-600 mb-3 flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Active
                <span class="ml-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px]">{{ activeAnnouncements.length }}</span>
              </h3>

              <!-- Empty sub-state: shown when no announcements are currently active. -->
              <div v-if="activeAnnouncements.length === 0" class="text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-100">
                <p class="text-gray-400 font-medium text-sm">No active announcements right now.</p>
              </div>

              <!-- Active cards list -->
              <div v-else class="space-y-3">
                <div
                  v-for="ann in activeAnnouncements"
                  :key="ann.id"
                  class="p-5 rounded-xl border-2 shadow-sm flex gap-5 items-start transition group relative overflow-hidden bg-white border-indigo-200 shadow-indigo-100 hover:border-indigo-400"
                >
                  <!-- Icon cell -->
                  <div class="p-4 rounded-xl text-3xl shrink-0 border shadow-sm transition group-hover:scale-110 flex items-center justify-center min-w-[80px] min-h-[80px] bg-indigo-50 border-indigo-100">
                    {{ parseContent(ann.content).icon }}
                  </div>

                  <!-- Body -->
                  <div class="flex-grow mt-1">
                    <div class="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <!-- Title -->
                      <h4 class="text-xl font-bold text-gray-800">{{ parseContent(ann.content).title }}</h4>

                      <!-- Metadata badges -->
                      <div class="flex gap-2 items-center flex-wrap">
                        <!-- Green "Active" status badge -->
                        <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold uppercase tracking-wider border border-green-200 shadow-sm">Active</span>

                        <!-- Post window pill -->
                        <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {{ fmtDate(ann.postDate) }}{{ ann.expiryDate ? ' → ' + fmtDate(ann.expiryDate) : ' (Ongoing)' }}
                        </span>

                        <!-- Delete button -->
                             announcement's database integer ID. The icon-only
                             button is intentionally subtle (gray) until hovered
                             (red) to prevent accidental clicks. A confirm() dialog
                             inside deleteAnnouncement() provides a second safety
                             gate before the database record is permanently removed. -->
                        <button
                          @click="deleteAnnouncement(ann.id)"
                          class="ml-1 text-gray-300 hover:text-red-500 transition-colors duration-200"
                          title="Delete announcement"
                        >✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Inactive / Expired Announcements Section -->
            <section>
              <!-- Section header -->
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-gray-300"></span>
                Inactive / Expired
                <span class="ml-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px]">{{ inactiveAnnouncements.length }}</span>
              </h3>

              <!-- Empty sub-state for when there are no expired announcements yet -->
              <div v-if="inactiveAnnouncements.length === 0" class="text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-100">
                <p class="text-gray-400 font-medium text-sm">No expired announcements.</p>
              </div>

              <!-- Inactive cards list -->
              <div v-else class="space-y-3">
                <div
                  v-for="ann in inactiveAnnouncements"
                  :key="ann.id"
                  class="p-5 rounded-xl border-2 shadow-sm flex gap-5 items-start transition group relative overflow-hidden bg-gray-50 border-gray-100 opacity-70 hover:opacity-100 grayscale-[0.3]"
                >
                  <!-- Icon -->
                  <div class="p-4 rounded-xl text-3xl shrink-0 border shadow-sm transition group-hover:scale-110 flex items-center justify-center min-w-[80px] min-h-[80px] bg-gray-100 border-gray-200">
                    {{ parseContent(ann.content).icon }}
                  </div>

                  <!-- Body -->
                  <div class="flex-grow mt-1">
                    <div class="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <!-- Title -->
                      <h4 class="text-xl font-bold text-gray-500">{{ parseContent(ann.content).title }}</h4>

                      <!-- Metadata badges -->
                      <div class="flex gap-2 items-center flex-wrap">
                        <!-- Gray "Expired" status badge -->
                        <span class="px-2 py-0.5 bg-gray-200 text-gray-500 rounded text-[9px] font-bold uppercase tracking-wider border border-gray-300">Expired</span>

                        <!-- Post window -->
                        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {{ fmtDate(ann.postDate) }}{{ ann.expiryDate ? ' → ' + fmtDate(ann.expiryDate) : ' (Ongoing)' }}
                        </span>

                        <!-- Delete button -->
                        <button
                          @click="deleteAnnouncement(ann.id)"
                          class="ml-1 text-gray-300 hover:text-red-500 transition-colors duration-200"
                          title="Delete announcement"
                        >✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </template>
        </div>

      </div>
    </main>
  </div>
</template>


<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease both;
}
</style>
