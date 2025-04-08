import axios from 'axios'

export default {
  namespaced: true,
  state() {
    return {
      currentCategories: null,
      places: [],
      categories: [],
      meals: {},
      placesGames: []
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
    setCurrentCattegories(state, placeId) {
      state.currentCategories = placeId
    },
    deletePlace(state, placeId) {
      state.places = state.places.filter((place) => place.id !== placeId)
    },
    setCategories(state, { placeId, categories }) {
      const updatedCategories = state.categories.filter((category) => category.placeId !== placeId)
      state.categories = [
        ...updatedCategories,
        ...categories.map((category) => ({ ...category, placeId })),
      ]
    },
    addCategory(state, { placeId, category }) {
      state.categories.push({ ...category, placeId })
    },
    setPlacesGames(state, places) {
      state.placesGames = places
    },
    setMeals(state, { categoryId, meals }) {
      state.meals = {
        ...state.meals,
        [categoryId]: meals,
      }
    }
  },
  actions: {
    async fetchPlaces({ commit }) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/v1/places`)
      commit('setPlaces', response.data)
    },
    async fetchPlacesGames({ commit }) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/place`)
      commit('setPlacesGames', response.data)
    },
    async fetchPlace({ commit }, placeId) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}`)
      commit('addPlace', response.data)
    },
    async fetchCategories({ commit }, placeId) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories`,
        )
        commit('setCategories', { placeId, categories: response.data })
        return response.data
      } catch (error) {
        console.error('Ошибка при загрузке категорий')
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
        console.error('Ошибка обновления места:')
      }
    },
    async uploadImage(_, file) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/files/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        return response.data.id
      } catch (error) {
        console.error('Ошибка при загрузке изображения')
        throw error
      }
    },
    async deletePlace({ commit }, placeId) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}`)
        commit('deletePlace', placeId)
      } catch (error) {
        console.error('Ошибка удаления места')
      }
    },

    async addCategory({ commit }, { placeId, categoryData }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories`,
          categoryData,
        )
        commit('addCategory', { placeId, category: response.data })
      } catch (error) {
        console.error('Ошибка при добавлении категории')
        throw error
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
        const mealPayload = { ...mealData }
        await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${categoryId}/meals`,
          mealPayload,
        )

        await dispatch('fetchMeals', { placeId, categoryId })
      } catch (error) {
        console.error('Ошибка при добавлении блюда')
        throw error
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
    async reorderCategories({ commit }, { placeId, categoryId, newIndex }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${categoryId}/moveTo?newIndex=${newIndex}`)
        
        return response.data
      } catch (error) {
        console.error('Ошибка при перемещении категории:', error)
        throw error
      }
    },
    async updateMealVisibility({ commit }, { placeId, categoryId, mealId, isVisible }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${categoryId}/meals/${mealId}/setVisible?isVisible=${isVisible}`)
        
      } catch (error) {
        console.error('Error updating meal visibility:', error)
        return Promise.reject(error)
      }
    },
    async reorderMeal({ commit }, { placeId, categoryId, mealId, newIndex }) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/v1/places/${placeId}/categories/${categoryId}/meals/${mealId}/move?newIndex=${newIndex}`)
        return response.data
      } catch (error) {
        console.error('Error reordering meal:', error)
        throw error
      }
    }
    
  },
  getters: {
    allPlaces: (state) => state.places,
    allGamesPlaces: (state) => state.placesGames,
    categoriesByPlace: (state) => (placeId) =>
      state.categories.filter((category) => category.placeId === placeId),
    findPlace: (state) => (placeId) => state.places.find((place) => place.id === placeId) || {},
    mealsByCategory: (state) => (categoryId) => state.meals[categoryId] || [],
  },
}
