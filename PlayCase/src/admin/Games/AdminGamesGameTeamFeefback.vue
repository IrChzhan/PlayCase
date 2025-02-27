<template>
  <div class="container">
    <table>
      <thead>
      <tr>
        <th>Имя команды</th>
        <th>Оценка</th>
        <th>Комментарий</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="review in reviews" :key="review.teamId" :class="getStatusClass(review.gameMark)">
        <td>{{ review.teamName }}</td>
        <td>{{ review.gameMark }}</td>
        <td>{{ review.markComment }}</td>
      </tr>
      </tbody>
    </table>
    <div class="button-container">
      <button @click="goBack">Назад</button>
      <button class="btn" @click="exportReviews">Экспорт</button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";

const route = useRoute();
const router = useRouter();
const store = useStore();

const reviews = ref([]);

const getReviews = async () => {
  try {
    const res = await store.dispatch("games/fetchReview", route.params.gameId);
    reviews.value = res.teamReviews || [];
  } catch (e) {
    console.log(e);
  }
};

const getStatusClass = (mark) => {
  if (mark === "BAD") return "status-finished";
  if (mark === "GOOD") return "status-in-progress";
  if (mark === "NEUTRAL") return "status-result";
  return "";
};

const goBack = () => {
  router.back();
};

import * as XLSX from 'xlsx';

const exportReviews = async () => {
  try {
    const response = await store.dispatch('games/exportReview', {
      gameId: route.params.gameId,
      exportType: 'CSV'
    });

    const data = response.data.split('\n').map(row => row.split(','));

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reviews');

    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(excelFile)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'reviews.xlsx');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('Ошибка экспорта:', e);
  }
};

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}


onMounted(() => {
  getReviews();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.button-container {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

button {
  display: block;
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #5a6268;
}

.status-finished {
  background-color: #ffcccc;
}

.status-result {
  background-color: #fff2cc;
}

.status-in-progress {
  background-color: #ccffcc;
}

.btn {
  background: #CC9F33;
}
.btn:hover {
  background: #d1aa58;
}


@media screen and (min-width: 2400px) and (min-height: 1400px) {
  .container {
    margin-top: 40px; 
  }

  table {
    margin-bottom: 32px; 
  }

  th, td {
    padding: 16px; 
    font-size: 28px; 
  }

  th {
    font-size: 28px; 
  }

  .button-container {
    gap: 16px; 
  }

  button {
    padding: 16px 32px; 
    font-size: 26px; 
    border-radius: 8px; 
  }

  .btn {
    padding: 16px 32px; 
    font-size: 26px; 
    border-radius: 8px; 
  }
}
</style>
