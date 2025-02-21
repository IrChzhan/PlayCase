<template>
  <div>
    <div class="modal-overlay" v-if="show" @click.self="closeModal">
      <div class="modal-content">

        <div class="modal-header">
          <span class="lottery_text">ЛОТЕРЕЯ</span>
          <button class="close-button" @click="closeModal">×</button>
        </div>

        <div class="modal-body">
          <div class="form-section">
            <form @submit.prevent="submitForm">
              <div class="input_part">
              <Input v-model:modelValue="formData.name" :error="!!nameError" :errorMessage="nameError" text="Имя" width="100%" labelWidth="120px"/>
              <Input v-model:modelValue="formData.email" :error="!!emailError" :errorMessage="emailError" text="Email" width="100%"  labelWidth="120px"/>
              <Input v-model:modelValue="formData.phone" :error="!!phoneError" :errorMessage="phoneError" text="Телефон" width="100%" labelWidth="120px" placeholder="+7 (___) ___-____" />
              </div>

              <div class="checkbox-section">
                <label class="checkbox-container">
                  <input type="checkbox" :class="{checkboxError: checkboxError}" id="agree" v-model="formData.agree"/>
                  <span class="el-check">Нажимая на кнопку, вы соглашаетесь с <br><span class="policy-link" @click="toggleModal('politica', true)">политикой конфиденциальности</span></br></span>
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
            <br>
            <br>
            <div class="btn-con">
              <button @click.stop="toggleModal('registrateUsers', true)" class="btn">Список участников</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-overlay" v-if="showSuccessModal" @click.self="closeSuccessModal">
      <div class="modal-res" >
          <p class="modal-success-title">Ваш номер:<br/></p>
          
          <p class="modal-success-title"><strong>{{ successNumber }}</strong></p>
          <button class="close-button-v" @click="closeSuccessModal"><img class="image" src="@/assets/CloseImage.png" alt="closeImage"></button>
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
const checkboxError = ref(false);
const showSuccessModal = ref(false);
const successNumber = ref(null);

