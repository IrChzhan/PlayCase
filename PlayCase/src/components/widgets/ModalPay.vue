<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <div class="modal-body">
        <div class="form-section">
          <div class="team-title">{{ teamName }}</div>
          <h1 class="title">Выберите количество игроков для оплаты</h1>

          <div class="player-buttons">
            <button
              v-for="number in 8"
              :key="number"
              :class="['player-button', { active: selectedPlayers === number }]"
              @click="selectPlayers(number)"
            >
              {{ number }}
            </button>
          </div>
          <div class="price-info">
            <div class="total-price">ИТОГО: {{ totalPrice }} ₽</div>
            <div class="price-per-player">
              {{ pricePerPlayer }} ₽ <span>цена за 1 человека</span>
            </div>
          </div>
          <button class="pay-button" @click="fetchCreatePayment">Оплатить</button>
          <dogovor-modal v-if="showDogovor" @close="toggleModal('dogovor', false)" />
          <policy-modal v-if="showPolitica" @close="toggleModal('politica', false)" />
          <info-modal v-if="showInfo" @close="toggleModal('info', false)" />
          <div class="additional-info">
            <ul>
              <li class="link-li">
                <a class="link" @click="toggleModal('dogovor', true)">Договор-оферта</a>
              </li>
              <li class="link-li">
                <a class="link" @click="toggleModal('politica', true)">Политика конфиденциальности</a>
              </li>
              <li class="link-li">
                <a class="link" @click="toggleModal('info', true)">Открыть страницу с реквизитами</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="qr-section">
          <div class="qr-container">
            <img src="@/assets/qr.png" alt="QR-код" class="qr-code" />
            <p class="qr-instruction">Отсканируйте код камерой или в приложении банка</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue';
import DogovorModal from '@/views/client/Dogovor.vue';
import PolicyModal from '@/views/client/PoliticaPrivacy.vue';
import InfoModal from '@/views/client/CompanyInfo.vue';
import { useAuthCheck } from "@/hooks/useAuthCheck.js";
import {useStore} from "vuex";

const store = useStore()

const { teamName } = useAuthCheck();
const props = defineProps({
  show: Boolean,
  closeModal: Function,
});

const selectedPlayers = ref(1);
const pricePerPlayer = ref(1000);
const totalPrice = computed(() => selectedPlayers.value * pricePerPlayer.value);

const showDogovor = ref(false);
const showPolitica = ref(false);
const showInfo = ref(false);

function toggleModal(type, value) {
  if (type === 'dogovor') showDogovor.value = value;
  else if (type === 'politica') showPolitica.value = value;
  else if (type === 'info') showInfo.value = value;
}

function selectPlayers(number) {
  selectedPlayers.value = number;
}

const fetchCreatePayment = () => {
 try {
   store.dispatch('payments/createPayment', {amount: totalPrice.value})
 }catch (e) {
   console.log(e)
 }
}

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
.link-li {
  margin-top: 10px;
  display: inline;
}

.link {
  font-size: 0.8rem;
  color: #000;
  text-decoration: none;
  border-bottom: 1px solid #000;
  cursor: pointer;
  margin: 0 5px;
}

.link:hover {
  border-bottom: 2px solid #000;
}

.modal-body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.price-per-player {
  margin-top: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 1vw;
  padding: clamp(30px, 4vw, 50px) clamp(20px, 8vw, 100px);
  width: 70vw;
  max-width: 900px;
  position: relative;
  font-family: 'Mulish', sans-serif;
}

.close-button {
  position: absolute;
  top: 0.3%;
  right: 0.3%;
  background: none;
  border: none;
  font-size: clamp(16px, 2vw, 24px);
  font-weight: bold;
  color: #0f1921;
  cursor: pointer;
}

.team-title {
  display: inline-block;
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: bold;
  color: white;
  background-color: #cc9f33;
  padding: 1vw 2vw;
  border-radius: 12px;
  margin-bottom: 1vw;
}

.price-info {
  margin-bottom: 30px;
  font-size: 1.2rem;
}

.price-info .total-price {
  font-weight: 700;
  color: #fff;
  background-color: #cc9f33;
  padding: 10px;
  border-radius: 20px;
  display: inline-block;
}

.price-info .price-per-player {
  font-weight: 700;
  color: #333;
}

.price-info span {
  font-weight: 400;
  color: #555;
}

.player-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 30px;
  margin-top: 15px;
  margin-right: 160px;
  justify-content: flex-start;
}

.player-button {
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 60%;
  width: 30px;
  height: 30px;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.player-button.active {
  background-color: #cc9f33;
  color: #fff;
  border-color: #cc9f33;
}

.form-section {
  flex: 1;
  margin-right: 10px;
}

.qr-section {
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pay-button {
  background-color: #cc9f33;
  color: #fff;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.pay-button:hover {
  background-color: #b1882e;
}
.qr-container {
  background: rgba(58, 76, 110, 0.5);
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
}

.qr-code {
  width: 250px;
  height: 100px;
  height: auto;
}

.qr-instruction {
  margin-top: 10px;
  font-size: 1rem;
  text-align: center;
  color: #555;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .modal-content {
    width: 85vw;
    padding: 20px;
  }

  .team-title {
    font-size: clamp(12px, 2.5vw, 16px);
    padding: 1vw 2vw;
  }

  .player-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 20px;
    justify-content: center;
  }

  .player-button {
    width: 47px;
    height: 47px;
    font-size: 1.1rem;
  }

  .price-info {
    margin-bottom: 20px;
  }

  .qr-container {
    padding: 15px;
  }
}
</style>
