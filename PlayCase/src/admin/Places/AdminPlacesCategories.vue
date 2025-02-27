<template>
  <div class="layout">
    <div class="navbar">
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
            <div class="actions">
              <button @click.stop="goToChangeUser(category.id)" class="icon-setting"><IconsSetting/></button>
              <button @click.stop="showDeleteDialog(category.id)" class="icon-setting"><IconDelete/></button>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="no-categories-message">Пока категорий нет</p>
        </template>
      </div>
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
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import router from '@/router/index.js'
import IconDelete from "@/components/icons/IconDelete.vue";
import IconsSetting from "@/components/icons/IconsSetting.vue";
import ConfirmDialog from "@/admin/ConfirmDialog.vue";
import Notification from "@/admin/Notification.vue";

const route = useRoute()
const store = useStore()
const categories = ref([])
const selectedCategoryId = ref(null)

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

const createCategory = () => {
  router.push(`/admin/places/createCategories/${route.params.id}`)
}

watch(selectedCategoryId, (newId) => {
  if (newId) {
    router.push(`/admin/places/categories/${route.params.id}/menu/${newId}`)
  }
})

onMounted(fetchCategories)
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
  padding: 10px 0 ;
  background: none;
  border: none;
  cursor: pointer;
}
.icon-setting:hover {
  background: none;
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
}

</style>
