<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title">ПРАВИЛА</h1>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <p class="text">Вас ждут <b class="seven">7 раундов</b> с перерывами после 3 и 6 раундов.</p>
        <br>
        <p class="text">
          После каждого вопроса участники команды совещаются и пишут ответ на бланках, которые лежат на столах.
          Бланки необходимо сдавать после каждого раунда. Всего за игру можно набрать максимум <b>1000 баллов</b>.
        </p>
        <br>

        <div class="rounds-container">
          <ul class="rounds-list">
            <li v-for="(round, index) in rounds" :key="index">
              <a :class="{'hasSelect': selectedRound === index}" href="#" @click.prevent="selectRound(index)"><b>{{ round.title }}</b></a>
            </li>
          </ul>

          <div v-if="selectedRound !== null" class="round-description">
            <h3>{{ rounds[selectedRound].pretitle }}</h3>
            <p v-html="rounds[selectedRound].description"></p>
          </div>
        </div>

        <br>
        <p class="text">На наших играх запрещено пользоваться электронными устройствами, поэтому не забудьте отложить их на время вопросов.</p>
        <br >
        <p class="text">Если у вас будут появляться вопросы перед игрой или в течение неё, не стесняйтесь задавать их нашим хелперам.</p>
        <br>
        <p class="highlighted-text text">
          Ни в коем случае <b>нельзя забывать вкусно есть и пить во время игры!</b>
        </p>
        <p class="text">Меню можно посмотреть прямо на этом планшете или попросить у официанта.</p>
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

const selectedRound = ref(0);

const rounds = ref([
  { 
    title: '1 раунд. Начало', 
    pretitle: 'РАУНД 1 / Начало', 
    description: `
      <b>6 вопросов, к каждому указаны 4 варианта ответа.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><span style="font-weight: 700;">Правильный</span> ответ: +10 баллов за каждую букву</li>
        <li><span style="font-weight: 700;">Неправильный</span> ответ: –5 баллов за каждую букву</li>
        <li>Время на обсуждение: <span style="font-weight: 700;">30 секунд</span></li>
        <li>В раунде могут быть вопросы без правильных ответов или с несколькими верными вариантами. Если вы считаете, что правильного ответа на вопрос среди вариантов нет, ничего не пишите или ставьте прочерк.</li>
      </ul>
      <span style="font-style: italic">Максимум: 120 баллов.</span>
    ` 
  },
  { 
    title: '2 раунд. Логика', 
    pretitle: 'РАУНД 2 / Логика',
    description: `
      <b>6 логических вопросов без вариантов ответов.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Время на каждый вопрос: <span style="font-weight: 700;">60 секунд</span></li>
        <li>За <span style="font-weight: 700;">правильный</span> ответ: +20 баллов</li>
      </ul>
      <span style="font-style: italic; margin-top: 4px">Максимум: 120 баллов.</span>
    ` 
  },
  { 
    title: '3 раунд. Картинки', 
    pretitle: 'РАУНД 3 / Картинки',
    description: `
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Каждой команде выдаётся 10 картинок и запускается таймер на 8 минут.</li>
        <li>Время на обсуждение: <span style="font-weight: 700;">480 секунд</span></li>
        <li>Нужно отгадать зашифрованные фильмы, книги или исполнителей и вписать ответы в бланк на 10 ответов (номер картинки = номер вопроса). На самих картинках ничего писать не нужно!</li>
        <li><span style="font-weight: 700;">Правильный</span> ответ: +10 баллов</li>
      </ul>
      <span style="font-style: italic; margin-top: 4px">Максимум: 100 баллов.</span>
    ` 
  },
  { 
    title: '4 раунд. Комбо', 
    pretitle: 'РАУНД 4 / Комбо',
    description: `
      <b>6 вопросов без вариантов ответов.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Время на каждый вопрос: <span style="font-weight: 700;">30/60 секунд</span></li>
        <li>За <span style="font-weight: 700;">правильный</span> ответ: +20 баллов</li>
        <li>В течение раунда вы отвечаете на вопросы, а в конце у вас будет дополнительно 30 секунд, чтобы сделать выбор: указать одну комбинацию из трёх возможных, чтобы получить бонусные баллы.</li>
      </ul>
      <span style="font-style: italic; margin-top: 4px">Максимум: 170 баллов.</span>
    ` 
  },
  { 
    title: '5 раунд. Хет-трик', 
    pretitle: 'РАУНД 5 / Хет-трик',
    description: `
      <b>6 вопросов, на каждый из которых можно ответить 3 раза.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Если вы уверены в своём ответе, пишите все 3 раза один и тот же ответ, если не уверены, можете написать 3 разных ответа или любую другую комбинацию из трёх вариантов.</li>
        <li>За каждый правильный ответ вы получите +5 баллов.</li>
        <li>Время на обсуждение: <span style="font-weight: 700;">30 секунд на вопрос</span></li>
      </ul>
      <span style="font-style: italic; margin-top: 4px">Максимум: 90 баллов.</span>
    ` 
  },
  { 
    title: '6 раунд. Связь', 
    pretitle: 'РАУНД 6 / Связь',
    description: `
      <b>6 вопросов, где каждый последующий ответ каким-то образом связан с предыдущим.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Время на каждый вопрос: <span style="font-weight: 700;">60 секунд</span></li>
        <li>За <span style="font-weight: 700;">правильный</span> ответ: +20 баллов</li>
        <li><span style="font-weight: 700;">Важно: Первый и последний вопрос не связаны</span></li>
      </ul>
      <span style="font-style: italic; margin-top: 4px">Максимум: 120 баллов.</span>
    ` 
  },
  { 
    title: '7 раунд. Финал', 
    pretitle: 'РАУНД 7 / Финал',
    description: `
      <b>8 вопросов. Рядом с каждым из вопросов указана ставка, которую можно сделать на данный вопрос.</b>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>В случае правильного ответа со ставкой вы дополнительно получите указанные баллы. В случае неправильного потеряете эти баллы.</li>
        <li>Делать ли ставку — решайте сами!</li>
        <li>Время на обсуждение: <span style="font-weight: 700;">30/60 секунд на каждый</span></li>
        <li>За <span style="font-weight: 700;">правильный</span> ответ: +10 баллов</li>
        <li>Фиксированная ставка: от +10 до +40 баллов. За <span style="font-weight: 700;">неверный</span> ответ вычитается ставка</li>
      </ul>
      <span style="font-style: italic; margin-top: 4px">Максимум: 280 баллов.</span>
    ` 
  }
]);

