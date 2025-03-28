<template>
  <div class="place-page">
    <h1>Редактировать категорию</h1>
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
          <Loader v-if="loading" /> Сохранить изменения
        </button>
        <button class="button secondary" type="button" @click="goBack">Назад</button>
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
import {computed, onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'
import router from '@/router/index.js'

import ConfirmDialog from '../ConfirmDialog.vue'
import Loader from '../Loader.vue'

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
const hasChanges = computed(() => categoryName.value !== oldName.value)
let dialogAction = null

const showUpdateDialog = () => {
  dialogTitle.value = 'Подтверждение обновления'
  dialogMessage.value = 'Вы уверены, что хотите сохранить изменения?'
  dialogAction = updateCategory
  showDialog.value = true
}

const showDeleteDialog = () => {
  dialogTitle.value = 'Подтверждение удаления'
  dialogMessage.value = 'Вы уверены, что хотите удалить эту категорию?'
  dialogAction = deleteCategory
  showDialog.value = true
}

const handleConfirm = async () => {
  showDialog.value = false
  if (dialogAction) await dialogAction()
}

const handleCancel = () => {
  showDialog.value = false
}

const updateCategory = async () => {
  try {
    loading.value = true
    await store.dispatch('places/updateCategory', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
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
    setTimeout(() => {
      toastMessage.value = ''
      router.push(`/admin/places/categories/${route.params.id}/menu/${route.params.categoryId}`)
    }, 1000)
  }
}

const deleteCategory = async () => {
  try {
    loading.value = true
    await store.dispatch('places/deleteCategory', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
    })
    toastMessage.value = 'Категория удалена!'
    toastType.value = 'success'
  } catch (error) {
    console.error('Ошибка удаления категории:', error)
    toastMessage.value = 'Ошибка при удалении категории.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => {
      router.push(`/admin/places`)
      toastMessage.value = ''
    }, 1000)
  }
}
const goBack = () => {
  router.back()
}

const fetchCategories = async (placeId) => {
  const categories = await store.dispatch('places/fetchCategories', route.params.id)
  return categories
}

onMounted(async () => {
  const categories = await fetchCategories(route.params.id)
  const category = categories.find(el => el.id === route.params.categoryId)
  if (category) {
    oldName.value = category.name
    categoryName.value = category.name
  }
})
</script>

<style scoped>
.place-page {
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
  transition: border-color 0.3s ease,
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

button[type='button'] {
  background-color: #CC9F33;
}

button[type='button']:hover {
  background-color: #d1aa58;
}

.secondary {
  background-color: #6c757d;
}

.secondary:hover {
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

@media screen and (min-width: 2400px) and (min-height: 1400px) {
  .container {
    padding: 40px; 
  }

  h1 {
    font-size: 60px; 
    margin-bottom: 40px; 
  }

  .form-group {
    margin-bottom: 40px; 
  }

  small {
    font-size: 28px; 
    margin-bottom: 20px; 
  }

  label {
    font-size: 32px; 
    margin-bottom: 20px; 
  }

  input {
    padding: 20px; 
    font-size: 28px; 
    border-radius: 12px;
  }

  button {
    padding: 20px 40px; 
    font-size: 32px; 
    border-radius: 12px; 
  }

  .form-actions {
    gap: 20px; 
  }
}
</style>
