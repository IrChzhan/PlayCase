<template>
  <div class="admin-results-page">
    <div class="close-button" @click="goToMenuApp">✖️</div>
    <h1>Загрузка файла</h1>
    <div v-if="!uploadSuccess">
      <input type="file" @change="handleFileUpload" accept=".xls,.xlsx" />
      <button @click="uploadFile" :disabled="!selectedFile">Загрузить файл</button>
    </div>
    <div v-else class="success-message">Файл успешно загружен</div>

    <img src="@/assets/house_light.png" class="home-button" @click="goToMenuApp" />
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const gameId = route.params.gameId
const selectedFile = ref(null)
const uploadSuccess = ref(false)

const handleFileUpload = (event) => {
  console.log('file selected:', event.target.files[0])
  selectedFile.value = event.target.files[0]
}

const uploadFile = async () => {
  if (!selectedFile.value) {
    alert('Пожалуйста, выберите файл.')
    return
  }
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    await axios.post(`http://localhost:8080/admin/v1/games/${gameId}/teams/replace`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    uploadSuccess.value = true
  } catch (error) {
    console.error('Error uploading file:', error)
    alert('Ошибка при загрузке файла.')
  }
}

const goToMenuApp = () => {
  router.push({ name: 'MenuApp', params: { teamName: 'dada', teamTable: 'dadasd' } })
}
</script>

<style scoped>
.admin-results-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #001845;
  color: #ffd700;
  height: 100vh;
  position: relative;
  font-family: 'Mulish', sans-serif;
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
  cursor: pointer;
}
.success-message {
  font-size: 1.2em;
  margin-top: 20px;
}

button {
  background-color: #cc9f33;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #a58027;
  cursor: not-allowed;
}
.home-button {
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: 20px;
  cursor: pointer;
}

.admin-results-page::before,
.admin-results-page::after {
  content: '';
  position: absolute;
  background-image: url('@/assets/lines.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.admin-results-page::before {
  top: 0;
  left: 0;
  width: 1300px;
  height: 1300px;
}

.admin-results-page::after {
  bottom: 0;
  right: 0;
  width: 150px;
  height: 150px;
}
</style>
