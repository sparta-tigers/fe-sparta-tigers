<script setup>
import hhSymbol from "@/assets/images/hh_symbol.png";
import htSymbol from "@/assets/images/ht_symbol.png";
import ktSymbol from "@/assets/images/kt_symbol.png";
import lgSymbol from "@/assets/images/lg_symbol.png";
import ltSymbol from "@/assets/images/lt_symbol.png";
import ncSymbol from "@/assets/images/nc_symbol.png";
import obSymbol from "@/assets/images/ob_symbol.png";
import skSymbol from "@/assets/images/sk_symbol.png";
import ssSymbol from "@/assets/images/ss_symbol.png";
import woSymbol from "@/assets/images/wo_symbol.png";

import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import ChatMessage from "@/components/shard/ChatMessage.vue";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {useUserStore} from "@/store/useUserStore.js";
import instance from "@/axios.js";

const store = useUserStore();
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;
const HTTP_BASE_URL = import.meta.env.VITE_HTTP_BASE_URL;

const fetchUser = async () => {
  await store.getUser();
};
const route = useRoute();
const roomId = route.params.roomId;
const message = ref("");
const chatMessageWrapper = ref(null);
const chatMessages = ref([]);
const activeTab = ref('chat');
const activeInning = ref('1');

// 게임 데이터
const matchData = ref({
  matchId: null,
  players: [],
  matchScore: {
    strike: 0,
    ball: 0,
    out: 0,
    homeScore: 0,
    awayScore: 0,
    pitcherCount: 0
  },
  inningTexts: {
    inningOneTexts: [],
    inningTwoTexts: [],
    inningThreeTexts: [],
    inningFourTexts: [],
    inningFiveTexts: [],
    inningSixTexts: [],
    inningSevenTexts: [],
    inningEightTexts: [],
    inningNineTexts: [],
    inningExtraTexts: []
  },
  currentInning: '1회 초'
});

// 팀 관련 데이터
const teamData = ref({
  "matchId": 363,
  "awayName": "SSG",
  "homeName": "LG",
  "matchTime": "2025-06-12 18:30:00.000000",
  "stadium": "잠실"
})

// 포지션별 선수 매핑
const getPlayerByRole = (role) => {
  return matchData.value.players.find(player => player.role === role)?.name || '';
};

// 웹소켓 연결
const connectWebSocket = () => {
  const token = sessionStorage.getItem('jwt_token');
  let client = null;
  if (token) {
    client = new Client({
      brokerURL: `${WS_BASE_URL}/ws`,
      connectHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
      },
      webSocketFactory: () => new SockJS(`${HTTP_BASE_URL}/ws`),
    });
  } else {
    client = new Client({
      brokerURL: `${WS_BASE_URL}/ws`,
      connectHeaders: {},
      webSocketFactory: () => new SockJS(`${HTTP_BASE_URL}/ws`),
      debug: function (str) {
        console.log("STOMP: " + str);
      },
    });
  }

  client.onConnect = function (frame) {
    console.log("웹소켓 연결 성공:", frame);
    // 여기에 모든 데이터가 들어오기 때문에 채팅 메시지 처리 로직 여기에 작성
    client.subscribe(
        `/server/liveboard/room/ROOM_${roomId}`,
        function (message) {
          // 여기서 채팅 메시지를 처리
          const data = JSON.parse(message.body);
          console.log(data);

          if (data.messageType === "CHAT") {
            chatMessages.value.push({
              content: data.content,
              sentAt: data.sentAt,
              senderNickName: data.senderNickName,
              isMyMessage: store.user ? store.user.id === data.senderId : false
            });

            // 채팅 메시지 추가 후 스크롤 맨 아래로 이동
            setTimeout(() => {
              if (chatMessageWrapper.value) {
                chatMessageWrapper.value.scrollTop =
                    chatMessageWrapper.value.scrollHeight;

                const lastMessage = chatMessageWrapper.value.lastElementChild;
                if (lastMessage) {
                  lastMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                  });
                }
              }
            }, 50);
          }
        }
    );
    sendEnterMessage(client);

    client.subscribe(`/server/liveboard/room/${roomId}/game`, function (message) {
      const data = JSON.parse(message.body);
      console.log(data);

      // 게임 데이터 업데이트
      if (data.matchId && data.players && data.matchScore) {
        matchData.value = {
          matchId: data.matchId,
          players: data.players,
          matchScore: data.matchScore,
          inningTexts: data.inningTexts || matchData.value.inningTexts,
          currentInning: data.currentInning
        };
      }
    });
  };

  client.onStompError = function (frame) {
    console.error("STOMP 에러:", frame.headers["message"]);
    console.error("상세 내용:", frame.body);
  };

  client.onWebSocketError = function (event) {
    console.error("웹소켓 에러:", event);
  };

  client.onWebSocketClose = function (event) {
    console.log("웹소켓 연결 종료:", event);
  };

  // 연결 활성화
  client.activate();

  return client;
};

