<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const isMenuOpen = ref(false);
const router = useRouter();
const role = ref('');

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const checkAccess = () => {
  const personalKey = localStorage.getItem('role');
  role.value = personalKey
  if (!personalKey) {
    router.push('/auth');
  }
  if (role.value === "PLAYER") {
    router.push('/auth');
  }
  if (role.value === "MANAGER") {
    router.push({name: 'AdminGames'});
  }
};

checkAccess();

const goToPlaces = () => {
  router.push({name: 'AdminPlaces'});
};

const goToUsers = () => {
  router.push({name: 'AdminUsers'});
};

const goToGames = () => {
  router.push({name: 'AdminGames'});
};

const logout = () => {
  localStorage.removeItem('personal');
  router.push('/auth');
};
</script>

<template>
  <div>
    <div class="sidebar" :class="{ open: isMenuOpen }">
      <button class="menu-toggle" @click="toggleMenu">
        <span :class="{ 'arrow-right': !isMenuOpen, 'arrow-left': isMenuOpen }"></span>
      </button>
      <div class="menu-content">
        <button class="menu-item" @click="goToPlaces" v-if="role === 'ADMIN'">Заведения</button>
        <button class="menu-item" @click="goToUsers" v-if="role === 'ADMIN'">Пользователи</button>
        <button class="menu-item" @click="goToGames">Игры</button>
        <button class="menu-item logout" @click="logout">Выйти</button>
      </div>
    </div>

    <div class="content" :class="{ 'menu-open': isMenuOpen }">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.sidebar.open {
  transform: translateX(0);
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-item {
  background: #27364f;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
  font-size: 16px;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.menu-item.logout {
  background: #d9534f;
  color: #ffffff;
}

.menu-item.logout:hover {
  background: #c9302c;
}

.menu-toggle {
  position: absolute;
  top: 20px;
  right: -30px;
  width: 30px;
  height: 30px;
  background: #27364f;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.menu-toggle .arrow-right::before {
  content: '\25B6';
  font-size: 16px;
}

.menu-toggle .arrow-left::before {
  content: '\25C0';
  font-size: 16px;
}

.content {
  margin-left: 0;
  transition: margin-left 0.3s ease-in-out;
}

.content.menu-open {
  margin-left: 250px;
}
</style>
