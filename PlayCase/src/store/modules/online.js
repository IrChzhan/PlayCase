import axios from 'axios'

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    async getGame({ commit }) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/current`)
      return response.data
    }
  },
  getters: {
  },
}
