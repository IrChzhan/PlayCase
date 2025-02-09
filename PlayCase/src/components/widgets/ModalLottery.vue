<template>
  <div>
    <div class="modal-overlay" v-if="show">
      <div class="modal-content">

        <div class="modal-header">
          <span class="lottery_text">ЛОТЕРЕЯ</span>
          <button class="close-button" @click="closeModal">×</button>
        </div>

        <div class="modal-body">
          <div class="form-section">
            <form @submit.prevent="submitForm">
              <Input v-model:modelValue="formData.name" :error="!!nameError" :errorMessage="nameError" text="Имя" width="auto" />
              <Input v-model:modelValue="formData.email" :error="!!emailError" :errorMessage="emailError" text="E-mail" width="auto" />
              <Input v-model:modelValue="formData.phone" :error="!!phoneError" :errorMessage="phoneError" text="Телефон" width="auto" placeholder="+7 (___) ___-____" />

              <div class="checkbox-section">
                <label class="checkbox-container">
                  <input type="checkbox" id="agree" v-model="formData.agree" required />
                  <span>Нажимая на кнопку, вы соглашаетесь с <span class="policy-link" @click="toggleModal('politica', true)">политикой обработки персональных данных</span></span>
                </label>
              </div>

              <button type="submit" class="submit-button">Участвовать</button>
            </form>
          </div>

          <div class="rules-section">
            <h2>Правила проведения лотереи</h2>
            <ul>
              <li>Лотерея проводится в рамках ИГРЫ и доступна всем участникам.</li>
              <li>Для участия необходимо зарегистрироваться, заполнив поля со своими данными.</li>
              <li>Каждый участник может зарегистрироваться <span class="special-el">только один раз</span>.</li>
              <li>Победителя определяет генератор случайных чисел.</li>
              <li>Призы не подлежат обмену на деньги и возврату.</li>
            </ul>
            <p class="lottery-greeting">Приятной игры и удачи в лотерее!</p>
            <div class="btn-con">
              <button @click.stop="toggleModal('registrateUsers', true)" class="btn">Список участников</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="showSuccessModal">
      <div class="modal-content">
        <div class="modal-header">
          <span>Результат</span>
          <button class="close-button" @click="closeSuccessModal">×</button>
        </div>
        <div class="modal-body success-body">
          <p class="success-title">Ваш номер:</p>
          <p class="success-number"><strong>{{ successNumber }}</strong></p>
        </div>
      </div>
    </div>

    <RegistrateUsers v-if="showRegistrateUsers" :show="showRegistrateUsers" @close="toggleModal('registrateUsers', false)" />
    <PolicyModal v-if="showPolitica" @close="toggleModal('politica', false)" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import Input from '@/components/shared/forms/Input.vue';
import { useAuthCheck } from '@/hooks/useAuthCheck.js';
import PolicyModal from "@/views/client/PoliticaPrivacy.vue";
import RegistrateUsers from "@/views/client/RegistrateUsers.vue";

const props = defineProps({
  show: Boolean,
  closeModal: Function,
});

const showPolitica = ref(false);
const showRegistrateUsers = ref(false);

function toggleModal(type, value) {
  if (type === 'politica') showPolitica.value = value;
  else if (type === 'registrateUsers') showRegistrateUsers.value = value;
}

const { teamName } = useAuthCheck();
const store = useStore();

const formData = ref({
  name: '',
  email: '',
  phone: '',
  agree: false,
});

const emailError = ref('');
const phoneError = ref('');
const nameError = ref('');
const showSuccessModal = ref(false);
const successNumber = ref(null);

const submitForm = async () => {
    emailError.value = '';
    phoneError.value = '';
    nameError.value = '';

    const cleanPhone = formData.value.phone.replace(/\D/g, '');

    if (!formData.value.name) {
        nameError.value = ' ';
    }

    if (!cleanPhone.match(/^7\d{10}$/)) {
        phoneError.value = ' ';
    }

    if (!formData.value.email.match(/^\S+@\S+\.\S+$/)) {
        emailError.value = ' ';
    }

    if (nameError.value || emailError.value || phoneError.value) {
        return;
    }

    try {
        const newUser = {
            name: formData.value.name,
            email: formData.value.email,
            phone: cleanPhone,
        };
        const response = await store.dispatch('lottery/registerInLottery', newUser);

        formData.value.name = '';
        formData.value.email = '';
        formData.value.phone = '';
        formData.value.agree = false;

        successNumber.value = response.sequenceNumber;
        showSuccessModal.value = true;
    } catch (error) {
        if (error.message.includes('email')) {
            emailError.value = 'E-mail уже зарегистрирован';
        }
        if (error.message.includes('phone')) {
            phoneError.value = 'Телефон уже зарегистрирован';
        }
    }
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  props.closeModal();
};

const phoneMask = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^7?/, '+7 ')
    .replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2-$3-$4');
};

