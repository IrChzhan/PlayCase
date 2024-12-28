<template>
  <div class="admin-places">
    <h1>Категории</h1>
    <div class="places-list">
      <div
        @click.stop="goToMenu(category.id)"
        class="place-card"
        v-for="category in categories"
        :key="category.id"
      >
        <h2>{{ category.name }}</h2>
        <button class="button" @click.stop="openModalEditCategory(category.id, placeId)">
          Редактировать
        </button>
      </div>
    </div>
  </div>
  <AdminEditCategoryModal
    :show="showModalAdminEditCategory"
    :closeModal="closeModalEditCategory"
    :categoryId="categoryId"
    :placeIdF="placeIdForEdit"
  />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import AdminEditCategoryModal from '@/admin/Place/AdminEditCategoryModal.vue'
import router from '@/router/index.js'

const route = useRoute()
const store = useStore()
const placeId = route.params.id
const showModalAdminEditCategory = ref(false)
const categoryId = ref('')
const placeIdForEdit = ref('')

const openModalEditCategory = (id, placeId) => {
  showModalAdminEditCategory.value = true
  categoryId.value = id
  placeIdForEdit.value = placeId
}

const closeModalEditCategory = () => {
  showModalAdminEditCategory.value = false
  categoryId.value = ''
}

const categories = computed(() => store.getters['places/categoriesByPlace'](placeId))

const fetchCategories = () => {
  store.dispatch('places/fetchCategories', placeId)
}

const goToMenu = (category) => {
  router.push(`/admin/place/${placeId}/category/${category}`)
}
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.admin-places {
  background-color: #1b2a46;
  color: white;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1,
h2 {
  margin-bottom: 20px;
  color: #ffffff;
  text-align: center;
}

.places-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 40px;
}

.place-card {
  min-width: 200px;
  background: #27364f;
  border: 1px solid #394a6a;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.place-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.place-card h2 {
  margin: 0;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
}

.button {
  display: block;
  margin: 10px auto 0;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #4caf50;
  color: white;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s;
}

.button:hover {
  background: #45a049;
}
</style>
