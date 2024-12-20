<template>
  <span class="loader"></span>
</template>

<script setup>
</script>

<style scoped>
.loader {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 5px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
