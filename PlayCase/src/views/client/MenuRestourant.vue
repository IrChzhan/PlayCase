<template>
  <div class="container" :class="{ 'blur-background': showMealModal }">
    <div class="menu-page">
      <div class="header sticky-header">
        <div class="header-content">
          <h1 class="menu_title">Меню</h1>
          <div class="category_scroll">
            <img
              src="@/assets/narrow_menu_left.png"
              class="scroll-arrow left"
              :class="{ disabled: isScrollLeftDisabled }"
              @click="scrollOneCategory(-1)"
            />
            <div class="category-filters-wrapper" ref="categoryFiltersWrapper">
              <div class="category-filters" ref="categoryFilters" @scroll="handleScroll">
                <button @click="clearFilter" :class="{ active: selectedCategoryName === null }">
                  Все
                </button>
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="filterByCategory(category.name)"
                  :class="{ active: selectedCategoryName === category.name }"
                  ref="categoryButtons"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>
            <img
              src="@/assets/narrow-menu_right.png"
              class="scroll-arrow right"
              :class="{ disabled: isScrollRightDisabled }"
              @click="scrollOneCategory(1)"
            />
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
              <h2 class="meal-name">{{ decodeHtmlEntities(meal.name) }}</h2>
              <p class="meal-price">{{ decodeHtmlEntities(meal.price) }} ₽</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showMealModal" class="modal-overlay" @click.self="closeMealModal">
      <div class="modal-content">
        <button class="close-button" @click="closeMealModal">×</button>
        <img :src="currentMeal.image || '/assets/default-image.png'" alt="Блюдо" class="meal-modal-image" />
        <h2 class="meal-modal-name">{{ decodeHtmlEntities(currentMeal.name) }}</h2>
        <p class="meal-modal-description">{{ decodeHtmlEntities(currentMeal.description) }}</p>
        <p class="meal-modal-price">{{ decodeHtmlEntities(currentMeal.price) }} ₽</p>
      </div>
    </div>
    <div class="home-button-container">
      <img src="@/assets/House_5.svg" alt="Домой" class="home-button" @click="goToMenuApp" />
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const categories = ref([]);
const meals = ref([]);
const selectedCategoryName = ref(null);
const categoryFilters = ref(null);
const categoryFiltersWrapper = ref(null);
const isScrollLeftDisabled = ref(true);
const isScrollRightDisabled = ref(true); 
const categoryButtons = ref([]);

const showMealModal = ref(false);
const currentMeal = ref({});

const decodeHtmlEntities = (text) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

