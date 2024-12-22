<template>
  <div id="app">
    <RouterView />
    .
  </div>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
  name: 'App',
  components: {
    RouterView,
  },
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  background-color: #1B2A46; 
}

</style>