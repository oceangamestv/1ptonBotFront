import { createApp } from 'vue'
import './style.css'
import router from './plugins/router'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
