<template>
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">×</button>
      <p>DDADADADADADADAD</p>
    </div>
  </div>
</template>

<script setup>
    defineProps({
      show: Boolean,
      closeModal: Function
    })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: var(--c-white);
  padding: 20px;
  border-radius: 8px;
}
.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
