import axios from 'axios'

export default {
  namespaced: true,
  state() {
    return {
      users: [],
      currentUser: null,
      token: localStorage.getItem('authToken') || null,
      usersPlanhet: []
    }
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users
    },
    SET_USERS_PLANSHET(state, users) {
      state.usersPlanhet = users
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('authToken', token)
    },
    SET_PLAYER_TOKEN(state, token) {
      localStorage.setItem('token', token)
    },
    SET_PLAYER_TEAM(state, name) {
      localStorage.setItem('team', name)
    },
    LOGOUT(state) {
      state.currentUser = null
      state.token = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('token')
      localStorage.removeItem('team')
    },
    DEL_NAME_TEAM(state) {
      localStorage.removeItem('team')
    },
    SET_ROLE(state, role) {
      localStorage.setItem('role', role)
    },
  },
  actions: {
    async getCurrentTeam ({commit}) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/current/team`)
        return response.data
      } catch (error) {
        console.error('Ошибка при загрузке пользователей')
      }
    },
    async getCurrent ({commit}) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/current`)
        return response.data
      } catch (error) {
        console.error('Ошибка при загрузке пользователей')
      }
    },
    async fetchUsers({ commit }) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/v1/users`)
        commit('SET_USERS', response.data)
        return response.data
      } catch (error) {
        console.error('Ошибка при загрузке пользователей')
      }
    },
    async fetchUsersPlanshet({commit}) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/users?authority=PLAYER`)
        commit('SET_USERS_PLANSHET', response.data)
        return response.data
      } catch (error) {
        console.error('Ошибка при загрузке пользователей')
      }
    },
    async getUser({ commit }, id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/v1/users/${id}`)
        return response.data
      } catch (error) {
        console.error('Ошибка при загрузке пользователей')
      }
    },
    async updateUser({ commit }, { id, payload, payload_two }) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/v1/users/${id}`,
          payload,
        )

        const response_two = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/v1/users/${id}/actions/changePassword`,
          payload_two,
        )

        return true
      } catch (e) {
        return false
      }
    },
    async login({ commit }, loginPayload) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/authorization`,
          loginPayload,
        )
        localStorage.removeItem('authToken')
        const { accessToken } = response.data
        const response_two = await axios.get(`${import.meta.env.VITE_API_URL}/v1/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        console.log(response_two.data.authorities[0].authority)
        if (response_two.data.authorities[0].authority !== 'PLAYER' ) {
          return false
        }

        commit('SET_TOKEN', accessToken)
        commit('SET_PLAYER_TOKEN', accessToken)
        const user = { username: loginPayload.username }
        commit('SET_CURRENT_USER', user)
        commit('DEL_NAME_TEAM')
        return true
      } catch (error) {
        console.error('Ошибка при авторизации')
        return false
      }
    },
    async loginPersonal({ commit }, loginPayload) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/authorization`,
          loginPayload,
        )
        const { accessToken } = response.data

        commit('SET_TOKEN', accessToken)

        const response_two = await axios.get(`${import.meta.env.VITE_API_URL}/v1/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        commit('SET_ROLE', response_two.data.authorities[0].authority)
        return true
      } catch (error) {
        console.error('Ошибка при авторизации')
        return false
      }
    },
    async addUser({ dispatch }, userPayload) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/v1/users`, userPayload)
        await dispatch('fetchUsers')
      } catch (error) {
        console.error('Ошибка при добавлении пользователя')
        throw error
      }
    },
    async getCurrentUser({commit}) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/users/me`)
        return res.data
      }catch (e) {
        console.log(e)
      }
    },
    async addMark({ dispatch }, {mark, comment}) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/v1/game/current/mark`,
          {
            mark: mark,
            comment: comment
          }
          )
      } catch (error) {
        console.error('Ошибка при добавлении пользователя')
        throw error
      }
    },
    async deleteUser({ dispatch }, id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/v1/users/${id}/actions/delete`)
        await dispatch('fetchUsers')
      } catch (error) {
        console.error('Ошибка при добавлении пользователя')
        throw error
      }
    },
    async getCurrentSlides({commit}) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/current/presentation`)
        return res.data
      }catch (e) {
      }
    },
    logout({ commit }) {
      commit('LOGOUT')
    },
  },
  getters: {
    users: (state) => state.users,
    usersPlanhet: (state) => state.usersPlanhet,
    currentUser: (state) => state.currentUser,
    token: (state) => state.token,
  },
}

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)
