<script lang="ts" setup>
import '@vuepic/vue-datepicker/dist/main.css';
import "vue-select/dist/vue-select.css";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
const props = defineProps<{modelValue:any}>()
const emit = defineEmits(["remove", "update:modelValue"])
// button click = emit('remove')
const handleDeletion = () => {
    emit("remove")
}

const first_name = computed({
    get() {
        return props.modelValue?.first_name || ""
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, first_name: v})
    },
});
const last_name = computed({
    get() {
        return props.modelValue?.last_name || ""
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, last_name: v})
    },
});
const pref_name = computed({
    get() {
        return props.modelValue?.pref_name || ""
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, pref_name: v})
    },
});
const age = computed({
    get() {
        return props.modelValue?.age
    },
    set(v:number){
        emit("update:modelValue", {...props.modelValue, age: v})
    },
});
const grade = computed({
    get() {
        return props.modelValue?.grade
    },
    set(v:number){
        emit("update:modelValue", {...props.modelValue, grade: v})
    },
});
const reading_lvl = computed({
    get() {
        return props.modelValue?.reading_lvl
    },
    set(v:number){
        emit("update:modelValue", {...props.modelValue, reading_lvl: v})
    },
});
const birth_date = computed({
    get(){
        return props.modelValue?.birth_date
    },
    set(v: Date){
        emit("update:modelValue",{...props.modelValue, birth_date: v})
    },

});
const gender = computed({
    get() {
        return props.modelValue?.gender || ""
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, gender: v})
    },
});
const school_name = computed({
    get() {
        return props.modelValue?.school_name || ""
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, school_name: v})
    },
});
const school_dist = computed({
    get() {
        return props.modelValue?.school_dist || ""
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, school_dist: v})
    },
});
const pref_lang = computed({
    get() {
        return props.modelValue?.pref_lang || ""
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, pref_lang: v})
    },
});
</script>

<template lang = "pug">
.min-h-screen.p-6.bg-gray-100.flex.items-center.justify-center
    .container.max-w-screen-lg.mx-auto
        div
            .bg-white.rounded.shadow-lg.p-4.px-4.p-8(class="md:mb-6")
                .grid.gap-4.gap-y-2.text-sm.grid-cols-1(class="lg:grid-cols-3")
                    .text-gray-600
                        p.font-medium.text-lg Child Registration Form
                        p Please Enter Child Information
                    .lg.col-span-2
                        .grid.gap-4.gap-y-2.text-sm.grid-cols-1(class="md:grid-cols-5")
                            div(class="col-span-5")
                                label(for="full_name") First Name
                                Input(v-model="first_name" name="first_name" id="first_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
                            div(class="col-span-5")
                                label(for="email") Last Name
                                Input(v-model="last_name" name="last_name" id="last_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
                            div(class="col-span-5")
                                label(for="email") Preferred Name
                                Input(v-model="pref_name" name="pref_name" id="pref_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
                            div(class="col-span-5")
                                label(for="email") Age
                                Inputnum(type="number" v-model="age" name="age" id="age" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(giver number)" required)
                            div(class="col-span-5")
                                label(for="email") What is the current grade level of the child?
                                Inputnum(type="number" v-model="grade" name="grade" id="grade" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(give number)" required)
                            div(class="col-span-5")
                                label(for="email") What is the current reading level of the child? (Given on a scale from 0-10)
                                Inputnum(type="number" v-model="reading_lvl" name="reading_lvl" id="reading_lvl" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(give number)" required)
                            div(class="col-span-5")
                                label(for="email") Birth Date of Child
                                VueDatePicker(v-model="birth_date" name="birth_date" id="birth_date" required)
                            div(class="col-span-5")
                                label(for="email") Gender
                                select(v-model="gender" name="gender" id="gender" placeholder = "Please Select your Gender" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" required) option(value="Male") Male option(value="Female") Female option(value="Other") Other
                            div(class="col-span-5")
                                label(for="address") School District
                                Input(v-model="school_dist" name="school_dist_teach" id="school_dist_teach" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(Ex: DISD)" required)
                            div(class="col-span-5")
                                label(for="city") School Name
                                Input(v-model="school_name" name="school_name" id="school_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(user defined)" required)
                            div(class="col-span-5")
                                label(for="city") Preferred language child speaks most in:
                                Input(type="text" v-model="pref_lang" name="pref_lang" id="pref_lang" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="(ex: userdefined)" required)
                            div(class="col-span-5 text-right")
                                .inline-flex.items-end 
                                    Button.mx-auto.text-md(name="Delete Student" @click= "handleDeletion(index)" class="bg-rose-400 hover:bg-rose-400 border border-rose-400 rounded-lg py-2 px-2") Remove Student

</template>
