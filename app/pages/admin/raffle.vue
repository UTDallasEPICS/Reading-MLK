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
.raffle-wrap {
  max-width: 56rem;
  margin: 0 auto;
  text-align: center;
}

.raffle-heading {
  font-size: 3rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.25rem;
}

.raffle-sub {
  font-size: 1.25rem;
  font-weight: 500;
  color: #4f46e5;
  margin-bottom: 1.5rem;
}

/* ── Card ── */
.raffle-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px rgba(0,0,0,0.12);
  padding: 3rem;
  max-width: 36rem;
  margin: 0 auto;
  border-bottom: 8px solid #6366f1;
  position: relative;
  overflow: hidden;
}

@media (min-width: 1024px) { .raffle-card { padding: 3.5rem; } }

.raffle-state { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }

/* ── Emoji ── */
.raffle-emoji {
  font-size: 6rem;
  line-height: 1;
  user-select: none;
  transition: transform 0.3s;
}

.hover-spin { cursor: pointer; }
.hover-spin:hover { transform: rotate(12deg); }

/* ── Entries ── */
.raffle-entries { margin-bottom: 0.5rem; }
.entries-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}
.entries-count { font-size: 2.5rem; font-weight: 500; color: #111827; }

/* ── Spin button ── */
.btn-spin {
  background: #4f46e5;
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
  padding: 1.25rem 4rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(99,102,241,0.3);
  transition: all 0.2s;
}
.btn-spin:hover  { background: #4338ca; }
.btn-spin:active { transform: scale(0.95); }

/* ── Spinning ── */
.spinning-state { padding: 2.5rem 0; }

.spinning-text {
  font-size: 2rem;
  font-weight: 500;
  color: #4f46e5;
}

@keyframes spinEmoji {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.animate-spin-emoji { animation: spinEmoji 0.8s linear infinite; display: inline-block; }

/* ── Winner ── */
.winner-state { padding: 1.5rem 0; }
.winner-label { font-size: 2.5rem; font-weight: 500; color: #111827; }
.winner-name  { font-size: 2rem; font-weight: 500; color: #4f46e5; }
.winner-email { font-size: 1.125rem; font-weight: 500; color: #9ca3af; font-style: italic; }

@keyframes bounceEmoji {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-16px); }
}
.animate-bounce-emoji { animation: bounceEmoji 1s ease-in-out infinite; display: inline-block; }

.btn-restart {
  background: none;
  border: none;
  color: #9ca3af;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;
  transition: color 0.15s;
}
.btn-restart:hover { color: #6b7280; }
</style>
