<script setup lang="ts">
// Disable Server-Side Rendering for this admin page to ensure client-side execution
definePageMeta({ ssr: false, layout: "admin" })

// `watch` is imported alongside the standard reactivity helpers so that we can
// observe changes to `subTab` and trigger an API fetch whenever the user
// navigates to the History tab.
import { ref, reactive, computed, watch } from 'vue'

// Setup props to receive the array of existing announcements from parent components
const props = defineProps({
  announcements: {
    type: Array,
    default: () => []
  }
})

// Expose 'add' and 'delete' events to notify parent components of data changes
const emit = defineEmits(['add', 'delete'])

// State to manage the active sub-tab view ('creation' or 'history')
const subTab = ref('creation')

// Helper for generating today's date in YYYY-MM-DD format for initial HTML date input value
const todayStr = new Date().toISOString().split('T')[0]

// Reactive object binding to the form inputs in the announcement creation tab
const form = reactive({
  title: '',
  content: '',
  icon: '🌟',
  startDate: todayStr,
  endDate: ''
})

// ── History Tab State ────────────────────────────────────────────────────────
//
// `allAnnouncements` holds the full list of announcement records fetched from
// the database via GET /api/announcement. It starts as an empty array and gets
// populated each time the user opens the History tab.
const allAnnouncements = ref<any[]>([])

// `historyLoading` is a boolean flag that is set to true while the API request
// is in flight. The template uses this to display a spinner instead of empty
// content, so the user knows data is being fetched.
const historyLoading = ref(false)

// `historyError` stores any error message string returned by a failed API call.
// When non-null, the template shows a red error panel with a Retry button
// instead of the announcement lists.
const historyError = ref<string | null>(null)

// parseContent
// ------------
// Handles two storage formats that may exist in the database:
//
// 1. Object (new records): The `content` column is defined as `Json?` and was
//    correctly posted as a plain JS object. Prisma deserializes it automatically
//    before returning, so `raw` arrives here as `{ icon, title, body }` already.
//
// 2. String (legacy records): Older records were posted using JSON.stringify()
//    before the value was sent through Prisma's `Json?` serialiser. This caused
//    double-encoding — Prisma stored a JSON string of a JSON string. When read
//    back, Prisma decodes the outer layer and returns the inner string, e.g.
//    '{"icon":"🌟","title":"...","body":"..."}'.
//    We detect this case (typeof raw === 'string') and JSON.parse it ourselves.
function parseContent (raw: any): { icon: string; title: string; body: string } {
  // New records: Prisma already returned a proper object
  if (raw && typeof raw === 'object') return raw as { icon: string; title: string; body: string }
  // Legacy records: raw is a JSON string — parse it back to an object
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as { icon: string; title: string; body: string } }
    catch { return { icon: '📢', title: raw, body: '' } }  // malformed — show string as title
  }
  return { icon: '📢', title: '', body: '' }
}

// isActive
// --------
// Determines whether a given announcement should be considered "currently active"
// based on the current date/time compared to the announcement's postDate and
// optional expiryDate fields (both stored as ISO 8601 UTC strings in the DB).
//
// An announcement is active when:
//   1. Its postDate is in the past (i.e., it has already been published), AND
//   2. Either it has no expiryDate (ongoing), OR its expiryDate is in the future.
//
// Returns false (inactive) if the announcement is scheduled for the future,
// or if its expiry date has already passed.
function isActive (ann: any) {
  const now = new Date()

  // Not yet published — postDate is still in the future
  if (new Date(ann.postDate) > now) return false

  // Already expired — expiryDate exists and is in the past
  if (ann.expiryDate && new Date(ann.expiryDate) < now) return false

  return true
}

