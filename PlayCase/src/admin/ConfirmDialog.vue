<template>
  <div class="modal-overlay" v-if="visible">
    <div class="modal">
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-message">{{ message }}</p>
      <div class="modal-actions">
        <button class="button cancel" @click="onCancel">Отмена</button>
        <button class="button confirm" @click="onConfirm">Подтвердить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: String,
  message: String,
})

const emit = defineEmits(['confirm', 'cancel'])

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
}

.modal-title {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
}

.modal-message {
  margin-bottom: 20px;
  font-size: 16px;
  color: #555;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.button {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.button.cancel {
  background: #f44336;
  color: white;
  border: none;
}

.button.cancel:hover {
  background: #d32f2f;
}

.button.confirm {
  background: #4285f4;
  color: white;
  border: none;
}

.button.confirm:hover {
  background: #357ae8;
}
</style>
