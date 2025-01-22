import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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

  async createPayment({ commit }, {amount}) {
    try {

      const paymentData ={
        amount: {
          value: `${amount}.00`,
          currency: "RUB",
        },
        payment_method_data: {
          type: "bank_card",
        },
        confirmation: {
          type: "redirect",
          return_url: "https://igra-pads.ru/client",
        },
        description: "Заказ №72",
      };

      const response = await fetch('https://igra-pads.ru/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (data.confirmation && data.confirmation.confirmation_url) {
        window.location.href = data.confirmation.confirmation_url;
      } else {
        console.error('Ошибка при создании платежа:', data);
      }
    } catch (error) {
      console.error('Ошибка при запросе на создание платежа:', error);
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
