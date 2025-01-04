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
          <th>Название</th>
          <th>Дата</th>
          <th>Заведение</th>
          <th>Статус</th>
          <th>Изменения статуса</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="game in filteredGames"
          :key="game.id"
          @click="goToGameTeams(game.id)"
          class="game-row"
        >
          <td>{{ game.name || "нет названия" }}</td>
          <td>{{ formatPlannedDate(game.plannedDate) }}</td>
          <td>{{ findPlaceName(game.place.id) }}</td>
          <td>{{ Statuses[game.status] }}</td>
          <td><button class="button primary btn-add" @click.stop="changeStatus(game.id)">Сменить статус</button></td>
          <div class="actions">
            <button @click.stop="changeGame(game.id)" class="icon-setting"><IconsSetting/></button>
            <button @click.stop="showDeleteDialog(game.id)" class="icon-setting"><IconDelete/></button>
          </div>
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
        class="button primary btn-add"
        type="submit"
        :class="{ disabled: loading }"
      >
        <Loader v-if="loading" /> Добавить игру
      </button>
    </div>
  </div>
  <ConfirmDialog
    v-if="showDialog"
    :visible="showDialog"
    :title="dialogTitle"
    :message="dialogMessage"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import Loader from '../Loader.vue';
import IconsSetting from "@/components/icons/IconsSetting.vue";
import IconDelete from "@/components/icons/IconDelete.vue";
import ConfirmDialog from "@/admin/ConfirmDialog.vue";
import Notification from "@/admin/Notification.vue";

const store = useStore();
const router = useRouter();
const games = ref([]);
const places = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);
const toastMessage = ref('');
const toastType = ref('success');
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
let dialogAction = null;

const showDeleteDialog = (id) => {
  dialogTitle.value = 'Подтверждение удаления';
  dialogMessage.value = 'Вы уверены, что хотите удалить эту игру?';
  dialogAction = deleteGame(id);
  showDialog.value = true;
};

const handleConfirm = async () => {
  showDialog.value = false;
  if (dialogAction) await dialogAction();
};

const handleCancel = () => {
  showDialog.value = false;
};

const deleteGame = (id) => async () => {
  try {
    loading.value = true;
    await store.dispatch('games/deleteGame', id);

    toastMessage.value = 'Игра успешно удалена!';
    toastType.value = 'success';

    setTimeout(() => {
      toastMessage.value = '';
      fetchGames();
    }, 1000);
  } catch (error) {
    console.error('Ошибка удаления игры:', error);
    toastMessage.value = 'Ошибка при удалении игры.';
    toastType.value = 'error';
    setTimeout(() => {
      toastMessage.value = '';
      fetchGames();
    }, 1000);
  } finally {
    loading.value = false;
  }
};

const totalPages = computed(() => {
  const filtered = games.value.filter(
    (game) =>
      game.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      findPlaceName(game.place.id).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      game.plannedDate.includes(searchQuery.value)
  );
  return Math.ceil(filtered.length / itemsPerPage.value);
});

const Statuses = {
  PLANNED: 'Запланирована',
  FINISHED: 'Завершена',
  IN_PROGRESS: 'В процессе',
  RESULT_SUMMING: 'Подведение итогов',
};

const changeGame = (gameId) => {
  router.push(`/admin/games/game/${gameId}/change`);
};

const changeStatus = (gameId) => {
  router.push(`/admin/games/game/${gameId}/changeStatus`);
};

const filteredGames = computed(() => {
  const filtered = games.value.filter(
    (game) =>
      game.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      findPlaceName(game.place.id).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      game.plannedDate.includes(searchQuery.value)
  );
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filtered.slice(startIndex, endIndex);
});

const fetchGames = async () => {
  try {
    const response = await store.dispatch('games/fetchAllGames');
    games.value = response;
  } catch (error) {
    console.error('Ошибка загрузки игр:', error);
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

const formatPlannedDate = (date) => {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
};

const goToCreateGame = () => {
  router.push({ name: 'AdminGamesCreate' });
};

const goToGameTeams = (gameId) => {
  router.push(`/admin/games/game${gameId}`);
};

onMounted(() => {
  fetchPlaces();
  fetchGames();
});
</script>

<style scoped>
.actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.icon-setting {
  padding: 10px 0;
  background: none;
  cursor: pointer;
  border: none;
}

.icon-setting:hover {
  background: none;
}

.admin-games {
  background-color: #ffffff;
  color: #000000;
  padding: 20px;
  font-family: Mulish, sans-serif;
}

h1 {
  font-size: 30px;
  font-family: Mulish, sans-serif;
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
  background: #CC9F33;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.pagination button:hover {
  background: #3A4C6E;
  color: #CC9F33;
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
  background: #CC9F33;
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
  background: #d1aa58;
}

.button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-add {
  background: #CC9F33;
  color: white;
  transition: all 0.5s ease-in-out;
}

.btn-add:hover {
  background: #3A4C6E;
  color: #CC9F33;
}
</style>
