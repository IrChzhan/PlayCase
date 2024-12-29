<template>
  <div class="container">
    <h1 class="menu_name">Меню ресторана</h1>
    <div class="menu">
      <div
        v-for="category in categories"
        :key="category"
        class="category"
        :class="{ active: selectedCategory === category }"
        @click="selectCategory(category)"
      >
        {{ category }}
      </div>
    </div>
    <div class="products" ref="productList">
      <ProductCard
        v-for="item in filteredMenuItems"
        :key="item.name"
        :image="item.image"
        :price="item.price"
        :name="item.name"
        :description="item.description"
      />
    </div>
    <img src="../assets/House_01.png" class="house-image" width="80" @click="goToMenuApp" alt="g" />
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

import router from '@/router/index.js'

import ProductCard from './ProductCard.vue'

const selectedCategory = ref('Все')
const categories = ref([])
const menuItems = ref([])
const loading = ref(false)

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/admin/v1/places/{placeId}/categories`,
    )
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

const fetchMenuItems = async () => {
  loading.value = true
  try {
    const response = await axios.get(
      `https://example.com/api/menu?category=${selectedCategory.value}`,
    ) // Получаем блюда для выбранной категории
    menuItems.value = response.data // Заполняем список блюд
  } catch (error) {
    console.error('Error fetching menu items:', error)
  } finally {
    loading.value = false
  }
}

const filteredMenuItems = computed(() => {
  return menuItems.value
})

const selectCategory = (category) => {
  selectedCategory.value = category
  fetchMenuItems()
}

onMounted(() => {
  fetchCategories()
})

const goToMenuApp = () => {
  router.push({ name: 'MenuApp' })
}
</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.menu {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-left: 16px;
  width: 95%;
  margin-top: 25px;
  font-family: 'Mulish', sans-serif;
}

.category {
  background-color: white;
  color: black;
  padding: 10px 17px;
  margin: 0px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.category:hover {
  background-color: #f0f0f0;
}

.active {
  background-color: orange;
  color: white;
}

.menu_name {
  color: white;
  font-family: 'Mulish', sans-serif;
  font-size: 40px;
  font-weight: 700;
  margin-top: 30px;
  margin-left: 15px;
}

.products {
  margin-top: 20px;
  margin-left: 5px;
  margin-right: 15px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.house-image {
  margin-left: 585px;
  width: 50px;
  margin-bottom: 5px;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .menu {
    flex-direction: row;
  }

  .products {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  h1 {
    font-size: 32px;
  }

  .category {
    padding: 10px 5px;
  }
}
</style>
