import axios from 'axios';

const state = {
    payments: [],
};

const getters = {
    getPayments: (state) => state.payments,
};

const actions = {
    async fetchPayments({ commit }, gameId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/payments`);
            if (response.data && response.data.length > 0) {
                commit('setPayments', response.data);
            } else {
                const teamsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams`);
                const emptyPayments = [];
                for (const team of teamsResponse.data) {
                    emptyPayments.push({
                        teamId: team.id,
                        teamName: team.name,
                        participantsCount: team.participantsCount || 0,
                        onlinePaid: 0,
                        offlinePaid: 0,
                    });
                }
                commit('setPayments', emptyPayments);
            }
        } catch (error) {
            console.error('Ошибка загрузки данных об оплатах:', error);
            throw error;
        }
    },

    async updatePaid({ commit, state }, { gameId, teamId, teamData }) {
        try {
            // Запрос для обновления данных об оплатах команды
            await axios.put(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}/updatePaid`, {
                onlinePaid: teamData.onlinePaid,
                offlinePaid: teamData.offlinePaid,
            });

            // Локально обновляем данные
            const updatedPayments = [];
            for (const team of state.payments) {
                if (team.teamId === teamId) {
                    updatedPayments.push({
                        ...team,
                        onlinePaid: teamData.onlinePaid,
                        offlinePaid: teamData.offlinePaid,
                    });
                } else {
                    updatedPayments.push(team);
                }
            }
            commit('setPayments', updatedPayments);

        } catch (error) {
            console.error('Ошибка обновления данных об оплатах:', error);
            throw error;
        }
    },
};

const mutations = {
    setPayments(state, payments) {
        state.payments = payments;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};