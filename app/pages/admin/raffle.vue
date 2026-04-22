<script setup lang="ts">
definePageMeta({ ssr: false, layout: "admin" })

const {
  getLastMonday, formatDate,
} = useAdmin()

const {raffleWeekStart, raffleWinner, isSpinning, raffleFormGroup, raffleForms, raffleSubmissions, spinRaffle} = useRaffleSpin()


function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(async () => {
  
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
        <button
          v-if="!raffleWinner"
          class="btn-indigo"
          :disabled="raffleSubmissions === 0"
          @click="spinRaffle">
            SPIN 🎟️
        </button>
        <button v-else
          class="btn-ghost"
          :disabled="raffleSubmissions === 0"
          @click="spinRaffle"
        >
          RESPIN 🎟️
        </button>
      </div>
    </div>
    
    <!-- Main Section -->
      <!-- Spinning -->
      <div v-if="isSpinning" class="raffle-state spinning-state">
        <div class="raffle-emoji animate-spin-emoji">🎟️</div>
        <h3 class="spinning-text">Spinning...</h3>
      </div>

      <!-- Winner -->
      <div v-else class="raffle-state winner-state">
        <p class="raffle-section-text">Total Entries: {{ raffleSubmissions }}</p>

        <p v-if="raffleWinner" class="raffle-section-text">
          Winning Student: {{ raffleWinner }}
          Parent Name:
          Parent Email:
          Winning Ticket from Form: 
          Date Spun: 
        </p>
      </div>

    </div>
  </div>

</template>

<style scoped>
@import './styles/raffle.css';
@import './styles/builder.css';

</style>
