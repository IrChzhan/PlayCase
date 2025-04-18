<template>
  <div class="container">
    <div class="wrapper">
      <div class="upload-container">
        <h2>Загрузить команды из файла</h2>
        <div class="file-select">
          <input
            class="file-input input-hidden"
            type="file"
            @change="handleFileChange"
            v-if="!selectedFile"
            ref="fileInput"
          />
          <button
            class="file-button btn-add"
            v-if="!selectedFile"
            @click="triggerFileInput"
          >
            Выбрать файл
          </button>
          <button
            class="file-button btn-add"
            v-if="selectedFile"
            @click="uploadFile"
            :disabled="loading"
          >
            {{ loading ? 'Загрузка...' : 'Загрузить файл' }}
          </button>
          <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
        </div>
        <p v-if="uploadSuccess" class="success-message">Файл успешно загружен!</p>
      </div>
      <button @click="check" class="button">Отзывы</button>
    </div>
    <table border="1" class="teams-table">
      <thead>
      <tr>
        <th @click="changeSort('tableNumber')">
          Номер стола
          <span v-if="sortKey === 'tableNumber'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
        </th>
        <th @click="changeSort('name')">
          Имя команды
          <span v-if="sortKey === 'name'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
        </th>
        <th @click="changeSort('email')">
          Email
          <span v-if="sortKey === 'email'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
        </th>
        <th>
          Привязанный планшет
        </th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(team, index) in sortedTeams" :key="index" class="team-row">
        <td>
          <div class="change-tale">
            <div class="change-input" v-if="selectTeamStol === team.id">
              <input class="input-change" type="text" v-model="tableNum">
              <button class="icon-setting" @click="assignTable"><IconArrow/></button>
              <button class="icon-setting" @click="cancelTable"><IconClose/></button>
            </div>
            <span v-else>{{ team?.tableNumber || 'нет номера стола' }}</span>
            <button @click="changeTable(team.id)" class="change-tale-btn"><IconPencil/></button>
          </div>
        </td>
        <td>{{ team?.name }}</td>
        <td>{{ team?.email || 'нет почты' }}</td>
        <td>
          <div class="user-sets" v-if="team?.assignedUserId">
            <span>{{ users.find(user => user.id === team?.assignedUserId)?.name }}</span>
            <button @click="unassignUser(team?.assignedUserId, team.id)" class="button">Отвязать</button>
          </div>
          <div v-else>
            <div v-if="showEditingUsers === team.id" class="change-input">
              <select v-model="selectedUser[team.id]" class="user-dropdown">
                <option value="" disabled selected>Выберите пользователя</option>
                <option v-for="user in users" :key="user.id" :value="user.id" class="text">
                  {{ user.name }}
                </option>
              </select>
              <button class="icon-setting" @click="assignUserInline(team.id)"><IconArrow/></button>
              <button class="icon-setting" @click="closeShowEditingUser"><IconClose/></button>
            </div>
            <div v-else>
              <button @click="openShowEditingUsers(team.id)" class="button">Привязать</button>
            </div>
          </div>
        </td>
        <td class="actions-column">
          <button @click.stop="changeTeam(team.id)" class="icon-setting"><IconsSetting/></button>
          <button @click.stop="showDeleteDialog(team.id)" class="icon-setting"><IconDelete/></button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="buttons">
      <button class="button" @click="createTeam">Создать команду</button>
    </div>
  </div>

  <Notification
    v-if="notificationMessage"
    :message="notificationMessage"
    :type="notificationType"
    :duration="3000"
  />
  <ConfirmDialog
    v-if="showDialog"
    :visible="showDialog"
    :title="dialogTitle"
    :message="dialogMessage"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '../Notification.vue'
import IconsSetting from "@/components/icons/IconsSetting.vue";
import IconDelete from "@/components/icons/IconDelete.vue";
import ConfirmDialog from "@/admin/ConfirmDialog.vue";
import IconPencil from "@/components/icons/IconPencil.vue";
import IconArrow from "@/components/icons/IconArrow.vue";
import IconClose from "@/components/icons/IconClose.vue";

const teamName = ref('')
const editingTeam = ref(null)
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
let dialogAction = null;

const showEditingUsers = ref(false)

const tableNum = ref(0)
const selectTeamStol = ref(null)
const route = useRoute()
const router = useRouter()
const game = ref(null)
const store = useStore()
const selectedFile = ref(null)
const loading = ref(false)
const uploadSuccess = ref(false)
const notificationMessage = ref('')
const notificationType = ref('info')
const selectedUser = ref({})
const users = ref([])
const sortKey = ref('name');
const sortDirection = ref('asc');

const openShowEditingUsers = (id) => {
  showEditingUsers.value = id;
}

