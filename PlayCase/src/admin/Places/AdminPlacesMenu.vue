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
      <tbody ref="mealsList">
        <tr v-for="meal in paginatedMeals" :key="meal.id" :data-id="meal.id">
          <td>{{ meal.displayIndex }}</td>
          <td>{{ meal.name }}</td>
          <td>{{ meal.description }}</td>
          <td>{{ meal.price }}</td>
          <td><img :src="meal.fileUrl" alt="Фото" class="thumbnail" /></td>
          <td class="actions-column">
            <div class="wrap">
              <input 
                type="checkbox" 
                v-model="meal.isVisible" 
                @change="toggleMealVisibility(meal)"
                class="visibility-checkbox"
              />
              <button @click.stop="editMeal(meal.id)" class="icon-setting"><IconsSetting/></button>
              <button @click.stop="showDeleteDialog(meal.id)" class="icon-setting"><IconDelete/></button>
              <button class="drag-handle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5C9 6.10457 8.10457 7 7 7C5.89543 7 5 6.10457 5 5C5 3.89543 5.89543 3 7 3C8.10457 3 9 3.89543 9 5Z" fill="black"/>
                  <path d="M9 12C9 13.1046 8.10457 14 7 14C5.89543 14 5 13.1046 5 12C5 10.8954 5.89543 10 7 10C8.10457 10 9 10.8954 9 12Z" fill="black"/>
                  <path d="M9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" fill="black"/>
                  <path d="M17 5C17 6.10457 16.1046 7 15 7C13.8954 7 13 6.10457 13 5C13 3.89543 13.8954 3 15 3C16.1046 3 17 3.89543 17 5Z" fill="black"/>
                  <path d="M17 12C17 13.1046 16.1046 14 15 14C13.8954 14 13 13.1046 13 12C13 10.8954 13.8954 10 15 10C16.1046 10 17 10.8954 17 12Z" fill="black"/>
                  <path d="M17 19C17 20.1046 16.1046 21 15 21C13.8954 21 13 20.1046 13 19C13 17.8954 13.8954 17 15 17C16.1046 17 17 17.8954 17 19Z" fill="black"/>
                </svg>
              </button>
            </div>
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

    <ConfirmDialog
      v-if="showDialog"
      :visible="showDialog"
      :title="dialogTitle"
      :message="dialogMessage"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Sortable from 'sortablejs'
import IconDelete from "@/components/icons/IconDelete.vue"
import IconsSetting from "@/components/icons/IconsSetting.vue"
import ConfirmDialog from "@/admin/ConfirmDialog.vue"
import Notification from "@/admin/Notification.vue"

const router = useRouter()
const route = useRoute()
const store = useStore()
const mealsList = ref(null)
let sortableInstance = null

const searchQuery = ref('')
const currentPage = ref(1)
const mealsPerPage = ref(15)
const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const toastMessage = ref('')
const toastType = ref('success')
const loading = ref(false)
let dialogAction = null

const meals = computed(() => store.getters['places/mealsByCategory'](route.params.categoryId))
const filteredMeals = ref([])

const paginatedMeals = computed(() => {
  const start = (currentPage.value - 1) * mealsPerPage.value
  const end = start + mealsPerPage.value
  return filteredMeals.value.slice(start, end).map((meal, index) => ({
    ...meal,
    displayIndex: start + index + 1
  }))
})

const totalPages = computed(() => {
  return Math.ceil(filteredMeals.value.length / mealsPerPage.value)
})

