<template>
  <div
    v-if="show"
    class="fullscreen-modal"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="slides-container">
      <transition :name="transitionName" mode="out-in">
        <div v-if="slides.length > 0" class="slider">
          <div
            class="slider-track"
            :class="{ 'no-animation': !isAnimationEnabled }"
            :style="{ transform: `translate3d(${offsetX}px, 0, 0)` }"
          >
            <div
              class="slide"
              :class="{ 'no-animation': !isAnimationEnabled }"
              v-for="(slide, index) in slides"
              :key="index"
              :style="{ backgroundImage: `url(${slide.fileUrl})` }"
            >
          </div>
          </div>
        </div>
        <img v-else src="@/assets/bgPresa.jpeg" alt="slide" class="slide-image" />
      </transition>
    </div>
    <div class="slides-block">
      <button v-if="slides.length > 0" class="nav-button" @click="prevSlide">
        <IconArrowLeft v-if="canPrev" />
        <IconArrowLeftEmpty v-else />
      </button>
      <button class="close-button" @click="closeModal">
        <img src="@/assets/House_5.svg" alt="Домой" class="home-button" />
      </button>
      <button v-if="slides.length > 0" class="nav-button" @click="nextSlide">
        <IconArrowRight v-if="canNext" />
        <IconArrowRightEmpty v-else />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Client } from '@stomp/stompjs'
import { useStore } from 'vuex'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconArrowLeftEmpty from '@/components/icons/IconArrowLeftEmpty.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import IconArrowRightEmpty from '@/components/icons/IconArrowRightEmpty.vue'

const props = defineProps({
  show: Boolean,
  closeModal: Function,
  gameId: String,
})

const slides = ref([])
const currentSlideIndex = ref(0)
const gameId = ref('')
const store = useStore()

const touchStartX = ref(0)
const touchEndX = ref(0)
const touchStartTime = ref(0)
const transitionName = ref(null)

const offsetX = ref(0)
const startX = ref(0)
const isDragging = ref(false)
const slideWidth = ref(1920)
const isInitialized = ref(false)
const isAnimationEnabled = ref(false)

const canPrev = computed(() => currentSlideIndex.value > 0)
const canNext = computed(() => currentSlideIndex.value < slides.value.length - 1)

let autoClickInterval = null

const autoClick = () => {
  const slides = document.querySelector('.slides-container')
  slides.click()
}

const startAutoClick = () => {
  autoClickInterval = setInterval(autoClick, 30000) 
}

const stopAutoClick = () => {
  if (autoClickInterval) {
    clearInterval(autoClickInterval)
    autoClickInterval = null
  }
}

const isImageCached = async (url) => {
  const cache = await caches.open('my-cache-v2');
  const response = await cache.match(url);
  return !!response;
};

const preloadImages = async () => {
  for (const slide of slides.value) {
    const isCached = await isImageCached(slide.fileUrl);
    if (!isCached) {
      const img = new Image();
      img.src = slide.fileUrl;
      img.onload = () => {
        caches.open('my-cache-v2').then((cache) => {
          fetch(slide.fileUrl, {
  mode: 'no-cors'
}).then((response) => {
            cache.put(slide.fileUrl, response);
          });
        });
      };
    } else {
    }
  }
};
const handleNewSlides = (newSlides, data) => {
  isAnimationEnabled.value = false

  const currentSlideIndexBeforeUpdate = currentSlideIndex.value
  const oldArray = slides.value

  newSlides.sort((a, b) => a.slideIndex - b.slideIndex)

  const currentSlideInNewArray = newSlides.findIndex(
    (slide) => slide.slideIndex === slides.value[currentSlideIndexBeforeUpdate]?.slideIndex
  )

  if (currentSlideInNewArray !== -1) {
    currentSlideIndex.value = newSlides.length - 1
  } else {
    if (currentSlideIndexBeforeUpdate >= newSlides.length) {
      currentSlideIndex.value = newSlides.length - 1
    } else {
      currentSlideIndex.value = currentSlideIndexBeforeUpdate
    }
  }

  if (oldArray.length === 0) {
    currentSlideIndex.value = newSlides.length - 1
  }

  slides.value = newSlides
  preloadImages() 

  offsetX.value = -currentSlideIndex.value * slideWidth.value
}

