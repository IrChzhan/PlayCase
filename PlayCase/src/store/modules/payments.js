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
            if (response.data) {
                commit('setPayments', response.data);
                return response.data;
            }
            commit('setPayments', []);
            return [];
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            throw error;
        }
    },

    async updatePayment({ dispatch }, { gameId, teamId, data }) {
        try {
            const { paidByQr, paidByCard, paidByCash, actualParticipantsCount } = data;
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/teams/${teamId}/updatePaid`, {},
                {
                    params: {
                        paidByQr,
                        paidByCard,
                        paidByCash,
                        actualParticipantsCount
                    },
                },
            );
            await dispatch('fetchPayments', gameId);
            return response.data;
        } catch (error) {
            console.error('Ошибка обновления данных оплаты:', error);
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
