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
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

import router from '@/router/index.js'

const store = useStore()
const places = ref([])
const selectedPlaceId = ref(null)

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
  router.push({ name: 'PlaceDetails', params: { id } })
}

watch(selectedPlaceId, (newId) => {
  if (newId) {
    router.push(`/admin/places/place/${newId}`)
  }
})

onMounted(fetchPlaces)
</script>

<style scoped>
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
  padding-right: 10px;
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

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  height: 100%;
}

.bar-card {
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
  background-color: #1abc9c;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-bar-button:hover {
  background-color: #16a085;
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
