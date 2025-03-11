<template>
  <div v-if="show" class="fullscreen-modal">
    <div class="slides-container">
      <img v-if="currentSlide" :src="currentSlide?.fileUrl" alt="Slide" class="slide-image" />
      <div class="empty" v-else>
        <span class="empty-text">Трансляция скоро начнется</span>
      </div>
    </div>
    <div class="slides-block">
      <button v-if="currentSlide" class="nav-button" @click="prevSlide">
        <IconArrowLeft v-if="prevButtonStyle"/>
        <IconArrowLeftEmpty v-else/>
      </button>
      <button class="close-button" @click="closeModal">
        <img src="@/assets/House_5.svg" alt="Домой" class="home-button" />
      </button>
      <button v-if="currentSlide" class="nav-button" @click="nextSlide">
        <IconArrowRight v-if="nextButtonStyle"/>
        <IconArrowRightEmpty v-else/>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Client } from "@stomp/stompjs";
import { useStore } from "vuex";
import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
import IconArrowLeftEmpty from "@/components/icons/IconArrowLeftEmpty.vue";
import IconArrowRight from "@/components/icons/IconArrowRight.vue";
import IconArrowRightEmpty from "@/components/icons/IconArrowRightEmpty.vue";


const props = defineProps({
  show: Boolean,
  closeModal: Function,
  gameId: String,
});

const slides = ref([]);
const currentSlideIndex = ref(0);
const currentSlide = ref(null);
const gameId = ref('');
const store = useStore();

const canPrev = computed(() => currentSlideIndex.value > 0);

const canNext = computed(() => currentSlideIndex.value < slides.value.length - 1);

const prevButtonStyle = computed(() => canPrev.value ? true : false);

const prevArrowStyle = computed(() => ({
  opacity: canPrev.value ? true : false,
}));

const nextButtonStyle = computed(() => canNext.value ? true : false);

const nextArrowStyle = computed(() => ({
  opacity: canNext.value ? true : false,
}));

const client = new Client({
  brokerURL: "wss://back.igra-pads.ru/ws",
  reconnectDelay: 5000,
  onConnect: () => {
    console.log(gameId.value, 'presa')
    client.subscribe(`/queue/game/${gameId.value}/activeSlides`, async (message) => {
      const parsedMessage = JSON.parse(message.body);
      if (parsedMessage.type === "GameActiveSlidesWsMsg") {
        slides.value = parsedMessage.payload;
        if (slides.value.length > 0 && !currentSlide.value) {
          currentSlide.value = slides.value[0];
         
        }
        await fetchPresentation();
        if (slides.value.length === 1) {
            currentSlideIndex.value = 0
          }
      }
    });

    client.subscribe(`/queue/admin/game/${gameId.value}`, async (message) => {
      const parsedMessage = JSON.parse(message.body);
      if (parsedMessage.type === "GameSlideUpdatedWsMsg") {
        const updatedSlide = parsedMessage.payload;
        const index = slides.value.findIndex((slide) => slide.id === updatedSlide.id);
        if (index !== -1) {
          slides.value[index] = updatedSlide;
          if (currentSlide.value?.id === updatedSlide.id) {
            currentSlide.value = updatedSlide;
            
          }
          await fetchPresentation();
          if (slides.value.length === 1) {
              currentSlideIndex.value = 0
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
  if (canPrev.value) {
    currentSlideIndex.value--;
    currentSlide.value = slides.value[currentSlideIndex.value];
  }
};

const nextSlide = () => {
  if (canNext.value) {
    currentSlideIndex.value++;
    currentSlide.value = slides.value[currentSlideIndex.value];
  }
};

const getCurrentTeam = async () => {
  try {
    const res = await store.dispatch('profile/getCurrentTeam')
    gameId.value = res.gameId
  }catch (e) {
    console.log(e)
  }
}

const fetchPresentation = async () => {
  try {
    const res = await store.dispatch('profile/getCurrentSlides');
    slides.value = res;
    if (slides.value.length > 0) {
      currentSlide.value = slides.value[0];
    } else {
      currentSlide.value = null
    }
  } catch (e) {
    console.error('Error fetching presentation:', e);
  }
};

onMounted(async () => {
  await getCurrentTeam();
  if (gameId.value) {
    await client.activate();
    await fetchPresentation();
  }
});

onBeforeUnmount( async () => {
  await client.deactivate();
});

watch(() => props.show, async (newVal) => {
  if (newVal && gameId.value) {
    await client.activate();
  }
});
</script>

<style scoped>
.empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;  
}

.empty-text {
  font-family: 'Mulish', sans-serif;
  font-weight: 700;
  font-size: 46px;
}

.home-button {
  width: 90px;
  height: 90px;
  cursor: pointer;
}

.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background: url('@/assets/background.jpg') no-repeat center center/cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.slides-container {
  width: 1920px;
  height: 1080px;
  position: relative;
  background: white;
}

.slide-image {
  width: 100%;
  height: 100%;
}

.slides-block {
  margin-top: 10px; 
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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