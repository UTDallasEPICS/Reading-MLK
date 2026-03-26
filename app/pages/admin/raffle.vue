<script setup lang="ts">
definePageMeta({ ssr: false })

const { raffleWinner, isSpinning, raffleWeek, raffleSubmissions, spinRaffle } = useAdmin()
</script>

<template>
  <div class="raffle-wrap">

    <h2 class="raffle-heading">Weekly Raffle</h2>
    <p class="raffle-sub">Spinning for: {{ raffleWeek }}</p>

    <!-- Main card -->
    <div class="raffle-card">

      <!-- Idle -->
      <div v-if="!raffleWinner && !isSpinning" class="raffle-state">
        <div class="raffle-emoji hover-spin" @click="spinRaffle">🎟️</div>
        <div class="raffle-entries">
          <p class="entries-label">Total Entries</p>
          <p class="entries-count">{{ raffleSubmissions }}</p>
        </div>
        <button class="btn-spin" @click="spinRaffle">SPIN IT!</button>
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
        <p v-if="raffleWinner.email" class="winner-email">{{ raffleWinner.email }}</p>
        <button class="btn-restart" @click="raffleWinner = null">Start Over</button>
      </div>

    </div>

  </div>
</template>

<style scoped>
@import './styles/raffle.css';
</style>