const closeShowEditingUser = () => {
  showEditingUsers.value = false;
}

const teams = computed(() => store.state.games.teams[route.params.gameId] || [])
const sortedTeams = computed(() => {
  return [...teams.value].sort((a, b) => {
    let modifier = sortDirection.value === 'asc' ? 1 : -1;
    if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier;
    if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier;
    return 0;
  });
});

const changeSort = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};

onMounted(async () => {
  await fetchUsers();
  await fetchTeams();
});

const fetchUsers = async () => {
  try {
    const fetchedUsers = await store.dispatch('profile/fetchUsersPlanshet');
    users.value = store.getters['profile/usersPlanhet'];
  } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error);
  }
};

const assignUserInline = async (teamId) => {
  try {
    const userId = selectedUser.value[teamId];
    if (!userId) {
      alert('Выберите пользователя!');
      return;
    }

    await store.dispatch('games/setUserForTeam', {
      gameId: route.params.gameId,
      teamId,
      userId,
    });

    notificationMessage.value = 'Пользователь успешно привязан!';
    notificationType.value = 'success';
    await fetchTeams();
  } catch (error) {
    console.error('Ошибка при привязке пользователя:', error);
    notificationMessage.value = 'Ошибка при привязке пользователя.';
    notificationType.value = 'error';
  }
};

const unassignUser = async (userId, teamId) => {
  try {
    await store.dispatch('games/unSetUserForTeam', {
      gameId: route.params.gameId,
      teamId,
      userId,
    });

    notificationMessage.value = 'Пользователь успешно отвязан!';
    notificationType.value = 'success';
    await fetchTeams();
  } catch (error) {
    console.error('Ошибка при отвязывании пользователя:', error);
    notificationMessage.value = 'Ошибка при отвязывании пользователя.';
    notificationType.value = 'error';
  }
};


const check = () => {
  router.push(`/admin/games/${route.params.gameId}/team/feedback`)
}

const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const changeUserSet = (id, teamId) => async () => {
  try {
    await store.dispatch('games/unSetUserForTeam', {
      gameId: route.params.gameId,
      teamId: teamId,
      userId: id,
    })
    notificationMessage.value = 'Планшет успешно отвязан!'
    notificationType.value = 'success'
    setTimeout(() => {
      notificationMessage.value = ''
      fetchTeams()
    }, 1000)
  } catch (error) {
    console.error('Ошибка при привязке пользователя:', error)
    notificationMessage.value = 'Ошибка '
    notificationType.value = 'error'
  }
}

const assignTable = async () => {
  try {
    await store.dispatch('games/setStolForTeam', {
      gameId: route.params.gameId,
      teamId: selectTeamStol.value,
      num: tableNum.value,
    })
    notificationMessage.value = 'Команда успешна удалена!'
    notificationType.value = 'success'
    cancelTable()
    setTimeout(() => {
      notificationMessage.value = ''
      fetchTeams()
    }, 1000)
  } catch (error) {
    console.error('Ошибка при привязке пользователя:', error)
    notificationMessage.value = 'Ошибка при удаление команды.'
    notificationType.value = 'error'
  }
}

const cancelTable = () => {
  selectTeamStol.value = null
  tableNum.value = 0
}

const changeTable = (id) => {
  selectTeamStol.value = id
}

const showDeleteDialog = (id) => {
  dialogTitle.value = 'Подтверждение удаления';
  dialogMessage.value = 'Вы уверены, что хотите удалить эту команду?';
  dialogAction = handleSubmitDelete(id);
  showDialog.value = true;
};

const handleConfirm = async () => {
  showDialog.value = false;
  if (dialogAction) await dialogAction();
};

const handleCancel = () => {
  showDialog.value = false;
};

const handleSubmitDelete = (id) => async () => {
  try {
    const response = await store.dispatch('games/deleteTeamToGame', {
      gameId: route.params.gameId,
      teamId: id,
    })

    notificationMessage.value = 'Команда успешна удалена!'
    notificationType.value = 'success'
    setTimeout(() => {
      notificationMessage.value = ''
      fetchTeams()
    }, 1000)
  } catch (error) {
    notificationMessage.value = 'Ошибка при удаление команды.'
    notificationType.value = 'error'
  }
}

const fetchGameById = async () => {
  try {
    const res = await store.dispatch('games/fetchGameById', route.params.gameId)
    game.value = res
  } catch (error) {
    console.error('Ошибка при загрузке данных об игре:', error)
  }
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
  if (selectedFile.value) {
    console.log('Имя файла:', selectedFile.value.name)
    console.log('Размер файла:', selectedFile.value.size)
    console.log('Тип файла:', selectedFile.value.type)
  }
}

