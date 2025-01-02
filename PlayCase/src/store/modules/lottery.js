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

        async fetchRegisteredUsers({ commit }, { gameId, teamId }) {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}/updatePaid`
                );
                commit('SET_REGISTERED_USERS', response.data);
                return response.data;
            } catch (error) {
                console.error(
                    `Ошибка при получении зарегистрированных пользователей для команды ${teamId} в игре ${gameId}:`,
                    error
                );
                throw error;
            }
        },

        async registerInLottery({ state, dispatch }, userData) {
            try {
                if (!state.currentGame) {
                    await dispatch('fetchCurrentGame');
                }

                const gameId = state.currentGame && state.currentGame.id; // Классическая проверка
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