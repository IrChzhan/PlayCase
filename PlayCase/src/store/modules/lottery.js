const state = {
  users: [],
}

const mutations = {
  ADD_USER(state, user) {
    state.users.push(user)
  },
}

const generateUniquePlayerNumber = (state) => {
  let number
  do {
    number = Math.floor(Math.random() * 100) + 1
  } while (state.users.some((user) => user.playerNumber === number))
  return number
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

    const playerNumber = generateUniquePlayerNumber(state)
    const userWithNumber = { ...user, playerNumber }
    commit('ADD_USER', userWithNumber)
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
