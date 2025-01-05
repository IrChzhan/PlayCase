<template>
  <div class="admin-payments">
    <h1>Управление оплатами</h1>

    <table class="payments-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Название команды</th>
          <th>Онлайн оплаты</th>
          <th>Офлайн оплаты</th>
          <th>Итого</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(team, index) in editablePayments" :key="team.teamId">
          <td>{{ index + 1 }}</td>
          <td>{{ team.teamName }}</td>
          <td>
            <input
              type="number"
              v-model.number="team.onlinePaid"
              :disabled="!isEditing[team.teamId]"
              class="editable-input"
            />
          </td>
          <td>
            <input
              type="number"
              v-model.number="team.offlinePaid"
              :disabled="!isEditing[team.teamId]"
              class="editable-input"
            />
          </td>
          <td>{{ team.onlinePaid + team.offlinePaid }}</td>
          <td>
            <button
              v-if="!isEditing[team.teamId]"
              @click="startEditing(team.teamId)"
            >
              Редактировать
            </button>
            <button v-else @click="saveChanges(team)">Сохранить</button>
          </td>
        </tr>
        <tr v-if="editablePayments.length === 0">
          <td colspan="6">Данные отсутствуют</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();

const payments = computed(() => store.getters["payments/getPayments"]);
const editablePayments = ref([]);
const isEditing = ref({});
const gameId = route.params.gameId;

const fetchPayments = async () => {
  try {
    const response = await store.dispatch("payments/fetchPayments", gameId);
    if (response && Array.isArray(response)) {
      editablePayments.value = response.map((team) => ({
        ...team,
      }));
    }
  } catch (error) {
    console.error("Ошибка загрузки платежей:", error);
    alert("Не удалось загрузить данные об оплатах.");
  }
};

const startEditing = (teamId) => {
  isEditing.value = { ...isEditing.value, [teamId]: true };
};

const saveChanges = async (team) => {
  try {
    const updatedData = {
      onlinePaid: team.onlinePaid,
      offlinePaid: team.offlinePaid,
    };
    await store.dispatch("payments/updatePayment", {
      gameId,
      teamId: team.teamId,
      data: updatedData,
    });

    const index = editablePayments.value.findIndex(
      (t) => t.teamId === team.teamId
    );
    if (index !== -1) {
      editablePayments.value[index] = {
        ...editablePayments.value[index],
        ...updatedData,
      };
    }

    isEditing.value = { ...isEditing.value, [team.teamId]: false };
    alert("Изменения сохранены успешно");
  } catch (error) {
    console.error("Ошибка сохранения изменений:", error);
    alert("Не удалось сохранить изменения. Пожалуйста, попробуйте снова.");
  }
};

onMounted(fetchPayments);
</script>

<style scoped>
.admin-payments {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.payments-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.payments-table th,
.payments-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.editable-input {
  width: 100px;
  padding: 5px;
  text-align: center;
}

button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
