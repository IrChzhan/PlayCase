<template>
  <div class="register-users-page">
    <h1>Зарегистрированные пользователи</h1>
    <br />
    <div v-if="error">
      <p class="error-message">{{ error }}</p>
    </div>
    <div v-else-if="!registeredUsers || registeredUsers.length === 0">
      <p>Пока никто не зарегистрировался в лотерее.</p>
    </div>
    <div v-else>
      <div v-for="(user, index) in registeredUsers" :key="index" class="user-item">
        <p><strong>Имя:</strong> {{ user.name }}</p>
        <p><strong>Почта:</strong> {{ user.email }}</p>
        <p><strong>Телефон:</strong> {{ user.phone }}</p>
        <p><strong>Название команды:</strong> {{ user.teamName }}</p>
        <p><strong>Номер:</strong> {{ user.sequenceNumber }}</p>
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
  justify-content: center;
  align-items: center;
  background-color: #001845;
  color: #ffd700;
  height: 100vh;
  position: relative;
  font-family: 'Mulish', sans-serif;
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
  cursor: pointer;
}

.user-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ffd700;
}

.home-button {
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: 20px;
  cursor: pointer;
}

.error-message {
  color: red;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.register-users-page::before {
  content: '';
  position: absolute;
  background-image: url('@/assets/lines.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.register-users-page::before {
  top: 0;
  left: 0;
  width: 1300px;
  height: 1300px;
}

.user-item p {
  margin: 5px 0;
}

.user-item strong {
  color: #ffd700;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .register-users-page::before {
    width: 1050px;
    height: 1050px;
  }
}
</style>
