<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Client} from "@stomp/stompjs";
import {useStore} from "vuex";
import ModalFeedback from "@/components/widgets/ModalFeedback.vue";
import useIdleRedirect from "@/hooks/useUserInactivity.js";
const router = useRouter()
const store = useStore()
const route = useRoute()

useIdleRedirect(180000)

const show = ref(false)

const closeModal = () => {
  show.value = false
}

const openModal = () => {
  show.value = true
}

const userId = ref(null)
const gameId = ref(null)

const client = new Client({
  brokerURL: "wss://back.igra-pads.ru/ws",
  reconnectDelay: 5000,
  onConnect: () => {
    console.log("STOMP подключен", userId.value, gameId.value);

    client.subscribe(`/queue/game/${gameId.value}`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      console.log(parsedMessage)
      store.commit('results/setResult')
    });

    client.subscribe(`/queue/user/${userId.value}/help`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      store.commit('results/setHelps')
    })

    client.subscribe(`/queue/user/${userId.value}/set-place`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      store.commit('results/setResult')
      openModal()
    });

    client.subscribe(`/queue/user/${userId.value}`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      if (parsedMessage?.mutationType === 'TEAM_UPDATED') {
        router.push({
          name: 'HomePage'
        })
      }
      if (parsedMessage?.mutationType === "REMOVE_USER_TEAM")
        router.push({
          name: 'Watch'
        })
      if (parsedMessage?.mutationType === "SET_USER_TEAM")
        localStorage.setItem('team', 'a')
      router.push({
        name: 'HomePage'
      })
    });
  },
  onStompError: (error) => {
    console.error("Ошибка STOMP:", error);
  },
});

const handleHelpNotification = (message) => {
  console.log("Уведомление о помощи:", message);
  messages.value.push(message);
};

const handleSetPlaceNotification = (message) => {
  if (message.type === "UserPlaceSetNotificationWsMsg") {
    console.log("Уведомление о месте пользователя:", message);

  }
};

const handleUserUpdateNotification = (message) => {
  if (message.type === "UserUpdateWsMsg") {
    console.log("Обновление пользователя:", message);

  }
};

const handleGameStatusChange = (message) => {
  if (message.type === "GameUpdateWsMsg") {
    console.log("Смена статуса игры:", message);

  }
};

const getCurrentTeam = async () => {
  try {
    const res = await store.dispatch('profile/getCurrentTeam')
    userId.value = res.assignedUserId
    gameId.value = res.gameId
  }catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  getCurrentTeam().then(() => {
    client.activate();
  })
  const temp = route.path.split('/')
  console.log(temp)
  if (!(temp.find((el) => el !== 'watch')))  {
    router.push({name: 'TeamNameDisplay'})
  }
});

onBeforeUnmount(() => {
  client.deactivate();
});
</script>

<template>
  <router-view></router-view>
  <ModalFeedback
    :show="show" :closeModal="closeModal"
  />
</template>

<style scoped>

</style>
