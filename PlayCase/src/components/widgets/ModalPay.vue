<template>
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title">ОПЛАТА ИГРЫ</h1>
        <button class="close-button" @click="closeModal"><img src="@/assets/CloseImageWhite.png" class="imageWhite" alt="CloseBtnWhite"></button>
      </div>
      <div class="modal-body">
        <div class="form-section">
          <div class="team-title">Команда: {{ teamName }}</div>
          <h1 class="title">Выберите количество человек</h1>
          <div class="player-buttons">
            <button
              v-for="number in 8"
              :key="number"
              :class="['player-button', { active: selectedPlayers === number }]"
              @click="selectedPlayers = number;qrCodeUrl=null"
            >
              {{ number }}
            </button>
          </div>
          <div class="price-per-player">
            <span>стоимость участия {{ pricePerPlayer }} ₽ с человека</span>
          </div>
          <div class="price-info">
            <div class="total-price">ИТОГО: {{ totalPrice }} ₽</div>
            <div class="checkbox-section">
              <label for="one" class="text" v-if="emailTeam">
                <input
                id="one"
                  type="radio"
                  value="sendReceiptToCaptain"
                  v-model="picked"
                />
                Отправить чек на почту регистрации
              </label>
              <label for="two" class="text">
                <input
                id="two"
                  type="radio"
                  value="sendReceiptToEmail"
                  v-model="picked"
                />
                Отправить чек на другой адрес
              </label>
              <input
                  v-if="picked === 'sendReceiptToEmail'"
                  type="email"
                  class="input-check"
                  v-model="selectedEmail"
                  placeholder="Введите email"
                  :class="{ 'invalid-email': !isValidEmail && picked === 'sendReceiptToEmail' }"
                  required
                />
            </div>
          </div>
          <button 
            class="pay-button" 
            @click="handlePayment" 
            :disabled="picked === 'sendReceiptToEmail' && !validateEmail(selectedEmail)"
          >
            Оплатить
          </button>
          <dogovor-modal v-if="showDogovor" @close="toggleModal('dogovor', false)" />
          <policy-modal v-if="showPolitica" @close="toggleModal('politica', false)" />
          <info-modal v-if="showInfo" @close="toggleModal('info', false)" />
          <div class="additional-info">
            <ul class="list">
              <li class="link-li">
                <a class="link" @click="toggleModal('dogovor', true)">договор-оферта</a>
              </li>
              <span class="line"></span>
              <li class="link-li">
                <a class="link" @click="toggleModal('politica', true)">политика конфиденциальности</a>
              </li>
              <span class="line"></span>
              <li class="link-li">
                <a class="link" @click="toggleModal('info', true)">реквизиты</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="qr-section" v-if="qrCodeUrl">
          <div class="qr-container">
            <div class="qr-wrapper">
              <img :src="qrCodeUrl" alt="QR-код" class="qr-code" />
              <img class='sbp' src="@/assets/sbp.png" alt="sbp">
            </div>
            <p class="qr-instruction">Отсканируйте код камерой<br> или в приложении банка</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import QRCode from 'qrcode';
import DogovorModal from '@/views/client/Dogovor.vue';
import PolicyModal from '@/views/client/PoliticaPrivacy.vue';
import InfoModal from '@/views/client/CompanyInfo.vue';
import Notification from '@/admin/Notification.vue';
import { useAuthCheck } from "@/hooks/useAuthCheck.js";
import { useStore } from "vuex";

const { teamName } = useAuthCheck();
const props = defineProps({
  show: Boolean,
  closeModal: Function,
});
const store = useStore();

const emailTeam = ref('');
const selectedPlayers = ref(1);
const pricePerPlayer = ref(11);
const totalPrice = computed(() => selectedPlayers.value * pricePerPlayer.value);

const picked = ref('sendReceiptToCaptain')

const showDogovor = ref(false);
const showPolitica = ref(false);
const showInfo = ref(false);

const qrCodeUrl = ref(null);

const notifications = computed(() => store.getters['payments/getNotifications']);

const selectedEmail = ref('');
const isValidEmail = ref(true);

