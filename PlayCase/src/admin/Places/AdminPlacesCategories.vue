<template>
  <div class="layout">
    <div class="navbar">
      <div v-if="categories && categories.length > 0" class="list" ref="listContainer">
          <div
            v-for="(category) in categories"
            :key="category.id"
            class="category-card"
            :class="{ highlighted: category.id === selectedCategoryId }"
            @click="selectCategory(category.id)"
          >
            <h2>{{ category.name }}</h2>
            <div class="actions">
              <button @click.stop="goToChangeUser(category.id)" class="icon-setting"><IconsSetting/></button>
              <button @click.stop="showDeleteDialog(category.id)" class="icon-setting"><IconDelete/></button>
              <button class="drag-handle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5C9 6.10457 8.10457 7 7 7C5.89543 7 5 6.10457 5 5C5 3.89543 5.89543 3 7 3C8.10457 3 9 3.89543 9 5Z" fill="currentColor"/>
                  <path d="M9 12C9 13.1046 8.10457 14 7 14C5.89543 14 5 13.1046 5 12C5 10.8954 5.89543 10 7 10C8.10457 10 9 10.8954 9 12Z" fill="currentColor"/>
                  <path d="M9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" fill="currentColor"/>
                  <path d="M17 5C17 6.10457 16.1046 7 15 7C13.8954 7 13 6.10457 13 5C13 3.89543 13.8954 3 15 3C16.1046 3 17 3.89543 17 5Z" fill="currentColor"/>
                  <path d="M17 12C17 13.1046 16.1046 14 15 14C13.8954 14 13 13.1046 13 12C13 10.8954 13.8954 10 15 10C16.1046 10 17 10.8954 17 12Z" fill="currentColor"/>
                  <path d="M17 19C17 20.1046 16.1046 21 15 21C13.8954 21 13 20.1046 13 19C13 17.8954 13.8954 17 15 17C16.1046 17 17 17.8954 17 19Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        
      </div>
      <template v-else>
          <p class="no-categories-message">Пока категорий нет</p>
        </template>
      <button class="add-category-button" @click="createCategory">Создать категорию</button>
    </div>
    <div class="content">
      <router-view :key="selectedCategoryId"></router-view>
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
import { onMounted,onUnmounted, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Sortable from 'sortablejs'

import router from '@/router/index.js'
import IconDelete from "@/components/icons/IconDelete.vue";
import IconsSetting from "@/components/icons/IconsSetting.vue";
import ConfirmDialog from "@/admin/ConfirmDialog.vue";
import Notification from "@/admin/Notification.vue";

const route = useRoute()
const store = useStore()
const categories = ref([])
const selectedCategoryId = ref(null)
const listContainer = ref(null)

const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const toastMessage = ref('')
const toastType = ref('success')
const loading = ref(false)
let dialogAction = null

let sortableInstance = null

const initSortable = () => {
  if (listContainer.value) {
    sortableInstance = Sortable.create(listContainer.value, {
      animation: 100,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      handle: ".drag-handle",
      onEnd: async (event) => {
        const { oldIndex, newIndex } = event
        const movedCategory = categories.value[oldIndex]
        
        try {
          loading.value = true
          await store.dispatch('places/reorderCategories', {
            placeId: route.params.id,
            categoryId: movedCategory.id,
            newIndex: newIndex + 1
          })
          
          const item = categories.value.splice(oldIndex, 1)[0]
          categories.value.splice(newIndex, 0, item)
          
          toastMessage.value = 'Порядок категорий обновлен!'
          toastType.value = 'success'
        } catch (error) {
          console.error('Ошибка при изменении порядка категорий:', error)
          toastMessage.value = 'Ошибка при изменении порядка категорий'
          toastType.value = 'error'
          fetchCategories()
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

const goToChangeUser = (id) => {
  router.push(`/admin/places/changeCategory/${route.params.id}/${id}`)
}

const handleCancel = () => {
  showDialog.value = false
}

const showDeleteDialog = (id) => {
  dialogTitle.value = 'Подтверждение удаления'
  dialogMessage.value = 'Вы уверены, что хотите удалить эту категорию?'
  dialogAction = deleteCategory(id)
  showDialog.value = true
}

const deleteCategory = (id) => async () => {
  try {
    loading.value = true
    await store.dispatch('places/deleteCategory', {
      placeId: route.params.id,
      categoryId: id,
    })
    toastMessage.value = 'Категория удалена!'
    toastType.value = 'success'
  } catch (error) {
    console.error('Ошибка удаления категории:', error)
    toastMessage.value = 'Ошибка при удалении категории.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => {
      fetchCategories()
      toastMessage.value = ''
    }, 1000)
  }
}

const fetchCategories = async () => {
  try {
    await store.dispatch('places/fetchCategories', route.params.id)
    categories.value = store.getters['places/categoriesByPlace'](route.params.id)
      .sort((a, b) => a.index - b.index) 
    
    if (categories.value.length > 0) {
      selectedCategoryId.value = categories.value[0].id
    }
    
    nextTick(() => {
      if (categories.value.length > 0) {
        initSortable()
      }
    })
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error)
  }
}

const selectCategory = (id) => {
  selectedCategoryId.value = id
  router.push(`/admin/places/categories/${route.params.id}/menu/${id}`)
}

const createCategory = () => {
  router.push(`/admin/places/createCategories/${route.params.id}`)
}

watch(selectedCategoryId, (newId) => {
  if (newId) {
    router.push(`/admin/places/categories/${route.params.id}/menu/${newId}`)
  }
})

onMounted(() => {
  fetchCategories()
})

onUnmounted(() => {
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
})
</script>

<style scoped>
.actions {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.icon-setting {
  padding: 10px 0;
  background: none;
  border: none;
  cursor: pointer;
}

.icon-setting:hover {
  background: none;
}

.drag-handle {
  cursor: grab;
  background: none;
  border: none;
  padding: 5px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.drag-handle:hover {
  opacity: 1;
}

.drag-handle:active {
  cursor: grabbing;
}


.layout {
  display: flex;
  background-color: #ffffff;
  height: 100%;
}

.navbar {
  min-width: 5%;
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
  background-color: #CC9F33;
  color: #ffffff;
  padding: 10px 8px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-category-button:hover {
  background-color: #d1aa58;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 90vh;
  overflow-y: auto;
}

.category-card {
  word-break: break-all;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition:
    box-shadow 0.3s,
    transform 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.category-card h2 {
  margin: 0;
  word-break: break-all;
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

@media screen and (min-width: 2400px) and (min-height: 1400px) {
  .navbar {
    min-width: 20%; 
    padding: 20px; 
  }

  .add-category-button {
    padding: 20px 40px; 
    font-size: 28px; 
    border-radius: 10px; 
    margin-top: 20px; 
  }

  .category-card {
    padding: 30px; 
    border-radius: 16px; 
  }

  .category-card h2 {
    font-size: 32px; 
  }

  .no-categories-message {
    font-size: 20px; 
    margin-top: 40px; 
  }

  .content {
    padding: 0 40px; 
  }

  .list {
    gap: 40px;
  }

  .icon-setting {
    width: 40px; 
    height: 40px;
    margin-bottom: 20px; 
  }
  
  .drag-handle svg {
    width: 24px;
    height: 24px;
  }
}
</style>