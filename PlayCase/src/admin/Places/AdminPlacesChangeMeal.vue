<template>
  <div class="container">
    <h1>Редактировать блюдо</h1>
    <form @submit.prevent="showUpdateDialog" class="form">
      <div class="form-group">
        <label for="name">Название блюда:</label>
        <div class="hint">Старое название: {{ oldName }}</div>
        <input id="name" v-model="dishName" type="text" class="input" required />
      </div>

      <div class="form-group">
        <label for="price">Цена:</label>
        <input id="price" v-model="dishPrice" class="input" required />
      </div>

      <div class="form-group">
        <label for="description">Описание:</label>
        <textarea
          id="description"
          v-model="dishDescription"
          class="input"
          rows="3"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="file">Изображение:</label>
        <button type="button" class="button primary" @click="triggerFileInput">
          Выбрать изображение
        </button>
        <input
          id="file"
          type="file"
          @change="handleFileUpload"
          class="input visually-hidden"
        />
        <div v-if="mealFile" class="hint">Выбран файл: {{ mealFile.name }}</div>
      </div>
    </form>

    <div class="form-actions">
      <button
        type="button"
        class="button primary"
        :disabled="!hasChanges || loading"
        :class="{ disabled: !hasChanges || loading }"
        @click="showUpdateDialog(dishId, restaurantIdF)()"
      >
        <Loader v-if="loading" /> Сохранить изменения
      </button>
      <button class="button secondary" type="button" @click="goBack">Назад</button>
    </div>
  </div>

  <ConfirmDialog
    v-if="showDialog"
    :visible="showDialog"
    :title="dialogTitle"
    :message="dialogMessage"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />

  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import Notification from '@/admin/Notification.vue';
import ConfirmDialog from '../ConfirmDialog.vue';
import Loader from '../Loader.vue';
import router from '@/router/index.js';

const route = useRoute();
const store = useStore();
const goBack = () => {
  router.back();
};

const loading = ref(false);
const dishName = ref('');
const dishPrice = ref(0);
const dishDescription = ref('');
const mealFile = ref(null);
const imageId = ref(null);
const oldName = ref('');
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const toastMessage = ref('');
const toastType = ref('success');
let dialogAction = null;

const hasChanges = computed(
  () =>
    dishName.value !== oldName.value ||
    dishPrice.value ||
    dishDescription.value ||
    mealFile.value
);

const triggerFileInput = () => {
  document.getElementById('file').click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  mealFile.value = file;
  try {
    loading.value = true;
    const response = await store.dispatch('places/uploadImage', file);
    imageId.value = response;
    toastMessage.value = 'Изображение успешно загружено!';
    toastType.value = 'success';
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
    toastMessage.value = 'Ошибка загрузки изображения.';
    toastType.value = 'error';
  } finally {
    loading.value = false;
    setTimeout(() => {
      toastMessage.value = '';
    }, 1000);
  }
};

const showUpdateDialog = (dishId, restaurantIdF) => () => {
  dialogTitle.value = 'Подтверждение обновления';
  dialogMessage.value = 'Вы уверены, что хотите сохранить изменения?';
  dialogAction = updateDish;
  showDialog.value = true;
};

const updateDish = async () => {
  try {
    loading.value = true;
    await store.dispatch('places/updateMeal', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
      mealId: route.params.mealId,
      mealData: {
        name: dishName.value,
        price: dishPrice.value,
        description: dishDescription.value,
        fileId: imageId.value,
      },
    });
    toastMessage.value = 'Блюдо успешно обновлено!';
    toastType.value = 'success';
  } catch (error) {
    console.error('Ошибка обновления блюда:', error);
    toastMessage.value = 'Ошибка при обновлении блюда.';
    toastType.value = 'error';
  } finally {
    loading.value = false;
    setTimeout(() => {
      router.push(`/admin/places/categories/${route.params.id}`);
      toastMessage.value = '';
    }, 1000);
  }
};
const handleConfirm = async () => {
  showDialog.value = false
  if (dialogAction) {
    await dialogAction()
  }
}

const handleCancel = () => {
  showDialog.value = false
}


onMounted(() => {
  store.dispatch('places/fetchMeals', {
    placeId: route.params.id,
    categoryId: route.params.categoryId,
  }).then(() => {
    const res = store.getters['places/mealsByCategory'](route.params.categoryId)
      .find((el) => el.id === route.params.mealId);
    if (res) {
      dishName.value = res.name;
      dishPrice.value = res.price;
      dishDescription.value = res.description;
    }
  });
});
</script>

<style scoped>
.container {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
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
  font-size: 1rem;
  color: #555;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input:focus {
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

button.primary {
  background-color: #CC9F33;
}

button.primary:hover:not([disabled]) {
  background-color: #d1aa58;
}

button.secondary {
  background-color: #6c757d;
}

button.secondary:hover {
  background-color: #5a6268;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.visually-hidden {
  display: none;
}
</style>
