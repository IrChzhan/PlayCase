<script setup>
import router from "@/router/index.js";

const goToPlaces = () => {
  router.push({ name: "AdminPlaces" });
};

const goToUsers = () => {
  router.push({ name: "AdminUsers" });
};
</script>

<template>
  <div class="container">
    <button class="place-card" @click="goToPlaces">Заведения</button>
    <button class="place-card" @click="goToUsers">Пользователи</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 100vh;
}

.place-card {
  background: #27364f;
  border: 1px solid #394a6a;
  border-radius: 8px;
  padding: 20px;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.place-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
