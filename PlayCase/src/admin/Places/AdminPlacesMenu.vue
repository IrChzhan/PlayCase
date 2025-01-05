<template>
  <div class="container">
    <div class="filters">
      <input type="text" placeholder="Поиск блюда..." v-model="searchQuery" @input="filterMeals" />
      <select v-model="mealsPerPage" @change="filterMeals">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="15">15</option>
      </select>
    </div>

    <table class="menu-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Название</th>
          <th>Описание</th>
          <th>Цена</th>
          <th>Фото</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(meal, index) in paginatedMeals" :key="meal.id">
          <td>{{ index + 1 + (currentPage - 1) * mealsPerPage }}</td>
          <td>{{ meal.name }}</td>
          <td>{{ meal.description }}</td>
          <td>{{ meal.price }}</td>
          <td><img :src="meal.fileUrl" alt="Фото" class="thumbnail" /></td>
          <td class="actions-column">
            <button @click.stop="editMeal(meal.id)" class="icon-setting"><IconsSetting/></button>
            <button @click.stop="showDeleteDialog(meal.id)" class="icon-setting"><IconDelete/></button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Назад</button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        Вперед
      </button>
    </div>

    <div class="add-meal">
      <button @click="addMeal">Добавить блюдо</button>
    </div>
  </div>
  <ConfirmDialog
    v-if="showDialog"
    :visible="showDialog"
    :title="dialogTitle"
    :message="dialogMessage"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import IconDelete from "@/components/icons/IconDelete.vue";
import IconsSetting from "@/components/icons/IconsSetting.vue";
import ConfirmDialog from "@/admin/ConfirmDialog.vue";
import Notification from "@/admin/Notification.vue";

const router = useRouter()
const route = useRoute()
const store = useStore()
const placeId = route.params.id

const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const toastMessage = ref('')
const toastType = ref('success')
const loading = ref(false)
let dialogAction = null
const handleConfirm = async () => {
  showDialog.value = false
  if (dialogAction) {
    await dialogAction()
  }
}

const deleteDish = (id) => async () => {
  try {
    loading.value = true
    await store.dispatch('places/deleteMeal', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
      mealId: id,
    })
    toastMessage.value = 'Блюдо удалено!'
    toastType.value = 'success'
  } catch (error) {
    console.error('Ошибка удаления блюда:', error)
    toastMessage.value = 'Ошибка при удалении блюда.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => {
      toastMessage.value = ''
      store
        .dispatch('places/fetchMeals', {
          placeId: route.params.id,
          categoryId: route.params.categoryId,
        })
        .then(() => {
          filteredMeals.value = meals.value
        })
    }, 1000)
  }
}
const goToChangeUser = (id) => {
  router.push(`/admin/places/changeCategory/${route.params.id}/${id}`)
}
const handleCancel = () => {
  showDialog.value = false
}
const showDeleteDialog = (id) => {
  dialogTitle.value = 'Подтверждение удаления'
  dialogMessage.value = 'Вы уверены, что хотите удалить это блюдо?'
  dialogAction = deleteDish(id)
  showDialog.value = true
}

const searchQuery = ref('')
const currentPage = ref(1)
const mealsPerPage = ref(5)
const showModalAdminEditMeal = ref(false)
const mealId = ref('')
const placeIdForEdit = ref('')

const meals = computed(() => store.getters['places/mealsByCategory'](route.params.categoryId))
const filteredMeals = ref([])

const paginatedMeals = computed(() => {
  const start = (currentPage.value - 1) * mealsPerPage.value
  const end = start + mealsPerPage.value
  return filteredMeals.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredMeals.value.length / mealsPerPage.value)
})

const filterMeals = () => {
  filteredMeals.value = meals.value.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
}

const changePage = (page) => {
  currentPage.value = page
}

const editMeal = (id) => {
  mealId.value = id
  placeIdForEdit.value = placeId
  router.push(`/admin/places/changeMeal/${route.params.id}/${route.params.categoryId}/${id}`)
}

const closeModalEditMeal = () => {
  showModalAdminEditMeal.value = false
  mealId.value = ''
}

const editCategory = () => {
  router.push(`/admin/places/changeCategory/${route.params.id}/${route.params.categoryId}`)
}

const addMeal = () => {
  router.push(`/admin/places/createMeal/${route.params.id}/${route.params.categoryId}`)
}

onMounted(() => {
  store
    .dispatch('places/fetchMeals', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
    })
    .then(() => {
      filteredMeals.value = meals.value
    })
})
</script>

<style scoped>
.actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.icon-setting {
  padding: 10px 0 ;
  background: none;
  border: none;
  cursor: pointer;
}
.icon-setting:hover {
  background: none;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters input {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filters select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.menu-table {
  width: 100%;
  border-collapse: collapse;
}

.menu-table th,
.menu-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.menu-table th {
  background-color: #f4f4f4;
}

.thumbnail {
  max-width: 50px;
  max-height: 50px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.add-meal {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #CC9F33;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background:#d1aa58 ;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.actions-column {
  text-align: center;
  border: none;
}

.actions-column .icon-setting {
  margin: 0 5px;
}

.menu-table th:last-child,
.menu-table td:last-child {
  text-align: center;
  border: none;
}

.menu-table th:last-child {
  background: transparent;
}
</style>
