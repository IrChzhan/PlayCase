<template>
  <div class="results-page">
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
            :class="index % 2 === 0 ? 'even-row' : 'odd-row'"
          >
            <td>{{ team.currentPlace }}</td>
            <td>{{ team.teamName }}</td>
            <td>{{ team.totalScore }}</td>
            <td v-for="score in team.scoreByRounds" :key="score">{{ score }}</td>
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
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const teams = ref([]);

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
}

.results-table tr.even-row {
  background-color: #FFF6E0;
}

.results-table tr.odd-row {
  background-color: #fff;
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
