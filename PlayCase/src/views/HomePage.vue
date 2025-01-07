<template>
  <div class="home-page">
    <div class="button-container">
      <button class="custom-button" @click="goToTeamNameDisplay">Гость</button>
      <button class="custom-button" @click="goToAuthPage">Персонал</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const token = localStorage.getItem('token')

if (token !== null) {
  router.push({name: 'Watch'})
}

const goToTeamNameDisplay = () => {
  router.push({ name: 'TeamNameInput' })
}

const goToAuthPage = () => {
  router.push({ name: 'AdminAuthPage' })
}
</script>

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1b2a46;
}

.button-container {
  display: flex;
  gap: 20px;
}

.custom-button {
  background-color: #ffffff;
  color: #1e3a8a;
  border: 2px solid #1e3a8a;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.custom-button:hover {
  background-color: #1e3a8a;
  color: #ffffff;
}
</style>