const sendEnterMessage = (client) => {
  const message = {
    roomId: `ROOM_${roomId}`,
    content: "입장",
  };

  client.publish({
    destination: `/client/liveboard/enter`,
    body: JSON.stringify(message),
  });
};

const client = connectWebSocket();

const sendMessage = () => {
  if (!client) {
    alert('서버와 연결에 문제가 있습니다! 네트워크 환경을 확인 해주세요!')
    return;
  }

  if (!store.user) {
    alert("로그인 후 이용해주세요.");
    return;
  }

  console.log(store.user);


  if (message.value.trim()) {
    client.publish({
      destination: `/client/liveboard/message`,
      body: JSON.stringify({
        roomId: `ROOM_${roomId}`,
        senderId: store.user.id,
        content: message.value,
        senderNickName: store.user.nickname,
        messageType: "CHAT",
        sentAt: new Date()
      }),
    });

    message.value = "";

    // 메시지 전송 후 스크롤 맨 아래로 이동
    setTimeout(() => {
      if (chatMessageWrapper.value) {
        chatMessageWrapper.value.scrollTop =
            chatMessageWrapper.value.scrollHeight;
      }
    }, 100);
  }
};

const disconnectWebSocket = () => {
  if (client.value) {
    client.value.deactivate();
    client.value = null;
  }
}

const getTeamSymbol = (teamName) => {
  console.log(teamName);

  const symbolMap = {
    '키움': woSymbol,
    'KT': ktSymbol,
    'LG': lgSymbol,
    '삼성': ssSymbol,
    'NC': ncSymbol,
    '한화': hhSymbol,
    '두산': obSymbol,
    '롯데': ltSymbol,
    'SSG': skSymbol,
    'KIA': htSymbol,
  };

  return symbolMap[teamName] || null;
}

const homeTeamSymbol = computed(() => getTeamSymbol(teamData.value.homeName));
const awayTeamSymbol = computed(() => getTeamSymbol(teamData.value.awayName));

onMounted(async () => {
  await fetchUser();
  const res = await instance.get(`/alarms/matches/${roomId}`);
  console.log(res.data.data);
  teamData.value = res.data.data;
  console.log(teamData);
});

onUnmounted(() => {
  disconnectWebSocket();
})


</script>

