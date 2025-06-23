import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/page/MainPage.vue";
import LiveBoardMatch from "@/page/mobile/live-board-match/Main.vue";
import LiveBoardRoom from "@/page/mobile/live-board-room/Main.vue";
import recordMain from "@/page/mobile/record/Main.vue";
import exchangeMain from "@/page/mobile/exchange/Main.vue";
import alarmMain from "@/page/mobile/alarm/Main.vue";
import Teams from "@/page/mobile/alarm/Teams.vue";
import Schedule from "@/page/mobile/alarm/Schedule.vue";
import MatchReservation from "@/page/mobile/alarm/MatchReservation.vue";
import stadiumInfoMain from "@/page/mobile/stadium-info/Main.vue";
import Login from "@/page/mobile/user/Login.vue";
import OAuth2Redirect from "@/page/mobile/util/OAuth2Redirect.vue";
import MyPage from "@/page/mobile/user/MyPage.vue";
import Channel from "@/page/mobile/user/Channel.vue";
import Chatroom from "@/page/mobile/exchange/Chatroom.vue";

const routes = [
  {
    path: "/",
    redirect: "/liveboard/match",
  },
  {
    path: "/liveboard",
    component: MainPage,
    children: [
      {
        path: "match",
        name: "liveboard-match",
        component: LiveBoardMatch,
        meta: { title: "라이브보드" },
      },
      {
        path: "match/room/:roomId",
        name: "liveboard-room",
        component: LiveBoardRoom,
        meta: { title: "라이브보드" },
      },
    ],
  },
  {
    path: "/record",
    component: MainPage,
    children: [
      {
        path: "",
        name: "record-main",
        component: recordMain,
        meta: { title: "기록" },
      },
    ],
  },
  {
    path: "/exchange",
    component: MainPage,
    children: [
      {
        path: "",
        name: "exchange-main",
        component: exchangeMain,
        meta: { title: "교환" },
      },
      {
        path: "chat/:roomId",
        name: "chat-room",
        component: Chatroom,
        meta: { title: "교환 1대1 채팅" },
      },
    ],
  },
  {
    path: "/alarm",
    component: MainPage,
    children: [
      {
        path: "",
        name: "alarm-main",
        component: alarmMain,
        meta: { title: "알람" },
      },
      {
        path: "teams",
        name: "Teams",
        component: Teams,
        meta: { requiresAuth: true, title: "알람" },
      },
      {
        path: "teams/:teamId/schedule",
        name: "TeamSchedule",
        component: Schedule,
        meta: { requiresAuth: true, title: "알람" },
      },
      {
        path: "teams/:teamId/reservation/:matchId",
        name: "MatchReservation",
        component: MatchReservation,
        meta: { requiresAuth: true, title: "알람" },
      },
    ],
  },
  {
    path: "/stadiuminfo",
    component: MainPage,
    children: [
      {
        path: "",
        name: "stadium-main",
        component: stadiumInfoMain,
        meta: { title: "경기장" },
      },
    ],
  },
  {
    path: "/login",
    component: MainPage,
    children: [
      {
        path: "",
        name: "login",
        component: Login,
        meta: { title: "로그인" },
      },
    ],
  },
  {
    path: "/mypage",
    component: MainPage,
    children: [
      {
        path: "",
        name: "mypage",
        component: MyPage,
        meta: { requiresAuth: true, title: "마이페이지" },
      },
    ],
  },
  {
    path: "/oauth2/redirect",
    name: "OauthRedirect",
    component: OAuth2Redirect,
  },
  {
    path: "/channel",
    name: "Channel",
    component: Channel,
  },
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
