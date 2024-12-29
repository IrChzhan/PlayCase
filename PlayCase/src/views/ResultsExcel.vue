<template>
  <div class="results-excel-page">
    <div class="close-button" @click="goToMenuApp">✖️</div>
    <h1>Результаты</h1>

    <div v-if="teams.length === 0">
      <p>Нет данных для отображения.</p>
    </div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Номер стола</th>
            <th>Игровая отметка</th>
            <th>Количество участников</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in teams" :key="team.id">
            <td>{{ team.id }}</td>
            <td>{{ team.name }}</td>
            <td>{{ team.tableNumber }}</td>
            <td>{{ team.gameMark }}</td>
            <td>{{ team.participantsCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <img src="@/assets/house_light.png" class="home-button" @click="goToMenuApp" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useAuthCheck } from '@/hooks/useAuthCheck.js'

const { teamName } = useAuthCheck()
const store = useStore()
const router = useRouter()

const teams = ref([])

const fetchResults = async () => {
  try {
    const currentGame = await store.dispatch('games/fetchCurrentGame')
    console.log('Полученная текущая игра:', currentGame)

    if (!currentGame?.id) {
      console.error('Не удалось получить ID текущей игры')
      return
    }

    const gameId = currentGame.id
    const results = await store.dispatch('games/fetchGameResults', gameId)
    console.log('Полученные результаты игры:', results)

    teams.value = results.map(result => ({
      scoreByRounds: result.scoreByRounds || [],
      currentPlace: result.currentPlace || 0,
      totalScore: result.totalScore || 0
    }))
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message)
  }
}

fetchResults()

const goToMenuApp = () => {
  router.push({ name: 'MenuApp' })
}
</script>

<style scoped>
.results-excel-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #001845;
  color: #ffd700;
  height: 100vh;
  position: relative;
  font-family: 'Mulish', sans-serif;
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
  cursor: pointer;
}

table {
  border-collapse: collapse;
  width: 90%;
  margin: 20px 0;
  font-family: 'Mulish', sans-serif;
}

th,
td {
  border: 1px solid #ffd700;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #3a4c6e;
  color: white;
}
.home-button {
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: 20px;
  cursor: pointer;
}

.results-excel-page::before,
.results-excel-page::after {
  content: '';
  position: absolute;
  background-image: url('@/assets/lines.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.results-excel-page::before {
  top: 0;
  left: 0;
  width: 1300px;
  height: 1300px;
}

.results-excel-page::after {
  bottom: 0;
  right: 0;
  width: 150px;
  height: 150px;
}
</style>
