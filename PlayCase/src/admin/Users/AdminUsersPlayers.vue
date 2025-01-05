<template>
  <div class="container">
    <div class="filters">
      <input type="text" placeholder="Поиск..." v-model="searchQuery" @input="filterUsers" />
      <select v-model="usersPerPage" @change="filterUsers">
        <option :value="5">5 пользователей</option>
        <option :value="10">10 пользователей</option>
        <option :value="20">20 пользователей</option>
        <option :value="50">50 пользователей</option>
      </select>
    </div>

    <table class="user-table">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Логин</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.username }}</td>
          <div class="actions">
            <button @click="goToChangeUser(user.id)()" class="icon-setting"><IconsSetting/></button>
            <button @click="showDeleteDialog(user.id)" class="icon-setting"><IconDelete/></button>
          </div>

        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Назад</button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        Вперед
      </button>
    </div>

    <div class="create-user">
      <button class="btn-add" @click="navigateToCreateUser">Создать пользователя</button>
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Notification from '@/admin/Notification.vue'
import IconsSetting from "@/components/icons/IconsSetting.vue";
import ConfirmDialog from "@/admin/ConfirmDialog.vue";
import IconDelete from "@/components/icons/IconDelete.vue";
const store = useStore()
const router = useRouter()

const toastMessage = ref('')
const toastType = ref('success')
const showModalEditUser = ref(false)
const userId = ref('')
const oldName = ref('')
const oldRole = ref('')
const currentPage = ref(1)
const usersPerPage = ref(5)
const searchQuery = ref('')
const filteredUsers = ref([])
const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
let dialogAction = null
const showDeleteDialog = (id) => {
  dialogTitle.value = 'Подтверждение удаления'
  dialogMessage.value = 'Вы уверены, что хотите удалить этого пользователя?'
  dialogAction = handleDeleteUser(id)
  showDialog.value = true
}
const handleConfirm = async () => {
  showDialog.value = false
  if (dialogAction) await dialogAction()
}

const handleCancel = () => {
  showDialog.value = false
}
const changePage = (page) => {
  currentPage.value = page
}

const goToChangeUser = (id) => () => {
  router.push(`/admin/users/players/change${id}`)
}

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage.value
  const end = start + usersPerPage.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / usersPerPage.value)
})

const openModalAdminUser = (id, name, role) => {
  showModalEditUser.value = true
  userId.value = id
  oldName.value = name
  oldRole.value = role
}

const closeModalAdminUser = () => {
  showModalEditUser.value = false
}

const navigateToCreateUser = () => {
  router.push({ name: 'AdminUserCreatePlayers' })
}

const filterUsers = () => {
  const users = store.getters['profile/users']
  filteredUsers.value = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      user.authorities[0] !== 'ADMIN' &&
      user.authorities[0] !== 'MANAGER' &&
      user.authorities.length !== 0,
  )
}
const handleDeleteUser = (id) => async () => {
  try {
    await store.dispatch('profile/deleteUser', id)
    toastMessage.value = 'Пользователь успешно удалён!'
    toastType.value = 'success'

    setTimeout(() => {
      toastMessage.value = ''
      router.push({ name: 'AdminUsersPlayers' })
      store.dispatch('profile/fetchUsers').then(() => {
        filteredUsers.value = store.getters['profile/users'].filter(
          (user) =>
            user.authorities[0] !== 'ADMIN' &&
            user.authorities[0] !== 'MANAGER' &&
            user.authorities.length !== 0,
        )
      })
    }, 1000)
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error)
    toastMessage.value = 'Ошибка при удалении пользователя'
    toastType.value = 'error'
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  }
}

onMounted(() => {
  store.dispatch('profile/fetchUsers').then(() => {
    filteredUsers.value = store.getters['profile/users'].filter(
      (user) =>
        user.authorities[0] !== 'ADMIN' &&
        user.authorities[0] !== 'MANAGER' &&
        user.authorities[0] !== 'CASHIER' &&
        user.authorities.length !== 0,
    )
  })
})
</script>

<style scoped>
.actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
}

.filters {
  display: flex;
  justify-content: space-between;
}

.filters input {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filters select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.user-table th {
  background-color: #f4f4f4;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.create-user {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #CC9F33;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}

button:hover {
  background: #3A4C6E;
  color: #CC9F33;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.icon-setting {
  padding: 10px 0 ;
  background: none;
  cursor: pointer;
}

.icon-setting:hover {
  background: none;
}

.btn-add {
  background: #CC9F33;
  color: white;
  transition: all 0.5s ease-in-out;
}

.btn-add:hover {
  background: #3A4C6E;
  color: #CC9F33;
}

</style>
