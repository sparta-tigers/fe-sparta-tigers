import {createRouter, createWebHistory} from "vue-router";
import MainPage from "@/page/MainPage.vue";
import LiveBoardMatch from "@/page/mobile/live-board-match/Main.vue";
import LiveBoardRoom from "@/page/mobile/live-board-room/Main.vue";
import recordMain from "@/page/mobile/record/Main.vue";
import exchangeMain from "@/page/mobile/exchange/Main.vue";
import alarmMain from "@/page/mobile/alarm/Main.vue";
import AlarmTeams from "@/page/mobile/alarm/Teams.vue";
import AlarmSchedule from "@/page/mobile/alarm/Schedule.vue";
import MatchReservation from "@/page/mobile/alarm/MatchReservation.vue";
import stadiumInfoMain from "@/page/mobile/stadium-info/Main.vue";
import Login from "@/page/mobile/user/Login.vue";
import OAuth2Redirect from "@/page/mobile/util/OAuth2Redirect.vue";
import MyPage from "@/page/mobile/user/MyPage.vue";
import RecordWrite from "@/page/mobile/record/Write.vue";
import RecordTeams from "@/page/mobile/record/Teams.vue";
import RecordSchedule from "@/page/mobile/record/Schedule.vue";
import RecordDetails from "@/page/mobile/record/Details.vue";
import Chatroom from "@/page/mobile/exchange/Chatroom.vue";
import ChatRooms from "@/page/mobile/exchange/ChatRooms.vue";
import CreateExchange from "@/page/mobile/exchange/CreateExchange.vue";
import ExchangeRequestList from "@/page/mobile/exchange/ExchangeRequestList.vue";

const routes = [
    {
        path: '/',
        redirect: '/liveboard/match'
    },
    {
        path: '/liveboard',
        component: MainPage,
        children: [
            {
                path: 'match',
                name: 'liveboard-match',
                component: LiveBoardMatch,
                meta: { title: '라이브보드' }
            },
            {
                path: 'match/room/:roomId',
                name: 'liveboard-room',
                component: LiveBoardRoom,
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
                meta: { requiresAuth: true, title: '기록' }
            },
            {
                path: 'write',
                name: 'record-write',
                component: RecordWrite,
                meta: { requiresAuth: true, title: '기록' }
            },
            {
                path: 'details/:id',
                name : 'record-details',
                component: RecordDetails,
                meta : { requiresAuth: true, title: '기록'}
            }
        ]
    },
    {
        path: '/record/teams',
        name: 'record-teams',
        component: RecordTeams,
        meta: { requiresAuth: true, title: '기록' }
    },
    {
        path: '/record/teams/:teamId/schedule',
        name: 'record-schedule',
        component: RecordSchedule,
        meta: { requiresAuth: true, title: '기록' }
    },
    {
        path: '/exchange',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'exchange-main',
                component: exchangeMain,
                meta: { requiresAuth:true, title: '교환' }
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
                meta: { requiresAuth: true, title: '알람' }
            },
            {
                path: 'teams',
                name: 'Teams',
                component: AlarmTeams,
                meta: { requiresAuth: true, title: '알람' }
            },
            {
                path: 'teams/:teamId/schedule',
                name: 'alarm-schedule',
                component: AlarmSchedule,
                meta: { requiresAuth: true, title: '알람' }
            },
            {
                path: 'teams/:teamId/reservation/:matchId',
                name: 'MatchReservation',
                component: MatchReservation,
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
        path: '/oauth2/redirect',
        name: 'OauthRedirect',
        component: OAuth2Redirect
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem("jwt_token");
    if (to.meta.requiresAuth && !isLoggedIn) {
        next("/login");
    } else {
        next();
    }
});

export default router;
