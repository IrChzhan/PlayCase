import { createStore } from 'vuex'

import places from './modules/places.js'
import profile from './modules/profile.js'

export const store = createStore({
  modules: {
    profile,
    places,
  },
})
