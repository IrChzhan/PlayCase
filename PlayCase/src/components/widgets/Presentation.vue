<template>
  <div v-if="show" class="fullscreen-modal" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <div class="slides-container">
      <transition :name="transitionName" mode="out-in">
        <img v-if="currentSlide" :key="currentSlide.id" :src="currentSlide?.fileUrl" alt="Slide" class="slide-image" />
        <img v-else src="@/assets/bgPresa.jpeg" alt="slide" class="slide-image">
      </transition>
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

const touchStartX = ref(0);
const touchEndX = ref(0);
const transitionName = ref('slide-next'); 

const canPrev = computed(() => currentSlideIndex.value > 0);
const canNext = computed(() => currentSlideIndex.value < slides.value.length - 1);
const prevButtonStyle = computed(() => canPrev.value);
const nextButtonStyle = computed(() => canNext.value);

const client = new Client({
  brokerURL: "wss://back.igra-pads.ru/ws",
  reconnectDelay: 5000,
  onConnect: () => {
    client.subscribe(`/queue/game/${gameId.value}/activeSlides`, async (message) => {
      const parsedMessage = JSON.parse(message.body);
      if (parsedMessage.type === "GameActiveSlidesWsMsg") {
        slides.value = parsedMessage.payload;
        if (slides.value.length > 0) {
          const lastActiveSlideIndex = slides.value.length - 1;
          currentSlideIndex.value = lastActiveSlideIndex;
          currentSlide.value = slides.value[lastActiveSlideIndex];
        } else {
          currentSlide.value = null;
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
          if (index > currentSlideIndex.value) {
            currentSlideIndex.value = index;
            currentSlide.value = updatedSlide;
          }
        }
      }
    });
  },
  onStompError: (error) => {
    console.error("Ошибка STOMP");
  },
});

const prevSlide = () => {
  if (canPrev.value) {
    transitionName.value = 'slide-prev';
    currentSlideIndex.value--;
    currentSlide.value = slides.value[currentSlideIndex.value];
  }
};

const nextSlide = () => {
  if (canNext.value) {
    transitionName.value = 'slide-next';
    currentSlideIndex.value++;
    currentSlide.value = slides.value[currentSlideIndex.value];
  }
};

const getCurrentTeam = async () => {
  try {
    const res = await store.dispatch('profile/getCurrentTeam');
    gameId.value = res.gameId;
  } catch (e) {
  }
};

const fetchPresentation = async () => {
  try {
    const res = await store.dispatch('profile/getCurrentSlides');
    slides.value = res;
    if (slides.value.length > 0) {
      const lastActiveSlideIndex = slides.value.length - 1;
      currentSlideIndex.value = lastActiveSlideIndex;
      currentSlide.value = slides.value[lastActiveSlideIndex];
    } else {
      currentSlide.value = null;
    }
  } catch (e) {
  }
};

const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
  touchEndX.value = event.touches[0].clientX;
};

const handleTouchEnd = () => {
  if (touchStartX.value - touchEndX.value > 50) {
    nextSlide();
  } else if (touchEndX.value - touchStartX.value > 50) {
    prevSlide();
  }
};

onMounted(async () => {
  await getCurrentTeam();
  if (gameId.value) {
    await client.activate();
    await fetchPresentation();
  }
});

onBeforeUnmount(async () => {
  await client.deactivate();
});

watch(() => props.show, async (newVal) => {
  if (newVal && gameId.value) {
    await client.activate();
    await fetchPresentation(); 
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
  overflow: hidden;
}

.slide-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
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

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.2s ease-in-out;
}

.slide-next-enter-from {
  transform: translateX(100%);
}

.slide-next-leave-to {
  transform: translateX(-100%);
}

.slide-prev-enter-from {
  transform: translateX(-100%);
}

.slide-prev-leave-to {
  transform: translateX(100%);
}
</style>