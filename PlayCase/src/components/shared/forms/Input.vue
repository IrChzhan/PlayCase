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
      :style="{ width: width }"
      :disabled="disabled"
    />
    <span v-if="errorMessage" class="input-error">{{ errorMessage }}</span>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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
    default: 'auto',
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
