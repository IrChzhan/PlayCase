<template>
  <div class="container">
    <div class="wrapper">
      <div class="left-container">
        <div v-if="slides.length > 0" ref="slidesContainer" class="slides-container">
          <div
            v-for="slide in slides"
            :key="slide.slideIndex"
            class="slide-row"
            :data-id="slide.id"
          >
            <span class="slide-index">{{ slide.slideIndex }}</span>

            <input
             :style="{ visibility: isLeftColumnVisible ? 'visible' : 'hidden' }"
              class="checkbox"
              type="checkbox"
              v-model="slide.isGroup"
              @change="updateSlideGroup(slide)"
            />
            <input
              class="checkbox"
              type="checkbox"
              v-model="slide.isActive"
              @change="updateSlideActive(slide)"
            />
            <span
              v-if="editingSlideId !== slide.id"
              class="slide-name"
              @click="startEditing(slide)"
            >
              {{ slide.name }}
            </span>
            <div v-else class="edit-name-container">
              <input v-model="newSlideName"  @keydown.enter="confirmEditing(slide)" class="edit-name-input" />
              <button @click="confirmEditing(slide)" class="icon-setting confirm-edit"><IconArrow/></button>
              <button @click="cancelEditing" class="icon-setting cancel-edit"><IconClose/></button>
            </div>

            <img :src="slide?.fileUrl" alt="Slide" class="slide-image" />

            <div class="setting-container">
              <button v-if="(role !== 'PRESENTER')" class="reverse" @click="replaceSlide(slide)">
                <img  class="img" src="@/assets/reverse.svg" alt="reverse" />
              </button>
              <button  v-if="(role !== 'PRESENTER')" class="buck" @click="confirmDeleteSlide(slide.id)">
                <img class="img" src="@/assets/bucked.svg" alt="bucked" />
              </button>
              <button v-if="(role !== 'PRESENTER')"  class="settings drag-handle">
                <img class="img" src="@/assets/settings.svg" alt="setting" />
              </button>
            </div>
          </div>
        </div>

        <div class="empty" v-else>
          <p class="empty-text">Презентации нет</p>
        </div>
      </div>

      <button class="btn-load" v-if="(role !== 'PRESENTER')" @click="addSlide">Добавить слайд</button>
    </div>

    <div class="right-container">
      <input
        type="file"
        multiple
        ref="fileInput"
        style="display: none"
        @change="handleFileUploadAndUpload"
      />
      <button v-if="(role !== 'PRESENTER')" @click="triggerFileInput" class="btn-load">Загрузить презентацию</button>
      <button v-if="(role !== 'PRESENTER')" @click="confirmDeleteAllPresentations" class="btn-delete">Удалить презентацию</button>
      <button @click="activateAllSlides" class="btn-activate">Деактивировать все слайды</button>
      <button @click="toggleLeftColumnVisibility" class="btn-toggle">
        {{ isLeftColumnVisible ? 'Скрыть левый столбец' : 'Показать левый столбец' }}
      </button>
      <div class="progress-bar-container" v-if="uploadProgress > 0">
        <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
        <span class="progress-text">{{ uploadProgress }}%</span>
    </div>
    </div>
  </div>

  <ConfirmDialog
    v-if="showDialog"
    :visible="showDialog"
    :title="dialogTitle"
    :message="dialogMessage"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onUnmounted,watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import Sortable from "sortablejs";
import ConfirmDialog from "@/admin/ConfirmDialog.vue";
import IconArrow from "@/components/icons/IconArrow.vue";
import IconClose from "@/components/icons/IconClose.vue";

const slides = ref([]);
const selectedFiles = ref([]);
const fileInput = ref(null);
const slidesContainer = ref(null);

const showDialog = ref(false);
const dialogTitle = ref("");
const dialogMessage = ref("");
const actionType = ref("");
const slideIdToDelete = ref(null);

const editingSlideId = ref(null);
const newSlideName = ref("");

const route = useRoute();
const store = useStore();
const router = useRouter();

const role = ref('')

const isLeftColumnVisible = computed(() => store.getters['presentation/isLeftColumnVisible']);

const toggleLeftColumnVisibility = () => {
  store.dispatch('presentation/toggleLeftColumnVisibility');
};


const checkAccess = () => {
  const personalKey = localStorage.getItem('role')
  role.value = personalKey
}

const uploadProgress = computed(() => store.getters['presentation/uploadProgress']);

const loadPresentations = async () => {
  try {
    const response = await store.dispatch(
      "presentation/loadPresentations",
      route.params.gameId
    );
    slides.value = response.sort((a, b) => a.slideIndex - b.slideIndex);
  } catch (error) {
    console.error("Ошибка при загрузке слайдов:", error);
  }
};

