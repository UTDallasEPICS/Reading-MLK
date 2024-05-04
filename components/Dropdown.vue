<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  options: string[];
  placeholder?: string; 
}>();

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(v: string) {
    emit('update:modelValue', v);
  }
});

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: string) => {
  value.value = option;
  isOpen.value = false;
};
</script>

<template lang="pug">
.relative.inline-block
  button.rounded-md.outline-0.border-box.w-full.p-3(
    style="border: 2px solid; border-color: black; border-radius: 9px;"
    @click="toggleDropdown"
  )
    | {{ value || props.placeholder || 'Select an option' }}
    i.fas.fa-chevron-down.ml-2
  .absolute.z-10.w-full(v-if="isOpen")
    ul.bg-white.shadow-md.rounded-md.overflow-hidden
    div(style = "border:2px solid ")
      li.p-3.cursor-pointer(
        v-for="option in options"
        @click="selectOption(option)"
      ) {{ option }}
</template>