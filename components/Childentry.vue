<script lang="ts" setup>
import '@vuepic/vue-datepicker/dist/main.css';
import "vue-select/dist/vue-select.css";
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
.py-4.grid(class="sm:grid-cols-3")
div
        .flex.flex-col.gap-5.margin-auto(class="text-center px-10")
            .py-4.grid(class="" style)
                Label * First Name: 
                    Input(type="text" v-model='first_name' name="first_name" id="first_name" placeholder="(user defined)" required)
            .py-4.grid(class="" )
                Label * Last Name: 
                    Input(type="text" v-model='last_name' name="last_name" id="last_name" placeholder="(user defined)" required)
            .py-4.grid(class="" )
                Label * What is your child's preferred name?
                    Input(type="text" v-model='pref_name' name="pref_name" id="pref_name" placeholder="(user defined)" required) 
            .py-4.grid(class="" )
                Label * What is the age of the child?
                    Inputnum(type="number" v-model='age' name="age" id="age" placeholder="(giver number)" required)
            .py-4.grid(class="" )
                Label * What is the current grade level of the child?
                    Inputnum(type="number" v-model='grade' name="grade" id="grade" placeholder="(give number)" required)
            .py-4.grid(class="" )
                Label * What is the current readling level of the child? (give in a scale of 0 to 10)
                    Inputnum(type="number" v-model='reading_lvl' name="reading_lvl" id="reading_lvl" placeholder="(give number)" required)
            .py-4.grid(class="" )
                Label * Birth date of child: 
                    Input(type="date" v-model="birth_date"  @update:modelValue="handleBirthDateChange" name="date" id="date" placeholder="(user defined)" required)
            .py-4.grid(class="" )
                label * Gender:
                    select(v-model='gender' name="gender" id="gender" placeholder = "Please Select your Gender" class="block w-full rounded-md border border-gray-700 focus:ring-indigo-500"  required)
                        option(value='Male') Male
                        option(value='Female') Female
                        option(value='Other') Other
            .py-4.grid(class="" )
                Label * School Name:
                    Input(type="text" v-model='school_name' name="school_name" id="school_name" placeholder="(ex: SunnyVale Elementary)"  required)
            .py-4.grid(class="" )
                Label * School District:
                    Input(type="text" v-model='school_dist' name="school_dist" id="school_dist" placeholder="(ex: DISD)" required)
            .py-4.grid(class="" )
                Label * Preferred language child speaks most in:
                    Input(type="text" v-model='pref_lang' name="pref_lang" id="pref_lang" placeholder="(ex: userdefined)" required)
        .flex.flex-col.gap-5(class="text-center" )
            Button.mx-auto.text-md(name="Delete Student" @click= "handleDeletion(index)" class='bg-rose-400 hover:bg-rose-400 border border-rose-400 rounded-lg') Remove Student
        .flex.flex-col.gap-5 
</template>