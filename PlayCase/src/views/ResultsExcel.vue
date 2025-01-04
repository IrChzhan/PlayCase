<template>
  <div class="results-excel-page">
    <h1 class="results">Результаты</h1>

    <div v-if="teams.length === 0">
      <p>Нет данных для отображения.</p>
    </div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Место</th>
            <th>Название</th>
            <th>Очки за раунды</th>
            <th>Общий счёт</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in teams" :key="team.teamName">
            <td>{{ team.currentPlace }}</td>
            <td>{{ team.teamName }}</td>
            <td>{{ team.scoreByRounds.join(', ') }}</td>
            <td>{{ team.totalScore }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <img src="@/assets/house_light.png" class="home-button" @click="goToMenuApp" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const teams = ref([])

const fetchResults = async () => {
  try {
    const currentGame = await store.dispatch('games/fetchCurrentGame')
    const results = await store.dispatch('games/fetchGameResults', currentGame.id)
    teams.value = results
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message)
  }
}

onMounted(async () => {
  await fetchResults()
})

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

@media (min-width: 768px) and (max-width: 1024px) {
  .results-excel-page {
    padding: 5px;
  }

  .results {
    display: none;
  }

  table {
    font-size: 0.9rem;
    margin-top: -20px;
  }

  th,
  td {
    padding: 10px;
  }

  .table-container {
    width: 95%;
  }
}
</style>
