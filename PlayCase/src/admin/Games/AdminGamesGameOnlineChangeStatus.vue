<script setup>
import { ref } from 'vue';
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import Notification from "@/admin/Notification.vue";
const router = useRouter()
const store = useStore()
const route = useRoute()
const notificationMessage = ref('')
const notificationType = ref('info')
const statuses_ru = ['Создан', 'Помощь в пути', 'Помощь оказана'];
const statuses_en = {'Создан':'CREATED',  'Помощь в пути': 'IN_PROGRESS', 'Помощь оказана': 'RESOLVED'}
const selectedStatus = ref('Запланирована');

const saveStatus = async () => {
  try {
    await store.dispatch('games/switchStatusHelp', {
      helpRequestId: route.params.requestId,
      newStatus: statuses_en[selectedStatus.value]
    })
    notificationMessage.value = 'Статус успешно изменился!'
    notificationType.value = 'success'
    setTimeout(()=> {
      router.back()
    }, 1000)
  }catch (e) {
    notificationMessage.value = 'Ошибка'
    notificationType.value = 'error'
  }

};

const goBack = () => {
  router.back()
};
</script>

<template>
  <div class="status-manager">
    <h1>Смена статуса</h1>
    <div class="form-group">
      <label for="status">Выберите статус:</label>
      <select id="status" v-model="selectedStatus">
        <option value="" disabled>Выберите...</option>
        <option v-for="status in statuses_ru" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </div>
    <div class="buttons">
      <button @click="saveStatus">Сохранить</button>
      <button class="secondary" @click="goBack">Назад</button>
    </div>
  </div>
  <Notification
    v-if="notificationMessage"
    :message="notificationMessage"
    :type="notificationType"
    :duration="3000"
  />
</template>

<style scoped>
h1 {
  font-size: 30px;
}
.status-manager {
  max-width: 400px;
  margin: 20px auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

.form-group {
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
}

.buttons {
  width: 400px;
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #CC9F33;
  color: white;
}

button:hover {
  background-color: #d1aa58;
}

.secondary {
  background-color: #6c757d;
}

.secondary:hover {
  background-color: #5a6268;
}
</style>