function toggleModal(type, value) {
  if (type === 'dogovor') showDogovor.value = value;
  else if (type === 'politica') showPolitica.value = value;
  else if (type === 'info') showInfo.value = value;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function handlePayment() {
  if (picked.value === 'sendReceiptToEmail' && !validateEmail(selectedEmail.value)) {
    isValidEmail.value = false;
    store.dispatch('payments/addNotification', { message: 'Неверный формат email', type: 'error' });
    return;
  }

  generateQRCode();
}

const generateQRCode = async () => {
  try {
    const email = picked.value === 'sendReceiptToCaptain' ? emailTeam.value : selectedEmail.value;
    const paymentUrl = await store.dispatch('payments/createPayment', { amount: totalPrice.value, email: email });
    qrCodeUrl.value = await QRCode.toDataURL(paymentUrl);
  } catch (error) {
    console.error('Ошибка генерации QR-кода:', error);
  }
};

watch(
  () => props.show,
  (newVal) => {
    qrCodeUrl.value = null
    if (newVal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);

watch(picked, (newValue) => {
  qrCodeUrl.value = null
})

watch(selectedEmail, (newEmail) => {
  if (picked.value === 'sendReceiptToEmail') {
    isValidEmail.value = validateEmail(newEmail);
  }
});

let socket = null;

onMounted(async () => {
  connectWebSocket();
  const res = await store.dispatch('profile/getCurrentTeam');
  emailTeam.value = res.email;

  if (!emailTeam.value) {
    picked.value = 'sendReceiptToEmail';
  }
});

onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});

const connectWebSocket = () => {
  socket = new WebSocket(`wss://igra-pads.ru/websocket`);
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);
    if (message.eventType === 'payment.waiting_for_capture' ||
      message.eventType === 'payment.succeeded' ||
      message.eventType === 'payment.canceled' ||
      message.eventType === 'refund.succeeded') {
      showNotification(message);
      updatePayments(message.data);
    }
  };
  socket.onclose = () => {
    console.log('WebSocket connection closed');
    setTimeout(connectWebSocket, 5000);
  };
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

const showNotification = (data) => {
  let type = 'info';
  let message = '';
  switch (data.eventType) {
    case 'payment.waiting_for_capture':
      type = 'warning';
      message = `Платеж ожидает подтверждения`;
      break;
    case 'payment.succeeded':
      type = 'success';
      message = `Платеж успешно завершен`;
      break;
    case 'payment.canceled':
      type = 'error';
      message = `Платеж отменен`;
      break;
    case 'refund.succeeded':
      type = 'info';
      message = `Возврат средств выполнен`;
      break;
    default:
      return;
  }
  store.dispatch('payments/addNotification', { message, type });
};

const removeNotification = (index) => {
  const updatedNotifications = [...notifications.value];
  updatedNotifications.splice(index, 1);
  store.dispatch('payments/removeNotification', updatedNotifications);
};

const updatePayments = (data) => {
  const existingPaymentIndex = store.state.payments.find(payment => payment.id === data.id);
  if (existingPaymentIndex !== -1) {
    store.commit('payments/setPayments', [
      ...store.state.payments.map(payment =>
        payment.id === data.id ? { ...payment, ...data } : payment
      )
    ]);
  } else {
    store.commit('payments/setPayments', [...store.state.payments, data]);
  }
};
</script>

<style scoped>
.imageWhite {
  width: 23px;
  height: 23px;
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
  font-size: 37px;
  font-weight: 500;
  color: #ffffff;
  flex-grow: 1;
  text-align: center;
}

.link-li {
  margin-top: 10px;
  display: inline;
}
.link {
  font-size: 19px;
  color: #0F1921;
  font-weight: 400;
  text-decoration: none;
  border-bottom: 1px solid #0F1921;
  cursor: pointer;
  margin: 0 5px;
}
.link:hover {
  border-bottom: 2px solid #0F1921;
}
.modal-body {
  display: flex;
  flex-direction: row;
  padding: 40px 75px 46px 75px;
  justify-content: space-between;
  align-items: flex-start;
}
.price-per-player {
  margin-top: 10px;
  font-size: 26px;
  font-weight: 500;
  font-family: 'Mulish',sans-serif;
  margin-bottom: 25px;
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
  background: #F5F5F5;
  border-radius: 16px;
  padding: 6px;
  width: 100%;
  max-width: 1328px;
  position: relative;
  font-family: 'Mulish', sans-serif;
}
.close-button {
  background: none;
  border: none;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
}
.team-title {
  display: inline-block;
  font-size: 40px;
  font-family: 'Mulish',sans-serif;
  font-weight: 500;
  color: #1B2A46  ;
  margin-bottom: 24px;
}

