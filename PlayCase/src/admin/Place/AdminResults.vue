<template>
  <div class="admin-results">
    <h1>Загрузить результаты для игры</h1>
    <div class="upload-container">
      <input 
        class="file-input" 
        type="file" 
        @change="e => selectedFile = e.target.files[0]" 
      />
      <button 
        class="upload-button" 
        @click="uploadFile" 
        :disabled="loading"
      >
        {{ loading ? 'Загрузка...' : 'Загрузить файл' }}
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
    const store = useStore();
    const selectedFile = ref(null);
    const loading = ref(false);
    const uploadSuccess = ref(false);

    const uploadFile = async () => {
      if (!selectedFile.value) {
        alert('Пожалуйста, выберите файл.');
        return;
      }

      loading.value = true;
      try {
        await store.dispatch('games/uploadResultsFile', {
          gameId: props.gameId,
          file: selectedFile.value,
        });
        uploadSuccess.value = true;
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        alert('Ошибка при загрузке файла. Попробуйте снова.');
      } finally {
        loading.value = false;
      }
    };

    return {
      selectedFile,
      loading,
      uploadSuccess,
      uploadFile,
    };
  },
};
</script>

<style scoped>
.admin-results {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background: #2c3e50;
  border-radius: 10px;
  text-align: center;
}

.admin-results h1 {
  font-size: 28px;
  color: #fff;
  margin-bottom: 25px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.file-input {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  border: 2px solid #27ae60;
  border-radius: 8px;
  background-color: #ecf0f1;
  text-align: center;
}

.upload-button {
  padding: 15px 30px;
  background-color: #27ae60;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.upload-button:hover {
  background-color: #2ecc71;
  transform: scale(1.05);
}

.upload-button:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.success-message {
  margin-top: 20px;
  color: #2ecc71;
  font-size: 20px;
  font-weight: bold;
}
</style>