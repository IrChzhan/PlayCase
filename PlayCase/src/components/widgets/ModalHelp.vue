<template>
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="modal-content" v-if="resHelp === ''">
      <div class="modal-header">
        <h1 class="modal-title">ПОЗВАТЬ</h1>
        <button class="close-button" @click="closeModal"><img src="@/assets/CloseImageWhite.png" class="imageWhite" alt="closeImage"></button>
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
      <button class="close-button-v" @click="closeModal"><img class="image" src="@/assets/CloseImage.png" alt="closeImage"></button>
    </div>
  </div>
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
  }
};

const getCurrentHelp = async () => {
  try {
    const res = await store.dispatch('helps/getCurrentHelp');
    resHelp.value = res.status;
    calledPerson.value = res.responsiblePerson;
  } catch (e) {
    resHelp.value = '';
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

.image {
  width: 21px;
  height: 21px;
}

.imageWhite {
  width: 23px;
  height: 23px;
}

.help-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 15px;
  padding: 58px 0 58px 0;
  max-width: 722px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: 'Mulish', sans-serif;
  position: relative;
}

.help-text {
  font-family: 'Mulish', sans-serif;
  font-weight: 400;
  font-size: 38px;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
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
  font-family: 'Mulish', sans-serif;
  font-size: 36px;
  font-weight: 500;
  color: #ffffff;
  flex-grow: 1;
  text-align: center;
}

.modal-content {
  background: var(--c-white, #fff);
  border-radius: 15px;
  padding: 6px;
  width: 100%;
  max-width: 790px;
  position: relative;
  font-family: 'Mulish', sans-serif;
}

.close-button {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  position: absolute;
  right: 17px;
}

.close-button-v {
  width: 21px;
  height: 21px;
  background: none;
  border: none;
  font-weight: 500;
  color: #3A4C6E;
  cursor: pointer;
  position: absolute;
  top: 21px;
  right: 26px;
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
  margin-top: 72px;
  margin-bottom: 71px;
  display: flex;
  justify-content: space-around;
}

.help-button {
  font-family: 'Mulish', sans-serif;
  background-color: #C59216;
  color: #fff;
  width: 227px;
  line-height: 33.24px;
  padding: 15px 25px;
  font-size: 26px;
  font-weight: 400;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.help-button:hover {
  background-color: #d1aa58;
}
</style>