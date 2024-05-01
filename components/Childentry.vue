<script lang="ts" setup>
const props = defineProps<{modelValue:any}>()
const emit = defineEmits(["remove", "update:modelValue"])
// button click = emit('remove')
const handleDeletion = () => {
    emit("remove")
}

const first_name = computed({
    get() {
        return props.modelValue.first_name
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, first_name: v})
    }
})
const last_name = computed({
    get() {
        return props.modelValue.last_name
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, last_name: v})
    }
})
const pref_name = computed({
    get() {
        return props.modelValue.pref_name
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, pref_name: v})
    }
})
const age = computed({
    get() {
        return props.modelValue.age
    },
    set(v:number){
        emit("update:modelValue", {...props.modelValue, age: v})
    }
})
const grade = computed({
    get() {
        return props.modelValue.grade
    },
    set(v:number){
        emit("update:modelValue", {...props.modelValue, grade: v})
    }
})
const reading_lvl = computed({
    get() {
        return props.modelValue.reading_lvl
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, reading_lvl: v})
    }
})
const birth_date = computed({
    get() {
        return props.modelValue.birth_date
    },
    set(v:Date){
        emit("update:modelValue", {...props.modelValue, birth_date: v})
    }
})
const gender = computed({
    get() {
        return props.modelValue.gender
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, gender: v})
    }
})
const school_name = computed({
    get() {
        return props.modelValue.school_name
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, school_name: v})
    }
})
const school_dist = computed({
    get() {
        return props.modelValue.school_dist
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, school_dist: v})
    }
})
const pref_lang = computed({
    get() {
        return props.modelValue.pref_lang
    },
    set(v:string){
        emit("update:modelValue", {...props.modelValue, pref_lang: v})
    }
})
</script>

<template lang = "pug">
.py-4.grid(class="sm:grid-cols-3")
Container
        .flex.flex-col.gap-5 
            .py-4.grid(class="sm: col-span")
                Label First Name: 
                .col-md-9.mx-10(class="sm:grid-cols-3")
                    Input(v-model='first_name' @update:modelValue="emit('update:modelValue', { ...modelValue, first_name: $event })" placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                Label Last Name: 
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='last_name' @update:modelValue="emit('update:modelValue', { ...modelValue, last_name: $event })" placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                Label What is your child's preferred name?
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='pref_name' @update:modelValue="emit('update:modelValue', { ...modelValue, pref_name: $event })" placeholder="(user defined)" required) 
            .py-4.grid(class="sm: col-span")
                Label What is the age of the child?
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='age' @update:modelValue="emit('update:modelValue', { ...modelValue, age: $event })" placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                Label What is the current grade level of the child?
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='grade' @update:modelValue="emit('update:modelValue', { ...modelValue, grade: $event })" placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                label What is the current readling level of the child? (give in a scale of 0 to 10)
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='reading_lvl' @update:modelValue="emit('update:modelValue', { ...modelValue, reading_lvl: $event })" placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                label Birth date of child: 
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='birth_date' @update:modelValue="emit('update:modelValue', { ...modelValue, birth_date: $event })" placeholder="(user defined)" required)
            .py-4.grid(class="sm: col-span")
                label Gender:
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Dropdown(v-model='gender' :options=["", "Male", "Female", "Wish not to Disclose"] @update:modelValue="emit('update:modelValue', { ...modelValue, gender: $event })" placeholder = "Please Select your Gender" required)
            .py-4.grid(class="sm: col-span")
                Label School Name:
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='school_name' placeholder="(ex: SunnyVale Elementary)" @update:modelValue="emit('update:modelValue', { ...modelValue, school_name: $event })" required)
            .py-4.grid(class="sm: col-span")
                Label School District:
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='school_dist' placeholder="(ex: DISD)" @update:modelValue="emit('update:modelValue', { ...modelValue, school_dist: $event })" required)
            .py-4.grid(class="sm: col-span")
                Label Preferred language child speaks most in:
                .cl-md-9.mx-10(class="sm: grid-cols-3")
                    Input(v-model='pref_lang' placeholder="(ex: userdefined)" @update:modelValue="emit('update:modelValue', { ...modelValue, pref_lang: $event })" required)
        .flex.flex-col.gap-5 
            Button.mx-auto.text-md(name="Delete Student" @click= "handleDeletion(index)" class="bg-red-600 hover:bg-red-700") Remove Student
        .flex.flex-col.gap-5 
</template>