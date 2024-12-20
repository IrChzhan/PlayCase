<template>
  <div class="admin-places">
    <h1>Управление местами</h1>

    <div class="places-list">
      <div
          v-for="place in places"
          :key="place.id"
          class="place-card"
          @click="goToEdit(place.id)"
      >
        <h2>{{ place.name }}</h2>
        <p>{{ place.address }}</p>
      </div>
    </div>

    <div class="add-place">
      <h2>Добавить новое место</h2>
      <form @submit.prevent="addPlace" class="form">
        <div class="form-group">
          <label for="name">Название:</label>
          <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Введите название"
              class="input"
              required
          />
        </div>
        <div class="form-group">
          <label for="address">Адрес:</label>
          <input
              id="address"
              v-model="address"
              type="text"
              placeholder="Введите адрес"
              class="input"
              required
          />
        </div>
        <button
            class="button primary"
            type="submit"
            :disabled="!isFormValid || loading"
            :class="{ disabled: !isFormValid || loading }"
        >
          <Loader v-if="loading" /> Добавить место
        </button>
      </form>
    </div>

    <Notification
        v-if="toastMessage"
        :message="toastMessage"
        :type="toastType"
        :duration="3000"
    />
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Loader from './Loader.vue';
import Notification from './Notification.vue';

const store = useStore();
const router = useRouter();

const places = ref([]);
const name = ref('');
const address = ref('');
const loading = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

const isFormValid = computed(() => name.value.trim() !== '' && address.value.trim() !== '');

const fetchPlaces = async () => {
  await store.dispatch('places/fetchPlaces');
  places.value = store.getters['places/allPlaces'];
};

const goToEdit = (id) => {
  router.push(`/place/${id}`);
};

const addPlace = async () => {
  if (isFormValid.value) {
    try {
      loading.value = true;
      await store.dispatch('places/createPlace', {
        name: name.value,
        address: address.value,
      });

      name.value = '';
      address.value = '';

      toastMessage.value = 'Место успешно добавлено!';
      toastType.value = 'success';
      await fetchPlaces();

      setTimeout(() => {
        toastMessage.value = '';
      }, 3000);
    } catch (error) {
      console.error('Ошибка добавления места:', error);

      toastMessage.value = 'Ошибка при добавлении места.';
      toastType.value = 'error';

      setTimeout(() => {
        toastMessage.value = '';
      }, 3000);
    } finally {
      loading.value = false;
    }
  }
};

onMounted(fetchPlaces);
</script>

<style scoped>
.admin-places {
  background-color: #1b2a46;
  color: white;
  padding: 20px;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

h1, h2 {
  margin-bottom: 20px;
  color: #ffffff;
  text-align: center;
}

.places-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.place-card {
  background: #27364f;
  border: 1px solid #394a6a;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.place-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.place-card h2 {
  margin: 0;
  font-size: 18px;
  color: #ffffff;
}

.place-card p {
  margin: 10px 0 0;
  font-size: 14px;
  color: #c5c5c5;
}

.add-place {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 5px;
  color: #c5c5c5;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #394a6a;
  border-radius: 5px;
  background: #27364f;
  color: white;
  font-size: 14px;
}

.input:focus {
  border-color: #4caf50;
  outline: none;
}

.button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.button:hover {
  background: #45a049;
}

.button:disabled {
  background: #666;
  cursor: not-allowed;
}

.button.disabled {
  opacity: 0.5;
}

.primary {
  background: #4caf50;
}

.primary:hover {
  background: #45a049;
}
</style>
