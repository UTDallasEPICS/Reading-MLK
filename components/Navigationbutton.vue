<template lang="pug">
NuxtLink.items-center.px-2.py-2.text-base.rounded-md.cursor-pointer( class='text-gray-999 hover:text-black border border-gray-400 hover:border-green-999 transition duration-300 text-center' :to="to")
    slot
</template>
    
<script setup lang="ts">
const props = defineProps<{ to: string}>()
</script>