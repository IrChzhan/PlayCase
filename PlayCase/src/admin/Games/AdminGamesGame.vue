<template>
  <div class="container">
    <div class="sidebar">
      <button
        v-for="item in menuItems.filter((item) => item.roles.includes(role))"
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

const role = ref()

const checkAccess =  () => {
  const personalKey = localStorage.getItem('role')
  role.value = personalKey
  if (!personalKey || role.value === 'PLAYER') {
    router.push('/')
  } else {
    router.push({ name: 'AdminGames' })
  }
}



const isRouteActive = (routeName) => {
  const temp = route.path.split('/')
  return temp.find((el) => el === routeName) !== undefined
}

const game = ref(null)
const selectedMenu = ref(0)

const Statuses = {
  PLANNED: 'Запланирована',
  FINISHED: 'Завершена',
  IN_PROGRESS: 'В процессе',
  RESULT_SUMMING: 'В процессе завершения'
};

const menuItems = [
  {
    label: 'Команды',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/team`);
      selectedMenu.value = 0;
    },
    name: 'team',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    label: 'Оплаты',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/teams/pay`);
      selectedMenu.value = 1;
    },
    name: 'pay',
    roles: ['ADMIN', 'CASHIER', 'MANAGER'],
  },
  {
    label: 'Результаты',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/teams/results`);
      selectedMenu.value = 2;
    },
    name: 'results',
    roles: ['ADMIN', 'MANAGER', 'RESULT_UPLOADER'],
  },
  {
    label: 'Лотерея',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/teams/loto`);
      selectedMenu.value = 3;
    },
    name: 'loto',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    label: 'Помощь',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/online`);
      selectedMenu.value = 4;
    },
    name: 'online',
    roles: ['ADMIN', 'CASHIER', 'MANAGER'],
  },
  {
    label: 'Презентация',
    route: () => {
      router.push(`/admin/games/${route.params.gameId}/presentation`);
      selectedMenu.value = 5;
    },
    name: 'presentation',
    roles: ['ADMIN','MANAGER','PRESENTER'],
  },
];

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

onMounted( () => {
   checkAccess()
   fetchGameById()
   if (role.value === 'CASHIER') {
    selectedMenu.value = 1
    router.push(`/admin/games/${route.params.gameId}/teams/pay`);
  } else if(role.value === 'PRESENTER'){
    selectedMenu.value = 5
    router.push(`/admin/games/${route.params.gameId}/presentation`);
  } else if (role.value == 'RESULT_UPLOADER'){
    selectedMenu.value = 2
    router.push(`/admin/games/${route.params.gameId}/teams/results`);
  }else {
    selectedMenu.value = 0
    router.push(`/admin/games/${route.params.gameId}/team`)
  }


})

watch(
  () => route.params.gameId,
  async () => {
    await fetchGameById()
    checkAccess()
    
  if (role.value === 'CASHIER') {
    selectedMenu.value = 1
    router.push(`/admin/games/${route.params.gameId}/teams/pay`);
  } else if(role.value === 'PRESENTER'){
    selectedMenu.value = 5
    router.push(`/admin/games/${route.params.gameId}/presentation`);
  }else if (role.value == 'RESULT_UPLOADER'){
    selectedMenu.value = 2
    router.push(`/admin/games/${route.params.gameId}/teams/results`);
  } else {
    selectedMenu.value = 0
    router.push(`/admin/games/${route.params.gameId}/team`)
  }
    
  },
)
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
  flex-direction: row;
  overflow: hidden;
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

@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    min-width: auto;
    margin-bottom: 20px;
  }

  .sidebar button {
    padding: 8px 12px;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .top-bar {
    padding: 10px 15px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .top-bar div {
    font-size: 16px;
    margin-bottom: 5px;
  }

  .main-content {
    width: 100%;
    padding: 0 10px;
  }
}

@media screen and (max-width: 480px) {
  .sidebar button {
    padding: 6px 10px;
    font-size: 12px;
    margin-bottom: 6px;
  }

  .top-bar {
    padding: 8px 12px;
  }

  .top-bar div {
    font-size: 14px;
    margin-bottom: 3px;
  }

  .container {
    flex-direction: column;
  }

  .main-content {
    padding: 0 5px;
  }
}


@media screen and (min-width: 2400px) and (min-height: 1400px) {
  .sidebar {
    min-width: 20%; 
    padding: 20px 0; 
  }

  .sidebar button {
    padding: 20px 30px; 
    font-size: 24px; 
    margin-bottom: 20px; 
    border-radius: 8px; 
  }

  .top-bar {
    padding: 20px 40px; 
  }

  .top-bar div {
    font-size: 36px; 
  }
}
</style>

