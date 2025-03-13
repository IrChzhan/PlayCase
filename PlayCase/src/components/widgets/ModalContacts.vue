<template>
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">
        <img class="image" src="@/assets/CloseBtnBlack.png" alt="CloseImage">
      </button>
      <div class="modal-body">
        <div class="form-section">
          <div class="container_qr">
            <div class="tg">
              <img src="@/assets/telegram.png" alt="Telegram">
            </div>
            <div class="inst">
              <img src="@/assets/VK.png" alt="VK">
            </div>
            <div class="vk">
              <img src="@/assets/site.png" alt="Site">
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
.image {
  width: 45px;
  height: 45px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
  z-index: 1000;
}

.modal-content {
  background: #F5F5F5;
  border-radius: 28px;
  padding: 114px 124px;
  max-width: 1469px;
  position: relative;
  font-family: 'Mulish', sans-serif;
}

.close-button {
  position: absolute;
  top: 38px;
  right: 34px;
  background: none;
  border: none;
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
  gap: 29px;
}

.qr {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tg img,
.inst img,
.vk img {
  width: 388px; 
  height: auto;
}

@media (max-width: 1200px) {
  .modal-content {
    padding: 80px 90px;
  }

  .tg img,
  .inst img,
  .vk img {
    width: 300px;
  }
}

@media (max-width: 992px) {
  .modal-content {
    padding: 60px 70px;
  }

  .container_qr {
    gap: 20px;
  }

  .tg img,
  .inst img,
  .vk img {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .modal-content {
    padding: 40px 50px;
  }

  .tg img,
  .inst img,
  .vk img {
    width: 200px;
  }
}

@media (max-width: 576px) {
  .modal-content {
    padding: 20px 30px;
  }

  .tg img,
  .inst img,
  .vk img {
    width: 150px;
  }

  .close-button {
    top: 20px;
    right: 20px;
  }

  .image {
    width: 30px;
    height: 30px;
  }
}
</style>