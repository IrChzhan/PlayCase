import axios from 'axios'
import {createRouterMatcher as Promise} from "vue-router";

export default {
  namespaced: true,
  state() {
    return {
      places: [],
      categories: [],
      meals: {},
    }
  },
  mutations: {
    setPlaces(state, places) {
      state.places = places
    },
    addPlace(state, place) {
      state.places = [...state.places, place]
    },
    updatePlace(state, updatedPlace) {
      const index = state.places.findIndex((place) => place.id === updatedPlace.id)
      if (index !== -1) {
        state.places[index] = updatedPlace
      }
    },

    deletePlace(state, placeId) {
      state.places = state.places.filter((place) => place.id !== placeId)
    },
    setCategories(state, { placeId, categories }) {
      const updatedCategories = state.categories.filter(category => category.placeId !== placeId);
      state.categories = [...updatedCategories, ...categories.map(category => ({ ...category, placeId }))];
    },
    addCategory(state, { placeId, category }) {
      state.categories.push({ ...category, placeId });
    },
    setMeals(state, { categoryId, meals }) {
      state.meals = {
        ...state.meals,
        [categoryId]: meals,
      }
    },
  },
  actions: {
    async fetchPlaces({ commit }) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/v1/places`)
      commit('setPlaces', response.data)
    },
    async fetchPlace({ commit }, placeId) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}`)
      commit('addPlace', response.data)
    },
    async fetchCategories({ commit }, placeId) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories`
        );
        commit('setCategories', { placeId, categories: response.data });
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    },



    async fetchMeals({ commit }, { placeId, categoryId }) {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${categoryId}/meals`,
      )

      commit('setMeals', { categoryId, meals: response.data })
    },
    async createPlace({ commit }, newPlace) {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/v1/places`, newPlace)
      commit('addPlace', response.data)
    },
    async updatePlace({ commit }, updatedPlace) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/v1/places/${updatedPlace.id}`,
          {
            name: updatedPlace.name,
            address: updatedPlace.address,
          },
        )
        commit('updatePlace', response.data)
      } catch (error) {
        console.error('Ошибка обновления места:', error)
      }
    },
    async uploadImage(_, file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        console.log(file)

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/files/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response)
        return response.data.id;
      } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        throw error;
      }
    },
    async deletePlace({ commit }, placeId) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}`)
        commit('deletePlace', placeId)
      } catch (error) {
        console.error('Ошибка удаления места:', error)
      }
    },

    async addCategory({ commit }, { placeId, categoryData }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories`,
          categoryData
        );
        commit('addCategory', { placeId, category: response.data });
      } catch (error) {
        console.error('Ошибка при добавлении категории:', error);
        throw error;
      }
    },


    async updateCategory({ dispatch }, { placeId, categoryId, categoryData }) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${categoryId}`,
        categoryData,
      )
      await dispatch('fetchCategories', placeId)
    },

    async deleteCategory({ dispatch }, { placeId, categoryId }) {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${categoryId}`,
      )
      await dispatch('fetchCategories', placeId)
    },

    async addMeal({ dispatch }, { placeId, categoryId, mealData }) {
      try {
        const mealPayload = { ...mealData };
        await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${categoryId}/meals`,
          mealPayload
        );

        await dispatch('fetchMeals', { placeId, categoryId });
      } catch (error) {
        console.error('Ошибка при добавлении блюда:', error);
        throw error;
      }
    },

    async updateMeal({ dispatch }, { placeId, categoryId, mealId, mealData }) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${categoryId}/meals/${mealId}`,
        mealData,
      )
      await dispatch('fetchMeals', { placeId, categoryId })
    },

    async deleteMeal({ dispatch }, { placeId, categoryId, mealId }) {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${categoryId}/meals/${mealId}`,
      )
      await dispatch('fetchMeals', { placeId, categoryId })
    },

    async moveMeal({ dispatch }, { placeId, mealId, newCategoryId }) {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${newCategoryId}/meals/${mealId}/moveTo/${newCategoryId}`,
      )
      await dispatch('fetchMeals', {
        placeId,
        categoryId: newCategoryId,
      })
    },
  },
  getters: {
    allPlaces: (state) => state.places,
    categoriesByPlace: (state) => (placeId) =>
      state.categories.filter((category) => category.placeId === placeId),
    findPlace: (state) => (placeId) => state.places.find((place) => place.id === placeId) || {},
    mealsByCategory: (state) => (categoryId) => state.meals[categoryId] || [],
  },
}