watch(
  () => formData.value.phone,
  (newVal) => {
      formData.value.phone = phoneMask(newVal);
  }
);

watch(
  () => formData.value.email,
  (newValue) => {
    if (newValue && emailError.value) {
      emailError.value = '';
    }
  }
);

watch(
  () => props.show,
  (newVal) => {
    document.body.style.overflow = newVal ? 'hidden' : '';
  }
);
</script>


<style scoped>

.modal-header {
  background-color: #1c2536;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 5px 20px;
  font-size: 22px;
  font-weight: bold;
  text-transform: uppercase;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-bottom: 20px;
}

.lottery_text {
  margin-left: 300px;
  font-family: 'Mulish', sans-serif;
  font-weight: 500;
  font-size: 33px;
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
  z-index: 200;
}

.link {
  color: #cc9f33;
  text-decoration: none;
  border-bottom: 1px dashed #cc9f33;
  cursor: pointer;
  transition: border-bottom 0.3s;
  margin-top: 20px;
}
.btn-con {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
}
.link:hover {
  border-bottom: 1px solid #cc9f33;
}

.error-section {
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.5);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 1vw;
}

.error-message {
  color: #ff0000;
  font-size: clamp(12px, 1.5vw, 14px);
  margin: 0;
}

.modal-content {
  background: var(--c-white, #fff);
  border-radius: 1vw;
  padding: clamp(10px, 4vw, 10px); 
  width: 100%;
  padding: 6px;
  max-width: 800px;
  position: relative;
  font-family: 'Mulish', sans-serif;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 26px;
  cursor: pointer;
  margin-bottom: 5px;
}

.btn {
  display: block;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  background: #CC9F33;
  border-radius: 4px;
  right: 5%;
  bottom: 5%;
}
.btn:hover {
  background: #d1aa58;
}

.modal-body {
  display: flex;
  align-items: flex-start;
  gap: 3vw;
}

.form-section,
.rules-section {
  flex: 1;
}

.form-section form {
  display: flex;
  flex-direction: column;
  gap:3vw;
  margin-top: 20px;
}

.team-title {
  display: inline-block;
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: bold;
  color: white;
  background-color: #CC9F33;
  padding: 1vw 2vw;
  border-radius: 12px;
  margin-bottom: 1vw;
}

.main-heading {
  font-size: clamp(24px, 4vw, 36px);
  color: #0f1921;
  margin-bottom: 2vw;
  line-height: 1.2;
  font-weight: 700;
}

input[type='checkbox'] {
  margin-right: 0.5vw;
}

.checkbox-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2px;
  margin-top: 5px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #0f1921;
}

.submit-button {
  width: 100%;
  background-color: #cc9f33;
  color: #fffffc;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #b68d2f;
}

.rules-section h2 {
  font-size: clamp(18px, 2vw, 22px);
  color: #cc9f33;
  margin-bottom: 1vw;
}

.rules-section ul {
  list-style-type: disc;
  padding-left: 2vw;
  color: #0f1921;
  font-size: clamp(12px, 1.5vw, 14px);
  line-height: 1.6;
}

.rules-section ul li {
  margin-bottom: 13px;
}

.rules-section p {
  margin-top: 1vw;
  font-size: clamp(12px, 1.5vw, 14px);
  color: #0f1921;
}

.rules-section a {
  color: #cc9f33;
  text-decoration: underline;
}

.lottery-greeting {
  color: #cc9f33;
  font-size: clamp(12px, 1.5vw, 14px);
  margin-top: 1vw;
  margin-bottom: 1vw;
  text-align: center;
}

.special-el {
  font-weight: 900;
}

.success-body {
  text-align: center;
  display: flex;
  flex-direction: column;
    justify-content: center;
    align-items: center;
}

.success-title {
  font-size: clamp(20px, 3vw, 28px);
  color: #0f1921;
  margin-bottom: 0.3vw;
}

.success-message {
  font-size: clamp(16px, 2vw, 20px);
  color: #0f1921;
  margin-bottom: 0.5vw;
}

.success-number {
    font-size: clamp(26px, 4vw, 34px);
    color: #0f1921;
    margin-bottom: 1vw;
    margin-top: 0.3vw;
}

.policy-link {
  font-weight: bold;
  color: #cc9f33;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;
}

.policy-link:hover {
  color: #b68d2f;
}

@media (max-width: 768px) {
  .modal-content {
    width: 90vw;
    max-width: 600px;
    padding: 15px;
  }

  .success-title {
    font-size: clamp(18px, 4vw, 24px);
  }

  .success-message {
    font-size: clamp(14px, 3vw, 18px);
  }
  .success-number {
     font-size: clamp(20px, 5vw, 28px);
  }
  .submit-button {
    font-size: clamp(12px, 1.5vw, 16px);
    padding: 0.8vw 1.5vw;
  }

  .close-button {
    font-size: clamp(14px, 2vw, 20px);
  }
}
</style>
