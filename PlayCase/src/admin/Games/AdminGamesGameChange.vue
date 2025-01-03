<template>
  <div class="edit-game">
    <h1>Редактировать игру</h1>
    <form @submit.prevent="saveChanges" class="form">
      <div class="form-group">
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
        <label for="plannedDate">Дата проведения:</label>
        <input id="plannedDate" v-model="plannedDate" type="date" class="input" required />
      </div>
      <div class="form-group">
        <label for="placeId">Выберите место:</label>
        <select id="placeId" v-model="selectedPlaceId" class="input" required>
          <option value="" disabled>Выберите место</option>
          <option v-for="place in places" :key="place.id" :value="place.id">
            {{ place.name }}
          </option>
        </select>
      </div>
      <div class="form-actions">
        <button class="button primary" type="submit" :disabled="!isFormValid || loading">
          <Loader v-if="loading" /> Сохранить изменения
        </button>
        <button class="button danger" type="button" @click="deleteGame" :disabled="loading">
          Удалить игру
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

const deleteGame = async () => {
  try {
    loading.value = true
    await store.dispatch('games/deleteGame', route.params.gameId)

    toastMessage.value = 'Игра успешно удалена!'
    toastType.value = 'success'

    setTimeout(() => {
      toastMessage.value = ''
      router.push({ name: 'AdminGames' })
    }, 1000)
  } catch (error) {
    console.error('Ошибка удаления игры:', error)
    toastMessage.value = 'Ошибка при удалении игры.'
    toastType.value = 'error'
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  } finally {
    loading.value = false
  }
}

const fetchPlaces = async () => {
  await store.dispatch('places/fetchPlaces')
  places.value = store.getters['places/allPlaces']
}

const fetchGameDetails = async (id) => {
  try {
    const game = await store.dispatch('games/fetchGameById', id)
    if (game) {
      nameGame.value = game.name
      plannedDate.value = game.plannedDate
      selectedPlaceId.value = game.placeId
      gameId.value = game.id
    }
  } catch (error) {
    console.error('Ошибка загрузки данных игры:', error)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchPlaces()

  const { id } = router.currentRoute.value.params
  if (id) {
    fetchGameDetails(id)
  }
})
</script>

<style scoped></style>
