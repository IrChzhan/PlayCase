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
          v-if="role === 'ADMIN'"
          class="topbar-button"
          :class="{ active: isRouteActive('places') }"
          @click="goToPlaces"
        >
          Места
        </button>
        <button
          class="topbar-button"
          v-if="role === 'ADMIN'"
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const role = ref('')

const checkAccess = () => {
  const personalKey = localStorage.getItem('role')
  role.value = personalKey
  if (!personalKey || role.value === 'PLAYER') {
    router.push('/')
  } else {
    router.push({ name: 'AdminGames' })
  }
}

checkAccess()

const isRouteActive = (routeName) => {
  const temp = route.path.split('/')
  return temp.find((el) => el === routeName) !== undefined
}

const goToPlaces = () => {
  router.push({ name: 'AdminPlacesHome' })
}

const goToUsers = () => {
  router.push({ name: 'AdminUsersPersonal' })
}

const goToGames = () => {
  router.push({ name: 'AdminGames' })
}

const logout = () => {
  localStorage.removeItem('personal')
  router.push('/')
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
  background: #3A4C6E;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  margin-right: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.topbar-button:hover {
  background: #CC9F33;
}

.topbar-button.active {
  background: #CC9F33;
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
}
@media screen and (min-width: 2400px) and (min-height: 1400px) {
  .container {
    gap: 60px; 
  }

  .topbar {
    padding: 20px 40px; 
  }

  .topbar-button {
    font-size: 1.7rem; 
    padding: 20px 30px; 
    border-radius: 6px; 
  }

  .logout-button {
    font-size: 1.7rem; 
    padding: 20px 30px; 
    border-radius: 6px; 
  }

  .content {
    padding: 50px; 
  }
}
</style>
