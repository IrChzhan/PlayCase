<template>
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <div class="modal-body">
        <div class="form-section">
          <div class="team-title">Название команды</div>
          <h1 class="main-heading">Оставьте свой комментарий</h1>
          <textarea
            v-model="formData.comment"
            placeholder="Ваш комментарий"
            class="textarea"
          ></textarea>
          <div class="checkbox-groups">
            <div class="checkbox-column">
              <h3 class="checkbox-title">Вопросы были:</h3>
              <label class="checkbox-container">
                <input type="radio" name="questions" v-model="formData.questionType" value="easy" />
                Легкие
              </label>
              <label class="checkbox-container">
                <input
                  type="radio"
                  name="questions"
                  v-model="formData.questionType"
                  value="normal"
                />
                Нормальные
              </label>
              <label class="checkbox-container">
                <input type="radio" name="questions" v-model="formData.questionType" value="hard" />
                Сложные
              </label>
            </div>
            <div class="checkbox-column">
              <h3 class="checkbox-title">Ведущий был:</h3>
              <label class="checkbox-container">
                <input type="radio" name="host" v-model="formData.hostType" value="good" />
                Хороший
              </label>
              <label class="checkbox-container">
                <input type="radio" name="host" v-model="formData.hostType" value="bad" />
                Плохой
              </label>
              <label class="checkbox-container">
                <input type="radio" name="host" v-model="formData.hostType" value="beautiful" />
                Красивый
              </label>
            </div>
          </div>
          <button type="button" class="submit-button" @click="submitForm">Отправить данные</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  show: Boolean,
  closeModal: Function,
})

const formData = ref({
  comment: '',
  questionType: '',
  hostType: '',
})

const submitForm = () => {
  console.log('Форма отправлена:', formData.value)
  alert('Спасибо за ваш комментарий!')
  formData.value.comment = ''
  formData.value.questionType = ''
  formData.value.hostType = ''
}
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

.textarea {
  width: 100%;
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1vw;
  font-size: clamp(12px, 1.5vw, 14px);
  margin-bottom: 1.5vw;
  resize: none;
}

.checkbox-groups {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2vw;
}

.checkbox-column {
  display: flex;
  flex-direction: column;
  gap: 0.75vw;
}

.checkbox-title {
  font-size: clamp(14px, 1.5vw, 18px);
  color: #cc9f33;
  margin-bottom: 0.5vw;
}

.checkbox-container {
  display: flex;
  align-items: center;
  font-size: clamp(12px, 1.5vw, 14px);
  color: #0f1921;
}

.checkbox-container input[type='radio'] {
  margin-right: 0.5vw;
  width: 16px;
  height: 16px;
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

@media (max-width: 768px) {
  @media (max-width: 768px) {
    .modal-content {
      width: 90vw;
      padding: 15px;
    }
    .main-heading {
      font-size: clamp(18px, 3vw, 24px);
    }
    .team-title {
      font-size: clamp(10px, 1.5vw, 14px);
      padding: 0.5vw 1vw;
    }
    .textarea {
      height: 100px;
      font-size: clamp(10px, 1.5vw, 12px);
    }
    .checkbox-title {
      font-size: clamp(10px, 1.5vw, 14px);
    }
    .checkbox-container {
      font-size: clamp(10px, 1.5vw, 12px);
    }
    .submit-button {
      font-size: clamp(10px, 1.5vw, 12px);
      padding: 0.8vw 1.5vw;
    }
    .checkbox-groups {
      flex-direction: column;
    }
  }
}
</style>
