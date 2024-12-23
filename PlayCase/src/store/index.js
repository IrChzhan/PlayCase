import { createStore } from 'vuex'

import places from './modules/places.js'
import profile from './modules/profile.js'
import games from './modules/games'
import lottery from './modules/lottery.js'

export const store = createStore({
    modules: {
        profile,
        places,
        lottery,
        games
    },
})