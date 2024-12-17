<template>
  <div class="container">
    <div class="header">
      <h1 class="team-name">{{ teamName }}</h1>
      <div class="table-number">
        <h2>{{ teamTable }}</h2>
        <p>стол</p>
      </div>
    </div>

    <div class="menu">
      <div class="menu-item" v-for="item in menuItems" :key="item.name">
        <img
            :src="item.image"
            alt=""
            class="menu-image"
            @click="item.function"
        />
        <p>{{ item.name }}</p>
      </div>
    </div>

    <div class="footer">
      <button @click="goToTeamNameDisplay" class="back-button">Вернуться к заставке</button>
      <button @click="startGame" class="play-button">ИГРА</button>
    </div>

    <ModalLottery
        :show="showModalLottery"
        :closeModal="closeModalLottery"
    />
    <ModalFeedback
        :show="showModalFeedback"
        :closeModal="closeModalFeedback"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import info from '@/assets/info.png';
import prizeImage from '@/assets/prize.png';
import ratingImage from '@/assets/rating.png';
import menuImage from '@/assets/menu.png';
import lotteryImage from '@/assets/lotery.png';
import cashImage from '@/assets/cash.png';
import helpImage from '@/assets/help.png';
import contactsImage from '@/assets/contacts.png';
import ModalLottery from "@/components/widgets/ModalLottery.vue";
import ModalFeedback from "@/components/widgets/ModalFeedback.vue";

const route = useRoute();
const router = useRouter();

const teamName = ref(route.params.teamName);
const teamTable = ref(route.params.teamTable);
const showModalLottery = ref(false);
const showModalFeedback = ref(false);

const goToTeamNameDisplay = () => {
  router.push({name: 'TeamNameDisplay'});
};

const startGame = () => {
  router.push({name: 'GameScreen'});
};

const openModalLottery = () => {
  showModalLottery.value = true;
};

const closeModalLottery = () => {
  showModalLottery.value = false;
};

const openModalFeedback = () => {
  showModalFeedback.value = true;
};

const closeModalFeedback = () => {
  showModalFeedback.value = false;
};

const menuItems = ref([
  {name: 'Правила игры', image: info, function: openModalLottery},
  {name: 'Результаты игры', image: prizeImage, function: () => {}},
  {name: 'Рейтинг команд', image: ratingImage, function: () => {}},
  {name: 'Меню ресторана', image: menuImage, function: () => {}},
  {name: 'Лотерея', image: lotteryImage, function: () => {}},
  {name: 'Оплата', image: cashImage, function: () => {}},
  {name: 'Хелп', image: helpImage, function: () => {}},
  {name: 'Наши контакты', image: contactsImage, function: openModalFeedback},
]);

</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: lightblue;
  padding: 20px;
}

.team-name {
  font-size: 24px;
}

.table-number {
  font-size: 20px;
}

.menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-image {
  width: 80px;
  height: 80px;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin: 20px;
}

.back-button, .play-button {
  padding: 10px 20px;
  font-size: 18px;
}
</style>