<template lang="pug">
.relative.inline-block
  button.rounded-md.outline-0.border-box.w-full.p-3(
    style="border: 2px solid #C0C0C0;"
    @click="toggleDropdown"
  ) {{ value }}
    i.fas.fa-chevron-down.ml-2
  .absolute.z-10.w-full(v-if="isOpen")
    ul.bg-white.shadow-md.rounded-md.overflow-hidden(:style="{ width: dropdownWidth }")
      div(option-box-wrapper)
        div(option-box)(v-for="option in options" :key="option" @click="selectOption(option)" :class="{ 'selected': value === option }") {{ option }}
</template>
  
  <script lang="ts" setup>
  import { ref, defineProps, defineEmits, computed } from 'vue';
  
  const props = defineProps<{
    modelValue: string
    options: string[]
  }>()
  
  const emit = defineEmits(['update:modelValue'])
  
  const value = computed({
    get() {
      return props.modelValue
    },
    set(v: string) {
      emit('update:modelValue', v)
    }
  })
  
  const isOpen = ref(false)
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }
  
  const selectOption = (option: string) => {
    value.value = option;
    isOpen.value = false;
  }
  
  const dropdownWidth = computed(() => {
    const maxWidth = Math.max(...props.options.map(option => option.length)) * 10; // Adjust multiplier as needed
    return `${maxWidth}px`;
  });
  </script>
  
  <style lang="css">
  button {
    min-height: 40px; /* Adjust the height of the button */
    line-height: 1; /* Ensure proper vertical alignment of text */
  }
  
  .option-box-wrapper {
    display: flex; /* Display options in a flex container */
    flex-direction: column; /* Stack options vertically */
  }
  
  .option-box {
    border: 1px solid #ccc; /* Border for each option */
    border-radius: 4px; /* Adjust border radius for rounded corners */
    padding: 8px 12px; /* Adjust padding for better spacing */
    margin-bottom: 8px; /* Adjust margin between options */
    cursor: pointer; /* Change cursor to pointer when hovering over option */
  }
  
  .selected {
    background-color: lightblue; /* Change background color of selected option */
  }
  </style>
  