<template>
  <div class="container">
    <div class="menu-page">
      <!-- Существующая структура -->
      <div class="header sticky-header">
        <div class="header-content">
          <h1>Меню ресторана</h1>
          <div class="category-filters">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="filterByCategory(category.name)"
              :class="{ active: selectedCategoryName === category.name }"
            >
              {{ category.name }}
            </button>
            <button @click="clearFilter" :class="{ active: selectedCategoryName === null }">Все</button>
          </div>
        </div>
      </div>

      <div class="meals-scrollable">
        <div class="meals-grid">
          <div
            class="meal-card"
            v-for="meal in filteredMenuItems"
            :key="meal.id"
            @click="openMealModal(meal)"
          >
            <img
              :src="meal.image || '/assets/default-image.png'"
              alt="Изображение блюда"
              class="meal-image"
            />
            <div class="meal-info">
              <p class="meal-price">{{ meal.price }} ₽</p>
              <h2 class="meal-name">{{ meal.name }}</h2>
            </div>
          </div>
        </div>
      </div>

      <img src="../../assets/house_light.png" class="home-button" @click="goToMenuApp" />

      <div class="modal-overlay" v-if="showMealModal">
        <div class="modal-content">
          <button class="close-button" @click="closeMealModal">&times;</button>
          <div class="meal-details">
            <img :src="currentMeal.image || '/assets/default-image.png'" alt="Изображение блюда" class="meal-modal-image" />
            <p class="meal-modal-name">{{ currentMeal.name }}</p>
            <p class="meal-modal-description">{{ currentMeal.description }}</p>
            <p class="meal-modal-price">{{ currentMeal.price }} ₽</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const categories = ref([])
const meals = ref([])
const selectedCategoryName = ref(null)

const showMealModal = ref(false);
const currentMeal = ref({});

const goToMenuApp = () => {
  router.push({ name: 'MenuApp' });
};
const fetchMenu = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/place/current/menu`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    categories.value = response.data.mealCategories.map((category) => ({
      id: category.id,
      name: category.name,
    }))

    meals.value = response.data.mealCategories.flatMap((category) =>
      category.meals.map((meal) => {
        return {
          id: meal.id,
          name: meal.name,
          description: meal.description,
          categoryName: category.name,
          price: meal.price,
          image: meal.fileUrl,
        }
      }),
    )
  } catch (error) {
    console.error('Ошибка при получении меню:', error)
  }
}

const filteredMenuItems = computed(() => {
  if (selectedCategoryName.value !== null) {
    return meals.value.filter((meal) => meal.categoryName === selectedCategoryName.value)
  }
  return meals.value
})

const filterByCategory = (categoryName) => {
  selectedCategoryName.value = categoryName
}

const clearFilter = () => {
  selectedCategoryName.value = null
}

const openMealModal = (meal) => {
  currentMeal.value = meal;
  showMealModal.value = true;
}

const closeMealModal = () => {
  showMealModal.value = false;
}

onMounted(() => {
  fetchMenu()
})
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100%;
  font-family: 'Arial', sans-serif;
  background: #1c2742;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.menu-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #1c2742; 
  color: #fff;
  font-family: 'Arial', sans-serif;
  text-align: center;
  height: 100%;
  overflow: hidden; 
}

.sticky-header {
  position: sticky;
  top: 0;
  background-color: #1c2742; 
  z-index: 5;
  width: 100%; 
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.header-content {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  align-items: center;
}

h1 {
  font-size: 24px;
  margin: 0;
  flex-shrink: 0;
}

.category-filters {
  display: flex;
  flex-wrap: nowrap; 
  overflow-x: auto; 
  max-width: 75vw; 
  box-sizing: border-box; 
  padding-bottom: 10px;
  gap: 10px;
}

.category-filters::-webkit-scrollbar {
  height: 8px; 
}

.category-filters::-webkit-scrollbar-thumb {
  background-color: #ffa726; 
  border-radius: 4px;
}

.category-filters::-webkit-scrollbar-track {
  background-color: #333; 
  border-radius: 4px;
}

.category-filters button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #f4f4f4;
  color: #333;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  white-space: nowrap;
}

.category-filters button.active {
  background-color: #ffa726;
  color: white;
}

.category-filters button:hover {
  background-color: #ffc107;
}

.home-button {
  width: 50px;
  height: 50px;
  margin: 20px auto;
  cursor: pointer;
}

.meals-scrollable {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.meals-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  justify-items: center;
  padding: 20px;
}

.meal-card {
  background-color: #ffffff;
  color: #333;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  text-align: left;
  width: 140px;
  height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s;
}


.meal-card:hover {
  transform: translateY(-5px);
}

.meal-image {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  object-fit: contain;
}

.meal-info {
  margin-top: 10px;
  flex-grow: 1;
}

.meal-price {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #CC9F33;
}

.meal-name {
  font-size: 14px;
  margin: 5px 0;
}

.meal-description {
  font-size: 12px;
  color: #666;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 800;
}

.meals-scrollable::-webkit-scrollbar {
  width: 6px; 
}

.meals-scrollable::-webkit-scrollbar-thumb {
  background-color: #ffa726;
  border-radius: 3px;
}

.meals-scrollable::-webkit-scrollbar-track {
  background-color: #333;
  border-radius: 3px;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 80%;
  max-width: 600px;
  text-align: center;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.meal-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.meal-modal-image {
  max-width: 40%;
  border-radius: 10px;
  margin-bottom: 20px;
}

.meal-modal-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
}

.meal-modal-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #cc9f33;
}

.meal-modal-name {
  font-size: 2rem;
  font-weight: bold;
  color: #666;
  margin-bottom: 10px;
}
</style>
