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

        <div class="rounds-container">
          <ul class="rounds-list">
            <li v-for="(round, index) in rounds" :key="index">
              <a href="#" @click.prevent="selectRound(index)"><b>{{ round.title }}</b></a>
            </li>
          </ul>

          <div v-if="selectedRound !== null" class="round-description">
            <h3>{{ rounds[selectedRound].pretitle }}</h3>
            <p v-html="rounds[selectedRound].description"></p>
          </div>
        </div>

        <br>
        <p>На наших играх запрещено пользоваться электронными устройствами, поэтому не забудьте отложить их на время вопросов.</p>
        <br>
        <p>Если у вас будут появляться вопросы перед игрой или в течение неё, не стесняйтесь задавать их нашим хелперам.</p>
        <p class="highlighted-text">
          Ни в коем случае <b>нельзя забывать вкусно есть и пить во время игры!</b>
        </p>
        <p>Меню можно посмотреть прямо на этом планшете или попросить у официанта.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  closeModal: Function,
});

const selectedRound = ref(null);

const rounds = ref([
  { 
    title: '1 раунд. Начало', 
    pretitle: 'РАУНД 1 / Начало', 
    description: `
      <b>6 вопросов, к каждому указаны 4 варианта ответа.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Правильный ответ: +10 баллов за каждую букву</li>
        <li>Неправильный ответ: –5 баллов за каждую букву</li>
        <li>Время на обсуждение: 30 секунд</li>
        <li>В раунде могут быть вопросы без правильных ответов или с несколькими верными вариантами</li>
        <li>Максимум: 120 баллов</li>
      </ul>
    ` 
  },
  { 
    title: '2 раунд. Логика', 
    pretitle: 'РАУНД 2 / Логика',
    description: `
      <b>6 логических вопросов, ответы в свободной форме.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Время на каждый вопрос: 60 секунд</li>
        <li>За правильный ответ: +20 баллов</li>
        <li>Максимум: 120 баллов</li>
      </ul>
    ` 
  },
  { 
    title: '3 раунд. Картинки', 
    pretitle: 'РАУНД 3 / Картинки',
    description: `
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Каждой команде выдаётся 10 картинок.</li>
        <li>Время на обсуждение: 360 секунд</li>
        <li>Нужно отгадать зашифрованные фильмы, песни или книги и вписать ответы в бланк (номер картинки = номер вопроса)</li>
        <li>Правильный ответ: +10 баллов</li>
        <li>Максимум: 100 баллов</li>
      </ul>
    ` 
  },
  { 
    title: '4 раунд. Комбо', 
    pretitle: 'РАУНД 4 / Комбо',
    description: `
      <b>6 вопросов, ответы в свободной форме.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Время на каждый вопрос: 60 секунд</li>
        <li>За правильный ответ: +20 баллов</li>
        <li>После вопросов — выбор одной из трёх комбинаций (30 секунд). Если все ответы соответствующего цвета верны, вы получаете дополнительные  баллы. Штрафы за ошибки в комбинациях не предусмотрены.</li>
        <li>Максимум: 170 баллов.</li>
      </ul>
    ` 
  },
  { 
    title: '5 раунд. Хет-трик', 
    pretitle: 'РАУНД 5 / Хет-трик',
    description: `
      <b>6 вопросов, на каждый можно дать до трёх ответов.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Время на обсуждение: 30 секунд на вопрос</li>
        <li>Правильный ответ: +5 баллов за каждый</li>
        <li>Можно повторить один ответ или дать разные варианты</li>
        <li>Максимум: 90 баллов</li>
      </ul>
    ` 
  },
  { 
    title: '6 раунд. Связь', 
    pretitle: 'РАУНД 6 / Связь',
    description: `
      <b>6 вопросов, которые по цепочке связаны между собой.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Время на каждый вопрос: 60 секунд</li>
        <li>За правильный ответ: +20 баллов</li>
        <li>Важно: Первый и последний вопрос не связаны</li>
        <li>Важно: Первый и последний вопрос не связаны</li>
        <li>Максимум: 120 баллов</li>
      </ul>
    ` 
  },
  { 
    title: '7 раунд. Финал', 
    pretitle: 'РАУНД 7 / Финал',
    description: `
      <b>8 вопросов любого формата</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Время на обсуждение: 30 секунд на каждый</li>
        <li>За правильный ответ: фиксированная ставка от +10 до +40 баллов. За неверный ответ вычитается ставка</li>
        <li>Максимум: 280 баллов</li>
      </ul>
    ` 
  }
]);


const selectRound = (index) => {
  selectedRound.value = index;
};

watch(
  () => props.show,
  (newVal) => {
    if (!newVal) selectedRound.value = null; 
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

h3 {
  font-weight: bold;
}

.modal-content {
  background: #ffffff;
  border-radius: 8px;
  padding: 5px;
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
  width: 45px;
  height: 37px;
}

.modal-body {
  padding: 16px;
  color: #333;
  font-size: 18px;
}

.rounds-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.rounds-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  width: 40%;
}

.rounds-list li {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
}

.rounds-list a {
  text-decoration: none;
  color: #1c2b4b;
  cursor: pointer;
}

.rounds-list a:hover {
  text-decoration: underline;
}

.round-description {
  width: 350px;
  background: #ffffff; 
  padding: 15px;
  border-radius: 15px;
  font-size: 18px;
  border: 2px solid #1c2b4b; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
}
</style>
