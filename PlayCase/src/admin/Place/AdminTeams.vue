<template>
  <div class="admin-teams">
    <h1>Управление командами и игрой</h1>

    <button class="button activate" @click="activateGame">
      {{ isGameActive ? 'Игра активирована' : 'Активировать игру' }}
    </button>
      <p v-if="activationSuccess" class="success-message">Игра успешно активирована!</p>

    <div class="upload-container">
      <h2>Загрузить команды из файла</h2>
      <input class="file-input" type="file" @change="handleFileChange" />
      <button class="upload-button" @click="uploadFile" :disabled="loading">
        {{ loading ? 'Загрузка...' : 'Загрузить файл' }}
      </button>
      <p v-if="uploadSuccess" class="success-message">Файл успешно загружен!</p>
    </div>

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

    <button class="button" @click="goToUploadResults">Загрузить рейтинг</button>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'AdminTeams',
  props: {
    gameId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const gameId = route.params.gameId

    const selectedFile = ref(null)
    const loading = ref(false)
    const uploadSuccess = ref(false)
    const teamName = ref('')
    const editingTeam = ref(null)

    const users = ref([])
    const isModalOpen = ref(false)
    const selectedUserId = ref(null)

    const isGameActive = ref(false)
    const activationSuccess = ref(false);

    const teams = computed(() => store.state.games.teams[props.gameId] || []);


    onMounted(async () => {
       await fetchGameStatus();
        if (!teams.value.length) {
            await fetchTeams();
        }
      getUsers()
    })

    const fetchTeams = async () => {
          try {
                await store.dispatch('games/fetchTeams', { gameId: props.gameId });
            } catch (error) {
                console.error('Ошибка при загрузке команд:', error);
            }
    }


    const fetchGameStatus = async () => {
        try {
            const response = await store.dispatch('games/fetchGameStatus', {
                gameId: props.gameId,
            })
            isGameActive.value = response.data.is_active
        } catch (error) {
            console.error('Ошибка при получении статуса игры:', error)
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

    const uploadFile = async () => {
      if (!selectedFile.value) {
        alert('Пожалуйста, выберите файл.')
        return
      }

      loading.value = true
      try {
        await store.dispatch('games/replaceTeams', {
          gameId: props.gameId,
          file: selectedFile.value,
        })
        uploadSuccess.value = true
          await fetchTeams()
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error)
        alert('Ошибка при загрузке файла. Попробуйте снова.')
      } finally {
        loading.value = false
      }
    }

    const activateGame = async () => {
      try {
        await store.dispatch('games/activateGame', { gameId: props.gameId })
          isGameActive.value = true;
          activationSuccess.value = true;
      } catch (error) {
        console.error('Ошибка при активации игры:', error)
        alert('Ошибка при активации игры. Попробуйте снова.')
      }
    }

    const goToUploadResults =
    () => {
      router.push({ name: 'AdminResults', params: { gameId } })
    }


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
         await fetchTeams();
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
          await fetchTeams()
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
          await fetchTeams()
          closeModal()
      } catch (error) {
          console.error('Ошибка установки стола:', error)
      }
    }

    return {
      selectedFile,
      loading,
      uploadSuccess,
      handleFileChange,
      uploadFile,
        teams,
      isGameActive,
      activateGame,
      activationSuccess,
      teamName,
        editingTeam,
      goToUploadResults,
      addTeam,
      startEditing,
      cancelEditing,
      updateTeam,
      deleteTeam,
      users,
      isModalOpen,
        selectedUserId,
        openAssignTableModal,
        closeModal,
      assignTable
    }
  },
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

.upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px auto;
    max-width: 400px;
}

.file-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #394a6a;
  border-radius: 5px;
  background: #27364f;
  color: white;
}

.upload-button {
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

.upload-button:hover {
  background: #45a049;
}

.upload-button:disabled {
  background: #666;
  cursor: not-allowed;
}

.success-message {
  color: #4caf50;
  text-align: center;
  margin-top: 15px;
}

.add-team,
.edit-team {
  max-width: 400px;
  margin: 20px auto;
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
  margin-top: 15px;
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
  margin: 20px auto;
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
</style>