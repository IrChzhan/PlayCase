<template>
    <div class="container input-container">
      <h1>Введите название команды</h1>
      <input v-model="teamName" type="text" placeholder="Название команды">
      <h1>Введите номер стола</h1>
      <input v-model="teamTable" type="text" placeholder="Номер стола">
      <button @click="submitTeamName">Подтвердить</button>
    </div>
  </template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const teamName = ref('');
const teamTable = ref('');
const router = useRouter();

const submitTeamName = () => {
  router.push({ name: 'TeamNameDisplay', params: { teamName: teamName.value, teamTable: teamTable.value}});
};
</script>

<style scoped>
.input-container {
  display: inline-block;
  flex-direction:row;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

h1 {
    color: white;
    font-family: "Mulish", sans-serif;
}
</style>