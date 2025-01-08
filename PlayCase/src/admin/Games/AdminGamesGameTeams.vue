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
        <th>Номер стола</th>
        <th>Имя команды</th>
        <th>Привязанный планшет</th>
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
        <td>
          <div class="user-sets" v-if="team?.assignedUserId">
            <span>{{ users.find(user => user.id === team?.assignedUserId)?.name }}</span>
            <button @click="unassignUser(team?.assignedUserId, team.id)" class="button">Отвязать</button>
          </div>
          <div v-else>
            <select v-model="selectedUser[team.id]" class="user-dropdown">
              <option value="" disabled selected>Выберите пользователя</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
            <button @click="assignUserInline(team.id)" class="button">Привязать</button>
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

const teams = computed(() => store.state.games.teams[route.params.gameId] || [])
const sortedTeams = computed(() => {
  return [...teams.value].sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
});

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

const fetchTeams = async () => {
  try {
    await store.dispatch('games/fetchTeams', { gameId: route.params.gameId });
  } catch (error) {
    console.error('Ошибка при загрузке команд:', error);
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
</style>