const activateAllSlides = async () => {
  try {
    await store.dispatch("presentation/activateAllSlides", {
      gameId: route.params.gameId,
      isActive: false,
    });
    await loadPresentations();
  } catch (error) {
    console.error("Ошибка при активации всех слайдов:", error);
    alert("Произошла ошибка при активации слайдов.");
  }
};


let sortableInstance = null; 

const initSortable = () => {
  if (slidesContainer.value) {
    if (sortableInstance) {
      sortableInstance.destroy(); 
      sortableInstance = null
    }
    sortableInstance = Sortable.create(slidesContainer.value, {
      animation: 150,
      ghostClass: "ghost",
      chosenClass: "chosen",
      dragClass: "drag",
      handle: ".drag-handle",
      onEnd: async (event) => {
        const { oldIndex, newIndex } = event;
        const movedSlide = slides.value.splice(oldIndex, 1)[0];
        slides.value.splice(newIndex, 0, movedSlide);

        await updateSlideOrder(movedSlide.id, newIndex + 1);
      },
    });
  }
}

const updateSlideOrder = async (slideId, newIndex) => {
  try {
    await store.dispatch("presentation/moveSlide", {
      gameId: route.params.gameId,
      slideId: slideId,
      newIndex: newIndex
    });
  
    await loadPresentations();
  } catch (error) {
    console.error("Ошибка при обновлении порядка слайдов:", error);
  }
};

const updateSlideGroup = async (slide) => {
  try {
    await store.dispatch("presentation/updateSlideGroup", {
      gameId: route.params.gameId,
      slideId: slide.id,
      isGroup: slide.isGroup,
    });

    await loadPresentations();
  } catch (error) {
    console.error("Ошибка при обновлении группового состояния слайда:", error);
  }
};

const updateSlideActive = async (slide) => {
  try {
    await store.dispatch("presentation/updateSlideActive", {
      gameId: route.params.gameId,
      slideId: slide.id,
      isActive: slide.isActive,
    });

    await loadPresentations();
  } catch (error) {
    console.error("Ошибка при обновлении активного состояния слайда:", error);
  }
};

const deleteAllPresentations = async () => {
  try {
    await store.dispatch(
      "presentation/deleteAllPresentations",
      route.params.gameId
    );
    slides.value = [];
  } catch (error) {
    console.error("Ошибка при удалении слайдов:", error);
  }
};

const deleteSlide = async (slideId) => {
  try {
    await store.dispatch("presentation/deleteSlide", {
      gameId: route.params.gameId,
      slideId,
    });
    await loadPresentations();
  } catch (error) {
    console.error("Ошибка при удалении слайда:", error);
  }
};

const handleFileUploadAndUpload = async (event) => {
  selectedFiles.value = Array.from(event.target.files);
  if (selectedFiles.value.length === 0) {
    alert("Пожалуйста, выберите файлы для загрузки.");
    return;
  }

  try {
    const formData = new FormData();
    selectedFiles.value.forEach((file) => {
      formData.append("files", file);
    });

    await store.dispatch("presentation/addPresentation", {
      gameId: route.params.gameId,
      presentation: formData,
    });
    selectedFiles.value = [];
    await loadPresentations();
  } catch (error) {
    console.error("Ошибка при загрузке слайдов:", error);
    alert("Произошла ошибка при загрузке файлов.");
  }
};

const confirmDeleteAllPresentations = () => {
  dialogTitle.value = "Удаление презентации";
  dialogMessage.value = "Вы уверены, что хотите удалить презентацию?";
  actionType.value = "deleteAll";
  showDialog.value = true;
};

const confirmDeleteSlide = (slideId) => {
  dialogTitle.value = "Удаление слайда";
  dialogMessage.value = "Вы уверены, что хотите удалить этот слайд?";
  actionType.value = "deleteSlide";
  slideIdToDelete.value = slideId;
  showDialog.value = true;
};

const handleConfirm = async () => {
  if (actionType.value === "deleteAll") {
    await deleteAllPresentations();
  } else if (actionType.value === "deleteSlide") {
    await deleteSlide(slideIdToDelete.value);
  }
  showDialog.value = false;
};

const handleCancel = () => {
  showDialog.value = false;
};

const startEditing = (slide) => {
  editingSlideId.value = slide.id;
  newSlideName.value = slide.name;
};

const cancelEditing = () => {
  editingSlideId.value = null;
  newSlideName.value = "";
};

const confirmEditing = async (slide) => {
  if (!newSlideName.value.trim()) {
    return;
  }

  try {
    await store.dispatch("presentation/renameSlide", {
      gameId: route.params.gameId,
      slideId: slide.id,
      newName: newSlideName.value,
    });
    await loadPresentations();
    cancelEditing();
  } catch (error) {
    console.error("Ошибка при переименовании слайда:", error);
  }
};

