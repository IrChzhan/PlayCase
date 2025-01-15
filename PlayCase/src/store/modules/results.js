import axios from 'axios'

export default {
  namespaced: true,
  state: {
    result: 0
  },
  mutations: {
    setResult(state) {
      state.result = state.result + 1
    },
  },
  actions: {
  },
  getters: {
  },
}
