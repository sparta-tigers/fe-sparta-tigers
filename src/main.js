import {createApp} from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import "@/assets/css/public/public.css";
import {createPinia} from "pinia";
import piniaPersist from 'pinia-plugin-persistedstate'
import {useKakao} from "vue3-kakao-maps";

// TODO 시크릿 제거 필요!
useKakao('d889c3a75f0dea9c42b0b4a914a19316');
const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount("#app");


const pinia = createPinia()
pinia.use(piniaPersist)