const fetchTeams = async () => {
  try {
    await store.dispatch('games/fetchTeams', { gameId: route.params.gameId })
  } catch (error) {
    console.error('Ошибка при загрузке команд:', error)
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) {
    alert('Пожалуйста, выберите файл.')
    return
  }

  loading.value = true
  notificationMessage.value = 'Загрузка файла...'
  notificationType.value = 'info'

  try {
    await store.dispatch('games/replaceTeams', {
      gameId: route.params.gameId,
      file: selectedFile.value,
    })
    uploadSuccess.value = true
    await fetchTeams()

    notificationMessage.value = 'Файл успешно загружен!'
    notificationType.value = 'success'

    setTimeout(() => {
      selectedFile.value = null
      uploadSuccess.value = false
    }, 1000)
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error)

    notificationMessage.value = 'Ошибка при загрузке файла.'
    notificationType.value = 'error'
  } finally {
    loading.value = false
  }
}

const createTeam = () => {
  router.push(`/admin/games/${route.params.gameId}/team/create`)
}

const setUser = (teamId) => {
  router.push(`/admin/games/${route.params.gameId}/team/${teamId}/setUser`)
}

const changeTeam = (teamId) => {
  router.push(`/admin/games/${route.params.gameId}/team/${teamId}/changeTeam`)
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.user-sets {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.change-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.change-tale{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.change-tale-btn {
  background: none;
  cursor: pointer;
  border: none;
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.upload-container {
  margin: 20px 0;
}

.file-select {
  display: flex;
  gap: 10px;
  align-items: center;
}

.file-input {
  display: block;
}

.file-button {
  padding: 10px;
  background-color: #CC9F33;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.file-button:hover {
  background-color: #3A4C6E;
  color: #CC9F33;
}

.file-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success-message {
  color: #CC9F33;
  font-size: 14px;
  margin-top: 10px;
}

.teams-table-wrapper {
  padding: 20px;
  background-color: #ffffff;
  color: #000000;
  font-family: Mulish, sans-serif;
}

h1 {
  font-size: 30px;
  margin-bottom: 20px;
  color: #000000;
  text-align: center;
}

.teams-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.teams-table th,
.teams-table td {
  padding: 2px;
  border: 1px solid #ccc;
  text-align: left;
}

.teams-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.team-row {
  cursor: pointer;
  transition: background 0.3s;
}

.team-row:hover {
  background-color: #f9f9f9;
}

.actions {
  display: flex;
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

.input-change {
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.input-change:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.btn-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
q
.user-dropdown {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.button {
  padding: 8px 12px;
  background-color: #CC9F33;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2px;
}

.button:hover {
  background-color: #3A4C6E;
  color: #CC9F33;
}

.button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-add {
  width: 200px;
}
.actions-column {
  text-align: center;
  border: none;
}

.actions-column .icon-setting {
  margin: 0 5px;
}
.teams-table th:last-child,
.teams-table td:last-child {
  text-align: center;
  border: none;
}
td:last-child:hover {
  background-color: transparent;
}

.teams-table th:last-child {
  background: transparent;
}
.file-select {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-hidden {
  display: none;
}

.file-button {
  padding: 10px;
  background-color: #CC9F33;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.file-button:hover {
  background-color: #d1aa58;
  color: white;
}

.file-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.file-name {
  margin-top: 5px;
  font-size: 0.9rem;
  color: #555;
}

.success-message {
  color: #CC9F33;
  font-size: 14px;
  margin-top: 10px;
}


.text {
  font-size: 20px;
}

@media screen and (min-width: 2400px) and (min-height: 1400px) {
  h1 {
    font-size: 50px; 
    margin-bottom: 40px; 
  }

  h2 {
    font-size: 36px; 
    margin-bottom: 20px; 
  }
  .text {
    font-size: 26px;
  }
  .teams-table-wrapper {
    padding: 40px; 
  }

  .teams-table th,
  .teams-table td {
    padding: 15px; 
    font-size: 26px; 
  }

  .teams-table th {
    font-size: 28px; 
  }

  .file-button {
    padding: 20px 35px; 
    font-size: 24px; 
    border-radius: 10px; 
  }

  .btn-add {
    width: 300px;
  }

  .button {
    padding: 15px 35px; 
    font-size: 24px; 
    border-radius: 8px; 
  }

  .input-change {
    padding: 15px; 
    font-size: 24px; 
    border-radius: 12px; 
  }

  .file-name {
    font-size: 35px; 
  }

  .success-message {
    font-size: 26px; 
  }
  .icon-setting {
    padding: 0;
    width: 40px;
    height: 40px;
  }
  .user-dropdown {
    padding: 10px 30px;
  }
}


</style>
