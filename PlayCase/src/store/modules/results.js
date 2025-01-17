import axios from 'axios'

export default {
  namespaced: true,
  state: {
    result: 0,
    helps: 0,
  },
  mutations: {
    setResult(state) {
      state.result = state.result + 1
    },
    setHelps(state) {
      state.helps = state.helps + 1
    }
  },
  actions: {
  },
  getters: {
  },
}
