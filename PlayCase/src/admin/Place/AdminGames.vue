<template>
  <div class="admin-games">
    <h1>Управление играми</h1>
    <div class="games-list">
      <div 
        v-for="game in games" 
        :key="game.id" 
        class="game-card" 
        @click="goToGameTeams(game.id)"
      >
        <h2>Игра на {{ game.plannedDate }}</h2>
        <p>ID игры: {{ game.id }}</p>
        <p>Место: {{ findPlaceName(game.place.id) }}</p>
        <p>Статус: {{ game.status }}</p>
      </div>
    </div>

    <div class="add-game">
      <h2>Добавить новую игру</h2>
      <form @submit.prevent="addGame" class="form">
        <div class="form-group">
          <label for="plannedDate">Дата проведения:</label>
          <input
            id="plannedDate"
            v-model="plannedDate"
            type="date"
            class="input"
            required
          />
        </div>
        <div class="form-group">
          <label for="placeId">Выберите место:</label>
          <select
            id="placeId"
            v-model="selectedPlaceId"
            class="input"
            required
          >
            <option value="" disabled>Выберите место</option>
            <option v-for="place in places" :key="place.id" :value="place.id">
              {{ place.name }}
            </option>
          </select>
        </div>
        <button
          class="button primary"
          type="submit"
          :disabled="!isFormValid || loading"
          :class="{ disabled: !isFormValid || loading }"
        >
          <Loader v-if="loading" /> Добавить игру
        </button>
      </form>
    </div>

    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Loader from '../Loader.vue';
import Notification from '../Notification.vue';

const store = useStore();
const router = useRouter();
const games = ref([]);
const plannedDate = ref('');
const selectedPlaceId = ref('');
const places = ref([]);
const loading = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

const isFormValid = computed(() => plannedDate.value && selectedPlaceId.value);

const fetchGames = async () => {
  try {
    const response = await store.dispatch('games/fetchAllGames');
    games.value = response;
  } catch (error) {
    console.error('Ошибка загрузки игр:', error);
    toastMessage.value = 'Ошибка загрузки игр.';
    toastType.value = 'error';
  }
};

const fetchPlaces = async () => {
  await store.dispatch('places/fetchPlaces');
  places.value = store.getters['places/allPlaces'];
};

const findPlaceName = (id) => {
  const place = places.value.find((place) => place.id === id);
  return place ? place.name : 'Неизвестное место';
};

const addGame = async () => {
  if (isFormValid.value) {
    try {
      loading.value = true;
      const place = places.value.find((place) => place.id === selectedPlaceId.value);
      const newGameRequest = {
        id: crypto.randomUUID(),
        plannedDate: plannedDate.value,
        place: {
          id: place.id,
          name: place.name,
          address: place.address,
        },
        status: 'PLANNED',
        teams: [], 
      };

      const newGame = await store.dispatch('games/createGame', newGameRequest);

      plannedDate.value = '';
      selectedPlaceId.value = '';
      toastMessage.value = `Игра успешно добавлена! ID: ${newGame.id}`;
      toastType.value = 'success';

      await fetchGames();
    } catch (error) {
      console.error('Ошибка добавления игры:', error);
      toastMessage.value = 'Ошибка при добавлении игры.';
      toastType.value = 'error';
    } finally {
      loading.value = false;
    }
  }
};

const goToGameTeams = (gameId) => {
  router.push({ name: 'AdminTeams', params: { gameId }  });
};

onMounted(() => {
  fetchPlaces();
  fetchGames();
});
</script>



<style scoped>
.admin-games {
  background-color: #1b2a46;
  color: white;
  padding: 20px;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

h1,
h2 {
  margin-bottom: 20px;
  color: #ffffff;
  text-align: center;
}

.games-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.game-card {
  background: #27364f;
  border: 1px solid #394a6a;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.add-game {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #394a6a;
  border-radius: 5px;
  background: #27364f;
  color: white;
  font-size: 14px;
}

.input:focus {
  border-color: #4caf50;
  outline: none;
}

.button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.button:hover {
  background: #45a049;
}

.button:disabled {
  background: #666;
  cursor: not-allowed;
}
</style>