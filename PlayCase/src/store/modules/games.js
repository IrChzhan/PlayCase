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
    },
    actions: {
        async createGame({ commit }, newGame) {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/v1/games`, newGame)
            commit('addGame', response.data)
            return response.data
        },

        async fetchGameById({ commit }, gameId) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/v1/games/${gameId}`)
            return response.data
        },

        async fetchGameTeams({ commit }, gameId) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/v1/games/${gameId}/teams`)
            return response.data
        },

        async addTeamToGame({ commit }, { gameId, teamData }) {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/v1/games/${gameId}/teams`, teamData)
            return response.data
        },
    },
    getters: {
        allGames: (state) => state.games,
    },
}