.title {
  font-size: 40px;
  font-family: 'Mulish',sans-serif;
  font-weight: 500;
  color: #0F1921  ;
  margin-bottom: 24px;
}

.price-info {
  margin-bottom: 30px;
  font-size: 1.2rem;
}
.price-info .total-price {
  font-size: 24px;
  font-weight: 500;
  font-family: 'Mulish',sans-serif;
  color: #FFFFFC;
  background-color: #cc9f33;
  padding: 10px 65px;
  border-radius: 13px;
  line-height: 31px;
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
  gap: 10px;
  margin-bottom: 30px;
  margin-top: 15px;
  margin-right: 160px;
  width: 100%;
  justify-content: flex-start;
}
.player-button {
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  background-color: #F5F5F5;
  border: 2px solid #D7D7D7;
  border-radius: 50%;
  width: 75px;
  height: 75px;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 24px;
  font-weight: 700;
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
  width: 711px;
  margin-right: 10px;
}
.qr-section {
  width: 351px;
  height: 488px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pay-button {
  background-color: #cc9f33;
  color: #fff;
  font-size: 26px;
  padding: 15px 50px;
  border: none;
  border-radius: 13px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}
.pay-button:hover {
  background-color: #b1882e;
}

.text {
  font-size: 28px;
  line-height: 35px;
  font-family: 'Mulish', sans-serif;
  font-weight: 400;
  color: #000000;
}

.qr-container {
  background: #1B2A46;
  padding: 11px;
  border-radius: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.qr-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #FFFEFD;
}

.sbp {
  margin: 0 auto 13px auto;
}

.qr-code {
  width: 328px;
  height: 272px;
  height: auto;
}
.qr-instruction {
  margin-top: 12px;
  font-size: 17px;
  line-height: 22px;
  text-align: center;
  color: #FFFFFC;
  margin-bottom: 13x;
}
.checkbox-section {
  margin-top: 40px;
}
.checkbox-section label {
  display: block;
  margin-bottom: 10px;
}
.checkbox-section input[type="checkbox"] {
  margin-right: 10px;
}


.list {
  display: flex;
  flex-direction: row;
  gap: 25px;
  align-items: center;
  margin-top: 30px;
}

input[type="radio"] {
  -webkit-appearance: none; 
  -moz-appearance: none;
  appearance: none;
  width: 19px;
  height: 19px;
  border: 1px solid #C59216; 
  border-radius: 50%; 
  outline: none;
  cursor: pointer;
  position: relative;
}

input[type="radio"]:checked::before {
  content: '';
  display: block;
  width: 9px;
  height: 9px;
  background-color: #C59216; 
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 48%;
  transform: translate(-50%, -50%);
}

input[type="radio"]:focus {
  box-shadow: 0 0 3px #C59216;
}

.line {
  height: 19px;
  width: 1px;
  background-color: #0F1921;
  margin-top: 12px;
}
:deep(.invalid-email) {
  border: 2px solid red !important;
  background-color: #ffe6e6;
}

.invalid-email:active {
  border: 2px solid red !important;
  background-color: #ffe6e6;
}

.input-check.invalid-email {
  border: 2px solid red !important;
  background-color: #ffe6e6;
}

.input-check:focus {
  border-color: #cc9f33; 
  box-shadow: 0 0 5px rgba(204, 159, 51, 0.5); 
}

.input-check.invalid-email:focus {
  border-color: red !important; 
  box-shadow: 0 0 5px rgba(255, 0, 0, 0.5); 
}

.input-check  {
  margin-top: 10px;
  outline: none;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background:  #FFFFFC;
  padding: 20px 14px;
  font-size: 16px;
  font-family: 'Mulish', sans-serif;
  color: #0f1921;
  transition: border-color 0.2s;
  width: 500px;
  font-size: 26px;
  padding: 10px 20px;
  font-weight: 400;
}
@media (max-width: 1000px) {
  .modal-content {
    width: 90vw;
    padding: 6px;
  }
  .team-title {
    font-size: 24px;
  }
  .player-buttons {
    gap: 5px;
    margin-right: 0;
  }
  .player-button {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
  .price-info {
    margin-bottom: 20px;
  }
  .qr-container {
    padding: 10px;
  }
  .modal-body {
    padding: 20px;
  }
  .qr-section {
    margin-top: 20px;
  }
}
</style>