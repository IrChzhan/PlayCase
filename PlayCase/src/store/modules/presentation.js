import axios from 'axios';

const state = {
    presentations: [],
    activePresentation: null,
    uploadProgress: 0, 
};

const mutations = {
    SET_PRESENTATIONS(state, presentations) {
        state.presentations = presentations;
    },
    SET_ACTIVE_PRESENTATION(state, presentation) {
        state.activePresentation = presentation;
    },
    SET_UPLOAD_PROGRESS(state, progress) {
        state.uploadProgress = progress;
    },
    RESET_UPLOAD_PROGRESS(state) {
        state.uploadProgress = 0;
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
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/batch`,
                presentation,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        commit('SET_UPLOAD_PROGRESS', percentCompleted);
                    },
                    headers: {
                      'Content-Type': 'multipart/form-data'
                  },
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity,
                    maxRate: Infinity,
                    emulateJson: true,
                    timeout: 1000000 // 10 секун
                }
            );
            commit('SET_PRESENTATIONS', response.data);
            return response.data;
        } catch (error) {
          console.error('Ошибка при добавлении презентации:', error);
          if (error.response) {
              console.error('Response data:', error.response.data);
              console.error('Response status:', error.response.status);
              console.error('Response headers:', error.response.headers);
          } else if (error.request) {
              console.error('Request:', error.request);
          } else {
              console.error('Error message:', error.message);
          }
        } finally {
            commit('RESET_UPLOAD_PROGRESS');
        }
    },
  
    async addSlide({ commit }, { gameId, file }) {
      try {
          const response = await axios.post(
              `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides`,
              file,
              {
                  onUploadProgress: (progressEvent) => {
                      const percentCompleted = Math.round(
                          (progressEvent.loaded * 100) / progressEvent.total
                      );
                      commit('SET_UPLOAD_PROGRESS', percentCompleted);
                  },
              }
          );
          return response.data;
      } catch (error) {
          console.error('Ошибка при добавлении слайда:', error);
          throw error;
      } finally {
          commit('RESET_UPLOAD_PROGRESS');
      }
  },

    async replaceSlide({ commit }, { gameId, slideId, file }) {
      try {
          const response = await axios.put(
              `${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/${slideId}/replace`,
              file,
              {
                  onUploadProgress: (progressEvent) => {
                      const percentCompleted = Math.round(
                          (progressEvent.loaded * 100) / progressEvent.total
                      );
                      commit('SET_UPLOAD_PROGRESS', percentCompleted);
                  },
              }
          );
          return response.data;
      } catch (error) {
          console.error('Ошибка при замене слайда:', error);
          throw error;
      } finally {
          commit('RESET_UPLOAD_PROGRESS');
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
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/v1/game/${gameId}/slides/${slideId}/move?newIndex=${newIndex}`)
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
    presentations: (state) => state.presentations,
    activePresentation: (state) => state.activePresentation,
    uploadProgress: (state) => state.uploadProgress, 
};
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  };