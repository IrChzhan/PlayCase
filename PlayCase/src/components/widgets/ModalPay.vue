<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title">ОПЛАТА ИГРЫ</h1>
        <button class="close-button" @click="closeModal">×</button>
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
              @click="selectedPlayers = number"
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
                Отправить чек капитану команды
              </label>
              <label for="two" class="text">
                <input
                id="two"
                  type="radio"
                  value="sendReceiptToEmail"
                  v-model="picked"
                />
                Отправить чек на выбранный адрес
              </label>
              <input
                  v-if="picked === 'sendReceiptToEmail'"
                  type="email"
                  v-model="selectedEmail"
                  placeholder="Введите email"
                  :class="{ 'invalid-email': !isValidEmail }"
                  required
                />
            </div>
          </div>
          <button class="pay-button" @click="handlePayment">Оплатить</button>
          <dogovor-modal v-if="showDogovor" @close="toggleModal('dogovor', false)" />
          <policy-modal v-if="showPolitica" @close="toggleModal('politica', false)" />
          <info-modal v-if="showInfo" @close="toggleModal('info', false)" />
          <div class="additional-info">
            <ul>
              <li class="link-li">
                <a class="link" @click="toggleModal('dogovor', true)">Договор-оферта</a>
              </li>
              |
              <li class="link-li">
                <a class="link" @click="toggleModal('politica', true)">Политика конфиденциальности</a>
              </li>
              |
              <li class="link-li">
                <a class="link" @click="toggleModal('info', true)">реквизиты</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="qr-section" v-if="qrCodeUrl">
          <div class="qr-container">
            <img :src="qrCodeUrl" alt="QR-код" class="qr-code" />
            <p class="qr-instruction">Отсканируйте код камерой или в приложении банка</p>
          </div>
        </div>
        <div v-for="(notification, index) in notifications" :key="index">
          <Notification
            :message="notification.message"
            :type="notification.type"
            @close="removeNotification(index)"
          />
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

  if (picked.value == 'sendReceiptToEmail' && !validateEmail(selectedEmail.value)) {
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
    if (newVal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);

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
  padding: 45px 75px;
  justify-content: space-between;
  align-items: flex-start;
}
.price-per-player {
  margin-top: 10px;
  font-size: 22px;
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
  background: #fff;
  border-radius: 1vw;
  padding: 6px;
  width: 70vw;
  max-width: 900px;
  position: relative;
  font-family: 'Mulish', sans-serif;
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
.team-title {
  display: inline-block;
  font-size: 30px;
  font-family: 'Mulish',sans-serif;
  font-weight: 500;
  color: #0F1921  ;
  margin-bottom: 24px;
}

.title {
  font-size: 30px;
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
  font-weight: 400;
  color: #fff;
  background-color: #cc9f33;
  padding: 10px 35px;
  border-radius: 13px;
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
  justify-content: flex-start;
}
.player-button {
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 50px;
  height: 50px;
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

.text {
  font-size: 20px;
  font-family: 'Mulish', sans-serif;
  font-weight: 400;
  color: #000000;
}

.qr-container {
  background: rgba(58, 76, 110, 0.5);
  padding: 10px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.qr-code {
  width: 150px;
  height: 100px;
  height: auto;
}
.qr-instruction {
  margin-top: 10px;
  font-size: 1rem;
  text-align: center;
  color: #555;
}
.checkbox-section {
  margin-top: 20px;
}
.checkbox-section label {
  display: block;
  margin-bottom: 10px;
}
.checkbox-section input[type="checkbox"] {
  margin-right: 10px;
}
.checkbox-section input[type="email"] {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 400px;
}
.invalid-email {
  border-color: red;
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