<template>
  <div class="edit-game">
    <h1>Редактировать игру</h1>
    <form @submit.prevent="saveChanges" class="form">
      <div class="form-group">
        <small class="old-data">Старое название: {{ oldGameData.name }}</small>
        <label for="nameGame">Название игры:</label>
        <input
          id="nameGame"
          v-model="nameGame"
          type="text"
          placeholder="Введите название игры"
          class="input"
          required
        />
      </div>
      <div class="form-group">
        <small class="old-data">Старая дата: {{ oldGameData.plannedDate }}</small>
        <label for="plannedDate">Дата проведения:</label>
        <div class="clickable-date" @click="focusDateInput">
          <input
            id="plannedDate"
            v-model="plannedDate"
            type="date"
            class="input full-click"
            required
            ref="dateInput"
          />
        </div>
      </div>
      <div class="form-group">
        <small class="old-data">Старое место: {{ oldGameData.placeName }}</small>
        <label for="placeId">Выберите место:</label>
        <select id="placeId" v-model="selectedPlaceId" class="input" required>
          <option value="" disabled>Выберите место</option>
          <option v-for="place in places" :key="place.id" :value="place.id">
            {{ place.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <small class="old-data" v-if="oldGameData.price !== null">Старая цена: {{ oldGameData.price }}</small>
        <label for="price">Цена:</label>
        <input
          id="price"
          v-model="price"
          type="number"
          placeholder="Введите цену"
          class="input"
          min="10"
        />
      </div>
      <div class="form-actions">
        <button class="button primary" type="submit" :disabled="!isFormValid || loading">
          <Loader v-if="loading" /> Сохранить изменения
        </button>
        <button class="button secondary" type="button" @click="goBack">Назад</button>
      </div>
    </form>
    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Loader from '@/admin/Loader.vue'
import Notification from '@/admin/Notification.vue'

const router = useRouter()
const route = useRoute()
const store = useStore()
const plannedDate = ref('')
const loading = ref(false)
const isFormValid = computed(() => plannedDate.value && selectedPlaceId.value)
const selectedPlaceId = ref('')
const nameGame = ref('')
const places = ref([])
const toastMessage = ref('')
const toastType = ref('success')
const gameId = ref(null)
const price = ref(null)
const oldGameData = ref({
  name: '',
  plannedDate: '',
  placeName: '',
  price: null 
})

const saveChanges = async () => {
  if (isFormValid.value) {
    try {
      loading.value = true
      const updatedGameRequest = {
        gameId: route.params.gameId,
        gameData: {
          plannedDate: plannedDate.value,
          placeId: selectedPlaceId.value,
          name: nameGame.value,
          price: price.value ? Number(price.value) : 1500
        },
      }

      await store.dispatch('games/updateGame', updatedGameRequest)

      toastMessage.value = 'Изменения успешно сохранены!'
      toastType.value = 'success'

      setTimeout(() => {
        toastMessage.value = ''
        router.push({ name: 'AdminGames' })
      }, 1000)
    } catch (error) {
      console.error('Ошибка сохранения изменений:', error)
      toastMessage.value = 'Ошибка при сохранении изменений.'
      toastType.value = 'error'
      setTimeout(() => {
        toastMessage.value = ''
      }, 3000)
    } finally {
      loading.value = false
    }
  }
}

const dateInput = ref(null)

const focusDateInput = () => {
  dateInput.value?.focus()
  dateInput.value?.showPicker()
}

const fetchPlaces = async () => {
  await store.dispatch('places/fetchPlacesGames')
  places.value = store.getters['places/allGamesPlaces']
}

const fetchGameDetails = async (id) => {
  try {
    const game = await store.dispatch('games/fetchGameById', id)
    if (game) {
      nameGame.value = game.name
      plannedDate.value = game.plannedDate
      selectedPlaceId.value = game.place.id
      price.value = game.price || null 
      gameId.value = game.id
      oldGameData.value = {
        name: game.name,
        plannedDate: game.plannedDate,
        placeName: places.value.find(p => p.id === game.place.id)?.name || 'Неизвестно',
        price: game.price || null 
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки данных игры:')
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchPlaces()

  const id = route.params.gameId
  if (id) {
    fetchGameDetails(id)
  }
})
</script>

<style scoped>
.edit-game {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 1rem;
  color: #555;
}

.old-data {
  display: block;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 5px;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit'] {
  background-color: #CC9F33;
}

button[type='submit']:hover {
  background-color: #d1aa58;
}

button[type='button'] {
  background-color: #6c757d;
}

button[type='button']:hover {
  background-color: #5a6268;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.primary {
  background-color: #007bff;
}

.primary:hover {
  background-color: #0056b3;
}

.secondary {
  background-color: #6c757d;
}

.secondary:hover {
  background-color: #5a6268;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  color: white;
  z-index: 1000;
  animation: slide-in 0.3s ease-out;
  background-color: #27364f;
  border-left: 5px solid;
}

.notification.success {
  border-left-color: #4caf50;
}

.notification.error {
  border-left-color: #f44336;
}

.notification.warning {
  border-left-color: #ff9800;
}

.notification.info {
  border-left-color: #2196f3;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.input.full-click {
  cursor: pointer;
}

.input::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

.clickable-date {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.clickable-date .input {
  pointer-events: none;
}

@media screen and (min-width: 2400px) and (min-height: 1400px) {
  .edit-game {
    padding: 40px; 
  }

  h1 {
    font-size: 50px; 
    margin-bottom: 40px;
  }

  label {
    font-size: 36px;
    margin-bottom: 20px;
  }

  .old-data {
    font-size: 28px; 
    margin-bottom: 20px;
  }

  .input {
    padding: 17px; 
    font-size: 26px; 
    border-radius: 12px; 
  }

  .form-actions {
    gap: 20px; 
    margin-top: 40px;
  }

  button {
    padding: 20px 35px; 
    font-size: 28px; 
    border-radius: 12px;
  }

  .notification {
    padding: 25px 35px; 
    font-size: 28px; 
    border-radius: 12px; 
  }
}
</style>