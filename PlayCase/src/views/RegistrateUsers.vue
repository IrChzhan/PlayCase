<template>
  <div class="register-users-page">
    <div class="close-button" @click="goToMenuApp">✖️</div>
    <h1>Registered Users</h1>
    <div v-if="registeredUsers.length === 0">
      <p>No users have registered for the lottery yet.</p>
    </div>
    <div v-else>
      <div v-for="(user, index) in registeredUsers" :key="index" class="user-item">
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Phone:</strong> {{ user.phone }}</p>
      </div>
    </div>
    <img src="@/assets/house_light.png" class="home-button" @click="goToMenuApp" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'

const registeredUsers = ref([])
const route = useRoute()

onMounted(() => {
  if (route.params && route.params.registeredUsers) {
    registeredUsers.value = route.params.registeredUsers
  }
})

const goToMenuApp = () => {
  router.push({ name: 'MenuApp', params: { teamName: 'dada', teamTable: 'dadasd' } })
}
</script>

<style scoped>
.register-users-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #001845;
  color: #ffd700;
  height: 100vh;
  position: relative;
  font-family: 'Mulish', sans-serif;
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
  cursor: pointer;
}
.user-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ffd700;
}
.home-button {
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: 20px;
  cursor: pointer;
}

.register-users-page::before,
.register-users-page::after {
  content: '';
  position: absolute;
  background-image: url('@/assets/lines.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.register-users-page::before {
  top: 0;
  left: 0;
  width: 150px;
  height: 150px;
}

.register-users-page::after {
  bottom: 0;
  right: 0;
  width: 150px;
  height: 150px;
}
</style>
