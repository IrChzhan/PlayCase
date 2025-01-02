<template>
  <div>
    <h1>Редактировать пользователя</h1>
    <form @submit.prevent="handleEditUser">
      <small>Логин: {{ oldUserData.login }}</small>
      <div class="form-group">
        <small>Старое имя: {{ oldUserData.name }}</small>
        <label for="name">Имя пользователя:</label>
        <input
          v-model="editedUser.name"
          id="name"
          type="text"
          placeholder="Введите имя пользователя"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          v-model="editedUser.password"
          id="password"
          type="password"
          placeholder="Введите новый пароль"
        />
      </div>

      <div class="form-group">
        <label>Статус пользователя:</label>
        <button type="button" @click="toggleUserStatus" :class="{ 'status-active': isUserActive }">
          {{ isUserActive ? 'Отключить пользователя' : 'Включить пользователя' }}
        </button>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          :disabled="!isFormValid"
          :style="{ opacity: isFormValid ? '100%' : '50%' }"
        >
          Сохранить
        </button>
        <button type="button" @click="goBack">Назад</button>
        <button type="button" @click="handleDeleteUser" class="delete-button">Удалить</button>
      </div>
    </form>

    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

const editedUser = ref({
  name: '',
  login: '',
  password: '',
})

const oldUserData = ref({
  name: '',
  login: '',
})

const userO = ref(null)

const isUserActive = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

onMounted(async () => {
  try {
    const user = await store.dispatch('profile/getUser', route.params.id)
    userO.value = user
    editedUser.value = { ...user, password: '' }
    oldUserData.value = { name: user.name, login: user.username }
  } catch (error) {
    console.error('Ошибка при загрузке данных пользователя:', error)
    toastMessage.value = 'Ошибка загрузки данных пользователя'
    toastType.value = 'error'
  }
})

const isFormValid = computed(() => {
  return editedUser.value.name.trim() && editedUser.value.name !== oldUserData.value.name
})

const handleEditUser = async () => {
  if (!isFormValid.value) return

  try {
    const payloadPassword = {
      password: editedUser.value.password,
    }

    const payloadName = {
      name: editedUser.value.name,
      authorities: [
        {
          authority: userO.value.authorities[0],
        },
      ],
    }
    await store.dispatch('profile/updateUser', {
      id: route.params.id,
      payload: payloadName,
      payload_two: payloadPassword,
    })

    toastMessage.value = 'Пользователь успешно обновлён!'
    toastType.value = 'success'

    setTimeout(() => {
      toastMessage.value = ''
      router.push({ name: 'AdminUsersPlayers' })
    }, 1000)
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error)
    toastMessage.value = 'Произошла ошибка при обновлении пользователя'
    toastType.value = 'error'
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  }
}

const handleDeleteUser = async () => {
  try {
    await store.dispatch('profile/deleteUser', route.params.id)
    toastMessage.value = 'Пользователь успешно удалён!'
    toastType.value = 'success'

    setTimeout(() => {
      toastMessage.value = ''
      router.push({ name: 'AdminUsersPlayers' })
    }, 1000)
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error)
    toastMessage.value = 'Ошибка при удалении пользователя'
    toastType.value = 'error'
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  }
}

const toggleUserStatus = async () => {
  isUserActive.value = !isUserActive.value
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

small {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 1rem;
  color: #555;
}

input {
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

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

button {
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.status-active {
  background-color: #28a745;
}

button:not(.status-active) {
  background-color: #ffc107;
}

button[type='submit'] {
  background-color: #28a745;
}

button[type='submit']:hover {
  background-color: #218838;
}

button[type='button'] {
  background-color: #6c757d;
}

button[type='button']:hover {
  background-color: #5a6268;
}

button.delete-button {
  background-color: #dc3545;
}

button.delete-button:hover {
  background-color: #c82333;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
