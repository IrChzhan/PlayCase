<template>
    <div>
      <button @click="loadPresentations">Загрузить презентацию</button>
      <button @click="deleteAllPresentations">Удалить презентацию</button>
      <input type="file" multiple @change="handleFileUpload" />
      <button @click="uploadSlidesBatch">Загрузить слайды</button>
  
    <div v-if="slides.length > 0" class="slides-container">
        <div v-for="(slide, index) in slides" :key="slide.id" class="slide-row">
            <span class="slide-index">{{ index + 1 }}</span>
            <input type="checkbox" v-model="slide.isGroup" />
            <input type="checkbox" v-model="slide.isActive" />
            <span class="slide-name">{{ slide.name }}</span>
            <img :src="slide.fileUrl" alt="Slide" class="slide-image" />
        </div>
    </div>
      <div v-else>
        <p>Слайды отсутствуют.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  
  const slides = ref([]);
  const selectedFiles = ref([]);
  
  const route = useRoute();
  const router = useRouter();
  const store = useStore();
  
  const loadPresentations = async () => {
    try {
      const response = await store.dispatch('presentation/loadPresentations', route.params.gameId);
      slides.value = response || []; 
    } catch (error) {
      console.error('Ошибка при загрузке слайдов:', error);
    }
  };
  
  const deleteAllPresentations = async () => {
    try {
      await store.dispatch('presentation/deleteAllPresentations', route.params.gameId);
      slides.value = []; 
    } catch (error) {
      console.error('Ошибка при удалении слайдов:', error);
    }
  };
  
  const handleFileUpload = (event) => {
    selectedFiles.value = Array.from(event.target.files); 
  };
  
  const uploadSlidesBatch = async () => {
    if (selectedFiles.value.length === 0) {
      alert('Пожалуйста, выберите файлы для загрузки.');
      return;
    }
  
    try {
      const formData = new FormData();
  
      selectedFiles.value.forEach((file, index) => {
        formData.append(`files`, file); 
      });
  
      const response = await store.dispatch('presentation/addPresentation', { 
        gameId: route.params.gameId, 
        presentation: formData 
      });
      slides.value = response || [];
      selectedFiles.value = []; 
    } catch (error) {
      console.error('Ошибка при пакетной загрузке слайдов:', error);
    }
  };
  
  loadPresentations();
  </script>
  
  <style scoped>
.slides-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.slide-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slide-index {
  width: 30px;
  text-align: center;
}

.slide-name {
  flex-grow: 1;
}

.slide-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
  </style>