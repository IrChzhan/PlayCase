<template>
  <div class="container input-container">
    <h1>Введите номер стола</h1>
    <br>
    <input v-model="teamTable" type="text" placeholder="Номер стола" />
    <button @click="submitTeamName">Подтвердить</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const teamTable = ref('')
const router = useRouter()

const submitTeamName = () => {
  router.push({
    name: 'TeamNameDisplay',
    params: { teamTable: teamTable.value },
  })
}
</script>

<style scoped>
.input-container {
  display: inline-block;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 20px;
}

input {
  margin-bottom: 15px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 15px;
}

button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

h1 {
  color: white;
  font-family: 'Mulish', sans-serif;
  margin-left: 20px;
}
</style>
