<template>
  <div class="results-page">
    <h1>Результаты игры</h1>

    <table class="results-table">
      <thead>
        <tr>
          <th>Место</th>
          <th>Команда</th>
          <th>Итого</th>
          <th v-for="(round, index) in maxRounds" :key="index">Раунд {{ index + 1 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(team, index) in teams"
          :key="team.teamName"
          :class="[
            index % 2 === 0 ? 'even-row' : 'odd-row',
            { 'highlighted-team': team.teamName === currentTeamName },
          ]"
        >
          <td>{{ team.currentPlace }}</td>
          <td>{{ team.teamName }}</td>
          <td>{{ team.totalScore }}</td>
          <td v-for="score in team.scoreByRounds" :key="score">{{ score }}</td>
        </tr>
      </tbody>
    </table>

    <img src="@/assets/house_light.png" class="home-button" @click="goToMenuApp" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useAuthCheck } from '@/hooks/useAuthCheck.js'; 

const store = useStore();
const router = useRouter();
const teams = ref([]);
const maxRounds = computed(() => {
  if (!teams.value.length) return 0;
  return Math.max(...teams.value.map((team) => team.scoreByRounds.length));
});


const { teamName: currentTeamName } = useAuthCheck();

const fetchResults = async () => {
  try {
    const currentGame = await store.dispatch('games/fetchCurrentGame');
    const results = await store.dispatch('games/fetchGameResults', currentGame.id);
    teams.value = results;
  } catch (error) {
    console.error('Ошибка при получении команды');
  }
};

onMounted(fetchResults);

const goToMenuApp = () => {
  router.push({ name: 'MenuApp' });
};
</script>

<style scoped>
.results-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1B2A46;
  color: #ffd700;
  padding: 20px;
  font-family: 'Mulish', sans-serif;
  height: 100vh;
  overflow: hidden;
}

h1 {
  color: #ffd700;
  font-size: 2rem;
  margin-bottom: 20px;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}

.results-table th,
.results-table td {
  border: 1px solid #ffd700;
  padding: 10px;
  text-align: center;
}

.results-table th {
  background-color: #3a4c6e;
  color: white;
}

.results-table tr.even-row {
  background-color: #ffd70020;
}

.results-table tr.odd-row {
  background-color: #001845;
}

.results-table tr:hover {
  background-color: #CFDBF3;
}

.results-table tr.highlighted-row { 
  background-color: lightblue;
}

.home-button {
  width: 50px;
  height: 50px;
  position: fixed;
  bottom: 20px;
  cursor: pointer;
}
</style>