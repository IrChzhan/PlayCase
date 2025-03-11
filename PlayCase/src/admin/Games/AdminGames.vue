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
      <table class="games-table" :class="{'abra':role === 'CASHIER' || role === 'PRESENTER'}">
        <thead>
        <tr>
          <th @click="sortTable('name')">
            Название
            <span class="sort-arrows">
              <span v-if="sortKey === 'name' && sortOrder === 'asc'">↑</span>
              <span v-if="sortKey === 'name' && sortOrder === 'desc'">↓</span>
            </span>
          </th>
          <th @click="sortTable('plannedDate')">
            Дата
            <span class="sort-arrows">
              <span v-if="sortKey === 'plannedDate' && sortOrder === 'asc'">↑</span>
              <span v-if="sortKey === 'plannedDate' && sortOrder === 'desc'">↓</span>
            </span>
          </th>
          <th @click="sortTable('place')">
            Заведение
            <span class="sort-arrows">
              <span v-if="sortKey === 'place' && sortOrder === 'asc'">↑</span>
              <span v-if="sortKey === 'place' && sortOrder === 'desc'">↓</span>
            </span>
          </th>
          <th @click="sortTable('status')">
            Статус
            <span class="sort-arrows">
              <span v-if="sortKey === 'status' && sortOrder === 'asc'">↑</span>
              <span v-if="sortKey === 'status' && sortOrder === 'desc'">↓</span>
            </span>
          </th>
          <th v-if="(role !== 'CASHIER' && role !== 'PRESENTER')">Изменения статуса</th>
          <th v-if="(role !== 'CASHIER' && role !== 'PRESENTER')"></th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="game in sortedGames"
          :key="game.id"
          @click="goToGameTeams(game.id)"
          class="game-row"
        >
          <td :class="{
    'status-finished': game.status === 'FINISHED',
    'status-result': game.status === 'RESULT_SUMMING',
    'status-in-progress': game.status === 'IN_PROGRESS'
  }">{{ game.name || "нет названия" }}
          </td>
          <td :class="{
    'status-finished': game.status === 'FINISHED',
    'status-result': game.status === 'RESULT_SUMMING',
    'status-in-progress': game.status === 'IN_PROGRESS'
  }">{{ formatPlannedDate(game.plannedDate) }}
          </td>
          <td :class="{
    'status-finished': game.status === 'FINISHED',
    'status-result': game.status === 'RESULT_SUMMING',
    'status-in-progress': game.status === 'IN_PROGRESS'
  }">{{ game.place.name }}
          </td>
          <td :class="{
    'status-finished': game.status === 'FINISHED',
    'status-result': game.status === 'RESULT_SUMMING',
    'status-in-progress': game.status === 'IN_PROGRESS'
  }">{{ Statuses[game.status] }}
          </td>
          <td v-if="(role !== 'CASHIER' && role !== 'PRESENTER')" :class="{
    'status-finished': game.status === 'FINISHED',
    'status-result': game.status === 'RESULT_SUMMING',
    'status-in-progress': game.status === 'IN_PROGRESS'
  }">
            <button class="button primary btn-add" @click.stop="changeStatus(game.id)">Сменить статус</button>
          </td>
          <td v-if="(role !== 'CASHIER' && role !== 'PRESENTER')" class="actions-column">
            <button @click.stop="changeGame(game.id)" class="icon-setting">
              <IconsSetting />
            </button>
            <button @click.stop="showDeleteDialog(game.id)" class="icon-setting">
              <IconDelete />
            </button>
          </td>
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
        v-if="(role !== 'CASHIER' && role !== 'PRESENTER')"
        @click="goToCreateGame"
        class="button primary btn-add"
        type="submit"
        :class="{ disabled: loading }"
      >
        <Loader v-if="loading"/>
        Добавить игру
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
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000"/>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';

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
const itemsPerPage = ref(20);
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
const role = ref('')

const checkAccess = () => {
  const personalKey = localStorage.getItem('role')
  role.value = personalKey
  if (!personalKey || role.value === 'PLAYER') {
    router.push('/')
  } else {
    router.push({ name: 'AdminGames' })
  }
}


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

  filtered.sort((a, b) => new Date(a.plannedDate) - new Date(b.plannedDate));

  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filtered.slice(startIndex, endIndex);
});

