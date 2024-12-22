<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:content'])

const updateContent = (event) => {
  emit('update:content', event.target.value)
}
</script>

<template>
  <input
    class="input"
    type="text"
    :placeholder="text"
    :value="content"
    @input="updateContent"
    :style="{ width: width }"
  />
</template>

<style scoped>
.input {
  outline: none;
  border: 1px solid #d9d9d9;
  border-radius: 20px;
  background: var(--c-white, #fff);
  padding: 14px 16px;
  font-size: 16px;
  font-family: 'Mulish', sans-serif;
  color: #0f1921;
  line-height: 22px;
}

.input:hover {
  border: 1px solid #d7d4d4;
}
</style>