// fmtDate
// -------
// Converts an ISO 8601 date string (e.g. "2026-04-09T00:00:00.000Z") into a
// human-readable short date (e.g. "Apr 9, 2026") for display in the history
// cards. Returns null if no date string was provided (used for optional
// expiryDate fields that can be null in the database).
function fmtDate (iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// activeAnnouncements
// -------------------
// A computed list that re-filters allAnnouncements every time the underlying
// data changes. Contains only announcements currently visible to students
// (postDate has passed AND expiryDate has not passed or is absent).
const activeAnnouncements = computed(() => allAnnouncements.value.filter(isActive))

// inactiveAnnouncements
// ---------------------
// The complement of activeAnnouncements — all records that are either not yet
// published (scheduled) or whose expiry date has already passed. These are
// displayed in the "Inactive / Expired" section with a muted, grayscale style.
const inactiveAnnouncements = computed(() => allAnnouncements.value.filter(a => !isActive(a)))

// loadHistory
// -----------
// Asynchronously fetches all announcement records from the API endpoint
// GET /api/announcement (no query params = returns every record, both active
// and expired). On success it populates `allAnnouncements`, which automatically
// causes both computed lists to re-evaluate. On failure it stores the error
// message in `historyError` for display. The `historyLoading` flag wraps the
// entire request so the template can show a spinner during the fetch.
async function loadHistory () {
  historyLoading.value = true
  historyError.value = null   // clear any previous error before retrying
  try {
    // $fetch is Nuxt's built-in HTTP utility (wraps native fetch with nice
    // error handling). Returns the parsed JSON response body directly.
    allAnnouncements.value = await $fetch('/api/announcement')
  } catch (e: any) {
    // Capture the error message; fall back to a generic string if none exists
    historyError.value = e?.message ?? 'Failed to load announcements.'
  } finally {
    // Always turn off the loading flag, even if the request failed
    historyLoading.value = false
  }
}

// Watcher — trigger fetch on tab switch
// -------------------------------------
// We watch the `subTab` ref so that every time the user clicks the
// "Current/Past Announcements" button (setting subTab to 'history'), the
// history data is freshly loaded from the database. This means the list is
// always up-to-date without needing a manual refresh button.
watch(subTab, (tab) => { if (tab === 'history') loadHistory() })

// deleteAnnouncement
// ------------------
// Sends a DELETE request to /api/announcement/:id, which is handled by the
// dynamic [id].ts route file. On success it removes the record from the local
// `allAnnouncements` array using splice(), so the UI updates instantly without
// needing another full API fetch. On failure it alerts the admin with the
// error message returned by the server.
//
// The function first asks for a confirmation via window.confirm() so the admin
// cannot accidentally wipe an announcement with a stray click.
async function deleteAnnouncement (id: number) {
  // Show a native browser confirm dialog before proceeding with an irreversible
  // database operation. If the admin clicks "Cancel" the function exits early.
  if (!confirm('Are you sure you want to permanently delete this announcement?')) return

  try {
    // $fetch automatically sets the correct Content-Type and parses the JSON
    // response. The id is interpolated directly into the URL path, which maps
    // to the [id] segment of /server/api/announcement/[id].ts.
    await $fetch(`/api/announcement/${id}`, { method: 'DELETE' })

    // Optimistic local update: find the deleted record's index in the reactive
    // array and remove it. Because `allAnnouncements` is a ref that both
    // `activeAnnouncements` and `inactiveAnnouncements` are computed from,
    // both computed lists will automatically re-evaluate.
    const idx = allAnnouncements.value.findIndex(a => a.id === id)
    if (idx !== -1) allAnnouncements.value.splice(idx, 1)
  } catch (e: any) {
    // Surface the server's error message if available, otherwise show a
    // generic fallback so the admin knows the operation did not succeed.
    alert(e?.data?.error ?? 'Failed to delete announcement. Please try again.')
  }
}

// Function to handle the form submission and upload announcement data to the database
async function postAnnouncement () {
  // Validate that required fields are not empty
  if (!form.title.trim() || !form.content.trim()) {
    alert('Please fill in title and message!')
    return
  }

  try {
    // Format the start and end dates into proper ISO 8601 strings for backend compatibility.
    // The non-null assertion (`!`) is safe here because the empty-string guard above
    // already ensured form fields are populated; startDate always has a default value.
    const postDate = new Date(form.startDate!).toISOString()
    const expiryDate = form.endDate ? new Date(form.endDate).toISOString() : null

    // Build a plain JS object for the `content` field.
    // The Prisma schema defines `content` as `Json?`, which means Prisma handles
    // serialization automatically — we must NOT call JSON.stringify() here.
    // Passing a raw string would store it double-encoded (a JSON string containing
    // a JSON string), which would break the reader home display.
    const content = {
      icon: form.icon,
      title: form.title,
      body: form.content
    }

    // Perform a POST request to our customized API endpoint
    const newAnn = await $fetch('/api/announcement', {
      method: 'POST',
      body: {
        content,
        postDate,
        expiryDate,
        author: null // Hardcoded author based on current functionality
      }
    })

    // Emit event up to parent to visually append the newly-returned announcement object
    emit('add', {
      title: form.title,
      content: form.content,
      icon: form.icon,
      startDate: form.startDate,
      endDate: form.endDate,
      weekStart: '',
      day: ''
    })

    // Reset the form fields after successful submission
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

// // State managing the date criteria to filter historical records
// const filterWeek = ref('')

// // Computed property that re-evaluates the array of announcements shown in 'history' 
// // based on whether a specific week start has been selected by the user.
// const filteredAnnouncements = computed(() => {
//   if (!filterWeek.value) return props.announcements
//   return props.announcements.filter(ann => ann.weekStart === filterWeek.value)
// })

// // Helper method used in the history layout to determine whether 
// // an announcement badge should show "Active" or "Expired"
// function isActive (ann) {
//   const today = new Date().toISOString().split('T')[0]
//   if (ann.startDate > today) return false
//   if (ann.endDate && ann.endDate < today) return false
//   return true
// }
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
                    <select
                      v-model="form.icon"
                      class="w-24 text-sm font-medium border-2 border-gray-50 rounded-lg px-2 focus:border-indigo-500 focus:outline-none transition text-gray-700"
                    >
                      <option value="⚠️">Alert</option>
                      <option value="🌟">Star</option>
                      <option value="🎉">Party</option>
                      <option value="🔔">Bell</option>
                      <option value="📅">Date</option>
                      <option value="🍎">Apple</option>
                      <option value="📖">Book</option>
                      <option value="🏆">Trophy</option>
                    </select>
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

 
        <!-- ══ ANNOUNCEMENT HISTORY VIEWER ══ ──────────────────────────────────
             This entire block is only mounted when the user clicks the
             "Current/Past Announcements" tab (subTab === 'history').
             It is hidden (unmounted from the DOM) while the creation form
             is active, which also means it re-fetches from the API fresh
             each time the user opens it.
        ──────────────────────────────────────────────────────────────────── -->
        <div v-if="subTab === 'history'" class="space-y-6 animate-fade-in">

          <!-- ── Loading State ─────────────────────────────────────────────────
               Shown exclusively while `historyLoading` is true, i.e. while
               the GET /api/announcement request is still in flight.
               A spinning SVG provides visual feedback so the user knows
               the page is working and not frozen.
          ──────────────────────────────────────────────────────────────────── -->
          <div v-if="historyLoading" class="flex flex-col items-center justify-center py-20 gap-3 text-indigo-400">
            <svg class="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span class="font-medium text-sm uppercase tracking-widest">Loading announcements…</span>
          </div>

          <!-- ── Error State ────────────────────────────────────────────────────
               Shown when `historyError` is non-null, meaning the fetch failed
               (network error, server error, etc.). Displays the raw error
               message and a Retry button that calls loadHistory() again.
               Uses v-else-if so it only renders when loading is already false.
          ──────────────────────────────────────────────────────────────────── -->
          <div v-else-if="historyError" class="py-16 text-center bg-red-50 rounded-xl border border-red-100">
            <p class="text-red-500 font-medium">{{ historyError }}</p>
            <!-- Clicking Retry calls loadHistory() which resets historyError
                 and re-attempts the API call. -->
            <button @click="loadHistory" class="mt-3 text-indigo-500 text-sm font-medium hover:underline">Retry</button>
          </div>

          <!-- ── Loaded State ───────────────────────────────────────────────────
               The <template v-else> renders when loading is false AND there
               is no error. Using <template> (a non-rendering wrapper) keeps
               the DOM clean — it groups the two <section> elements without
               adding an extra wrapping div.
          ──────────────────────────────────────────────────────────────────── -->
          <template v-else>

            <!-- ── Active Announcements Section ──────────────────────────────────
                 Displays only the announcements from the `activeAnnouncements`
                 computed list (postDate has passed, expiryDate has not).
                 The pulsing green dot and badge count give a quick visual cue
                 that these are currently live for students.
            ──────────────────────────────────────────────────────────────────── -->
            <section>
              <!-- Section header: green label + animated dot + count badge -->
              <h3 class="text-xs font-bold uppercase tracking-widest text-green-600 mb-3 flex items-center gap-2">
                <!-- Pulsing dot: the CSS `animate-pulse` gives this a gentle
                     heartbeat effect to reinforce that these are "live" -->
                <span class="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Active
                <!-- Count badge: reactively shows how many active announcements
                     exist without the user needing to count the cards -->
                <span class="ml-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px]">{{ activeAnnouncements.length }}</span>
              </h3>

              <!-- Empty sub-state: shown when no announcements are currently active.
                   Provides clear messaging rather than a blank area. -->
              <div v-if="activeAnnouncements.length === 0" class="text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-100">
                <p class="text-gray-400 font-medium text-sm">No active announcements right now.</p>
              </div>

              <!-- Active cards list: rendered only when there is at least one
                   active announcement. Each card uses the `group` Tailwind
                   utility so that hovering the card also animates the icon. -->
              <div v-else class="space-y-3">
                <!-- v-for iterates over `activeAnnouncements` (the computed
                     subset). :key uses the database-assigned `id` to help Vue
                     efficiently diff and update the DOM. -->
                <div
                  v-for="ann in activeAnnouncements"
                  :key="ann.id"
                  class="p-5 rounded-xl border-2 shadow-sm flex gap-5 items-start transition group relative overflow-hidden bg-white border-indigo-200 shadow-indigo-100 hover:border-indigo-400"
                >
                  <!-- Icon cell: parseContent() decodes the stored JSON string
                       and returns the `icon` emoji field. The icon scales up
                       slightly on card hover via the `group-hover:scale-110`
                       utility applied to this child element. -->
                  <div class="p-4 rounded-xl text-3xl shrink-0 border shadow-sm transition group-hover:scale-110 flex items-center justify-center min-w-[80px] min-h-[80px] bg-indigo-50 border-indigo-100">
                    {{ parseContent(ann.content).icon }}
                  </div>

                  <!-- Body: contains the announcement title and metadata row -->
                  <div class="flex-grow mt-1">
                    <div class="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <!-- Title extracted from the parsed JSON content object -->
                      <h4 class="text-xl font-bold text-gray-800">{{ parseContent(ann.content).title }}</h4>

                      <!-- Metadata badges: status pill + post window + delete button -->
                      <div class="flex gap-2 items-center flex-wrap">
                        <!-- Green "Active" status badge -->
                        <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold uppercase tracking-wider border border-green-200 shadow-sm">Active</span>

                        <!-- Post window pill: shows "Apr 9, 2026 → May 1, 2026"
                             or "Apr 9, 2026 (Ongoing)" if no expiry was set.
                             fmtDate() converts the raw ISO string from the DB
                             into a short, locale-aware date string. -->
                        <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {{ fmtDate(ann.postDate) }}{{ ann.expiryDate ? ' → ' + fmtDate(ann.expiryDate) : ' (Ongoing)' }}
                        </span>

                        <!-- Delete button — calls deleteAnnouncement() with this
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

            <!-- ── Inactive / Expired Announcements Section ───────────────────────
                 Displays all announcements that are NOT currently active:
                 either scheduled for the future or past their expiry date.
                 The muted gray palette and reduced opacity visually de-emphasize
                 these cards relative to the active ones above.
            ──────────────────────────────────────────────────────────────────── -->
            <section>
              <!-- Section header: gray label + static dot + count badge -->
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <!-- Static (non-pulsing) dot to contrast with the live Active section -->
                <span class="inline-block w-2 h-2 rounded-full bg-gray-300"></span>
                Inactive / Expired
                <!-- Count badge for expired/scheduled announcements -->
                <span class="ml-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px]">{{ inactiveAnnouncements.length }}</span>
              </h3>

              <!-- Empty sub-state for when there are no expired announcements yet -->
              <div v-if="inactiveAnnouncements.length === 0" class="text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-100">
                <p class="text-gray-400 font-medium text-sm">No expired announcements.</p>
              </div>

              <!-- Inactive cards list: same structure as active cards but with
                   muted colors and a partial grayscale filter applied via
                   `grayscale-[0.3]`. Hovering restores full opacity
                   (`hover:opacity-100`) to allow the admin to still read details. -->
              <div v-else class="space-y-3">
                <div
                  v-for="ann in inactiveAnnouncements"
                  :key="ann.id"
                  class="p-5 rounded-xl border-2 shadow-sm flex gap-5 items-start transition group relative overflow-hidden bg-gray-50 border-gray-100 opacity-70 hover:opacity-100 grayscale-[0.3]"
                >
                  <!-- Icon: uses gray background instead of indigo to reinforce
                       the inactive/expired visual state -->
                  <div class="p-4 rounded-xl text-3xl shrink-0 border shadow-sm transition group-hover:scale-110 flex items-center justify-center min-w-[80px] min-h-[80px] bg-gray-100 border-gray-200">
                    {{ parseContent(ann.content).icon }}
                  </div>

                  <!-- Body: same layout as active cards but with gray text colors -->
                  <div class="flex-grow mt-1">
                    <div class="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <!-- Title in muted gray to reinforce the inactive state -->
                      <h4 class="text-xl font-bold text-gray-500">{{ parseContent(ann.content).title }}</h4>

                      <!-- Metadata badges: gray "Expired" pill + post window + delete button -->
                      <div class="flex gap-2 items-center flex-wrap">
                        <!-- Gray "Expired" status badge (contrasts with the green
                             Active badge used in the section above) -->
                        <span class="px-2 py-0.5 bg-gray-200 text-gray-500 rounded text-[9px] font-bold uppercase tracking-wider border border-gray-300">Expired</span>

                        <!-- Post window: same fmtDate helper as the active section -->
                        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {{ fmtDate(ann.postDate) }}{{ ann.expiryDate ? ' → ' + fmtDate(ann.expiryDate) : ' (Ongoing)' }}
                        </span>

                        <!-- Delete button — identical behaviour to the active section's
                             delete button. Expired records are safe to remove and
                             the admin may want to clean up old announcements from
                             the history list. The same deleteAnnouncement() function
                             is reused here since the only difference between active
                             and expired cards is visual styling. -->
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
