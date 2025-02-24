<template>
  <div v-if="show" class="modal-overlayd" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-title">СПИСОК УЧАСТНИКОВ</span>
        <button class="close-button" @click="closeModal">×</button>
      </div>

      <div class="modal-body">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-else>
          <div v-if="registeredUsers.length === 0" class="no-users">
            Регистраций пока нет
          </div>
          <div v-else class="users-list" :class="{ 'has-scroll': registeredUsers.length > 8 }">
            <div v-for="(user, index) in registeredUsers" :key="user.id" class="user-item">
              <div class="number-container">
                <span class="user-number">{{ index + 1 }}</span>
              </div>
              <p class="user-name">{{ user.name }}</p>
            </div>
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

const get = async () => {
  try {
    await store.dispatch('lottery/fetchRegistrations');
  } catch (err) {
    console.error('Ошибка при загрузке зарегистрированных пользователей:', err);
    error.value = 'Произошла ошибка при загрузке данных.';
  }
}

onMounted(() =>{
  get();
});

const closeModal = () => {
  emit('close');
};
</script>


<style scoped>
.modal-overlayd {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}
.modal-content {
  width: 1430px;
  height: 720px;
  background-color: #F5F5F5;
  border-radius: 1.5vw;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  padding: 7px;
  font-family: 'Mulish', sans-serif;
}
.modal-header {
  background-color: #1B2A46;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 10px 30px;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-bottom: 10px;
  height: 30px;
}
.modal-title {
  flex-grow: 1;
  text-align: center;
  font-weight: 500;
  font-size: 40px;
  margin-left: 25px;
}
.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 60px;
  font-weight: 200;
  cursor: pointer;
  margin-top: -10px;
}
.close-button:hover {
  color: #ff5a5a;
}
.modal-body {
  padding: 15px;
  max-height: 720px;
}
.users-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 10px;
  margin-top: -10px;
}
.users-list.has-scroll {
  overflow-y: auto;
  max-height: 600px;
}
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1B2A46;
  color: white;
  padding: 20px 40px;
  border-radius: 1.5vw;
  font-size: 16px;
  margin-top: 7px;
}
.user-name {
  flex-grow: 1;
  margin-left: 30px;
  font-size: 50px;
}
.user-number {
  background-color: white;
    color: #1B2A46;
    font-weight: 700;
    font-size: 39px;
    width: 95px;
    height:95px;
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
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 36px;
  color: black;
  font-weight: 800;
  margin-top: 260px;
}
</style>