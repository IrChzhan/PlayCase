<template>
  <div class="container">
    <div class="header">
      <h1 class="team-name">{{ teamName }}</h1>
    </div>

    <div class="menu">
      <div class="menu-item" v-for="item in menuItems" :key="item.name" :class="item.class">
  <img :src="item.image" alt="" class="menu-image" :class="{ 'small-icon': item.small, 'info_image': item.name === 'Правила', }" @click="item.function" />
  <p>{{ item.name }}</p>
</div>
      <div v-if="status === 'RESULT_SUMMING'" class="menu-item" :key="10">
        <img :src="FeedBackImage" alt="Обратная связь" class="menu-image image-one" @click="openModalFeedback" />
        <p>Обратная связь</p>
      </div>
    </div>

    <div class="footer">
      <img src="@/assets/ИГРА.png" alt="ИГРА" class="play-button" @click="goToTeamNameDisplay" />
    </div>
    <Rules :show="showModalRules" :closeModal="closeModalRules" />
    <ModalLottery :show="showModalLottery" :closeModal="closeModalLottery" />
    <ModalContacts :show="showModalContacts" :closeModal="closeModalContacts" />
    <ModalPay :show="showModalPay" :closeModal="closeModalPay" />
    <ModalHelp :show="showModalHelp" :closeModal="closeModalHelp"/>
    <ModalFeedback :show="showModalFeedback" :closeModal="closeModalFeedback"/>
    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'

import cashImage from '@/assets/pay.svg'
import house from '@/assets/House_01.png'
import contactsImage from '@/assets/contacts.svg'
import helpImage from '@/assets/help.svg'
import info from '@/assets/info.svg'
import lotteryImage from '@/assets/loto.svg'
import menuImage from '@/assets/menu.svg'
import ratingImage from '@/assets/rating.svg'
import ModalContacts from '@/components/widgets/ModalContacts.vue'
import ModalLottery from '@/components/widgets/ModalLottery.vue'
import ModalPay from '@/components/widgets/ModalPay.vue'
import { useAuthCheck } from '@/hooks/useAuthCheck.js'
import {useStore} from "vuex";
import Notification from "@/admin/Notification.vue";
import person from '@/assets/hu.png'
import ModalHelp from "@/components/widgets/ModalHelp.vue";
import FeedBackImage from "@/assets/stars.svg"
import ModalFeedback from "@/components/widgets/ModalFeedback.vue";
import Rules from "@/components/widgets/Rules.vue";

const store = useStore()
const route = useRoute()
const router = useRouter()
const toastMessage = ref('')
const toastType = ref('success')

const watchedState = computed(() => store.state.results.result);

const { teamName } = useAuthCheck()
const showModalLottery = ref(false)
const showModalContacts = ref(false)
const showModalPay = ref(false)
const showModalHelp = ref(false)
const showModalFeedback = ref(false)

const status = ref('')

const openModalFeedback = () => {
  showModalFeedback.value = true
}

const closeModalFeedback = () => {
  showModalFeedback.value = false
}

const closeModalHelp = () => {
  showModalHelp.value = false
}

const openModalHelp = () => {
  showModalHelp.value = true
}

const goToTeamNameDisplay = () => {
  router.push({ name: 'TeamNameDisplay' })
}

const startGame = () => {
  router.push({ name: 'GameScreen' })
}

const openModalLottery = () => {
  showModalLottery.value = true
}

const closeModalLottery = () => {
  showModalLottery.value = false
}

const openModalContacts = () => {
  showModalContacts.value = true
}

const closeModalContacts = () => {
  showModalContacts.value = false
}

const openModalPay = () => {
  showModalPay.value = true
}

const closeModalPay = () => {
  showModalPay.value = false
}

const showModalRules = ref(false)

const openModalRules = () => {
  showModalRules.value = true;
}

const closeModalRules = () => {
  showModalRules.value = false;
}

const menuItems = ref([
  {
    name: 'Правила',
    image: info,
    function: openModalRules,
  },
  {
    name: 'Результаты',
    image: ratingImage,
    function: () => {
      router.push({ name: 'ResultsExcel' })
    },
    small: true, 
  },
  { 
    name: 'Оплата', 
    image: cashImage, 
    function: openModalPay,
    small: true, 
  },
  {
    name: 'Меню ресторана',
    image: menuImage,
    function: () => {
      router.push({ name: 'RestourantMenu' })
    },
  },
  { name: 'LUCKYTRON', image: lotteryImage, function: openModalLottery },
  { name: 'Мы в соцсетях', image: contactsImage, function: openModalContacts },
  { name: 'Help', image: helpImage, function: openModalHelp, class: 'help-item',}
])

const fetchGame = async () => {
  try {
    const res = await store.dispatch('online/getGame')
    status.value = res.status
  } catch (e) {
    console.log(e)
  }
}

watch(watchedState, () => {
  fetchGame();
});

onMounted(()=>{
  fetchGame()
})

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: url('@/assets/background.jpg') no-repeat center center/cover;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 95%;
  background-color: #3a4c6e;
  border: 2px solid #cc9f33;
  border-radius: 10px;
  padding: 20px;
  margin: 47px auto;
}

.team-name {
    color: white;
    font-family: 'Mulish', sans-serif;
    font-weight: 800;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    font-size: 65px;
    padding-bottom: 5px; 
}

h2 {
  font-size: 50px;
}

p {
  margin-left: 5px;
  font-weight: 500;
  font-size: 30px;
}

.menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 100px;
  padding: 30px;
  width: 90%;
  margin-left: 65px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  gap: 15px;
  color: white;
  font-family: 'Mulish', sans-serif;
  font-weight: 500;
  font-size: 30;
  -webkit-tap-highlight-color: transparent;
}

.help-item {
  margin-left: -20px;
}

.menu-image {
  width: 111px;
  height: 111px;
}

.small-icon {
  width: 90px; 
  height: 90px;
  margin-top: 15px;
}

.lotteryIimage {
  width: 10px; 
  height: 10px; 
  margin-top: 35px;
}

.info_image {
  width: 83px;
}


.footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  margin-top: 50px;
}

.back-button {
  width: 230px;
  height: 45px;
  border-radius: 5px;
  background-color: #cc9f33;
  font-family: 'Mulish', sans-serif;
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.play-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-right: 45px;
  margin-top: 75px;
  padding: 20px;
  margin-bottom: 0; 
  width: 161px;
  height: 32px;
}
@media (min-width: 768px) and (max-width: 1024px) {
  .header {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 85%;
    height: auto;
    margin: 12px auto;
  }

  .team-name {
    font-size: 48px;
    text-align: center;
    margin: 0 auto;
  }

  .menu {
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
  }
  .menu-image {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
  .back-button {
    margin-top: -12px;
    margin-left: -120px;
  }
  .play-button {
  background-color: transparent;
  border: none;
  color: #cc9f33;
  font-family: 'Mulish', sans-serif;
  font-weight: bold;
  cursor: pointer;
  margin-left: 800px;
  padding: 10px;
  margin-bottom: 20px; 
}

  .footer {
    justify-content: center; 
    flex-direction: row;
    position: relative; 
    margin-top: -50px;
  }
}
</style>