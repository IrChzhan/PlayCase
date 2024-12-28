<template>
  <div class="menu">
    <h1>Меню заведений</h1>

    <div class="meals-list">
      <div class="meal-card" v-for="meal in meals" :key="meal.id">
        <img :src="meal.fileUrl" alt="Фото блюда" class="meal-image" />
        <h2>{{ meal.name }}</h2>
        <p>{{ meal.price }}</p>
        <p>{{ meal.description }}</p>
        <button class="button" @click="openEditModal(meal.id)">Редактировать</button>
      </div>
    </div>

    <button class="button add-button" @click="openAddModal">Добавить новое блюдо</button>

    <AdminEditMealModal
      :show="showEditModal"
      :dishId="editingMealId"
      :closeModal="closeEditModal"
    />

    <AdminAddMealModal :show="showAddModal" :closeModal="closeAddModal" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import AdminAddMealModal from './AdminAddMealModal.vue'
import AdminEditMealModal from './AdminEditMealModal.vue'

const route = useRoute()
const store = useStore()
const showEditModal = ref(false)
const showAddModal = ref(false)
const editingMealId = ref(null)
const placeId = route.params.id
const categoryId = route.params.categoryId

const meals = computed(() => store.getters['places/mealsByCategory'](categoryId))

const fetchMeals = async () => {
  await store.dispatch('places/fetchMeals', { placeId: placeId, categoryId: categoryId })
}

const openEditModal = (mealId) => {
  editingMealId.value = mealId
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingMealId.value = null
}

const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

onMounted(() => {
  fetchMeals()
})
</script>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  background-color: #1b2a46;
  color: white;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
  color: #ffffff;
}

.meals-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.meal-card {
  background: #27364f;
  border: 1px solid #394a6a;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  text-align: center;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.meal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.meal-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.meal-card h2 {
  margin: 10px 0;
  font-size: 18px;
  color: #ffffff;
}

.meal-card p {
  font-size: 14px;
  color: #b0b0b0;
}

.button {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.button:hover {
  background: #45a049;
}

.add-button {
  margin: 0 auto;
  max-width: 300px;
  margin-top: 50px;
  background-color: #008cba;
}

.add-button:hover {
  background-color: #007bb5;
}
</style>
