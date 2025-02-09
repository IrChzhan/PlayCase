<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-title">Список участников</span>
        <button class="close-button" @click="closeModal">×</button>
      </div>

      <div class="modal-body">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-else class="users-list">
          <div v-for="i in 8" :key="i" class="user-item">
            <div class="number-container">
              <span class="user-number">{{ i <= registeredUsers.length ? i : '' }}</span>
            </div>
            <p class="user-name">{{ i <= registeredUsers.length ? registeredUsers[i - 1].name : '' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, defineProps, defineEmits } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({ show: Boolean });
const emit = defineEmits(['close']);

const store = useStore();
const registeredUsers = computed(() => store.state.lottery.registrations);
const error = ref('');

onMounted(async () => {
  try {
    await store.dispatch('lottery/fetchRegistrations');
  } catch (err) {
    console.error('Ошибка при загрузке зарегистрированных пользователей:', err);
    error.value = 'Произошла ошибка при загрузке данных.';
  }
});

const closeModal = () => {
  emit('close');
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}
.modal-content {
  width: 700px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  padding: 6px;
  font-family: 'Mulish', sans-serif;
}
.modal-header {
  background-color: #1B2A46;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  font-size: 18px;
  font-weight: bold;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 25px;
}
.modal-title {
  flex-grow: 1;
  text-align: center;
  font-weight: 500;
  font-size: 30px;
}
.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}
.close-button:hover {
  color: #ff5a5a;
}
.modal-body {
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
}
.users-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 10px;
}
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1B2A46;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 7px;
}
.user-name {
  flex-grow: 1;
  margin-left: 20px;
  font-size: 25px;
}
.user-number {
  background-color: white;
  color: #1B2A46;
  font-weight: bold;
  font-size: 30px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border-color: yellow;
}
.error-message {
  color: red;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
.no-users {
  text-align: center;
  font-size: 14px;
  color: #555;
}
</style>