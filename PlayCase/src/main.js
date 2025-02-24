import './assets/base.css'

import { createApp } from 'vue'

import { store } from '@/store/index.js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/service-worker.js')
//         .then((registration) => {
//         })
//         .catch((error) => {
//         });
//     });
//   }

app.use(router)
app.use(store)
app.mount('#app')
