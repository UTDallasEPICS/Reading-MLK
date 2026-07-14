<script setup lang="ts">
import ReaderStats from './readerStats.vue'

defineProps<{
  "tickets": Number,
  "xp": Number
}>()
</script>

<template>
<header class="max-w-4xl mx-auto flex justify-between items-center mb-8 px-2 relative z-[200]">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-heading font-bold text-2xl shadow-lg"
             style="background: var(--brand-indigo)">L</div>
        <div class="flex flex-col">
          <span class="font-heading font-bold text-2xl tracking-tight leading-none" style="color: var(--brand-dark)">
            Reading<span style="color: var(--brand-indigo)">Huddle</span>
          </span>
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--brand-mint)">Reading Buddy</span>
        </div>
      </div>

      <div>
        <ReaderStats :tickets="tickets" :xp="xp"/>
      </div>
    </header>
</template>