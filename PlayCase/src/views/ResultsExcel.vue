<template>
    <div class="results-excel">
      <h1>Данные из Excel файла с рейтингом команд</h1>
  
      <div v-if="isLoading">Загрузка файла...</div>
  
      <div v-if="fileData.length">
        <h2>Данные файла:</h2>
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in fileHeaders" :key="index">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in fileData" :key="rowIndex">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-else-if="!isLoading">
        <p>Нет данных для отображения.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import * as XLSX from "xlsx";
  
  export default {
    name: "ResultsExcel",
    data() {
      return {
        isLoading: true,
        fileHeaders: [],
        fileData: []
      };
    },
    mounted() {
      this.fetchExcelFile();
    },
    methods: {
      async fetchExcelFile() {
        try {
          const response = await axios.post("/admin/v1/files/upload", {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            url: "string",
            extension: "xlsx",
            size: 0,
            originalName: "example_team_1.xlsx"
          });
  
          const fileUrl = response.data.url;
          const fileResponse = await axios.get(fileUrl, { responseType: "arraybuffer" });
  
          // Парсинг Excel файла
          const data = new Uint8Array(fileResponse.data);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
          this.fileHeaders = json[0] || [];
          this.fileData = json.slice(1);
          this.isLoading = false;
        } catch (error) {
          console.error("Ошибка при загрузке файла", error);
          this.isLoading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .results-excel {
    font-family: Arial, sans-serif;
    margin: 20px;
  }
  
  h2 {
    margin-top: 20px;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 10px;
  }
  
  table, th, td {
    border: 1px solid #ddd;
  }
  
  th, td {
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f4f4f4;
  }
  </style>