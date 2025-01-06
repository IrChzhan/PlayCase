<template>
  <div class="admin-payments">
    <h1>Управление оплатами</h1>

    <table class="payments-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Название команды</th>
          <th>Оплачено QR</th>
          <th>Оплачено картой</th>
          <th>Оплачено налом</th>
          <th>Предоплата</th>
          <th>Итого</th>
          <th>Фактическое кол-во участников</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(team, index) in editablePayments"
          :key="team.id"
          :class="{
            'row-complete': team.totalPayments === team.actualParticipantsCount,
            'row-incomplete': team.totalPayments !== team.actualParticipantsCount
          }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ team.teamName }}</td>
          <td>
            <input
              type="number"
              v-model.number="team.paidByQr"
              :disabled="!isEditing[team.id]"
              class="editable-input"
            />
          </td>
          <td>
            <input
              type="number"
              v-model.number="team.paidByCard"
              :disabled="!isEditing[team.id]"
              class="editable-input"
            />
          </td>
          <td>
            <input
              type="number"
              v-model.number="team.paidByCash"
              :disabled="!isEditing[team.id]"
              class="editable-input"
            />
          </td>
          <td>
            <input
              type="number"
              v-model.number="team.prepaidCount"
              :disabled="!isEditing[team.id]"
              class="editable-input"
            />
          </td>
          <td>{{ team.paidByQr + team.paidByCard + team.paidByCash + team.prepaidCount }}</td>
          <td>
            <input
              type="number"
              v-model.number="team.actualParticipantsCount"
              :disabled="!isEditing[team.id]"
              class="editable-input"
            />
          </td>
          <td>
            <button
              v-if="!isEditing[team.id]"
              @click="startEditing(team.id)"
            >
              Редактировать
            </button>
            <button v-else @click="saveChanges(team)">Сохранить</button>
          </td>
        </tr>
        <tr v-if="editablePayments.length === 0">
          <td colspan="9">Данные отсутствуют</td>
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
        totalPayments: team.paidByQr + team.paidByCard + team.paidByCash + team.prepaidCount
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
      paidByQr: team.paidByQr,
      paidByCard: team.paidByCard,
      paidByCash: team.paidByCash,
      prepaidCount: team.prepaidCount,
      actualParticipantsCount: team.actualParticipantsCount
    };

    await store.dispatch("payments/updatePayment", {
      gameId,
      teamId: team.id,
      data: updatedData
    });

    const index = editablePayments.value.findIndex((t) => t.id === team.id);
    if (index !== -1) {
      editablePayments.value[index] = {
        ...editablePayments.value[index],
        ...updatedData,
        totalPayments:
          updatedData.paidByQr +
          updatedData.paidByCard +
          updatedData.paidByCash +
          updatedData.prepaidCount
      };
    }

    isEditing.value = { ...isEditing.value, [team.id]: false };
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

.row-complete {
  background-color: #d4edda;
}

.row-incomplete {
  background-color: #f8d7da;
}
</style>
