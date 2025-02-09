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
    <img src="@/assets/house_light.png" class="home-button" @click="goToMenuApp" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {useAuthCheck} from "@/hooks/useAuthCheck.js";

const store = useStore();
const router = useRouter();
const teams = ref([]);
const { teamName } = useAuthCheck()

const watchedState = computed(() => store.state.results.result);

const hasResults = computed(() => {
  return teams.value.some(
    (team) =>
      team.totalScore > 0 ||
      team.scoreByRounds.some((score) => score > 0)
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
  background-color: #1B2A46;
  color: #1B2A46;
  padding: 20px;
  height: 100%;
  font-family: 'Mulish', sans-serif;
  overflow: hidden;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  margin-top: -10px;
}

.results-table th,
.results-table td {
  border: 1px solid #ffd700;
  padding: 10px;
  text-align: center;
  color: #1B2A46;
}

.results-table th {
  background-color: #CC9F33;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1;
}

.results-table tbody {
  display: block;
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}

.results-table td:nth-child(2),
.results-table th:nth-child(2) {
  width: 120px;
  min-width: 100px;
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
  background-color: #fff;
}

.results-table tr.highlighted-row {
  box-shadow: inset 0px 4px 6px rgba(0, 0, 0, 0.4); 
}

.no-results {
  font-size: 1rem;
  font-weight: bold;
  color: #1B2A46;
  background-color: white;
  text-align: center;
}

.home-button {
  width: 50px;
  height: 50px;
  position: fixed;
  bottom: 20px;
  cursor: pointer;
}
</style>
