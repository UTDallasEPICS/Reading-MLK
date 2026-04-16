<script setup lang="ts">
definePageMeta({ ssr: false, layout: "admin" })

const {
  raffleWinner, isSpinning, raffleSubmissions, spinRaffle,
  raffleFormGroups, raffleSelectedGroupId, raffleWeekLabel,
  raffleCalendarOpen, raffleLoading, rafflePreviousWinner,
  loadRaffleFormGroups, selectRaffleGroupByDate, formatDate,
} = useAdmin()

// Calendar state
const calendarDate = ref(new Date())
const calendarYear = computed(() => calendarDate.value.getFullYear())
const calendarMonth = computed(() => calendarDate.value.getMonth())
const calendarMonthName = computed(() =>
  calendarDate.value.toLocaleString('en-US', { month: 'long', year: 'numeric' })
)

const calendarDays = computed(() => {
  const year = calendarYear.value
  const month = calendarMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday = 0
  const days: Array<{ date: number; dateStr: string; inMonth: boolean; isInGroup: boolean }> = []

  // Previous month filler
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d.getDate(), dateStr: toDateStr(d), inMonth: false, isInGroup: isDateInAnyGroup(d) })
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dt = new Date(year, month, d)
    days.push({ date: d, dateStr: toDateStr(dt), inMonth: true, isInGroup: isDateInAnyGroup(dt) })
  }

  // Fill remaining to complete grid
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    days.push({ date: d.getDate(), dateStr: toDateStr(d), inMonth: false, isInGroup: isDateInAnyGroup(d) })
  }

  return days
})

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isDateInAnyGroup(d: Date): boolean {
  const t = d.getTime()
  return raffleFormGroups.value.some((g: any) => {
    const start = new Date(g.startDate).getTime()
    const end = g.endDate ? new Date(g.endDate).getTime() : start + 6 * 24 * 60 * 60 * 1000
    return t >= start && t <= end
  })
}

function prevMonth() {
  calendarDate.value = new Date(calendarYear.value, calendarMonth.value - 1, 1)
}
function nextMonth() {
  calendarDate.value = new Date(calendarYear.value, calendarMonth.value + 1, 1)
}
function pickDay(dateStr: string) {
  selectRaffleGroupByDate(dateStr)
}

// Close calendar when clicking outside
function onCalendarOverlay() {
  raffleCalendarOpen.value = false
}

onMounted(async () => {
  await loadRaffleFormGroups()
})
</script>

