<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '../Notification.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()
const gameId = route.params.gameId

const users = ref([])
const selectedUserId = ref(null)

const notification = ref({
  message: '',
  type: 'info',
  duration: 3000,
})

const showNotification = (message, type = 'info') => {
  notification.value.message = message
  notification.value.type = type
}

const assignUser = async () => {
  try {
    if (selectedUserId.value) {
      await store.dispatch('games/setUserForTeam', {
        gameId: gameId,
        teamId: route.params.teamId,
        userId: selectedUserId.value,
      })
      showNotification('Пользователь успешно привязан!', 'success')
    } else {
      showNotification('Выберите пользователя.', 'warning')
    }
  } catch (error) {
    console.error('Ошибка при привязке пользователя:', error)
    showNotification('Ошибка при привязке пользователя.', 'error')
  }
}

const getUsers = async () => {
  try {
    const fetchedUsers = await store.dispatch('profile/fetchUsers')
    users.value = store.getters['profile/users'].filter(
      (user) =>
        user.authorities[0] !== 'ADMIN' &&
        user.authorities[0] !== 'MANAGER' &&
        user.authorities.length !== 0,
    )
  } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error)
    showNotification('Ошибка при загрузке пользователей.', 'error')
  }
}

onMounted(() => {
  getUsers().then(() => {
    users.value = store.getters['profile/users'].filter(
      (user) =>
        user.authorities[0] !== 'ADMIN' &&
        user.authorities[0] !== 'MANAGER' &&
        user.authorities.length !== 0,
    )
  })
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="assign-user-component">
    <h1>Привязь пользователя</h1>
    <div class="form-group">
      <label for="user-select">Выберите пользователя:</label>
      <select id="user-select" v-model="selectedUserId" class="user-select">
        <option value="" disabled>-- Выберите пользователя --</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>
    </div>
    <div class="button-group">
      <button @click="assignUser">Привязать выбранного пользователя</button>
      <button @click="goBack">Назад</button>
    </div>

    <Notification
      v-if="notification.message"
      :message="notification.message"
      :type="notification.type"
      :duration="notification.duration"
    />
  </div>
</template>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 15px;
}
.assign-user-component {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.user-select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #CC9F33;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #d1aa58;
}

button:last-child {
  background-color: #6c757d;
}

button:last-child:hover {
  background-color: #5a6268;
}
</style>
