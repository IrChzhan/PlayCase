<template>
  <div class="lottery-container">
    <h1>Регистрация в лотерее</h1>

    <div v-if="registrations.length === 0">
      <p>Нет зарегистрированных участников.</p>
    </div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Название команды</th>
            <th>Номер</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="registration in registrations" :key="registration.sequenceNumber">
            <td>{{ registration.name }}</td>
            <td>{{ registration.email }}</td>
            <td>{{ registration.phone }}</td>
            <td>{{ registration.teamName }}</td>
            <td>{{ registration.sequenceNumber }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="selectWinner" class="winner-button">Выбрать победителя</button>

    <div v-if="winner" class="winner-section">
      <h2>Победитель</h2>
      <p><strong>Имя:</strong> {{ winner.name }}</p>
      <p><strong>Email:</strong> {{ winner.email }}</p>
      <p><strong>Телефон:</strong> {{ winner.phone }}</p>
      <p><strong>Название команды:</strong> {{ winner.teamName }}</p>
      <p><strong>Номер:</strong> {{ winner.sequenceNumber }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()
const registrations = ref([])
const winner = ref(null)

const fetchRegistrations = async () => {
  try {
    const res = await store.dispatch('lottery/fetchRegistrationsAdmin', route.params.gameId)
    registrations.value = res
  } catch (error) {
    console.error('Ошибка при получении данных регистраций:', error)
  }
}

const selectWinner = async () => {
  try {
    const res = await store.dispatch('lottery/fetchWinner', route.params.gameId)
    winner.value = res
  } catch (error) {
    console.error('Ошибка при выборе победителя:', error)
  }
}

onMounted(async () => {
  await fetchRegistrations()
})
</script>

<style scoped>
.lottery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  font-family: 'Mulish', sans-serif;
}

h1 {
  margin-bottom: 20px;
  color: #27364f;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  color: #333;
}

.winner-button {
  background-color: #1abc9c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 20px;
}

.winner-button:hover {
  background-color: #16a085;
}

.winner-section {
  margin-top: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 4px;
  width: 100%;
  text-align: left;
}

.winner-section p {
  margin: 5px 0;
}
</style>
