<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Client } from '@stomp/stompjs';
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();

const gameId = route.params.gameId;

const messages = ref([]);

const client = new Client({
  brokerURL: 'ws://62.113.98.45:8080/ws',
  reconnectDelay: 5000,
  onConnect: () => {
    console.log('STOMP подключен');

    client.subscribe('/queue/help/notifications', (message) => {
      const parsedMessage = JSON.parse(message.body);
      console.log(parsedMessage);
      if (parsedMessage.gameId === gameId) {
        messages.value.push(parsedMessage);
        sortMessages();
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
    const res = await store.dispatch('games/fetchAllNotifications', gameId);
    messages.value = res;
    sortMessages();
  } catch (e) {
    console.log(e);
  }
};

const sortMessages = () => {
  messages.value.sort((a, b) => {
    const statusOrder = { 'RESOLVED': 2, 'IN_PROGRESS': 1, 'CREATED': 0 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
};

const typesHelp = {
  'WAITER': 'Официант',
  'HELPER': 'Помощник',
};

const typesStatuses = {
  'CREATED': 'Создан',
  'IN_PROGRESS': 'Помощь в пути',
  'RESOLVED': 'Помощь оказана',
};

const changeStatus = (id) => {
  router.push(`/admin/games/${route.params.gameId}/online/${id}/changeStatus`);
};

onMounted(() => {
  client.activate();
  getNotifications();
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
          <th>Тип помощи</th>
          <th>Статус</th>
          <th>Изменение статуса</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(msg, index) in messages" :key="index" class="message-row">
          <td :class="{
    'status-finished': msg.status === 'RESOLVED',
    'status-in-progress': msg.status === 'IN_PROGRESS'
  }">{{msg.tableNumber || 'Номер стола не указан'}}</td>
          <td :class="{
    'status-finished': msg.status === 'RESOLVED',
    'status-in-progress': msg.status === 'IN_PROGRESS'
  }">{{ msg.teamName }}</td>
          <td :class="{
    'status-finished': msg.status === 'RESOLVED',
    'status-in-progress': msg.status === 'IN_PROGRESS'
  }">{{ typesHelp[msg.responsiblePerson] }}</td>
          <td
            :class="{
          'status-finished': msg.status === 'RESOLVED',
          'status-in-progress': msg.status === 'IN_PROGRESS'
          }">{{ typesStatuses[msg.status] }}</td>
          <td :class="{
    'status-finished': msg.status === 'RESOLVED',
    'status-in-progress': msg.status === 'IN_PROGRESS'
  }"><button class="button primary btn-add" @click.stop="changeStatus(msg.id)">Сменить статус</button></td>
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

.button {
  margin: 0 auto;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #CC9F33;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.button:hover {
  background: #d1aa58;
}

.table-wrapper {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
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

.status-finished {
  background-color: #ffcccc;
}

.status-result {
  background-color: #fff2cc;
}

.status-in-progress {
  background-color: #ccffcc;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .help-header h1 {
    font-size: 24px;
  }

  .messages-table th, .messages-table td {
    font-size: 14px;
    padding: 8px;
  }

  .button {
    font-size: 14px;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .messages-table th, .messages-table td {
    font-size: 12px;
    padding: 6px;
  }

  .button {
    font-size: 12px;
    padding: 6px;
  }

  .help-header h1 {
    font-size: 20px;
  }
}
</style>
