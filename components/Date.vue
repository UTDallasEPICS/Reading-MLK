<script lang="ts" setup>
export default {
  name: 'FormDate',
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
    // ...
  },
  data() {
    return {
      day: `${this.value ? new Date(this.value).getDate() : ''}`,
      month: `${this.value ? new Date(this.value).getMonth() + 1 : ''}`,
      year: `${this.value ? new Date(this.value).getFullYear(): ''}`,
    };
  },
  methods: {
    updateValue() {
      const timestamp = Date.parse(`${this.year.padStart(4, 0)}-${this.month}-${this.day}`);

      if (Number.isNaN(timestamp)) return;

      this.$emit('input', timestamp);
    },
  },
};
</script>

<template lang="pug">
    div(class ="form_date"; @keyup.capture="updateValue")
        input(v-if="showDay" v-model="day" class="form_date__input form_date--day" type="number" placeholder="dd")
        span(v-if="showDay && showMonth" class="form_date")
        input(v-if="showMonth" v-model="month" class="form_date__input form_date--month" type="number" placeholder="mm")
        span(v-if="showYear && (showDay || showMonth)" class="form_date__divider")
        input(v-if="showYear" v-model="year" class="form_date__input form_date--year" type="number" placeholder="yyyy")

</template>

<style>



</style>