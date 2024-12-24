<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Notification from "@/admin/Notification.vue";

const login = ref({ username: '', password: '' });
const toastMessage = ref('');
const toastType = ref('success');

const store = useStore();
const router = useRouter();

const handleLogin = async () => {
  const success = await store.dispatch('profile/login', login.value);
  if (success) {
    toastMessage.value = 'Авторизация успешна!';
    toastType.value = 'success';
    router.push({ name: 'AdminHome' });
    setTimeout(() => {
      toastMessage.value = '';
    }, 3000);
  } else {
    toastMessage.value = 'Ошибка авторизации. Проверьте логин и пароль.';
    toastType.value = 'error';
    setTimeout(() => {
      toastMessage.value = '';
    }, 3000);
  }
};
</script>

<template>
  <div class="container">
    <h1>Войти</h1>
    <label for="username">Логин</label>
    <input id="username" v-model="login.username" type="text" placeholder="Ваш логин" />

    <label for="password">Пароль</label>
    <input id="password" v-model="login.password" type="password" placeholder="Ваш пароль" />

    <button @click="handleLogin">Отправить</button>
  </div>
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  color: white;
  text-align: center;
}

h1 {
  font-size: 36px;
  margin-bottom: 30px;
}

label {
  font-size: 20px;
  margin-bottom: 15px;
}

input {
  width: 350px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
}

input::placeholder {
  color: #9ba9c3;
}

button {
  padding: 15px 30px;
  font-size: 18px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
