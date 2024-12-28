<template>
  <div class="category-modal" v-if="show" @click.self="closeModal">
    <div class="container">
      <h1>Редактировать категорию</h1>
      <form @submit.prevent="showUpdateDialog" class="form">
        <div class="form-group">
          <label for="name">Название категории:</label>
          <div class="hint">Старое название: {{ oldName }}</div>
          <input id="name" v-model="categoryName" type="text" class="input" required />
        </div>
        <button
          type="button"
          class="button primary"
          :disabled="!hasChanges || loading"
          :class="{ disabled: !hasChanges || loading }"
          @click="showUpdateDialog(categoryId, placeIdF)()"
        >
          <Loader v-if="loading" /> Сохранить изменения
        </button>
      </form>

      <button
        @click="showDeleteDialog(categoryId, placeIdF)()"
        class="button danger"
        :disabled="loading"
        :class="{ disabled: loading }"
      >
        <Loader v-if="loading" /> Удалить категорию
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'

import ConfirmDialog from '../ConfirmDialog.vue'
import Loader from '../Loader.vue'

defineProps({
  show: Boolean,
  closeModal: Function,
  categoryId: String,
  placeIdF: String,
})

const store = useStore()
const route = useRoute()

const loading = ref(false)
const categoryName = ref('')
const oldName = ref('')
const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const toastMessage = ref('')
const toastType = ref('success')
let dialogAction = null
const placeId = ref('')
const categoryIdR = ref('')

const hasChanges = computed(() => categoryName.value !== oldName.value)

const showUpdateDialog = (categoryId, placeIdF) => () => {
  dialogTitle.value = 'Подтверждение обновления'
  dialogMessage.value = 'Вы уверены, что хотите сохранить изменения?'
  categoryIdR.value = categoryId
  placeId.value = placeIdF
  dialogAction = updateCategory
  showDialog.value = true
}

const showDeleteDialog = (categoryId, placeIdF) => () => {
  dialogTitle.value = 'Подтверждение удаления'
  dialogMessage.value = 'Вы уверены, что хотите удалить эту категорию?'
  categoryIdR.value = categoryId
  placeId.value = placeIdF
  dialogAction = deleteCategory
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

const updateCategory = async () => {
  try {
    loading.value = true
    await store.dispatch('places/updateCategory', {
      placeId: placeId.value,
      categoryId: categoryIdR.value,
      categoryData: { name: categoryName.value },
    })
    toastMessage.value = 'Категория успешно обновлена!'
    toastType.value = 'success'
  } catch (error) {
    console.error('Ошибка обновления категории:', error)
    toastMessage.value = 'Ошибка при обновлении категории.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => (toastMessage.value = ''), 3000)
  }
}

const deleteCategory = async () => {
  try {
    loading.value = true
    await store.dispatch('places/deleteCategory', {
      placeId: placeId.value,
      categoryId: categoryIdR.value,
    })
    toastMessage.value = 'Категория удалена!'
    toastType.value = 'success'
  } catch (error) {
    console.error('Ошибка удаления категории:', error)
    toastMessage.value = 'Ошибка при удалении категории.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => (toastMessage.value = ''), 3000)
  }
}
</script>

<style scoped>
.category-modal {
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
