<template>
  <div>
    <div v-for="category in categories" :key="category.id" class="category">
      <div class="category-header">
        <h3>{{ category.name }}</h3>
        <div class="actions">
          <button @click="$emit('edit-category', category)" class="button small">
            Редактировать
          </button>
          <button @click="$emit('delete-category', category.id)" class="button small danger">
            Удалить
          </button>
          <button @click="$emit('add-dish', category.id)" class="button small primary">
            Добавить блюдо
          </button>
        </div>
      </div>
      <ul class="dishes">
        <li v-for="dish in category.dishes" :key="dish.id">
          {{ dish.name }} - {{ dish.price }} руб.
          <button @click="$emit('edit-dish', dish)" class="button small">Редактировать</button>
          <button @click="$emit('delete-dish', dish.id)" class="button small danger">
            Удалить
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps(['categories'])
</script>

<style scoped>
.category {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #2c3e50;
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.actions {
  display: flex;
  gap: 10px;
}
.dishes {
  margin-top: 10px;
  padding-left: 20px;
}
.button {
  font-size: 14px;
  margin-left: 5px;
}
</style>
