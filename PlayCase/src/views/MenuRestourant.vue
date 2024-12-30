<template>
  <div class="menu-page">
    <h1>Меню ресторана</h1>
    <div class="category-filters">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="filterByCategory(category.id)"
        :class="{ active: selectedCategoryId === category.id }"
      >
        {{ category.name }}
      </button>
      <button
        @click="clearFilter"
        :class="{ active: selectedCategoryId === null }"
      >
        Все
      </button>
    </div>

    <div class="meals-grid">
      <div
        class="meal-card"
        v-for="meal in filteredMenuItems"
        :key="meal.id"
      >
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const categories = ref([]);
const meals = ref([]);
const selectedCategoryId = ref(null);

const fetchMenu = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/place/current/menu`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    categories.value = response.data.mealCategories;
    console.log('Категории:', categories.value.map((category) => ({
      id: category.id,
      name: category.name,
    })));

    meals.value = response.data.mealCategories.flatMap((category) =>
      category.meals.map((meal) => {
        const mealWithCategory = {
          id: meal.id,
          name: meal.name,
          description: meal.description,
          categoryId: meal.categoryId,
          price: meal.price,
          image: meal.fileUrl,
        };
        console.log(`Блюдо: ${mealWithCategory.name}, Category ID: ${mealWithCategory.categoryId}`);
        return mealWithCategory;
      })
    );
  } catch (error) {
    console.error('Ошибка при получении меню:', error);
    store.dispatch('notification/showNotification', {
      type: 'error',
      message: 'Ошибка при загрузке меню. Попробуйте позже.',
    });
  }
};

const filteredMenuItems = computed(() => {
  if (selectedCategoryId.value !== null) {
    console.log(`Фильтруем блюда по категории ID: ${selectedCategoryId.value}`);
    return meals.value.filter((meal) => meal.categoryId === selectedCategoryId.value);
  }
  console.log('Показываем все блюда');
  return meals.value;
});

const filterByCategory = (categoryId) => {
  selectedCategoryId.value = categoryId;
  console.log(`Выбрана категория ID: ${categoryId}`);
};

const clearFilter = () => {
  selectedCategoryId.value = null;
  console.log('Сброс фильтра, показываем все категории');
};

onMounted(() => {
  fetchMenu();
});
</script>


<style scoped>
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

.meals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;
}

.meal-card {
  background-color: #ffffff;
  color: #333;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: left;
  width: 100%;
  max-width: 250px;
  transition: transform 0.3s;
}

.meal-card:hover {
  transform: translateY(-5px);
}

.meal-image {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.meal-info {
  margin-top: 10px;
}

.meal-price {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #4caf50;
}

.meal-name {
  font-size: 16px;
  margin: 5px 0;
}

.meal-description {
  font-size: 14px;
  color: #666;
}
</style>
