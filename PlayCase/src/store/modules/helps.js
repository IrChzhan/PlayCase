import axios from 'axios'

export default {
  namespaced: true,
  state() {
  },
  mutations: {
  },
  actions: {
    async createHelp({ commit }) {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/help?helpType=COMMON`)
      return response.data
    }
  },
  getters: {
  },
}
