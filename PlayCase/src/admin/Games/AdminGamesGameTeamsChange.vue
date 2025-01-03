<template>
  <div style="padding: 20px">
    <h1>Редактирование команды</h1>
    <div>
      <label>
        Название команды:
        <input type="text" v-model="formData.name" />
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
    <div style="margin-top: 20px">
      <button @click="handleSubmit">Сохранить</button>
      <button @click="handleSubmitDelete">Удалить</button>
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
    const response = await store.dispatch('games/updateTeamToGame', {
      gameId: route.params.gameId,
      teamId: route.params.teamId,
      teamData: formData,
    })

    notificationMessage.value = 'Команда успешна изменена!'
    notificationType.value = 'success'
  } catch (error) {
    notificationMessage.value = 'Ошибка при изменение команды.'
    notificationType.value = 'error'
  }
}

//deleteTeamToGame

const handleSubmitDelete = async () => {
  try {
    const response = await store.dispatch('games/deleteTeamToGame', {
      gameId: route.params.gameId,
      teamId: route.params.teamId,
    })

    notificationMessage.value = 'Команда успешна удалена!'
    notificationType.value = 'success'
  } catch (error) {
    notificationMessage.value = 'Ошибка при удаление команды.'
    notificationType.value = 'error'
  }
}

const goBack = () => {
  router.back()
}
</script>
