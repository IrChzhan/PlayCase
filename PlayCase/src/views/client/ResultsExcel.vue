<template>
  <div class="results-page">
    <h1>Результаты игры</h1>
    <div class="table-container">
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
        <template v-if="shouldDisplayTable">
          <tr

            v-for="(team, index) in teams"
            :key="team.teamName"
            :class="{'even-row': index % 2 === 0,
            'odd-row': index % 2 !== 0,
            'highlighted-row': teamName === team.teamName}"
          >
            <td>{{ team.currentPlace }}</td>
            <td :class="{boldText: teamName === team.teamName}">{{ team.teamName }}</td>
            <td :class="{boldText: teamName === team.teamName}">{{ team.totalScore }}</td>
            <td :class="{boldText: teamName === team.teamName}" v-for="score in team.scoreByRounds" :key="score">{{ score }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="100%" class="no-results">Результатов пока нет</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
    <img src="@/assets/House_5.svg" class="home-button" @click="goToMenuApp" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useAuthCheck } from '@/hooks/useAuthCheck.js';

const store = useStore();
const router = useRouter();
const teams = ref([]);
const { teamName } = useAuthCheck();

const watchedState = computed(() => store.state.results.result);

const hasResults = computed(() => {
  return teams.value.some(
    (team) => team.totalScore > 0 || team.scoreByRounds.some((score) => score > 0)
  );
});

const shouldDisplayTable = computed(() => {
  return teams.value.length > 0 && hasResults.value;
});

const maxRounds = computed(() => {
  if (!teams.value.length) return 0;
  return Math.max(...teams.value.map((team) => team.scoreByRounds.length));
});

const fetchResults = async () => {
  try {
    const currentGame = await store.dispatch('games/fetchCurrentGame');
    const results = await store.dispatch('games/fetchGameResults', currentGame.id);
    teams.value = results;
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
  }
};

watch(watchedState, () => {
  fetchResults();
});

onMounted(fetchResults);

const goToMenuApp = () => {
  router.push({ name: 'MenuApp' });
};
</script>

<style scoped>
.results-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('@/assets/background.jpg') no-repeat center center/cover;
  color: #1B2A46;
  padding: 20px;
  height: 1160px;
  font-family: 'Mulish', sans-serif;
  font-weight: 500;
  overflow: hidden;
}

.table-container {
  width: 100%;
  border-radius: 15px;
  overflow: hidden; 
  margin-top: 50px;
}

h1 {
  color: #FFFFFC;
  margin-top: 40px;
  font-size: 60px;
  font-weight: 700;
  font-family: 'Mulish', sans-serif;
}

/* .results-table {
  width: 100%;
  font-size: 1rem;
  margin-top: 40px;
} */

.results-table th,
.results-table td {
  font-family: 'Mulish',sans-serif;
  border: 1px solid #FFD700;
  padding: 15px;
  font-weight: 500;
  text-align: center;
  color: #000000;
}

.results-table th {
  background-color: #C59216;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1;
  font-size: 22px;
}

.results-table tbody {
  display: block;
  max-height: 815px; 
  overflow-y: auto; 
  overflow-x: hidden;
  width: 100%;
  -webkit-overflow-scrolling: touch; 
}

.results-table {
  display: block;
  width: 100%;
}

.results-table td:nth-child(2),
.results-table th:nth-child(2) {
  width: 120px;
  min-width: 100px;
}

thead{
  border-radius: 15px;
}

.results-table tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.results-table tr.even-row {
  background-color: #FFF6E0;
}

.results-table tr.odd-row {
  background-color: #FFFEFD;
}

.results-table tr.highlighted-row {
  background-color: #CFDBF3;
}

.no-results {
  font-size: 32px;
  font-weight: bold;
  color: #1B2A46;
  background-color: white;
  text-align: center;
}

.home-button {
  width: 90px;
  height: 90px;
  position: fixed;
  bottom: 35px;
  cursor: pointer;
}
</style>
