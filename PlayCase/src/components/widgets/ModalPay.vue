<template>
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <div class="modal-body">
        <div class="form-section">
          <div class="team-title">{{ teamName }}</div>
          <h1 class="title">Выберите количество игроков, за которых будете оплачивать</h1>

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
            <div class="total-price">{{ totalPrice }} ₽ <span>к оплате</span></div>
            <div class="price-per-player">
              {{ pricePerPlayer }} ₽ <span>цена за 1 человека</span>
            </div>
          </div>

          <div v-if="!isPaying">
            <div class="form">
              <p>Напишите вашу почту, на которую вы хотите, чтобы пришел чек</p>
              <input type="email" placeholder="Ваша электронная почта" class="email-input" />
              <button class="pay-button" @click="startPayment">Перейти к оплате</button>
              <div class="policy">
                <input type="checkbox" id="policy-checkbox" />
                <label for="policy-checkbox">
                  Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных
                </label>
              </div>
            </div>
          </div>

          <div v-else-if="!paymentMethod">
            <div class="payment-options">
              <button class="payment-option" @click="selectPaymentMethod('qr')">QR-код</button>
              <button class="payment-option" @click="selectPaymentMethod('card')">Карта</button>
            </div>
          </div>

          <div v-else-if="paymentMethod === 'qr'">
            <p>Сканируйте QR-код для оплаты:</p>
            <img src="@/assets/qr.png" alt="QR-код" class="qr-code" />
            <button @click="cancelPaymentMethod" class="back-button">Назад</button>
          </div>

          <div v-else-if="paymentMethod === 'card'">
            <div class="card-payment-form">
              <input type="text" placeholder="Номер карты" class="card-number" />
              <input type="text" placeholder="Срок действия (MM/YY)" class="card-expiry" />
              <input type="text" placeholder="CVV" class="card-cvv" />
              <button class="pay-now-button">Оплатить</button>
            </div>
            <button @click="cancelPaymentMethod" class="back-button">Назад</button>
          </div>

          <div class="additional-info">
            <ul>
              <li class="link-li">
                <a class="link" @click="goToDogovor" target="_blank">
                  Договор-оферта
                </a>
              </li>
              <li class="link-li">
                <a class="link" @click="goToPolitica" target="_blank">
                  Политика конфиденциальности
                </a>
              </li>
              <li class="link-li">
                <a class="link" @click="goToInn" target="_blank">
                  Открыть страницу с реквизитами
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useAuthCheck } from '@/hooks/useAuthCheck.js'
import {useRouter} from "vue-router";

defineProps({
  show: Boolean,
  closeModal: Function,
})

const router = useRouter()
const { teamName } = useAuthCheck()
const selectedPlayers = ref(1)
const pricePerPlayer = ref(1000)
const isPaying = ref(false)
const paymentMethod = ref(null)

const totalPrice = computed(() => selectedPlayers.value * pricePerPlayer.value)

const pdfLink1 = ref('/files/Договор-оферта.pdf')
const pdfLink2 = ref('/files/Политика конфиденциальности.pdf')
const detailsPageLink = ref('/inn')

const goToInn = () => {
  router.push('/client/inn')
}

const goToDogovor = () => {
  router.push('/client/dogovor')
}

const goToPolitica = () => {
  router.push('/client/politica')
}

function selectPlayers(number) {
  selectedPlayers.value = number
}

function startPayment() {
  isPaying.value = true
}

function selectPaymentMethod(method) {
  paymentMethod.value = method
}

function cancelPaymentMethod() {
  paymentMethod.value = null
}
</script>

<style scoped>
.link-li {
  margin-top: 10px;
}

.link {
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  top: 2%;
  right: 2%;
  background: none;
  border: none;
  font-size: clamp(16px, 2vw, 24px);
  font-weight: bold;
  color: #0f1921;
  cursor: pointer;
}

.main-heading {
  font-size: clamp(24px, 4vw, 36px);
  color: #0f1921;
  margin-bottom: 2vw;
  line-height: 1.2;
  font-weight: 700;
}

.team-title {
  display: inline-block;
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: bold;
  color: #cc9f33;
  padding: 1vw 2vw;
  border: 1px solid rgba(15, 25, 33, 0.4);
  border-radius: 12px;
  margin-bottom: 1vw;
}

.price-info {
  margin-bottom: 30px;
  font-size: 1.2rem;
}

.price-info .total-price,
.price-info .price-per-player {
  font-weight: 700;
  color: #333;
}

.price-info span {
  font-weight: 400;
  color: #555;
}

.form p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
}

.email-input,
.promo-input {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
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

.policy {
  font-size: 0.8rem;
  color: #777;
  text-align: left;
}
.policy input {
  margin-right: 5px;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.player-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
  margin-right: 160px;
}

.player-button {
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.player-button.active {
  background-color: #cc9f33;
  color: #fff;
  border-color: #cc9f33;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-option {
  background: #cc9f33;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.card-payment-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-number,
.card-expiry,
.card-cvv {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.pay-now-button {
  background: #cc9f33;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.qr-code {
  max-width: 100%;
  margin-bottom: 20px;
}

.back-button {
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 790px;
  margin-top: 9px;
  background: #cc9f33;
  color: white;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .modal-content {
    width: 85vw;
    padding: 20px;
  }

  .main-heading {
    font-size: clamp(18px, 3.5vw, 24px);
    margin-bottom: 10px;
  }

  .team-title {
    font-size: clamp(12px, 2.5vw, 16px);
    padding: 1vw 2vw;
  }

  .title {
    font-size: clamp(16px, 3vw, 20px);
    margin-bottom: 20px;
  }

  .player-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    justify-content: center;
  }

  .player-button {
    width: 60px;
    height: 60px;
    font-size: 1.1rem;
  }

  .price-info {
    margin-bottom: 20px;
  }

  .price-info .total-price,
  .price-info .price-per-player {
    font-size: 1.1rem;
  }

  .price-info span {
    font-size: 0.9rem;
  }

  .form p {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .email-input,
  .promo-input {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    margin-bottom: 15px;
  }

  .pay-button {
    padding: 12px 20px;
    font-size: 1.1rem;
  }

  .policy {
    font-size: 0.9rem;
    margin-top: 10px;
  }

  .payment-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  }

  .payment-option {
    padding: 15px;
    font-size: 1rem;
  }

  .card-payment-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .card-number,
  .card-expiry,
  .card-cvv {
    padding: 12px;
    font-size: 1rem;
  }

  .pay-now-button {
    padding: 12px 20px;
    font-size: 1.1rem;
  }

  .qr-code {
    width: 150px;
    margin-bottom: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .back-button {
    position: relative;
    padding: 12px;
    font-size: 1rem;
    margin-left: 0;
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }

  .back-button:hover {
    background-color: #b1882e;
  }
}
</style>
