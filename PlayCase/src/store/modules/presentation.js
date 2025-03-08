import axios from 'axios';

const state = {
    presentations: [],
    activePresentation: null,
  };
  
  const mutations = {
    SET_PRESENTATIONS(state, presentations) {
      state.presentations = presentations;
    },
    SET_ACTIVE_PRESENTATION(state, presentation) {
      state.activePresentation = presentation;
    },
  };
  
  const actions = {
    async loadPresentations({ commit }, gameId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides`);
        commit('SET_PRESENTATIONS', response.data);
        return response.data;
      } catch (error) {
        console.error('Ошибка при загрузке презентаций:', error);
      }
    },
  
    async addPresentation({ commit }, { gameId, presentation }) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/batch`, presentation);
        commit('SET_PRESENTATIONS', response.data);
        return response.data;
      } catch (error) {
        console.error('Ошибка при добавлении презентации:', error);
      }
    },
  
    async deletePresentation({ commit }, { gameId, slideId }) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/${slideId}`);
        commit('SET_PRESENTATIONS', state.presentations.filter(p => p.id !== slideId));
      } catch (error) {
        console.error('Ошибка при удалении презентации:', error);
      }
    },
  
    async deleteAllPresentations({ commit }, gameId) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides`);
        commit('SET_PRESENTATIONS', []);
        return response.data;
      } catch (error) {
        console.error('Ошибка при удалении всех презентаций:', error);
      }
    },
  };
  
  const getters = {
    presentations: state => state.presentations,
    activePresentation: state => state.activePresentation,
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  };