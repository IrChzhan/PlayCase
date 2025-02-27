<template>
  <div class="container">
    <video
      ref="videoElement"
      autoplay
      loop
      muted
      playsinline
      class="background-video"
    >
      <source src="../../assets/fon.mp4" type="video/mp4">
      <source src="../../assets/fon.webm" type="video/webm">
      Your browser does not support the video tag.
    </video>
    <div class="content-wrapper">
      <div class="container_name_team">
        <h1 class="team-name" :data-text="teamName || 'Загрузка...'">{{ teamName || 'Загрузка...' }}</h1>

      </div>
      <div class="container_down_menu">
        <img
          src="../../assets/House_5.svg"
          class="house-image"
          width="80"
          @click="goToMenuApp"
          alt="home"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref} from 'vue';
import { useAuthCheck } from '@/hooks/useAuthCheck.js'

const { teamName } = useAuthCheck()
const router = useRouter()
const videoElement = ref(null)

const goToMenuApp = () => {
  router.push({ name: 'MenuApp' })
}

onMounted(() => {
  if (videoElement.value) {
    videoElement.value.play().catch(error => {
      console.error('Автовоспроизведение заблокировано:', error)
    })
  }
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
  position: relative;
}

.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
}

.content-wrapper {
  position: relative; 
  z-index: 1; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  height: 100%;
  width: 100%; 
}

.team-name {
  position: relative;
  text-align: center;
  font-size: clamp(4rem, 10vw, 9rem);
  margin: 0;
  color: var(--c-white);
  font-family: 'Mulish', sans-serif;
  font-weight: 900;
  max-width: 90vw;
  word-wrap: break-word;
  text-shadow: 0 0 20px black;
  z-index: 1;
  margin-top: 110px;
}

.team-name::before {
  content: attr(data-text);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110%;
  color: black;
  font-weight: 900;
  filter: blur(100px);
  opacity: 0.9;
  z-index: -1;
  white-space: nowrap;
}


.container_down_menu {
  margin-top: 60px;
  position: relative;
}

.house-image {
  cursor: pointer;
  display: block;
  position: relative; 
  top: 270px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 110px;
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

@media (min-width: 768px) and (max-width: 1224px) {
  .team-name {
    font-size: clamp(4rem, 10vw, 4rem);
    overflow-wrap: break-word;
  }

  .house-image {
    top: 40px;
    width: 70px;
  }
}
</style>
