<template>
  <div class="container">
    <div class="sidebar">
      <button
        v-for="item in menuItems"
        :key="item.name"
        :class="{ active: isActive(item) }"
        @click="item.route"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="main-content">
      <div class="top-bar">
        <div>{{ game?.name || 'Имя не указано' }}</div>
        <div>{{ game?.place?.name || 'Место не указано' }}</div>
        <div>{{ Statuses[game?.status] || 'Статус не указан' }}</div>
      </div>

      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const route = useRoute()

const game = ref(null)
const selectedMenu = ref(0)

const Statuses = {
  PLANNED: 'Запланирована',
  FINISHED: 'Завершена',
  IN_PROGRESS: 'В процессе',
};

const menuItems = [
  {
    label: 'Команды',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/team`)
      selectedMenu.value = 0
    },
    name: 'team',
  },
  {
    label: 'Оплаты',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/teams/pay`)
      selectedMenu.value = 1
    },
    name: 'payment',
  },
  {
    label: 'Результаты',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/teams/results`)
      selectedMenu.value = 2
    },
    name: 'results',
  },
  {
    label: 'Реги Лото',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/teams/loto`)
      selectedMenu.value = 3
    },
    name: 'loto',
  },
  {
    label: 'Online',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/online`)
      selectedMenu.value = 4
    },
    name: 'online',
  }
]

const fetchGameById = async () => {
  try {
    const res = await store.dispatch('games/fetchGameById', route.params.gameId)
    game.value = res
  } catch (error) {
    console.error('Ошибка при загрузке данных об игре:', error)
  }
}

const isActive = (routeName) => {
  const temp = route.path.split('/')
  return temp.find((el) => el === routeName.name) !== undefined
}

onMounted(() => {
  fetchGameById()
  selectedMenu.value = 0
  router.push(`/admin/games/${route.params.gameId}/team`)
})

watch(
  () => route.params.gameId,
  async () => {
    await fetchGameById()
    selectedMenu.value = 0
    router.push(`/admin/games/${route.params.gameId}/team`)
  },
)
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
}

.sidebar {
  min-width: 15%;
  background-color: #f9f9f9;
  border-right: 1px solid #e0e0e0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar button {
  background: #27364f;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 10px;
  width: 90%;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
}

.sidebar button:hover {
  background: #CC9F33;
}

button.active {
  background: #CC9F33;
  color: #ffffff;
}

.main-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
}

.top-bar div {
  font-size: 20px;
}
</style>
