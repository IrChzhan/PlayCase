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
        <p>Место: {{ findPlaceName(game.placeId) }}</p>
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

    <div class="find-game">
      <h2>Найти игру по ID</h2>
      <form @submit.prevent="findGameById" class="form">
        <div class="form-group">
          <label for="gameId">ID игры:</label>
          <input
            id="gameId"
            v-model="searchGameId"
            type="text"
            placeholder="Введите ID игры"
            class="input"
            required
          />
        </div>
        <button
          class="button secondary"
          type="submit"
          :disabled="!searchGameId"
        >
          Перейти к игре
        </button>
      </form>
    </div>

    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Loader from '../Loader.vue'
import Notification from '../Notification.vue'

const store = useStore()
const router = useRouter()

const games = ref([]) 
const plannedDate = ref('')
const selectedPlaceId = ref('') 
const searchGameId = ref('')
const loading = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const places = ref([]) 
const isFormValid = computed(() => plannedDate.value && selectedPlaceId.value)

const fetchPlaces = async () => {
  await store.dispatch('places/fetchPlaces')
  places.value = store.getters['places/allPlaces']
}

const fetchGames = async () => {
  try {
    await store.dispatch('games/fetchGames')
    games.value = store.getters['games/allGames']
  } catch (error) {
    console.error('Ошибка загрузки игр:', error)
  }
}

const findPlaceName = (id) => {
  const place = places.value.find((place) => place.id === id)
  return place ? place.name : 'Неизвестное место'
}

const addGame = async () => {
  if (isFormValid.value) {
    try {
      loading.value = true
      const newGame = await store.dispatch('games/createGame', {
        plannedDate: plannedDate.value,
        placeId: selectedPlaceId.value,
      })

      plannedDate.value = ''
      selectedPlaceId.value = ''

      games.value.push(newGame)

      toastMessage.value = `Игра успешно добавлена! ID: ${newGame.id}`
      toastType.value = 'success'

      setTimeout(() => {
        toastMessage.value = ''
      }, 3000)
    } catch (error) {
      console.error('Ошибка добавления игры:', error)

      toastMessage.value = 'Ошибка при добавлении игры.'
      toastType.value = 'error'

      setTimeout(() => {
        toastMessage.value = ''
      }, 3000)
    } finally {
      loading.value = false
    }
  }
}

const findGameById = async () => {
  try {
    loading.value = true
    const response = await store.dispatch('games/fetchGameById', searchGameId.value) 
    router.push({ name: 'AdminTeams', params: { gameId: response.id } })
  } catch (error) {
    console.error('Ошибка поиска игры:', error)
    toastMessage.value = 'Ошибка: игра не найдена.'
    toastType.value = 'error'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPlaces()
  fetchGames()
})
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