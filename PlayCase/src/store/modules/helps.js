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
    }
  },
  getters: {
  },
}
