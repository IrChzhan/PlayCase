<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">×</button>
      <div class="modal-body">
        <div class="form-section">
          <div class="team-title">{{ teamName }}</div>
          <h1 class="main-heading">Примите участие<br />в лотерее</h1>
          <form @submit.prevent="submitForm">
            <div v-if="emailError || phoneError" class="error-section">
              <p v-if="emailError" class="error-message">{{ emailError }}</p>
              <p v-if="phoneError" class="error-message">{{ phoneError }}</p>
            </div>
            <Input v-model:modelValue="formData.name" text="Имя" width="auto" />
            <Input v-model:modelValue="formData.email" text="E-mail" width="auto" />
            <Input
              v-model:modelValue="formData.phone"
              text="Телефон"
              width="auto"
              placeholder="+7 (___) ___-____"
            />

            <button type="submit" class="submit-button">Участвовать</button>

            <div class="checkbox-section">
              <label class="checkbox-container">
                <input type="checkbox" id="agree" v-model="formData.agree" required />
                <span>
                  Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.
                </span>
              </label>
            </div>
          </form>
        </div>

        <div class="rules-section">
          <h2>Правила проведения лотереи</h2>
          <ul>
            <li>Лотерея проводится в рамках ИГРЫ и доступна всем участникам.</li>
            <li>Для участия необходимо зарегистрироваться, заполнив поля со своими данными.</li>
            <li>
              Каждый участник может зарегистрироваться
              <span class="special-el">только один раз</span>.
            </li>
            <li>Победителя определяет генератор случайных чисел.</li>
            <li>Призы не подлежат обмену на деньги и возврату.</li>
          </ul>
          <p class="lottery-greeting">Приятной игры и удачи в лотерее!</p>
          <a class="link" @click="goToPolitica" target="_blank">
                  Политика конфиденциальности
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import { useStore } from 'vuex'
import {useRouter} from 'vue-router'

import Input from '@/components/shared/forms/Input.vue'
import { useAuthCheck } from '@/hooks/useAuthCheck.js'

const props = defineProps({
  show: Boolean,
  closeModal: Function,
})

const { teamName } = useAuthCheck()

const store = useStore()
const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  agree: false,
})

const emailError = ref('')
const phoneError = ref('')

const submitForm = async () => {
  emailError.value = ''
  phoneError.value = ''
  const cleanPhone = formData.value.phone.replace(/\D/g, '');
  if (!formData.value.agree) {
    alert('Вы должны согласиться с политикой обработки персональных данных.')
    return
  }

  const newUser = {
    name: formData.value.name.trim(),
    email: formData.value.email.trim(),
    phone: cleanPhone.trim(),
  }

  try {
    const response = await store.dispatch('lottery/registerInLottery', newUser)

    formData.value.name = ''
    formData.value.email = ''
    formData.value.phone = ''
    formData.value.agree = false
    alert(`Спасибо за участие в лотерее! Ваш номер: ${response.sequenceNumber}`)
    props.closeModal()
  } catch (error) {
    if (error.message.includes('email')) {
      emailError.value = 'Пользователь с таким email уже существует'
    }
    if (error.message.includes('phone')) {
      phoneError.value = 'Пользователь с таким номером телефона уже существует'
    }
    alert(error.message)
  }
}
const phoneMask = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^7?/, '+7 ')
    .replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2-$3-$4');
};

const goToPolitica = () => {
  router.push('/client/politica')
};

watch(
  () => formData.value.phone,
  (newVal) => {
    formData.value.phone = phoneMask(newVal);
  }
);

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

.link {
  color: #cc9f33;
  text-decoration: none; 
  border-bottom: 1px dashed #cc9f33; 
  cursor: pointer; 
  transition: border-bottom 0.3s;
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

.modal-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5vw;
}

.form-section,
.rules-section {
  flex: 1;
}

.form-section form {
  display: flex;
  flex-direction: column;
  gap: 1.2vw;
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
  margin-top: 1vw;
}

.checkbox-container {
  display: flex;
  align-items: center;
  font-size: clamp(12px, 1.5vw, 14px);
  color: #0f1921;
}

.submit-button {
  width: 100%;
  background-color: #cc9f33;
  color: #fffffc;
  border: none;
  border-radius: 1.5vw;
  padding: 1vw 2vw;
  font-size: clamp(12px, 1.5vw, 14px);
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

@media (max-width: 768px) {
  .modal-content {
    width: 90vw;
    max-width: 600px;
    padding: 15px;
  }

  .modal-body {
    flex-direction: column;
    gap: 15px;
    width: 100%;
    box-sizing: border-box;
  }

  .form-section,
  .rules-section {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .main-heading {
    font-size: clamp(1.5vw, 24px, 30px);
    line-height: 1.3;
  }

  .team-title {
    margin-top: 50px;
  }

  .checkbox-container {
    font-size: clamp(1vw, 12px, 14px);
  }

  .rules-section h2 {
    font-size: clamp(1.5vw, 18px, 22px);
  }

  .rules-section ul {
    font-size: clamp(1vw, 12px, 14px);
    padding-left: 1vw;
    line-height: 1.5;
  }

  .rules-section p {
    font-size: clamp(1vw, 12px, 14px);
  }

  .lottery-greeting {
    font-size: clamp(1vw, 12px, 14px);
  }

  .input-container {
    width: 100%;
  }
}
</style>
