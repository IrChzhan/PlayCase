<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <div class="modal-body">
        <div class="form-section">
          <div class="team-title">{{teamName}}</div>
          <h2 class="title-box">Поставьте оценку игре</h2>
          <div class="image-selection">
            <div
              class="image-container"
              :class="{'selected': formData.questionType === 'GOOD'}"
              @click="formData.questionType = 'GOOD'"
              style="background: #8ECE40;">
              <img :src="Good" alt="Good" class="image" />
            </div>
            <div
              class="image-container"
              :class="{'selected': formData.questionType === 'NEUTRAL'}"
              @click="formData.questionType = 'NEUTRAL'"
              style="background-color: #FEC923;">
              <img :src="Neutral" alt="Neutral" class="image" />
            </div>
            <div
              class="image-container"
              :class="{'selected': formData.questionType === 'BAD'}"
              @click="formData.questionType = 'BAD'"
              style="background-color: #E85C29;">
              <img :src="Bad" alt="Bad" class="image" />
            </div>
          </div>
          <button type="button" class="submit-button" @click="submitForm">Отправить данные</button>
        </div>
      </div>
    </div>
  </div>
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<script setup>
import {ref, watch} from 'vue'
import {useAuthCheck} from "@/hooks/useAuthCheck.js";
import {useStore} from "vuex";
import Notification from "@/admin/Notification.vue";
import Good from "@/assets/Good.png"
import Neutral from "@/assets/Neutral.png"
import Bad from "@/assets/Bad.png"

const props = defineProps({
  show: Boolean,
  closeModal: Function,
})
const toastMessage = ref('')
const toastType = ref('success')
const { teamName } = useAuthCheck()
const store = useStore()

const formData = ref({
  questionType: '',
})

const submitForm = async () => {
  try {
    await store.dispatch('profile/addMark',
      {
        mark: formData.value.questionType
      }
    )
    toastMessage.value = 'Оценка успешно отправлена!'
    toastType.value = 'success'
    setTimeout(() => {
      toastMessage.value = ''
      closeModal()
    }, 1000)
  }catch (e) {
    toastMessage.value = 'Произошла ошибка'
    toastType.value = 'error'
    console.log(e)
  }
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
  z-index: 1000;
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
  color: #cc9f33;
  padding: 1vw 2vw;
  border: 1px solid rgba(15, 25, 33, 0.4);
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
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  background-color: inherit;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-container.selected {
  border-color: currentColor;
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
