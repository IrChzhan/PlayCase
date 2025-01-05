<template>
  <div class="add-place">
    <h1>Добавить новое место</h1>
    <form @submit.prevent="addPlace" class="form">
      <div class="form-group">
        <label for="name">Название:</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="Введите название"
          class="input"
          required
        />
      </div>
      <div class="form-group">
        <label for="address">Адрес:</label>
        <input
          id="address"
          v-model="address"
          type="text"
          placeholder="Введите адрес"
          class="input"
          required
        />
      </div>
      <div class="form-actions">
        <button class="button primary" type="submit" :disabled="!isFormValid || loading">
          <Loader v-if="loading" /> Добавить заведение
        </button>
        <button class="button secondary" type="button" @click="goBack">Назад</button>
      </div>
    </form>
  </div>

  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Loader from '@/admin/Loader.vue'
import Notification from '@/admin/Notification.vue'

const store = useStore()
const router = useRouter()

const name = ref('')
const address = ref('')
const loading = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const isFormValid = computed(() => name.value.trim() !== '' && address.value.trim() !== '')

const addPlace = async () => {
  if (isFormValid.value) {
    try {
      loading.value = true
      await store.dispatch('places/createPlace', {
        name: name.value,
        address: address.value,
      })

      name.value = ''
      address.value = ''

      toastMessage.value = 'Место успешно добавлено!'
      toastType.value = 'success'

      setTimeout(() => {
        toastMessage.value = ''
        fetchPlaces()
      }, 1000)
    } catch (error) {
      console.error('Ошибка добавления места:', error)

      toastMessage.value = 'Ошибка при добавлении места.'
      toastType.value = 'error'

      setTimeout(() => {
        toastMessage.value = ''
      }, 1000)
    } finally {
      loading.value = false
    }
  }
}

const fetchPlaces = async () => {
  await store.dispatch('places/fetchPlaces')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.add-place {
  padding: 20px;
}
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
  background-color: #CC9F33;
}

button[type='submit']:hover {
  background-color: #d1aa58;
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
