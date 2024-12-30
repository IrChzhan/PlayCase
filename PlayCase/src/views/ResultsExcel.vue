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
            <th>Место</th>
            <th>Название</th>
            <th>Очки за раунды</th>
            <th>Общий счёт</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in teams" :key="team.id">
            <td>{{ team.currentPlace }}</td>
            <td>{{ team.name }}</td>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

const teams = ref([])
const currentGameId = computed(() => store.state.games.currentGame?.id) 

const fetchResults = async () => {
  try {
    if (!currentGameId.value) {
      console.error('Не удалось получить ID текущей игры');
      return;
    }

    const results = await store.dispatch('games/fetchGameResults', currentGameId.value);
    console.log('Полученные результаты игры:', results);

    teams.value = results.map((result, index) => ({
      scoreByRounds: result.scoreByRounds || [],
      currentPlace: result.currentPlace || 0,
      totalScore: result.totalScore || 0,
    }));
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
  }
};

onMounted(async () => {
  try {
    await store.dispatch('games/fetchCurrentGame')
    await fetchResults()
  } catch (error) {
    console.error('Ошибка при инициализации:', error)
  }
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
