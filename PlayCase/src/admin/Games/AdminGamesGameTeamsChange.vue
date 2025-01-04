<template>
  <div class="edit-team">
    <h1>Редактировать команду</h1>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="teamName">Название команды:</label>
        <input
          id="teamName"
          v-model="formData.name"
          type="text"
          placeholder="Введите название команды"
          class="input"
          required
        />
      </div>
      <div class="form-group">
        <label for="participantsCount">Количество участников:</label>
        <input
          id="participantsCount"
          v-model.number="formData.participantsCount"
          type="number"
          placeholder="Введите количество участников"
          class="input"
        />
      </div>
      <div class="form-group">
        <label for="isFirstTime">
          <input
            id="isFirstTime"
            type="checkbox"
            v-model="formData.isFirstTime"
          />
          Первый раз
        </label>
      </div>
      <div class="form-group">
        <label for="isPrepaid">
          <input
            id="isPrepaid"
            type="checkbox"
            v-model="formData.isPrepaid"
          />
          Предоплата
        </label>
      </div>
      <div class="form-group">
        <label for="certificate">Сертификат:</label>
        <input
          id="certificate"
          v-model="formData.certificate"
          type="text"
          placeholder="Введите сертификат"
          class="input"
        />
      </div>
      <div class="form-group">
        <label for="promocode">Промокод:</label>
        <input
          id="promocode"
          v-model="formData.promocode"
          type="text"
          placeholder="Введите промокод"
          class="input"
        />
      </div>
      <div class="form-actions">
        <button class="button primary" type="submit">Сохранить</button>
        <button class="button secondary" type="button" @click="goBack">Назад</button>
      </div>
    </form>
    <Notification
      v-if="notificationMessage"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'

const notificationMessage = ref('')
const notificationType = ref('info')
const store = useStore()
const formData = reactive({
  name: '',
  participantsCount: 0,
  isFirstTime: true,
  isPrepaid: true,
  certificate: '',
  promocode: '',
})

const router = useRouter()
const route = useRoute()

const handleSubmit = async () => {
  try {
    await store.dispatch('games/updateTeamToGame', {
      gameId: route.params.gameId,
      teamId: route.params.teamId,
      teamData: formData,
    })

    notificationMessage.value = 'Команда успешно изменена!'
    notificationType.value = 'success'
    setTimeout(() => {
      router.back()
    }, 1000)
  } catch (error) {
    notificationMessage.value = 'Ошибка при изменении команды.'
    notificationType.value = 'error'
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.edit-team {
  padding: 20px;
}

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

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input:focus {
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

button.primary {
  background-color: #CC9F33;
}

button.primary:hover {
  background-color: #d1aa58;
}

button.secondary {
  background-color: #6c757d;
}

button.secondary:hover {
  background-color: #5a6268;
}
</style>
