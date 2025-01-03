<template>
  <div class="admin-games">
    <h1>Управление играми</h1>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по играм"
        class="input search-input"
      />
      <select v-model="itemsPerPage" class="input items-per-page">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="15">15</option>
        <option :value="20">20</option>
      </select>
    </div>
    <div class="games-table-wrapper">
      <table class="games-table">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Дата</th>
            <th>Бар</th>
            <th>Комментарий</th>
            <th>Статус</th>
            <th>Изменения</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="game in filteredGames"
            :key="game.id"
            @click="goToGameTeams(game.id)"
            class="game-row"
          >
            <td>{{ game.gameNumber }}</td>
            <td>{{ game.plannedDate }}</td>
            <td>{{ findPlaceName(game.place.id) }}</td>
            <td>{{ game.comment }}</td>
            <td>{{ game.status }}</td>
            <td><button @click.stop="changeGame(game.id)">Редактировать</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">Назад</button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">Вперед</button>
    </div>
    <div class="btn-container">
      <button
        @click="goToCreateGame"
        class="button primary"
        type="submit"
        :class="{ disabled: loading }"
      >
        <Loader v-if="loading" /> Добавить игру
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Loader from '../Loader.vue'

const store = useStore()
const router = useRouter()
const games = ref([])
const places = ref([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const totalPages = computed(() => Math.ceil(filteredGames.value.length / itemsPerPage))

const changeGame = (gameId) => {
  router.push(`/admin/games/game/${gameId}/change`)
}

const filteredGames = computed(() => {
  const filtered = games.value.filter(
    (game) =>
      game.plannedDate.includes(searchQuery.value) ||
      findPlaceName(game.place.id).toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
})

const fetchGames = async () => {
  try {
    const response = await store.dispatch('games/fetchAllGames')
    games.value = response
  } catch (error) {
    console.error('Ошибка загрузки игр:', error)
  }
}

const fetchPlaces = async () => {
  await store.dispatch('places/fetchPlaces')
  places.value = store.getters['places/allPlaces']
}

const findPlaceName = (id) => {
  const place = places.value.find((place) => place.id === id)
  return place ? place.name : 'Неизвестное место'
}

const goToCreateGame = () => {
  router.push({ name: 'AdminGamesCreate' })
}

const goToGameTeams = (gameId) => {
  router.push(`/admin/games/game${gameId}`)
}

onMounted(() => {
  fetchPlaces()
  fetchGames()
})
</script>

<style scoped>
.admin-games {
  background-color: #ffffff;
  color: #000000;
  padding: 20px;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 20px;
  color: #000000;
  text-align: center;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.games-table-wrapper {
  overflow-x: auto;
  margin-bottom: 20px;
}

.games-table {
  width: 100%;
  border-collapse: collapse;
}

.games-table th,
.games-table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.games-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.game-row {
  cursor: pointer;
  transition: background 0.3s;
}

.game-row:hover {
  background-color: #f9f9f9;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.pagination button {
  padding: 10px 15px;
  font-size: 14px;
  background: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.add-game {
  max-width: 400px;
  margin: 20px auto 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input:focus {
  border-color: #007bff;
  outline: none;
}

.button {
  margin: 0 auto;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.button:hover {
  background: #0056b3;
}

.button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
