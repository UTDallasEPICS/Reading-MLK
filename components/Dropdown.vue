
<script lang = "ts" setup>
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
  Button.rounded-md.outline-0.border-box.w-full.p-3(
    style="border: 2px solid;"
    class='bg-white rounded-md border border-gray-700 border-solid'
    @click="toggleDropdown"
  )
    | {{ value || props.placeholder || 'Select an option' }}
    i.fas.fa-chevron-down.ml-2
  .absolute.z-10.w-full(v-if="isOpen")
    ul.bg-white.shadow-md.rounded-md.overflow-hidden
    div(class="border border-black border-solid p-4 list-none")
      li.p-3.cursor-pointer(
        v-for="option in options"
        @click="selectOption(option)"
        class="border-b border-black border-solid pb-1 border"
        ) {{ option }}
</template>
