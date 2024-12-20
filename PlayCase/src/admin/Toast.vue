<template>
  <div v-if="visible" class="toast" :class="type">
    {{ message }}
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success',
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const visible = ref(false);

watch(
    () => props.message,
    (newMessage) => {
      if (newMessage) {
        visible.value = true;
        setTimeout(() => {
          visible.value = false;
        }, props.duration);
      }
    }
);
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #1b2a46;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  animation: fadeIn 0.3s ease;
}

.toast.success {
  border-left: 5px solid #4caf50;
}

.toast.error {
  border-left: 5px solid #f44336;
}

.toast.info {
  border-left: 5px solid #2196f3;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