const client = new Client({
  brokerURL: 'wss://back.igra-pads.ru/ws',
  reconnectDelay: 5000,
  onConnect: () => {
    client.subscribe(`/queue/game/${gameId.value}/activeSlides`, async (message) => {
      const parsedMessage = JSON.parse(message.body)
      if (parsedMessage.type === 'GameActiveSlidesWsMsg') {
        handleNewSlides(parsedMessage.payload, parsedMessage)
      }
    })
  },
  onStompError: (error) => {
    console.error('Ошибка STOMP')
  },
})

const animateSlide = (targetOffset, duration = 300) => {
  const start = performance.now()
  const startOffset = offsetX.value

  const step = (timestamp) => {
    const progress = timestamp - start
    const percentage = Math.min(progress / duration, 1)
    offsetX.value = startOffset + (targetOffset - startOffset) * percentage

    if (percentage < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

const prevSlide = () => {
  if (canPrev.value) {
    isInitialized.value = true
    isAnimationEnabled.value = true
    const targetOffset = -(currentSlideIndex.value - 1) * slideWidth.value
    animateSlide(targetOffset)
    currentSlideIndex.value--
    transitionName.value = 'slide-prev'
  }
}

const nextSlide = () => {
  if (canNext.value) {
    isInitialized.value = true
    isAnimationEnabled.value = true
    const targetOffset = -(currentSlideIndex.value + 1) * slideWidth.value
    animateSlide(targetOffset)
    currentSlideIndex.value++
    transitionName.value = 'slide-next'
  }
}

const handleTouchStart = (event) => {
  isInitialized.value = true
  isAnimationEnabled.value = true
  touchStartX.value = event.touches[0].clientX
  startX.value = event.touches[0].clientX
  touchStartTime.value = performance.now()
  isDragging.value = true
}

const handleTouchMove = (event) => {
  if (!isDragging.value) return
  const clientX = event.touches[0].clientX
  const deltaX = clientX - startX.value
  const newOffset = -currentSlideIndex.value * slideWidth.value + deltaX

  if (newOffset > 0 || newOffset < -(slides.value.length - 1) * slideWidth.value) return
  offsetX.value = newOffset
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false

  const deltaX = offsetX.value + currentSlideIndex.value * slideWidth.value
  const threshold = slideWidth.value / 4
  const velocity = deltaX / (performance.now() - touchStartTime.value)

  if (Math.abs(deltaX) > threshold || Math.abs(velocity) > 0.5) {
    if (deltaX > 0 || velocity > 0.5) {
      prevSlide()
    } else {
      nextSlide()
    }
  } else {
    animateSlide(-currentSlideIndex.value * slideWidth.value, 200) 
  }
}

const getCurrentTeam = async () => {
  try {
    const res = await store.dispatch('profile/getCurrentTeam')
    gameId.value = res.gameId
  } catch (e) {}
}

const fetchPresentation = async () => {
  try {
    const res = await store.dispatch('profile/getCurrentSlides')
    slides.value = res
    if (slides.value.length > 0) {
      const lastActiveSlideIndex = slides.value.length - 1
      currentSlideIndex.value = lastActiveSlideIndex
      offsetX.value = -lastActiveSlideIndex * slideWidth.value
      preloadImages() 
    }
  } catch (e) {}
}

onMounted(async () => {
  await getCurrentTeam()
  if (gameId.value) {
    await client.activate()
    await fetchPresentation()
    setTimeout(() => {
      startAutoClick() 
    }, 1)
  }
})

onBeforeUnmount(async () => {
  await client.deactivate()
  isAnimationEnabled.value = false
  stopAutoClick() 
})

watch(
  () => props.show,
  async (newVal) => {
    if (newVal && gameId.value) {
      await client.activate()
      await fetchPresentation()
      setTimeout(() => {
        startAutoClick() 
      }, 1)
    } else {
      stopAutoClick() 
    }
  }
)

watch(
  () => slides.value,
  (newSlides, oldSlides) => {
    if (newSlides.length ===  0) {
      transitionName.value = null
    }
  },
  { deep: true } 
)
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

.slider {
  position: relative;
  width: 1920px;
  height: 1080px;
  user-select: none;
  touch-action: pan-y;
}

.slider-track {
  display: flex;
  will-change: transform;
}

.slider-track.no-animation {
  transition: none;
}

.slide {
  width: 1920px;
  height: 1080px;
  flex-shrink: 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  pointer-events: none;
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

.slide.no-animation {
  transition: none;
}
</style>