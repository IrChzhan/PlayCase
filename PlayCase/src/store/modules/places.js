import axios from 'axios'

export default {
  namespaced: true,
  state() {
    return {
      places: [],
      categories: {},
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
      state.categories = {
        ...state.categories,
        [placeId]: categories,
      }
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/places`)
      commit('setPlaces', response.data)
    },
    async fetchCategories({ commit }, placeId) {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/places/${placeId}/categories`,
      )
      commit('setCategories', { placeId, categories: response.data })
    },

    async fetchMeals({ commit }, { placeId, categoryId }) {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/places/${placeId}/categories/${categoryId}/meals`,
      )
      commit('setMeals', { categoryId, meals: response.data })
    },
    async createPlace({ commit }, newPlace) {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/places`, newPlace)
      commit('addPlace', response.data)
    },
    async updatePlace({ commit }, updatedPlace) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/places/${updatedPlace.id}`,
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

    async deletePlace({ commit }, placeId) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/places/${placeId}`)
        commit('deletePlace', placeId)
      } catch (error) {
        console.error('Ошибка удаления места:', error)
      }
    },

    async addCategory({ commit }, { placeId, categoryData }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/places/${placeId}/categories`,
          categoryData,
        )
        console.log(response, categoryData)
        commit('setCategories', { placeId, categories: response.data })
      } catch (error) {
        console.error('Ошибка при добавлении категории:', error)
        throw error
      }
    },

    async updateCategory({ dispatch }, { placeId, categoryId, categoryData }) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/places/${placeId}/categories/${categoryId}`,
        categoryData,
      )
      await dispatch('fetchCategories', placeId)
    },

    async deleteCategory({ dispatch }, { placeId, categoryId }) {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/places/${placeId}/categories/${categoryId}`,
      )
      await dispatch('fetchCategories', placeId)
    },

    async addMeal({ dispatch }, { placeId, categoryId, mealData }) {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/places/${placeId}/categories/${categoryId}/meals`,
        mealData,
      )
      await dispatch('fetchMeals', { placeId, categoryId })
    },

    async updateMeal({ dispatch }, { placeId, categoryId, mealId, mealData }) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/places/${placeId}/categories/${categoryId}/meals/${mealId}`,
        mealData,
      )
      await dispatch('fetchMeals', { placeId, categoryId })
    },

    async deleteMeal({ dispatch }, { placeId, categoryId, mealId }) {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/places/${placeId}/categories/${categoryId}/meals/${mealId}`,
      )
      await dispatch('fetchMeals', { placeId, categoryId })
    },

    async moveMeal({ dispatch }, { placeId, mealId, newCategoryId }) {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/places/${placeId}/categories/${newCategoryId}/meals/${mealId}/moveTo/${newCategoryId}`,
      )
      await dispatch('fetchMeals', {
        placeId,
        categoryId: newCategoryId,
      })
    },
  },
  getters: {
    allPlaces: (state) => state.places,
    categoriesByPlace: (state) => (placeId) => state.categories[placeId] || [],
    mealsByCategory: (state) => (categoryId) => state.meals[categoryId] || [],
  },
}
