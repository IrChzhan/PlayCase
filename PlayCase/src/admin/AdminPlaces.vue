<template>
  <div>
    <h1>Места</h1>
    <ul>
      <li v-for="place in places" :key="place.id">
        {{ place.name }} - {{ place.address }}
      </li>
    </ul>

    <h2>Добавить новое место</h2>
    <form @submit.prevent="addPlace">
      <input v-model="name" type="text" placeholder="Название" required />
      <input v-model="address" type="text" placeholder="Адрес" required />
      <button type="submit">Добавить</button>
    </form>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { ref, computed, onMounted } from 'vue';

const store = useStore();
const name = ref('');
const address = ref('');

const places = computed(() => store.getters['places/allPlaces']);

const fetchPlaces = async () => {
  try {
    await store.dispatch('places/fetchPlaces');
  } catch (error) {
    console.error('Ошибка загрузки мест:', error);
  }
};

const addPlace = async () => {
  if (name.value && address.value) {
    try {
      await store.dispatch('places/createPlace', {
        name: name.value,
        address: address.value,
      });

      name.value = '';
      address.value = '';
    } catch (error) {
      console.error('Ошибка добавления места:', error);
    }
  }
};

onMounted(fetchPlaces);
</script>

<style scoped>
h1 {
  color: #333;
}

form {
  margin-top: 20px;
}

input {
  margin: 5px;
}
</style>
