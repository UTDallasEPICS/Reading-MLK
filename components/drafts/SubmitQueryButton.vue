<template lang="pug">
button(
    class="btn",
    @click="handleSubmit",
    style="display: inline-block; padding: 0.5rem 1rem; font-size: 1rem; font-weight: bold; text-align: center; cursor: pointer; border: 1px solid #999; border-radius: 0.25rem; background-color: #fff; color: #333;"
  )
  | Search
</template>

<script setup lang="ts">


const props = defineProps<{ 
     
    parentfirstname: {
        type: String,
        default: ''
    },
    parentlastname: {
        type: String,
        default: ''
    }

 }>();

const emit = defineEmits(['submit']);

const handleSubmit = () => {
    // Emit an event to the parent component with the parentname
    emit('submit', props.parentfirstname, props.parentlastname);
    console.log(props.parentfirstname)
};


</script>