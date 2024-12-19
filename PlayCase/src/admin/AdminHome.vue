<script setup>
import {useStore} from "vuex";
import router from "@/router/index.js";
const store = useStore();

const  goToPaces = () => {
  router.push({name: 'AdminPlaces'});
};

</script>

<template>
<button @click="goToPaces">Места</button>
</template>

<style scoped>

</style>