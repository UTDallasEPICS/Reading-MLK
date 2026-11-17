<script setup lang="ts">
defineProps<{ color: string; index: number; variant?: 'rainbow' | 'sunny' | 'ocean' }>()
</script>

<template>
  <g stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 6v9" :stroke="variant === 'ocean' ? '#22b8cf' : '#efad49'" stroke-width="1.4" />
    <g v-if="!variant || variant === 'rainbow'">
      <g v-if="index % 2 === 0">
        <path d="M4 39V32a18 18 0 0 1 36 0v7" stroke="#ff5e8a" stroke-width="6" fill="none" />
        <path d="M10 39v-7a12 12 0 0 1 24 0v7" stroke="#ffc83d" stroke-width="6" fill="none" />
        <path d="M16 39v-7a6 6 0 0 1 12 0v7" stroke="#32cda5" stroke-width="6" fill="none" />
        <path d="M0 44a6 6 0 0 1 5-10 7 7 0 0 1 12 5 5 5 0 0 1-3 8H4Z" fill="white" stroke="#b4d9ef" stroke-width=".8" />
        <path d="M27 44a6 6 0 0 1 5-10 7 7 0 0 1 12 5 5 5 0 0 1-3 8H31Z" fill="white" stroke="#b4d9ef" stroke-width=".8" />
      </g>
      <g v-else>
        <path d="m11 34-3 22 5-4 4 5 2-24" fill="#ff5e8a" />
        <path d="m20 34 1 24 4-5 5 3-2-23" fill="#4599ff" />
        <path d="m28 33 6 21 2-6 5 2-6-21" fill="#a875ff" />
        <path d="m22 12 5 10 11 1.5-8 8 2 11-10-5-10 5 2-11-8-8L17 22Z" fill="#ffc83d" stroke="#f59e0b" stroke-width="1" />
        <path d="m19 24 3-6 3 6" stroke="#fff5c2" stroke-width="2" fill="none" />
      </g>
    </g>
    <g v-else-if="variant === 'sunny'">
      <g v-if="index % 2 === 0">
        <path d="M22 12v4m0 30v4M3 31h4m30 0h4M8 17l3 3m22 22 3 3M8 45l3-3m22-22 3-3" stroke="#ff9639" stroke-width="2.5" />
        <circle cx="22" cy="31" r="12" fill="#ffce32" stroke="#f7a329" stroke-width="1" />
        <circle cx="18" cy="30" r="1.2" fill="#9a571d" />
        <circle cx="26" cy="30" r="1.2" fill="#9a571d" />
        <path d="M18 35q4 4 8 0" stroke="#9a571d" stroke-width="1.3" fill="none" />
        <circle cx="14" cy="34" r="2" fill="#ff9b70" />
        <circle cx="30" cy="34" r="2" fill="#ff9b70" />
      </g>
      <g v-else>
        <path d="m22 13 17 14-17 20L5 27Z" fill="#ff774c" />
        <path d="m22 13 17 14H22Z" fill="#ffce32" />
        <path d="M5 27h17v20Z" fill="#45c7ea" />
        <path d="M22 13v34M5 27h34" stroke="white" stroke-width=".8" stroke-opacity=".7" />
        <path d="M22 47q-7 4-3 8t-4 6" stroke="#ed9b51" fill="none" stroke-width="1" />
        <path d="m15 52 6 1-5 5Zm8 4-6-1 3-4Z" :fill="color" />
      </g>
    </g>
    <g v-else-if="variant === 'ocean'">
      <g v-if="index % 3 === 0">
        <path d="M31 32 43 21v22Z" fill="#ffb64d" />
        <path d="M3 32q13-21 31 0-18 21-31 0Z" :fill="color" stroke="#0788a9" stroke-width=".8" />
        <path d="M22 24v16" stroke="white" stroke-width="3" stroke-opacity=".7" />
        <circle cx="11" cy="30" r="2" fill="#11334b" />
        <circle cx="10.5" cy="29.5" r=".65" fill="white" />
        <circle cx="5" cy="17" r="2" fill="none" stroke="#66d6ed" />
        <circle cx="2" cy="11" r="1" fill="#66d6ed" />
      </g>
      <g v-else-if="index % 3 === 1">
        <path d="M22 47 2 26q-3-9 6-9 1-9 10-4 5-8 10 0 9-5 10 4 9 0 4 9Z" fill="#ff9b90" stroke="#e16b7c" stroke-width="1" />
        <path d="M22 44 9 23m13 21-5-25m5 25 5-25m-5 25 13-21" stroke="#ffe5d9" stroke-width="1.6" />
        <path d="M16 47h12l-2 5h-8Z" fill="#e16b7c" />
      </g>
      <g v-else>
        <path d="m22 14 5 12 13 2-10 9 3 14-11-7-12 7 3-14L3 28l14-2Z" fill="#ffbd45" stroke="#f49a33" stroke-width="1" />
        <circle cx="18" cy="32" r="1.2" fill="#a45f21" />
        <circle cx="26" cy="32" r="1.2" fill="#a45f21" />
        <path d="M19 37q3 3 6 0" stroke="#a45f21" stroke-width="1" fill="none" />
        <circle cx="7" cy="17" r="2" fill="none" stroke="#54d0df" />
      </g>
      <path d="M0 59q5-5 11 0t11 0 11 0 11 0" fill="none" stroke="#22c6d2" stroke-width="2" />
    </g>
  </g>
</template>
