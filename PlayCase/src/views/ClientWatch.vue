<script setup>
import {useStore} from "vuex";
import {onBeforeUnmount, onMounted, ref} from "vue";
import axios from "axios";
import {Client} from "@stomp/stompjs";
import {useRouter} from "vue-router";

const store = useStore()
const router = useRouter()

const name = ref('')
const token = ref('')
const team = ref('')
const id = ref('')



const client = new Client({
  brokerURL: "ws://62.113.98.45:8080/ws",
  reconnectDelay: 5000,
  onConnect: () => {
    client.subscribe(`/queue/user/${id.value}`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      if (parsedMessage?.mutationType === "SET_USER_TEAM")
        fetchTeam()
    });
  },
  onStompError: (error) => {
    console.error("Ошибка STOMP:", error);
  },
});

const fetchCurrentUser = async () => {
  try {
    const res = await store.dispatch('profile/getCurrentUser')
    name.value = res.name
    id.value = res.id
  }catch (e) {
    localStorage.removeItem('token')
    router.push('/')
    console.log('a')
  }
}

const fetchTeam = async() => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/current/team`, {
      headers: {Authorization: `Bearer ${token.value}`},
    })
    team.value = res.data.name
    localStorage.setItem('team', JSON.stringify(team.value))
    router.push('/client')
  } catch (e) {
    console.log(e)
  }

}

onMounted(() => {
  token.value = localStorage.getItem('token')
  if (token.value === null) {
    router.push('/')
  }
  fetchCurrentUser().then(() => {
    client.activate()
  })
  fetchTeam()
})

onBeforeUnmount(() => {
  client.deactivate();
});

</script>

<template>
  <div class="home-page">
    <div class="button-container">
      <h1>{{name}}</h1>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1b2a46;
}

.button-container {
  display: flex;
  gap: 20px;
}

h1 {
  font-family: "Mulish", sans-serif;
  font-size: 46px;
  color: white;
}

</style>