const sortKey = ref('');
const sortOrder = ref('asc');

const sortTable = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const sortedGames = computed(() => {
  const sorted = [...filteredGames.value];
  sorted.sort((a, b) => {
    const fieldA = sortKey.value === 'place' ? findPlaceName(a.place.id) : a[sortKey.value];
    const fieldB = sortKey.value === 'place' ? findPlaceName(b.place.id) : b[sortKey.value];

    if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
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
  await store.dispatch('places/fetchPlacesGames');
  places.value = store.getters['places/allGamesPlaces'];
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
  router.push({name: 'AdminGamesCreate'});
};

const goToGameTeams = (gameId) => {
  router.push(`/admin/games/game${gameId}`);
};

onMounted(() => {
  fetchPlaces();
  fetchGames();
  checkAccess()
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
    padding: 2px;
    border: 1px solid #ccc;
    text-align: left;
    line-height: 1.2;
}

.games-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.games-table th:last-child {
  background-color: transparent;
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

.status-finished {
  background-color: #ffcccc;
}

.status-result {
  background-color: #fff2cc;
}

.status-in-progress {
  background-color: #ccffcc;
}

.actions-column {
  text-align: center;
  border: none;
}

.actions-column .icon-setting {
  margin: 0 5px;
}

.games-table th:last-child,
.games-table td:last-child {
  text-align: center;
  border: none;
}
td:last-child:hover {
  background-color: transparent;
}
.games-table-wrapper {
  overflow-x: auto;
  margin-bottom: 20px;
}

.games-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.games-table th,
.games-table td {
  border: 1px solid #ccc;
  text-align: left;
  word-wrap: break-word;
}

.games-table th:nth-child(1),
.games-table td:nth-child(1) {
  width: 20%;
}

.games-table th:nth-child(2),
.games-table td:nth-child(2) {
  width: 15%;
}

.games-table th:nth-child(3),
.games-table td:nth-child(3) {
  width: 25%;
}

.games-table th:nth-child(4),
.games-table td:nth-child(4) {
  width: 10%;
}

.games-table th:nth-child(5),
.games-table td:nth-child(5) {
  width: 15%;
}
.abra th:last-child {
  padding: 10px;
  background-color: #f4f4f4;
  border: 1px solid #ccc;
  text-align: left;
}
.abra td:last-child
{
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

@media screen and (min-width: 2400px) and (min-height: 1400px) {
  .admin-games {
    padding: 40px; 
  }

  h1 {
    font-size: 50px; 
    margin-bottom: 40px;
  }

  .search-bar {
    margin-bottom: 40px;
  }

  .search-input {
    padding: 15px; 
    font-size: 26px; 
  }

  .games-table th,
  .games-table td {
    padding: 15px; 
    font-size: 28px; 
  }

  .pagination {
    gap: 20px; 
    margin-bottom: 40px;
  }

  .pagination button {
    padding: 15px 25px; 
    font-size: 28px; 
  }

  .add-game {
    max-width: 600px; 
  }

  .input {
    padding: 15px; 
    font-size: 26px; 
  }

  .button {
    padding: 15px 25px; 
    font-size: 26px; 
  }

  .games-table th:nth-child(1),
  .games-table td:nth-child(1) {
    width: 20%; 
  }

  .games-table th:nth-child(2),
  .games-table td:nth-child(2) {
    width: 10%;
  }

  .games-table th:nth-child(3),
  .games-table td:nth-child(3) {
    width: 20%;
  }

  .games-table th:nth-child(4),
  .games-table td:nth-child(4) {
    width: 20%;
  }

  .games-table th:nth-child(5),
  .games-table td:nth-child(5) {
    width: 15%;
  }
  .games-table th:nth-child(6),
  .games-table td:nth-child(6) {
    width: 6%;
  }
  .pagination span {
    font-size: 26px;
  }
  .icon-setting {
    width: 50px;
    height: 50px;
  }
}

</style>

