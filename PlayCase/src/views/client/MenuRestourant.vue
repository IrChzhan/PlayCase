<template>
  <div class="container">
    <div class="menu-page">
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
    store.dispatch('notification/showNotification', {
      type: 'error',
      message: 'Ошибка при загрузке меню. Попробуйте позже.',
    })
  }
}

const filteredMenuItems = computed(() => {
  if (selectedCategoryName.value !== null) {
    console.log(`Фильтруем блюда по категории: ${selectedCategoryName.value}`)
    return meals.value.filter((meal) => meal.categoryName === selectedCategoryName.value)
  }
  console.log('Показываем все блюда')
  return meals.value
})

const filterByCategory = (categoryName) => {
  selectedCategoryName.value = categoryName
  console.log(`Выбрана категория: ${categoryName}`)
}

const clearFilter = () => {
  selectedCategoryName.value = null
  console.log('Сброс фильтра, показываем все категории')
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
}

.menu-page {
  padding: 20px;
  background-color: #1c2742;
  color: #fff;
  font-family: 'Arial', sans-serif;
  text-align: center;
}

h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

.category-filters {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
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
  margin: 0 auto;
  position: absolute;
  bottom: 20px;
  cursor: pointer;
}

.meals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
}

.meal-card {
  background-color: #ffffff;
  color: #333;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: left;
  width: 208px;
  height: 208px;
  transition: transform 0.3s;
}

.meal-card:hover {
  transform: translateY(-5px);
}

.meal-image {
  width: 100%;
  height: 150px;
  border-radius: 10px;
  object-fit: contain;
}

.meal-info {
  margin-top: 10px;
}

.meal-price {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #CC9F33;

}

.meal-name {
  font-size: 16px;
  margin: 5px 0;
}

.meal-description {
  font-size: 14px;
  color: #666;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
