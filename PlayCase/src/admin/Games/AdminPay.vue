<template>
    <div class="admin-payments">
      <h1>Управление оплатами</h1>
  
      <table class="payments-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Название команды</th>
            <th>Кол-во заявлено</th>
            <th>Кол-во оплачено</th>
            <th>Онлайн оплаты</th>
            <th>Офлайн оплаты</th>
            <th>Итого</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, index) in payments" :key="team.teamId">
            <td>{{ index + 1 }}</td>
            <td>{{ team.teamName }}</td>
            <td>{{ team.participantsCount }}</td>
            <td>
              <input
                type="number"
                v-model.number="team.totalPaid"
                :disabled="true"
                class="readonly-input"
              />
            </td>
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
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useStore } from "vuex";
  
  const store = useStore();
  const route = useRoute();
  
  const payments = ref([]);
  const isEditing = ref({});
  const gameId = route.params.gameId;
  
  const fetchPayments = async () => {
    try {
      const response = await store.dispatch("payments/fetchPayments", gameId);
      
      // Проверка на наличие данных
      if (response && Array.isArray(response)) {
        const fetchedPayments = [];
  
        // Заполняем массив вручную
        for (let i = 0; i < response.length; i++) {
          const team = response[i];
          fetchedPayments.push({
            teamId: team.teamId,
            teamName: team.teamName,
            participantsCount: team.participantsCount || 0,
            onlinePaid: team.onlinePaid || 0,
            offlinePaid: team.offlinePaid || 0,
            totalPaid: (team.onlinePaid || 0) + (team.offlinePaid || 0),
          });
        }
  
        payments.value = fetchedPayments;
      } else {
        console.warn("Нет данных о платежах. Проверьте ответ сервера.");
        payments.value = [];
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
      await store.dispatch("payments/updatePaid", {
        gameId,
        teamId: team.teamId,
        teamData: {
          onlinePaid: team.onlinePaid,
          offlinePaid: team.offlinePaid,
        },
      });
      alert("Изменения успешно сохранены!");
      isEditing.value = { ...isEditing.value, [team.teamId]: false };
    } catch (error) {
      console.error("Ошибка сохранения изменений:", error);
      alert("Ошибка при сохранении изменений. Попробуйте снова.");
    }
  };
  
  onMounted(async () => {
    await fetchPayments();
  });
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
  
  .editable-input,
  .readonly-input {
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
  