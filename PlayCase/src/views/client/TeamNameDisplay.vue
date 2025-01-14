<template>
  <div class="container">
    <div class="container_name_team">
      <h1 class="team-name">{{ teamName || 'Загрузка...' }}</h1>
    </div>
    <div class="container_down_menu">
      <img
        src="../../assets/House_01.png"
        class="house-image"
        width="80"
        @click="goToMenuApp"
        alt="home"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import { useAuthCheck } from '@/hooks/useAuthCheck.js'

const { teamName } = useAuthCheck()
const router = useRouter()

const goToMenuApp = () => {
  router.push({ name: 'MenuApp' })
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
  position: relative;
  background: #1b2a46;
}

.team-name {
  text-align: center;
  font-size: clamp(4rem, 10vw, 9rem);
  margin: 0;
  color: var(--c-white);
  font-family: 'Mulish', sans-serif;
  font-weight: 900;
  max-width: 90vw;
  word-wrap: break-word;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
}

.container_down_menu {
  margin-top: 60px;
  position: relative; 
}

.house-image {
  cursor: pointer;
  display: block;
  position: absolute; 
  top: 60px; 
  left: 50%; 
  transform: translateX(-50%);
}

.right-corner {
  position: absolute;
  right: 10px;
  left: 400px;
  bottom: 20px;
  text-align: right;
}

.team-table {
  margin: 0;
  font-family: 'Mulish', sans-serif;
  color: #cc9f33;
}

.table-label {
  margin: 0;
  font-family: 'Mulish', sans-serif;
  color: #cc9f33;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .team-name {
    font-size: clamp(4rem, 10vw, 4rem); 
    overflow-wrap: break-word; 
  }

  .house-image {
    top: 40px; 
  }
}
</style>
