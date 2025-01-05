<template>
  <div class="admin-results">
    <div v-if="teams.length > 0" class="results-table-container">
      <h2>Результаты</h2>
      <table>
        <thead>
        <tr>
          <th>Место</th>
          <th>Название</th>
          <th>Общий счёт</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="team in teams" :key="team.teamName">
          <td>{{ team.currentPlace }}</td>
          <td>{{ team.teamName }}</td>
          <td>{{ team.totalScore }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <h1>Загрузить результаты для игры</h1>
    <div class="upload-container">
      <input
        class="file-input"
        type="file"
        @change="handleFileChange"
        ref="fileInput"
        hidden
      />
      <button class="custom-file-button" @click="triggerFileInput">
        Выбрать файл
      </button>
      <button class="upload-button" @click="uploadFile" :disabled="loading">
        {{ loading ? 'Uploading...' : 'Загрузить файл' }}
      </button>
      <button class="view-results-button" @click="fetchResults" :disabled="loading">
        {{ loading ? 'Loading...' : 'Посмотреть результаты' }}
      </button>
    </div>
    <p v-if="uploadSuccess" class="success-message">Файл успешно загружен!</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AdminResults',
  props: {
    gameId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore()
    const selectedFile = ref(null)
    const loading = ref(false)
    const uploadSuccess = ref(false)
    const teams = ref([])
    const fileInput = ref()
    const handleFileChange = (event) => {
      selectedFile.value = event.target.files[0]
      if (selectedFile.value) {
        console.log('File name:', selectedFile.value.name)
        console.log('File size:', selectedFile.value.size)
        console.log('File type:', selectedFile.value.type)
      }
    }

    const uploadFile = async () => {
      if (!selectedFile.value) {
        alert('Please choose a file.')
        return
      }

      loading.value = true
      try {
        await store.dispatch('games/uploadResultsFile', {
          gameId: props.gameId,
          file: selectedFile.value,
        })
        uploadSuccess.value = true
      } catch (error) {
        console.error('Error uploading file:', error)
        alert('Error uploading file. Please try again.')
      } finally {
        loading.value = false
      }
    };

    const fetchResults = async () => {
      loading.value = true
      try {
        const currentGame = await store.dispatch('games/fetchGameById', props.gameId);
        const results = await store.dispatch('games/fetchGameResults', currentGame.id);
        teams.value = results;
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        loading.value = false
      }
    };

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    return {
      selectedFile,
      loading,
      uploadSuccess,
      handleFileChange,
      uploadFile,
      fetchResults,
      teams,
      triggerFileInput,
      fileInput
    }
  },
}
</script>

<style scoped>
h2 {
  font-size: 26px;
  margin-bottom: 20px;
}
.admin-results {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.admin-results h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.file-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  text-align: center;
}

.custom-file-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-file-button:hover {
  background-color: #218838;
}

.upload-button,
.view-results-button {
  padding: 10px 20px;
  background-color: #1B2A46;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-button:hover,
.view-results-button:hover {
  background-color: #0056b3;
}

.upload-button:disabled,
.view-results-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.success-message {
  margin-top: 15px;
  color: #2ecc71;
  font-size: 16px;
  font-weight: bold;
}

.results-table-container {
  width: 100%;
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
