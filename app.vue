
import ButtonCompoent from './components/buttonComponent.vue';
<script setup>
import Button from './components/MLKButton.vue';
</script>
<template>
  <div>
    <NuxtPage></NuxtPage>
    <header>
    <nav>
      <ul>
      <NuxtLink to = "/facultyform">Register Faculty Account</NuxtLink>&nbsp;
      <NuxtLink to = "/parentform">Register Parent Account</NuxtLink>&nbsp;
      <NuxtLink to = "/passwordrecover">Forgot Password</NuxtLink>&nbsp;
      </ul>
    </nav>
    </header>
  </div>
</template>
