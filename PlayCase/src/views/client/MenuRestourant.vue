<template>
  <div class="container">
    <div class="menu-page">
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
          <div class="meal-card" v-for="meal in filteredMenuItems" :key="meal.id">
            <img
              :src="meal.image || '/assets/default-image.png'"
              alt="Изображение блюда"
              class="meal-image"
            />
            <div class="meal-info">
              <p class="meal-price">{{ meal.price }} ₽</p>
              <h2 class="meal-name">{{ meal.name }}</h2>
              <p class="meal-description">{{ meal.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <img src="../../assets/house_light.png" class="home-button" @click="goToMenuApp" />
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

onMounted(() => {
  fetchMenu()
})
</script>

<style scoped>
.container {
  height: 100vh;
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
}

.sticky-header {
  position: sticky;
  top: 0;
  background-color: #1c2742;
  z-index: 10;
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
  gap: 10px;
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
  grid-template-columns: repeat(4, 1fr);
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
  width: 180px;
  height: 240px;
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
</style>
