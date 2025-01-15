<template>
  <div class="register-users-page">
    <h1 class="page-title">Зарегистрированные пользователи</h1>
    <br />
    <div v-if="error">
      <p class="error-message">{{ error }}</p>
    </div>
    <div v-else-if="!registeredUsers || registeredUsers.length === 0">
      <p>Пока никто не зарегистрировался в лотерее.</p>
    </div>
    <div v-else class="users-grid">
      <div v-for="(user, index) in registeredUsers" :key="index" class="user-item">
        <p class="user-name">{{ user.name }}</p>
        <p class="user-number">{{ user.sequenceNumber }}</p>
      </div>
    </div>
    <img src="../../assets/house_light.png" class="home-button" @click="goToMenuApp" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

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

const goToMenuApp = () => {
  router.push({ name: 'MenuApp' });
};
</script>

<style scoped>
.register-users-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1B2A46;
  color: #ffd700;
  min-height: 100vh; 
  position: relative;
  font-family: 'Mulish', sans-serif;
  overflow-x: hidden; 
  padding: 20px;
}

.page-title {
  align-self: flex-start;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: white;
  margin: 0 auto;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

.user-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-size: 24px;
  font-weight: bold;
  color: #1B2A46;
  margin: 5px 0;
}

.user-number {
  font-size: 24px;
  font-weight: bold;
  color: #1B2A46;
  margin: 5px 0;
}

.home-button {
  width: 50px;
  height: 50px;
  position: fixed; 
  bottom: 20px;   
  left: 50%;     
  transform: translateX(-50%); 
  cursor: pointer;
}

.error-message {
  color: red;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.register-users-page::before {
  top: 0;
  left: 0;
  width: 1300px;
  height: 1300px;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .register-users-page {
    padding: 10px; 
  }

  .users-grid {
    grid-template-columns: repeat(4, 1fr); 
    gap: 15px;
  }
}

@media (max-width: 767px) {
  .users-grid {
    grid-template-columns: 1fr; 
    gap: 10px;
  }
}
</style>