<template>
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">×</button>
      <div class="modal-body">
        <div class="form-section">
          <div class="team-title">Название команды</div>
          <h1 class="main-heading">
            Примите участие<br>в нашей лотерее
          </h1>
          <form @submit.prevent="submitForm">
            <Input
                v-model:content="formData.name"
                text="Ваше имя"
                width="auto"
            />
            <Input
                v-model:content="formData.email"
                text="Ваша электронная почта"
                width="auto"
            />
            <Input
                v-model:content="formData.phone"
                text="Телефон"
                width="auto"
            />

            <button type="submit" class="submit-button">
              Участвовать в лотерее
            </button>

            <div class="checkbox-section">
              <label class="checkbox-container">
                <input
                    type="checkbox"
                    id="agree"
                    v-model="formData.agree"
                    required
                />
                <span>
                  Нажмите кнопку, что вы соглашаетесь с политикой обработки персональных данных.
                </span>
              </label>
            </div>
          </form>
        </div>

        <div class="rules-section">
          <h2>Правила проведения лотереи</h2>
          <ul>
            <li>Лотерея проводится в рамках квиз-игры и доступна всем участникам.</li>
            <li>Для участия необходимо зарегистрироваться, отправив ФИО и телефон.</li>
            <li>Каждый участник может зарегистрироваться только один раз.</li>
            <li>Розыгрыш проводится в перерывах между раундами или по завершении игры.</li>
            <li>Победителя определяет программа случайных чисел.</li>
            <li>Призы выдаются лично в руки победителям сразу после объявления результатов.</li>
            <li>Призы не подлежат обмену на деньги и возврату.</li>
          </ul>
          <p class="lottery-greeting">Приятной игры и удачи в лотерее!</p>
          <p>
            Полные правила лотереи вы можете посмотреть тут: <a href="#" target="_blank">ссылка</a>.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import Input from "@/components/shared/forms/Input.vue";
import { ref } from "vue";

defineProps({
  show: Boolean,
  closeModal: Function
});

const formData = ref({
  name: "",
  email: "",
  phone: "",
  agree: false
});

const submitForm = () => {
  if (!formData.value.agree) {
    alert("Вы должны согласиться с политикой обработки персональных данных.");
    return;
  }
  console.log("Форма отправлена:", formData.value);
  formData.value.name = '';
  formData.value.email = '';
  formData.value.phone = '';
  formData.value.agree = false;
  alert("Спасибо за участие в лотерее!");
};
</script>

<style scoped>
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
  background: var(--c-white, #fff);
  border-radius: 1vw;
  padding: clamp(30px, 4vw, 50px) clamp(20px, 8vw, 100px);
  width: 70vw;
  max-width: 900px;
  position: relative;
  font-family: "Mulish", sans-serif;
}

.close-button {
  position: absolute;
  top: 2%;
  right: 2%;
  background: none;
  border: none;
  font-size: clamp(16px, 2vw, 24px);
  font-weight: bold;
  color: #0F1921;
  cursor: pointer;
}

.modal-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5vw;
}

.form-section, .rules-section {
  flex: 1;
}

.form-section form {
  display: flex;
  flex-direction: column;
  gap: 1.5vw;
}

.team-title {
  display: inline-block;
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: bold;
  color: #CC9F33;
  padding: 1vw 2vw;
  border: 1px solid rgba(15, 25, 33, 0.4);
  border-radius: 12px;
  margin-bottom: 1vw;
}

.main-heading {
  font-size: clamp(24px, 4vw, 36px);
  color: #0F1921;
  margin-bottom: 2vw;
  line-height: 1.2;
  font-weight: 700;
}

input[type="checkbox"] {
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
  color: #0F1921;
}

.submit-button {
  width: 100%;
  background-color: #CC9F33;
  color: #FFFFFC;
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
  color: #CC9F33;
  margin-bottom: 1vw;
}

.rules-section ul {
  list-style-type: disc;
  padding-left: 2vw;
  color: #0F1921;
  font-size: clamp(12px, 1.5vw, 14px);
  line-height: 1.6;
}

.rules-section ul li {
  margin-bottom: 13px;
}

.rules-section p {
  margin-top: 1vw;
  font-size: clamp(12px, 1.5vw, 14px);
  color: #0F1921;
}

.rules-section a {
  color: #CC9F33;
  text-decoration: underline;
}

.lottery-greeting {
  color: #CC9F33;
  font-size: clamp(12px, 1.5vw, 14px);
  margin-top: 1vw;
  margin-bottom: 1vw;
  text-align: center;
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
    margin-top:50px;
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
