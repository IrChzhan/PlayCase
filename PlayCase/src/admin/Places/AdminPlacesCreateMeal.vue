<template>
  <div class="add-meal">
    <h1>Добавить Блюдо</h1>
    <form @submit.prevent="handleAddMeal" class="form">
      <div class="form-group">
        <label for="mealName">Название блюда:</label>
        <input
          id="mealName"
          v-model="mealName"
          type="text"
          placeholder="Введите название блюда"
          class="input"
          required
        />
      </div>

      <div class="form-group">
        <label for="mealPrice">Цена блюда:</label>
        <input
          id="mealPrice"
          v-model="mealPrice"
          type="text"
          placeholder="Введите цену блюда"
          class="input"
          required
        />
      </div>

      <div class="form-group">
        <label for="mealDescription">Описание блюда:</label>
        <textarea
          id="mealDescription"
          v-model="mealDescription"
          placeholder="Введите описание блюда"
          class="input textarea-readonly"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="mealImage">Загрузить изображение:</label>
        <input id="mealImage" type="file" @change="handleFileUpload" class="input" required />
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="button primary btn-add"
          :disabled="loading || !mealName || !mealPrice || !mealFile"
        >
          <Loader v-if="loading" /> Добавить
        </button>
        <button class="button secondary" type="button" @click="goBack">Назад</button>
      </div>
    </form>

    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useStore } from 'vuex';

import Loader from '../Loader.vue';
import Notification from '@/admin/Notification.vue';

const store = useStore();
const router = useRouter();
const route = useRoute();

const mealName = ref('');
const mealPrice = ref('');
const mealDescription = ref('');
const mealFile = ref(null);
const imageId = ref(null);
const loading = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

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
    }, 3000);
  }
};

const handleAddMeal = async () => {
  if (!imageId.value) {
    toastMessage.value = 'Не удалось загрузить изображение.';
    toastType.value = 'error';
    return;
  }
  try {
    loading.value = true;
    await store.dispatch('places/addMeal', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
      mealData: {
        name: mealName.value,
        price: mealPrice.value,
        description: mealDescription.value,
        fileId: imageId.value,
      },
    });

    toastMessage.value = 'Блюдо успешно добавлено!';
    toastType.value = 'success';
    mealName.value = '';
    mealPrice.value = '';
    mealDescription.value = '';
    mealFile.value = null;
    imageId.value = null;
  } catch (error) {
    console.error('Ошибка при добавлении блюда:', error);
    toastMessage.value = 'Ошибка при добавлении блюда.';
    toastType.value = 'error';
  } finally {
    loading.value = false;
    setTimeout(() => {
      toastMessage.value = '';
      router.push(`/admin/places/categories/${route.params.id}/menu/${route.params.categoryId}`)
    }, 3000);
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
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
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.textarea-readonly {
  resize: none;
  background-color: #f9f9f9;
  color: #666;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit'] {
  background-color: #007bff;
}

button[type='submit']:hover {
  background-color: #0056b3;
}

button[type='button'] {
  background-color: #6c757d;
}

button[type='button']:hover {
  background-color: #5a6268;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.primary {
  background-color: #007bff;
}

.primary:hover {
  background-color: #0056b3;
}

.secondary {
  background-color: #6c757d;
}

.secondary:hover {
  background-color: #5a6268;
}
</style>
