<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()

const emit = defineEmits(["update:modelValue"])
const value = computed({  // recieves wtv you put in the string box
    get(){
        return props.modelValue
    },
    set(v: string){
        emit("update:modelValue", v)
    },
})
</script>

<template lang="pug">
input.rounded-md.outline-0.border-box.w-full.p-3( v-model="value" class="border border-gray-400 focus:border-gray-700" )
</template>