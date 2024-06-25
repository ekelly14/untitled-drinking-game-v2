import { createApp } from 'vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import router from './router/index.js'
import './style.css'
import App from './App.vue'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router)

app.mount('#app')