const replaceSlide = async (slide) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      await store.dispatch("presentation/replaceSlide", {
        gameId: route.params.gameId,
        slideId: slide.id,
        file: formData,
      });

      await loadPresentations();
    } catch (error) {
      console.error("Ошибка при замене слайда:", error);
      alert("Произошла ошибка при замене слайда.");
    }
  };

  fileInput.click();
};
const triggerFileInput = () => {
  fileInput.value.click();
};

const addSlide = async () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      await store.dispatch("presentation/addSlide", {
        gameId: route.params.gameId,
        file: formData,
      });

      await loadPresentations();
    } catch (error) {
      console.error("Ошибка при добавлении слайда:", error);
      alert("Произошла ошибка при добавлении слайда.");
    }
  };

  fileInput.click();
};



onMounted(async () => {
  await loadPresentations();
  await nextTick(); 
  await initSortable(); 
  await checkAccess()
});

watch(slides, (newSlides, oldSlides) => {
  if (oldSlides.length === 0 && newSlides.length > 0) {
    nextTick(() => {
      initSortable();
    });
  }
});

onUnmounted(() => {
  if (sortableInstance) {
    sortableInstance.destroy();
  }
});

</script>

<style scoped>

.icon-setting {
    padding: 0;
    width: 40px;
    height: 40px;
  }

.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.chosen {
  background: #f0f0f0;
}

.drag {
  cursor: grab;
}

.left-container {
  display: grid;
  grid-template-rows: auto 1fr; 
  gap: 20px; 
}

.slides-container {
  display: grid;
  grid-template-rows: repeat(auto-fill, minmax(100px, 1fr)); 
  gap: 25px; 
}

.slide-row {
  display: grid;
  grid-template-columns: 50px 50px 50px 1fr 1fr 1fr; 
  align-items: center; 
  gap: 10px; 
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  background: #f9f9f9;
}

.setting-container {
  margin-left: 20px;
}

.settings {
  padding: 5px 15px;
  border-radius: 12px;
  border: none;
  background: #C59216;
  margin-left: 20px;
  cursor: pointer;
}

.img {
  width: 41px;
  height: 41px;
}

.buck {
  padding: 5px 15px;
  border-radius: 12px;
  border: none;
  background: #C59216;
  margin-left: 20px;
  cursor: pointer;
}

.reverse {
  padding: 5px 15px;
  border-radius: 12px;
  border: none;
  background: #C59216;
  cursor: pointer;
}

.checkbox {
  width: 35px;
  height: 35px;
  cursor:pointer;
}

.empty-text {
  margin-top: 55px;
}

.empty {
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 36px;
  color: black;
  font-family: "Mulish", sans-serif;
  font-weight: 500;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  gap: 20px;
}

.right-container {
  display: flex;
  flex-direction: column;
  min-width: 400px;
}

.btn-delete {
  font-family: "Mulish", sans-serif;
  font-weight: 500;
  font-size: 28px;
  padding: 18px;
  border: none;
  border-radius: 15px;
  background: #d9534f;
  color: #ffffff;
  margin-top: 20px;
  cursor: pointer;
}

.btn-load {
  margin-top: 55px;
  font-family: "Mulish", sans-serif;
  font-weight: 500;
  font-size: 28px;
  padding: 18px;
  border: none;
  border-radius: 15px;
  background: #C59216;
  color: #FFFFFF;
  cursor: pointer;
}

.slide-index {
  font-family: "Mulish", sans-serif;
  font-weight: 700;
  font-size: 36px;
  width: 30px;
  text-align: center;
  margin-right: 35px;
}

.slide-name {
  font-family: "Mulish", sans-serif;
  font-weight: 500;
  font-size: 36px;
  margin-left: 25px;
  cursor: pointer;
}

.edit-name-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-name-input {
  width: 250px;
  font-family: "Mulish", sans-serif;
  font-weight: 500;
  font-size: 28px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.confirm-edit, .cancel-edit {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  width: 40px;
  height: 40px;
}

.confirm-edit:hover, .cancel-edit:hover {
  color: #C59216;
}

.slide-image {
  margin-left: 80px;
  width: 160px;
  height: 90px;
  border: none;
  border-radius: 15px;
  object-fit: cover;
  user-select: none;
}

.progress-bar-container {
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 5px;
  margin-top: 20px;
  position: relative;
}

.progress-bar {
  height: 20px;
  background-color: #C59216;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 14px;
}

.btn-activate {
  font-family: "Mulish", sans-serif;
  font-weight: 500;
  font-size: 28px;
  padding: 18px;
  border: none;
  border-radius: 15px;
  background: #5cb85c;
  color: #ffffff;
  margin-top: 20px;
  cursor: pointer;
}

.btn-toggle {
  font-family: "Mulish", sans-serif;
  font-weight: 500;
  font-size: 28px;
  padding: 18px;
  border: none;
  border-radius: 15px;
  background: #27364f;
  color: #ffffff;
  margin-top: 20px;
  cursor: pointer;
}


</style>