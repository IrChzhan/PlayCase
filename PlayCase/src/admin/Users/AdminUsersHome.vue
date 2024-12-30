<script setup>
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

router.push({
  name: 'AdminUsersPersonal',
})

const goToUsersPersonal = () => {
  router.push({
    name: 'AdminUsersPersonal',
  })
}

const goToUsersPlayers = () => {
  router.push({
    name: 'AdminUsersPlayers',
  })
}

const isRouteActive = (routeName) => {
  const temp = route.path.split('/')
  return temp.find((el) => el === routeName) !== undefined
}
</script>

<template>
  <div class="layout">
    <div class="navbar">
      <button
        class="navbar-item"
        :class="{ active: isRouteActive('personal') }"
        @click="goToUsersPersonal"
      >
        Люди
      </button>
      <button
        class="navbar-item"
        :class="{ active: isRouteActive('players') }"
        @click="goToUsersPlayers"
      >
        Планшеты
      </button>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  background: white;
  font-family: Arial, sans-serif;
}

.layout {
  display: flex;
  background-color: #ffffff;
  height: 100%;
}

.navbar {
  width: 200px;
  background-color: #f9f9f9;
  border-right: 1px solid #e0e0e0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navbar-item {
  background: #f5f5f5;
  color: #27364f;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 10px;
  width: 90%;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
}

.navbar-item:hover {
  background: #e0e0e0;
}

.navbar-item.active {
  background: #1abc9c;
  color: #ffffff;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  height: 100%;
}
</style>
