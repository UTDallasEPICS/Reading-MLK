<script lang = "ts" setup>
const props = defineProps<{ modelValue: number }>()

const emit = defineEmits(["update:modelValue"])
const value = computed({
    get(){
        return props.modelValue
    },
    set(v: number){
        emit("update:modelValue", v)
    },
})
</script>

<template lang="pug">
input.rounded-md.outline-0.border-box.w-full.p-3(style="border: 2px solid; border-color: black;" v-model="value")
</template>