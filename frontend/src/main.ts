import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia()) // если используешь Pinia, иначе эту строку можно убрать
app.use(router)

app.mount('#app')