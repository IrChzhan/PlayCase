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
        }
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
    },
    getters:{
        allPlaces: (state) => state.places,
    }
}