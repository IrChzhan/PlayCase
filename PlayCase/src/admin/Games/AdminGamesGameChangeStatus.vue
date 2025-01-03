<script setup>
import { ref } from 'vue';
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
const router = useRouter()
const store = useStore()
const route = useRoute()

const statuses = ['RESULT_SUMMING', 'IN_PROGRESS', 'PLANNED', 'FINISHED'];
const selectedStatus = ref('PLANNED');

const saveStatus = async () => {
  await store.dispatch('games/switchStatus', {
    gameId: route.params.gameId,
    newStatus: selectedStatus.value
  })
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
        <option v-for="status in statuses" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </div>
    <div class="buttons">
      <button @click="saveStatus">Сохранить</button>
      <button @click="goBack">Назад</button>
    </div>
  </div>
</template>

<style scoped>
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
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
}

button:hover {
  background-color: #0056b3;
}
</style>
