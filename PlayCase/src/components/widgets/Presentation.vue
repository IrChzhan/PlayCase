<template>
    <div v-if="show" class="fullscreen-modal">
      <div class="slides-container">
        <img :src="currentSlide?.fileUrl" alt="Slide" class="slide-image" />
        <div class="slides-block">
            <button class="nav-button" @click="prevSlide"><img src="@/assets/arrow-left-down.svg" alt="ArrowLeft"></button>
            <button class="close-button" @click="closeModal">X</button>
            <button class="nav-button" @click="nextSlide"><img src="@/assets/arrow-right-up.svg" alt="ArrowRight"></button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from "vue";
  import { Client } from "@stomp/stompjs";
  import { useStore } from "vuex";


  const props = defineProps({
    show: Boolean,
    closeModal: Function,
    gameId: String,
  });
  
  const slides = ref([]);
  const currentSlideIndex = ref(0);
  const currentSlide = ref(null);
  const id = ref('');
  const store = useStore();
  
  const client = new Client({
    brokerURL: "wss://back.igra-pads.ru/ws",
    reconnectDelay: 5000,
    onConnect: () => {
      console.log(id.value);
      client.subscribe(`/queue/game/${id.value}/activeSlides`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log(parsedMessage);
        if (parsedMessage.type === "GameActiveSlidesWsMsg") {
          slides.value = parsedMessage.payload;
          if (slides.value.length > 0 && !currentSlide.value) {
            currentSlide.value = slides.value[0];
          }
        }
      });
  
      client.subscribe(`/queue/admin/game/${id.value}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log(parsedMessage);
        if (parsedMessage.type === "GameSlideUpdatedWsMsg") {
          const updatedSlide = parsedMessage.payload;
          const index = slides.value.findIndex((slide) => slide.id === updatedSlide.id);
          if (index !== -1) {
            slides.value[index] = updatedSlide;
            if (currentSlide.value?.id === updatedSlide.id) {
              currentSlide.value = updatedSlide;
            }
          }
        }
      });
    },
    onStompError: (error) => {
      console.error("Ошибка STOMP:", error);
    },
  });
  
  const prevSlide = () => {
    if (currentSlideIndex.value > 0) {
      currentSlideIndex.value--;
      currentSlide.value = slides.value[currentSlideIndex.value];
    }
  };
  
  const nextSlide = () => {
    if (currentSlideIndex.value < slides.value.length - 1) {
      currentSlideIndex.value++;
      currentSlide.value = slides.value[currentSlideIndex.value];
    }
  };
  
  const fetchCurrentUser = async () => {
    try {
      const res = await store.dispatch('profile/getCurrentUser');
      id.value = res.id;
    } catch (e) {
      console.error('Error fetching current user:', e);
    }
  };
  
  const fetchPresentation = async () => {
    try {
      const res = await store.dispatch('profile/getCurrentSlides');
      slides.value = res;
      if (slides.value.length > 0) {
        currentSlide.value = slides.value[0];
      }
    } catch (e) {
      console.error('Error fetching presentation:', e);
    }
  };
  
  onMounted(async () => {
    await fetchCurrentUser();
    if (id.value) {
      client.activate();
      await fetchPresentation();
    }
  });
  
  onBeforeUnmount(() => {
    client.deactivate();
  });
  
  watch(() => props.show, (newVal) => {
    if (newVal && id.value) {
      client.activate();
    }
  });
  </script>
  
  <style scoped>
  .fullscreen-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('@/assets/background.jpg') no-repeat center center/cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .slides-container {
    width: 1920px;
    height: 1080px;
    position: relative;
  }
  
  .slide-image {
    width: 100%;
    height: 100%;
  }
  
  .slides-block {
    position: absolute;
    bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .close-button {
    background-color: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }
  
  .nav-button {
    background-color: transparent;
    border: none;
    color: white;
    font-size: 36px;
    cursor: pointer;
  }
  
  </style>