<template>
  <div class="admin-teams">
    <h1>Добавление команд в игру</h1>
    <p>ID игры: {{ gameId }}</p>

    <button class="button activate" @click="activateGame">
      {{ isActiveGame ? 'Игра активирована' : 'Активировать игру' }}
    </button>

    <div class="add-team" v-if="!editingTeam">
      <h2>Добавить новую команду</h2>
      <form @submit.prevent="addTeam" class="form">
        <div class="form-group">
          <label for="teamName">Название команды:</label>
          <input
            id="teamName"
            v-model="teamName"
            type="text"
            placeholder="Введите название команды"
            class="input"
            required
          />
        </div>
        <button class="button primary" type="submit">Добавить команду</button>
      </form>
    </div>

    <div class="edit-team" v-if="editingTeam">
      <h2>Редактировать команду</h2>
      <form @submit.prevent="updateTeam" class="form">
        <div class="form-group">
          <label for="editTeamName">Название команды:</label>
          <input
            id="editTeamName"
            v-model="editingTeam.name"
            type="text"
            placeholder="Введите название команды"
            class="input"
            required
          />
        </div>
        <button class="button primary" type="submit">Сохранить изменения</button>
        <button class="button" type="button" @click="cancelEditing">Отмена</button>
      </form>
    </div>

    <div class="team-list">
      <h2>Список команд</h2>
      <ul>
        <li v-for="team in teams" :key="team.id">
          {{ team.name }} - Пользователь: {{ team.tableNumber || 'Не указан' }}
          <button class="button" @click="startEditing(team)">Изменить</button>
          <button class="button" @click="deleteTeam(team.id)">Удалить</button>
          <button class="button" @click="openAssignTableModal(team)">Привязать пользователя</button>
          <div v-if="isModalOpen" class="modal" @click.self="closeModal">
            <div class="modal-content">
              <h2>Выберите пользователя для команды</h2>
              <div class="user-list">
                <ul>
                  <li v-for="user in users" :key="user.id">
                    <input
                      type="radio"
                      :id="'user-' + user.id"
                      v-model="selectedUserId"
                      :value="user.id"
                    />
                    <label :for="'user-' + user.id">{{ user.name }}</label>
                  </li>
                </ul>
              </div>
              <button class="button" @click="assignTable(team.id)">Сохранить</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()
const gameId = route.params.gameId
const teams = ref([])
const teamName = ref('')
const editingTeam = ref(null)
const loading = ref(false)

const users = ref([])
const isModalOpen = ref(false)
const selectedUserId = ref(null)

const isActiveGame = ref(false)

const activateGame = () => {
  localStorage.setItem('activeGameId', gameId)
  isActiveGame.value = true
}

onMounted(() => {
  getUsers()
  if (localStorage.getItem('activeGameId') === gameId) {
    isActiveGame.value = true
  }
  fetchTeams()
})

const openAssignTableModal = (team) => {
  selectedUserId.value = team.tableNumber || null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const getUsers = async () => {
  const user = await store.dispatch('profile/fetchUsers')
  users.value = user
}

const fetchTeams = async () => {
  try {
    loading.value = true
    const response = await store.dispatch('games/fetchGameTeams', gameId)
    teams.value = response
  } catch (error) {
    console.error('Ошибка загрузки команд:', error)
  } finally {
    loading.value = false
  }
}

const addTeam = async () => {
  try {
    const newTeam = await store.dispatch('games/addTeamToGame', {
      gameId,
      teamData: {
        name: teamName.value,
        participantsCount: 0,
        isFirstTime: true,
        isPrepaid: true,
        certificate: '',
        promocode: '',
        markComment: '',
      },
    })
    teams.value.push(newTeam)
    teamName.value = ''
  } catch (error) {
    console.error('Ошибка добавления команды:', error)
  }
}

const startEditing = (team) => {
  editingTeam.value = { ...team }
}

const cancelEditing = () => {
  editingTeam.value = null
}

const updateTeam = async () => {
  try {
    await store.dispatch('games/updateTeamInGame', {
      gameId,
      teamId: editingTeam.value.id,
      teamData: editingTeam.value,
    })
    await fetchTeams()
    editingTeam.value = null
  } catch (error) {
    console.error('Ошибка обновления команды:', error)
  }
}

const deleteTeam = async (teamId) => {
  try {
    await store.dispatch('games/deleteTeamFromGame', { gameId, teamId })
    teams.value = teams.value.filter((team) => team.id !== teamId)
  } catch (error) {
    console.error('Ошибка удаления команды:', error)
  }
}

const assignTable = async (team) => {
  try {
    await store.dispatch('games/setUserForTeam', {
      gameId: gameId,
      teamId: team,
      userId: selectedUserId.value,
    })
  } catch (error) {
    console.error('Ошибка установки стола:', error)
  }
}
</script>

<style scoped>
.admin-teams {
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

p {
  text-align: center;
  margin-bottom: 15px;
}

.add-team,
.edit-team {
  max-width: 400px;
  margin: 0 auto 20px;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 5px;
  color: #c5c5c5;
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

.button.disabled {
  opacity: 0.5;
}
.team-list {
  max-width: 600px;
  margin: 0 auto;
}

.team-list ul {
  list-style-type: none;
  padding: 0;
}

.team-list li {
  background: #27364f;
  border: 1px solid #394a6a;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
}

.button.activate {
  background-color: #ffa500;
  margin-bottom: 20px;
}
.button.activate:hover {
  background-color: #ff8c00;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1b2a46;
  color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 80%;
  overflow-y: auto;
}

.user-list {
  max-height: 300px;
  overflow-y: auto;
}

.user-list ul {
  list-style-type: none;
  padding: 0;
}

.user-list li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

button {
  margin-top: 15px;
  width: 100%;
}

button:focus {
  outline: none;
}
</style>
