<template>
  <div class="place-page">
    <h1>Редактировать место</h1>
    <form @submit.prevent="showUpdateDialog" class="form">
      <div class="form-group">
        <small>Старое название: {{ oldName }}</small>
        <label for="name">Название:</label>
        <input id="name" v-model="placeName" type="text" placeholder="Введите новое название" required />
      </div>

      <div class="form-group">
        <small>Старый адрес: {{ oldAddress }}</small>
        <label for="address">Адрес:</label>
        <input id="address" v-model="placeAddress" type="text" placeholder="Введите новый адрес" required />
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="button primary"
          :disabled="!hasChanges || loading"
        >
          <Loader v-if="loading" /> Сохранить изменения
        </button>
        <button type="button" @click="showDeleteDialog" class="button danger">
          <Loader v-if="loading" /> Удалить место
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
import Notification from '@/admin/Notification.vue'

defineProps({
  show: Boolean,
  closeModal: Function,
})

import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import ConfirmDialog from '../ConfirmDialog.vue'
import Loader from '../Loader.vue'
import router from "@/router/index.js";

const store = useStore()
const route = useRoute()

const loading = ref(false)
const placeId = route.params.id
const placeName = ref('')
const placeAddress = ref('')
const oldName = ref('')
const oldAddress = ref('')
const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const toastMessage = ref('')
const toastType = ref('success')
let dialogAction = null

const fetchPlace = async () => {
  const place = store.state.places.places.find((place) => place.id === placeId)
  if (place) {
    placeName.value = place.name
    placeAddress.value = place.address
    oldName.value = place.name
    oldAddress.value = place.address
  } else {
    await store.dispatch('places/fetchPlace', placeId)
  }
}

const hasChanges = computed(() => {
  return placeName.value !== oldName.value || placeAddress.value !== oldAddress.value
})

const showUpdateDialog = () => {
  dialogTitle.value = 'Подтверждение обновления'
  dialogMessage.value = 'Вы уверены, что хотите сохранить изменения?'
  dialogAction = updatePlace
  showDialog.value = true
}

const showDeleteDialog = () => {
  dialogTitle.value = 'Подтверждение удаления'
  dialogMessage.value = 'Вы уверены, что хотите удалить это место?'
  dialogAction = deletePlace
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

const updatePlace = async () => {
  try {
    loading.value = true
    await store.dispatch('places/updatePlace', {
      id: placeId,
      name: placeName.value,
      address: placeAddress.value,
    })
    toastMessage.value = 'Место успешно обновлено!'
    toastType.value = 'success'
    setTimeout(() => {
      toastMessage.value = ''
      router.push(`/admin/places`)
    }, 3000)
  } catch (error) {
    console.error('Ошибка обновления места:', error)
    toastMessage.value = 'Ошибка при обновлении места.'
    toastType.value = 'error'
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  } finally {
    loading.value = false
  }
}

const deletePlace = async () => {
  try {
    loading.value = true
    await store.dispatch('places/deletePlace', placeId)
    toastMessage.value = 'Место удалено!'
    toastType.value = 'success'
    setTimeout(() => {
      toastMessage.value = ''
      router.push(`/admin/places`)
    }, 3000)
  } catch (error) {
    console.error('Ошибка удаления места:', error)
    toastMessage.value = 'Ошибка при удалении места.'
    toastType.value = 'error'
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPlace)
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
  background-color: #4285f4;
}

button.primary:hover:not([disabled]) {
  background-color: #357ae8;
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
</style>
