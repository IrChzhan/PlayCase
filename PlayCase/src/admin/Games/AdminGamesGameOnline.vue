<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {Client} from '@stomp/stompjs';
import {useRoute} from "vue-router";
import {useStore} from "vuex";

const route = useRoute()
const store = useStore()

const gameId = route.params.gameId

const messages = ref([]);

const client = new Client({
  brokerURL: 'ws://62.113.98.45:8080/ws',
  reconnectDelay: 5000,
  onConnect: () => {
    console.log('STOMP подключен');

    client.subscribe('/queue/help/notifications', (message) => {
      const parsedMessage = JSON.parse(message.body);
      console.log(parsedMessage)
      if (parsedMessage.gameId === gameId) {
        messages.value.push(parsedMessage);
        getNotifications()
      }
    });
  },
  onStompError: (error) => {
    console.error('Ошибка STOMP:', error);
  },
});

const getNotifications = async () => {
  try {
    const res = await store.dispatch('games/fetchAllNotifications', gameId)
    messages.value = res
    console.log(res, messages)
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  client.activate();
  getNotifications()
});

onBeforeUnmount(() => {
  client.deactivate();
});
</script>

<template>
  <div class="container">
    <div class="help-header">
      <h1>Помощь</h1>
    </div>
    <div class="table-wrapper">
      <table class="messages-table">
        <thead>
        <tr>
          <th>Номер стола</th>
          <th>Команда</th>
          <th>Тип действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(msg, index) in messages" :key="index" class="message-row">
          <td>{{msg.tableNumber || 'Номер стола не указан'}}</td>
          <td>{{ msg.teamName }}</td>
          <td>Помощь</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #ffffff;
  color: #000000;
  font-family: Mulish, sans-serif;
}

.help-header h1 {
  font-size: 30px;
  margin-bottom: 20px;
  color: #000000;
  text-align: center;
}

.table-wrapper {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.messages-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.messages-table th,
.messages-table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.messages-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  text-transform: uppercase;
}

.message-row {
  transition: background-color 0.3s ease;
}

.message-row:hover {
  background-color: #f1f1f1;
}
</style>
