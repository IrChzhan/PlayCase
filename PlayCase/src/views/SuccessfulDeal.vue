<template>
  <div class="payment-success-page">
    <div class="content">
      <h1>Оплата успешно проведена!</h1>
      <p>Спасибо за вашу оплату!</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';


onMounted(() => {
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
});
</script>

<style scoped>
.payment-success-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1B2A46;
  color: white;
  font-family: 'Arial', sans-serif;
}

.content {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.content h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.content p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.content button {
  background-color: #cc9f33;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.content button:hover {
  background-color: #b1882e;
}
</style>
