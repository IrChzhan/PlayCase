<template>
  <div class="user-modal" v-if="show" @click.self="closeModal">
    <div class="container">
      <h1>Редактировать пользователя</h1>
      <form @submit.prevent="showUpdateDialog" class="form">
        <div class="form-group">
          <label for="name">Имя пользователя:</label>
          <div class="hint">Старое имя: {{ oldName }}</div>
          <input id="name" v-model="userName" type="text" class="input" required />
        </div>

        <div class="form-group">
          <label for="role">Роль:</label>
          <select id="role" v-model="userRole" class="input">
            <option v-for="role in roles" :key="role" :value="role">
              {{ role }}
            </option>
          </select>
        </div>

        <button
          type="button"
          class="button primary"
          :disabled="!hasChanges || loading"
          :class="{ disabled: !hasChanges || loading }"
          @click="showUpdateDialog(userId)()"
        >
          <Loader v-if="loading" /> Сохранить изменения
        </button>
      </form>

      <div class="action-buttons">
        <button
          @click="toggleUserStatus('enable', userId)()"
          class="button success"
          :disabled="loading"
          :class="{ disabled: loading }"
        >
          <Loader v-if="loading" /> Включить пользователя
        </button>
        <button
          @click="toggleUserStatus('disable', userId)()"
          class="button danger"
          :disabled="loading"
          :class="{ disabled: loading }"
        >
          <Loader v-if="loading" /> Выключить пользователя
        </button>
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

    <Notification v-if="toastMessage" :message="toastMessage" :type="toastType" :duration="3000" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'

import ConfirmDialog from '../ConfirmDialog.vue'
import Loader from '../Loader.vue'

defineProps({
  show: Boolean,
  closeModal: Function,
  userId: String,
  oldName: String,
  oldRole: String,
})

const store = useStore()

const loading = ref(false)
const userName = ref('')
const userRole = ref('')
const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const toastMessage = ref('')
const toastType = ref('success')
let dialogAction = null

const roles = ['PLAYER', 'ADMIN', 'MANAGER']

const hasChanges = computed(
  () => userName.value !== oldName || userRole.value !== oldRole,
)

const showUpdateDialog = (userId) => () => {
  dialogTitle.value = 'Подтверждение обновления'
  dialogMessage.value = 'Вы уверены, что хотите сохранить изменения?'
  dialogAction = () => updateUser(userId)
  showDialog.value = true
}

const toggleUserStatus = (action, userId) => () => {
  dialogTitle.value = `Подтверждение ${action === 'enable' ? 'включения' : 'выключения'}`
  dialogMessage.value = `Вы уверены, что хотите ${action === 'enable' ? 'включить' : 'выключить'} пользователя?`
  dialogAction = () => updateUserStatus(action, userId)
  showDialog.value = true
}

const handleConfirm = async () => {
  showDialog.value = false
  if (dialogAction) {
    await dialogAction()
  }
}

const handleCancel = () => {
  showDialog.value = false
}

const updateUser = async (userId) => {
  try {
    loading.value = true
    await store.dispatch('users/updateUser', {
      userId,
      userData: {
        name: userName.value,
        role: userRole.value,
      },
    })
    toastMessage.value = 'Пользователь успешно обновлен!'
    toastType.value = 'success'
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error)
    toastMessage.value = 'Ошибка при обновлении пользователя.'
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => (toastMessage.value = ''), 3000)
  }
}

const updateUserStatus = async (action, userId) => {
  try {
    loading.value = true
    await store.dispatch('users/updateUserStatus', {
      userId,
      action,
    })
    toastMessage.value = `Пользователь успешно ${action === 'enable' ? 'включен' : 'выключен'}!`
    toastType.value = 'success'
  } catch (error) {
    console.error(`Ошибка ${action === 'enable' ? 'включения' : 'выключения'} пользователя:`, error)
    toastMessage.value = `Ошибка при ${action === 'enable' ? 'включении' : 'выключении'} пользователя.`
    toastType.value = 'error'
  } finally {
    loading.value = false
    setTimeout(() => (toastMessage.value = ''), 3000)
  }
}
</script>

<style scoped>
.user-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}

.container {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  margin: 0 auto 20px auto;
}

.form-group {
  margin-bottom: 15px;
}

.hint {
  font-size: 12px;
  color: gray;
  margin-bottom: 5px;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.input:focus {
  outline: none;
  border-color: #4285f4;
}

.button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.button.success {
  background-color: #4caf50;
  color: white;
}

.button.success:hover:not(.disabled) {
  background-color: #43a047;
}

.button.danger {
  background-color: #f44336;
  color: white;
}

.button.danger:hover:not(.disabled) {
  background-color: #d32f2f;
}

.button.primary {
  background-color: #4285f4;
  color: white;
}

.button.primary:hover:not(.disabled) {
  background-color: #357ae8;
}

.button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
