<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <div class="modal-body">
        <div class="form-section">
          <h1 class="main-heading">Помощь</h1>
          <div class="help-buttons">
            <button class="help-button" @click="callWaiter">Официант</button>
            <button class="help-button" @click="callHelper">Хелпер</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<script setup>
import { ref, watch } from 'vue';
import Notification from "@/admin/Notification.vue";
import {useStore} from "vuex";
const store = useStore()
const toastMessage = ref('')
const toastType = ref('success')
const props = defineProps({
  show: Boolean,
  closeModal: Function,
});

const callWaiter = async () => {
  try {
    await store.dispatch('helps/createHelp', {
      responsible: 'WAITER'
    })

    toastMessage.value = 'Запрос успешно отправлен!'
    toastType.value = 'success'

    setTimeout(() => {
      toastMessage.value = ''
    }, 1000)
  } catch (e) {
    toastMessage.value = 'Ошибка при запросе!'
    toastType.value = 'error'
    console.log(e)
  }
};

const callHelper = async () => {
  try {
    await store.dispatch('helps/createHelp', {
      responsible: 'HELPER'
    })

    toastMessage.value = 'Запрос успешно отправлен!'
    toastType.value = 'success'

    setTimeout(() => {
      toastMessage.value = ''
    }, 1000)
  } catch (e) {
    toastMessage.value = 'Ошибка при запросе!'
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



.main-heading {
  font-size: clamp(24px, 4vw, 36px);
  color: #0f1921;
  margin-bottom: 2vw;
  line-height: 1.2;
  font-weight: 700;
  text-align: center;
}



.help-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.help-button {
  background-color: #CC9F33;
  color: #fff;
  padding: 10px 20px;
  font-size: clamp(16px, 2vw, 20px);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.help-button:hover {
  background-color: #d1aa58;
}

@media (max-width: 768px) {
  .modal-content {
    width: 90vw;
    padding: 15px;
  }
  .main-heading {
    font-size: clamp(18px, 3vw, 24px);
  }
  .help-button {
    font-size: clamp(14px, 2vw, 18px);
    padding: 8px 15px;
  }
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

button .close-button:hover {
  background: none;
  border: none;
}
</style>
