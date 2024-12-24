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
    },
    getters: {
        allGames: (state) => state.games,
    },
}