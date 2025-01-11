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
      <button @click="exportReviews">Экспорт</button>
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
const exportReviews = async () => {
  try {
    const response = await store.dispatch("games/exportReview", {
      gameId: route.params.gameId,
      exportType: "XSLX",
      includeHeaders: true,
    });
    var blob = new Blob([s2ab(atob(response))]);

    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    console.log(blob)
  } catch (e) {
    console.error("Ошибка экспорта:", e);
  }
};



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

/* Цветовые классы */
.status-finished {
  background-color: #ffcccc;
}

.status-result {
  background-color: #fff2cc;
}

.status-in-progress {
  background-color: #ccffcc;
}
</style>
