import axios from 'axios';

export default {
    namespaced: true,
    state: {
        currentGame: null,
    },
    mutations: {
        SET_CURRENT_GAME(state, currentGame) {
            state.currentGame = currentGame;
        },
    },
    actions: {
        async fetchCurrentGame({ commit }) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/current`);
                commit('SET_CURRENT_GAME', response.data);
                return response.data;
            } catch (error) {
                console.error('Ошибка при получении текущей игры:', error);
                throw error;
            }
        },

        async fetchRegistrations({ commit }, gameId) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/lottery/registrations`);
                commit('SET_REGISTRATIONS', response.data);
                return response.data;
            } catch (error) {
                console.error('Ошибка при получении списка регистраций:', error);
                throw error;
            }
        },

        async fetchWinner({ commit }, gameId) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/lottery/winner`);
                commit('SET_WINNER', response.data);
                return response.data;
            } catch (error) {
                console.error('Ошибка при получении победителя:', error);
                throw error;
            }
        },

        async registerInLottery({ state, dispatch }, userData) {
            try {
                if (!state.currentGame) {
                    await dispatch('fetchCurrentGame');
                }

                const gameId = state.currentGame && state.currentGame.id;
                if (!gameId) {
                    throw new Error('Не удалось получить ID текущей игры.');
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/v1/game/current/registerInLottery`,
                    userData
                );
                return response.data;
            } catch (error) {
                console.error('Ошибка при регистрации участника:', error);
                if (error.response && error.response.data) {
                    throw new Error(error.response.data.message || 'Ошибка при регистрации');
                }
                throw new Error('Ошибка соединения с сервером.');
            }
        },
    },
    getters: {
        currentGame: (state) => {
            return state.currentGame;
        },
    },
};