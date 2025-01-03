<template>
  <div>
    <h1>Создать категорию</h1>
    <form @submit.prevent="showUpdateDialog">
      <small>Старое название: {{ oldName }}</small>
      <div class="form-group">
        <label for="name">Название категории:</label>
        <input
          id="name"
          v-model="categoryName"
          type="text"
          placeholder="Введите название категории"
          required
        />
      </div>

      <div class="form-actions">
        <button
          type="button"
          :disabled="!hasChanges || loading"
          @click="showUpdateDialog"
          :style="{ opacity: !hasChanges || loading ? '50%' : '100%' }"
        >
          <Loader v-if="loading" /> Создать
        </button>
        <button
          type="button"
          @click="() => {router.back()}"
          class="button"
        >Назад
        </button>
      </div>
    </form>

    <ConfirmDialog
      v-if="showDialog"
      :visible="showDialog"
      :title="dialogTitle"
      :message="dialogMessage"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import Notification from '@/admin/Notification.vue';
import Loader from '../Loader.vue';
import { useStore } from 'vuex';
import {useRoute} from "vue-router";
import router from "@/router/index.js";

const store = useStore();
const route = useRoute()

const loading = ref(false);
const categoryName = ref('');
const oldName = ref('');
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const toastMessage = ref('');
const toastType = ref('success');
const hasChanges = computed(() => categoryName.value !== oldName.value);
let dialogAction = null;

const showUpdateDialog = ()  => {
  dialogTitle.value = 'Подтверждение обновления';
  dialogMessage.value = 'Вы уверены, что хотите создать категорию?';
  dialogAction = addCategory;
  showDialog.value = true;
};


const handleConfirm = async () => {
  showDialog.value = false;
  if (dialogAction) await dialogAction();
};

const handleCancel = () => {
  showDialog.value = false;
};

const addCategory = async () => {
  try {
    loading.value = true;
    await store.dispatch('places/addCategory',  {
      placeId: route.params.id,
      categoryData: { name: categoryName.value },
    })
    toastMessage.value = 'Категория успешно создана';
    toastType.value = 'success';
  } catch (error) {
    console.error('Ошибка обновления категории:', error);
    toastMessage.value = 'Ошибка при создании категории';
    toastType.value = 'error';
  } finally {
    loading.value = false;
    setTimeout(() => {
      toastMessage.value = ''
      router.push(`/admin/places`)
    }, 3000);
  }
};

</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

small {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 1rem;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

button {
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='button'] {
  background-color: #6c757d;
}

button[type='button']:hover {
  background-color: #5a6268;
}

button.delete-button {
  background-color: #dc3545;
}

button.delete-button:hover {
  background-color: #c82333;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
