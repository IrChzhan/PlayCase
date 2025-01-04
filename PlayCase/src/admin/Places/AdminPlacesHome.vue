<template>
  <div class="layout">
    <div class="navbar">
      <div class="list" ref="listContainer">
        <template v-if="places && places.length > 0">
          <div
            v-for="(bar, index) in places"
            :key="bar.id"
            class="bar-card"
            :class="{ highlighted: bar.id === selectedPlaceId }"
            @click="selectPlace(bar.id)"
          >
            <h2>{{ bar.name }}</h2>
            <p>{{ bar.address }}</p>
            <div class="actions">
              <button @click.stop="goToChangeUser(bar.id)" class="icon-setting"><IconsSetting/></button>
              <button @click.stop="showDeleteDialog(bar.id)" class="icon-setting"><IconDelete/></button>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="no-places-message">Пока мест нету</p>
        </template>
      </div>
      <div class="add-bar">
        <button class="add-bar-button" @click="goToCreatePlace">Создать новое место</button>
      </div>
    </div>

    <div class="content">
      <router-view :key="selectedPlaceId"></router-view>
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
import { useStore } from 'vuex'

import router from '@/router/index.js'
import IconDelete from "@/components/icons/IconDelete.vue";
import IconsSetting from "@/components/icons/IconsSetting.vue";
import ConfirmDialog from "@/admin/ConfirmDialog.vue";
import Notification from "@/admin/Notification.vue";
const loading = ref(false)
const store = useStore()
const places = ref([])
const selectedPlaceId = ref(null)
const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const toastMessage = ref('')
const toastType = ref('success')
let dialogAction = null
const handleConfirm = async () => {
  showDialog.value = false
  if (dialogAction) {
    await dialogAction()
  }
}
const goToChangeUser = (id) => {
  router.push(`/admin/places/changePlace/${id}`)
}
const handleCancel = () => {
  showDialog.value = false
}
const showDeleteDialog = (id) => {
  dialogTitle.value = 'Подтверждение удаления'
  dialogMessage.value = 'Вы уверены, что хотите удалить это место?'
  dialogAction = deletePlace(id)
  showDialog.value = true
}

const deletePlace = (id) => async () => {
  try {
    loading.value = true
    await store.dispatch('places/deletePlace', id)
    toastMessage.value = 'Место удалено!'
    toastType.value = 'success'
    setTimeout(() => {
      toastMessage.value = ''
      fetchPlaces()
    }, 3000)
  } catch (error) {
    console.error('Ошибка удаления места:', error)
    toastMessage.value = 'Ошибка при удалении места.'
    toastType.value = 'error'
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  } finally {
    loading.value = false
  }
}

const fetchPlaces = async () => {
  await store.dispatch('places/fetchPlaces')
  places.value = store.getters['places/allPlaces']
  if (places.value.length > 0) {
    selectedPlaceId.value = places.value[0].id
  }
}

const goToCreatePlace = () => {
  router.push({ name: 'AdminPlacesCreatePlace' })
}

const selectPlace = (id) => {
  selectedPlaceId.value = id
  router.push(`/admin/places/categories/${id}`)
}

watch(selectedPlaceId, (newId) => {
  if (newId) {
    router.push(`/admin/places/categories/${newId}`)
  }
})

onMounted(fetchPlaces)
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
body {
  margin: 0;
  background: white;
  font-family: Arial, sans-serif;
}

.layout {
  display: flex;
  background-color: #ffffff;
  height: 100%;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 90vh;
  overflow-y: auto;
}

.navbar {
  min-width: 10%;
  max-width: 30%;
  background-color: #f9f9f9;
  border-right: 1px solid #e0e0e0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.content {
  flex: 1;
  margin-left: 20px;
  background-color: #ffffff;
  height: 100%;
}

.bar-card {
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

.bar-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.bar-card h2 {
  word-break: break-all;
  margin: 0 0 10px;
  font-size: 18px;
  color: #34495e;
}

.bar-card p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

.add-bar {
  margin-top: 20px;
  text-align: center;
}

.add-bar-button {
  background-color: #CC9F33;
  color: #ffffff;
  padding: 10px 8px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-bar-button:hover {
  background-color: #d1aa58;
}

.no-places-message {
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
  margin-top: 20px;
}

.highlighted {
  background-color: #e0f7fa;
  border-color: #1abc9c;
}
</style>
