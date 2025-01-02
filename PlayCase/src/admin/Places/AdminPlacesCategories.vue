<template>
  <div class="layout">
    <div class="navbar">
      <div class="add-category">
        <button class="add-category-button" @click="openModalAdminAddCategory">Редактировать заведение</button>
      </div>
      <div class="list" ref="listContainer">
        <template v-if="categories && categories.length > 0">
          <div
            v-for="(category, index) in categories"
            :key="category.id"
            class="category-card"
            :class="{ highlighted: category.id === selectedCategoryId }"
            @click="selectCategory(category.id)"
          >
            <h2>{{ category.name }}</h2>
          </div>
        </template>
        <template v-else>
          <p class="no-categories-message">Пока категорий нет</p>
        </template>
      </div>
      <button class="add-category-button" @click="openModalAdminAddCategory">Создать категорию</button>
    </div>
    <div class="content">
      <router-view :key="selectedCategoryId"></router-view>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'
import { useStore } from 'vuex'
import {useRoute} from "vue-router";
import router from "@/router/index.js";

const route = useRoute()
const store = useStore()
const categories = ref([])
const selectedCategoryId = ref(null)

const fetchCategories = async () => {
  await store.dispatch('places/fetchCategories', route.params.id)
  categories.value = store.getters['places/categoriesByPlace'](route.params.id)
  if (categories.value.length > 0) {
    selectedCategoryId.value = categories.value[0].id
  }
}

const selectCategory = (id) => {
  selectedCategoryId.value = id
  router.push(`/admin/places/categories/${route.params.id}/menu/${id}`)
}

const openModalAdminAddCategory = () => {
  router.push(`/admin/places/changePlace/${route.params.id}`)
}

watch(selectedCategoryId, (newId) => {
  if (newId) {
    router.push(`/admin/places/categories/${route.params.id}/menu/${newId}`)
  }
})

onMounted(fetchCategories)
</script>

<style scoped>
.layout {
  display: flex;
  background-color: #ffffff;
  height: 100%;
}

.navbar {
  width: 220px;
  background-color: #f9f9f9;
  border-right: 1px solid #e0e0e0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.add-category {
  margin-bottom: 20px;
  text-align: center;
}

.add-category-button {
  background-color: #1abc9c;
  color: #ffffff;
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-category-button:hover {
  background-color: #16a085;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 90vh;
  overflow-y: auto;
  padding-right: 10px;
}

.category-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s, transform 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.category-card h2 {
  margin: 0;
  font-size: 18px;
  color: #34495e;
}

.no-categories-message {
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
  margin-top: 20px;
}

.highlighted {
  background-color: #e0f7fa;
  border-color: #1abc9c;
}

.content {
  flex: 1;
  padding: 0 20px;
  background-color: #ffffff;
  height: 100%;
}
</style>
