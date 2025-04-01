import axios from 'axios'

export default {
  namespaced: true,
  state() {
    return {
      games: {},
      gameId: null,
      currentGame: null,
      teams: {},
    }
  },
  mutations: {
    addGame(state, game) {
      state.games = [...state.games, game]
    },

    setTeams(state, { gameId, teams }) {
      state.teams[gameId] = teams
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
        teams: currentGame.teams,
      }
    },

    setGameId(state, gameId) {
      state.gameId = gameId
    },
  },
  actions: {
    async exportReview({commit}, {gameId, exportType}) {
      const response =await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/review/export?exportType=${exportType}`)
      return response
    },
    async exportLottery({commit}, {gameId, exportType}) {
      const response =await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/lottery/export?exportType=${exportType}`)
      return response
    },
    async exportPayments({commit}, {gameId, exportType}) {
      const response =await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/payments/export?exportType=${exportType}`)
      return response
    },
    async createGame({ commit }, newGame) {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/game`, newGame)
      commit('addGame', response.data)
      return response.data
    },
    async deleteGame({ commit }, gameId) {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}`)
      return response.data
    },
    async uploadResultsFile({ commit }, { gameId, file }) {
      console.log('uploadResultsFile: Начало загрузки файла результатов')
      console.log('uploadResultsFile: ID игры')
      console.log('uploadResultsFile: Файл')

      const formData = new FormData()
      formData.append('file', file)
      console.log('uploadResultsFile: FormData')
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/results`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        console.log('uploadResultsFile: Ответ сервера')
        console.log('uploadResultsFile: Данные ответа')
        console.log('uploadResultsFile: Загрузка файла результатов завершена')
        return response.data
      } catch (error) {
        console.error('uploadResultsFile: Ошибка при загрузке файла')
        if (error.response) {
          console.error('uploadResultsFile: Ошибка ответа сервера')
          console.error('uploadResultsFile: Данные ошибки')
          console.error('uploadResultsFile: Статус ошибки')
          console.error('uploadResultsFile: Заголовки ошибки')
        } else if (error.request) {
          console.error('uploadResultsFile: Ошибка запроса')
        } else {
          console.error('uploadResultsFile: Ошибка')
        }
        throw error
      }
    },

    async fetchAllGames({ commit }) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/all`)
      commit('setGames', response.data)
      return response.data
    },
    async fetchAllNotifications({ commit }, gameId) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/help/game/${gameId}/all`)
      return response.data
    },

    async fetchGameById({ commit }, gameId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}`)
        return response.data
      } catch (e) {
        console.error('Ошибка при получении текущей игры')
        throw e
      }
    },

    async deleteResult({commit}, gameId) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/results`)
      }catch (e) {
        throw e
      }
    },

    async fetchCurrentGame({ commit }) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/current`)
        commit('SET_CURRENT_GAME', response.data)
        return response.data
      } catch (error) {
        console.error('Ошибка при получении текущей игры')
        throw error
      }
    },

    async fetchTeams({ commit }, { gameId }) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams`)
        commit('setTeams', { gameId, teams: response.data })
        return response.data
      } catch (error) {
        console.error(`Ошибка получения списка команд для игры с ID`)
        throw error
      }
    },
    async fetchReview({ commit }, gameId ) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/review`)
        return response.data
      } catch (error) {
        console.error(`Ошибка получения списка команд для игры с ID`)
        throw error
      }
    },

    async uploadTeamsFile({ commit }, { gameId, file }) {
      console.log('uploadTeamsFile: Начало загрузки файла команд')
      console.log('uploadTeamsFile: ID игры')
      console.log('uploadTeamsFile: Файл')

      const formData = new FormData()
      formData.append('file', file)
      console.log('uploadTeamsFile: FormData')

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/files/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        console.log('uploadTeamsFile: Ответ сервера')
        console.log('uploadTeamsFile: Данные ответа')
        console.log('uploadTeamsFile: Загрузка файла команд завершена')
        return response.data
      } catch (error) {
        console.error('uploadTeamsFile: Ошибка при загрузке файла')
        if (error.response) {
          console.error('uploadTeamsFile: Ошибка ответа сервера')
          console.error('uploadTeamsFile: Данные ошибки')
          console.error('uploadTeamsFile: Статус ошибки')
          console.error('uploadTeamsFile: Заголовки ошибки')
        } else if (error.request) {
          console.error('uploadTeamsFile: Ошибка запроса')
        } else {
          console.error('uploadTeamsFile: Ошибка')
        }
        throw error
      }
    },

    async addTeamToGame({ commit }, { gameId, teamData }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams`,
          teamData,
        )
        return response.data
      } catch (error) {
        console.error('Ошибка добавления команды')
        throw error
      }
    },
    async updateTeamToGame({ commit }, { gameId, teamId, teamData }) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}`,
          teamData,
        )
        return response.data
      } catch (error) {
        console.error('Ошибка добавления команды')
        throw error
      }
    },
    async deleteTeamToGame({ commit }, { gameId, teamId }) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}`,
        )
        return response.data
      } catch (error) {
        console.error('Ошибка добавления команды')
        throw error
      }
    },
    async addTeamsFromFile({ commit }, { gameId, fileId }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams`,
          {
            fileId,
          },
        )
        return response.data
      } catch (error) {
        console.error('Ошибка добавления команд из файла')
        throw error
      }
    },

    async deleteTeamFromGame({ commit }, { gameId, teamId }) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}`)
    },

    async updateTeamInGame({ commit }, { gameId, teamId, teamData }) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}`,
          teamData,
        )
        return response.data
      } catch (error) {
        console.error(
          `Ошибка обновления данных команды с ID`
        )
        throw error
      }
    },

    async updateGame({ commit }, { gameId, gameData }) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}`,
          gameData,
        )
        return response.data
      } catch (error) {
        console.error(`Ошибка обновления данных команды с ID в игре с ID`)
        throw error
      }
    },

    async fetchGameResults({ commit }, gameId) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/results`,
        )
        return response.data
      } catch (error) {
        console.error(`Ошибка получения результатов игры с ID `)
        throw error
      }
    },

    async replaceTeams({ commit }, { gameId, file }) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/replace`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        console.log('Заменены команды')
        commit('setTeams', { gameId, teams: response.data })
        return response.data
      } catch (error) {
        console.error('Ошибка при замене команд')
        throw error
      }
    },

    async setUserForTeam({ commit }, { gameId, teamId, userId }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}/setUser?userId=${userId}`,
        )
        return response.data
      } catch (error) {
        console.error(
          `Ошибка установки стола `
        )
        if (error.response) {
          console.error('Ответ сервера')
        }
        throw error
      }
    },
    async unSetUserForTeam({ commit }, { gameId, teamId, userId }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}/removeUser?userId=${userId}`,
        )
        return response.data
      } catch (error) {
        console.error(
          `Ошибка установки стола`
        )
        if (error.response) {
          console.error('Ответ сервера')
        }
        throw error
      }
    },
    async setStolForTeam({ commit }, { gameId, teamId, num }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}/setTable?table=${num}`,
        )
        return response.data
      } catch (error) {
        if (error.response) {
          console.error('Ответ сервера')
        }
        throw error
      }
    },

    async activateGame({ commit }, { gameId }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/activate`,
        )
        return response.data
      } catch (error) {
        console.error(`Ошибка при активации игры с ID`)
        throw error
      }
    },

    async fetchGameStatus({ commit }, { gameId }) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/status`)
        return response.data
      } catch (error) {
        console.error(`Ошибка при получении статуса игры с ID`)
        throw error
      }
    },
    async switchStatus ({commit}, {gameId, newStatus}) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/changeStatus?newStatus=${newStatus}`)
        return response.data
      } catch (e) {
        console.error('Ошибка при получении текущей игры')
        throw e
      }
    },
    async switchStatusHelp ({commit}, {helpRequestId , newStatus}) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/help/${helpRequestId}/changeStatus?status=${newStatus}`)
        return response.data
      } catch (e) {
        console.error('Ошибка при получении текущей игры')
        throw e
      }
    },
  },
  getters: {
    allGames: (state) => state.games,
    getGameTeams: (state) => (gameId) => state.teams[gameId] || [],
  },
}
