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
      <div class="button-container">
        <button class="btn" @click="exportLottery">Экспорт</button>
      </div>
    </div>

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

import * as XLSX from 'xlsx';

const exportLottery = async () => {
  try {
    const response = await store.dispatch('games/exportLottery', {
      gameId: route.params.gameId,
      exportType: 'CSV'
    });

    const data = response.data.split('\n').map(row => row.split(','));

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lottery');

    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(excelFile)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'Lottery.xlsx');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('Ошибка экспорта:', e);
  }
};

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

const sortRegistrations = () => {
  registrations.value.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
}

const fetchRegistrations = async () => {
  try {
    const res = await store.dispatch('lottery/fetchRegistrationsAdmin', route.params.gameId)
    registrations.value = res
    sortRegistrations()
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
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
button {
  display: block;
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #5a6268;
}
.btn {
  background: #CC9F33;
}
.btn:hover {
  background: #d1aa58;
}
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
