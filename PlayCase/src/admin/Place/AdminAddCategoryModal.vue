<template>
  <div class="place-page-modal" v-if="show" @click.self="closeModal">
    <div class="container">
      <h1>Добавить Категорию</h1>
      <form @submit.prevent="handleAddCategory" class="form">
        <div class="form-group">
          <label for="categoryName">Название категории:</label>
          <input id="categoryName" v-model="categoryName" type="text" class="input" required />
        </div>
        <button
          type="submit"
          class="button primary"
          :disabled="loading || !categoryName"
          :class="{ disabled: loading || !categoryName }"
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
import Loader from '../Loader.vue'
import Notification from '@/admin/Notification.vue'

const store = useStore()
const route = useRoute()

const categoryName = ref('')
const loading = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const handleAddCategory = async () => {
  try {
    loading.value = true
    await store.dispatch('places/addCategory', {
      placeId: route.params.id,
      categoryData: { name: categoryName.value },
    })
    toastMessage.value = 'Категория успешно добавлена!'
    toastType.value = 'success'
    categoryName.value = ''
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Ошибка при добавлении категории:', error)
    toastMessage.value = 'Ошибка при добавлении категории.'
    toastType.value = 'error'
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  } finally {
    loading.value = false
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
