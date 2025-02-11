<template>
  <div class="modal-overlay" v-if="show">
    <div v-if="!showSuccessModal" class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title">ОЦЕНИТЕ ИГРУ</h1>
        <button class="close-button" @click="closeModal"><img src="@/assets/CloseImageWhite.png" class="imageWhite" alt="CloseBtnWhite"></button>
      </div>
      <div class="modal-body">
        <div class="form-section">
          <div class="image-selection">
            <div
              class="image-container"
              :class="{'selected': formData.questionType === 'BAD'}"
              @click="selectImage('BAD')">
              <img :src="formData.questionType === 'BAD' ? BadYellow : Bad" alt="Bad" class="one image" />
            </div>
            <div
              class="image-container"
              :class="{'selected': formData.questionType === 'GOOD'}"
              @click="selectImage('GOOD')">
              <img :src="formData.questionType === 'GOOD' ? GoodYellow : Good" alt="Good" class=" two image" />
            </div>
          </div>
          <p class="details-text" @click="toggleDetails">Хотите рассказать подробнее?</p>
          <div v-if="showDetails" class="details-section">
            <label for="comment" class="details-label">Комментарий:</label>
            <textarea v-model="formData.comment"
                      placeholder="Ваш комментарий" id="comment" class="details-textarea">
              Введите ваш комментарий!
            </textarea>
          </div>
          <div class="con">
            <button v-if="formData.questionType || formData.comment" type="button" 
                  class="submit-button"
                  @click="submitForm">
            Отправить данные
          </button>
          </div>
        </div>
      </div>
    </div>
        <div class="modal-content" v-else>
          <div class="modal-header">
          <h1 class="modal-title">ОЦЕНИТЕ ИГРУ</h1>
          <button class="close-button" @click="closeModal"><img src="@/assets/CloseImageWhite.png" class="imageWhite" alt="CloseBtnWhite"></button>
        </div>
        <div class="modal-body success-body">
          <h2 class="success-title">Спасибо за вашу оценку!</h2>
        </div>
        <p class="details-text some" @click="toggleDetails">Хотите рассказать подробнее?</p>
      </div>
    </div>
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>


<script setup>
import { ref, watch } from 'vue';
import { useAuthCheck } from "@/hooks/useAuthCheck.js";
import { useStore } from "vuex";
import Notification from "@/admin/Notification.vue";
import Good from "@/assets/Good-svg.svg";
import Bad from "@/assets/Bad-svg.svg";
import GoodYellow from "@/assets/Good-svg-yellow.svg";
import BadYellow from "@/assets/Bad-svg-yellow.svg";

const props = defineProps({
  show: Boolean,
  closeModal: Function,
});

const selectImage = (type) => {
  formData.value.questionType = type;
  setSelectedColor(type === 'GOOD' ? 'green' : 'red');
  submitForm();
};

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
  if(showSuccessModal.value) {
    showSuccessModal.value = false;
  }
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
.imageWhite {
  width: 23px;
  height: 23px;
}
.con {
  width: 100%;
  display: flex;
  justify-content: center;
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
  font-size: 36px;
  font-weight: 500;
  color: #ffffff;
  flex-grow: 1;
  text-align: center;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.details-text {
  color: #cc9f33;
  font-size: 16px;
  line-height: 19px;
  cursor: pointer;
  text-decoration: underline;
  text-align: center;
  margin-bottom: 40px;
}

.some {
  margin-bottom: 21px;
}

.details-section {
  padding: 0 97px;
  margin-bottom: 1.5vw;
}

.details-label {
  display: block;
  font-size: 20px;
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
  outline: none;
}

.success-body {
  margin-top: 79px;
  margin-bottom: 103px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.success-title {
  font-size: 36px;
  font-weight: 500;
  color: #0F1921;
  line-height: 45px;
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
  padding: 6px;
  width: 100%;
  max-width: 883px;
  position: relative;
  font-family: 'Mulish', sans-serif;
}

.close-button {
  background: none;
  border: none;
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
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
  justify-content: center;
  gap: 97px;
  margin-bottom: 45px;
  margin-top: 40px;
}

.image-container {
  width: 290px;
  height: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  overflow: hidden;
  background: #1B2A46;
}


.image-container.selected {
  border-color: transparent;
  transition: box-shadow 0.3s ease-in-out;
}

.submit-button {
  background-color: #C59216;
  margin: 0 auto 30px auto;
  color: #fffffc;
  border: none;
  border-radius: 1.5vw;
  padding: 14px 26px;
  font-size: clamp(20px, 1.5vw, 14px);
  cursor: pointer;
}

.submit-button:hover {
  background-color: #b68d2f;
}

.two {
  margin-right: 30px;
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