const fetchMenu = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/place/current/menu`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    categories.value = response.data.mealCategories.map((category) => ({
      id: category.id,
      name: category.name,
    }));

    meals.value = response.data.mealCategories.flatMap((category) =>
      category.meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        description: meal.description,
        categoryName: category.name,
        price: meal.price,
        image: meal.fileUrl,
      }))
    );
  } catch (error) {
    console.error('Ошибка при получении меню:', error);
  }
};

const filteredMenuItems = computed(() => {
  return selectedCategoryName.value
    ? meals.value.filter((meal) => meal.categoryName === selectedCategoryName.value)
    : meals.value;
});

const filterByCategory = (categoryName) => {
  selectedCategoryName.value = categoryName;
};

const clearFilter = () => {
  selectedCategoryName.value = null;
};

const openMealModal = (meal) => {
  currentMeal.value = meal;
  showMealModal.value = true;
};

const closeMealModal = () => {
  showMealModal.value = false;
};

const goToMenuApp = () => {
  router.push('/client/menu-app');
};
const scrollOneCategory = async (direction) => {
  if (categoryFilters.value && categoryButtons.value.length > 0) {
    await nextTick();
    const buttonWidth = categoryButtons.value[0].offsetWidth;
    const scrollAmount = direction * buttonWidth;
    categoryFilters.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

const handleScroll = () => {
  if (categoryFilters.value) {
    const { scrollLeft, scrollWidth, clientWidth } = categoryFilters.value;
    isScrollLeftDisabled.value = scrollLeft === 0;
    isScrollRightDisabled.value = scrollLeft + clientWidth >= scrollWidth - 1;
  }
};

const setCategoryWrapperWidth = async () => {
  if (categoryFiltersWrapper.value && categoryButtons.value.length > 0) {
    await nextTick();
    const buttonWidth = categoryButtons.value[0].offsetWidth;
    const visibleButtonsWidth = buttonWidth * 5; 
    categoryFiltersWrapper.value.style.maxWidth = `${visibleButtonsWidth}px`;
  }
};


onMounted(() => {
  fetchMenu();
  if (categoryFilters.value) {
    categoryFilters.value.addEventListener('scroll', handleScroll);
  }

  setCategoryWrapperWidth();
  window.addEventListener('resize', setCategoryWrapperWidth);
  nextTick(() => {
    handleScroll(); 
  });

});
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100%;
  font-family: 'Arial', sans-serif;
  background: url('@/assets/background.jpg') no-repeat center center/cover;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.menu_title {
  margin-left: 145px;
  font-family: 'Mulish', sans-serif;
  font-weight: 700;
  font-size: 44px;
  margin-top: 5px;
}

.menu-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url('@/assets/background.jpg') no-repeat center center/cover;
  color: #fff;
  font-family: 'Arial', sans-serif;
  text-align: center;
  height: 100%;
  overflow: hidden;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 5;
  width: 100%;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category_scroll {
  display: flex;
  margin-left: 15px;
  gap: 0px;
  align-items: center;
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

.category-filters-wrapper {
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-grow: 1;
  transition: max-width 0.3s ease;
   max-width: 1300px; 
}

.category-filters {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  gap: 15px;
  margin-top: 10px;
  padding: 0 15px;
}

.scroll-arrow {
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-left: 0px;
  margin-right: 0px;
  transition: opacity 0.3s;
}

.left {
  margin-right: 10px;
}

.right {
  margin-left: 10px;
}

h1 {
  font-size: 24px;
  margin: 0;
  flex-shrink: 0;
}

.category-filters::-webkit-scrollbar {
  height: 8px;
}

.category-filters::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 4px;
}

.category-filters::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 4px;
}

.category-filters button {
  padding: 50px 29px;
  border: none;
  border-radius: 20px;
  background-color: #f4f4f4;
  color: #333;
  cursor: pointer;
  font-weight: 400;
  transition: all 0.3s;
  white-space: nowrap;
  font-size: 20px;
}

.category-filters button.active {
  background-color: #C59216;
  color: white;
}

.category-filters button:hover {
  background-color: #C59216;
}

.meals-scrollable {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  z-index: 5;
}

.meals-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px; 
  padding: 10px 180px; 
  margin-top: 20px;
  margin-left: -25px;
}

.meal-card {
  background-color: #ffffff;
  color: #333;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: left;
  width: 270px;
  height: 390px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s;
  font-family: 'Mulish', sans-serif;
}

.meal-card:hover {
  transform: translateY(-5px);
}

.meal-image {
  border-radius: 15px;
  height: 230px;
  width: 250px;
  margin-left: 9px;
  margin-top: 5px;
}

.meal-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  margin-left: 22px;
}

.meal-price {
  font-size: 31px;
  font-weight: bold;
  margin-top: auto; 
  color: #CC9F33;
}

.meal-name {
  font-size: 26px;
  font-weight: 600;
  margin-top: 15px;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  display: -webkit-box;
  -webkit-box-orient: vertical; 
  overflow: hidden;
}

.meal-description {
  font-size: 14px;
  color: #666;
  height: 50px;
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
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 800;
  font-family: 'Mulish', sans-serif;
}

.meals-scrollable::-webkit-scrollbar {
  width: 6px;
}

.meals-scrollable::-webkit-scrollbar-thumb {
  background-color: #1B2A46;
  border-radius: 3px;
}

.meals-scrollable::-webkit-scrollbar-track {
  background-color: #1B2A46;
  border-radius: 3px;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 7px;
  width: 80%;
  max-width: 800px;
  height: 778px;
  text-align: left;
  position: relative;
  margin-left: 20px;
  box-shadow: 0 0 4px rgba(234, 233, 232, 0.894);
  transition: box-shadow 0.01s ease;
}

.close-button {
  position: absolute;
  top: 2px;
  right: 15px;
  background: none;
  border: none;
  font-size: 60px;
  cursor: pointer;
  color: white;
}

.meal-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.meal-modal-image {
  width: 100%;
  height: 500px;
  border-radius: 10px;
  margin-bottom: 20px;
  object-fit: cover;
}

.meal-modal-description {
  font-size: 20px;
  font-weight: 400;
  color: #000000;
  margin-bottom: 10px;
  margin-top: 30px;
  margin-left: 35px;
}

.meal-modal-price {
  font-size: 32px;
  font-weight: 800;
  color: #C59216;
  margin-bottom: auto;
  margin-top: 55px;
  margin-left: 35px;
}

.meal-modal-name {
  font-size: 33px;
  font-weight: 800;
  color: #0F1921;
  margin-bottom: 10px;
  margin-left: 35px;
  margin-top: 20px;
}

.home-button-container {
  position: sticky;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  z-index: 10;
  height: 135px;
}

.home-button {
  width: 90px;
  height: 90px;
  cursor: pointer;
  margin-bottom: 25px;
}

.scroll-arrow {
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-left: 20px;
  transition: opacity 0.3s;
}

.scroll-arrow.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.left {
  margin-left: 40px;
}

.right {
  margin-left: 10px;
}

.category-filters button.active {
  background-color: #C59216;
  color: white;
}

.category-filters button {
  padding: 15px 29px;
  border: none;
  border-radius: 10px;
  background-color: #f4f4f4;
  color: #333;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  white-space: nowrap;
  font-size: 28px;
}

.category-filters button.active {
  background-color: #C59216;
  color: white;
}

.category-filters button:hover {
  background-color: #C59216;
}
</style>