<template>
  <div class="live-board-room-wrapper">
    <div class="live-board">

      <div class="live-board-container">
        <div class="score-board">
          <div class="team-wrapper">

            <div class="team home-team">
              <div class="symbol-wrapper">
                <img :src="homeTeamSymbol" alt="팀 심볼"/>
              </div>
              <div class="score home">{{ matchData.matchScore.homeScore }}</div>
            </div>
            <div class="team away-team">
              <div class="symbol-wrapper">
                <img :src="awayTeamSymbol" alt="팀 심볼"/>
              </div>
              <div class="score away">{{ matchData.matchScore.awayScore }}</div>
            </div>
          </div>

          <div class="game-info">
            <div class="base-wrapper">
              <div class="current-game">{{ matchData.currentInning }}</div>

              <div class="bases">
                <div :class="{ active: getPlayerByRole('typing1') }" class="base-one base-indicator"></div>
                <div :class="{ active: getPlayerByRole('typing2') }" class="base-two base-indicator"></div>
                <div :class="{ active: getPlayerByRole('typing3') }" class="base-three base-indicator"></div>
              </div>
            </div>

            <div class="score-wrapper">
              <div class="ball-wrapper">
                <div class="text">B</div>
                <div :class="{ 'active-ball': matchData.matchScore.ball >= 1 }" class="circle"></div>
                <div :class="{ 'active-ball': matchData.matchScore.ball >= 2 }" class="circle"></div>
                <div :class="{ 'active-ball': matchData.matchScore.ball >= 3 }" class="circle"></div>
              </div>
              <div class="strike-wrapper">
                <div class="text">S</div>
                <div :class="{ 'active-strike': matchData.matchScore.strike >= 1 }" class="circle"></div>
                <div :class="{ 'active-strike': matchData.matchScore.strike >= 2 }" class="circle"></div>
              </div>
              <div class="out-wrapper">
                <div class="text">O</div>
                <div :class="{ 'active-out': matchData.matchScore.out >= 1 }" class="circle"></div>
                <div :class="{ 'active-out': matchData.matchScore.out >= 2 }" class="circle"></div>
              </div>
            </div>
          </div>

          <div class="divider"></div>


          <div class="pitcher-box">
            <div>{{ getPlayerByRole('pitcher') || '투수' }}</div>
            <div>투구수 <span class="ball-count">{{ matchData.matchScore.pitcherCount }}</span></div>
          </div>
        </div>

        <div class="player-position base-1 green">{{ getPlayerByRole('firBase') || '1루수' }}</div>
        <div class="player-position base-2 green">{{ getPlayerByRole('secondBase') || '2루수' }}</div>
        <div class="player-position base-3 green">{{ getPlayerByRole('thirdBase') || '3루수' }}</div>
        <!--    Player typing 개수 보고 주자 베이스 만들기   -->
        <div class="base-runner first-base red-inset">{{ getPlayerByRole('typing1') || '1루 주자' }}</div>
        <div class="base-runner second-base red-inset">{{ getPlayerByRole('typing2') || '2루 주자' }}</div>
        <div class="base-runner third-base red-inset">{{ getPlayerByRole('typing3') || '3루 주자' }}</div>
        <div class="player-position shortstop green">{{ getPlayerByRole('shortstop') || '유격수' }}</div>
        <div class="player-position left-field green">{{ getPlayerByRole('leftFielder') || '좌익수' }}</div>
        <div class="player-position center-field green">{{ getPlayerByRole('centerFielder') || '중견수' }}</div>
        <div class="player-position right-field green">{{ getPlayerByRole('rightFielder') || '우익수' }}</div>
        <div class="player-position pitcher green">{{ getPlayerByRole('pitcher') || '투수' }}</div>
        <div class="player-position batter red">
          {{ getPlayerByRole('supervision') || getPlayerByRole('supervision2') || '타자' }}
        </div>
        <div class="player-position catcher green">{{ getPlayerByRole('catcher') || '포수' }}</div>
      </div>
    </div>

    <!-- 탭 버튼들 -->
    <div class="tab-buttons">
      <button :class="{ active: activeTab === 'chat' }" @click="activeTab = 'chat'">채팅</button>
      <button :class="{ active: activeTab === 'live' }" @click="activeTab = 'live'">문자 중계</button>
    </div>

    <!-- 채팅방 -->
    <div v-if="activeTab === 'chat'" class="live-board chat-container">
      <div ref="chatMessageWrapper" class="chat-message-wrapper">
        <ChatMessage
            v-for="(msg, index) in chatMessages"
            :key="index"
            :message="msg"
        />
      </div>

      <div class="chat-message-input-container">
        <input
            v-model="message"
            class="chat-message-input"
            placeholder="메시지를 입력하세요..."
            type="text"
            @keyup.enter="sendMessage"
        />
        <button @click="sendMessage">메시지 전송</button>
      </div>
    </div>

    <!-- 문자 중계 -->
    <div v-if="activeTab === 'live'" class="live-board live-text-container">
      <!-- 이닝 탭 버튼들 -->
      <div class="inning-tabs">
        <button :class="{ active: activeInning === '1' }" @click="activeInning = '1'">1회</button>
        <button :class="{ active: activeInning === '2' }" @click="activeInning = '2'">2회</button>
        <button :class="{ active: activeInning === '3' }" @click="activeInning = '3'">3회</button>
        <button :class="{ active: activeInning === '4' }" @click="activeInning = '4'">4회</button>
        <button :class="{ active: activeInning === '5' }" @click="activeInning = '5'">5회</button>
        <button :class="{ active: activeInning === '6' }" @click="activeInning = '6'">6회</button>
        <button :class="{ active: activeInning === '7' }" @click="activeInning = '7'">7회</button>
        <button :class="{ active: activeInning === '8' }" @click="activeInning = '8'">8회</button>
        <button :class="{ active: activeInning === '9' }" @click="activeInning = '9'">9회</button>
        <button :class="{ active: activeInning === 'extra' }" @click="activeInning = 'extra'">연장</button>
      </div>

      <!-- 이닝별 중계 내용 -->
      <div class="live-text-wrapper">
        <div v-if="activeInning === '1'" class="inning-content">
          <div
              v-for="(text, index) in matchData.inningTexts.inningOneTexts"
              :key="index"
              class="live-text-item"
          >
            {{ text }}
          </div>
        </div>
        <div v-if="activeInning === '2'" class="inning-content">
          <div
              v-for="(text, index) in matchData.inningTexts.inningTwoTexts"
              :key="index"
              class="live-text-item"
          >
            {{ text }}
          </div>
        </div>
        <div v-if="activeInning === '3'" class="inning-content">
          <div
              v-for="(text, index) in matchData.inningTexts.inningThreeTexts"
              :key="index"
              class="live-text-item"
          >
            {{ text }}
          </div>
        </div>
        <div v-if="activeInning === '4'" class="inning-content">
          <div
              v-for="(text, index) in matchData.inningTexts.inningFourTexts"
              :key="index"
              class="live-text-item"
          >
            {{ text }}
          </div>
        </div>
        <div v-if="activeInning === '5'" class="inning-content">
          <div
              v-for="(text, index) in matchData.inningTexts.inningFiveTexts"
              :key="index"
              class="live-text-item"
          >
            {{ text }}
          </div>
        </div>
        <div v-if="activeInning === '6'" class="inning-content">
          <div
              v-for="(text, index) in matchData.inningTexts.inningSixTexts"
              :key="index"
              class="live-text-item"
          >
            {{ text }}
          </div>
        </div>
        <div v-if="activeInning === '7'" class="inning-content">
          <div
              v-for="(text, index) in matchData.inningTexts.inningSevenTexts"
              :key="index"
              class="live-text-item"
          >
            {{ text }}
          </div>
        </div>
        <div v-if="activeInning === '8'" class="inning-content">
          <div
              v-for="(text, index) in matchData.inningTexts.inningEightTexts"
              :key="index"
              class="live-text-item"
          >
            {{ text }}
          </div>
        </div>
        <div v-if="activeInning === '9'" class="inning-content">
          <div
              v-for="(text, index) in matchData.inningTexts.inningNineTexts"
              :key="index"
              class="live-text-item"
          >
            {{ text }}
          </div>
        </div>
        <div v-if="activeInning === 'extra'" class="inning-content">
          <div
              v-for="(text, index) in matchData.inningTexts.inningExtraTexts"
              :key="index"
              class="live-text-item"
          >
            {{ text }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.live-board-room-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.live-board-room-wrapper .live-board {
  height: 280px;
}

/* 경기 현황 판 */
.live-board-container {
  background-image: url("../../../assets/images/ground.png");
  background-size: cover;
  background-position: center bottom;
  background-repeat: no-repeat;
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  height: 100%;
}

.live-board-container > .green {
  background-color: #1E4028EB;
  color: white;
}

.live-board-container > .red {
  background-color: #8A0808;
  color: white;
}

.live-board-container > .red-inset {
  background-color: white;
  color: #8A0808;
}

/* 베이스 */
.base-1 {
  right: 12%;
  bottom: 47%;
}

.base-2 {
  left: 65%;
  bottom: 60%;
}

.base-3 {
  left: 35%;
  bottom: 47%;
}

/* 1루 주자 */
.first-base {
  right: 10%;
  bottom: 58%;
}

.second-base {
  left: 56%;
  bottom: 70%;
}

.third-base {
  left: 33%;
  bottom: 57%;
}

/* 유격수 */
.shortstop {
  left: 42%;
  bottom: 68%;
}

/* 좌익수 */
.left-field {
  left: 25%;
  bottom: 80%;
}

/* 중견수 */
.center-field {
  left: 55%;
  bottom: 85%;
}

/* 우익수 */
.right-field {
  right: 10%;
  bottom: 80%;
}

/* 투수 */
.pitcher {
  left: 55%;
  bottom: 50%;
}

/* 타자 */
.batter {
  left: 50%;
  bottom: 20%;
}

/* 포수 */
.catcher {
  left: 55%;
  bottom: 5%;
}

/* 공통 스타일 */
.player-position, .base-runner {
  position: absolute;
  padding: 4px 8px;
  background-color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  transform: translate(-50%, -50%);
}

/* 점수판 */
.score-board {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.38);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  font-weight: bold;
  font-size: 14px;
}

