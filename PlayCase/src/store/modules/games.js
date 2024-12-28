import axios from 'axios'

export default {
  namespaced: true,
  state() {
    return {
      games: [],
    }
  },
  mutations: {
    addGame(state, game) {
      state.games = [...state.games, game]
    },

    setGames(state, games) {
      state.games = games
    },
  },
  actions: {
    async createGame({ commit }, newGame) {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/game/`, newGame)
      commit('addGame', response.data)
      return response.data
    },

    async fetchAllGames({ commit }) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/all`)
      commit('setGames', response.data)
      return response.data
    },

    async fetchGameById({ commit }, gameId) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}`)
      return response.data
    },

    async fetchGameTeams({ commit }, gameId) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams`)
      return response.data
    },

    async addTeamToGame({ commit }, { gameId, teamData }) {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams`,
        teamData,
      )
      return response.data
    },
  },
  getters: {
    allGames: (state) => state.games,
  },
}
