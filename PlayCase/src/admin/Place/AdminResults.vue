<template>
    <div class="admin-results">
      <h1 class="name_download">Загрузка Excel файла</h1>
  
      <input type="file" @change="onFileChange" accept=".xlsx, .xls" />
      <button @click="uploadFile" :disabled="!selectedFile">Загрузить файл</button>
  
      <div v-if="isLoading">Загрузка...</div>
      <div v-if="uploadMessage" class="choice_file">{{ uploadMessage }}</div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "AdminResults",
    data() {
      return {
        selectedFile: null,
        isLoading: false,
        uploadMessage: "",
      };
    },
    methods: {
      onFileChange(event) {
        this.selectedFile = event.target.files[0];
      },
      async uploadFile() {
        if (!this.selectedFile) return;
  
        this.isLoading = true;
        this.uploadMessage = "";
  
        const formData = new FormData();
        formData.append("file", this.selectedFile);
  
        try {
          const response = await axios.post("/admin/v1/files/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
          if (response.data && response.data.url) {
            this.uploadMessage = "Файл успешно загружен.";
          } else {
            this.uploadMessage = "Не удалось загрузить файл.";
          }
        } catch (error) {
          console.error("Ошибка загрузки файла:", error);
          this.uploadMessage = "Ошибка загрузки файла.";
        } finally {
          this.isLoading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .admin-results {
    font-family: Arial, sans-serif;
    margin: 20px;
  }
  
  .name_download {
    color: aliceblue;
  }

  .file {
    color: white;
  }

  .choice_file {
    color: white;
  }
  input {
    margin-bottom: 10px;
  }
  
  button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  div {
    margin-top: 10px;
  }
  </style>
  
  
  