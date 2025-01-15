<template>
  <div class="admin-payments">
    <h1>Управление оплатами</h1>
    <div class="table-container">
    <table class="payments-table">
      <thead>
      <tr>
        <th>#</th>
        <th>Название команды</th>
        <th>Ожидаемое количество участников</th>
        <th>Оплачено QR</th>
        <th>Оплачено картой</th>
        <th>Оплачено налом</th>
        <th>Предоплата</th>
        <th>Итого</th>
        <th>Фактическое количество участников</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(team, index) in editablePayments"
        :key="team.id"
        :class="{
            'row-complete': team.totalPayments === team.actualParticipantsCount && team.actualParticipantsCount !== 0 && team.totalPayments !== 0,
            'row-incomplete': team.totalPayments !== team.actualParticipantsCount
          }"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ team.teamName }}</td>
        <td>{{ team.expectedParticipantsCount }}</td>
        <td>
          {{ team.paidByQr }}
        </td>
        <td>
          <input
            type="text"
            v-model.number="team.paidByCard"
            class="editable-input"
            @input="updateTotal(team)"
            @blur="saveChanges(team)"
          />
        </td>
        <td>
          <input
            type="text"
            v-model.number="team.paidByCash"
            class="editable-input"
            @input="updateTotal(team)"
            @blur="saveChanges(team)"
          />
        </td>
        <td>
          <input
            type="text"
            v-model.number="team.prepaidCount"
            class="editable-input"
            @input="updateTotal(team)"
            @blur="saveChanges(team)"
          />
        </td>
        <td>{{ team.totalPayments }}</td>
        <td>
          <input
            type="text"
            v-model.number="team.actualParticipantsCount"
            class="editable-input"
            @blur="saveChanges(team)"
          />
        </td>
      </tr>
      <tr v-if="editablePayments.length === 0">
        <td colspan="9">Данные отсутствуют</td>
      </tr>
      </tbody>
    </table>
    </div>
    <div class="button-container">
      <button class="btn" @click="exportPayments">Экспорт</button>
    </div>
  </div>
  <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000"/>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import Notification from "@/admin/Notification.vue";

const store = useStore();
const route = useRoute();
const toastMessage = ref('');
const toastType = ref('success');
const payments = computed(() => store.getters["payments/getPayments"]);
const editablePayments = ref([]);
const gameId = route.params.gameId;

const exportPayments = async () => {
  try {
    const response = await store.dispatch("games/exportPayments", {
      gameId: route.params.gameId,
      exportType: "CSV",
    });

    const data = response.data.split("\n");
    const csvContent = data
      .map((row) => row.split(",").join(";"))
      .join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "payments.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error("Ошибка экспорта:", e);
  }
};

const fetchPayments = async () => {
  try {
    const response = await store.dispatch("payments/fetchPayments", gameId);
    if (response && Array.isArray(response)) {
      editablePayments.value = response.map((team) => ({
        ...team,
        totalPayments:
          team.paidByQr + team.paidByCard + team.paidByCash + team.prepaidCount,
      })).sort((a, b) => a.teamName.localeCompare(b.teamName, "ru"));
    }
  } catch (error) {
    console.error("Ошибка загрузки платежей:", error);
    alert("Не удалось загрузить данные об оплатах.");
  }
};

const saveChanges = async (team) => {
  try {
    const updatedData = {
      id: team.id,
      teamId: team.teamId,
      teamName: team.teamName,
      expectedParticipantsCount: team.expectedParticipantsCount,
      paidByQr: team.paidByQr || 0,
      paidByCard: team.paidByCard || 0,
      paidByCash: team.paidByCash || 0,
      prepaidCount: team.prepaidCount || 0,
      actualParticipantsCount: team.actualParticipantsCount || 0,
      totalPayments: team.totalPayments || 0,
    };

    await store.dispatch("payments/updatePayment", {
      gameId,
      teamId: team.teamId,
      data: updatedData,
    });

    const index = editablePayments.value.findIndex((t) => t.id === team.id);
    if (index !== -1) {
      editablePayments.value[index] = Object.assign(
        {},
        editablePayments.value[index],
        updatedData
      );

    }
    toastMessage.value = 'Оплаты успешно изменены!';
    toastType.value = 'success';
    setTimeout(() => {
      toastMessage.value = '';
    }, 1000);
  } catch (error) {
    console.error("Ошибка обновления данных оплаты:", error);
    toastMessage.value = 'Ошибка обновления данных оплаты.';
    toastType.value = 'error';
    setTimeout(() => {
      toastMessage.value = '';
    }, 1000);
  }
};

const updateTotal = (team) => {
  team.totalPayments =
    team.paidByQr + team.paidByCard + team.paidByCash + team.prepaidCount;
};

onMounted(fetchPayments);
</script>

<style scoped>
.admin-payments {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.btn {
  background: #cc9f33;
}

.btn:hover {
  background: #d1aa58;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

h1 {
  text-align: center;
  color: #333;
}

.payments-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  overflow-x: auto;
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

.editable-input:focus {
  outline: 2px solid #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  border: 1px solid #007bff;
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


 .admin-payments {
   padding: 20px;
   font-family: Arial, sans-serif;
 }

.btn {
  background: #cc9f33;
}

.btn:hover {
  background: #d1aa58;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

h1 {
  text-align: center;
  color: #333;
}

.table-container {
  width: 100%;
  overflow-x: auto;
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

.editable-input:focus {
  outline: 2px solid #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  border: 1px solid #007bff;
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

