import axios from 'axios';

export default {
    namespaced: true,
    state() {
        return {
            games: [],
            gameId: null,
            currentGame: null,
        };
    },
    mutations: {
        addGame(state, game) {
            state.games = [...state.games, game];
        },

        setGames(state, games) {
            state.games = games;
        },

        SET_PLAYER_TEAM(state, name) {
            localStorage.setItem('team', name);
        },

        SET_CURRENT_GAME(state, currentGame) {
            state.currentGame = {
                id: currentGame.id,
                plannedDate: currentGame.plannedDate,
                place: currentGame.place,
                gameNumber: currentGame.gameNumber,
                comment: currentGame.comment,
                status: currentGame.status,
                teams: currentGame.teams,
            };
        },

        setGameId(state, gameId) {
            state.gameId = gameId;
        },
    },
    actions: {
        async createGame({ commit }, newGame) {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/game`, newGame);
            commit('addGame', response.data);
            return response.data;
        },

        async uploadResultsFile({ commit }, { gameId, file }) {
            console.log('uploadResultsFile: Начало загрузки файла результатов')
            console.log('uploadResultsFile: ID игры:', gameId)
            console.log('uploadResultsFile: Файл:', file)

            const formData = new FormData()
            formData.append('file', file)
            console.log('uploadResultsFile: FormData:', formData)
            try {
                const response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/results`,
                    formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                )

                console.log('uploadResultsFile: Ответ сервера:', response)
                console.log('uploadResultsFile: Данные ответа:', response.data)
                console.log('uploadResultsFile: Загрузка файла результатов завершена')
                return response.data
            } catch (error) {
                console.error('uploadResultsFile: Ошибка при загрузке файла:', error)
                if (error.response) {
                    console.error('uploadResultsFile: Ошибка ответа сервера:', error.response)
                    console.error('uploadResultsFile: Данные ошибки:', error.response.data)
                    console.error('uploadResultsFile: Статус ошибки:', error.response.status)
                    console.error('uploadResultsFile: Заголовки ошибки:', error.response.headers)
                } else if (error.request) {
                    console.error('uploadResultsFile: Ошибка запроса:', error.request)
                } else {
                    console.error('uploadResultsFile: Ошибка:', error.message)
                }
                throw error
            }
        },

        async fetchAllGames({ commit }) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/all`);
            commit('setGames', response.data);
            return response.data;
        },

        async fetchGameById({ commit }, gameId) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}`);
            return response.data;
        },

        async fetchGameTeams({ commit }, gameId) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams`);
            return response.data;
        },

        async uploadTeamsFile({ commit }, { gameId, file }) {
            console.log('uploadTeamsFile: Начало загрузки файла команд')
            console.log('uploadTeamsFile: ID игры:', gameId)
            console.log('uploadTeamsFile: Файл:', file)

            const formData = new FormData()
            formData.append('file', file)
            console.log('uploadTeamsFile: FormData:', formData)

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/v1/files/upload`,
                    formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                )

                console.log('uploadTeamsFile: Ответ сервера:', response)
                console.log('uploadTeamsFile: Данные ответа:', response.data)
                console.log('uploadTeamsFile: Загрузка файла команд завершена')
                return response.data
            } catch (error) {
                console.error('uploadTeamsFile: Ошибка при загрузке файла:', error)
                if (error.response) {
                    console.error('uploadTeamsFile: Ошибка ответа сервера:', error.response)
                    console.error('uploadTeamsFile: Данные ошибки:', error.response.data)
                    console.error('uploadTeamsFile: Статус ошибки:', error.response.status)
                    console.error('uploadTeamsFile: Заголовки ошибки:', error.response.headers)
                } else if (error.request) {
                    console.error('uploadTeamsFile: Ошибка запроса:', error.request)
                } else {
                    console.error('uploadTeamsFile: Ошибка:', error.message)
                }
                throw error
            }
        },

        async addTeamsFromFile({ commit }, { gameId, fileId }) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams`, {
                    fileId,
                });
                return response.data;
            } catch (error) {
                console.error('Ошибка добавления команд из файла:', error);
                throw error;
            }
        },

        async deleteTeamFromGame({ commit }, { gameId, teamId }) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}`);
        },

        async fetchGameResults({ commit }, gameId) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/results`);
                return response.data;
            } catch (error) {
                console.error(`Ошибка получения результатов игры с ID ${gameId}:`, error);
                throw error;
            }
        },

        async replaceTeams({ commit }, { gameId, file }) {
            const formData = new FormData()
            formData.append('file', file)

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/replace`,
                    formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )
                console.log('Заменены команды:', response.data)
                return response.data
            } catch (error) {
                console.error('Ошибка при замене команд:', error)
                throw error
            }
        }

    },
    getters: {
        allGames: (state) => state.games,
    },
};