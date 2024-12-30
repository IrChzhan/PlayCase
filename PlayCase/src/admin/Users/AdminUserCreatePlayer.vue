<template>
  <div>
    <h1>Создать пользователя</h1>
    <form @submit.prevent="handleCreateUser">
      <div class="form-group">
        <label for="name">Имя пользователя:</label>
        <input
          v-model="newUser.name"
          id="name"
          type="text"
          placeholder="Введите имя пользователя"
          required
        />
      </div>

      <div class="form-group">
        <label for="login">Логин:</label>
        <input
          v-model="newUser.login"
          id="login"
          type="text"
          placeholder="Введите логин"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          v-model="newUser.password"
          id="password"
          type="password"
          placeholder="Введите пароль"
          required
        />
      </div>

      <div class="form-actions">
        <button type="submit">Создать</button>
        <button type="button" @click="goBack">Назад</button>
      </div>
    </form>

    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'

const router = useRouter()
const store = useStore()

const newUser = ref({
  name: '',
  login: '',
  password: '',
  role: 'PLAYER',
})

const toastMessage = ref('')
const toastType = ref('success')

const handleCreateUser = async () => {
  if (newUser.value.name.trim() && newUser.value.login.trim() && newUser.value.password.trim()) {
    try {
      const payload = {
        name: newUser.value.name,
        username: newUser.value.login,
        password: newUser.value.password,
        authorities: [{ authority: 'PLAYER' }],
      }
      await store.dispatch('profile/addUser', payload)
      toastMessage.value = 'Пользователь успешно создан!'
      toastType.value = 'success'

      newUser.value = { name: '', login: '', password: '', role: 'PLAYER' }

      setTimeout(() => {
        toastMessage.value = ''
        router.push({ name: 'AdminUsersPlayers' })
      }, 1000)
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error)
      toastMessage.value = 'Произошла ошибка при создании пользователя!'
      toastType.value = 'error'
      setTimeout(() => {
        toastMessage.value = ''
      }, 3000)
    }
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 1rem;
  color: #555;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

input:focus,
select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit'] {
  background-color: #007bff;
}

button[type='submit']:hover {
  background-color: #0056b3;
}

button[type='button'] {
  background-color: #6c757d;
}

button[type='button']:hover {
  background-color: #5a6268;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
