<script setup lang="ts">
definePageMeta({ ssr: false, layout: "admin" })

const {
  getLastMonday, formatDate,
} = useAdmin()

const {loadRaffleData, raffleWeekStart, raffleWinner, raffleFormGroup, raffleSubmissions, spinRaffle, spinCount} = useRaffleSpin()

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

watch(raffleWeekStart, () => {
  loadRaffleData()
})

onMounted(() => {
  raffleWeekStart.value = toDateStr(new Date())
  loadRaffleData()
})

</script>

<template>
  <div class="raffle-wrap">

    <h2 class="raffle-heading">Weekly Raffle</h2>
    
    <!-- Main card -->
    <div class="section-card">
      
    <!-- Header Row -->  
    <div class="week-row">
      <div>
        <p class="field-hint">Selected Week</p>
        <h4 class="week-label">{{ raffleWeekStart ? 'Week of ' + getLastMonday(raffleWeekStart) : 'Select a week' }}</h4>
      </div>
      <div>
        <label class="field-label">Change Week Starting (Mon)</label>
        <input v-model="raffleWeekStart" type="date" class="input-base" data-builder-field="true"/>
      </div>
      <div>
        <p class="week-label">Total Entries: {{ raffleSubmissions?.length || 0 }}</p>
      </div>
      <div>
        <button
          v-if="!raffleWinner"
          class="btn-indigo"
          :disabled="raffleSubmissions?.length === 0 || !raffleFormGroup"
          @click="spinRaffle">
            SPIN 🎟️
        </button>
        <button v-else
          class="btn-ghost"
          :disabled="raffleSubmissions?.length === 0 || !raffleFormGroup"
          @click="spinRaffle">
          RESPIN 🎟️
        </button>
      </div>
    </div>
    
    <!-- Main Section -->
      <!-- Winner -->
      <div class="raffle-state winner-state">
        <template v-if="raffleWinner">
          <div class="raffle-section-text" :key="spinCount">
            Winning Student:<br/>
            <p class="raffle-winner-name">{{ raffleWinner.name }}</p>
            <br/>Parent Name:<br/>    
            <p class="raffle-winner-name">{{ (raffleWinner as any).Parent?.name || 'N/A' }}</p>
            <br/>Parent Email:<br/>
            <p class="raffle-winner-name">{{ (raffleWinner as any).Parent?.email || 'N/A' }}</p>
          </div>
        </template>
        <template v-else>
          <p class="raffle-section-text">No winner yet.</p>
        </template>
      </div>

    </div>
  </div>

</template>

<style scoped>
@import './styles/raffle.css';
@import './styles/builder.css';

</style>
