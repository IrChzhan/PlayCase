<template>
  <div class="dish-modal" v-if="show" @click.self="closeModal">
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

        <button
          type="button"
          class="button primary"
          :disabled="!hasChanges || loading"
          :class="{ disabled: !hasChanges || loading }"
          @click="showUpdateDialog(dishId, restaurantIdF)()"
        >
          <Loader v-if="loading" /> Сохранить изменения
        </button>
      </form>

      <button
        @click="showDeleteDialog(dishId, restaurantIdF)()"
        class="button danger"
        :disabled="loading"
        :class="{ disabled: loading }"
      >
        <Loader v-if="loading" /> Удалить блюдо
      </button>
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
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'

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
    }, 3000)
  }
}

const updateDish = async () => {
  try {
    console.log(dishIdR, dishIdR.value)
    loading.value = true
    await store.dispatch('places/updateMeal', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
      mealId: dishIdR.value,
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
    setTimeout(() => (toastMessage.value = ''), 3000)
  }
}

const deleteDish = async () => {
  try {
    loading.value = true
    await store.dispatch('places/deleteMeal', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
      mealId: dishIdR.value,
    })
    toastMessage.value = 'Блюдо удалено!'
    toastType.value = 'success'
  } catch (error) {
    console.error('Ошибка удаления блюда:', error)
    toastMessage.value = 'Ошибка при удалении блюда.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => (toastMessage.value = ''), 3000)
  }
}
</script>

<style scoped>
.dish-modal {
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
  flex-direction: column;
  align-items: center;
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