.score-board .team-wrapper {
  display: flex;
  flex-direction: column;
}

.team {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.team .score {
  color: white;
}

/* base */
.base-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.current-game {
  font-size: 16px;
  color: #f8b313;
}

.bases {
  position: relative;
  height: 60px;
}

.base-indicator {
  position: absolute;
  width: 12px;
  height: 12px;
  transform: rotate(-45deg);
  background-color: #4E4E4ED9; /* 주자 있을 경우 색상 #F7F7F7D9 */
}

.bases {
  width: 50px;
  height: 50px;
}

.bases .base-one {
  top: 23px;
  right: 8px;
}

.bases .base-two {
  top: 8px;
  right: 18px;
}

.bases .base-three {
  top: 23px;
  left: 8px;
}

.base-indicator.active {
  background-color: #f7f7f7;
}


.team .symbol-wrapper img {
  width: 25px;
  height: 25px;
}

.team .score {
  font-size: 16px;
}

.score-wrapper {
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  margin: 4px 0;
  padding: 6px 0;
  gap: 2px;
}

.score-wrapper .text {
  color: white;
  margin-right: 4px;
  width: 8px;
  height: 16px;
}

.ball-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.strike-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.out-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.circle {
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.circle.active-ball {
  background-color: #048328;
}

.circle.active-strike {
  background-color: #f8b313;
}

.circle.active-out {
  background-color: #d10000;
}

.pitcher-box {
  margin-top: 8px;
}

.pitcher-box div {
  color: white;
  text-align: center;
}

.pitcher-box .ball-count {
  color: #F8B313;
}

.live-board-room-wrapper .live-board.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.live-board.chat-container .chat-message-wrapper {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.live-board.chat-container .chat-message-wrapper .toggle-btn-wrapper {
  background-color: transparent;

}

/* 스크롤바 숨기기 */
.live-board.chat-container .chat-message-wrapper::-webkit-scrollbar {
  display: none;
}

.chat-message-input-container {
  position: sticky;
  bottom: 0;
  background-color: white;
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.chat-message-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
}

.chat-message-input:focus {
  border-color: #659287;
}

.chat-message-input-container button {
  padding: 12px 16px;
  background-color: #659287;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.chat-message-input-container button:hover {
  background-color: #5a8278;
  transform: translateY(-1px);
}

/* 탭 버튼 스타일 */
.tab-buttons {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.tab-buttons button {
  flex: 1;
  padding: 16px;
  background-color: #f8f9fa;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-buttons button.active {
  background-color: white;
  border-bottom-color: #659287;
  color: #659287;
}

.tab-buttons button:hover {
  background-color: #e9ecef;
}

/* 문자 중계 스타일 */
.live-text-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.live-text-wrapper {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.live-text-wrapper::-webkit-scrollbar {
  display: none;
}

.live-text-item {
  padding: 4px;
  font-size: 14px;
}

/* 이닝 탭 스타일 */
.inning-tabs {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.inning-tabs::-webkit-scrollbar {
  display: none;
}

.inning-tabs button {
  flex: 1;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 50px;
}

.inning-tabs button.active {
  background: #393939;
  color: white;
}

.inning-tabs button:hover {
  background: #393939;
  color: white;
}

.inning-content {
  background-color: #FAF6E9;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


