<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <div class="modal-body">
        <div class="form-section">
          <h1 class="main-heading">Наши контакты</h1>
          <div class="container_qr">
            <div class="tg">
              <img src="@/assets/TG.png" />
              <p>TELEGRAM</p>
            </div>
            <div class="inst">
              <img src="@/assets/INST.png" />
              <p>INSTA</p>
            </div>
            <div class="vk">
              <img src="@/assets/VK.png" />
              <p>VKONTAKTE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
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
  backdrop-filter: blur(8px);
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

.container_qr {
  display: flex;
  gap: 60px;
}

.qr {
  display: flex;
  flex-direction: column;
  gap: 20px;
}


p {
  margin-left: 10px;
}

.tg img {
  width: 210px; 
  height: auto;
}

.inst img {
  width: 210px; 
  height: auto;
}

.vk img {
  width: 210px; 
  height: auto;
}

@media (max-width: 768px) {
  @media (max-width: 1024px) {
    .modal-content {
      width: 90vw;
      padding: 15px;
    }
    .main-heading {
      font-size: clamp(18px, 3vw, 24px);
    }
  }
}
</style>
