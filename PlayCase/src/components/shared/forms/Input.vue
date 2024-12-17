<script setup>
  defineProps({
    text: String,
    width: Number
  })
</script>

<template>
  <input class="input" type="text">
</template>

<style scoped>
.input {
  width: 460px;
  height: 50px;
  outline: none;
  border: 1px solid #D9D9D9;
  border-radius: 20px;
  background: var(--c-white);
  padding: 14px 16px;
  font-size: 16px;
  font-family: "Mulish", sans-serif;
  color:#0F1921;
  line-height: 22px;
}
</style>