<template>
  <div class="congrats-page">
    <div class="close-button" @click="goToMenuApp">✖️</div>
    <div class="content">
      <h1 class="title">ПОЗДРАВЛЯЕМ!!</h1>
      <p class="subtitle">Вы заняли 1 место!!</p>
    </div>
    <img src="../../assets/house_light.png" class="home-button" @click="goToMenuApp" />
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const teamName = route.params.teamName
    const teamTable = route.params.teamTable

    const goToMenuApp = () => {
      router.push({ name: 'MenuApp', params: { teamName: teamName, teamTable: teamTable } })
    }
    return { goToMenuApp, teamName, teamTable }
  },
}
</script>

<style scoped>
.congrats-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #001845;
  color: #cc9f33;
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
  color: #cc9f33;
  cursor: pointer;
}

.content {
  text-align: center;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: #cc9f33;
  font-weight: bold;
}

.subtitle {
  font-size: 2rem;
  font-weight: 600;
}

.home-button {
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: 20px;
  cursor: pointer;
}

.congrats-page::before {
  content: '';
  position: absolute;
  background-image: url('@/assets/lines.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.congrats-page::before {
  top: 0;
  left: 0;
  width: 1300px;
  height: 1300px;
}

@media (min-width: 768px) and (max-width: 1000px) {
  .home-button {
    width: 40px;
    height: 40px;
  }

  .close-button {
    font-size: 1.2rem;
  }

  .congrats-page::before {
    top: 0;
    left: 0;
    width: 1000px;
    height: 1000px;
  }
}
</style>
