import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/page/MainPage.vue";
import liveMain from "@/page/mobile/live-board/Main.vue";
import recordMain from "@/page/mobile/record/Main.vue";
import exchangeMain from "@/page/mobile/exchange/Main.vue"
import alarmMain from "@/page/mobile/alarm/Main.vue"
import stadiumInfoMain from "@/page/mobile/stadium-info/Main.vue"


const routes = [
    {
        path: '/liveboard',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'liveboard-main',
                component: liveMain
            }
        ]
    },
    {
        path: '/record',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'record-main',
                component: recordMain
            }
        ]
    },
    {
        path: '/exchange',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'exchange-main',
                component: exchangeMain
            }
        ]
    },
    {
        path: '/alarm',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'alarm-main',
                component: alarmMain
            }
        ]
    },
    {
        path: '/stadiuminfo',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'stadium-main',
                component: stadiumInfoMain
            }
        ]
    }
]




const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
