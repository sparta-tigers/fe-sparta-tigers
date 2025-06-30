<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import ChatMessage from "@/components/shard/ChatMessage.vue";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {useUserStore} from "@/store/useUserStore.js";

const baseURL = import.meta.env.VITE_VITE_HTTP_BASE_URL;
const wsBaseURL = import.meta.env.VITE_VITE_WS_BASE_URL;
const store = useUserStore();

const fetchUser = async () => {
  await store.getUser();
};
const route = useRoute();
const roomId = route.params.roomId;
const isLiveBoardTextVisible = ref(false);
const message = ref("");
const chatMessageWrapper = ref(null);
const chatMessages = ref([]);

const toggleLiveBoardText = () => {
  isLiveBoardTextVisible.value = !isLiveBoardTextVisible.value;
};

// 웹소켓 연결
const connectWebSocket = () => {
  const client = new Client({
    brokerURL: `${wsBaseURL}/ws`,
    connectHeaders: {},
    webSocketFactory: () => new SockJS(`${baseURL}/ws`),
    debug: function (str) {
      console.log("STOMP: " + str);
    },
  });

  client.onConnect = function (frame) {
    console.log("웹소켓 연결 성공:", frame);
    // 여기에 모든 데이터가 들어오기 때문에 채팅 메시지 처리 로직 여기에 작성
    client.subscribe(
        `/server/liveboard/room/ROOM_${roomId}`,
        function (message) {
          // 여기서 채팅 메시지를 처리
          const data = JSON.parse(message.body);

          if (data.messageType === "CHAT") {
            chatMessages.value.push({
              content: data.content,
              sentAt: data.sentAt,
              senderNickName: data.senderNickName,
              isMyMessage: store.user.id === data.senderId,
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

  if (message.value.trim()) {
    client.publish({
      destination: `/client/liveboard/message`,
      body: JSON.stringify({
        roomId: `ROOM_${roomId}`,
        content: message.value,
        senderNickName: "test",
        messageType: "CHAT",
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

onMounted(fetchUser);

</script>

<template>
  <div class="live-board-room-wrapper">
    <div class="live-board">
      <div class="live-board-container">
        <div class="base-1">1루</div>
        <div class="base-2">2루</div>
        <div class="base-3">3루</div>
        <div class="first-base">1루수</div>
        <div class="second-base">2루수</div>
        <div class="third-base">3루수</div>
        <div class="shortstop">유격수</div>
        <div class="left-field">좌익수</div>
        <div class="center-field">중견수</div>
        <div class="right-field">우익수</div>
        <div class="pitcher">투수</div>
        <div class="batter">타자</div>
        <div class="catcher">포수</div>
      </div>
    </div>

    <!-- 채팅방은 항상 고정 -->
    <div class="live-board chat-container">
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

  </div>
</template>

<style scoped>
.live-board-room-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.live-board-room-wrapper .live-board {
  height: 220px;
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

.live-board-container > div {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  transform: translate(-50%, -50%);
}

/* 베이스 */
.base-1 {
  right: 10%;
  bottom: 50%;
}

.base-2 {
  left: 55%;
  bottom: 70%;
}

.base-3 {
  left: 35%;
  bottom: 45%;
}

/* 내야수 */
.first-base {
  right: 10%;
  bottom: 60%;
}

.second-base {
  left: 65%;
  bottom: 62%;
}

.third-base {
  left: 35%;
  bottom: 55%;
}

/* 유격수 */
.shortstop {
  left: 45%;
  bottom: 60%;
}

/* 좌익수 */
.left-field {
  left: 30%;
  bottom: 75%;
}

/* 중견수 */
.center-field {
  left: 50%;
  bottom: 85%;
}

/* 우익수 */
.right-field {
  right: 15%;
  bottom: 75%;
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
</style>


