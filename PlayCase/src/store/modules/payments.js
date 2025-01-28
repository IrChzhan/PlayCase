import { ref } from 'vue';
import axios from 'axios';

const state = {
  payments: [],
  notifications: [],
};

const generateOrderNumber = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const length = 10; // Длина номера заказа
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  const orderNumber = `Заказ-${result}`;
  return orderNumber;
}

const getters = {
  getPayments: (state) => state.payments,
  getNotifications: (state) => state.notifications,
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

  async createPayment({ commit }, { amount }) {
    try {
      const paymentData = {
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
        description: `${generateOrderNumber()}`,
      };
      const response = await fetch('http://igra-pads.ru/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      const data = await response.json();
      if (data.confirmation && data.confirmation.confirmation_url) {
        return data.confirmation.confirmation_url;
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

  updatePayments({ commit }, payments) {
    commit('setPayments', payments);
  },

  addNotification({ commit }, notification) {
    commit('addNotification', notification);
  },
};

const mutations = {
  setPayments(state, payments) {
    state.payments = payments;
  },
  addNotification(state, notification) {
    state.notifications.push(notification);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
