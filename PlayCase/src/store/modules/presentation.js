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
  
    async addSlide({ commit }, { gameId, file }) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides`, file);
      } catch (error) {
        console.error('Ошибка при добавлении слайда:', error);
        throw error;
      }
    },

    async replaceSlide({ commit }, { gameId, slideId, file }) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/${slideId}/replace`, file);
      } catch (error) {
        console.error('Ошибка при замене слайда:', error);
        throw error;
      }
    },

    async updateSlideGroup({ commit }, { gameId, slideId, isGroup }) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/${slideId}/group?isGroup=${isGroup}`);
      } catch (error) {
        console.error('Ошибка при обновлении группового состояния слайда:', error);
      }
    },
  
    async updateSlideActive({ commit }, { gameId, slideId, isActive }) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/${slideId}/active?isActive=${isActive}`);
      } catch (error) {
        console.error('Ошибка при обновлении активного состояния слайда:', error);
      }
    },

    async deleteSlide({ commit }, { gameId, slideId }) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/${slideId}`);
        commit('SET_PRESENTATIONS', state.presentations.filter(p => p.id !== slideId));
      } catch (error) {
        console.error('Ошибка при удалении презентации:', error);
      }
    },
    async renameSlide({ commit }, { gameId, slideId, newName }) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/${slideId}/rename?newName=${newName}`);
      } catch (error) {
        console.error('Ошибка при переименовании слайда:', error);
      }
    },
    async moveSlide({ commit }, { gameId, slideId, newIndex }) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/${slideId}/move/?newIndex=${newIndex}`)
        return response.data;
      } catch (error) {
        console.error("Ошибка при перемещении слайда:", error);
        throw error;
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