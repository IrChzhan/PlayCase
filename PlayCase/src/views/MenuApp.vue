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
    <ModalContacts
        :show="showModalContacts"
        :closeModal="closeModalContacts"
    />
    <ModalPay
      :show="showModalPay"
      :closeModal="closeModalPay"
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
import manImage from '@/assets/man.png';
import contactsImage from '@/assets/contacts.png';
import ModalLottery from "@/components/widgets/ModalLottery.vue";
import ModalFeedback from "@/components/widgets/ModalFeedback.vue";
import ModalContacts from "@/components/widgets/ModalContacts.vue";
import ModalPay from '@/components/widgets/ModalPay.vue';

const route = useRoute();
const router = useRouter();

const teamName = ref(route.params.teamName);
const teamTable = ref(route.params.teamTable);
const showModalLottery = ref(false);
const showModalContacts = ref(false);
const showModalPay = ref(false);

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

const openModalContacts = () => {
  showModalContacts.value = true;
};

const closeModalContacts = () => {
  showModalContacts.value = false;
};

const openModalPay = () => {
  showModalPay.value = true;
}

const closeModalPay = () => {
  showModalPay.value = false;
}

const menuItems = ref([
  {name: 'Правила игры', image: info, function: () => {router.push({name: 'Rules'})}},
  {name: 'Результаты игры', image: prizeImage, function: () => {router.push({name: 'WinnerPage'})}},
  {name: 'Рейтинг команд', image: ratingImage, function: () => {}},
  {name: 'Меню ресторана', image: menuImage, function: () => {router.push({name: 'RestourantMenu'})}},
  {name: 'Лотерея', image: lotteryImage, function: () => {}},
  {name: 'Оплата', image: cashImage, function: openModalPay},
  {name: 'Хелп', image: helpImage, function: () => {}},
  {name: 'Наши контакты', image: contactsImage, function: openModalContacts},
  {name: 'Регистрация лотереи', image: manImage, function: () => {}}
]);

</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  width: 95%;
  background-color: #3A4C6E;
  border: 2px solid #CC9F33; 
  border-radius: 10px; 
  padding: 10px; 
  margin-left: 12px;
  margin-top: 12px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.team-name {
  font-size: 64px;
  margin-bottom: 20px;
  margin-top: 20px;
  color: white;
  font-family: "Mulish", sans-serif;
  font-weight: bold;
}

.table-number {
  font-size: 20px;
  margin-right: 40px;
  color: #CC9F33;
  font-family: "Mulish", sans-serif;
}

h2 {
  font-size: 50px;
}

p {
  margin-left: 5px;
}

.menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  width: 90%;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-image {
  width: 70px;
  height: 70px;
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin-top: 90px;
  margin-left: 20px;
}

.back-button {
  width: 230px;
  height: 45px;
  border-radius: 5px;
  background-color: #CC9F33;
  font-family: "Mulish", sans-serif;
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.play-button {
  background-color: transparent; 
  border: none; 
  color: #CC9F33;
  font-family: "Mulish", sans-serif;
  font-weight: bold; 
  font-size: 35px; 
  cursor: pointer; 
  margin-left: 730px; 
  padding: 10px; 
  margin-bottom: 80px;
}
@media (min-width: 768px) and (max-width: 1024px) {
  .header {
    flex-direction: row; 
    justify-content: space-around; 
    width: 85%; 
    height: 85%;
    margin-left: 50px;
  }

  .team-name {
    font-size: 48px; 
  }

  .table-number {
    font-size: 30px; 
    margin-right: 20px;
  }

  .menu {
    width: 80%; 
    margin-left: 45px;
    margin-top: 5px;
  }
  .menu-image {
    width: 60px;
    height: 60px;
  }
  .play-button {
    margin-left: 450px; 
    width: 40px;

  }
  .footer {
    margin-top: 3px;
    margin-left: 35px;
    justify-content: space-around; 
    flex-direction: row;
  }
}
</style>