const selectRound = (index) => {
  selectedRound.value = index;
};

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
  font-weight: 400;
  font-size: 40px;
}

.modal-content {
  background: #ffffff;
  border-radius: 15px;
  padding: 5px;
  padding: 6px;
  max-width: 1433px;
  height: 980px;
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
  height: 35px;
}

.modal-title {
  font-size: 40px;
  font-weight: 400;
  color: #ffffff;
  flex-grow: 1;
  text-align: center;
  margin-left: 100px;
}

h3 {
  font-size: 20px;
  font-weight: 800;
}

.seven {
  font-weight: bold;
  color: #1c2b4b;
}

.close-button {
  background: none;
  border: none;
  font-size: 60px;
  font-weight: 200;
  margin-bottom: 9px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
}

.modal-body {
  padding: 60px 80px 50px 80px;
  color: #333;
  font-size: 26px;
}

.rounds-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  height: 310px;
}

.rounds-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  width: 40%;
}

.rounds-list li {
  font-size: 26px;
  margin-bottom: 10px;
  font-weight: bold;
}

.rounds-list a {
  text-decoration: none;
  color: #1c2b4b;
  cursor: pointer;
}

.highlighted-text b {
  color: #1c2b4b;
  font-weight: bold;
}

.rounds-list a:hover {
  text-decoration: underline;
}

.hasSelect b {
  text-decoration: underline
}


.round-description {
  width: 640px;
  background: #ffffff; 
  padding: 15px;
  border-radius: 15px;
  font-size: 23px;
 
  border: 2px solid #1c2b4b; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
}

.text {
  font-family: "Mulish",sans-serif;
  font-size: 26.32px;
  font-weight: 400;
  line-height: 33.03px;
  color: #0F1921;
}

</style>
