import { createStore } from 'vuex'
import profile from './modules/profile.js'
import admin from './modules/admin.js'
import places from './modules/places.js'

export const store = createStore({
  modules: {
    profile,
    admin,
    places,
  },
})
