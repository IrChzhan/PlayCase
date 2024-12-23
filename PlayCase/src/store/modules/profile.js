import axios from 'axios';

export default {
  namespaced: true,
  state() {
    return {
      users: [],
      currentUser: null,
      token: localStorage.getItem('authToken') || null,
    };
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('authToken', token);
    },
    LOGOUT(state) {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem('authToken');
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`);
        commit('SET_USERS', response.data);
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
    },
    async login({ commit }, loginPayload) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/authorization`, loginPayload);
        const { accessToken } = response.data;

        commit('SET_TOKEN', accessToken);

        const user = { username: loginPayload.username };
        commit('SET_CURRENT_USER', user);

        return true;
      } catch (error) {
        console.error('Ошибка при авторизации:', error);
        return false;
      }
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
  },
  getters: {
    users: (state) => state.users,
    currentUser: (state) => state.currentUser,
    token: (state) => state.token,
  },
};

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
