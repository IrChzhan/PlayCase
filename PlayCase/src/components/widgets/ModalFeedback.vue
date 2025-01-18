<template>
  <div class="modal-overlay" v-if="show">
    <div v-if="!showSuccessModal" class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <div class="modal-body">
        <div class="form-section">
          <div class="team-title">{{teamName}}</div>
          <h2 class="title-box">Поставьте оценку игре</h2>
          <div class="image-selection">
            <div
              class="image-container"
              :style="{'--icon-color': selectedColor}"
              :class="{'selected': formData.questionType === 'GOOD'}"
              @click="formData.questionType = 'GOOD';setSelectedColor('green')">
              <img :src="Good" alt="Good" class="image" />
            </div>
            <div
              class="image-container"
              :style="{'--icon-color': selectedColor}"
              :class="{'selected': formData.questionType === 'NEUTRAL'}"
              @click="formData.questionType = 'NEUTRAL';setSelectedColor('yellow')">
              <img :src="Neutral" alt="Neutral" class="image" />
            </div>
            <div
              class="image-container"
              :style="{'--icon-color': selectedColor}"
              :class="{'selected': formData.questionType === 'BAD'}"
              @click="formData.questionType = 'BAD';setSelectedColor('red')">
              <img :src="Bad" alt="Bad" class="image" />
            </div>
          </div>

          <p class="details-text" @click="toggleDetails">хотите поподробнее?</p>
          <div v-if="showDetails" class="details-section">
            <label for="comment" class="details-label">Комментарий:</label>
            <textarea v-model="formData.comment"
                      placeholder="Ваш комментарий" id="comment" class="details-textarea">
              Введите ваш комментарий!
            </textarea>
          </div>

          <button type="button" class="submit-button" @click="submitForm">Отправить данные</button>
        </div>
      </div>
    </div>
    <div class="modal-overlay" v-else>
      <div class="modal-content">
        <button class="close-button" @click="closeSuccessModal">×</button>
        <div class="modal-body success-body">
          <h2 class="success-title">Спасибо, благодаря вам мы становимся лучше!</h2>
        </div>
      </div>
    </div>
  </div>
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthCheck } from "@/hooks/useAuthCheck.js";
import { useStore } from "vuex";
import Notification from "@/admin/Notification.vue";
import Good from "@/assets/green-ok.png";
import Neutral from "@/assets/yellow-ok.png";
import Bad from "@/assets/red-ok.png";

const props = defineProps({
  show: Boolean,
  closeModal: Function,
});

const showSuccessModal = ref(false);
const toastMessage = ref('');
const toastType = ref('success');
const {teamName} = useAuthCheck();
const store = useStore();
const selectedColor = ref('');
const showDetails = ref(false);

const setSelectedColor = (color) => {
  selectedColor.value = color;
};

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  props.closeModal();
};

const formData = ref({
  questionType: '',
  comment: ''
});

const submitForm = async () => {
  try {
    await store.dispatch('profile/addMark', {
      mark: formData.value.questionType,
      comment: formData.value.comment
    });
    showSuccessModal.value = true;
    formData.value.questionType = ''
    formData.value.comment = ''
    setTimeout(() => {
      toastMessage.value = '';
    }, 1000);
  } catch (e) {
    console.log(e);
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

.details-text {
  color: #cc9f33;
  font-size: 16px;
  cursor: pointer;
  text-decoration: underline;
  text-align: center;
  margin-bottom: 1vw;
}

.details-section {
  padding: 10px;
  margin-bottom: 1.5vw;
}

.details-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 0.5vw;
}

.details-textarea {
  width: 100%;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  font-size: 14px;
  color: #555;
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
}

.title-box {
  font-size: 36px;
  color: #CC9F33;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
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

.image-selection {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2vw;
}

.image-container {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  border: 2px solid transparent;
  cursor: pointer;
  overflow: hidden;
  -icon-color: transparent;
  color: var(--icon-color);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.8;
}

.image-container.selected {
  border-color: transparent;
  box-shadow: 0 0 15px 5px currentColor;
  transition: box-shadow 0.3s ease-in-out;
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
  .modal-content {
    width: 90vw;
    padding: 15px;
  }

  .team-title {
    font-size: clamp(10px, 1.5vw, 14px);
    padding: 0.5vw 1vw;
  }

  .image-container {
    width: 80px;
    height: 80px;
  }

  .submit-button {
    font-size: clamp(10px, 1.5vw, 12px);
    padding: 0.8vw 1.5vw;
  }
}
</style>
