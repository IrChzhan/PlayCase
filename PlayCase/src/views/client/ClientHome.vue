<script setup>
import {onBeforeUnmount, onMounted, ref,computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Client} from "@stomp/stompjs";
import {useStore} from "vuex";
import ModalFeedback from "@/components/widgets/ModalFeedback.vue";
import useIdleRedirect from "@/hooks/useUserInactivity.js";
const router = useRouter()
const store = useStore()
const route = useRoute()

const showPresentation = computed({
  get: () => store.getters['presentation/show'],
  set: (value) => store.dispatch('presentation/setShow', value), 
});

useIdleRedirect(180000,showPresentation.value)

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

    client.subscribe(`/queue/game/${gameId.value}/activeSlides`, async (message) => {
      const parsedMessage = JSON.parse(message.body);
      store.commit('results/setResult')
    });

    client.subscribe(`/queue/game/${gameId.value}`, (message) => {
      const parsedMessage = JSON.parse(message.body);
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
    console.error("Ошибка STOMP");
  },
});

const handleHelpNotification = (message) => {
  messages.value.push(message);
};

const handleSetPlaceNotification = (message) => {
  if (message.type === "UserPlaceSetNotificationWsMsg") {

  }
};

const handleUserUpdateNotification = (message) => {
  if (message.type === "UserUpdateWsMsg") {

  }
};

const handleGameStatusChange = (message) => {
  if (message.type === "GameUpdateWsMsg") {

  }
};

const getCurrentTeam = async () => {
  try {
    const res = await store.dispatch('profile/getCurrentTeam')
    userId.value = res.assignedUserId
    gameId.value = res.gameId
  }catch (e) {
    console.log("Ошибка запроса команды")
  }
}
onMounted(() => {
  getCurrentTeam().then(() => {
    client.activate();
  })
  const temp = route.path.split('/')
  if (!(temp.find((el) => el !== 'watch')))  {
    router.push({name: 'TeamNameDisplay'})
  }
});

onBeforeUnmount(() => {
  client.deactivate();
});
</script>

<template>
  <router-view ></router-view>
  <ModalFeedback
    :show="show" :closeModal="closeModal"
  />
</template>

<style scoped>

</style>
