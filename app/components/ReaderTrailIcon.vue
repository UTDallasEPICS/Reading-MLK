<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg aria-hidden="true" viewBox="0 0 40 40" fill="none" class="h-8 w-8">
    <g v-if="name === 'Twinkling Stars'" fill="#fbbf24" stroke="#d97706" stroke-width="1.2" stroke-linejoin="round">
      <path d="m18 6 3.8 7.7 8.5 1.2-6.1 6 1.4 8.5-7.6-4-7.6 4 1.4-8.5-6.1-6 8.5-1.2Z" />
      <path d="m32 25 1.5 4.5L38 31l-4.5 1.5L32 37l-1.5-4.5L26 31l4.5-1.5Z" stroke="none" />
    </g>
    <g v-else-if="name === 'Confetti Rain'">
      <rect x="8" y="5" width="5" height="10" rx="1.5" fill="#f472b6" transform="rotate(-25 8 5)" />
      <rect x="25" y="8" width="5" height="9" rx="1.5" fill="#38bdf8" transform="rotate(25 25 8)" />
      <rect x="16" y="20" width="5" height="10" rx="1.5" fill="#fbbf24" transform="rotate(18 16 20)" />
      <rect x="29" y="26" width="5" height="8" rx="1.5" fill="#a78bfa" transform="rotate(-20 29 26)" />
      <circle cx="7" cy="28" r="2.5" fill="#2dd4bf" />
      <circle cx="22" cy="4" r="2" fill="#fb923c" />
    </g>
    <g v-else-if="name === 'Fireflies'">
      <circle cx="15" cy="16" r="11" fill="#fb923c" opacity=".15" />
      <circle cx="15" cy="16" r="7" fill="#fb923c" opacity=".3" />
      <circle cx="15" cy="16" r="4" fill="#f97316" />
      <circle cx="14" cy="15" r="1.5" fill="#ffedd5" />
      <circle cx="29" cy="28" r="8" fill="#fb923c" opacity=".18" />
      <circle cx="29" cy="28" r="4" fill="#fb923c" />
      <circle cx="28" cy="27" r="1.5" fill="#fff7ed" />
      <circle cx="30" cy="8" r="2" fill="#f59e0b" />
    </g>
    <g v-else-if="name === 'Falling Leaves'" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 28C2 15 17 6 29 6c0 13-5 26-18 23Z" fill="#fb923c" stroke="#c2410c" stroke-width="1.5" />
      <path d="M6 34 24 12m-11 15-1-9m7 2 6-1" stroke="#9a3412" stroke-width="1.5" />
      <path d="M25 29c0-6 6-9 12-8-1 7-5 12-11 10Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.2" />
    </g>
  </svg>
</template>
