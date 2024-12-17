<template>
  <div class="container">
    <div class="container_name_team">
      <h1 class="team-name">{{ teamName }}</h1>
    </div>
    <div class="container_down_menu">
      <img src="../assets/House_01.png" class="house-image" width="80" @click="goToMenuApp">
      <div class="right-corner">
        <h1 class="team-table">{{ teamTable }}</h1>
        <p class="table-label">стол</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const teamName = route.params.teamName;
const teamTable = route.params.teamTable;

const goToMenuApp = () => {
  router.push({ name: 'MenuApp', params: { teamName: teamName.value, teamTable: teamTable.value } });
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center; 
  position: relative;
}

.team-name {
  text-align: center;
  font-size: 9em; 
  margin: 0; 
  color: var(--c-white);
  font-family: "Mulish", sans-serif;
}

.container_down_menu {
  position: relative; 
  margin-top: 60px;
}

.house-image {
  display: block;
  margin: 20px auto;
}

.right-corner {
  position: absolute;
  right: 10px;
  left: 400px;
  bottom: 20px;
  text-align: right; 
}

.team-table {
  margin: 0; 
  font-family: "Mulish", sans-serif;
  color: #CC9F33;
}

.table-label {
  margin: 0; 
  font-family: "Mulish", sans-serif;
  color: #CC9F33;
}

@media (max-width: 768px) {
  .team-name {
    font-size: 5em; 
  }
  
  .right-corner {
    right: 10px;
    bottom: 10px; 
  }
}
</style>