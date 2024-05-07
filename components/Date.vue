<script lang="ts" setup>
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: true,
  },
  showDay: {
    type: Boolean,
    default: true,
  },
  showMonth: {
    type: Boolean,
    default: true,
  },
  showYear: {
    type: Boolean,
    default: true,
  },
});

const valueDate = props.modelValue ? new Date(props.modelValue) : null;
const day = ref(valueDate ? valueDate.getDate().toString() : '');
const month = ref(valueDate ? (valueDate.getMonth() + 1).toString() : '');
const year = ref(valueDate ? valueDate.getFullYear().toString() : '');

const updateValue = () => {
  const timestamp = Date.parse(
    `${year.value.padStart(4, '0')}-${month.value.padStart(2, '0')}-${day.value.padStart(2, '0')}`
  );
  if (Number.isNaN(timestamp)) return;
  emit('update:modelValue', timestamp);
};
</script>

<template lang="pug">
div(class ="form_date" @keyup.capture="updateValue")
    input(v-if="showDay" v-model="day" class="form_date__input form_date--day" type="number" style="border-color:black;" placeholder="dd")
    span(v-if="showDay && showMonth" class="form_date")
    input(v-if="showMonth" v-model="month" class="form_date__input form_date--month" type="number" style="border-color:black;" placeholder="mm")
    span(v-if="showYear && (showDay || showMonth)" class="form_date__divider")
    input(v-if="showYear" v-model="year" class="form_date__input form_date--year" type="number" style="border-color:black;" placeholder="yyyy")
</template>
