<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">×</button>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps, watch} from 'vue';

const props = defineProps({
  show: Boolean,
  closeModal: Function,
});

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  max-width: 800px;
  max-height: 500px;
  width: calc(100% - 40px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  font-family: 'Mulish', sans-serif;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.rules-block {
  text-align: left;
}

.rules-block h1.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #333;
}

.additional-info {
  margin-top: -10px;
}

.rules-block .intro,
.rules-block .description,
.rules-block .additional-info,
.rules-block .note {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 28px;
  color: #333;
}

.rules-block .rounds-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
}

.rules-block .rounds-list li {
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.rules-block .round-number {
  font-weight: 600;
  color: #3A4C6E;
}

.rules-block .additional-info {
  font-weight: 400;
  color: #555;
}

.rules-block .note {
  font-weight: 600;
  color: #555;
}

.rules-block .highlight {
  color: #3A4C6E;
}

@media (max-width: 768px) {
  .modal-content {
    width: 90vw;
    max-width: 600px;
    padding: 15px;
  }
  .close-button {
    font-size: 20px;
  }
}
</style>
