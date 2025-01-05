<template>
  <div class="container">
    <div class="header">
      <h1 class="team-name">{{ teamName }}</h1>
    </div>

    <div class="menu">
      <div class="menu-item" v-for="item in menuItems" :key="item.name">
        <img :src="item.image" alt="" class="menu-image" @click="item.function" />
        <p>{{ item.name }}</p>
      </div>
    </div>

    <div class="footer">
      <button @click="goToTeamNameDisplay" class="play-button">ИГРА</button>
    </div>

    <ModalLottery :show="showModalLottery" :closeModal="closeModalLottery" />
    <ModalContacts :show="showModalContacts" :closeModal="closeModalContacts" />
    <ModalPay :show="showModalPay" :closeModal="closeModalPay" />
    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import cashImage from '@/assets/cash.png'
import contactsImage from '@/assets/contacts.png'
import helpImage from '@/assets/help.png'
import manImage from '@/assets/img_3.png'
import info from '@/assets/info.png'
import lotteryImage from '@/assets/lotery.png'
import menuImage from '@/assets/menu.png'
import ratingImage from '@/assets/rating.png'
import ModalContacts from '@/components/widgets/ModalContacts.vue'
import ModalLottery from '@/components/widgets/ModalLottery.vue'
import ModalPay from '@/components/widgets/ModalPay.vue'
import { useAuthCheck } from '@/hooks/useAuthCheck.js'
import { useUserInactivity } from '@/hooks/useUserInactivity.js'
import {useStore} from "vuex";
import Notification from "@/admin/Notification.vue";
import person from '@/assets/person12.png'

const store = useStore()
const route = useRoute()
const router = useRouter()
const toastMessage = ref('')
const toastType = ref('success')
useUserInactivity(30000000)

const { teamName } = useAuthCheck()
const showModalLottery = ref(false)
const showModalContacts = ref(false)
const showModalPay = ref(false)
const showModalHelp = ref(false)

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

const menuItems = ref([
  {
    name: 'Правила игры',
    image: info,
    function: () => {
      router.push({ name: 'Rules' })
    },
  },
  {
    name: 'Таблица результатов',
    image: ratingImage,
    function: () => {
      router.push({ name: 'ResultsExcel' })
    },
  },
  { name: 'Оплата', image: cashImage, function: openModalPay },
  {
    name: 'Меню ресторана',
    image: menuImage,
    function: () => {
      router.push({ name: 'RestourantMenu' })
    },
  },
  { name: 'Лотерея', image: lotteryImage, function: openModalLottery },
  { name: 'Наши контакты', image: contactsImage, function: openModalContacts },
  { name: 'Хелп', image: helpImage, function: async () => {
    try {
      await store.dispatch('helps/createHelp')

      toastMessage.value = 'Запрос успешно отправлен!'
      toastType.value = 'success'

      setTimeout(() => {
        toastMessage.value = ''
      }, 1000)
    } catch (e) {
      toastMessage.value = 'Ошибка при запросе!'
      toastType.value = 'error'
      console.log(e)
    }
    } },
  {
    name: 'Участники лотереи',
    image: person,
    function: () => {
      router.push({ name: 'RegistrateUsers' })
    },
  },



])
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1b2a46;
}

.team-name {
  font-size: 64px;
  color: white;
  font-family: 'Mulish', sans-serif;
  font-weight: bold;
  text-align: center;
  margin: 0 auto;
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
  padding: 10px;
  margin: 12px auto;
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
  cursor: pointer;
  color: white;
  font-family: 'Mulish', sans-serif;
}

.menu-image {
  width: 70px;
  height: 70px;
}

.footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  margin-top: 90px;
  margin-left: 20px;
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
  color: #cc9f33;
  font-family: 'Mulish', sans-serif;
  font-weight: bold;
  font-size: 35px;
  cursor: pointer;
  margin-left: 800px;
  padding: 10px;
  margin-bottom: 80px;
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
    width: 60px;
    height: 60px;
    cursor: pointer;
  }
  .play-button {
    margin-left: 250px;
    width: 40px;
    margin-top: -22px;
  }
  .back-button {
    margin-top: -12px;
    margin-left: -120px;
  }
  .footer {
    margin-top: 3px;
    margin-left: 35px;
    justify-content: space-around;
    flex-direction: row;
  }
}
</style>
