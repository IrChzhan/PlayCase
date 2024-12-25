<template>
  <div class="admin-teams">
    <h1>Добавление команд в игру</h1>
    <p>ID игры: {{ gameId }}</p>

    <div class="add-team">
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
        <div class="form-group">
          <label for="tableNumber">Номер стола:</label>
          <input
            id="tableNumber"
            v-model="tableNumber"
            type="number"
            placeholder="Введите номер стола"
            class="input"
            required
          />
        </div>
        <button class="button primary" type="submit">
          Добавить команду
        </button>
      </form>
    </div>

    <div class="team-list">
      <h2>Список команд</h2>
      <ul>
        <li v-for="team in teams" :key="team.id">
          {{ team.name }} (Стол: {{ team.tableNumber }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()
const gameId = route.params.gameId
const teams = ref([])
const loading = ref(false)

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
        tableNumber: parseInt(tableNumber.value, 10),
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
    tableNumber.value = ''
  } catch (error) {
    console.error('Ошибка добавления команды:', error)
  }
}

onMounted(fetchTeams)
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

.add-team {
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
}
</style>
