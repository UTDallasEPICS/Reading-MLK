<template lang="pug">
input.rounded-md.outline-0.border-box.w-full.p-3( v-model="value" class=" border border-gray-400 focus:border-gray-600")
</template>

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
