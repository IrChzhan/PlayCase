<template>
  <div class="place-page-modal" v-if="show" @click.self="closeModal">
    <div class="container">
      <h1>Добавить Блюдо</h1>
      <form @submit.prevent="handleAddMeal" class="form">
        <div class="form-group">
          <label for="mealName">Название блюда:</label>
          <input id="mealName" v-model="mealName" type="text" class="input" required />
        </div>
        <div class="form-group">
          <label for="mealPrice">Цена блюда:</label>
          <input id="mealPrice" v-model="mealPrice" type="text" class="input" required />
        </div>
        <div class="form-group">
          <label for="mealDescription">Описание блюда:</label>
          <textarea id="mealDescription" v-model="mealDescription" class="input textarea-readonly" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label for="mealImage">Загрузить изображение:</label>
          <input id="mealImage" type="file" @change="handleFileUpload" class="input" required />
        </div>
        <button
          type="submit"
          class="button primary"
          :disabled="loading || !mealName || !mealPrice || !mealFile"
          :class="{ disabled: loading || !mealName || !mealPrice || !mealFile }"
        >
          <Loader v-if="loading" /> Добавить
        </button>
      </form>
    </div>

    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineProps({
  show: Boolean,
  closeModal: Function,
})

import { ref } from 'vue'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'

import Loader from '../Loader.vue'

const store = useStore()
const route = useRoute()

const mealName = ref('')
const mealPrice = ref('')
const mealDescription = ref('')
const mealFile = ref(null)
const imageId = ref(null)
const loading = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  mealFile.value = file
  try {
    loading.value = true
    const response = await store.dispatch('places/uploadImage', file)
    imageId.value = response;
    console.log(response, imageId.value)
    toastMessage.value = 'Изображение успешно загружено!'
    toastType.value = 'success'
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error)
    toastMessage.value = 'Ошибка загрузки изображения.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  }
}

const handleAddMeal = async () => {
  if (!imageId.value) {
    toastMessage.value = 'Не удалось загрузить изображение.'
    toastType.value = 'error'
    return
  }
  console.log(mealDescription.value)
  try {
    loading.value = true
    await store.dispatch('places/addMeal', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
      mealData: {
        name: mealName.value,
        price: mealPrice.value,
        description: mealDescription.value,
        fileId:  imageId.value
      },
    })

    toastMessage.value = 'Блюдо успешно добавлено!'
    toastType.value = 'success'
    mealName.value = ''
    mealPrice.value = ''
    mealDescription.value = ''
    mealFile.value = null
    imageId.value = null
  } catch (error) {
    console.error('Ошибка при добавлении блюда:', error)
    toastMessage.value = 'Ошибка при добавлении блюда.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  }
}
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
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  align-items: center;
  max-width: 500px;
}

h1 {
  text-align: center;
  color: #333;
  font-size: 28px;
  margin: 0 auto 20px auto;
}

.form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
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
  border-radius: 8px;
  font-size: 16px;
  transition: box-shadow 0.3s, border-color 0.3s;
}

.input:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 8px rgba(66, 133, 244, 0.3);
}

.textarea-readonly {
  resize: none;
  background-color: #f9f9f9;
  color: #666;
}

.button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.button.primary {
  background-color: #4caf50;
  color: white;
}

.button.primary:hover:not(.disabled) {
  background-color: #43a047;
  transform: translateY(-2px);
}

.button:disabled,
.button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button.primary:disabled {
  background-color: #4caf50;
}
</style>
