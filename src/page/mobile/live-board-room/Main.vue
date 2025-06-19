<template>
  <div class="live-board-room-wrapper">
    <div class="box">
      <div>게임 중계</div>
      <div>
        <button @click="toggleLiveBoardText">
          문자 중계 박스를 위로 올리는 버튼
        </button>
      </div>
    </div>

    <!-- 채팅방은 항상 고정 -->
    <div class="box chat-message-wrapper">
      <ChatMessage
        v-for="(msg, index) in chatMessages"
        :key="index"
        :message="msg"
      />
    </div>

    <!-- 문자 중계만 슬라이드 애니메이션 -->
    <transition name="slide-up">
      <div class="live-board-text" v-if="isLiveBoardTextVisible">
        <div>문자 중계</div>
        <div>이 녀석이 채팅방 영역을 대체해서 올라올 거</div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.live-board-room-wrapper {
  height: 100%;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  position: relative;
}

.live-board-room-wrapper .box {
  border: 1px solid black;
  flex: 1;
}

.live-board-room-wrapper .box:first-child {
  flex: 1; /* 상단 박스 */
}

.live-board-room-wrapper .box:last-child {
  flex: 1; /* 하단 박스 (채팅방) - 상단과 동일한 크기 */
}

.chat-message-wrapper {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.live-board-text {
  background-color: #f9f9f9; /* 배경색이 있어야 채팅방 가릴 수 있음 주의 */
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%; /* 채팅방과 같은 크기 */
  z-index: 10;
  padding: 10px;
}

/* 문자 중계 슬라이드 애니메이션 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease-in-out;
}

/* 나타날 때: 아래에서 위로 */
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to {
  transform: translateY(0);
  opacity: 1;
}

/* 사라질 때: 위에서 아래로 */
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import ChatMessage from "@/components/shard/ChatMessage.vue";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const route = useRoute();
const roomId = route.params.roomId;

console.log("현재 룸 ID:", roomId);

const isLiveBoardTextVisible = ref(false);

const toggleLiveBoardText = () => {
  isLiveBoardTextVisible.value = !isLiveBoardTextVisible.value;
};

// TODO BaseURL 환경 별로 분리 필요
// 웹소켓 연결
const connectWebSocket = () => {
  const client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    connectHeaders: {},
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    debug: function (str) {
      console.log("STOMP: " + str);
    },
  });

  client.onConnect = function (frame) {
    console.log("웹소켓 연결 성공:", frame);

    // 채팅방 구독, 현재는 유저 수도 여기서 다 들어 오는듯?
    // TODO 채팅방 메세지가 전부 이리로 들어와서 진행 불가능
    client.subscribe(
      `/server/liveboard/room/ROOM_${roomId}`,
      function (message) {
        // 여기서 채팅 메시지를 처리
        console.log("메시지 원본:", message);
        console.log("메시지 헤더:", message.headers);
        const data = JSON.parse(message.body);
        console.log("메시지 바디:", data);
      }
    );
    sendEnterMessage(client);
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

  console.log("입장 메세지 전송:", message);
};

connectWebSocket();

const chatMessages = ref([
  {
    content: "안녕하세요! 경기 잘 보고 있어요",
    timestamp: "10분 전",
    nickname: "⚾ 야구팬",
    isMyMessage: false,
  },
  {
    content: "오늘 날씨도 좋고 경기하기 딱 좋네요",
    timestamp: "9분 전",
    nickname: "🌤️ 맑음이",
    isMyMessage: false,
  },
  {
    content: "김도영 선수 타석에 들어서네요!",
    timestamp: "8분 전",
    nickname: "📺 중계봇",
    isMyMessage: false,
  },
  {
    content: "도영이 화이팅!! 홈런 기대해요",
    timestamp: "7분 전",
    nickname: "⚾ 도니살",
    isMyMessage: true,
  },
  {
    content: "와 진짜 멋있다 ㅠㅠ",
    timestamp: "6분 전",
    nickname: "💝 팬심폭발",
    isMyMessage: false,
  },
  {
    content: "오늘 컨디션 좋아보이는데?",
    timestamp: "5분 전",
    nickname: "👀 관찰자",
    isMyMessage: false,
  },
  {
    content: "저기 외야 끝까지 날아갈 것 같은데요",
    timestamp: "4분 전",
    nickname: "⚾ 나",
    isMyMessage: true,
  },
  {
    content: "볼카운트 2-1이네요",
    timestamp: "3분 전",
    nickname: "📊 야구통계",
    isMyMessage: false,
  },
  {
    content: "다음 구가 승부처인 것 같아요",
    timestamp: "2분 전",
    nickname: "🎯 예측맨",
    isMyMessage: false,
  },
  {
    content: "홈런!!!!! 김도영 홈런!!!!!",
    timestamp: "방금 전",
    nickname: "⚾ 나",
    isMyMessage: true,
  },
]);
</script>
