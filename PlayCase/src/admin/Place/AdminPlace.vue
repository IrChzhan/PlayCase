<template>
  <div class="place-page">
    <div class="container">
      <div class="header">
        <div class="info">
          <h1>{{ placeName }}</h1>
          <p>{{ placeAddress }}</p>
        </div>
        <button @click="openModalAdminPlace" class="button primary small info_button">
          Редактировать
        </button>
      </div>
    </div>
    <div class="container">
      <div class="menu-section">
        <h2>Меню заведения</h2>
        <button @click="openModalAdminAddCategory" class="button primary">
          Добавить категорию
        </button>
        <MenuList
          :categories="categories"
          @edit-category="editCategory"
          @delete-category="deleteCategory"
          @add-dish="showAddDishDialog"
          @edit-dish="editDish"
          @delete-dish="deleteDish"
        />
      </div>
    </div>

    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
  <AdminAddCategoryModal
    :show="showModalAdminAddCategory"
    :closeModal="closeModalAdminAddCategory"
  />
  <EditPlaceModal
    :show="showModalAdminPlace"
    :closeModal="closeModalAdminPlace"
  />
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'
import AdminAddCategoryModal from '@/admin/Place/AdminAddCategoryModal.vue'

import EditPlaceModal from './AdminEditPlaceModal.vue'
import MenuList from './AdminMenuList.vue'

const route = useRoute()
const store = useStore()

const place = computed(() => store.getters['places/findPlace'](placeId))
const placeName = computed(() => place.value?.name || '')
const placeAddress = computed(() => place.value?.address || '')
const placeId = route.params.id
const categories = ref([])
const showModalAdminPlace = ref(false)
const showModalAdminAddCategory = ref(false)

const toastMessage = ref('')
const toastType = ref('success')

const openModalAdminPlace = () => {
  showModalAdminPlace.value = true
}

const closeModalAdminPlace = () => {
  showModalAdminPlace.value = false
}

const openModalAdminAddCategory = () => {
  showModalAdminAddCategory.value = true
}

const closeModalAdminAddCategory = () => {
  showModalAdminAddCategory.value = false
}

const fetchPlace = async () => {
  const place = store.getters['places/findPlace'](placeId)
  if (place) {
    placeName.value = place.name
    placeAddress.value = place.address
    await fetchCategories()
  } else {
    await store.dispatch('places/fetchPlace', placeId)
    const place = store.getters['places/findPlace'](placeId)
    placeName.value = place.name
    placeAddress.value = place.address
    await fetchCategories()
  }
}

const fetchCategories = async () => {
  await store.dispatch('places/fetchCategories', placeId)
  categories.value = store.getters['places/categoriesByPlace'](placeId)
}

const editCategory = (category) => {
  category.name += ' (отредактировано)'
  showToast('Категория отредактирована', 'success')
}

const deleteCategory = (categoryId) => {
  categories.value = categories.value.filter((category) => category.id !== categoryId)
  showToast('Категория удалена', 'success')
}

const showAddDishDialog = (categoryId) => {
  const category = categories.value.find((cat) => cat.id === categoryId)
  if (category) {
    const newDish = { id: Date.now(), name: 'Новое блюдо', price: 100 }
    category.dishes.push(newDish)
    showToast('Блюдо добавлено', 'success')
  }
}

const editDish = (dish) => {
  dish.name += ' (отредактировано)'
  showToast('Блюдо отредактировано', 'success')
}

const deleteDish = (dishId) => {
  categories.value.forEach((category) => {
    category.dishes = category.dishes.filter((dish) => dish.id !== dishId)
  })
  showToast('Блюдо удалено', 'success')
}

const updatePlace = (newData) => {
  placeName.value = newData.name
  placeAddress.value = newData.address
  showToast('Данные места обновлены!', 'success')
}

const showToast = (message, type) => {
  toastMessage.value = message
  toastType.value = type
}


onMounted(fetchPlace)
</script>

<style scoped>
.place-page {
  background-color: #1b2a46;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  align-items: flex-start;
}

.container {
  width: 90%;
  max-width: 800px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  flex-direction: column;
  padding-bottom: 15px;
}

.info {
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.info_button {
  margin-top: 20px;
}

.header .info {
  text-align: left;
}

.header h1 {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.header p {
  font-size: 1rem;
  margin: 5px 0 0;
  color: #777;
}

.header button {
  background: linear-gradient(135deg, #4285f4, #357ae8);
  color: white;
  font-size: 1rem;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.header button:hover {
  background: linear-gradient(135deg, #357ae8, #2a65c1);
}

.menu-section {
  margin-top: 20px;
}

.menu-section h2 {
  font-size: 1.6rem;
  font-weight: bold;
  color: #1b2a46;
  margin-bottom: 20px;
}

.button.primary {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background: linear-gradient(135deg, #4caf50, #43a047);
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.button.primary:hover {
  background: linear-gradient(135deg, #43a047, #388e3c);
}

.small {
  padding: 8px 12px;
  font-size: 0.9rem;
}
</style>
