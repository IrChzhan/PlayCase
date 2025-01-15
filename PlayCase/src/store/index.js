import {createStore} from 'vuex'

import games from './modules/games'
import lottery from './modules/lottery.js'
import places from './modules/places.js'
import profile from './modules/profile.js'
import payments from './modules/payments'
import helps from "@/store/modules/helps.js";
import results from "@/store/modules/results.js";

export const store = createStore({
  modules: {
    profile,
    places,
    lottery,
    games,
    payments,
    helps,
    results
  },
})
