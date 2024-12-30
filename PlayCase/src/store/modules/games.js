import axios from 'axios'

export default {
    namespaced: true,
    state() {
        return {
            games: [],
            gameId: null,
            currentGame: null
        }
    },
    mutations: {
        addGame(state, game) {
            state.games = [...state.games, game]
        },

        setGames(state, games) {
            state.games = games
        },

        SET_PLAYER_TEAM(state, name) {
            localStorage.setItem('team', name)
        },

        SET_CURRENT_GAME(state, currentGame) {
            state.currentGame = {
                id: currentGame.id,
                plannedDate: currentGame.plannedDate,
                place: currentGame.place,
                gameNumber: currentGame.gameNumber,
                comment: currentGame.comment,
                status: currentGame.status,
                teams: currentGame.teams
            }
        },

        SET_GAME_RESULTS(state, results) {
            if (!Array.isArray(results)) {
                console.error('Попытка сохранить некорректные результаты:', results)
                return
            }

            state.gameResults = results
            console.log('Результаты игры успешно сохранены в state:', state.gameResults)
        },

        setGameId(state, gameId) {
            state.gameId = gameId;
        },
    },
    actions: {
        async createGame({ commit }, newGame) {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/game`, newGame)
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

        async updateTeamInGame({ commit }, { gameId, teamId, teamData }) {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}`,
                teamData,
            )
            return response.data
        },

        async deleteTeamFromGame({ commit }, { gameId, teamId }) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}`)
        },

        async setTableForTeam({ commit }, { gameId, teamId, tableNumber }) {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/team/${teamId}/setTable`, {
                    tableNumber,
                },
            )
            return response.data
        },

        async setUserForTeam({ commit }, { gameId, teamId, userId }) {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/team/${teamId}/setUser?userId=${userId}`,
            )

            return response.data
        },

        async getTeamByTable({ commit }, { gameId, tableNumber }) {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/team/setTable/${tableNumber}`,
            )
            return response.data
        },
        async getCurrentTeam({ commit }) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/current/team`)

            commit('SET_PLAYER_TEAM', response.data.name)

            return response.data
        },

        async uploadResultsFile({ commit }, { gameId, file }) {
            console.log('uploadResultsFile: Начало загрузки файла результатов');
            console.log('uploadResultsFile: ID игры:', gameId);
            console.log('uploadResultsFile: Файл:', file);

            const formData = new FormData();
            formData.append('file', file);
            console.log('uploadResultsFile: FormData:', formData);
            try {
                const response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/results`,
                    formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                console.log('uploadResultsFile: Ответ сервера:', response);
                console.log('uploadResultsFile: Данные ответа:', response.data);
                console.log('uploadResultsFile: Загрузка файла результатов завершена');
                return response.data;
            } catch (error) {
                console.error('uploadResultsFile: Ошибка при загрузке файла:', error);
                if (error.response) {
                    console.error('uploadResultsFile: Ошибка ответа сервера:', error.response);
                    console.error('uploadResultsFile: Данные ошибки:', error.response.data);
                    console.error('uploadResultsFile: Статус ошибки:', error.response.status);
                    console.error('uploadResultsFile: Заголовки ошибки:', error.response.headers);
                } else if (error.request) {
                    console.error('uploadResultsFile: Ошибка запроса:', error.request);
                } else {
                    console.error('uploadResultsFile: Ошибка:', error.message);
                }
                throw error
            }
        },

        async fetchGameResults({ commit }, gameId) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/results`)
                console.log('Результаты игры из API:', response.data)

                if (Array.isArray(response.data)) {
                    commit('SET_GAME_RESULTS', response.data)
                    return response.data
                } else {
                    throw new Error('Некорректный формат данных из API')
                }
            } catch (error) {
                console.error(`Ошибка при получении результатов игры с ID ${gameId}:`, error.message)
                throw error
            }
        },

        async fetchCurrentGame({ commit }) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/current`)
                commit('SET_CURRENT_GAME', response.data)
                return response.data
            } catch (error) {
                console.error('Ошибка при запросе текущей игры:', error)
                throw error
            }
        },

    },
    getters: {
        allGames: (state) => state.games,
    },
}