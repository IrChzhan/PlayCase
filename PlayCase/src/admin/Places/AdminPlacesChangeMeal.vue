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
        <input id="file" type="file" @change="handleFileUpload" class="input" />
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
import {computed, onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'
import router from '@/router/index.js'

import ConfirmDialog from '../ConfirmDialog.vue'
import Loader from '../Loader.vue'

defineProps({
  show: Boolean,
  closeModal: Function,
  dishId: String,
  restaurantIdF: String,
})

const route = useRoute()
const store = useStore()
const goBack = () => {
  router.back()
}
const loading = ref(false)
const dishName = ref('')
const dishPrice = ref(0)
const dishDescription = ref('')
const dishImage = ref(null)
const oldName = ref('')
const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const toastMessage = ref('')
const toastType = ref('success')
let dialogAction = null
const restaurantId = ref('')
const dishIdR = ref('')
const mealFile = ref(null)
const imageId = ref(null)

const meals = computed(() => store.getters['places/mealsByCategory'](route.params.categoryId))

const hasChanges = computed(
  () =>
    dishName.value !== oldName.value || dishPrice.value || dishDescription.value || dishImage.value,
)

const showUpdateDialog = (dishId, restaurantIdF) => () => {
  dialogTitle.value = 'Подтверждение обновления'
  dialogMessage.value = 'Вы уверены, что хотите сохранить изменения?'
  dishIdR.value = dishId
  restaurantId.value = restaurantIdF
  dialogAction = updateDish
  showDialog.value = true
}

const showDeleteDialog = (dishId, restaurantIdF) => () => {
  dialogTitle.value = 'Подтверждение удаления'
  dialogMessage.value = 'Вы уверены, что хотите удалить это блюдо?'
  dishIdR.value = dishId
  restaurantId.value = restaurantIdF
  dialogAction = deleteDish
  showDialog.value = true
}

const handleConfirm = async () => {
  showDialog.value = false
  if (dialogAction) {
    await dialogAction()
  }
}

const handleCancel = () => {
  showDialog.value = false
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  mealFile.value = file
  try {
    loading.value = true
    const response = await store.dispatch('places/uploadImage', file)
    imageId.value = response
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
    }, 1000)
  }
}

const updateDish = async () => {
  try {
    console.log(dishIdR, dishIdR.value)
    loading.value = true
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
    })

    toastMessage.value = 'Блюдо успешно обновлено!'
    toastType.value = 'success'
  } catch (error) {
    console.error('Ошибка обновления блюда:', error)
    toastMessage.value = 'Ошибка при обновлении блюда.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => {
      router.push(`/admin/places/categories/${route.params.id}`)
      toastMessage.value = ''
    }, 1000)
  }
}

const deleteDish = async () => {
  try {
    loading.value = true
    await store.dispatch('places/deleteMeal', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
      mealId: route.params.mealId,
    })
    toastMessage.value = 'Блюдо удалено!'
    toastType.value = 'success'
  } catch (error) {
    console.error('Ошибка удаления блюда:', error)
    toastMessage.value = 'Ошибка при удалении блюда.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => {
      router.push(`/admin/places/categories/${route.params.id}`)
      toastMessage.value = ''
    }, 1000)
  }
}

const fetchMeals = async () => {
  const res = await store.dispatch('places/fetchMeals', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
    })
}

onMounted(() => {
  fetchMeals().then(() => {
    const res = meals.value.filter((el) => el.id === route.params.mealId)[0]
    dishName.value = res.name
    dishPrice.value = res.price
    dishDescription.value = res.description
  })
})

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

input {
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

button.primary {
  background-color: #CC9F33;
}

button.primary:hover:not([disabled]) {
  background-color: #d1aa58;
}

button.danger {
  background-color: #dc3545;
}

button.danger:hover:not([disabled]) {
  background-color: #c82333;
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

.secondary {
  background-color: #6c757d;
}

.secondary:hover {
  background-color: #5a6268;
}
</style>
