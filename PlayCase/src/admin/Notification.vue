<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="notification"
      :class="type"
      @mouseenter="pauseAutoHide"
      @mouseleave="resumeAutoHide"
    >
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'warning', 'info'
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

const visible = ref(false)
let timeout = null

const showNotification = () => {
  visible.value = true
  autoHide()
}

const hideNotification = () => {
  visible.value = false
}

const autoHide = () => {
  timeout = setTimeout(() => {
    hideNotification()
  }, props.duration)
}

const pauseAutoHide = () => {
  clearTimeout(timeout)
}

const resumeAutoHide = () => {
  autoHide()
}

watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      showNotification()
    }
  },
)

onMounted(() => {
  if (props.message) {
    showNotification()
  }
})
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  color: white;
  z-index: 1000;
  animation: slide-in 0.3s ease-out;
  background-color: #27364f;
  border-left: 5px solid;
}

.notification.success {
  border-left-color: #4caf50;
}

.notification.error {
  border-left-color: #f44336;
}

.notification.warning {
  border-left-color: #ff9800;
}

.notification.info {
  border-left-color: #2196f3;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
