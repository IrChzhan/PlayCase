<template>
  <div class="place-page-modal" v-if="show" @click.self="closeModal">
    <div class="container">
      <h1>Добавить Категорию</h1>
      <form @submit.prevent="showUpdateDialog" class="form">
        <div class="form-group">
          <label for="name">Название:</label>
          <input id="name" v-model="placeName" type="text" class="input" required />
        </div>

        <button
            type="button"
            class="button primary"
            :disabled="!hasChanges || loading"
            :class="{ 'disabled': !hasChanges || loading }"
            @click="showUpdateDialog"
        >
          <Loader v-if="loading" /> Добавить
        </button>
      </form>
    </div>

    <ConfirmDialog
        v-if="showDialog"
        :visible="showDialog"
        :title="dialogTitle"
        :message="dialogMessage"
        @confirm="handleConfirm"
        @cancel="handleCancel"
    />

    <Toast :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  closeModal: Function
});

import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Loader from '../Loader.vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import Toast from '../Toast.vue';

const route = useRoute();

const loading = ref(false);
const placeId = route.params.id;
const placeName = ref('');
const placeAddress = ref('');
const oldName = ref('');
const oldAddress = ref('');
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const toastMessage = ref('');
const toastType = ref('success');
let dialogAction = null;

const hasChanges = computed(() => {
  return placeName.value !== oldName.value || placeAddress.value !== oldAddress.value;
});

const showUpdateDialog = () => {
  dialogTitle.value = 'Подтверждение обновления';
  dialogMessage.value = 'Вы уверены, что хотите сохранить изменения?';
  dialogAction = updatePlace;
  showDialog.value = true;
};

const showDeleteDialog = () => {
  dialogTitle.value = 'Подтверждение удаления';
  dialogMessage.value = 'Вы уверены, что хотите удалить это место?';
  dialogAction = deletePlace;
  showDialog.value = true;
};

const handleConfirm = async () => {
  showDialog.value = false;
  if (dialogAction) {
    await dialogAction();
  }
};

const handleCancel = () => {
  showDialog.value = false;
};


</script>

<style scoped>
.place-page-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}

.container {
  display: flex;
  justify-content: center;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  font-size: 30px;
  margin: 0 auto 20px auto;
}

.form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.hint {
  font-size: 12px;
  color: gray;
  margin-bottom: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.input:focus {
  outline: none;
  border-color: #4285f4;
}

.button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.button.primary {
  background-color: #4285f4;
  color: white;
  margin-bottom: 10px;
}

.button.primary:hover:not(.disabled) {
  background-color: #357ae8;
}

.button.danger {
  background-color: #f44336;
  color: white;
}

.button.danger:hover:not(.disabled) {
  background-color: #d32f2f;
}

.button:disabled,
.button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>