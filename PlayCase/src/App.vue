<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'

</script>

<style>
html,
body {
  height: 100vh;
  margin: 0;
  background-color: white;
}

#app {
  height: 100%;
}
</style>
