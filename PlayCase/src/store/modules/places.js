import axios from "axios"

export default {
    namespaced: true,
    state(){
        return {
            places: []
        }
    },
    mutations:{
        setPlaces(state, places){
            state.places = places
        },
        addPlace(state, place) {
            state.places = [...state.places, place]
        },
        updatePlace(state, updatedPlace) {
            const index = state.places.findIndex(place => place.id === updatedPlace.id);
            if (index !== -1) {
                state.places[index] = updatedPlace;
            }
        },

        deletePlace(state, placeId) {
            state.places = state.places.filter(place => place.id !== placeId);
        },
    },
    actions:{
        async fetchPlaces({ commit }) {
            const response = await axios.get('http://localhost:8080/admin/places');
            commit('setPlaces', response.data);
        },
        async createPlace({ commit }, newPlace) {
            const response = await axios.post('http://localhost:8080/admin/places', newPlace);
            commit('addPlace', response.data);
        },
        async updatePlace({ commit }, updatedPlace) {
            try {
                const response = await axios.put(`/admin/places/${updatedPlace.id}`, updatedPlace);
                commit('updatePlace', response.data);
            } catch (error) {
                console.error('Ошибка обновления места:', error);
            }
        },

        async deletePlace({ commit }, placeId) {
            try {
                await axios.delete(`/admin/places/${placeId}`);
                commit('deletePlace', placeId);
            } catch (error) {
                console.error('Ошибка удаления места:', error);
            }
        },
    },
    getters:{
        allPlaces: (state) => state.places,
    }
}