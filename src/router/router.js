import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/page/MainPage.vue";
import liveMain from "@/page/mobile/live-board/Main.vue";
import recordMain from "@/page/mobile/record/Main.vue";
import exchangeMain from "@/page/mobile/exchange/Main.vue"
import alarmMain from "@/page/mobile/alarm/Main.vue"
import stadiumInfoMain from "@/page/mobile/stadium-info/Main.vue"
import Login from "@/page/mobile/user/Login.vue";
import OAuth2Redirect from "@/page/mobile/util/OAuth2Redirect.vue";
import MyPage from "@/page/mobile/user/MyPage.vue";
import Channel from "@/page/mobile/user/Channel.vue";
import Teams from "@/page/mobile/alarm/Teams.vue";
import Schedule from "@/page/mobile/alarm/Schedule.vue";


const routes = [
    {
        path: '/',
        redirect: '/liveboard'
    },
    {

        path: '/liveboard',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'liveboard-main',
                component: liveMain,
                meta: { title: '라이브보드' }
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
                component: recordMain,
                meta: { title: '기록' }

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
                component: exchangeMain,
                meta: { title: '교환' }
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
                component: alarmMain,
                meta: { title: '알람' }
            },
            {
                path: 'teams',
                name: 'Teams',
                component: Teams,
                meta: { requiresAuth: true, title: '알람' },
            },
            {
                path: 'teams/:teamId/schedule',
                name: 'TeamSchedule',
                component: Schedule,
                meta: { requiresAuth: true, title: '알람' }
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
                component: stadiumInfoMain,
                meta: { title: '경기장' }
            }
        ]
    },
    {
        path: '/login',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'login',
                component: Login,
                meta: { title: '로그인' }
            }
        ]
    },
    {
        path: '/mypage',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'mypage',
                component: MyPage,
                meta: { requiresAuth: true, title: '마이페이지' }

            }

        ]
    },

    {
        path : "/oauth2/redirect",
        name: "OauthRedirect",
        component: OAuth2Redirect },
    {
        path: "/channel",
        name: "Channel",
        component: Channel,
    }
]




const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem('jwt_token')

    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/login')
    } else {
        next()  // 통과
    }
})



export default router;
