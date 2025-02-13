<style scoped>
.input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
.input-field {
  outline: none;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background:  #FFFFFC;
  padding: 20px 14px;
  font-size: 16px;
  font-family: 'Mulish', sans-serif;
  color: #0f1921;
  transition: border-color 0.2s;
  width: 200px;
}

.input-field:hover {
  border: 1px solid #b3b3b3;
}

.input-field:focus {
  border: 1px solid #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

.input-field.error {
  border: 1px solid #ff4d4f;
}

.input-error {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
}
</style>

<template>
  <div class="input-container">
    <label v-if="text" :for="inputId" class="input-label">{{ text }}</label>
    <input
  :id="inputId"
  :type="type"
  :placeholder="placeholder"
  :value="modelValue"
  @input="onInput"
  @blur="onBlur"
  class="input-field"
  :class="{ error: errorMessage }"
  :style="{ width: width }"
  :disabled="disabled"
/>
    <span v-if="errorMessage" class="input-error">{{ errorMessage }}</span>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '100%',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const inputId = computed(() => `input-${Math.random().toString(36).substring(2, 15)}`)

const onInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const onBlur = () => {
  emit('blur')
}
</script>
