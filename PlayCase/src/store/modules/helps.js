import axios from 'axios'

export default {
  namespaced: true,
  state() {
  },
  mutations: {
  },
  actions: {
    async createHelp({ commit }, {responsible}) {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/help?responsiblePerson=${responsible}&helpType=COMMON`)
      return response.data
    },
    async getCurrentHelp({commit}) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/help/current`)
      return response.data
    }
  },
  getters: {
  },
}
