<script setup lang="ts">
definePageMeta({ ssr: false })
const { students, raffleWinner, isSpinning, spinRaffle } = useAdmin()
</script>

<template>
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-5xl font-black mb-8 text-gray-900">Weekly Raffle 🎟️</h2>

    <div class="bg-white rounded-[3rem] shadow-2xl p-16 max-w-xl mx-auto border-b-8 border-yellow-400 relative overflow-hidden">

      <!-- idle state -->
      <div v-if="!raffleWinner && !isSpinning">
        <div class="text-9xl mb-8 hover:rotate-12 transition cursor-pointer" @click="spinRaffle">🎟️</div>
        <button
          @click="spinRaffle"
          class="bg-yellow-400 hover:bg-yellow-500 text-white text-2xl font-black py-5 px-16 rounded-full shadow-xl transition active:scale-95"
        >
          SPIN IT!
        </button>
        <p class="text-gray-400 font-medium mt-6 text-sm">{{ students.length }} students in the pool</p>
      </div>

      <!-- spinning state -->
      <div v-else-if="isSpinning" class="py-10">
        <div class="text-9xl animate-spin mb-6">🎡</div>
        <h3 class="text-3xl font-bold text-yellow-600">Spinning...</h3>
      </div>

      <!-- winner state -->
      <div v-else class="py-6">
        <div class="text-9xl mb-6 animate-bounce">🥳</div>
        <h2 class="text-4xl font-black text-gray-900 mb-2">Winner!</h2>
        <p class="text-3xl font-bold text-purple-600 mb-6">{{ raffleWinner.name }}</p>
        <button
          @click="raffleWinner = null"
          class="text-gray-400 hover:text-gray-600 font-bold underline"
        >
          Start Over
        </button>
      </div>
    </div>

    <!-- Student list -->
    <div class="mt-12 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm max-w-xl mx-auto">
      <div class="p-4 bg-gray-50 border-b border-gray-200">
        <h3 class="font-black text-gray-700 uppercase tracking-widest text-xs">Students in Pool</h3>
      </div>
      <div class="divide-y divide-gray-100">
        <div v-for="student in students" :key="student.id" class="flex items-center gap-3 p-4">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white flex items-center justify-center text-xs font-black">
            {{ student.initials }}
          </div>
          <span class="font-bold text-gray-800">{{ student.name }}</span>
          <span class="ml-auto text-xs text-gray-400 font-medium">🎟️ {{ student.streak }} tickets</span>
        </div>
      </div>
    </div>
  </div>
</template>