<template>
  <div class="raffle-wrap">

    <h2 class="raffle-heading">Weekly Raffle</h2>

    <!-- Week Picker -->
    <div class="raffle-week-picker">
      <button class="week-picker-btn" @click="raffleCalendarOpen = !raffleCalendarOpen">
        <span class="week-picker-icon">📅</span>
        <span class="week-picker-label">{{ raffleWeekLabel }}</span>
        <span class="week-picker-chevron" :class="{ open: raffleCalendarOpen }">▾</span>
      </button>

      <!-- Calendar Dropdown -->
      <Teleport to="body">
        <div v-if="raffleCalendarOpen" class="calendar-overlay" @click.self="onCalendarOverlay">
          <div class="calendar-dropdown">
            <div class="calendar-header">
              <button class="cal-nav" @click="prevMonth">‹</button>
              <span class="cal-month-label">{{ calendarMonthName }}</span>
              <button class="cal-nav" @click="nextMonth">›</button>
            </div>

            <div class="calendar-weekdays">
              <span v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d">{{ d }}</span>
            </div>

            <div class="calendar-grid">
              <button
                v-for="(day, i) in calendarDays" :key="i"
                class="cal-day"
                :class="{
                  'out-month': !day.inMonth,
                  'in-group': day.isInGroup,
                }"
                :disabled="!day.isInGroup"
                @click="day.isInGroup && pickDay(day.dateStr)"
              >
                {{ day.date }}
              </button>
            </div>

            <!-- Quick-select list of all form groups -->
            <div class="calendar-quick-list">
              <p class="quick-list-title">All Weeks</p>
              <button
                v-for="g in raffleFormGroups" :key="g.id"
                class="quick-list-item"
                :class="{ active: raffleSelectedGroupId === g.id }"
                @click="raffleSelectedGroupId = g.id; raffleCalendarOpen = false"
              >
                {{ formatDate(g.startDate) }}
                <span v-if="g.endDate"> – {{ formatDate(g.endDate) }}</span>
                <span v-if="g.raffleWinner" class="quick-badge">🏆</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>

    <!-- Previous Winner Badge -->
    <div v-if="rafflePreviousWinner && !raffleWinner && !isSpinning" class="previous-winner-badge">
      <span class="prev-badge-icon">🏆</span>
      Previous winner: <strong>{{ rafflePreviousWinner.name }}</strong>
    </div>

    <!-- Loading -->
    <div v-if="raffleLoading" class="raffle-card">
      <div class="raffle-state">
        <div class="raffle-emoji animate-spin-emoji">⏳</div>
        <p class="spinning-text">Loading entries…</p>
      </div>
    </div>

    <!-- Main card -->
    <div v-else class="raffle-card">

      <!-- Idle -->
      <div v-if="!raffleWinner && !isSpinning" class="raffle-state">
        <div class="raffle-emoji hover-spin" @click="spinRaffle">🎟️</div>
        <div class="raffle-entries">
          <p class="entries-label">Total Entries</p>
          <p class="entries-count">{{ raffleSubmissions }}</p>
        </div>
        <button
          class="btn-spin"
          :disabled="raffleSubmissions === 0"
          @click="spinRaffle"
        >
          SPIN IT!
        </button>
        <p v-if="raffleSubmissions === 0" class="no-entries-hint">
          No submissions found for this week.
        </p>
      </div>

      <!-- Spinning -->
      <div v-else-if="isSpinning" class="raffle-state spinning-state">
        <div class="raffle-emoji animate-spin-emoji">🎟️</div>
        <h3 class="spinning-text">Spinning...</h3>
      </div>

      <!-- Winner -->
      <div v-else class="raffle-state winner-state">
        <div class="raffle-emoji animate-bounce-emoji">🥳</div>
        <h2 class="winner-label">Winner!</h2>
        <p class="winner-name">{{ raffleWinner.name }}</p>
        <p v-if="raffleWinner.formTitle" class="winner-form">
          From: {{ raffleWinner.formTitle }}
        </p>
        <button class="btn-restart" @click="raffleWinner = null">Draw Again</button>
      </div>

    </div>

  </div>
</template>

<style scoped>
@import './styles/raffle.css';

/* ── Week Picker ── */
.raffle-week-picker {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.week-picker-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  transition: all 0.25s ease;
}
.week-picker-btn:hover {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.45);
  transform: translateY(-1px);
}

.week-picker-icon { font-size: 1.3rem; }
.week-picker-chevron {
  transition: transform 0.25s ease;
  font-size: 0.9rem;
}
.week-picker-chevron.open { transform: rotate(180deg); }

/* ── Calendar ── */
.calendar-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  animation: fadeIn 0.15s ease;
}

.calendar-dropdown {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.18);
  padding: 1.5rem;
  width: 22rem;
  animation: slideDown 0.2s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.cal-nav {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4f46e5;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.cal-nav:hover { background: #eef2ff; }

.cal-month-label {
  font-weight: 600;
  font-size: 1.05rem;
  color: #1e1b4b;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  color: #374151;
  cursor: default;
  transition: all 0.15s ease;
}
.cal-day.out-month { color: #d1d5db; }
.cal-day.in-group {
  background: #eef2ff;
  color: #4338ca;
  font-weight: 600;
  cursor: pointer;
}
.cal-day.in-group:hover {
  background: #6366f1;
  color: white;
  transform: scale(1.1);
}
.cal-day:disabled:not(.in-group) {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── Quick-list ── */
.calendar-quick-list {
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
  padding-top: 0.75rem;
  max-height: 10rem;
  overflow-y: auto;
}

.quick-list-title {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.quick-list-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.5rem 0.65rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
}
.quick-list-item:hover { background: #f3f4f6; }
.quick-list-item.active {
  background: #eef2ff;
  color: #4338ca;
  font-weight: 600;
}

.quick-badge { margin-left: auto; font-size: 0.9rem; }

/* ── Previous Winner ── */
.previous-winner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  font-size: 0.95rem;
  padding: 0.6rem 1.25rem;
  border-radius: 9999px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
}

.prev-badge-icon { font-size: 1.1rem; }

/* ── Extra States ── */
.no-entries-hint {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-top: -0.5rem;
}

.btn-spin:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.winner-form {
  font-size: 0.95rem;
  color: #9ca3af;
  font-style: italic;
}
</style>
