<template>
  <div class="container">
    <table border="1">
      <thead>
        <tr>
          <th>Номер команды</th>
          <th>Имя команды</th>
          <th>Привязать юзера</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(team, index) in teams" :key="index">
          <td>{{ team?.tableNumber || 'нету номера стола' }}</td>
          <td>{{ team?.name }}</td>
          <td><button @click="setUser(team.id)">Привязать юзера</button></td>
        </tr>
      </tbody>
    </table>

    <div class="buttons">
      <div class="upload-container">
        <h2>Загрузить команды из файла</h2>
        <input class="file-input" type="file" @change="handleFileChange" />
        <button class="upload-button" @click="uploadFile" :disabled="loading">
          {{ loading ? 'Загрузка...' : 'Загрузить файл' }}
        </button>
        <p v-if="uploadSuccess" class="success-message">Файл успешно загружен!</p>
      </div>
      <button @click="createTeam">Создать команду</button>
    </div>
  </div>

  <Notification
    v-if="notificationMessage"
    :message="notificationMessage"
    :type="notificationType"
    :duration="3000"
  />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '../Notification.vue'

const route = useRoute()
const router = useRouter()
const game = ref(null)
const store = useStore()
const selectedFile = ref(null)
const loading = ref(false)
const uploadSuccess = ref(false)
const notificationMessage = ref('')
const notificationType = ref('info')
const teamName = ref('')
const editingTeam = ref(null)
const teams = computed(() => store.state.games.teams[route.params.gameId] || [])

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

onMounted(() => {
  fetchGameById()
  fetchTeams()
})

watch(
  () => route.params.gameId,
  async () => {
    await fetchGameById()
    await fetchTeams()
  },
)
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 10px;
  text-align: left;
}
button {
  padding: 5px 10px;
  margin: 5px;
}
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
