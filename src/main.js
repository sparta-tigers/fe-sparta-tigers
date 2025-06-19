import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import "@/assets/css/public/public.css";
import { createPinia } from "pinia";
import piniaPersist from 'pinia-plugin-persistedstate'

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount("#app");


const pinia = createPinia()
pinia.use(piniaPersist)
