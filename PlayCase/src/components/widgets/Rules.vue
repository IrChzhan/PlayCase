<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title">ПРАВИЛА</h1>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <p>Вас ждут <b class="seven">7 раундов</b> с перерывами после 3 и 6 раундов.</p>
        <br>
        <p>
          После каждого вопроса участники команды совещаются и пишут ответ на бланках, которые лежат на столах.
          Бланки необходимо сдавать после каждого раунда. Всего за игру можно набрать максимум <b>1000 баллов</b>.
        </p>
        <br>
        <ul class="rounds-list">
          <li><b>1 раунд.</b> Начало</li>
          <li><b>2 раунд.</b> Логика</li>
          <li><b>3 раунд.</b> Картинки</li>
          <li><b>4 раунд.</b> Комбо</li>
          <li><b>5 раунд.</b> Хет-трик</li>
          <li><b>6 раунд.</b> Связь</li>
          <li><b>7 раунд.</b> Финал</li>
        </ul>
        <br>
        <p>
          На наших играх запрещено пользоваться электронными устройствами, поэтому не забудьте отложить их на время вопросов.
        </p>
        <br>
        <p>
          Если у вас будут появляться вопросы перед игрой или в течение неё, не стесняйтесь задавать их нашим хелперам.
        </p>
        <p class="highlighted-text">
          Ни в коем случае <b>нельзя забывать вкусно есть и пить во время игры!</b>
        </p>
        <p>Меню можно посмотреть прямо на этом планшете или попросить у официанта.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, watch } from 'vue';

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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  backdrop-filter: blur(8px);
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  border-radius: 8px;
  padding: 6px;
  max-width: 860px;
  width: 95%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: 'Mulish', sans-serif;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1B2A46;
  padding: 12px 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  text-align: center;
  height: 30px;
}

.modal-title {
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
  flex-grow: 1;
  text-align: center;
  margin-left: 10px;
}

.seven {
  font-weight: bold;
  color: #1c2b4b;
}

.close-button {
  background: none;
  border: none;
  font-size: 30px;
  margin-bottom: 6px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  color: #333;
  font-size: 18px;
}

.rounds-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.rounds-list li {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
}

.highlighted-text {
  font-weight: bold;
  color: #1c2b4b;
  margin-top: 20px;
}
</style>
