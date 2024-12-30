const state = {
  users: [],
  lastPlayerNumber: 0, // Сохранение последнего выданного номера игрока
}

const mutations = {
  ADD_USER(state, user) {
    state.users.push(user)
  },
  SET_LAST_PLAYER_NUMBER(state, number) {
    state.lastPlayerNumber = number
  },
}

const generateSequentialPlayerNumber = (state) => {
  // Увеличиваем последний номер на 1
  const nextNumber = state.lastPlayerNumber + 1
  return nextNumber
}

const actions = {
  addUser({ commit, state }, user) {
    if (
      state.users.some(
        (existingUser) =>
          existingUser.email.toLowerCase() === user.email.toLowerCase() ||
          existingUser.phone === user.phone,
      )
    ) {
      return Promise.reject('User with this email or phone number already exists')
    }

    const playerNumber = generateSequentialPlayerNumber(state)
    const userWithNumber = { ...user, playerNumber }
    commit('ADD_USER', userWithNumber)
    commit('SET_LAST_PLAYER_NUMBER', playerNumber) // Обновляем последний номер
    return Promise.resolve()
  },
}

const getters = {
  registeredUsers: (state) => state.users,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
