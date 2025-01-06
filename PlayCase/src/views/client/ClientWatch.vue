<script setup>
import {useStore} from "vuex";
import {onMounted, ref} from "vue";
import {useAuthCheck} from "@/hooks/useAuthCheck.js";

const store = useStore()

const name = ref('')


const fetchCurrentUser = async () => {
  try {
    const res = await store.dispatch('profile/getCurrentUser')
    name.value = res.name
  }catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  fetchCurrentUser()
})
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
