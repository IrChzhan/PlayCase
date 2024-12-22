<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Notification from '@/admin/Notification.vue'

const store = useStore()

const toastMessage = ref('')
const toastType = ref('success')

const newUser = ref({
  name: '',
  login: '',
  password: '',
  role: 'user',
})

const roles = ['user', 'admin', 'moderator']

const addUser = async () => {
  if (newUser.value.name.trim() && newUser.value.login.trim() && newUser.value.password.trim()) {
    try {
      await store.dispatch('profile/addUser', newUser.value)
      newUser.value = { name: '', login: '', password: '', role: 'user' }
      toastMessage.value = 'Произошла ошибка при добавление пользователя!'
      toastType.value = 'error'
      setTimeout(() => {
        toastMessage.value = ''
      }, 3000)
    } catch (error) {
      console.error('Ошибка при добавлении пользователя:', error)
      toastMessage.value = 'Пользоветель успешно добавлен!'
      toastType.value = 'success'
      setTimeout(() => {
        toastMessage.value = ''
      }, 3000)
    }
  }
}

onMounted(() => {
  store.dispatch('profile/fetchUsers')
})
</script>

<template>
  <div class="container">
    <div class="user-list">
      <div v-for="user in store.getters['profile/users']" :key="user.id" class="place-card">
        <p>Имя: {{ user.name }}</p>
        <p>Логин: {{ user.username }}</p>
        <p>Роль: {{ user.authorities[0]?.authority || 'N/A' }}</p>
      </div>
    </div>
    <div class="add-user">
      <input v-model="newUser.name" type="text" placeholder="Введите имя пользователя" />
      <input v-model="newUser.login" type="text" placeholder="Введите логин" />
      <input v-model="newUser.password" type="password" placeholder="Введите пароль" />
      <select v-model="newUser.role">
        <option v-for="role in roles" :key="role" :value="role">
          {{ role }}
        </option>
      </select>
      <button class="place-card" @click="addUser">Добавить</button>
    </div>
  </div>
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.user-list {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  max-width: 400px;
}

.add-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 400px;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #394a6a;
  border-radius: 8px;
  background: #27364f;
  color: #ffffff;
}

input::placeholder {
  color: #b0b0b0;
}

.place-card {
  background: #27364f;
  border: 1px solid #394a6a;
  border-radius: 8px;
  padding: 10px;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  text-align: center;
}

.place-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