const filterMeals = () => {
  currentPage.value = 1
  filteredMeals.value = [...meals.value]
    .sort((a, b) => (a.index || 0) - (b.index || 0))
    .filter(meal => meal.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
}

const changePage = (page) => {
  currentPage.value = page
}

const initSortable = () => {
  if (mealsList.value) {
    sortableInstance = Sortable.create(mealsList.value, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onEnd: async (event) => {
        const { oldIndex, newIndex } = event
        const movedMeal = paginatedMeals.value[oldIndex]
        
        const newMeals = [...filteredMeals.value]
        const [removed] = newMeals.splice(
          oldIndex + (currentPage.value - 1) * mealsPerPage.value,
          1
        )
        newMeals.splice(
          newIndex + (currentPage.value - 1) * mealsPerPage.value,
          0,
          removed
        )
        
        filteredMeals.value = newMeals

        try {
          loading.value = true
          
          await store.dispatch('places/reorderMeal', {
            placeId: route.params.id,
            categoryId: route.params.categoryId,
            mealId: movedMeal.id,
            newIndex: newIndex + 1
          })
          
          toastMessage.value = 'Порядок блюд успешно изменен!'
          toastType.value = 'success'
        } catch (error) {
          console.error('Ошибка при изменении порядка:', error)
          toastMessage.value = 'Ошибка при изменении порядка блюд'
          toastType.value = 'error'
          filteredMeals.value = [...meals.value]
        } finally {
          loading.value = false
          setTimeout(() => {
            toastMessage.value = ''
          }, 3000)
        }
      }
    })
  }
}

const handleConfirm = async () => {
  showDialog.value = false
  if (dialogAction) {
    await dialogAction()
  }
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
    }, 1000)
  }
}

const editMeal = (id) => {
  router.push(`/admin/places/changeMeal/${route.params.id}/${route.params.categoryId}/${id}`)
}

const addMeal = () => {
  router.push(`/admin/places/createMeal/${route.params.id}/${route.params.categoryId}`)
}

const toggleMealVisibility = async (meal) => {
  try {
    loading.value = true;
    await store.dispatch('places/updateMealVisibility', {
      placeId: route.params.id,
      categoryId: route.params.categoryId,
      mealId: meal.id,
      isVisible: meal.isVisible
    });
    toastMessage.value = 'Видимость блюда обновлена!';
    toastType.value = 'success';
    
  } catch (error) {
    console.error('Ошибка при изменении видимости:', error);
    meal.isVisible = !meal.isVisible;
    toastMessage.value = 'Ошибка при изменении видимости блюда';
    toastType.value = 'error';
  } finally {
    loading.value = false;
    setTimeout(() => {
      toastMessage.value = '';
    }, 3000);
  }
};

onMounted(() => {
  store.dispatch('places/fetchMeals', {
    placeId: route.params.id,
    categoryId: route.params.categoryId,
  }).then(() => {
    filteredMeals.value = [...meals.value].sort((a, b) => (a.index || 0) - (b.index || 0))
    nextTick(initSortable)
  })
})

onUnmounted(() => {
  if (sortableInstance) {
    sortableInstance.destroy()
  }
})
</script>

<style scoped>
.drag-handle {
  cursor: grab;
  border: none;
  padding: 5px;
  background: none;
  transition: opacity 0.2s;
}

.drag-handle:hover {
  opacity: 1;
}

.drag-handle:active {
  cursor: grabbing;
}

.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.sortable-chosen {
  opacity: 0.8;
  background: #f0f0f0;
}

.sortable-drag {
  opacity: 1 !important;
  background: #ffffff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.icon-setting {
  padding: 2px 0;
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
  padding: 5px;
  text-align: left;
  line-height: 1.2;
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
  background: #d1aa58;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.actions-column {
  text-align: center;
  border: none;
}

.wrap {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  align-self: center;
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

@media screen and (min-width: 2400px) and (min-height: 1400px) {
  .container {
    padding: 0;
    gap: 40px;
  }
  
  .header {
    margin-bottom: 40px;
  }

  .filters input {
    padding: 20px;
    font-size: 28px;
    border-radius: 8px;
  }

  .filters select {
    padding: 20px;
    font-size: 28px;
    border-radius: 8px;
  }

  .menu-table th,
  .menu-table td {
    font-size: 28px;
  }

  .menu-table th {
    font-size: 28px;
  }

  .thumbnail {
    max-width: 100px;
    max-height: 100px;
  }

  .pagination {
    gap: 20px;
  }

  button {
    padding: 20px 40px;
    font-size: 24px;
    border-radius: 8px;
  }

  .icon-setting {
    width: 40px;
    height: 40px;
  }

  .pagination span {
    font-size: 28px;
  }
}


.visibility-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-right: 10px;
}

@media screen and (min-width: 2400px) and (min-height: 1400px) {
  .visibility-checkbox {
    width: 28px;
    height: 28px;
    margin-right: 15px;
  }
}
</style>