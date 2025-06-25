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
    <div class="box chat-container">
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
        <button @click="sendMessage">전송</button>
      </div>
    </div>

    <!-- 문자 중계만 슬라이드 애니메이션 -->
    <transition name="slide-up">
      <div v-if="isLiveBoardTextVisible" class="live-board-text">
        <div>문자 중계</div>
        <div>이 녀석이 채팅방 영역을 대체해서 올라올 거</div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.live-board-room-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.live-board-room-wrapper .box {
  flex: 1;
}

.live-board-room-wrapper .box.chat-container {
  display: flex;
  flex-direction: column;
  height: 100px; /* 채팅방 영역 크기 여기를 줘야만 반반이 되는데 일단 왜 되는지 모르겠음 더이상 수정하면 사고임 기준 높이가 생겨서 라고함 */
}

.box.chat-container .chat-message-wrapper {
  border: 1px solid black;
  flex: 1;
  overflow-y: auto;
  padding: 10px;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* 스크롤바 숨기기 */
.box.chat-container .chat-message-wrapper::-webkit-scrollbar {
  display: none;
}

.chat-message-input-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px;
  border-top: 1px solid #f9f9f9;
}

.chat-message-input {
  flex: 1;
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
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import ChatMessage from "@/components/shard/ChatMessage.vue";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {useUserStore} from "@/store/useUserStore.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'localhost:8080';
const store = useUserStore();

const fetchUser = async () => {
  await store.getUser();
};

onMounted(fetchUser);

const route = useRoute();
const roomId = route.params.roomId;
const isLiveBoardTextVisible = ref(false);
const message = ref("");
const chatMessageWrapper = ref(null);

const toggleLiveBoardText = () => {
  isLiveBoardTextVisible.value = !isLiveBoardTextVisible.value;
};

// TODO BaseURL 환경 별로 분리 필요
// 웹소켓 연결
const connectWebSocket = () => {
  const client = new Client({
    brokerURL: `ws://${API_BASE_URL}/ws`,
    connectHeaders: {},
    webSocketFactory: () => new SockJS(`http://${API_BASE_URL}/ws`),
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

  console.log("입장 메세지 전송:", message);
};

const client = connectWebSocket();

const sendMessage = () => {
  if (!client) {
    console.error("웹소켓 연결이 안되어 있습니다.");
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

    // 메시지 전송 후 스크롤 맨 아래로 이동 (약간의 딜레이로 확실하게)
    setTimeout(() => {
      if (chatMessageWrapper.value) {
        chatMessageWrapper.value.scrollTop =
            chatMessageWrapper.value.scrollHeight;
      }
    }, 100);
  }
};

const chatMessages = ref([]);
</script>
