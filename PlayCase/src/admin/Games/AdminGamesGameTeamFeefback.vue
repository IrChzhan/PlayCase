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

const goBack = () => {
  router.back()
};

onMounted(() => {
  getReviews();
});
</script>

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
      <tr v-for="review in reviews" :key="review.teamId">
        <td>{{ review.teamName }}</td>
        <td>{{ review.gameMark }}</td>
        <td>{{ review.markComment }}</td>
      </tr>
      </tbody>
    </table>
    <button @click="goBack">Назад</button>
  </div>
</template>

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

button {
  display: block;
  width: max-content;
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
</style>
