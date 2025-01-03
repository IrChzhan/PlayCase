<template>
  <div style="padding: 20px">
    <h1>Создание команды</h1>
    <div>
      <label>
        Название команды:
        <input type="text" v-model="formData.name" />
      </label>
    </div>
    <div>
      <label>
        Номер стола:
        <input type="number" v-model.number="formData.tableNumber" />
      </label>
    </div>
    <div>
      <label>
        Количество участников:
        <input type="number" v-model.number="formData.participantsCount" />
      </label>
    </div>
    <div>
      <label>
        Первый раз:
        <input type="checkbox" v-model="formData.isFirstTime" />
      </label>
    </div>
    <div>
      <label>
        Предоплата:
        <input type="checkbox" v-model="formData.isPrepaid" />
      </label>
    </div>
    <div>
      <label>
        Сертификат:
        <input type="text" v-model="formData.certificate" />
      </label>
    </div>
    <div>
      <label>
        Промокод:
        <input type="text" v-model="formData.promocode" />
      </label>
    </div>
    <div>
      <label>
        Комментарий:
        <textarea v-model="formData.markComment"></textarea>
      </label>
    </div>
    <div style="margin-top: 20px">
      <button @click="handleSubmit">Создать</button>
      <button style="margin-left: 10px" @click="goBack">Назад</button>
    </div>
  </div>
  <Notification
    v-if="notificationMessage"
    :message="notificationMessage"
    :type="notificationType"
    :duration="3000"
  />
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
  tableNumber: 0,
  participantsCount: 0,
  isFirstTime: true,
  isPrepaid: true,
  certificate: '',
  promocode: '',
  markComment: '',
})

const router = useRouter()
const route = useRoute()

const handleSubmit = async () => {
  try {
    const response = await store.dispatch('games/addTeamToGame', {
      gameId: route.params.gameId,
      teamData: formData,
    })

    notificationMessage.value = 'Файл успешно загружен!'
    notificationType.value = 'success'
  } catch (error) {
    notificationMessage.value = 'Ошибка при загрузке файла.'
    notificationType.value = 'error'
  }
}

const goBack = () => {
  router.back()
}
</script>
