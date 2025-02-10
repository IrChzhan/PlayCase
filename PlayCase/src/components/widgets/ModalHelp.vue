<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content" v-if="resHelp === ''">
      <div class="modal-header">
        <h1 class="modal-title">ПОЗВАТЬ</h1>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <div class="form-section">
          <div class="help-buttons">
            <button class="help-button" @click="callWaiter">Официант</button>
            <button class="help-button" @click="callHelper">Хелпер</button>
          </div>
        </div>
      </div>
    </div>
    <div class="help-box" v-else>
      <span class="help-text">{{ helpMessage }}</span>
      <button class="close-button-v" @click="closeModal">×</button>
    </div>
  </div>
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import Notification from "@/admin/Notification.vue";
import { useStore } from "vuex";

const store = useStore();
const toastMessage = ref('');
const toastType = ref('success');
const resHelp = ref('');
const calledPerson = ref('');

const props = defineProps({
  show: Boolean,
  closeModal: Function,
});

const watchedState = computed(() => store.state.results.helps);

const callWaiter = async () => {
  try {
    await store.dispatch('helps/createHelp', {
      responsible: 'WAITER'
    });

    toastMessage.value = 'Запрос успешно отправлен!';
    toastType.value = 'success';
    calledPerson.value = 'WAITER'; 
    store.commit('results/setHelps');
    setTimeout(() => {
      toastMessage.value = '';
    }, 1000);
  } catch (e) {
    toastMessage.value = 'Ошибка при запросе!';
    toastType.value = 'error';
    console.log(e);
  }
};

const callHelper = async () => {
  try {
    await store.dispatch('helps/createHelp', {
      responsible: 'HELPER'
    });

    toastMessage.value = 'Запрос успешно отправлен!';
    toastType.value = 'success';
    calledPerson.value = 'HELPER'; 
    store.commit('results/setHelps');
    setTimeout(() => {
      toastMessage.value = '';
    }, 1000);
  } catch (e) {
    toastMessage.value = 'Ошибка при запросе!';
    toastType.value = 'error';
    console.log(e);
  }
};

const getCurrentHelp = async () => {
  try {
    const res = await store.dispatch('helps/getCurrentHelp');
    resHelp.value = res.status;
    calledPerson.value = res.responsiblePerson;
  } catch (e) {
    resHelp.value = '';
    console.log(e);
  }
};

const helpMessage = computed(() => {
  return calledPerson.value === 'WAITER' ? 'Официант уже спешит к вам!' : 'Хелпер уже спешит к вам!';
});

watch(watchedState, () => {
  getCurrentHelp();
});

onMounted(() => {
  getCurrentHelp();
});

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
.help-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 8px;
  padding: 6px;
  max-width: 860px;
  width: 95%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: 'Mulish', sans-serif;
  position: relative;
}

.help-text {
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 28px;
  text-align: center;
}

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
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
  flex-grow: 1;
  text-align: center;
  margin-left: 10px;
}

.modal-content {
  background: var(--c-white, #fff);
  border-radius: 1vw;
  padding: 6px;
  width: 70vw;
  max-width: 900px;
  position: relative;
  font-family: 'Mulish', sans-serif;
}

.close-button {
  background: none;
  border: none;
  font-size: 30px;
  margin-bottom: 6px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  position: absolute;
  right: 20px;
}

.close-button-v {
  background: none;
  border: none;
  font-size: 30px;
  font-weight: 500;
  color: #3A4C6E;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
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
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  justify-content: space-around;
}

.help-button {
  background-color: #CC9F33;
  color: #fff;
  padding: 15px 25px;
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
</style>