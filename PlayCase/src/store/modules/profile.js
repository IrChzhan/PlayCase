import axios from "axios";

export default {
    namespaced: true,
    state() {
        return {
            users: [],
            currentUser: null,
        };
    },
    mutations: {
        SET_USERS(state, users) {
            state.users = users;
        },
        SET_CURRENT_USER(state, user) {
            state.currentUser = user;
        },
        ADD_USER(state, user) {
            state.users.push(user);
        },
    },
    actions: {
        async fetchUsers({ commit }) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`);
                commit("SET_USERS", response.data);
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
            }
        },
        async login({ state, commit }, login) {
            const user = state.users.find((user) => user.username === login);
            if (user) {
                commit('SET_CURRENT_USER', user);
                return true;
            } else {
                return false;
            }
        },
        async addUser({ commit }, newUser) {
            try {
                const body = {
                    name: newUser.name,
                    username: newUser.login,
                    password: newUser.password,
                    authorities: [{ authority: newUser.role }],
                };
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/admin/users`,
                    body
                );
                commit("ADD_USER", response.data);
            } catch (error) {
                console.error("Ошибка при добавлении пользователя:", error);
            }
        },
    },
    getters: {
        users: (state) => state.users,
        currentUser: (state) => state.currentUser,
    },
};
