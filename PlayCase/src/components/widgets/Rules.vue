<template>
  <div class="container">
    <div class="rules-block">
      <h1 class="title">Правила игры</h1>
      <p class="intro">Вас ждут 7 раундов с небольшими перерывами после 3 и 6 раундов.</p>
      <p class="description">
        Почти во всех раундах, за редким исключением, будет по 6 вопросов. После каждого вопроса вам
        в команде надо будет посовещаться и написать ответ на бланках, которые будут лежать где-то
        рядом. После каждого раунда надо сдать бланк.
      </p>

      <ul class="rounds-list">
        <li><span class="round-number">1 раунд.</span> Разминка.</li>
        <li><span class="round-number">2 раунд.</span> На логику.</li>
        <li><span class="round-number">3 раунд.</span> Музыкальный.</li>
        <li><span class="round-number">4 раунд.</span> Интерактивный.</li>
        <li><span class="round-number">5 раунд.</span> Сюрприз.</li>
        <li><span class="round-number">6 раунд.</span> Тематический.</li>
        <li><span class="round-number">7 раунд.</span> Решающий.</li>
      </ul>

      <p class="additional-info">
        Если у вас будут появляться вопросы перед игрой или в течение нее, не стесняйтесь задавать
        их нашим помощникам.
      </p>

      <p class="note">
        Ни в коем случае <span class="highlight">нельзя забывать вкусно есть</span> и
        <span class="highlight">пить во время игры</span>! За этот пункт вашего досуга отвечают наши
        партнерские крутые бары.
      </p>
      <img src="@/assets/house_light.png" class="house_button" @click="goToMenuApp" alt="home" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import { useAuthCheck } from '@/hooks/useAuthCheck.js'

useAuthCheck()
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
  justify-content: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  text-align: center;
  background: #1B2A46;
}
.rules-block {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin: 20px auto;
  max-width: 1200px;
  max-height: 680px;
  width: calc(100% - 40px);
  font-family: 'Mulish', sans-serif;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: left;
  box-sizing: border-box;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
  margin-left: 0px;
  color: #333;
}

.intro,
.description,
.additional-info,
.note {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 28px;
  color: #333;
}

.rounds-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
}

.rounds-list li {
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.round-number {
  font-weight: 600;
  color: #3A4C6E;
}

.additional-info {
  font-weight: 400;
  color: #555;
}

.note {
  font-weight: 600;
  color: #555;
}

.highlight {
  color: #3A4C6E;
}

.house_button {
  width: 50px;
  height: 50px;
  margin-top: -20px;
  margin-left: 530px;
  cursor: pointer;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .rules-block {
    padding: 20px;
    width: calc(100% - 20px);
    max-height: 515px;
  }

  .title {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }

  .intro,
  .description,
  .additional-info,
  .note {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }

  .rounds-list li {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .house_button {
    width: 35px;
    height: 35px;
    margin-top: -50px;
    right: 10px;
    margin-left: 400px;
    cursor: pointer;
  }

  .note {
    margin-bottom: 10px;
    margin-top: -25px;
  }
}
</style>