const submitForm = async () => {
    emailError.value = '';
    phoneError.value = '';
    nameError.value = '';
    checkboxError.value=false;

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

    if (!formData.value.agree) {
      checkboxError.value=true;
      return
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
.el-check {
  padding-left: 30px;
}
.modal-success-title{
  font-family: 'Mulish', sans-serif;
  font-weight: 400;
  font-size: 42px;
  text-align: center;
}
.modal-res{
  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 15px;
  padding: 48px 0 58px 0;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: 'Mulish', sans-serif;
  position: relative;
}
.checkboxError {
  color: red;
  background: red;
}
.close-button-v {
  width: 21px;
  height: 21px;
  background: none;
  border: none;
  font-weight: 500;
  color: #3A4C6E;
  cursor: pointer;
  position: absolute;
  top: 21px;
  right: 26px;
}

.modal-header {
  background-color: #1B2A46;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 10px 30px;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-bottom: 30px;
  height: 30px;
}

.label.input-label {
  font-size: 20px;
}

.lottery_text {
  margin-left: 550px;
  font-family: 'Mulish', sans-serif;
  font-weight: 500;
  font-size: 40px;
}

h2 {
  margin-top: 20px;
  font-size: 300px;
  font-weight: 600;
}


input::placeholder { font-size: 24px; }

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
  background: #F5F5F5;
  border-radius: 1.5vw;
  width: 1430px;
  height: 720px;  
  max-width: none; 
  max-height: none; 
  position: relative;
  font-family: 'Mulish', sans-serif;
  overflow: auto; 
  padding: 7px;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 60px;
  font-weight: 200;
  cursor: pointer;
  margin-bottom: 10px;
  margin-left: 500px;
}

.input_part {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 5px;
  margin-left: 70px;
}

.btn {
  display: block;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  background: #CC9F33;
  border-radius: 8px;
  right: 5%;
  bottom: 10%;
  font-size: 24px;
}
.btn:hover {
  background: #d1aa58;
}

.modal-body {
  display: flex;
  align-items: flex-start;
  gap: 150px;
}

.form-section,
.rules-section {
  flex: 1;
}

.form-section form {
  display: flex;
  flex-direction: column;
  gap:4vw;
  margin-top: 30px;
}

.team-title {
  display: inline-block;
  font-size: clamp(16px, 2vw, 20px);
  font-weight: bold;
  color: white;
  background-color: #CC9F33;
  padding: 1.2vw 2.4vw;
  border-radius: 15px;
  margin-bottom: 1.2vw;
}

.main-heading {
  font-size: clamp(26px, 4.5vw, 38px);
  color: #0f1921;
  margin-bottom: 2.5vw;
  line-height: 1.2;
  font-weight: 700;
}

input[type='checkbox'] {
  margin-right: 0.7vw;
  transform: scale(1.5);
  padding: 5px;
}

.checkbox-section {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  margin-top: 5px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #0f1921;
}

.submit-button {
  width: 90%;
  background-color: #cc9f33;
  color: #fffffc;
  border: none;
  border-radius: 30px;
  padding: 15px 10px;
  font-size: 24px;
  cursor: pointer;
  margin-left: 70px;
  margin-top: -30px;
}

.submit-button:hover {
  background-color: #b68d2f;
}

.rules-section {
  margin-right: 100px;
  flex: 1;
  text-align: left;
}

.rules-section h2 {
  font-size: clamp(20px, 2.5vw, 24px);
  color: #cc9f33;
  margin-bottom: 1.2vw;
  padding-left: 1.6vw;
}

.rules-section ul {
  list-style-type: disc;
  padding-left: 2.5vw;
  color: #0f1921;
  font-size: 18px;
  line-height: 1.6;
}

.rules-section ul li {
  margin-bottom: 15px;
}

.rules-section p {
  margin-top: 1.2vw;
  color: #0f1921;
}

.rules-section a {
  color: #cc9f33;
  text-decoration: underline;
}

.lottery-greeting {
  color: #cc9f33;
  font-size: 24px;
  font-style: italic;
  font-weight: 400;
  margin-top: 1.2vw;
  margin-bottom: 3px;
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
  font-size: clamp(22px, 3.5vw, 30px);
  color: #0f1921;
  margin-bottom: 0.4vw;
}

.success-message {
  font-size: clamp(18px, 2.5vw, 22px);
  color: #0f1921;
  margin-bottom: 0.6vw;
}

.success-number {
    font-size: clamp(28px, 4.5vw, 36px);
    color: #0f1921;
    margin-bottom: 1.2vw;
    margin-top: 0.4vw;
}

.policy-link {
  font-weight: bold;
  color: #cc9f33;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;
}

li {
  font-size: 22px;
}

.policy-link:hover {
  color: #b68d2f;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input[type="checkbox"] {
  opacity: 0;
  cursor: pointer;
  position: absolute;
}


.checkbox-container input[type="checkbox"] + span::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 17px;
  height: 17px;
  border: 2px solid #969696;
  border-radius: 4px;
  background-color: white;
  transition: border-color 0.3s;
}

.checkbox-container input[type="checkbox"]:checked + span::before {
  background-color: #2196F3;
  border-color: #2196F3;
}

.checkbox-container input[type="checkbox"].checkboxError + span::before {
  border-color: red;
}

.checkbox-container input[type="checkbox"]:checked + span::after {
  content: "";
  position: absolute;
  left: 7px;
  top: 10px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

@media (max-width: 768px) {
  .modal-content {
    width: 95vw;
    height: auto; 
    max-width: 700px;
  }

  .success-title {
    font-size: clamp(20px, 4.5vw, 26px);
  }

  .success-message {
    font-size: clamp(16px, 3.5vw, 20px);
  }
  .success-number {
     font-size: clamp(22px, 5.5vw, 30px);
  }
  .submit-button {
    font-size: clamp(14px, 2vw, 18px);
    padding: 1vw 1.7vw;
  }

  .close-button {
    font-size: clamp(16px, 2.5vw, 22px);
  }
}
</style>