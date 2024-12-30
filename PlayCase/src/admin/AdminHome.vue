<template>
  <div class="block">
    <div class="topbar">
      <div class="container">
        <button
          class="topbar-button"
          :class="{ active: isRouteActive('games') }"
          @click="goToGames"
        >
          Игры
        </button>
        <button
          class="topbar-button"
          :class="{ active: isRouteActive('places') }"
          @click="goToPlaces"
        >
          Места
        </button>
        <button
          class="topbar-button"
          :class="{ active: isRouteActive('users') }"
          @click="goToUsers"
        >
          Юзеры
        </button>
      </div>
      <button class="logout-button" @click="logout">Выйти</button>
    </div>

    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const role = ref('')

const checkAccess = () => {
  const personalKey = localStorage.getItem('role')
  role.value = personalKey
  if (!personalKey || role.value === 'PLAYER') {
    router.push('/auth')
  }
}

checkAccess()

const isRouteActive = (routeName) => {
  const temp = route.path.split('/')
  return temp.find((el) => el === routeName) !== undefined
}

const goToPlaces = () => {
  router.push({ name: 'AdminPlaces' })
}

const goToUsers = () => {
  router.push({ name: 'AdminUsersPersonal' })
}

const goToGames = () => {
  router.push({ name: 'AdminGames' })
}

const logout = () => {
  localStorage.removeItem('personal')
  router.push('/auth')
}
</script>

<style scoped>
.block {
  height: 100%;
}
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

.container {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.topbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f8f8;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.topbar-button {
  background: #4b6587;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  margin-right: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.topbar-button:hover {
  background: #34495e;
}

.topbar-button.active {
  background: #1abc9c;
}

.logout-button {
  background: #d9534f;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
}

.logout-button:hover {
  background: #c9302c;
}

.content {
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1) inset;
}
</style>
